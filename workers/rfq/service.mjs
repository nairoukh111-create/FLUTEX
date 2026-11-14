// Server-only RFQ delivery. No credentials or customer submissions belong in Git.
const MAILBOX = 'sales@flutexindustrial.com';
const HOSTS = new Set(['flutexindustrial.com', 'www.flutexindustrial.com']);
export const MAX_ATTACHMENT_BYTES = 2.5 * 1024 * 1024;
const MAX_REQUEST_BYTES = 3 * 1024 * 1024;
const FIELDS = {name:120, company:200, email:254, phone:80, partNumber:160,
  quantity:80, category:120, destinationCountry:80, destinationCity:120, message:8000};
const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MIME = {pdf:'application/pdf', png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg',
  webp:'image/webp', dxf:'application/dxf', dwg:'application/acad'};
const json = (body, status=200) => new Response(JSON.stringify(body), {status,
  headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',
    'x-content-type-options':'nosniff'}});
const fault = (code, status=422) => Object.assign(new Error(code), {code, status});

export function configured(env) {
  return GUID.test(env.M365_TENANT_ID || '') && GUID.test(env.M365_CLIENT_ID || '') &&
    Boolean(env.M365_CLIENT_SECRET && env.TURNSTILE_SECRET_KEY && typeof env.RFQ_RATE_LIMITER?.limit === 'function');
}

async function boundedBody(request) {
  const declared = request.headers.get('content-length');
  if (declared && (!/^\d+$/.test(declared) || Number(declared)>MAX_REQUEST_BYTES)) throw fault('request-too-large',413);
  if (!request.body) throw fault('empty-request');
  const reader=request.body.getReader(), chunks=[];
  let length=0;
  try {
    while (true) {
      const {done,value}=await reader.read();
      if (done) break;
      length+=value.byteLength;
      if (length>MAX_REQUEST_BYTES) { await reader.cancel(); throw fault('request-too-large',413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const body=new Uint8Array(length);
  let offset=0;
  for (const chunk of chunks) {body.set(chunk,offset);offset+=chunk.byteLength;}
  try {return await new Response(body,{headers:{'content-type':request.headers.get('content-type')}}).formData();}
  catch {throw fault('invalid-form');}
}

function fields(data) {
  if (data.get('website')) throw fault('invalid-form');
  const values={};
  for (const [key,max] of Object.entries(FIELDS)) {
    const entries=data.getAll(key), value=entries[0] ?? '';
    if (entries.length>1 || typeof value!=='string' || value.length>max ||
        (key==='message' ? /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/ : /[\x00-\x1f\x7f]/).test(value)) throw fault('invalid-fields');
    values[key]=value.trim();
  }
  if (!values.name || !values.company || !values.message ||
      !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(values.email)) throw fault('invalid-fields');
  const tokens=data.getAll('cf-turnstile-response');
  if (tokens.length!==1 || typeof tokens[0]!=='string' || !tokens[0] || tokens[0].length>2048) throw fault('verification-required',403);
  return {...values,token:tokens[0]};
}

function base64(bytes) {
  const chunks=[];
  for (let i=0;i<bytes.length;i+=8192) chunks.push(String.fromCharCode(...bytes.subarray(i,i+8192)));
  return btoa(chunks.join(''));
}

async function attachments(data) {
  const files=data.getAll('attachments').filter(file=>typeof file!=='string' && file.size);
  if (files.length>4 || files.reduce((sum,f)=>sum+f.size,0)>MAX_ATTACHMENT_BYTES) throw fault('attachment-size',413);
  if (data.getAll('attachments').some(file=>typeof file==='string')) throw fault('invalid-attachment');
  const result=[];
  for (const file of files) {
    const name=file.name.split(/[\\/]/).pop().replace(/[\x00-\x1f\x7f]/g,'').slice(-120);
    const extension=name.split('.').pop().toLowerCase();
    if (!MIME[extension]) throw fault('attachment-type',415);
    const bytes=new Uint8Array(await file.arrayBuffer());
    const start=new TextDecoder().decode(bytes.subarray(0,4096));
    const valid=extension==='pdf' ? start.startsWith('%PDF-') :
      extension==='png' ? [137,80,78,71,13,10,26,10].every((b,i)=>bytes[i]===b) :
      ['jpg','jpeg'].includes(extension) ? bytes[0]===255 && bytes[1]===216 && bytes[2]===255 :
      extension==='webp' ? start.startsWith('RIFF') && start.slice(8,12)==='WEBP' :
      extension==='dwg' ? /^AC10\d{2}/.test(start) :
      start.startsWith('AutoCAD Binary DXF\r\n') || /(?:^|\n)\s*0\s*\r?\n\s*SECTION\b/.test(start);
    if (!valid) throw fault('attachment-type',415);
    result.push({'@odata.type':'#microsoft.graph.fileAttachment',name,
      contentType:MIME[extension],contentBytes:base64(bytes)});
  }
  return result;
}

async function network(fetcher,url,options,timeout) {
  return fetcher(url,{...options,signal:AbortSignal.timeout(timeout),redirect:'error'});
}

export function createService(fetcher=fetch) {
  return {
    async fetch(request,env) {
      const url=new URL(request.url);
      if (request.method==='GET' && url.pathname==='/health') return json({available:configured(env)});
      if (request.method!=='POST') return json({error:'method-not-allowed'},405);
      if (!configured(env)) return json({error:'service-unavailable'},503);
      if (url.pathname!=='/api/rfq' || !HOSTS.has(url.hostname) || url.protocol!=='https:' ||
          request.headers.get('origin')!==url.origin) return json({error:'invalid-origin'},403);
      if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('multipart/form-data;')) return json({error:'invalid-content-type'},415);
      const ip=request.headers.get('cf-connecting-ip');
      if (!ip) return json({error:'invalid-request'},403);
      let reference;
      try {
        const rate=await env.RFQ_RATE_LIMITER.limit({key:ip});
        if (!rate.success) return json({error:'rate-limited'},429);
        const data=await boundedBody(request), values=fields(data), files=await attachments(data);
        const verification=await network(fetcher,'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {method:'POST',body:new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,
            response:values.token,remoteip:ip})},8000);
        if (!verification.ok) throw fault('verification-unavailable',503);
        const check=await verification.json();
        if (!check.success || check.hostname!==url.hostname || check.action!=='rfq') throw fault('verification-failed',403);
        const tokenResponse=await network(fetcher,`https://login.microsoftonline.com/${env.M365_TENANT_ID}/oauth2/v2.0/token`,
          {method:'POST',body:new URLSearchParams({client_id:env.M365_CLIENT_ID,
            client_secret:env.M365_CLIENT_SECRET,scope:'https://graph.microsoft.com/.default',grant_type:'client_credentials'})},10000);
        if (!tokenResponse.ok) throw fault('service-unavailable',503);
        const auth=await tokenResponse.json();
        if (typeof auth.access_token!=='string' || !auth.access_token) throw fault('service-unavailable',503);
        reference=crypto.randomUUID();
        const body=[`FLUTEX website RFQ: ${reference}`,'',...Object.keys(FIELDS).map(key=>`${key}: ${values[key]}`)].join('\n');
        const sent=await network(fetcher,`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAILBOX)}/sendMail`,
          {method:'POST',headers:{authorization:`Bearer ${auth.access_token}`,'content-type':'application/json'},
            body:JSON.stringify({message:{subject:`FLUTEX website RFQ [${reference}]`,
              body:{contentType:'Text',content:body},toRecipients:[{emailAddress:{address:MAILBOX}}],
              replyTo:[{emailAddress:{address:values.email,name:values.name}}],attachments:files},saveToSentItems:true})},15000);
        // Acceptance by Microsoft is distinct from arrival in the destination inbox.
        if (sent.status!==202) throw fault('delivery-unconfirmed',502);
        return json({accepted:true,reference},202);
      } catch (error) {
        // Do not log form values, attachments, tokens or provider response bodies.
        return json({error:error.status ? error.code : 'delivery-unconfirmed',...(reference ? {reference} : {})},error.status || 502);
      }
    },
  };
}

export default createService();
