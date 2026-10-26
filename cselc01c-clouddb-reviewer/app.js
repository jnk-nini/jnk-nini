(function(){
"use strict";
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const md=s=>s.replace(/\*\*(.+?)\*\*/g,"<b class='k'>$1</b>");
const T=D.TOPICS,TK=Object.keys(T);
const NITC="Not in the choices";
const slideTxt=sl=>{const p=String(sl).split("·");return"Vol "+p[0]+" · Slide"+(/[–-]/.test(p[1])?"s ":" ")+p[1]};
const hsh=s=>{let x=5381;for(let i=0;i<s.length;i++)x=((x<<5)+x+s.charCodeAt(i))|0;return(x>>>0).toString(36)};

/* ---------- storage (safe) ---------- */
const KEY="cselc01c-clouddb-reviewer-v1";
let S={srs:{},studied:{},theme:null,prefs:{nitc:true,strict:false,timer:false,dir:"tm",typeFirst:false},recall:false};
try{const o=JSON.parse(localStorage.getItem(KEY)||"{}");S=Object.assign(S,o);S.prefs=Object.assign({nitc:true,strict:false,timer:false,dir:"tm",typeFirst:false},o.prefs||{})}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}

/* ---------- units (one per source item) ---------- */
const parseItem=s=>{const p=s.split("|");return{text:p[0],keys:p}};
const FACT=D.FACTS.map(f=>({src:"f",t:f[0],sl:f[1],g:f[2],term:f[3],def:f[4],clue:f[5],alts:f[6]||[],id:"f"+hsh(f[0]+f[3])}));
const CLZ=D.CLOZE.map(c=>({src:"c",t:c[0],sl:c[1],s:c[2],ans:c[3],ds:c[4],clue:c[5],alts:c[6]||[],id:"c"+hsh(c[2])}));
const TFS=D.TF.map(x=>({src:"t",t:x[0],sl:x[1],s:x[2],tr:!!x[3],w:x[4],r:x[5],clue:x[6],id:"t"+hsh(x[2])}));
const MCS=D.MC.map(m=>({src:"m",t:m[0],sl:m[1],q:m[2],ans:m[3],ds:m[4],clue:m[5],ex:m[6],id:"m"+hsh(m[2])}));
const SPL=D.SPELL.map(x=>({src:"s",t:x[0],sl:x[1],ans:x[2],ds:x[3],what:x[4],id:"s"+hsh(x[2])}));
const LST=D.LISTS.map(x=>({src:"l",t:x[0],sl:x[1],q:x[2],items:x[3].map(parseItem),hook:x[4],id:"l"+hsh(x[2])}));
const ALL=[].concat(FACT,CLZ,TFS,MCS,SPL,LST);
const box=u=>{const r=S.srs[u.id];return r?r.b:0};
const seen=u=>!!S.srs[u.id];
function mark(u,ok,clue){const r=S.srs[u.id]||(S.srs[u.id]={b:0,w:0,n:0});r.n++;if(ok){if(!clue)r.b=Math.min(5,r.b+1)}else{r.b=0;r.w++}save()}
function readiness(t){const us=ALL.filter(u=>!t||u.t===t);if(!us.length)return 0;return Math.round(us.reduce((a,u)=>a+Math.min(box(u),2)/2,0)/us.length*100)}

/* ---------- text answer checking ---------- */
const norm=s=>String(s).toLowerCase().replace(/[–—]/g,"-").replace(/^(the|a|an)\s+/,"").replace(/[^a-z0-9]/g,"");
function lev(a,b){if(Math.abs(a.length-b.length)>3)return 9;const d=[];for(let i=0;i<=a.length;i++){d[i]=[i]}for(let j=1;j<=b.length;j++)d[0][j]=j;for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length]}
const tol=n=>n.length>=11?2:n.length>=6?1:0;
function forms(a){const out=[a];const m=a.match(/^(.*?)\s*\(([^)]+)\)\s*$/);if(m){out.push(m[1].trim(),m[2].trim())}a.split(/\s*\/\s*/).forEach(p=>{if(p&&p!==a)out.push(p)});return out}
function checkTyped(input,q){const raw=input.trim().replace(/\s+/g," ");
  const strictOk=q.strictAns.some(a=>a===raw);
  if(SET.strict)return{ok:strictOk,exact:strictOk};
  const u=norm(raw);if(!u)return{ok:false};
  const ok=q.answers.some(a=>{const n=norm(a);return n&&(u===n||(tol(n)>0&&lev(u,n)<=tol(n)))});
  return{ok,exact:strictOk}}

/* ---------- misspelling / wrong-capital variants for the “Not in the choices” trap ---------- */
function variant(a){
  const ws=a.split(" ");const order=shuffle(ws.map((_,i)=>i));
  for(const i of order){const w=ws[i];
    if(w.length>=3&&/[a-z]/.test(w)&&/[A-Z]/.test(w.slice(1))){const pos=[];for(let k=1;k<w.length;k++)if(/[a-zA-Z]/.test(w[k]))pos.push(k);const k=pick(pos);const c=w[k];const nc=c===c.toUpperCase()?c.toLowerCase():c.toUpperCase();ws[i]=w.slice(0,k)+nc+w.slice(k+1);return ws.join(" ")}
    if(w.length>=3&&/^[A-Z]+$/.test(w)){ws[i]=w[0]+w.slice(1).toLowerCase();return ws.join(" ")}}
  for(const i of order){const w=ws[i];if(w.length>=5&&/^[a-z-]+$/i.test(w)){
    const opts=[];for(let k=1;k<w.length-2;k++)if(w[k]!==w[k+1]&&/[a-z]/.test(w[k])&&/[a-z]/.test(w[k+1]))opts.push(k);
    if(opts.length){const k=pick(opts);ws[i]=w.slice(0,k)+w[k+1]+w[k]+w.slice(k+2);return ws.join(" ")}}}
  return null}

/* ---------- formats ---------- */
const FORMATS={
  pmc:{name:"Prof-style multiple choice",d:"A word is missing from a slide sentence. Includes “Not in the choices”.",icon:"🎓",src:"c"},
  tmc:{name:"Which term?",d:"Read the meaning, pick the exact term.",icon:"🔤",src:"f"},
  cmc:{name:"Concept multiple choice",d:"Scenarios, examples, “Which is NOT…”.",icon:"🧩",src:"m"},
  tf:{name:"True or false",d:"One changed word can make it false.",icon:"✅",src:"t"},
  ctr:{name:"Find the counter",d:"Tap the word that makes a statement false.",icon:"🔍",src:"t",ok:u=>!u.tr},
  spell:{name:"Spelling & capitals",d:"Pick the exact spelling from the slides.",icon:"🔠",src:"s"},
  id:{name:"Identification (type)",d:"Read the meaning, type the term.",icon:"⌨️",src:"f"},
  fill:{name:"Fill in the blank (type)",d:"Type the missing word yourself.",icon:"✏️",src:"c"}
};
const SRCMAP={f:FACT,c:CLZ,t:TFS,m:MCS,s:SPL};
const PRESETS=[["exam","🎓 Exam mix",["pmc","tmc","cmc","tf","spell"]],["recall","🧠 Recall (typing)",["id","fill","ctr"]],["all","⭐ Everything",Object.keys(FORMATS)]];
const TYPE_NAME={pmc:"Missing word",tmc:"Which term",cmc:"Concept",tf:"True or false",ctr:"Find the counter",spell:"Spelling",id:"Identification",fill:"Fill in the blank"};

function blankOf(s){return esc(s).replace("___","<span class='blank'>&nbsp;</span>")}
function filled(s,a){return esc(s).replace("___","<b>"+esc(a)+"</b>")}
function mcBuild(u,fmt,qHTML,ans,ds,o){
  let choices,correct=ans,trap="";
  const useN=SET.nitc&&Math.random()<.6;
  if(useN&&Math.random()<.4){
    let wr=shuffle(ds).slice(0,3);
    if(!o.noVariant){const v=variant(ans);if(v&&v!==ans&&!ds.includes(v)&&Math.random()<.65){wr=shuffle(ds).slice(0,2).concat([v]);trap=v}}
    choices=shuffle(wr).concat([NITC]);correct=NITC}
  else if(useN)choices=shuffle([ans].concat(shuffle(ds).slice(0,2))).concat([NITC]);
  else choices=shuffle([ans].concat(shuffle(ds).slice(0,3)));
  return{u,fmt,type:"mc",topic:u.t,q:qHTML,ask:o.ask,choices,correct,ans,trap,clue:o.clue,explain:o.explain,sl:u.sl}}
function build(u,fmt){
  switch(fmt){
  case"pmc":return mcBuild(u,fmt,blankOf(u.s),u.ans,u.ds,{ask:"Choose the missing word",clue:u.clue,explain:filled(u.s,u.ans)});
  case"tmc":{let pool=FACT.filter(x=>x!==u&&x.g===u.g&&x.t===u.t&&norm(x.term)!==norm(u.term));
    if(pool.length<3)pool=pool.concat(shuffle(FACT.filter(x=>x!==u&&x.t===u.t&&x.g!==u.g&&norm(x.term)!==norm(u.term))));
    const ds=shuffle(pool.slice(0,8)).slice(0,3).map(x=>x.term);
    return mcBuild(u,fmt,"<span class='defq'>“"+esc(u.def)+"”</span>",u.term,ds,{ask:"Which term matches this meaning?",clue:u.clue,explain:"<b>"+esc(u.term)+"</b>: "+esc(u.def)})}
  case"cmc":return mcBuild(u,fmt,esc(u.q),u.ans,u.ds,{ask:"Multiple choice",clue:u.clue,explain:esc(u.ex),noVariant:true});
  case"spell":return mcBuild(u,fmt,"<span class='defq'>"+esc(u.what)+"</span>",u.ans,u.ds,{ask:"Which spelling is exactly as written in the slides?",clue:"Capital letters and spaces count. It's about: "+u.what+".",explain:"Exact spelling: <b>"+esc(u.ans)+"</b>",noVariant:true});
  case"tf":return{u,fmt,type:"tf",topic:u.t,q:esc(u.s),ask:"True or false?",choices:["True","False"],correct:u.tr?"True":"False",clue:u.clue,explain:tfExplain(u),sl:u.sl};
  case"ctr":return{u,fmt,type:"ctr",topic:u.t,q:"",ask:"This statement is FALSE. Tap the word that makes it false.",clue:u.clue,explain:tfExplain(u),sl:u.sl,correct:u.w};
  case"id":{const a=forms(u.term).concat(u.alts);return{u,fmt,type:"typed",topic:u.t,q:"<span class='defq'>“"+esc(u.def)+"”</span>",ask:"Identify the term",answers:a,strictAns:forms(u.term),official:u.term,clue:u.clue,explain:"<b>"+esc(u.term)+"</b>: "+esc(u.def),sl:u.sl,hint:"Type the term"}}
  case"fill":return{u,fmt,type:"typed",topic:u.t,q:blankOf(u.s),ask:"Type the missing word",answers:[u.ans].concat(u.alts),strictAns:[u.ans].concat(u.alts),official:u.ans,clue:u.clue,explain:filled(u.s,u.ans),sl:u.sl,hint:"Type the missing word or term"}}
}
function tfExplain(u){if(u.tr)return"<b>True.</b> This is what the slide says.";
  const fixed=esc(u.s).replace(esc(u.w),"<span class='fix'>"+esc(u.r)+"</span>");
  return"<b>False.</b> The counter: <span class='strike'>"+esc(u.w)+"</span> → <span class='fix'>"+esc(u.r)+"</span><br><span class='muted'>Correct statement:</span> "+fixed}

/* ---------- selection ---------- */
function pairs(fmts,topics){const out=[];fmts.forEach(f=>{const F=FORMATS[f];SRCMAP[F.src].forEach(u=>{if(topics.has(u.t)&&(!F.ok||F.ok(u)))out.push([u,f])})});return out}
function uniqueUnits(fmts,topics){const s=new Set();pairs(fmts,topics).forEach(p=>s.add(p[0].id));return s.size}
function prio(u){const r=S.srs[u.id];if(!r)return 1+Math.random();if(r.b===0)return Math.random()*.9;return 1.5+r.b+Math.random()}
function select(fmts,topics,n,smart){
  const ps=pairs(fmts,topics);const used=new Set(),out=[];
  if(smart){ps.map(p=>[p,prio(p[0])]).sort((a,b)=>a[1]-b[1]).forEach(([p])=>{if(out.length<n&&!used.has(p[0].id)){used.add(p[0].id);out.push(p)}});return shuffle(out)}
  const by={};fmts.forEach(f=>by[f]=[]);ps.forEach(p=>by[p[1]].push(p));
  const pools=fmts.map(f=>shuffle(by[f]));let i=0,guard=0;
  while(out.length<n&&pools.some(p=>p.length)&&guard<100000){const p=pools[i%pools.length];guard++;
    while(p.length){const c=p.pop();if(!used.has(c[0].id)){used.add(c[0].id);out.push(c);break}}i++}
  return shuffle(out)}

/* ---------- views & routing ---------- */
const VIEWS=["home","notes","traps","gloss","practice","setup","quiz","results","flash","list"];
const TOP={home:1,notes:1,traps:1,gloss:1,practice:1};
let cur="home";
function show(v){cur=v;VIEWS.forEach(x=>$("#v-"+x).hidden=x!==v);
  const nav=TOP[v]?v:"practice";$$("[data-go]").forEach(b=>{if(b.closest(".topnav,.tabbar"))b.setAttribute("aria-current",b.dataset.go===nav?"page":"false")});
  window.scrollTo({top:0});if(v==="home")renderHome();stopTimer()}
function go(v){if(TOP[v]){if(location.hash!=="#"+v)location.hash=v;else route()}else show(v)}
function route(){const h=location.hash.slice(1);const v=TOP[h]?h:"home";
  if(v==="notes")renderNotes();else if(v==="traps")renderTraps();else if(v==="gloss")renderGloss();else if(v==="practice")renderPractice();
  show(v)}
window.addEventListener("hashchange",route);
document.addEventListener("click",e=>{const b=e.target.closest("[data-go]");if(b){e.preventDefault();go(b.dataset.go)}});

/* theme */
function isDark(){return S.theme?S.theme==="dark":matchMedia("(prefers-color-scheme: dark)").matches}
function applyTheme(){if(S.theme)document.documentElement.setAttribute("data-theme",S.theme);else document.documentElement.removeAttribute("data-theme");$("#thmBtn").textContent=isDark()?"☀️":"🌙"}
$("#thmBtn").onclick=()=>{S.theme=isDark()?"light":"dark";save();applyTheme()};

/* ---------- home ---------- */
const TILES={
  notes:["📘","Reviewer","All lessons in the slides' wording. Recall mode hides key words.","go"],
  traps:["⚠️","Prof's traps","“Not in the choices”, counters, look-alikes, spelling.","go"],
  flash:["🃏","Flashcards","Flip, or type first, to memorize every term.","act"],
  list:["📋","List recall","Type every item of a list from memory.","act"],
  drill:["🎯","Drill","Instant feedback and a clue for every question.","act"],
  exam:["📝","Mock exam","Prof-style: answers revealed only at the end.","act"],
  smart:["🧠","Smart review","Your mistakes and unseen items first.","act"],
  weak:["💪","Train my weak spot","A quick drill on the lesson you know least.","act"],
  counter:["🔍","Find the counter","Spot the one word that makes it false.","act"],
  spellq:["🔠","Spelling drill","DBaaS or DBAAS? Train your eye.","act"],
  gloss:["📚","Glossary","Search every key term and its meaning.","go"]
};
function tile(k,hi){const t=TILES[k];return"<button class='tile card"+(hi?" hi":"")+"' "+(t[3]==="go"?"data-go='"+k+"'":"data-act='"+k+"'")+"><span class='ic' aria-hidden='true'>"+t[0]+"</span><h3>"+t[1]+"</h3><p>"+t[2]+"</p></button>"}
function renderHome(){
  $("#tiles").innerHTML=["notes","traps","flash","list","drill","exam","smart","gloss"].map((k,i)=>tile(k,i===0)).join("");
  const avg=readiness();$("#ring").style.setProperty("--p",avg);$("#ringPct").textContent=avg+"%";
  $("#mast").innerHTML=TK.map(t=>{const v=readiness(t);return"<div class='mrow tp-"+t+"'><span>"+T[t].icon+" "+T[t].short+"</span><span class='tr'><i style='width:"+v+"%'></i></span><span>"+v+"%</span></div>"}).join("")}
function renderPractice(){$("#pTiles").innerHTML=["drill","exam","smart","flash","list","weak","counter","spellq"].map((k,i)=>tile(k,i===1)).join("")}
let resetArm=null;
$("#resetBtn").onclick=e=>{const b=e.currentTarget;if(b.dataset.arm){clearTimeout(resetArm);S.srs={};S.studied={};save();b.textContent="Progress cleared";delete b.dataset.arm;renderHome();setTimeout(()=>b.textContent="Reset my progress",1500)}
  else{b.dataset.arm=1;b.textContent="Tap again to confirm";resetArm=setTimeout(()=>{delete b.dataset.arm;b.textContent="Reset my progress"},3000)}};
document.addEventListener("click",e=>{const b=e.target.closest("[data-act]");if(!b)return;const a=b.dataset.act;
  if(a==="drill"||a==="exam"||a==="smart"||a==="flash"||a==="list")openSetup(a);
  else if(a==="counter")openSetup("drill",["ctr"]);
  else if(a==="spellq")openSetup("drill",["spell"]);
  else if(a==="weak"){let w=TK[0],lo=1e9;TK.forEach(t=>{const x=readiness(t)+Math.random();if(x<lo){lo=x;w=t}});
    SET.fmts=new Set(PRESETS[0][2]);startQuiz("drill",15,new Set([w]),"Weak spot: "+T[w].short,null,true)}});

/* ---------- notes ---------- */
let nf="all";
const NF=[["all","⭐ All lessons combined",TK],["v1","Volume 1",["a","b","c"]],["v2","Volume 2",["d","e"]]].concat(TK.map(t=>[t,T[t].icon+" "+T[t].short,[t]]));
function renderNotes(){
  $("#nFilter").innerHTML=NF.map(f=>"<button class='pill"+(f[2].length===1?" tp tp-"+f[0]:"")+"' aria-pressed='"+(nf===f[0])+"' data-nf='"+f[0]+"'>"+f[1]+"</button>").join("");
  const tks=NF.find(f=>f[0]===nf)[2];
  let total=0,done=0,html="";
  tks.forEach(t=>{const secs=D.NOTES[t];const dn=secs.filter((s,i)=>S.studied[t+i]).length;total+=secs.length;done+=dn;
    html+="<div class='thead tp-"+t+"'><h3>"+T[t].icon+" "+T[t].name+"</h3><p>"+T[t].part+" · "+T[t].slides+" · "+dn+"/"+secs.length+" studied</p></div>";
    html+=secs.map((s,i)=>{const k=t+i;return"<details class='sec card tp-"+t+(S.studied[k]?" done":"")+"' data-k='"+k+"'"+(tks.length===1&&i===0?" open":"")+"><summary><span class='done-dot' aria-hidden='true'>✓</span><span class='h'>"+esc(s.h)+"<small>"+slideTxt(s.sl)+"</small></span></summary><div class='body'>"+md(s.b)+
      "<div class='secacts'><button class='btn sm"+(S.studied[k]?" good":"")+"' data-study='"+k+"'>"+(S.studied[k]?"✓ Studied":"Mark as studied")+"</button><button class='btn sm ghost' data-quick='"+t+"'>Quick drill: "+T[t].short+" ▶</button></div></div></details>"}).join("")});
  $("#notesList").innerHTML=html;
  $("#notesSub").textContent=done+" of "+total+" sections studied";
  $("#notesList").classList.toggle("recall",!!S.recall);$("#recallTog").setAttribute("aria-pressed",!!S.recall)}
$("#nFilter").onclick=e=>{const b=e.target.closest("[data-nf]");if(b){nf=b.dataset.nf;renderNotes()}};
$("#recallTog").onclick=()=>{S.recall=!S.recall;save();$("#notesList").classList.toggle("recall",S.recall);$("#recallTog").setAttribute("aria-pressed",S.recall);$$("#notesList .k.shown").forEach(k=>k.classList.remove("shown"))};
$("#expandAll").onclick=()=>$$("#notesList details").forEach(d=>d.open=true);
$("#collapseAll").onclick=()=>$$("#notesList details").forEach(d=>d.open=false);
$("#notesList").onclick=e=>{
  const k=e.target.closest(".recall .k");if(k){k.classList.toggle("shown");return}
  const st=e.target.closest("[data-study]");if(st){const key=st.dataset.study;S.studied[key]=!S.studied[key];save();const d=st.closest("details");d.classList.toggle("done",!!S.studied[key]);st.classList.toggle("good",!!S.studied[key]);st.textContent=S.studied[key]?"✓ Studied":"Mark as studied";
    const t=key[0],secs=D.NOTES[t],dn=secs.filter((s,i)=>S.studied[t+i]).length;const th=$$(".thead.tp-"+t+" p")[0];if(th)th.textContent=T[t].part+" · "+T[t].slides+" · "+dn+"/"+secs.length+" studied";
    const tks=NF.find(f=>f[0]===nf)[2];let tot=0,dd=0;tks.forEach(x=>{D.NOTES[x].forEach((s,i)=>{tot++;if(S.studied[x+i])dd++})});$("#notesSub").textContent=dd+" of "+tot+" sections studied";return}
  const q=e.target.closest("[data-quick]");if(q){SET.fmts=new Set(PRESETS[0][2]);startQuiz("drill",10,new Set([q.dataset.quick]),"Quick drill: "+T[q.dataset.quick].short,null,true)}};

/* ---------- traps ---------- */
let trapTab="nitc",trapT="all";
const TRAP_TABS=[["nitc","🎯 Not in the choices"],["ctr","🔁 Counters"],["pairs","👯 Look-alikes"],["spell","🔠 Spelling"]];
function topicPills(curT,attr){return"<div class='pills scroll bleed' style='margin-top:12px;margin-bottom:12px'><button class='pill' aria-pressed='"+(curT==="all")+"' "+attr+"='all'>All lessons</button>"+TK.map(t=>"<button class='pill tp tp-"+t+"' aria-pressed='"+(curT===t)+"' "+attr+"='"+t+"'>"+T[t].icon+" "+T[t].short+"</button>").join("")+"</div>"}
function renderTraps(){
  $("#trapTabs").innerHTML=TRAP_TABS.map(x=>"<button class='pill' role='tab' aria-selected='"+(trapTab===x[0])+"' data-tt='"+x[0]+"'>"+x[1]+"</button>").join("");
  const B=$("#trapBody");const inT=x=>trapT==="all"||x===trapT;
  if(trapTab==="nitc"){
    B.innerHTML="<div class='rule card'><h3>How to beat “Not in the choices”</h3><ol class='body' style='padding-left:20px;margin:0'>"+
    "<li><b>Answer first, look second.</b> Read the sentence and say the exact slide word in your head <em>before</em> reading the options.</li>"+
    "<li><b>Scan all four options</b> for that exact word, letter by letter: capitals (<b>DBaaS</b> ≠ DBAAS), hyphens (<b>One-to-many</b>), plurals (<b>schemas</b>).</li>"+
    "<li><b>Exact word is there?</b> Pick it. Never choose “Not in the choices” just because another option also sounds right.</li>"+
    "<li><b>Only a misspelled or wrongly capitalized version is there, or it's missing?</b> → <b>Not in the choices</b>.</li>"+
    "<li><b>Synonyms don't count.</b> The prof follows the PDF wording. “rules” is not “requirements”, “completely” is not “exclusively”.</li></ol></div>"+
    "<div class='rule card'><h3>Example</h3><p class='body' style='margin:0'>Data validation is the process of checking whether submitted information meets the <span class='blank'>&nbsp;</span> established by an application.</p>"+
    "<div class='demo'><div>A. rules</div><div>B. standards</div><div>C. requirments</div><div class='y'>D. Not in the choices ✓</div></div>"+
    "<p class='muted small' style='margin:0'>The slide word is <b>requirements</b>. Option C is misspelled, so the answer is D.</p></div>"+
    "<div class='row'><button class='btn pri' data-practice='pmc'>Practice missing-word questions ▶</button></div>"}
  else if(trapTab==="ctr"){
    const list=D.TRAPS.filter(x=>inT(x[0]));
    B.innerHTML="<p class='muted'>In true or false, the prof changes <b>one word</b> to make a statement false. These are his favorite counters.</p>"+topicPills(trapT,"data-trt")+
      list.map(x=>"<div class='trapc card tp-"+x[0]+"'><span class='chip'>"+T[x[0]].short+"</span> <span class='chip sl'>"+slideTxt(x[1])+"</span><div class='no' style='margin-top:8px'>"+esc(x[2])+"</div><div class='yes'>✅ "+esc(x[3])+"</div></div>").join("")+
      "<div class='row' style='margin-top:12px'><button class='btn pri' data-practice='ctr'>Practice: find the counter ▶</button><button class='btn' data-practice='tf'>True or false drill ▶</button></div>"}
  else if(trapTab==="pairs"){
    const list=D.PAIRS.filter(x=>inT(x[0]));
    B.innerHTML="<p class='muted'>Terms that look alike. Know exactly what separates them.</p>"+topicPills(trapT,"data-trt")+
      list.map(x=>"<div class='trapc card tp-"+x[0]+"'><b>"+esc(x[1])+"</b> <span class='muted'>vs</span> <b>"+esc(x[2])+"</b><div class='yes muted'>"+esc(x[3])+"</div></div>").join("")+
      "<div class='row' style='margin-top:12px'><button class='btn pri' data-practice='tmc'>Practice: which term? ▶</button></div>"}
  else{
    const list=D.SPELL.filter(x=>inT(x[0]));
    B.innerHTML="<p class='muted'>The prof is strict with spelling and capitals. Correct spelling in <b>bold</b>, common wrong versions crossed out.</p>"+topicPills(trapT,"data-trt")+
      "<div class='spl'>"+list.map(x=>"<div class='card tp-"+x[0]+"'><b>"+esc(x[2])+"</b><div class='small muted'>"+esc(x[4])+"</div><div class='small' style='margin-top:4px'>"+x[3].map(w=>"<s>"+esc(w)+"</s>").join("")+"</div></div>").join("")+"</div>"+
      "<div class='row' style='margin-top:12px'><button class='btn pri' data-practice='spell'>Practice spelling ▶</button></div>"}}
$("#trapTabs").onclick=e=>{const b=e.target.closest("[data-tt]");if(b){trapTab=b.dataset.tt;renderTraps()}};
$("#trapBody").onclick=e=>{const b=e.target.closest("[data-trt]");if(b){trapT=b.dataset.trt;renderTraps();return}
  const p=e.target.closest("[data-practice]");if(p)openSetup("drill",[p.dataset.practice])};

/* ---------- glossary ---------- */
let glT="all";
function renderGloss(){
  $("#glTopics").innerHTML="<button class='pill' aria-pressed='"+(glT==="all")+"' data-gt='all'>All lessons</button>"+TK.map(t=>"<button class='pill tp tp-"+t+"' aria-pressed='"+(glT===t)+"' data-gt='"+t+"'>"+T[t].icon+" "+T[t].short+"</button>").join("");
  const q=$("#glSearch").value.trim().toLowerCase();
  const list=FACT.filter(f=>(glT==="all"||f.t===glT)&&(!q||(f.term+" "+f.def+" "+f.alts.join(" ")).toLowerCase().includes(q))).sort((a,b)=>a.term.localeCompare(b.term));
  const hl=s=>{s=esc(s);if(!q)return s;const eq=esc(q),i=s.toLowerCase().indexOf(eq);return i<0?s:s.slice(0,i)+"<mark>"+s.slice(i,i+eq.length)+"</mark>"+s.slice(i+eq.length)};
  $("#glCount").textContent=list.length+" term"+(list.length===1?"":"s");
  $("#glList").innerHTML=list.length?list.map(f=>"<div class='gi card tp-"+f.t+"'><b>"+hl(f.term)+"</b><p>"+hl(f.def)+"</p><span class='chip'>"+T[f.t].short+"</span> <span class='chip sl'>"+slideTxt(f.sl)+"</span></div>").join(""):"<p class='muted'>No match. Try another word.</p>"}
$("#glTopics").onclick=e=>{const b=e.target.closest("[data-gt]");if(b){glT=b.dataset.gt;renderGloss()}};
$("#glSearch").oninput=renderGloss;

/* ---------- setup ---------- */
let SET={mode:"drill",fmts:new Set(PRESETS[0][2]),topics:new Set(TK),count:20,nitc:S.prefs.nitc,strict:S.prefs.strict};
const MODE_TXT={drill:["🎯 Drill","You see the answer and explanation after every question."],exam:["📝 Mock exam","Prof-style. Answers are revealed only at the end, like the real exam."],smart:["🧠 Smart review","Your past mistakes come first, then items you have never seen."],flash:["🃏 Flashcards","Flip a card, then sort it: still learning or I know it."],list:["📋 List recall","Type every item of a list from memory, then check."]};
function openSetup(mode,fmts){SET.mode=mode;
  if(fmts)SET.fmts=new Set(fmts);else if(mode==="exam")SET.fmts=new Set(PRESETS[0][2]);else if(mode==="smart")SET.fmts=new Set(Object.keys(FORMATS));
  $("#setupTitle").textContent=MODE_TXT[mode][0];$("#setupSub").textContent=MODE_TXT[mode][1];
  const q=mode!=="flash"&&mode!=="list";
  $("#fmtBox").hidden=!q;$("#optBox").hidden=!q;$("#flashBox").hidden=mode!=="flash";$("#timerRow").hidden=mode!=="exam";
  $("#lblTopics").textContent=mode==="list"?"1":"2";$("#lblCount").textContent=mode==="list"?"2":"3";
  $("#optNitc").checked=S.prefs.nitc;$("#optStrict").checked=S.prefs.strict;$("#optTimer").checked=S.prefs.timer;$("#typeFirst").checked=S.prefs.typeFirst;
  if(mode==="exam"&&SET.count<20)SET.count=20;if(mode==="exam"&&SET.count>100)SET.count=50;
  renderSetup();show("setup")}
function maxAvail(){if(SET.mode==="flash")return FACT.filter(f=>SET.topics.has(f.t)).length;if(SET.mode==="list")return LST.filter(l=>SET.topics.has(l.t)).length;return uniqueUnits([...SET.fmts],SET.topics)}
function sameSet(a,b){return a.size===b.length&&b.every(x=>a.has(x))}
function renderSetup(){
  $("#presetPills").innerHTML=PRESETS.map(p=>"<button class='pill' aria-pressed='"+sameSet(SET.fmts,p[2])+"' data-preset='"+p[0]+"'>"+p[1]+"</button>").join("");
  $("#fmts").innerHTML=Object.keys(FORMATS).map(k=>"<button class='fmt' aria-pressed='"+SET.fmts.has(k)+"' data-fmt='"+k+"'><b>"+FORMATS[k].icon+" "+FORMATS[k].name+"</b><span>"+FORMATS[k].d+"</span></button>").join("");
  $("#dirPills").innerHTML=[["tm","Term → Meaning"],["mt","Meaning → Term"],["mix","Mixed"]].map(d=>"<button class='pill' aria-pressed='"+(S.prefs.dir===d[0])+"' data-dir='"+d[0]+"'>"+d[1]+"</button>").join("");
  $("#topicPills").innerHTML=NF.map(f=>"<button class='pill"+(f[2].length===1?" tp tp-"+f[0]:"")+"' aria-pressed='"+sameSet(SET.topics,f[2])+"' data-topic='"+f[0]+"'>"+f[1]+"</button>").join("");
  $$("#topicPills [data-topic]").forEach(b=>{const t=b.dataset.topic;if(T[t])b.setAttribute("aria-pressed",SET.topics.has(t))});
  const max=maxAvail();if(SET.count>max)SET.count=Math.max(1,max);
  const opts=SET.mode==="list"?[3,5,10,20]:[5,10,20,30,50,100];
  $("#countPills").innerHTML=opts.filter(n=>n<max).map(n=>"<button class='pill' aria-pressed='"+(SET.count===n)+"' data-count='"+n+"'>"+n+"</button>").join("")+"<button class='pill' aria-pressed='"+(SET.count===max)+"' data-count='"+max+"'>All ("+max+")</button>";
  $("#countIn").value=SET.count;$("#countIn").max=max;
  $("#availNote").textContent=max+(SET.mode==="list"?" lists":SET.mode==="flash"?" cards":" items")+" available";
  $("#startBtn").disabled=!SET.topics.size||max<1||(!SET.fmts.size&&SET.mode!=="flash"&&SET.mode!=="list");
  $("#startBtn").textContent=SET.mode==="flash"?"Start flipping ▶":SET.mode==="list"?"Start recalling ▶":"Start ▶"}
$("#presetPills").onclick=e=>{const b=e.target.closest("[data-preset]");if(b){SET.fmts=new Set(PRESETS.find(p=>p[0]===b.dataset.preset)[2]);renderSetup()}};
$("#fmts").onclick=e=>{const b=e.target.closest("[data-fmt]");if(b){const f=b.dataset.fmt;SET.fmts.has(f)?SET.fmts.delete(f):SET.fmts.add(f);renderSetup()}};
$("#dirPills").onclick=e=>{const b=e.target.closest("[data-dir]");if(b){S.prefs.dir=b.dataset.dir;save();renderSetup()}};
$("#countPills").onclick=e=>{const b=e.target.closest("[data-count]");if(b){SET.count=+b.dataset.count;renderSetup()}};
$("#countIn").oninput=e=>{const v=parseInt(e.target.value,10);if(v>0){SET.count=Math.min(v,maxAvail());$$("#countPills .pill").forEach(p=>p.setAttribute("aria-pressed",+p.dataset.count===SET.count))}};
$("#topicPills").onclick=e=>{const b=e.target.closest("[data-topic]");if(!b)return;const t=b.dataset.topic;
  if(T[t]){SET.topics.has(t)?SET.topics.delete(t):SET.topics.add(t)}else SET.topics=new Set(NF.find(f=>f[0]===t)[2]);renderSetup()};
$("#optNitc").onchange=e=>{S.prefs.nitc=e.target.checked;save()};
$("#optStrict").onchange=e=>{S.prefs.strict=e.target.checked;save()};
$("#optTimer").onchange=e=>{S.prefs.timer=e.target.checked;save()};
$("#typeFirst").onchange=e=>{S.prefs.typeFirst=e.target.checked;save()};
$("#startBtn").onclick=()=>{const n=Math.max(1,SET.count||10);
  if(SET.mode==="flash")startFlash(n,SET.topics);else if(SET.mode==="list")startList(n,SET.topics);
  else startQuiz(SET.mode==="smart"?"drill":SET.mode,n,new Set(SET.topics),SET.mode==="smart"?"Smart review":null,null,SET.mode==="smart")};

/* ---------- quiz engine ---------- */
let Q=null,timerI=null;
const PRAISE=["Correct! 🎉","Nice one! 🌟","You got it! 💪","Exactly! ✨","Great! ☁️"];
const OOPS=["Not quite. Here's the answer:","Almost! Check this one:","Oops! Learn this one:"];
function stopTimer(){if(timerI&&cur!=="quiz"){clearInterval(timerI);timerI=null}}
function startQuiz(mode,n,topics,label,list,smart){
  SET.nitc=S.prefs.nitc;SET.strict=S.prefs.strict;
  const qs=list||select([...SET.fmts],topics,n,!!smart).map(p=>build(p[0],p[1]));
  if(!qs.length)return;
  Q={mode,topics,label,n:qs.length,list:qs,i:0,score:0,clues:0,correct:0,log:[],t0:Date.now(),fmts:new Set(SET.fmts),smart:!!smart};
  show("quiz");
  if(timerI){clearInterval(timerI);timerI=null}
  const useT=mode==="exam"&&S.prefs.timer;$("#sTimer").hidden=!useT;
  if(useT){const lim=Q.n*60;const tick=()=>{const s=Math.round((Date.now()-Q.t0)/1000);const m=Math.floor(s/60),r=s%60;$("#sTimer").textContent="⏱ "+m+":"+String(r).padStart(2,"0")+" / "+Math.floor(lim/60)+":00";$("#sTimer").style.color=s>lim?"var(--bad)":""};tick();timerI=setInterval(tick,1000)}
  renderQ()}
function clueBtn(){return"<div class='qacts'><button class='btn sm' id='clueBtn'>💡 Show clue</button></div>"}
function renderQ(){const q=Q.list[Q.i];Q.clueUsed=false;Q.done=false;
  $("#qcard").className="qcard card tp-"+q.topic;
  $("#progFill").style.width=(Q.i/Q.n*100)+"%";$("#qCount").textContent=(Q.i+1)+" / "+Q.n;
  $("#sScore").textContent=Q.mode==="drill"?"⭐ "+Q.score+" pts":"Answered "+Q.i;
  $("#sMode").textContent=Q.label||(Q.mode==="exam"?"📝 Mock exam":"🎯 Drill");
  $("#qmeta").innerHTML="<span class='chip'>"+T[q.topic].icon+" "+T[q.topic].short+"</span><span class='chip sl'>"+TYPE_NAME[q.fmt]+"</span>";
  $("#qtext").innerHTML="<span class='ask'>"+esc(q.ask)+"</span>"+q.q;
  $("#qclue").innerHTML="";$("#qfb").innerHTML="";
  const A=$("#qans");
  if(q.type==="mc"||q.type==="tf"){
    A.innerHTML="<div class='choices "+(q.type==="tf"?"tf":"two")+"'>"+q.choices.map((c,i)=>"<button class='choice"+(c===NITC?" nitc":"")+"' data-i='"+i+"'>"+(q.type==="tf"?"":"<span class='k'>"+"ABCD"[i]+"</span>")+"<span>"+esc(c)+"</span></button>").join("")+"</div>"+clueBtn();
    A.querySelectorAll(".choice").forEach(b=>b.onclick=()=>{if(Q.done)return;const c=q.choices[+b.dataset.i],ok=c===q.correct;
      A.querySelectorAll(".choice").forEach(x=>x.disabled=true);
      if(Q.mode==="drill"){A.querySelectorAll(".choice").forEach(x=>{if(q.choices[+x.dataset.i]===q.correct)x.classList.add("ok")});if(!ok)b.classList.add("no")}else b.classList.add("picked");
      answer(ok,c)})}
  else if(q.type==="ctr"){
    const s=q.u.s;let idx=s.indexOf(q.u.w);if(idx<0)idx=s.toLowerCase().indexOf(q.u.w.toLowerCase());const end=idx+q.u.w.length;
    const toks=[];s.replace(/\S+/g,(m,off)=>{toks.push({m,off,end:off+m.length});return m});
    q.toks=toks.map(t=>({m:t.m,hit:t.off<end&&t.end>idx}));
    A.innerHTML="<div class='words'>"+q.toks.map((t,i)=>"<button class='word' data-w='"+i+"'>"+esc(t.m)+"</button>").join("")+"</div>"+clueBtn();
    A.querySelectorAll(".word").forEach(b=>b.onclick=()=>{if(Q.done)return;const t=q.toks[+b.dataset.w],ok=t.hit;
      A.querySelectorAll(".word").forEach(x=>{x.disabled=true;if(Q.mode==="drill"&&q.toks[+x.dataset.w].hit)x.classList.add("span")});
      b.classList.add(Q.mode==="drill"?(ok?"ok":"no"):"picked");if(Q.mode!=="drill")b.style.borderColor="var(--pri)";
      answer(ok,t.m)})}
  else{A.innerHTML="<div class='typed'><div class='in'><input id='ansIn' autocomplete='off' autocapitalize='off' autocorrect='off' spellcheck='false' placeholder='Your answer' aria-label='Your answer'><button class='btn pri' id='chkBtn'>Check</button></div><div class='hintline'>"+esc(q.hint)+(SET.strict?" · strict spelling is ON":"")+"</div></div>"+clueBtn();
    const inp=$("#ansIn");setTimeout(()=>{try{inp.focus({preventScroll:true})}catch(e){}},60);
    const goC=()=>{if(Q.done)return;const v=inp.value.trim();if(!v){inp.classList.add("shake");setTimeout(()=>inp.classList.remove("shake"),400);return}
      const r=checkTyped(v,q);q.exact=r.exact;inp.disabled=true;$("#chkBtn").disabled=true;if(Q.mode==="drill")inp.classList.add(r.ok?"ok":"no");answer(r.ok,v)};
    $("#chkBtn").onclick=goC;inp.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();e.stopPropagation();goC()}}}
  const cb=$("#clueBtn");cb.onclick=()=>{if(Q.done||Q.clueUsed)return;Q.clueUsed=true;Q.clues++;cb.disabled=true;$("#qclue").innerHTML="<div class='clue'><b>💡 Clue:</b> "+esc(q.clue)+"</div>"}}
function nitcNote(q,user){
  if(q.type!=="mc")return"";
  if(q.correct===NITC)return"<p>🎯 The exact answer <b>“"+esc(q.ans)+"”</b> was not among the choices"+(q.trap?". <b>“"+esc(q.trap)+"”</b> looks right, but its spelling or capitalization is wrong":"")+", so the answer is <b>Not in the choices</b>.</p>";
  if(user===NITC)return"<p>⚠️ The exact answer <b>was</b> in the choices (letter "+"ABCD"[q.choices.indexOf(q.correct)]+"). Read every option before choosing “Not in the choices”.</p>";
  return""}
function answer(ok,user){Q.done=true;const q=Q.list[Q.i];const cb=$("#clueBtn");if(cb)cb.disabled=true;
  const pts=ok?(Q.clueUsed?5:10):0;if(ok){Q.correct++;Q.score+=pts}
  mark(q.u,ok,Q.clueUsed);
  Q.log.push({q,ok,user,clue:Q.clueUsed});
  const last=Q.i===Q.n-1;
  const btn="<div class='qacts'><button class='btn pri' id='nextBtn'>"+(last?"See my results 🏁":"Next ▶")+"</button></div>";
  const right=q.type==="typed"?q.official:q.type==="ctr"?q.u.w:q.correct;
  if(Q.mode==="drill"){
    if(!ok){$("#qcard").classList.add("shake");setTimeout(()=>$("#qcard").classList.remove("shake"),400)}
    let spellNote="";if(ok&&q.type==="typed"&&!q.exact)spellNote="<p>✍️ Accepted, but on the exam write it exactly: <b>"+esc(q.official)+"</b></p>";
    $("#qfb").innerHTML="<div class='fb "+(ok?"ok":"no")+"'><h3>"+(ok?pick(PRAISE):pick(OOPS))+"</h3>"+(ok?"":"<p>Correct answer: <b>"+esc(right)+"</b></p>")+nitcNote(q,user)+spellNote+"<p>"+q.explain+"</p><p><span class='chip sl'>📄 "+slideTxt(q.sl)+"</span>"+(Q.clueUsed&&ok?" <span class='chip sl'>half points (clue used)</span>":"")+"</p>"+btn+"</div>"}
  else $("#qfb").innerHTML="<div class='fb saved'><h3>Answer saved ✔</h3><p class='muted'>You'll see the correct answers at the end.</p>"+btn+"</div>";
  $("#sScore").textContent=Q.mode==="drill"?"⭐ "+Q.score+" pts":"Answered "+(Q.i+1);
  const nb=$("#nextBtn");nb.onclick=next;
  setTimeout(()=>{try{nb.focus({preventScroll:true})}catch(e){}$("#qfb").scrollIntoView({behavior:"smooth",block:"nearest"})},80)}
function next(){if(!Q||!Q.done)return;if(Q.i===Q.n-1)results();else{Q.i++;renderQ();window.scrollTo({top:0,behavior:"smooth"})}}
let armT=null;
$("#quitBtn").onclick=e=>{const b=e.currentTarget;if(b.classList.contains("arm")){clearTimeout(armT);b.classList.remove("arm");b.textContent="✕";if(Q&&Q.log.length)results();else go("practice")}
  else{b.classList.add("arm");b.textContent=Q&&Q.log.length?"End & see results?":"Quit?";armT=setTimeout(()=>{b.classList.remove("arm");b.textContent="✕"},2500)}};
document.addEventListener("keydown",e=>{if($("#v-quiz").hidden||!Q)return;if(e.target.tagName==="INPUT"&&!Q.done)return;
  const q=Q.list[Q.i];const k=e.key.toLowerCase();
  if(Q.done){if(k==="enter"){e.preventDefault();next()}return}
  let i=-1;if(q.type==="mc"){i="abcd".indexOf(k);if(i<0)i="1234".indexOf(k)}else if(q.type==="tf")i=k==="t"?0:k==="f"?1:-1;
  if(i>=0){const b=document.querySelector(".choice[data-i='"+i+"']");if(b)b.click()}});

function results(){if(timerI){clearInterval(timerI);timerI=null}
  const done=Q.log.length,pct=done?Math.round(Q.correct/done*100):0,secs=Math.round((Date.now()-Q.t0)/1000);
  $("#rPct").textContent=pct+"%";
  $("#rMsg").textContent=pct===100?"Perfect! You're exam-ready 🏆":pct>=85?"Excellent! Almost there 🎉":pct>=70?"Good job. Fix the few you missed 💪":pct>=50?"Getting there. Review the mistakes below 📘":"Keep going. Read the notes, then try again ☁️";
  const byT={};Q.log.forEach(l=>{const t=l.q.topic;(byT[t]=byT[t]||{a:0,c:0});byT[t].a++;if(l.ok)byT[t].c++});
  $("#rStats").innerHTML="<span class='stat'>✅ "+Q.correct+" / "+done+" correct</span>"+(Q.mode==="drill"?"<span class='stat'>⭐ "+Q.score+" pts</span>":"")+"<span class='stat'>💡 "+Q.clues+" clue"+(Q.clues===1?"":"s")+"</span><span class='stat'>⏱ "+Math.floor(secs/60)+"m "+(secs%60)+"s</span>"+Object.keys(byT).map(t=>"<span class='stat'>"+T[t].icon+" "+T[t].short+": "+byT[t].c+"/"+byT[t].a+"</span>").join("");
  const wrong=Q.log.filter(l=>!l.ok);$("#redoWrong").hidden=!wrong.length;$("#revTtl").hidden=!wrong.length;
  $("#review").innerHTML=wrong.map(l=>{const q=l.q;const right=q.type==="typed"?q.official:q.type==="ctr"?q.u.w+" → "+q.u.r:q.correct;
    const qtxt=q.type==="ctr"?esc(q.u.s):q.q;
    return"<div class='rv card tp-"+q.topic+"'><span class='chip'>"+T[q.topic].short+"</span> <span class='chip sl'>"+TYPE_NAME[q.fmt]+"</span> <span class='chip sl'>📄 "+slideTxt(q.sl)+"</span><div class='q'>"+qtxt+"</div><div class='a'><span class='y'>Your answer: "+esc(l.user)+"</span><span class='c'>Correct: "+esc(right)+"</span>"+nitcNote(q,l.user)+"<span>"+q.explain+"</span></div></div>"}).join("");
  show("results")}
$("#againBtn").onclick=()=>{const m=Q;SET.fmts=m.fmts;startQuiz(m.mode,m.n,m.topics,m.label,null,m.smart)};
$("#redoWrong").onclick=()=>{const list=Q.log.filter(l=>!l.ok).map(l=>build(l.q.u,l.q.fmt));const m=Q;startQuiz("drill",list.length,m.topics,"Practice my mistakes",shuffle(list))};

/* ---------- flashcards ---------- */
let FL=null;
function startFlash(n,topics){const deck=FACT.filter(f=>topics.has(f.t)).map(u=>[u,prio(u)]).sort((a,b)=>a[1]-b[1]).slice(0,n).map(x=>x[0]);
  FL={deck:shuffle(deck),i:0,known:0,learning:[],total:deck.length};show("flash");renderFlash()}
function renderFlash(){const A=$("#fArea");
  if(FL.i>=FL.deck.length){$("#fProg").style.width="100%";$("#fCount").textContent=FL.total+" / "+FL.total;const l=FL.learning;
    A.innerHTML="<div class='res card' style='margin-top:16px'><div style='font-size:46px'>🃏</div><h2>Deck done!</h2><p style='margin:0'>You knew <b>"+FL.known+"</b> of "+FL.total+" right away.</p>"+(l.length?"<p class='muted' style='margin:0'>Still learning: "+l.map(c=>esc(c.term)).join(", ")+"</p>":"")+"<div class='row center'>"+(l.length?"<button class='btn pri' id='fAgain'>Review “still learning” cards</button>":"")+"<button class='btn' id='fNew'>New deck</button><button class='btn ghost' data-go='home'>Home</button></div></div>";
    if(l.length)$("#fAgain").onclick=()=>{FL={deck:shuffle(l),i:0,known:0,learning:[],total:l.length};renderFlash()};$("#fNew").onclick=()=>openSetup("flash");return}
  const c=FL.deck[FL.i];const dir=S.prefs.dir==="mix"?(Math.random()<.5?"tm":"mt"):S.prefs.dir;
  $("#fProg").style.width=(FL.i/FL.deck.length*100)+"%";$("#fCount").textContent=(FL.i+1)+" / "+FL.deck.length;
  const termF="<div><span class='chip'>"+T[c.t].icon+" "+T[c.t].short+"</span><div class='big' style='margin-top:12px'>"+esc(c.term)+"</div></div>";
  const defF="<div><span class='chip'>"+T[c.t].icon+" "+T[c.t].short+"</span><div style='margin-top:12px'>"+esc(c.def)+"</div></div>";
  const front=dir==="tm"?termF:defF,back=(dir==="tm"?"<div>"+esc(c.def)+"</div>":"<div class='big'>"+esc(c.term)+"</div>")+"<div style='margin-top:10px'><span class='chip sl'>📄 "+slideTxt(c.sl)+"</span></div>";
  const tf=S.prefs.typeFirst;
  A.innerHTML="<div class='flip tp-"+c.t+"'><button class='fcard' id='fc' aria-label='Flip card'><div class='face f'>"+front+"<span class='tapnote'>"+(tf?"Type your answer below first":"Tap to flip 🔄")+"</span></div><div class='face b'><div><div id='fYour'></div>"+back+"</div><span class='tapnote'>Tap to flip back</span></div></button></div>"+
    (tf?"<div class='fin' id='finRow'><input id='fIn' placeholder='"+(dir==="tm"?"What does it mean? (key words)":"Which term is it?")+"' autocomplete='off' spellcheck='false' aria-label='Your answer'><button class='btn pri' id='fChk'>Flip</button></div>":"")+
    "<div class='row center' style='margin-top:16px'><button class='btn' id='fNo'>😅 Still learning</button><button class='btn good' id='fYes'>😎 I know it</button></div>";
  const fc=$("#fc");
  const flip=()=>{if(tf&&!fc.classList.contains("on")){const v=$("#fIn").value.trim();if(v){$("#fYour").innerHTML="<p class='small muted' style='margin:0 0 8px'>You wrote: <b>"+esc(v)+"</b></p>"}}fc.classList.toggle("on")};
  fc.onclick=flip;
  if(tf){$("#fChk").onclick=flip;$("#fIn").onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();flip()}};setTimeout(()=>{try{$("#fIn").focus({preventScroll:true})}catch(e){}},60)}
  $("#fYes").onclick=()=>{mark(c,true,false);FL.known++;FL.i++;renderFlash()};
  $("#fNo").onclick=()=>{mark(c,false,false);if(!FL.learning.includes(c))FL.learning.push(c);FL.i++;renderFlash()}}
document.addEventListener("keydown",e=>{if($("#v-flash").hidden||e.target.tagName==="INPUT")return;if(e.key===" "&&$("#fc")){e.preventDefault();$("#fc").click()}});

/* ---------- list recall ---------- */
let LS=null;
function startList(n,topics){const deck=LST.filter(l=>topics.has(l.t)).map(u=>[u,prio(u)]).sort((a,b)=>a[1]-b[1]).slice(0,n).map(x=>x[0]);
  LS={deck:shuffle(deck),i:0,got:0,tot:0,res:[]};show("list");renderList()}
function matchItem(lines,it){const ks=it.keys.map(norm).filter(Boolean);
  return lines.some(l=>{const u=norm(l);if(!u)return false;return ks.some(k=>u===k||(k.length>=3&&u.includes(k))||(u.length>=4&&k.includes(u)&&u.length>=k.length*.5)||(tol(k)>0&&lev(u,k)<=tol(k)))})}
function renderList(){const A=$("#lArea");
  if(LS.i>=LS.deck.length){$("#lProg").style.width="100%";$("#lCount").textContent=LS.deck.length+" / "+LS.deck.length;const pct=LS.tot?Math.round(LS.got/LS.tot*100):0;
    A.innerHTML="<div class='res card' style='margin-top:16px'><div class='bigscore'>"+pct+"%</div><h2>You recalled "+LS.got+" of "+LS.tot+" items</h2>"+
      (LS.res.filter(r=>r.ok<r.n).length?"<p class='muted' style='margin:0'>Lists to repeat: "+LS.res.filter(r=>r.ok<r.n).map(r=>esc(r.u.q)).join(" · ")+"</p>":"")+
      "<div class='row center'><button class='btn pri' id='lNew'>New set</button><button class='btn ghost' data-go='home'>Home</button></div></div>";$("#lNew").onclick=()=>openSetup("list");return}
  const l=LS.deck[LS.i];$("#lProg").style.width=(LS.i/LS.deck.length*100)+"%";$("#lCount").textContent=(LS.i+1)+" / "+LS.deck.length;
  A.innerHTML="<div class='lcard card tp-"+l.t+"'><div class='qmeta'><span class='chip'>"+T[l.t].icon+" "+T[l.t].short+"</span><span class='chip sl'>"+l.items.length+" items</span><span class='chip sl'>📄 "+slideTxt(l.sl)+"</span></div><div class='qtext'>"+esc(l.q)+"</div>"+
    "<textarea id='lIn' placeholder='Type one item per line (or separate with commas)' aria-label='Your list'></textarea><div id='lClue'></div><div class='qacts'><button class='btn pri' id='lChk'>Check my list</button><button class='btn sm' id='lClueB'>💡 First letters</button><button class='btn sm ghost' id='lShow'>I don't know, show me</button></div><div id='lOut'></div></div>";
  setTimeout(()=>{try{$("#lIn").focus({preventScroll:true})}catch(e){}},60);
  $("#lClueB").onclick=()=>{$("#lClue").innerHTML="<div class='clue'><b>💡 First letters:</b> "+l.items.map(it=>esc(it.text.replace(/^[^A-Za-z0-9]+/,"")[0])).join(" · ")+"</div>";$("#lClueB").disabled=true};
  const check=give=>{const lines=give?[]:$("#lIn").value.split(/\n|,|;/).map(s=>s.trim()).filter(Boolean);
    const res=l.items.map(it=>matchItem(lines,it));const ok=res.filter(Boolean).length;
    LS.got+=ok;LS.tot+=l.items.length;LS.res.push({u:l,ok,n:l.items.length});mark(l,ok/l.items.length>=.8,false);
    $("#lIn").disabled=true;$("#lChk").disabled=true;$("#lShow").disabled=true;$("#lClueB").disabled=true;
    $("#lOut").innerHTML="<div class='fb "+(ok===l.items.length?"ok":"no")+"'><h3>"+(ok===l.items.length?"All "+ok+" recalled! 🎉":ok+" of "+l.items.length+" recalled")+"</h3><ul class='litems'>"+l.items.map((it,i)=>"<li class='"+(res[i]?"ok":"no")+"'>"+(res[i]?"✅":"❌")+" <span>"+esc(it.text)+"</span></li>").join("")+"</ul><div class='hook' style='margin-top:12px'>🧠 "+esc(l.hook)+"</div><div class='qacts'><button class='btn pri' id='lNext'>"+(LS.i===LS.deck.length-1?"Finish 🏁":"Next list ▶")+"</button></div></div>";
    $("#lNext").onclick=()=>{LS.i++;renderList();window.scrollTo({top:0,behavior:"smooth"})};setTimeout(()=>{try{$("#lNext").focus({preventScroll:true})}catch(e){}},60)};
  $("#lChk").onclick=()=>check(false);$("#lShow").onclick=()=>check(true)}

/* ---------- boot ---------- */
applyTheme();route();
if("serviceWorker" in navigator&&location.protocol.startsWith("http")){
  navigator.serviceWorker.register("sw.js").then(()=>navigator.serviceWorker.ready).then(()=>{$("#offPill").hidden=false}).catch(()=>{})}
})();
