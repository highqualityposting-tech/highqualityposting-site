(() => {
 'use strict';
 const root=document.body, reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const preview=location.hostname.endsWith('.vercel.app')||['localhost','127.0.0.1'].includes(location.hostname);
 root.querySelectorAll('[data-chapter="studio"]').forEach(a=>{if(preview)a.href='https://hqp-studio-brand-preview.vercel.app/homepage-production?hqp-entry=chapter'});
 const scenes=[...document.querySelectorAll('[data-scene],#flow')],active=new Set();let frame=0;
 const update=()=>{frame=0;if(document.hidden||reduced.matches)return;const values=[...active].map(el=>[el,el.getBoundingClientRect()]);values.forEach(([el,r])=>el.style.setProperty('--scene-progress',Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height))).toFixed(4)))};
 const schedule=()=>{if(!frame&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(update)};
 const sceneObserver=new IntersectionObserver(entries=>{entries.forEach(e=>e.isIntersecting?active.add(e.target):active.delete(e.target));schedule()},{rootMargin:'100px'});
 scenes.forEach(el=>sceneObserver.observe(el));addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);document.addEventListener('visibilitychange',schedule);
 reduced.addEventListener('change',()=>{if(reduced.matches){cancelAnimationFrame(frame);frame=0;scenes.forEach(el=>el.style.removeProperty('--scene-progress'))}else schedule()});
 const chapter=root.classList.contains('brand-app')?'02':'01';
 document.querySelectorAll('main>section .section-head .eyebrow').forEach((el,i)=>{el.textContent=chapter+' / '+String(i+1).padStart(2,'0')+' — '+el.textContent});
 const cards=[...document.querySelectorAll('.screen-grid>.screen-card')],stage=document.querySelector('.field-stage'),wide=matchMedia('(min-width:901px)');
 if(stage&&cards.length){
   const screen=stage.querySelector('img'),label=stage.querySelector('.field-screen-label'),controls=stage.querySelector('.field-controls');
   let requestId=0,current=-1;
   async function select(index){if(index===current)return;current=index;const token=++requestId;const source=cards[index].querySelector('img'),title=cards[index].querySelector('h3').textContent;
     cards.forEach((el,i)=>el.classList.toggle('field-current',i===index));controls.querySelectorAll('button').forEach((el,i)=>el.setAttribute('aria-pressed',String(i===index)));
     if(!wide.matches)return;const image=new Image();image.src=source.src;try{await image.decode();if(token!==requestId)return;screen.src=source.src;screen.alt=source.alt;screen.width=source.naturalWidth||Number(source.width);screen.height=source.naturalHeight||Number(source.height);label.textContent=title;}catch{/* Keep last successful real screen. */}
   }
   cards.forEach((card,i)=>{const b=document.createElement('button');b.type='button';b.textContent=String(i+1).padStart(2,'0');b.setAttribute('aria-label',card.querySelector('h3').textContent+'を見る');b.setAttribute('aria-pressed',String(i===0));b.addEventListener('click',()=>{select(i);card.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'center'})});controls.append(b)});
   root.classList.add('field-enhanced');
   const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);if(visible[0])select(cards.indexOf(visible[0].target));},{rootMargin:'-15% 0px -20% 0px',threshold:[0,.25,.5,.75]});
   cards.forEach(el=>observer.observe(el));select(0);wide.addEventListener('change',()=>{current=-1;select(0)});
 }
})();
