function json(res,status,body){res.status(status).json(body)}
async function callFlow(url,payload){
  if(!url) throw new Error('Flow URL is not configured');
  const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload||{})});
  const text=await r.text(); let data={};
  try{data=text?JSON.parse(text):{}}catch{data={raw:text}}
  if(!r.ok) throw new Error(data.message||`Flow returned ${r.status}`);
  return data;
}
module.exports={json,callFlow};
