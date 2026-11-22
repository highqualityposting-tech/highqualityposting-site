/* Short, finite Canvas sequences. No video, WebGL dependency or background render loop. */
(() => {
  'use strict';
  const script = document.currentScript;
  const mode = script?.dataset.story || 'break';
  const host = document.querySelector(mode === 'creation' ? '.homepage-page' : 'body');
  if (!host || document.querySelector('.hqp-cinema')) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const key = `hqp-cinema-v1-${mode}`;
  const title = mode === 'break' ? 'BREAK THE STANDARD' : 'FROM CHAOS TO CREATION';
  const layer = document.createElement('div');
  layer.className = 'hqp-cinema';
  layer.hidden = true;
  layer.setAttribute('role', 'dialog');
  layer.setAttribute('aria-modal', 'true');
  layer.setAttribute('aria-label', title);
  layer.innerHTML = '<canvas aria-hidden="true"></canvas><div class="cinema-caption"><strong></strong><span>HIGH QUALITY POSTING</span></div><span class="cinema-index" aria-hidden="true">HQP / ' + (mode === 'break' ? '01 — BREAKTHROUGH' : '02 — CREATION') + '</span><button class="cinema-skip" type="button">演出をスキップ ↗</button>';
  layer.querySelector('strong').textContent = title;
  if (mode === 'break') {
    const logo = document.createElement('img');
    logo.src = 'logo.jpg'; logo.alt = 'HQP'; logo.width = 76; logo.height = 76;
    layer.querySelector('.cinema-caption').prepend(logo);
  }
  document.body.append(layer);
  const replay = document.createElement('button');
  replay.className = 'cinema-replay'; replay.type = 'button';
  replay.textContent = 'ブランドストーリーを再生 ↗';
  (host.querySelector('footer') || host).append(replay);
  const canvas = layer.querySelector('canvas');
  const ctx = canvas.getContext('2d', {alpha:false});
  const skip = layer.querySelector('.cinema-skip');
  let raf = 0, deadline = 0, closing = 0, active = false, previousFocus, started = 0;
  let w = 0, h = 0, texture, oldOverflow = '', siblings = [];
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const ease = (x) => { x = clamp(x); return x*x*(3-2*x); };
  let seed = 72831;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed-1)/2147483646; };
  const rays = Array.from({length:14}, (_, i) => {
    const angle = i / 14 * Math.PI * 2 + (random()-.5)*.17;
    return Array.from({length:25}, (_, j) => {
      const r = j / 24;
      const a = angle + (random()-.5)*.34;
      return [Math.cos(a)*r, Math.sin(a)*r];
    });
  });
  const particles = Array.from({length:95}, () => [random(),random(),random(),random()]);
  function resize() {
    w = innerWidth; h = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, w < 600 ? 1.25 : 1.5);
    canvas.width = w*dpr; canvas.height = h*dpr;
    ctx?.setTransform(dpr,0,0,dpr,0,0);
    texture = document.createElement('canvas'); texture.width=640; texture.height=640;
    const tc = texture.getContext('2d'); const data = tc.createImageData(640,640);
    seed = 1249;
    for(let y=0;y<640;y++) for(let x=0;x<640;x++) {
      const p=(y*640+x)*4;
      const ridge = Math.sin(x*.035 + Math.sin(y*.021)*3)*Math.cos(y*.018+x*.009);
      const grain = Math.sin(x*.12 + Math.sin(y*.09)*2)*Math.cos(y*.13+x*.07);
      const strata = Math.abs(Math.sin(x*.008+y*.019+ridge*.8));
      const v = 9 + ridge*10 + grain*5 + strata*16 + random()*9;
      data.data[p]=v*.83;data.data[p+1]=v*.91;data.data[p+2]=v;data.data[p+3]=255;
    }
    tc.putImageData(data,0,0);
    // Fine mineral seams, cached once rather than recalculated each frame.
    for(let i=0;i<1600;i++) {
      const x=random()*640,y=random()*640;
      tc.strokeStyle=`rgba(170,190,210,${random()*.06})`;tc.lineWidth=.5;
      tc.beginPath();tc.moveTo(x,y);tc.lineTo(x+random()*25,y-random()*9);tc.stroke();
    }
  }
  function rock(t) {
    const cx=w*.5,cy=h*.49,r=Math.hypot(w,h)*.64;
    const split=ease((t-4.2)/2.1), visible=ease(t/1.4);
    ctx.globalAlpha=visible;
    for(let i=0;i<rays.length;i++) {
      const next=rays[(i+1)%rays.length], ray=rays[i],a=(i+.5)/14*Math.PI*2;
      const dx=Math.cos(a)*split*w*.48,dy=Math.sin(a)*split*h*.55;
      ctx.save();ctx.translate(cx+dx,cy+dy);ctx.rotate(split*(i%2 ? 1 : -1)*.07);
      ctx.beginPath();ray.forEach(([x,y],j)=>j?ctx.lineTo(x*r,y*r):ctx.moveTo(x*r,y*r));
      [...next].reverse().forEach(([x,y])=>ctx.lineTo(x*r,y*r));ctx.closePath();ctx.clip();
      ctx.drawImage(texture,-w*.8,-h*.8,w*1.6,h*1.6);
      const light=ctx.createRadialGradient(-w*.15,-h*.2,0,0,0,r);
      light.addColorStop(0,'#7e90a51a');light.addColorStop(.6,'#02030566');light.addColorStop(1,'#000c');
      ctx.fillStyle=light;ctx.fillRect(-r,-r,r*2,r*2);ctx.restore();
    }
    const growth=ease((t-1.1)/3.0),pulse=.35+.65*Math.pow(Math.sin((t-1.1)*Math.PI*.85),2);
    if(growth>0) {
      ctx.save();ctx.globalAlpha=(1-split)*pulse;
      for(let i=0;i<rays.length;i++) {
        const length=clamp(growth*1.4-(i%4)*.19);
        if(length<=0)continue;
        ctx.beginPath();
        rays[i].forEach(([x,y],j)=>{const f=j/24;if(f<=length){if(j===0)ctx.moveTo(cx,cy);else ctx.lineTo(cx+x*r,cy+y*r);}});
        ctx.strokeStyle='#487fcf';ctx.lineWidth=1.8;ctx.shadowColor='#488fff';ctx.shadowBlur=14;ctx.stroke();
        ctx.strokeStyle='#d7f4ff';ctx.lineWidth=.55;ctx.shadowBlur=3;ctx.stroke();
      }
      ctx.restore();
    }
    ctx.globalAlpha=1;
  }
  function creation(t) {
    const form=ease((t-.7)/2.8), depart=ease((t-4.8)/1.4);
    const sw=Math.min(w*.79,920),sh=Math.min(h*.55,490),left=(w-sw)/2,top=(h-sh)/2;
    ctx.save();ctx.globalAlpha=1-depart;
    const g=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,sw*.75);
    g.addColorStop(0,'#1479e91b');g.addColorStop(1,'#0000');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    particles.forEach(([x,y,z,v],i)=>{
      const tx=left+(i%12)/11*sw,ty=top+Math.floor(i/12)/7*sh;
      const px=x*w+(tx-x*w)*form,py=y*h+(ty-y*h)*form;
      ctx.fillStyle=`rgba(183,224,255,${.3+z*.6})`;ctx.beginPath();ctx.arc(px,py,.7+v*1.1,0,Math.PI*2);ctx.fill();
    });
    const blocks=[[0,0,1,1],[0,.12,1,0],[.055,.22,.49,.41],[.59,.22,.35,.41],[.055,.72,.27,.19],[.365,.72,.27,.19],[.675,.72,.27,.19]];
    blocks.forEach(([x,y,bw,bh],i)=>{
      const p=ease((t-1.5-i*.16)/1.2);if(!p)return;
      ctx.save();ctx.translate(0,(1-p)*(i%2 ? -35 : 55));ctx.globalAlpha=p*(1-depart);
      ctx.strokeStyle=i===0?'#b8dfff99':'#87b7e455';ctx.lineWidth=1;
      ctx.strokeRect(left+x*sw,top+y*sh,bw*sw*p,bh*sh);
      if(i>1){ctx.fillStyle='#8dcaff08';ctx.fillRect(left+x*sw,top+y*sh,bw*sw,bh*sh);}
      if(i===2) {ctx.fillStyle='#d9edff';ctx.fillRect(left+.08*sw,top+.29*sh,sw*.28*p,3);ctx.fillRect(left+.08*sw,top+.35*sh,sw*.21*p,3);ctx.fillStyle='#287aff';ctx.fillRect(left+.08*sw,top+.49*sh,sw*.15*p,sh*.06);}
      if(i===3){const grad=ctx.createLinearGradient(left+.59*sw,top,left+.94*sw,top+sh);grad.addColorStop(0,'#1b4871');grad.addColorStop(1,'#080b10');ctx.fillStyle=grad;ctx.fillRect(left+.61*sw,top+.25*sh,sw*.31,sh*.35);}
      ctx.restore();
    });ctx.restore();
  }
  function frame(now) {
    if(!active)return;
    const t=(now-started)/1000;
    ctx.fillStyle='#020305';ctx.fillRect(0,0,w,h);
    if(mode==='break')rock(t);else creation(t);
    layer.classList.toggle('is-revealed',t>(mode==='break'?4.55:5.0));
    if(t>7.5){finish();return;}
    raf=requestAnimationFrame(frame);
  }
  function finish() {
    if(!active)return;active=false;cancelAnimationFrame(raf);clearTimeout(deadline);
    layer.classList.add('is-leaving');
    document.body.style.overflow=oldOverflow;
    siblings.forEach(([el,value])=>{el.inert=value;});siblings=[];
    previousFocus?.focus({preventScroll:true});
    closing=setTimeout(()=>{layer.hidden=true;layer.classList.remove('is-leaving','is-revealed');},850);
  }
  function start(manual=false) {
    if(active||!ctx)return;
    clearTimeout(closing);
    let seen=false;try{seen=localStorage.getItem(key)==='1';}catch{}
    if(!manual&&(seen||reduced.matches||navigator.connection?.saveData||location.hash))return;
    if(reduced.matches)return;
    try{localStorage.setItem(key,'1');}catch{}
    previousFocus=document.activeElement;oldOverflow=document.body.style.overflow;
    resize();layer.hidden=false;layer.classList.remove('is-leaving','is-revealed');active=true;
    siblings=Array.from(document.body.children).filter(el=>el!==layer&&el instanceof HTMLElement).map(el=>[el,el.inert]);
    siblings.forEach(([el])=>{el.inert=true;});document.body.style.overflow='hidden';skip.focus({preventScroll:true});
    started=performance.now();raf=requestAnimationFrame(frame);deadline=setTimeout(finish,9000);
  }
  const lifecycle = new AbortController();
  const options = {signal:lifecycle.signal};
  skip.addEventListener('click',finish,options);
  replay.addEventListener('click',()=>start(true),options);
  replay.hidden=reduced.matches;
  layer.addEventListener('keydown',e=>{if(e.key==='Escape'){finish();}if(e.key==='Tab'){e.preventDefault();skip.focus();}},options);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)finish();},options);
  reduced.addEventListener('change',()=>{replay.hidden=reduced.matches;if(reduced.matches)finish();},options);
  window.addEventListener('resize',()=>{if(active)resize();},{...options,passive:true});
  window.addEventListener('pagehide',finish,options);
  document.addEventListener('hqp-cinema-dispose',()=>{finish();clearTimeout(closing);lifecycle.abort();layer.remove();replay.remove();},{...options,once:true});
  start();
})();
