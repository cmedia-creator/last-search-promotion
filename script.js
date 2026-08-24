const app = document.getElementById('app');
const startScreen = document.getElementById('startScreen');
const endScreen = document.getElementById('endScreen');
const startBtn = document.getElementById('startBtn');
const replayBtn = document.getElementById('replayBtn');
const chapter = document.getElementById('chapter');
const headline = document.getElementById('headline');
const subline = document.getElementById('subline');
const progressBar = document.getElementById('progressBar');
const partner = document.getElementById('partner');

const DURATION = 60000;
let raf = null;
let startedAt = 0;
let timers = [];

const scenes = [
  { at: 0,     phase: 'phase-intro', chapter:'PROLOGUE', headline:'まだ、何者でもなかった。', sub:'ただ一本道を歩いていた。' },
  { at: 4500,  phase: 'phase-hero', chapter:'CHAPTER 01 / HERO', headline:'最初に好きになったのは、ヒーローだった。', sub:'強くて、まっすぐで、子どもの自分には眩しかった。' },
  { at: 15500, phase: 'phase-soccer', chapter:'CHAPTER 02 / FOOTBALL', headline:'次に、サッカーに夢中になった。', sub:'見るだけじゃない。走って、蹴って、悔しがるのも楽しかった。' },
  { at: 27500, phase: 'phase-script', chapter:'CHAPTER 03 / STORY', headline:'その次は、物語をつくること。', sub:'ゲームシナリオを書いて、選択肢の先に世界をつくった。' },
  { at: 42000, phase: 'phase-wife', chapter:'CHAPTER 04 / YOU', headline:'そして、妻に出会った。', sub:'初めて、「好き」が自分の外側に続いていった。' },
  { at: 53500, phase: 'phase-final', chapter:'EPILOGUE', headline:'好きなものが、私をつくった。', sub:'そして、今は二人で歩いている。' },
];

function setScene(scene){
  app.className = `app ${scene.phase}`;
  chapter.textContent = scene.chapter;
  headline.textContent = scene.headline;
  subline.textContent = scene.sub;
}

function clearRun(){
  timers.forEach(clearTimeout); timers=[];
  cancelAnimationFrame(raf);
  progressBar.style.width='0%';
  endScreen.classList.add('hidden');
  partner.classList.remove('walking');
  setScene(scenes[0]);
}

function schedule(fn, ms){ const id=setTimeout(fn,ms); timers.push(id); }

function animateProgress(){
  const elapsed = performance.now()-startedAt;
  const pct = Math.min(100,(elapsed/DURATION)*100);
  progressBar.style.width = pct+'%';
  if(elapsed < DURATION) raf=requestAnimationFrame(animateProgress);
}

function begin(){
  clearRun();
  startScreen.classList.add('hidden');
  startedAt = performance.now();
  scenes.forEach((s,i)=>{ if(i>0) schedule(()=>setScene(s),s.at); });
  schedule(()=>partner.classList.add('walking'),43800);
  schedule(()=>{ endScreen.classList.remove('hidden'); },DURATION);
  raf=requestAnimationFrame(animateProgress);
}

startBtn.addEventListener('click', begin);
replayBtn.addEventListener('click', begin);

// Debug shortcut: press 1-6 on desktop to jump between visual phases.
window.addEventListener('keydown',(e)=>{
  const n=Number(e.key);
  if(n>=1&&n<=6){ setScene(scenes[n-1]); startScreen.classList.add('hidden'); }
});
