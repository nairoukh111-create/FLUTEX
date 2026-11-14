const {test}=require('node:test');
const assert=require('node:assert/strict');
const {File}=require('node:buffer');
const fs=require('node:fs');
const {acceptedServiceReply,MAX_ATTACHMENT_BYTES}=require('../assets/js/rfq.v18.js');
const api=async()=>import('data:text/javascript;base64,'+Buffer.from(fs.readFileSync(require.resolve('../functions/api/rfq.js'),'utf8')).toString('base64'));
const worker=()=>import('../workers/rfq/service.mjs');
const env=()=>({M365_TENANT_ID:'11111111-1111-4111-8111-111111111111',
  M365_CLIENT_ID:'22222222-2222-4222-8222-222222222222',M365_CLIENT_SECRET:'fictional-test-only',
  TURNSTILE_SECRET_KEY:'fictional-test-only',RFQ_RATE_LIMITER:{limit:async()=>({success:true})}});
function form() {
  const data=new FormData();
  for(const [key,value] of Object.entries({name:'Test buyer',company:'Example workshop',email:'buyer@example.test',
    message:'طلب قطع ومقاسات',destinationCountry:'Kuwait',destinationCity:'Kuwait City',
    partNumber:'PUBLIC-REF-01',quantity:'12',website:'','cf-turnstile-response':'fictional-token'}))data.set(key,value);
  return data;
}
function request(data=form(),opts={}) {
  return new Request(opts.url||'https://flutexindustrial.com/api/rfq',{method:'POST',
    headers:{origin:'https://flutexindustrial.com','cf-connecting-ip':'192.0.2.10',...opts.headers},body:data});
}
function network(overrides={}) {
  const calls=[];
  const fetch=async(url,options)=>{
    calls.push({url,options});
    if(url.includes('siteverify'))return Response.json({success:true,hostname:'flutexindustrial.com',action:'rfq',...overrides.verification});
    if(url.includes('/token'))return overrides.tokenResponse||Response.json({access_token:'fictional-access-token'});
    if(overrides.sendThrows)throw new Error('fictional private provider error');
    return new Response(null,{status:overrides.sendStatus||202});
  };
  return {calls,fetch};
}

test('RFQ readiness stays disabled until explicitly enabled, configured and healthy',async()=>{
  const {onRequest}=await api();
  let healthCalls=0;
  const values={PUBLIC_TURNSTILE_SITE_KEY:'public-fixture',RFQ_SERVICE:{fetch:async()=>{healthCalls++;return Response.json({available:true});}}};
  const req=new Request('https://flutexindustrial.com/api/rfq');
  assert.deepEqual(await (await onRequest({request:req,env:values})).json(),{available:false,turnstileSiteKey:''});
  assert.equal(healthCalls,0);
  values.RFQ_ENABLED='true';
  assert.deepEqual(await (await onRequest({request:req,env:values})).json(),{available:true,turnstileSiteKey:'public-fixture'});
  assert.equal(healthCalls,1);
  const preview=new Request('https://example.pages.dev/api/rfq');
  assert.equal((await (await onRequest({request:preview,env:values})).json()).available,false);
  values.RFQ_SERVICE.fetch=async()=>Response.json({available:false,private:'must not forward'});
  assert.deepEqual(await (await onRequest({request:req,env:values})).json(),{available:false,turnstileSiteKey:''});
  values.RFQ_SERVICE.fetch=async()=>{throw Error('private');};
  assert.equal((await onRequest({request:req,env:values})).status,200);
});

test('worker health never calls Microsoft or returns credentials',async()=>{
  const {createService}=await worker(), n=network(), service=createService(n.fetch);
  assert.deepEqual(await (await service.fetch(new Request('https://rfq.internal/health'),{})).json(),{available:false});
  assert.deepEqual(await (await service.fetch(new Request('https://rfq.internal/health'),env())).json(),{available:true});
  assert.equal(n.calls.length,0);
});

test('valid RFQ sends only to the fixed sales mailbox, with a safe reply address and reference',async()=>{
  const {createService}=await worker(), n=network(), data=form();
  data.set('to','attacker@example.test');data.set('from','attacker@example.test');
  data.append('attachments',new File(['%PDF-1.7\nfixture'], 'drawing.pdf',{type:'application/pdf'}));
  const response=await createService(n.fetch).fetch(request(data),env()), result=await response.json();
  assert.equal(response.status,202);assert.equal(acceptedServiceReply(response,result),true);
  assert.equal(n.calls.length,3);
  assert.match(n.calls[1].url,/login\.microsoftonline\.com\/11111111-1111-4111-8111-111111111111\/oauth2\/v2\.0\/token$/);
  assert.equal(n.calls[1].options.body.get('grant_type'),'client_credentials');
  assert.equal(n.calls[1].options.body.get('scope'),'https://graph.microsoft.com/.default');
  const sent=n.calls[2],body=JSON.parse(sent.options.body);
  assert.equal(sent.url,'https://graph.microsoft.com/v1.0/users/sales%40flutexindustrial.com/sendMail');
  assert.deepEqual(body.message.toRecipients,[{emailAddress:{address:'sales@flutexindustrial.com'}}]);
  assert.equal(body.message.replyTo[0].emailAddress.address,'buyer@example.test');
  assert.match(body.message.body.content,/طلب قطع ومقاسات/);assert.match(body.message.body.content,/Kuwait City/);
  assert.ok(body.message.subject.includes(result.reference));
  assert.equal(body.message.attachments[0].contentBytes,Buffer.from('%PDF-1.7\nfixture').toString('base64'));
  assert.equal(body.saveToSentItems,true);
  assert.doesNotMatch(JSON.stringify(body),/fictional-token|fictional-access-token|fictional-test-only|attacker/);
});

test('origin, preview hostname, content type and rate failures make no external requests',async()=>{
  const {createService}=await worker();
  for(const [req,settings,status] of [
    [request(form(),{headers:{origin:'https://outside.example'}}),env(),403],
    [request(form(),{url:'https://preview.pages.dev/api/rfq'}),env(),403],
    [request(form(),{headers:{'cf-connecting-ip':''}}),env(),403],
    [request('not multipart'),env(),415],
    [request(),{...env(),RFQ_RATE_LIMITER:{limit:async()=>({success:false})}},429],
    [request(),{},503],
  ]) {const n=network();assert.equal((await createService(n.fetch).fetch(req,settings)).status,status);assert.equal(n.calls.length,0);}
});

test('missing fields, duplicate values, header breaks and honeypots are rejected before verification',async()=>{
  const {createService}=await worker();
  for(const change of [d=>d.delete('email'),d=>d.set('email','invalid'),d=>d.set('name','Buyer\r\nBcc: hidden'),
    d=>d.append('company','second'),d=>d.set('message','x'.repeat(8001)),d=>d.set('website','bot'),d=>d.delete('cf-turnstile-response')]) {
    const d=form();change(d);const n=network();const r=await createService(n.fetch).fetch(request(d),env());
    assert.ok([403,422].includes(r.status));assert.equal(n.calls.length,0);
  }
});

test('streamed request and attachment limits are enforced without trusting content length',async()=>{
  const {createService}=await worker();
  const tooLarge=new Request('https://flutexindustrial.com/api/rfq',{method:'POST',duplex:'half',
    headers:{origin:'https://flutexindustrial.com','cf-connecting-ip':'192.0.2.10','content-type':'multipart/form-data; boundary=fixture'},
    body:new ReadableStream({start(controller){controller.enqueue(new Uint8Array(3*1024*1024+1));controller.close();}})});
  let n=network();assert.equal((await createService(n.fetch).fetch(tooLarge,env())).status,413);assert.equal(n.calls.length,0);
  const total=form();total.append('attachments',new File([new Uint8Array(MAX_ATTACHMENT_BYTES+1)],'large.pdf'));
  n=network();assert.equal((await createService(n.fetch).fetch(request(total),env())).status,413);assert.equal(n.calls.length,0);
  const count=form();for(let i=0;i<5;i++)count.append('attachments',new File(['%PDF-1.7'],`drawing-${i}.pdf`));
  assert.equal((await createService(n.fetch).fetch(request(count),env())).status,413);
});

test('renamed executables and unexpected attachment types are rejected',async()=>{
  const {createService}=await worker();
  for(const name of ['drawing.pdf','picture.png','picture.jpg','picture.webp','drawing.dxf','drawing.dwg','program.exe']) {
    const d=form();d.append('attachments',new File(['MZ executable fixture'],name));const n=network();
    assert.equal((await createService(n.fetch).fetch(request(d),env())).status,415,name);assert.equal(n.calls.length,0);
  }
});

test('drawing attachments retain their bytes and are normalized to safe filenames',async()=>{
  const {createService}=await worker();
  for(const [name,bytes] of [['part.dxf','0\r\nSECTION\r\n2\r\nHEADER'],['../part\r\n.dwg','AC1032 fixture']]) {
    const d=form();d.append('attachments',new File([bytes],name));const n=network();
    assert.equal((await createService(n.fetch).fetch(request(d),env())).status,202);
    const attachment=JSON.parse(n.calls[2].options.body).message.attachments[0];
    assert.doesNotMatch(attachment.name,/[\r\n/\\]/);assert.equal(Buffer.from(attachment.contentBytes,'base64').toString(),bytes);
  }
});

test('Turnstile rejection, wrong action or wrong hostname never reaches Microsoft',async()=>{
  const {createService}=await worker();
  for(const verification of [{success:false},{action:'different'},{hostname:'other.example'}]) {
    const n=network({verification});assert.equal((await createService(n.fetch).fetch(request(),env())).status,403);assert.equal(n.calls.length,1);
  }
});

test('credential errors and unconfirmed delivery do not become successful RFQs or leak provider data',async()=>{
  const {createService}=await worker();
  for(const overrides of [{tokenResponse:Response.json({error_description:'private-fixture'},{status:401})},
    {sendStatus:403},{sendStatus:200},{sendThrows:true}]) {
    const n=network(overrides), r=await createService(n.fetch).fetch(request(),env()), result=await r.json();
    assert.ok([502,503].includes(r.status));assert.equal(result.accepted,undefined);
    assert.doesNotMatch(JSON.stringify(result),/private-fixture|private provider|fictional-test-only|access-token/);
    assert.equal(acceptedServiceReply(r,result),false);
    assert.ok(n.calls.filter(x=>x.url.includes('/sendMail')).length<=1,'No automatic send retry');
  }
});

test('frontend requires explicit provider acceptance and uses the backend attachment limit',async()=>{
  const {MAX_ATTACHMENT_BYTES:limit}=await worker();assert.equal(MAX_ATTACHMENT_BYTES,limit);
  const reference='33333333-3333-4333-8333-333333333333';
  assert.equal(acceptedServiceReply({status:200},{accepted:true,reference}),false);
  assert.equal(acceptedServiceReply({status:202},{reference}),false);
  assert.equal(acceptedServiceReply({status:202},{accepted:true,reference:'invalid'}),false);
  assert.equal(acceptedServiceReply({status:202},{accepted:true,reference}),true);
});
