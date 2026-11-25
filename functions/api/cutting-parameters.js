// Exact lookup by dimensions AND application. Only individual released trial values are returned.
const RECORDS = [
  {
    "dimensions": [
      10,
      20,
      10,
      120
    ],
    "name": "Carbide End Mill – 1F, Ø10 × 20 × Ø10 × 120 mm",
    "application": null,
    "release": "contact",
    "values": null,
    "revision": "2026-11-25-r05"
  },
  {
    "dimensions": [
      10,
      20,
      10,
      75
    ],
    "name": "Carbide End Mill – 1F, Ø10 × 20 × Ø10 × 75 mm",
    "application": {
      "toolMaterial": "carbide",
      "flutes": "1",
      "workpiece": "al6063-t6-profile",
      "cooling": "mql-external",
      "operation": "full-slot-shallow",
      "entry": "open-edge"
    },
    "release": "initial-trial",
    "values": [
      10000,
      5,
      500,
      0.05,
      314.16,
      1,
      10
    ],
    "revision": "2026-11-25-r05"
  },
  {
    "dimensions": [
      8,
      32,
      8,
      75
    ],
    "name": "Carbide End Mill – 1F, Ø8 × 32 × Ø8 × 75 mm",
    "application": {
      "toolMaterial": "carbide",
      "flutes": "1",
      "workpiece": "al6063-t6-profile",
      "cooling": "mql-external",
      "operation": "full-slot-shallow",
      "entry": "open-edge"
    },
    "release": "initial-trial",
    "values": [
      12000,
      3.5,
      420,
      0.035,
      301.59,
      1,
      8
    ],
    "revision": "2026-11-25-r05"
  },
  {
    "dimensions": [
      6,
      25,
      6,
      60
    ],
    "name": "Carbide End Mill – 1F, Ø6 × 25 × Ø6 × 60 mm",
    "application": {
      "toolMaterial": "carbide",
      "flutes": "1",
      "workpiece": "al6063-t6-profile",
      "cooling": "mql-external",
      "operation": "full-slot-shallow",
      "entry": "open-edge"
    },
    "release": "initial-trial",
    "values": [
      10000,
      3,
      300,
      0.03,
      188.5,
      1,
      6
    ],
    "revision": "2026-11-25-r05"
  },
  {
    "dimensions": [
      6,
      22,
      6,
      60
    ],
    "name": "Carbide End Mill – 1F, Ø6 × 22 × Ø6 × 60 mm",
    "application": {
      "toolMaterial": "carbide",
      "flutes": "1",
      "workpiece": "al6063-t6-profile",
      "cooling": "mql-external",
      "operation": "full-slot-shallow",
      "entry": "open-edge"
    },
    "release": "initial-trial",
    "values": [
      10000,
      3.5,
      350,
      0.035,
      188.5,
      1,
      6
    ],
    "revision": "2026-11-25-r05"
  },
  {
    "dimensions": [
      6,
      18,
      8,
      60
    ],
    "name": "O-Flute End Mill – 1F, Ø6 × 18 × Ø8 × 60 mm",
    "application": null,
    "release": "contact",
    "values": null,
    "revision": "2026-11-25-r05"
  },
  {
    "dimensions": [
      6,
      14,
      8,
      60
    ],
    "name": "Carbide End Mill – 1F, Ø6 × 14 × Ø8 × 60 mm",
    "application": {
      "toolMaterial": "carbide",
      "flutes": "1",
      "workpiece": "al6063-t6-profile",
      "cooling": "mql-external",
      "operation": "full-slot-shallow",
      "entry": "open-edge"
    },
    "release": "initial-trial",
    "values": [
      12000,
      4,
      480,
      0.04,
      226.19,
      1,
      6
    ],
    "revision": "2026-11-25-r05"
  },
  {
    "dimensions": [
      5,
      14,
      8,
      80
    ],
    "name": "Carbide End Mill – 1F, Ø5 × 14 × Ø8 × 80 mm",
    "application": {
      "toolMaterial": "carbide",
      "flutes": "1",
      "workpiece": "al6063-t6-profile",
      "cooling": "mql-external",
      "operation": "full-slot-shallow",
      "entry": "open-edge"
    },
    "release": "initial-trial",
    "values": [
      8000,
      4,
      320,
      0.04,
      125.66,
      1,
      5
    ],
    "revision": "2026-11-25-r05"
  },
  {
    "dimensions": [
      5,
      22,
      8,
      80
    ],
    "name": "O-Flute End Mill – 1F, Ø5 × 22 × Ø8 × 80 mm",
    "application": null,
    "release": "contact",
    "values": null,
    "revision": "2026-11-25-r05"
  },
  {
    "dimensions": [
      5,
      16,
      5,
      48
    ],
    "name": "Carbide End Mill – 1F, Ø5 × 16 × Ø5 × 48 mm",
    "application": {
      "toolMaterial": "carbide",
      "flutes": "1",
      "workpiece": "al6063-t6-profile",
      "cooling": "mql-external",
      "operation": "full-slot-shallow",
      "entry": "open-edge"
    },
    "release": "initial-trial",
    "values": [
      12000,
      3.5,
      420,
      0.035,
      188.5,
      1,
      5
    ],
    "revision": "2026-11-25-r05"
  },
  {
    "dimensions": [
      4,
      14,
      8,
      60
    ],
    "name": "Carbide End Mill – 1F, Ø4 × 14 × Ø8 × 60 mm",
    "application": {
      "toolMaterial": "carbide",
      "flutes": "1",
      "workpiece": "al6063-t6-profile",
      "cooling": "mql-external",
      "operation": "full-slot-shallow",
      "entry": "open-edge"
    },
    "release": "initial-trial",
    "values": [
      12000,
      2.5,
      300,
      0.025,
      150.8,
      0.5,
      4
    ],
    "revision": "2026-11-25-r05"
  },
  {
    "dimensions": [
      4,
      14,
      4,
      60
    ],
    "name": "Carbide End Mill – 1F, Ø4 × 14 × Ø4 × 60 mm",
    "application": {
      "toolMaterial": "carbide",
      "flutes": "1",
      "workpiece": "al6063-t6-profile",
      "cooling": "mql-external",
      "operation": "full-slot-shallow",
      "entry": "open-edge"
    },
    "release": "initial-trial",
    "values": [
      12000,
      2.5,
      300,
      0.025,
      150.8,
      0.5,
      4
    ],
    "revision": "2026-11-25-r05"
  }
];
const DIMENSIONS=["diameter","fluteLength","shankDiameter","overallLength"];
const OPTIONS={"toolMaterial":["carbide","hss","other"],"flutes":["1","2","3","4","other"],"workpiece":["al6063-t6-profile","al6061","al6082","other"],"cooling":["mql-external","flood","dry","other"],"operation":["full-slot-shallow","side-milling","drilling","other"],"entry":["open-edge","ramp","plunge","other"]};
const SUPPORTED={"toolMaterial":"carbide","flutes":"1","workpiece":"al6063-t6-profile","cooling":"mql-external","operation":"full-slot-shallow","entry":"open-edge"};
const SEARCH_OPTIONS={"toolMaterial":["carbide","hss","other"],"flutes":["1","2","3","4","other"],"workpiece":["al6063-t6-profile","al6061","al6082","other"],"cooling":["mql-external","flood","dry","other"]};
const KEYS=[...DIMENSIONS,...Object.keys(SEARCH_OPTIONS)];
const LEGACY_KEYS=[...DIMENSIONS,...Object.keys(OPTIONS)];
const index=new Map(RECORDS.map(record=>[record.dimensions.join('x'),record]));
export function lookup(input){
 if(!input||typeof input!=='object'||Array.isArray(input)||!([KEYS,LEGACY_KEYS].some(keys=>Object.keys(input).length===keys.length&&keys.every(k=>Object.prototype.hasOwnProperty.call(input,k))))||!DIMENSIONS.every(k=>typeof input[k]==='number'&&Number.isFinite(input[k])&&input[k]>0&&input[k]<=1000)||!Object.keys(OPTIONS).every(k=>!(k in input)||OPTIONS[k].includes(input[k])))return {status:'invalid'};
 if(input.fluteLength>=input.overallLength)return {status:'invalid'};
 const hit=index.get(DIMENSIONS.map(k=>input[k]).join('x'));
 if(!hit)return {status:'not-found'};
 if(!Object.keys(SUPPORTED).every(k=>!(k in input)||input[k]===SUPPORTED[k]))return {status:'unsupported'};
 if(hit.release!=='initial-trial'||!hit.application||!Object.keys(hit.application).every(k=>!(k in input)||input[k]===hit.application[k]))return {status:'contact',dimensions:hit.dimensions,name:hit.name};
 return {status:'trial',dimensions:hit.dimensions,name:hit.name,application:hit.application,revision:hit.revision,values:hit.values};
}
function json(body,status=200){return new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});}
export async function onRequest({request}){
 if(request.method!=='POST')return json({status:'method-not-allowed'},405);
 if(!(request.headers.get('content-type')||'').toLowerCase().startsWith('application/json'))return json({status:'invalid'},415);
 try{const raw=await request.text();if(raw.length>1024)return json({status:'invalid'},413);const result=lookup(JSON.parse(raw));return json(result,result.status==='invalid'?400:result.status==='not-found'?404:200);}catch(_){return json({status:'invalid'},400);}
}
