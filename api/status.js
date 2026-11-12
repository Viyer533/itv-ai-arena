const {json,callFlow}=require('../lib/http');
module.exports=async(req,res)=>{
  if(req.method!=='GET') return json(res,405,{error:'Method not allowed'});
  try{
    const data=await callFlow(process.env.PA_STATUS_URL,{gameId:process.env.GAME_ID||'AI-ARENA'});
    return json(res,200,{enabled:data.enabled===true,gameId:data.gameId||process.env.GAME_ID||'AI-ARENA',message:data.message||''});
  }catch(e){return json(res,200,{enabled:false,message:'The arena is currently closed.'})}
};
