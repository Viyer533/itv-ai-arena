const base=()=>String(process.env.SUPABASE_URL||'').replace(/\/$/,'');
const key=()=>process.env.SUPABASE_SERVICE_ROLE_KEY||'';
async function db(path,opt={}){if(!base()||!key())throw Error('Supabase not configured');const r=await fetch(`${base()}/rest/v1/${path}`,{...opt,headers:{apikey:key(),Authorization:`Bearer ${key()}`,'Content-Type':'application/json',Prefer:opt.prefer||'return=representation',...(opt.headers||{})}});const t=await r.text();let d;try{d=t?JSON.parse(t):null}catch{d=t}if(!r.ok)throw Error(d?.message||d?.details||`Database error ${r.status}`);return d}module.exports={db};
