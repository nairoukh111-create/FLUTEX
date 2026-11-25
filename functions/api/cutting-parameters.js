// Single-record exact-dimension lookup. No catalogue-list operation.
const RECORDS = [
  [
    [
      10,
      20,
      10,
      120
    ],
    "Carbide End Mill – 1F, Ø10 × 20 × Ø10 × 120 mm",
    null
  ],
  [
    [
      10,
      20,
      10,
      75
    ],
    "Carbide End Mill – 1F, Ø10 × 20 × Ø10 × 75 mm",
    [
      10000,
      5,
      500,
      0.05,
      314.16,
      1,
      10
    ]
  ],
  [
    [
      8,
      32,
      8,
      75
    ],
    "Carbide End Mill – 1F, Ø8 × 32 × Ø8 × 75 mm",
    [
      12000,
      3.5,
      420,
      0.035,
      301.59,
      1,
      8
    ]
  ],
  [
    [
      6,
      25,
      6,
      60
    ],
    "Carbide End Mill – 1F, Ø6 × 25 × Ø6 × 60 mm",
    [
      10000,
      3,
      300,
      0.03,
      188.5,
      1,
      6
    ]
  ],
  [
    [
      6,
      22,
      6,
      60
    ],
    "Carbide End Mill – 1F, Ø6 × 22 × Ø6 × 60 mm",
    [
      10000,
      3.5,
      350,
      0.035,
      188.5,
      1,
      6
    ]
  ],
  [
    [
      6,
      18,
      8,
      60
    ],
    "O-Flute End Mill – 1F, Ø6 × 18 × Ø8 × 60 mm",
    null
  ],
  [
    [
      6,
      14,
      8,
      60
    ],
    "Carbide End Mill – 1F, Ø6 × 14 × Ø8 × 60 mm",
    [
      12000,
      4,
      480,
      0.04,
      226.19,
      1,
      6
    ]
  ],
  [
    [
      5,
      14,
      8,
      80
    ],
    "Carbide End Mill – 1F, Ø5 × 14 × Ø8 × 80 mm",
    [
      8000,
      4,
      320,
      0.04,
      125.66,
      1,
      5
    ]
  ],
  [
    [
      5,
      22,
      8,
      80
    ],
    "O-Flute End Mill – 1F, Ø5 × 22 × Ø8 × 80 mm",
    null
  ],
  [
    [
      5,
      16,
      5,
      48
    ],
    "Carbide End Mill – 1F, Ø5 × 16 × Ø5 × 48 mm",
    [
      12000,
      3.5,
      420,
      0.035,
      188.5,
      1,
      5
    ]
  ],
  [
    [
      4,
      14,
      8,
      60
    ],
    "Carbide End Mill – 1F, Ø4 × 14 × Ø8 × 60 mm",
    [
      12000,
      2.5,
      300,
      0.025,
      150.8,
      0.5,
      4
    ]
  ],
  [
    [
      4,
      14,
      4,
      60
    ],
    "Carbide End Mill – 1F, Ø4 × 14 × Ø4 × 60 mm",
    [
      12000,
      2.5,
      300,
      0.025,
      150.8,
      0.5,
      4
    ]
  ]
];
const FIELDS = ["diameter","fluteLength","shankDiameter","overallLength"];
const index = new Map(RECORDS.map(([dimensions,name,values])=>[dimensions.join('x'),{dimensions,name,values}]));
export function lookup(input){
 if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length!==4||!FIELDS.every(k=>Object.prototype.hasOwnProperty.call(input,k)&&typeof input[k]==='number'&&Number.isFinite(input[k])&&input[k]>0&&input[k]<=1000)) return {status:'invalid'};
 const hit=index.get(FIELDS.map(k=>input[k]).join('x'));
 if(!hit)return {status:'not-found'};
 const {dimensions,name,values}=hit;
 return {status:values?'trial':'contact',dimensions,name,...(values?{values}:{})};
}
function json(body,status=200){return new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});}
export async function onRequest({request}){
 if(request.method!=='POST')return json({status:'method-not-allowed'},405);
 if(!(request.headers.get('content-type')||'').toLowerCase().startsWith('application/json'))return json({status:'invalid'},415);
 try{const raw=await request.text();if(raw.length>1024)return json({status:'invalid'},413);const result=lookup(JSON.parse(raw));return json(result,result.status==='invalid'?400:result.status==='not-found'?404:200);}catch(_){return json({status:'invalid'},400);}
}
