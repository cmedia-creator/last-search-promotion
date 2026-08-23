
const screens = ["viewer","crash","unauth","ogotaka","logs","access","lastsearch"];
const startBtn = document.getElementById("startBtn");
let started = false;

function show(id){
  screens.forEach(s => document.getElementById(s).classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function buildLogs(){
  const el = document.getElementById("logText");
  let lines = [];
  const acts = ["READ","SEARCH","TRACE","INJECT","EXTRACT","MIRROR","INDEX"];
  for(let i=0;i<54;i++){
    const hh = String(Math.floor(i/3600)).padStart(2,"0");
    const mm = String(Math.floor((i*7)%60)).padStart(2,"0");
    const ss = String((19+i*3)%60).padStart(2,"0");
    const act = acts[i%acts.length];
    lines.push(`${hh}:${mm}:${ss}  ACCESS user=unknown  node=${String((i*173)%9999).padStart(4,"0")}  act=${act}`);
  }
  el.textContent = lines.join("\n");
}

function animateProgress(){
  const fill = document.getElementById("barFill");
  const pct = document.getElementById("percent");
  let p = 0;
  const t = setInterval(()=>{
    p += Math.floor(Math.random()*9)+4;
    if(p>=100){p=100; clearInterval(t);}
    fill.style.width = p+"%";
    pct.textContent = p+"%";
  },80);
}

startBtn.addEventListener("click",()=>{
  if(started) return;
  started = true;

  // 0.0s click -> 0.55s first anomaly. The monster arrives before the viewer's thumb can escape.
  document.getElementById("viewer").classList.add("flash");

  setTimeout(()=>show("crash"), 550);
  setTimeout(()=>show("unauth"), 1250);
  setTimeout(()=>show("ogotaka"), 2050);
  setTimeout(()=>{
    buildLogs();
    show("logs");
  }, 3000);
  setTimeout(()=>{
    show("access");
    animateProgress();
  }, 4700);
  setTimeout(()=>show("lastsearch"), 6500);
});

// Tap the final screen three times to replay during recording.
let taps = 0, tapTimer;
document.getElementById("lastsearch").addEventListener("click",()=>{
  taps++;
  clearTimeout(tapTimer);
  tapTimer = setTimeout(()=>taps=0,500);
  if(taps>=3){
    taps=0; started=false;
    document.getElementById("barFill").style.width="0";
    document.getElementById("percent").textContent="0%";
    document.getElementById("viewer").classList.remove("flash");
    show("viewer");
  }
});
