const { useState, useEffect } = React;

const rand = (min,max)=>Math.floor(Math.random()*(max-min+1))+min;

function playTone(freq,duration){
  const ctx=new (window.AudioContext||window.webkitAudioContext)();
  const osc=ctx.createOscillator();
  const gain=ctx.createGain();
  osc.frequency.value=freq;
  gain.gain.value=0.03;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  setTimeout(()=>osc.stop(),duration*1000);
}

const sounds={
 click:()=>playTone(500,.05),
 correct:()=>{playTone(700,.1);setTimeout(()=>playTone(900,.1),80)},
 wrong:()=>playTone(200,.15)
};

function generateProblem(grade){
 if(grade===2){
   let a=rand(1,50),b=rand(1,40);
   return {q:`${a}+${b}=?`,a:String(a+b)};
 }
 if(grade===3){
   let a=rand(2,9),b=rand(2,9);
   return {q:`${a}×${b}=?`,a:String(a*b)};
 }
 if(grade===4){
   let a=rand(20,90),b=rand(10,40);
   return {q:`${a}×${b}=?`,a:String(a*b)};
 }
 let a=rand(2,8),b=rand(3,9),c=rand(2,5);
 return {q:`${a}+${b}×${c}=?`,a:String(a+b*c)};
}

function App(){

 const [screen,setScreen]=useState("home");
 const [grade,setGrade]=useState(2);
 const [problem,setProblem]=useState(generateProblem(2));
 const [answer,setAnswer]=useState("");
 const [score,setScore]=useState(0);
 const [time,setTime]=useState(30);
 const [mode,setMode]=useState("practice");

 useEffect(()=>{
   if(mode!=="speed"||screen!=="play")return;
   if(time<=0)return;

   const t=setTimeout(()=>setTime(time-1),1000);
   return ()=>clearTimeout(t);
 },[time,mode,screen]);

 const check=(value)=>{
   if(value===problem.a){
     sounds.correct();
     setScore(s=>s+1);
     setTimeout(()=>setProblem(generateProblem(grade)),500);
     setAnswer("");
   }else{
     sounds.wrong();
   }
 };

 if(screen==="home"){
   return(
    <div className="screen">
     <h1>Kids Math Trainer</h1>
     {[2,3,4,5].map(g=>(
       <button key={g} className="big-btn"
         onClick={()=>{sounds.click();setGrade(g);setScreen("mode");}}>
         Grade {g}
       </button>
     ))}
    </div>
   );
 }

 if(screen==="mode"){
   return(
    <div className="screen">
      <h1>Grade {grade}</h1>
      <button className="big-btn" onClick={()=>{setMode("practice");setScreen("play");setScore(0);}}>
        Practice Mode
      </button>
      <button className="big-btn" onClick={()=>{setMode("speed");setScreen("play");setTime(30);setScore(0);}}>
        Speed 30s
      </button>
      <button className="ghost-btn" onClick={()=>setScreen("home")}>Back</button>
    </div>
   );
 }

 return(
  <div className="screen">
    <h2>Score: {score}</h2>
    {mode==="speed" && <h3>Time: {time}</h3>}
    <div className="card">
      <h1>{problem.q}</h1>
      <input value={answer} onChange={e=>setAnswer(e.target.value)}/>
      <button className="big-btn" onClick={()=>check(answer)}>Check</button>
    </div>
    <button className="ghost-btn" onClick={()=>setScreen("mode")}>Change Mode</button>
  </div>
 );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
