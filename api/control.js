const {json,callFlow}=require('../lib/http');
module.exports=async(req,res)=>{
  if(req.method!=='POST') return json(res,405,{error:'Method not allowed'});
  const supplied=req.headers['x-admin-key'];
  if(!process.env.ADMIN_KEY || supplied!==process.env.ADMIN_KEY) return json(res,401,{error:'Invalid host key'});
  const enabled=req.body?.enabled;
  if(typeof enabled!=='boolean') return json(res,400,{error:'enabled must be true or false'});
  try{
    const data=await callFlow(process.env.PA_CONTROL_URL,{gameId:process.env.GAME_ID||'AI-ARENA',enabled});
    return json(res,200,{ok:true,enabled:data.enabled??enabled,message:data.message||''});
  }catch(e){return json(res,502,{error:'Unable to update game status'})}
};
