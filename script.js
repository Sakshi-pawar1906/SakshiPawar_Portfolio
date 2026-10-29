// ---- Edit your content here ----
const tech = ['HTML5','CSS3','JavaScript','Tailwind CSS','GSAP','Python','Java','Git','GitHub','Netlify'];
const projects = [
  { title:'Shree Enterprises', text:'Business website with a QR system.', tags:'HTML', live:'https://paintrest.netlify.app', link:'https://github.com/Sakshi-pawar1906/shree-enterprises' },
  { title:'Amazon UI Clone', text:'Amazon homepage design recreated with a responsive, modern layout.', tags:'HTML · CSS · JavaScript', link:'https://github.com/Sakshi-pawar1906/amazon-UI' },
  { title:'AI Resume Screening', text:'Analyzes resumes and ranks candidates using machine learning and NLP.', tags:'Python · NLP', link:'https://github.com/Sakshi-pawar1906/AI-Based-Resume-Screening-System' },
  { title:'PaintMyWalls Backend', text:'Backend for a wall-painting service project.', tags:'Python', link:'https://github.com/Sakshi-pawar1906/paintmywalls-backend' },
  { title:'Java Project', text:'Java programming project.', tags:'Java', link:'https://github.com/Sakshi-pawar1906/Java-Project' }
];
const phrases = [['Frontend','Developer'],['Creative','Web Projects'],['Clean','Interfaces']];

document.getElementById('techGrid').innerHTML = tech.map(t =>
  `<div class="tcard border border-cream/15 rounded-2xl px-5 py-6 font-semibold text-lg hover:bg-gold hover:text-ink transition-colors duration-200">${t}</div>`).join('');
document.getElementById('projList').innerHTML = projects.map(p =>
  `<div class="row proj flex flex-wrap items-center justify-between gap-4 border-b border-cream/20 py-7 px-2 sm:px-4 transition-colors">
    <a href="${p.live || p.link}" target="_blank" rel="noopener" class="block flex-1 min-w-[14rem]"><span class="block font-display uppercase text-3xl sm:text-5xl">${p.title}</span><span class="block mt-1 text-sm opacity-70 max-w-xl">${p.text}</span></a>
    <span class="flex items-center gap-3 text-sm font-semibold">
      <span class="hidden lg:inline opacity-70 font-medium">${p.tags}</span>
      ${p.live ? `<a href="${p.live}" target="_blank" rel="noopener" class="border border-current rounded-full px-4 py-1.5 hover:bg-ink hover:text-gold transition">Live site ↗</a>` : ''}
      <a href="${p.link}" target="_blank" rel="noopener" class="border border-current rounded-full px-4 py-1.5 hover:bg-ink hover:text-gold transition">Code</a>
    </span>
  </div>`).join('');

// Mobile menu
const mBtn = document.getElementById('menuBtn'), mMenu = document.getElementById('mobileMenu');
mBtn.addEventListener('click', () => {
  const open = mMenu.classList.toggle('hidden') === false;
  mMenu.classList.toggle('flex', open); mBtn.textContent = open ? 'Close' : 'Menu'; mBtn.setAttribute('aria-expanded', open);
});
mMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { mMenu.classList.add('hidden'); mMenu.classList.remove('flex'); mBtn.textContent = 'Menu'; }));

// Headline words
const roll = document.getElementById('roll');
const build = i => roll.innerHTML = phrases[i].map((w, k) =>
  `<span class="block overflow-hidden pt-[0.06em]"><span class="block ${k ? 'text-gold' : ''}">${[...w].map(c => `<span class="ch inline-block">${c}</span>`).join('')}</span></span>`).join('');
build(0);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const pre = document.getElementById('pre');

// Big paragraph: split into words for scroll reveal
const big = document.getElementById('bigText');
big.innerHTML = big.textContent.split(' ').map(w => `<span class="bw">${w}</span>`).join(' ');

if (reduce || !window.gsap) {
  pre.remove();
} else {
  gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis) {
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href')); if (t) { e.preventDefault(); lenis.scrollTo(t); }
    }));
  }
  // Preloader counter, then intro
  const o = { v:0 }, pct = document.getElementById('pct'), ring = document.getElementById('ring');
  gsap.to(o, { v:100, duration:2, ease:'power2.inOut',
    onUpdate() { pct.textContent = Math.round(o.v) + '%'; ring.style.strokeDashoffset = 283 * (1 - o.v / 100); },
    onComplete() { gsap.to(pre, { yPercent:-100, duration:.9, ease:'power4.inOut', onComplete:() => pre.remove() }); intro(); } });

  function intro() {
    gsap.from('.ch', { yPercent:110, duration:.9, stagger:.04, ease:'power4.out' });
    gsap.from('.hero-in', { y:30, opacity:0, duration:.8, stagger:.12, delay:.4, ease:'power3.out' });
    gsap.from('.hero-photo', { scale:.92, opacity:0, duration:1.2, delay:.3, ease:'power3.out' });
    let i = 0;
    setInterval(() => {
      gsap.to('.ch', { yPercent:-110, duration:.4, stagger:.02, ease:'power2.in', onComplete() {
        i = (i + 1) % phrases.length; build(i); gsap.from('.ch', { yPercent:110, duration:.7, stagger:.03, ease:'power4.out' });
      } });
    }, 3600);
  }

  gsap.fromTo('.bw', { opacity:.15 }, { opacity:1, stagger:.1, ease:'none', scrollTrigger:{ trigger:'#bigText', start:'top 80%', end:'bottom 55%', scrub:true } });
  gsap.utils.toArray('.reveal').forEach(el => gsap.from(el, { y:50, opacity:0, duration:.9, ease:'power3.out', scrollTrigger:{ trigger:el, start:'top 88%' } }));
  gsap.from('.tcard', { y:40, opacity:0, duration:.7, stagger:.06, ease:'power3.out', scrollTrigger:{ trigger:'#techGrid', start:'top 85%' } });
  gsap.from('.proj', { x:-40, opacity:0, duration:.7, stagger:.12, ease:'power3.out', scrollTrigger:{ trigger:'#projList', start:'top 85%' } });
  // Re-measure scroll positions whenever the page height changes
  // (Tailwind, fonts and images load late), so animations never get stuck hidden.
  let rt;
  new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 150); }).observe(document.body);
  addEventListener('load', () => setTimeout(() => ScrollTrigger.refresh(), 300));

  // Custom cursor (mouse only)
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    const dot = document.getElementById('dot'), rg = document.getElementById('ringc');
    dot.classList.remove('hidden'); rg.classList.remove('hidden');
    const dx = gsap.quickTo(dot, 'x', { duration:.1 }), dy = gsap.quickTo(dot, 'y', { duration:.1 });
    const rx = gsap.quickTo(rg, 'x', { duration:.4 }), ry = gsap.quickTo(rg, 'y', { duration:.4 });
    addEventListener('mousemove', e => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
    document.querySelectorAll('a, button, .tcard').forEach(el => {
      el.addEventListener('mouseenter', () => gsap.to(rg, { scale:1.8, duration:.3 }));
      el.addEventListener('mouseleave', () => gsap.to(rg, { scale:1, duration:.3 }));
    });
  }
}

// Contact form: sends each message to your email using Web3Forms (free)
// 1. Go to https://web3forms.com, enter your email and click "Create Access Key".
// 2. The key arrives in your inbox. Paste it between the quotes below.
const WEB3FORMS_KEY = '7cbc4256-f7b1-456e-8d81-53f65e83e99c';

document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();
  const msg = document.getElementById('formMsg');
  if (WEB3FORMS_KEY.startsWith('PASTE')) { msg.textContent = 'Form is not set up yet. Please message me on LinkedIn.'; return; }
  msg.textContent = 'Sending…';
  const data = Object.fromEntries(new FormData(e.target));
  data.access_key = WEB3FORMS_KEY;
  data.subject = 'New message from your portfolio website';
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    const out = await res.json();
    if (!out.success) throw new Error();
    msg.textContent = 'Thanks! Your message was sent.'; e.target.reset();
  } catch { msg.textContent = 'Could not send. Please message me on LinkedIn instead.'; }
});
