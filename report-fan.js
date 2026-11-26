(() => {
  const fan = document.querySelector('.report-fan');
  const cards = Array.from(fan.querySelectorAll('.report-card'));
  const controls = document.querySelector('.report-controls');
  let active = 0, start = null, dragged = false;
  function paint() {
    cards.forEach((card, index) => {
      let gap = (index - active + cards.length) % cards.length;
      if (gap > cards.length / 2) gap -= cards.length;
      const depth = Math.abs(gap);
      card.style.transform = 'translateX(' + gap * 14 + '%) rotate(' + gap * 8 + 'deg) scale(' + Math.max(.75,1-depth*.045) + ')';
      card.style.zIndex = 10 - depth;
      card.style.opacity = depth > 2 ? 0 : 1;
      card.style.visibility = depth > 2 ? 'hidden' : 'visible';
      card.tabIndex = gap === 0 ? 0 : -1;
    });
    controls.querySelector('output').textContent = (active + 1) + ' / ' + cards.length;
  }
  function move(step) { active = (active + step + cards.length) % cards.length; paint(); }
  const buttons = controls.querySelectorAll('button');
  buttons[0].onclick = () => move(-1);
  buttons[1].onclick = () => move(1);
  fan.addEventListener('dragstart', e => e.preventDefault());
  fan.addEventListener('pointerdown', e => { start = [e.clientX,e.clientY]; dragged = false; });
  window.addEventListener('pointercancel', () => { start = null; });
  window.addEventListener('pointerup', e => {
    if (!start) return;
    const dx = e.clientX-start[0], dy = e.clientY-start[1];
    start = null;
    if (Math.abs(dx)>30 && Math.abs(dx)>Math.abs(dy)) { dragged = true; move(dx<0?1:-1); }
  });
  fan.addEventListener('click', e => {
    const card = e.target.closest('.report-card');
    if (!card) return;
    if (dragged || card !== cards[active]) { e.preventDefault(); if (!dragged) { active = cards.indexOf(card); paint(); } dragged = false; }
  });
  fan.addEventListener('keydown', e => { if (['ArrowLeft','ArrowRight'].includes(e.key)) { e.preventDefault(); move(e.key==='ArrowRight'?1:-1); cards[active].focus(); } });
  paint();
})();