/* Shared finite opening: native-resolution photographs, SVG and real app UI. */
(() => {
  'use strict';
  const mode=document.currentScript?.dataset.story||'break';
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const title=mode==='field'?'CONTROL THE FIELD':'BREAK THE STANDARD';
  const layer=document.createElement('div');layer.className='hqp-cinema cinema-mode-'+mode;layer.hidden=true;
  layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-label',title);
  const map='<svg class="cinema-map" viewBox="0 0 1000 620" aria-hidden="true"><g class="city-blocks" fill="none" stroke="currentColor" stroke-width=".7"><path d="M40 40H220V160H40ZM260 40H440V160H260ZM480 40H680V160H480ZM720 40H960V160H720ZM40 200H220V390H40ZM260 200H440V390H260ZM480 200H680V390H480ZM720 200H960V390H720ZM40 430H220V580H40ZM260 430H440V580H260ZM480 430H680V580H480ZM720 430H960V580H720Z"/></g><path class="cinema-route" pathLength="1" d="M80 530L240 530L240 180L460 180L460 410L700 410L700 95L910 95"/><g class="cinema-pins" fill="currentColor"><circle cx="80" cy="530" r="5"/><circle cx="240" cy="340" r="5"/><circle cx="380" cy="180" r="5"/><circle cx="460" cy="300" r="5"/><circle cx="610" cy="410" r="5"/><circle cx="700" cy="220" r="5"/><circle cx="910" cy="95" r="5"/></g></svg>';
  const scene=mode==='field'
    ?'<div class="cinema-field">'+map+'<div class="cinema-device"><img loading="lazy" src="app-screen-overall-mapping.png" width="1206" height="2474" alt="HQPアプリの実際の全体マッピング画面"></div><span class="cinema-scene-note">実際のアプリ画面 / 背景は運用のイメージ</span></div>'
    :'<div class="cinema-world"><img loading="lazy" src="brand-city.webp" width="1536" height="1024" alt="" />'+map+'<span class="cinema-scene-note">都市・ルートの表現イメージ（生成素材）</span></div><div class="cinema-rock" aria-hidden="true"><span class="slab slab-a"></span><span class="slab slab-b"></span><span class="slab slab-c"></span><svg viewBox="0 0 1000 700" preserveAspectRatio="none"><path class="crack-main" pathLength="1" d="M506 0L497 75L519 126L483 184L508 223L478 282L513 348L488 404L522 473L500 528L520 592L489 650L510 700"/><path class="crack-branch" pathLength="1" d="M483 184L386 214L323 202L239 260L168 244L83 287L0 270M513 348L610 313L667 342L755 295L814 319L891 280L1000 298M500 528L406 484L340 506L282 474L204 503L115 467L0 489"/></svg></div>';
  layer.innerHTML=scene+'<div class="cinema-caption"><span>HIGH QUALITY POSTING / '+(mode==='field'?'02':'01')+'</span><strong>'+title.replace(' THE ','<br><em>THE ')+'</em></strong><small>BEYOND THE ORDINARY</small></div><span class="cinema-index">HQP / '+(mode==='field'?'FIELD CONTROL':'BREAKTHROUGH')+'</span><button class="cinema-skip" type="button">演出をスキップ ↗</button>';
  document.body.append(layer);
  const replay=document.createElement('button');replay.className='cinema-replay';replay.type='button';replay.textContent='ブランドストーリーを再生 ↗';
  const actions=document.querySelector('.hero-actions');(actions?.parentElement||document.querySelector('footer')).append(replay);
  const skip=layer.querySelector('.cinema-skip');const key='hqp-brand-v4-'+mode+'-seen';
  let pending=false;let timer=0,fade=0,active=false,returnFocus=null,oldOverflow='',siblings=[];
  function restore(){clearTimeout(timer);clearTimeout(fade);layer.hidden=true;layer.classList.remove('is-playing','is-leaving');document.body.style.overflow=oldOverflow;siblings.forEach(([el,value])=>el.inert=value);siblings=[];active=false;if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});}
  function finish(){if(!active)return;clearTimeout(timer);layer.classList.add('is-leaving');fade=setTimeout(restore,550);}
  async function play(manual=false){
    if(active||pending||media.matches)return;pending=true;
    try{layer.querySelectorAll('img').forEach(i=>i.loading='eager');const texture=new Image();texture.src='brand-basalt.webp';await Promise.all([...layer.querySelectorAll('img'),...(mode==='break'?[texture]:[])].map(i=>i.decode()));}catch{pending=false;return;}pending=false;
    if(document.hidden||media.matches||(!manual&&scrollY>120))return;
    active=true;returnFocus=document.activeElement;oldOverflow=document.body.style.overflow;
    siblings=[...document.body.children].filter(el=>el!==layer&&el instanceof HTMLElement).map(el=>[el,el.inert]);siblings.forEach(([el])=>el.inert=true);
    document.body.style.overflow='hidden';layer.hidden=false;layer.classList.remove('is-leaving');void layer.offsetWidth;layer.classList.add('is-playing');skip.focus({preventScroll:true});
    try{localStorage.setItem(key,'1')}catch{}
    timer=setTimeout(finish,mode==='field'?8700:9800);
  }
  skip.addEventListener('click',finish);replay.addEventListener('click',()=>play(true));
  layer.addEventListener('keydown',e=>{if(e.key==='Escape')finish();if(e.key==='Tab'){e.preventDefault();skip.focus()}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&active)restore()});
  addEventListener('pagehide',()=>{if(active)restore()});
  media.addEventListener('change',()=>{replay.hidden=media.matches;if(media.matches&&active)restore()});replay.hidden=media.matches;
  let seen=false;try{seen=localStorage.getItem(key)==='1'}catch{}
  if(!seen&&!media.matches&&!navigator.connection?.saveData&&!location.hash&&!new URLSearchParams(location.search).has('hqp-entry'))play();
})();
