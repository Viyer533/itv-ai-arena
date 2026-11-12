const questions=require('../lib/questions'); const {json,callFlow}=require('../lib/http');
const clean=s=>String(s||'').replace(/[<>]/g,'').trim().slice(0,40);
module.exports=async(req,res)=>{
 if(req.method!=='POST') return json(res,405,{error:'Method not allowed'});
 try{
  const status=await callFlow(process.env.PA_STATUS_URL,{gameId:process.env.GAME_ID||'AI-ARENA'});
  if(status.enabled!==true) return json(res,403,{error:'The arena is closed. Scores are no longer being accepted.'});
 }catch{return json(res,503,{error:'Could not verify arena status.'})}
 const name=clean(req.body?.playerName), answers=req.body?.answers, timeSeconds=Math.max(0,Math.min(180,Number(req.body?.timeSeconds)));
 if(name.length<2||!Array.isArray(answers)||!Number.isFinite(timeSeconds)) return json(res,400,{error:'Invalid submission'});
 const map=new Map(answers.map(x=>[Number(x.questionId),String(x.answer)])); let score=0,correct=0,attempted=0,skipped=0;
 const scored=questions.map(q=>{const answer=map.get(q.id)||'UNANSWERED'; if(answer==='A'||answer==='B')attempted++; if(answer==='SKIP')skipped++; const isCorrect=answer===q.correct; if(isCorrect){correct++;score+=q.points} return {questionId:q.id,answer,correct:isCorrect,pointsAwarded:isCorrect?q.points:0}});
 const payload={submissionId:String(req.body?.submissionId||crypto.randomUUID()),gameId:process.env.GAME_ID||'AI-ARENA',playerName:name,score,correct,attempted,total:questions.length,skipped,timeSeconds,startedAt:req.body?.startedAt||'',completedAt:new Date().toISOString(),answers:scored};
 try{await callFlow(process.env.PA_SUBMIT_URL,payload);return json(res,200,{ok:true,score,correct,attempted,skipped,timeSeconds,total:questions.length})}
 catch{return json(res,502,{error:'The score could not be saved. Please try again.'})}
};
