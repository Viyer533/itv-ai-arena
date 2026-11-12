const {json,callFlow}=require('../lib/http');
module.exports=async(req,res)=>{
 if(req.method!=='GET') return json(res,405,{error:'Method not allowed'});
 try{const data=await callFlow(process.env.PA_LEADERBOARD_URL,{gameId:process.env.GAME_ID||'AI-ARENA'});const rows=Array.isArray(data.results)?data.results:[];rows.sort((a,b)=>Number(b.score)-Number(a.score)||Number(a.timeSeconds)-Number(b.timeSeconds)||String(a.playerName).localeCompare(String(b.playerName)));return json(res,200,{results:rows.slice(0,100),updatedAt:new Date().toISOString()})}
 catch{return json(res,502,{error:'Leaderboard unavailable',results:[]})}
};
