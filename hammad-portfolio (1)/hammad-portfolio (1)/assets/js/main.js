(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Header shrink on scroll */
  const header = $('.header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 30);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  const toggle = $('.menu-toggle'), links = $('#nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', e => {
      if (!links.contains(e.target) && !toggle.contains(e.target)) { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* Reveal on scroll */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else reveals.forEach(el => el.classList.add('in'));

  /* Counters */
  const counters = $$('[data-count]');
  const runCount = el => {
    const end = +el.dataset.count, suf = el.dataset.suffix || '', dur = 1600, t0 = performance.now();
    const tick = t => { const p = Math.min((t - t0) / dur, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && !reduce) {
    const co = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); } }), { threshold: 0.5 });
    counters.forEach(c => co.observe(c));
  }

  /* Typing effect */
  const tw = $('.tw');
  if (tw && !reduce) {
    const words = JSON.parse(tw.dataset.words); let w = 0, i = 0, del = false;
    const loop = () => {
      const word = words[w];
      tw.textContent = word.slice(0, i);
      if (!del && i < word.length) { i++; setTimeout(loop, 70); }
      else if (!del) { del = true; setTimeout(loop, 1600); }
      else if (i > 0) { i--; setTimeout(loop, 35); }
      else { del = false; w = (w + 1) % words.length; setTimeout(loop, 250); }
    };
    loop();
  }

  /* Hero 3D scene: parallax + rotating screenshots */
  const scene = $('.scene'), inner = $('.scene-inner');
  if (scene && inner) {
    if (finePointer && !reduce) {
      scene.addEventListener('mousemove', e => {
        const r = scene.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        inner.style.transform = `rotateX(${8 - y * 12}deg) rotateY(${-14 + x * 18}deg)`;
      });
      scene.addEventListener('mouseleave', () => { inner.style.transform = ''; });
    }
    const sets = $$('[data-cycle]', scene);
    if (sets.length && !reduce) {
      let k = 0; const n = $$('img', sets[0]).length;
      setInterval(() => {
        k = (k + 1) % n;
        sets.forEach(s => $$('img', s).forEach((im, j) => im.classList.toggle('on', j === k)));
        const url = $('.cycle-url', scene); if (url) setTimeout(() => { url.textContent = url.dataset.urls.split('|')[k]; }, 450);
      }, 3200);
    }
  }

  /* Card tilt */
  if (finePointer && !reduce) {
    $$('.tilt').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* Project filters */
  const filters = $$('.filter');
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active')); btn.classList.add('active');
    const f = btn.dataset.filter;
    $$('.pcard').forEach(p => p.classList.toggle('hide', f !== 'all' && p.dataset.cat !== f));
  }));

  /* Auto-scroll screenshots on touch devices when in view */
  if (!finePointer && 'IntersectionObserver' in window && !reduce) {
    const so = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('play', e.isIntersecting)), { threshold: 0.6 });
    $$('.scroll-frame').forEach(f => so.observe(f));
  }

  /* Featured slider */
  if (window.Swiper && $('.featured-swiper')) {
    const total = $$('.featured-swiper .swiper-slide').length;
    const cur = $('.slider-count b');
    new Swiper('.featured-swiper', {
      slidesPerView: 1, spaceBetween: 30, speed: 800, loop: true, grabCursor: true,
      autoplay: reduce ? false : { delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true },
      effect: 'creative',
      creativeEffect: { prev: { translate: ['-110%', 0, -300], rotate: [0, 0, -4], opacity: 0.4 }, next: { translate: ['110%', 0, -300], rotate: [0, 0, 4], opacity: 0.4 } },
      navigation: { nextEl: '.slider-next', prevEl: '.slider-prev' },
      pagination: { el: '.slider-progress', type: 'progressbar' },
      keyboard: { enabled: true },
      on: { slideChange(s) { if (cur) cur.textContent = String(s.realIndex + 1).padStart(2, '0'); } }
    });
    const tot = $('.slider-count i'); if (tot) tot.textContent = String(total).padStart(2, '0');
  }

  /* Contact form -> WhatsApp / Email */
  const form = $('#contact-form');
  if (form) {
    const build = () => {
      const d = Object.fromEntries(new FormData(form));
      if (!d.name.trim() || !d.message.trim()) { $('.form-msg').textContent = 'Please add your name and a short message.'; return null; }
      $('.form-msg').textContent = '';
      return `Hi Hammad,\n\nName: ${d.name}\nEmail: ${d.email || '-'}\nWebsite type: ${d.type}\n\n${d.message}`;
    };
    form.addEventListener('submit', e => {
      e.preventDefault(); const t = build(); if (!t) return;
      window.open(`https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(t)}`, '_blank', 'noopener');
    });
    $('#send-email').addEventListener('click', () => {
      const t = build(); if (!t) return;
      window.location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent('New website enquiry')}&body=${encodeURIComponent(t)}`;
    });
  }

  /* Year */
  $$('.year').forEach(y => y.textContent = new Date().getFullYear());
})();
