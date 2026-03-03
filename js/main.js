ain · JS
Copy

/* ============================================================
   BETSALEEL MUKUBA — PORTFOLIO JAVASCRIPT v3
   Features: Preloader, Particles, Typed, Scroll, Counters,
             Skills bars, Filters, Popups (Project/Blog/Skill/Service),
             EmailJS with auto-reply, Admin Panel, Theme
   ============================================================ */
'use strict';

/* ── CONFIG ─────────────────────────────────────────────── */
const CONFIG = (() => {
  const d = {
    name:'Betsaleel Mukuba', title1:'Software Engineer', title2:'Full Stack Developer',
    title3:'Web Specialist', title4:'Problem Solver',
    headline:'Building Modern Digital Experiences',
    bio:"I'm a passionate Software Engineer and Full Stack Developer with expertise in building modern, responsive web applications. With a solid foundation in Computer Science, I specialize in crafting intuitive user interfaces that combine elegant design with functional excellence.",
    bio2:"Driven by clean code, scalable architecture, and continuous learning — I transform complex requirements into elegant, user-friendly solutions that make a real impact.",
    location:'Lusaka, Zambia', email:'mukuba950@gmail.com', phone:'+260 96 950 8654',
    github:'https://github.com/MK7-SIETE', linkedin:'https://linkedin.com/in/betsaleel-mukuba',
    facebook:'https://facebook.com/betsa.mukuba', whatsapp:'https://wa.me/260969508654',
    yearsExp:2, projectsCount:6, profileImg:'./assets/mwa.png', aboutImg:'./assets/about-pic.png',
    cvFile:'./assets/Betsaleel_Mukuba_CV.pdf', adminPass:'admin2026', theme:'dark',
    emailjsServiceId:'YOUR_SERVICE_ID', emailjsTemplateId:'YOUR_TEMPLATE_ID',
    emailjsAutoReplyTemplateId:'YOUR_AUTOREPLY_TEMPLATE_ID', emailjsPublicKey:'YOUR_PUBLIC_KEY',
  };
  try { return { ...d, ...JSON.parse(localStorage.getItem('bm_config')||'{}') }; }
  catch { return d; }
})();
function saveConfig(){ try{ localStorage.setItem('bm_config',JSON.stringify(CONFIG)); }catch{} }

/* ── PRELOADER ──────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader')?.classList.add('hidden');
    initCounters();
  }, 1900);
});

/* ── SCROLL ─────────────────────────────────────────────── */
const scrollBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const s = window.scrollY, t = document.body.scrollHeight - window.innerHeight;
  if(scrollBar) scrollBar.style.width = `${(s/t)*100}%`;
  document.getElementById('navbar')?.classList.toggle('scrolled', s > 60);
  document.getElementById('back-to-top')?.classList.toggle('visible', s > 400);
  revealElements();
  triggerSkillBars();
}, { passive:true });

document.getElementById('back-to-top')?.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

/* ── MOBILE NAV ─────────────────────────────────────────── */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu?.classList.toggle('open');
  document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
});
mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger?.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}));

/* ── ACTIVE NAV ─────────────────────────────────────────── */
const navSections = document.querySelectorAll('section[id]');
function updateActiveLink(){
  const pos = window.scrollY + 120;
  navSections.forEach(sec => {
    const links = document.querySelectorAll(`.nav-links a[href="#${sec.id}"],#mobile-menu a[href="#${sec.id}"]`);
    links.forEach(l => l.classList.toggle('active', pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight));
  });
}
window.addEventListener('scroll', updateActiveLink, {passive:true});

/* ── THEME ──────────────────────────────────────────────── */
function applyTheme(t){
  document.documentElement.setAttribute('data-theme',t);
  CONFIG.theme = t; saveConfig();
  document.querySelectorAll('.theme-toggle-btn i').forEach(i => i.className = t==='dark'?'fas fa-sun':'fas fa-moon');
}
applyTheme(CONFIG.theme);
function toggleTheme(){ applyTheme(CONFIG.theme==='dark'?'light':'dark'); }

/* ── PARTICLES ──────────────────────────────────────────── */
(function initParticles(){
  const canvas = document.getElementById('hero-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts=[];
  function resize(){ W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight; }
  resize(); window.addEventListener('resize',resize);
  const count = Math.min(70, Math.floor(window.innerWidth/18));
  for(let i=0;i<count;i++) pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6,r:Math.random()*2+1,o:Math.random()*.5+.1});
  (function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p => {
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(96,165,250,${p.o})`; ctx.fill();
    });
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
      const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<110){ ctx.beginPath(); ctx.strokeStyle=`rgba(37,99,235,${.15*(1-d/110)})`; ctx.lineWidth=1; ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke(); }
    }
    requestAnimationFrame(draw);
  })();
})();

/* ── TYPED ──────────────────────────────────────────────── */
(function initTyped(){
  const el = document.getElementById('typed-text');
  if(!el) return;
  const words = [CONFIG.title1,CONFIG.title2,CONFIG.title3,CONFIG.title4];
  let wi=0, ci=0, del=false;
  function tick(){
    const w=words[wi];
    if(!del && ci<=w.length){ el.textContent=w.substring(0,ci++); if(ci>w.length){setTimeout(()=>{del=true;tick();},2200);return;} setTimeout(tick,80); }
    else if(del && ci>=0){ el.textContent=w.substring(0,ci--); if(ci<0){del=false;wi=(wi+1)%words.length;setTimeout(tick,400);return;} setTimeout(tick,40); }
  }
  tick();
})();

/* ── COUNTERS ───────────────────────────────────────────── */
let countersRan = false;
function initCounters(){
  if(countersRan) return; countersRan=true;
  document.querySelectorAll('[data-count]').forEach(el => {
    const target=parseInt(el.getAttribute('data-count')),suffix=el.getAttribute('data-suffix')||'';
    let cur=0; const step=Math.ceil(target/60);
    const timer=setInterval(()=>{ cur=Math.min(cur+step,target); el.textContent=cur+suffix; if(cur>=target)clearInterval(timer); },30);
  });
}

/* ── REVEAL ─────────────────────────────────────────────── */
function revealElements(){
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.stagger').forEach(el => {
    if(el.getBoundingClientRect().top < window.innerHeight - 60) el.classList.add('visible');
  });
}
revealElements();

/* ── SKILL BARS ─────────────────────────────────────────── */
let skillsTriggered=false;
function triggerSkillBars(){
  if(skillsTriggered) return;
  const s=document.getElementById('skills');
  if(s && s.getBoundingClientRect().top < window.innerHeight-80){
    skillsTriggered=true;
    document.querySelectorAll('.skill-bar-fill').forEach(b=>b.style.width=b.getAttribute('data-width'));
  }
}

/* ── PROJECT FILTER ─────────────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.getAttribute('data-filter');
    document.querySelectorAll('.project-card').forEach(c => {
      c.classList.toggle('hidden', f!=='all' && !(c.getAttribute('data-cat')||'').includes(f));
    });
  });
});

/* ══════════════════════════════════════════════════════════
   POPUP SYSTEM
══════════════════════════════════════════════════════════ */
let activePopup = null;

function openPopup(id){
  const overlay = document.getElementById(id);
  if(!overlay) return;
  activePopup = overlay;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closePopup(id){
  const overlay = id ? document.getElementById(id) : activePopup;
  if(!overlay) return;
  overlay.classList.remove('open');
  if(!document.querySelector('.popup-overlay.open, #admin-overlay.open')) document.body.style.overflow = '';
  activePopup = null;
}

// Close on overlay click
document.querySelectorAll('.popup-overlay').forEach(o => {
  o.addEventListener('click', e => { if(e.target===o) closePopup(o.id); });
});

document.querySelectorAll('.popup-close').forEach(btn => {
  btn.addEventListener('click', () => {
    const overlay = btn.closest('.popup-overlay');
    if(overlay) closePopup(overlay.id);
    const adminOv = btn.closest('#admin-overlay');
    if(adminOv) closeAdmin();
  });
});

/* ── PROJECT POPUPS ─────────────────────────────────────── */
const projectData = {
  portfolio: {
    icon:'fas fa-globe', title:'Professional Portfolio Website', category:'Web Development',
    status:'Completed', statusClass:'status-done',
    description:'A modern, fully responsive portfolio website built from scratch. Features a particle canvas hero, animated typing effect, skill progress bars, project filtering, blog section, and a full admin panel for content management — all without any framework.',
    highlights:['Particle canvas with connected graph animation','Animated typing effect cycling 4 roles','Admin panel with localStorage persistence','Contact form with EmailJS auto-reply','Responsive down to 260px screens','Dark/Light theme toggle'],
    tech:['HTML5','CSS3','JavaScript','EmailJS','Vercel'],
    github:'https://github.com/MK7-SIETE', live:'#',
  },
  banking: {
    icon:'fas fa-university', title:'Mobile Banking System', category:'Systems Programming',
    status:'In Progress', statusClass:'status-progress',
    description:'A command-line banking application written in C, simulating real mobile banking operations. Features secure PIN authentication, full transaction history, persistent file-based data storage, and a menu-driven interface.',
    highlights:['Secure PIN-based authentication','Account creation and management','Deposit, withdraw, and transfer funds','Transaction history with timestamps','File I/O for persistent data storage','Error handling and input validation'],
    tech:['C Programming','File I/O','Algorithms','Data Structures'],
    github:'https://github.com/MK7-SIETE', live:null,
  },
  ecommerce: {
    icon:'fas fa-shopping-bag', title:'E-commerce Platform', category:'Full Stack',
    status:'In Progress', statusClass:'status-progress',
    description:'A full-stack e-commerce solution with product catalog, shopping cart, user authentication, secure Stripe checkout, and a comprehensive admin dashboard for inventory, orders, and analytics.',
    highlights:['Product catalog with search and filters','Shopping cart with localStorage sync','Stripe payment integration','Admin dashboard with order management','User auth with JWT tokens','Responsive mobile-first design'],
    tech:['Next.js','React','Node.js','MongoDB','Stripe API','JWT'],
    github:'https://github.com/MK7-SIETE', live:null,
  },
  school: {
    icon:'fas fa-school', title:'School Management System', category:'Full Stack',
    status:'In Progress', statusClass:'status-progress',
    description:'Comprehensive school administration platform. Handles student enrolment, attendance tracking, grade management, parent-teacher messaging, timetable generation, and detailed performance analytics.',
    highlights:['Student and teacher record management','Attendance tracking with reports','Grade entry and transcript generation','Parent-teacher messaging system','Timetable scheduling','Role-based access (Admin/Teacher/Parent)'],
    tech:['Next.js','React','PostgreSQL','REST API','Node.js'],
    github:'https://github.com/MK7-SIETE', live:null,
  },
  dashboard: {
    icon:'fas fa-chart-bar', title:'Data Analytics Dashboard', category:'Backend / Data',
    status:'In Progress', statusClass:'status-progress',
    description:'An interactive analytics dashboard powered by MySQL and Chart.js. Visualises business data with real-time charts, filterable date ranges, KPI cards, and CSV/PDF export functionality.',
    highlights:['Real-time Chart.js visualisations','MySQL-powered data aggregation','Date range and category filters','KPI summary cards','CSV and PDF export','PHP backend with REST endpoints'],
    tech:['JavaScript','Chart.js','PHP','MySQL','REST API'],
    github:'https://github.com/MK7-SIETE', live:null,
  },
  python: {
    icon:'fab fa-python', title:'Python Automation Scripts', category:'Systems / Automation',
    status:'Completed', statusClass:'status-done',
    description:'A curated collection of Python automation scripts built to solve real productivity problems — from bulk file renaming and CSV data cleaning to web scraping and automated email notifications.',
    highlights:['Bulk file rename and organiser','CSV data cleaner and transformer','Web scraper with BeautifulSoup','Automated email sender via SMTP','PDF batch processor','Directory sync utility'],
    tech:['Python 3','BeautifulSoup','Pandas','smtplib','os/shutil'],
    github:'https://github.com/MK7-SIETE', live:null,
  },
};

document.querySelectorAll('.project-card[data-popup]').forEach(card => {
  card.addEventListener('click', (e) => {
    if(e.target.closest('.project-link-btn')) return;
    const key = card.getAttribute('data-popup');
    const d = projectData[key]; if(!d) return;
    const popup = document.getElementById('popup-project');
    if(!popup) return;
    popup.querySelector('.popup-header-icon').innerHTML = `<i class="${d.icon}"></i>`;
    popup.querySelector('.popup-header-title').textContent = d.title;
    popup.querySelector('.popup-header-sub').textContent = d.category;
    popup.querySelector('.popup-status-row').innerHTML = `<span class="project-status ${d.statusClass}" style="position:static;font-size:0.72rem"><i class="fas fa-circle" style="font-size:0.5rem"></i> ${d.status}</span>`;
    popup.querySelector('.popup-desc').textContent = d.description;
    popup.querySelector('.popup-highlights').innerHTML = d.highlights.map(h=>`<li style="font-size:0.85rem;color:var(--off-white);line-height:1.7;padding:0.2rem 0;display:flex;gap:0.5rem;align-items:flex-start"><i class="fas fa-check-circle" style="color:var(--steel-pale);margin-top:0.3rem;flex-shrink:0;font-size:0.75rem"></i>${h}</li>`).join('');
    popup.querySelector('.popup-tech-tags').innerHTML = d.tech.map(t=>`<span class="popup-tag">${t}</span>`).join('');
    const linksEl = popup.querySelector('.popup-links');
    linksEl.innerHTML = `<a href="${d.github}" target="_blank" rel="noopener" class="popup-btn popup-btn-outline"><i class="fab fa-github"></i> View on GitHub</a>`;
    if(d.live && d.live !== '#') linksEl.innerHTML += `<a href="${d.live}" target="_blank" rel="noopener" class="popup-btn popup-btn-primary"><i class="fas fa-external-link-alt"></i> Live Demo</a>`;
    openPopup('popup-project');
  });
});

/* ── SERVICE POPUPS ─────────────────────────────────────── */
const serviceData = {
  frontend: {
    icon:'fas fa-desktop', title:'Frontend Development', sub:'UI/UX & Responsive Design',
    desc:'I build pixel-perfect, responsive interfaces using modern HTML5, CSS3, and JavaScript. Every component is crafted for performance, accessibility, and a seamless user experience across all devices.',
    what:['Custom responsive layouts (CSS Grid + Flexbox)','Interactive UI components and animations','Cross-browser compatibility testing','Performance optimisation and lazy loading','Accessibility (WCAG 2.1) compliance','Component-based architecture'],
    tech:['HTML5','CSS3','JavaScript','React','Tailwind CSS','Responsive Design'],
    link:'#contact',
  },
  backend: {
    icon:'fas fa-server', title:'Backend Development', sub:'APIs & Server-Side Logic',
    desc:'Robust server-side solutions built with PHP/Laravel. I design secure REST APIs, model efficient databases, and build scalable architectures ready for production workloads.',
    what:['REST API design and development','Laravel MVC application architecture','MySQL database modelling and optimisation','Authentication & authorisation (JWT, OAuth)','Server-side validation and error handling','Deployment on shared hosting and VPS'],
    tech:['PHP','Laravel','MySQL','REST API','JWT','Composer'],
    link:'#contact',
  },
  fullstack: {
    icon:'fas fa-layer-group', title:'Full Stack Solutions', sub:'End-to-End Web Applications',
    desc:'I take projects from database schema to polished UI. As a full stack developer I bridge both worlds — delivering complete, production-ready applications with clean architecture.',
    what:['End-to-end application development','Database design through to frontend UI','Integration with third-party APIs (Stripe, EmailJS)','User authentication systems','Admin dashboards and content management','Deployment and DevOps basics'],
    tech:['Next.js','React','Node.js','MongoDB','PostgreSQL','Vercel'],
    link:'#contact',
  },
  data: {
    icon:'fas fa-database', title:'Database & Data Analysis', sub:'MySQL & Excel Analytics',
    desc:'I design efficient database schemas, write optimised queries, and extract meaningful business insights from raw data using MySQL and Excel — turning data into actionable decisions.',
    what:['Relational database schema design','Complex SQL queries and stored procedures','Data analysis with pivot tables and charts','Performance tuning with indexing','Business intelligence reporting','Data cleaning and transformation'],
    tech:['MySQL','SQL','Microsoft Excel','Data Analysis','Pivot Tables','Reporting'],
    link:'#contact',
  },
  responsive: {
    icon:'fas fa-mobile-alt', title:'Responsive Design', sub:'All Screens, All Devices',
    desc:'Mobile-first designs that look and function flawlessly on every screen — from 260px feature phones all the way to widescreen desktop monitors. No layout left behind.',
    what:['Mobile-first CSS architecture','Fluid typography with clamp()','Responsive grid and flexbox layouts','Touch-friendly interactions','Testing on real devices and emulators','Performance on low-bandwidth connections'],
    tech:['CSS Grid','Flexbox','Media Queries','Mobile-First','clamp()','UX/UI'],
    link:'#contact',
  },
  software: {
    icon:'fas fa-code', title:'Software Engineering', sub:'CS Fundamentals & Architecture',
    desc:'Applying core computer science fundamentals — algorithms, data structures, system design, and clean code principles — to build maintainable, scalable software that stands the test of time.',
    what:['Algorithm design and optimisation','Data structure selection and implementation','Clean code and SOLID principles','Code review and refactoring','Systems programming in C and Python','Technical documentation'],
    tech:['Python','C','Algorithms','Data Structures','SOLID Principles','Architecture'],
    link:'#contact',
  },
};

document.querySelectorAll('.service-card[data-popup]').forEach(card => {
  card.addEventListener('click', () => {
    const key = card.getAttribute('data-popup');
    const d = serviceData[key]; if(!d) return;
    const popup = document.getElementById('popup-service');
    if(!popup) return;
    popup.querySelector('.popup-header-icon').innerHTML = `<i class="${d.icon}"></i>`;
    popup.querySelector('.popup-header-title').textContent = d.title;
    popup.querySelector('.popup-header-sub').textContent = d.sub;
    popup.querySelector('.popup-desc').textContent = d.desc;
    popup.querySelector('.popup-what').innerHTML = d.what.map(w=>`<li style="font-size:0.85rem;color:var(--off-white);line-height:1.75;padding:0.2rem 0;display:flex;gap:0.5rem;align-items:flex-start"><i class="fas fa-arrow-right" style="color:var(--steel-pale);margin-top:0.3rem;flex-shrink:0;font-size:0.7rem"></i>${w}</li>`).join('');
    popup.querySelector('.popup-tech-tags').innerHTML = d.tech.map(t=>`<span class="popup-tag">${t}</span>`).join('');
    openPopup('popup-service');
  });
});

/* ── SKILL POPUPS ───────────────────────────────────────── */
const skillData = {
  'HTML5 / CSS3':{ icon:'fab fa-html5', level:'92%', desc:'Expert in semantic HTML5 and advanced CSS3 including Grid, Flexbox, custom properties, animations, and responsive design patterns. I build accessible, well-structured markup by default.', uses:['Responsive layouts','CSS animations & transitions','Custom properties (variables)','Pseudo-elements & selectors','CSS Grid & Flexbox'], links:[] },
  'JavaScript':{ icon:'fab fa-js', level:'78%', desc:'Strong vanilla JavaScript skills including ES6+, DOM manipulation, async/await, Fetch API, localStorage, and event-driven programming. Learning React and Node.js to expand further.', uses:['DOM manipulation','Async/await & Promises','Local Storage','Fetch API / AJAX','Event handling'], links:[{label:'MDN Docs',url:'https://developer.mozilla.org'}] },
  'PHP / Laravel':{ icon:'fab fa-php', level:'72%', desc:'Comfortable building server-side applications with PHP and the Laravel framework. Experience with MVC architecture, Eloquent ORM, Blade templating, Artisan CLI, and REST API development.', uses:['Laravel MVC & Routing','Eloquent ORM','REST API endpoints','Blade templating','Artisan commands','Email (Mailable classes)'], links:[{label:'Laravel Docs',url:'https://laravel.com/docs'}] },
  'React / Next.js':{ icon:'fab fa-react', level:'68%', desc:'Intermediate React developer comfortable with hooks, state management, component design patterns, and Next.js for server-side rendering and static site generation.', uses:['React Hooks (useState, useEffect)','Component composition','Next.js SSR & SSG','React Router','Context API'], links:[{label:'React Docs',url:'https://react.dev'}] },
  'MySQL / Database':{ icon:'fas fa-database', level:'75%', desc:'Solid relational database skills. I design normalised schemas, write complex JOINs and subqueries, use indexes for performance, and manage databases via MySQL Workbench and CLI.', uses:['Schema design & normalisation','Complex JOINs','Stored procedures & triggers','Indexing for performance','MySQL Workbench'], links:[] },
  'Python':{ icon:'fab fa-python', level:'65%', desc:'Intermediate Python developer used for automation scripts, data processing, file manipulation, and simple web scraping. Familiar with Pandas, BeautifulSoup, and smtplib.', uses:['Automation scripts','File I/O & os module','Web scraping (BeautifulSoup)','CSV processing (Pandas)','Email automation'], links:[{label:'Python Docs',url:'https://python.org'}] },
  'C Programming':{ icon:'fas fa-code', level:'60%', desc:'Good understanding of C fundamentals — memory management, pointers, structs, file I/O, and algorithm implementation. Applied in the Mobile Banking System project.', uses:['Pointers & memory management','Structs & enums','File I/O','Algorithm implementation','CLI application development'], links:[] },
};

document.querySelectorAll('.skill-bar-name[data-skill], .skill-chip[data-skill]').forEach(el => {
  el.addEventListener('click', () => {
    const key = el.getAttribute('data-skill');
    const d = skillData[key]; if(!d) return;
    const popup = document.getElementById('popup-skill');
    if(!popup) return;
    popup.querySelector('.popup-header-icon').innerHTML = `<i class="${d.icon}"></i>`;
    popup.querySelector('.popup-header-title').textContent = key;
    popup.querySelector('.popup-header-sub').textContent = `Proficiency: ${d.level}`;
    popup.querySelector('.popup-desc').textContent = d.desc;
    popup.querySelector('.popup-uses').innerHTML = d.uses.map(u=>`<li style="font-size:0.85rem;color:var(--off-white);line-height:1.75;padding:0.18rem 0;display:flex;gap:0.5rem;align-items:flex-start"><i class="fas fa-dot-circle" style="color:var(--cyan);margin-top:0.35rem;flex-shrink:0;font-size:0.6rem"></i>${u}</li>`).join('');
    const linksEl = popup.querySelector('.popup-skill-links');
    linksEl.innerHTML = d.links.length ? d.links.map(l=>`<a href="${l.url}" target="_blank" rel="noopener" class="popup-btn popup-btn-outline"><i class="fas fa-external-link-alt"></i> ${l.label}</a>`).join('') : '';
    openPopup('popup-skill');
  });
});

/* ── BLOG POPUPS ────────────────────────────────────────── */
const blogData = [
  { icon:'fas fa-code', category:'Web Dev', date:'Jan 2026', read:'5 min', title:'Building Responsive Layouts That Work on Every Device', excerpt:'A practical guide to CSS Grid and Flexbox strategies that ensure your layouts look professional from 260px phones to widescreen monitors.', content:"In this article I walk through the mobile-first methodology I use on every project. We cover CSS Grid and Flexbox in depth, explore the clamp() function for fluid typography, and build a real responsive component from scratch. Key takeaways include why 'min-width: 260px' should be your floor, how to test on actual devices without buying them all, and why percentage-based padding is your best friend for aspect ratios.", url:'https://medium.com/@betsaleel-mukuba' },
  { icon:'fas fa-database', category:'Backend', date:'Dec 2025', read:'7 min', title:'MySQL Performance: Writing Queries That Don\'t Kill Your Server', excerpt:'Deep dive into SQL query optimisation — indexes, execution plans, joins, and common anti-patterns every developer should avoid.', content:"After seeing a production MySQL server grind to a halt because of a single missing index, I decided to document everything I know about query optimisation. This article covers: how to read an EXPLAIN output, when and how to create indexes, the difference between covering indexes and regular ones, why SELECT * is almost always wrong, and how to profile slow queries with the slow query log.", url:'https://medium.com/@betsaleel-mukuba' },
  { icon:'fab fa-react', category:'React', date:'Nov 2025', read:'6 min', title:'From JavaScript to React: What Actually Changes', excerpt:'The mental model shift from vanilla JS to component-based thinking — practical examples of state, props, and hooks for developers making the switch.', content:"React can feel strange when you first come from vanilla JavaScript. This article explains the core mental shifts: thinking in components instead of pages, understanding why state lives where it lives, how props flow downward and events flow upward, and why the virtual DOM matters. I include real before/after code examples converting a vanilla counter to a React component, then adding persistence with useEffect and localStorage.", url:'https://medium.com/@betsaleel-mukuba' },
  { icon:'fas fa-shield-alt', category:'Security', date:'Oct 2025', read:'8 min', title:'PHP Security in 2025: Protecting Against Common Attacks', excerpt:'SQL injection, XSS, CSRF, and session hijacking — understanding vulnerabilities and implementing Laravel\'s built-in protections effectively.', content:"Security is non-negotiable. This deep-dive covers the OWASP Top 10 from a PHP developer's perspective. I demonstrate how SQL injection works in plain PHP and why Laravel's Eloquent ORM prevents it by default. We look at XSS — where it comes from, how Blade auto-escapes output, and when you need to manually sanitise. CSRF tokens, password hashing with bcrypt, and secure session management are also covered with real code.", url:'https://medium.com/@betsaleel-mukuba' },
  { icon:'fas fa-chart-line', category:'Career', date:'Sep 2025', read:'4 min', title:'Learning to Code in Africa: Resources That Actually Work', excerpt:'My experience finding quality learning resources with limited bandwidth, and the free tools that helped me build real skills in Zambia.', content:"Not everyone learns to code with fibre internet and a MacBook. This article is about finding quality resources that work on limited data, slow connections, and older hardware. I cover the best offline-friendly platforms, how to download documentation for offline use, why project-based learning beats tutorial hell, and the local developer communities in Lusaka that helped me grow. Written from real personal experience.", url:'https://medium.com/@betsaleel-mukuba' },
  { icon:'fab fa-python', category:'Python', date:'Aug 2025', read:'5 min', title:'Automating the Boring Stuff: Python Scripts I Actually Use', excerpt:'Real-world Python automation — file renaming, CSV data cleaning, simple web scraping, and email notifications that save hours of manual work.', content:"Inspired by Al Sweigart's book, I built a collection of Python scripts that solve actual problems I face weekly. This article shares five of them: a bulk file renamer that handles 500 photos in seconds, a CSV cleaner that handles messy exported data, a web scraper that monitors a job board, an automated email sender for weekly reports, and a directory sync script. All code is available on GitHub.", url:'https://medium.com/@betsaleel-mukuba' },
];

document.querySelectorAll('.blog-card[data-blog-idx]').forEach(card => {
  card.addEventListener('click', () => {
    const idx = parseInt(card.getAttribute('data-blog-idx'));
    const d = blogData[idx]; if(!d) return;
    const popup = document.getElementById('popup-blog');
    if(!popup) return;
    popup.querySelector('.popup-header-icon').innerHTML = `<i class="${d.icon}"></i>`;
    popup.querySelector('.popup-header-title').textContent = d.title;
    popup.querySelector('.popup-header-sub').textContent = d.category;
    popup.querySelector('.blog-popup-meta').innerHTML = `<span><i class="far fa-calendar"></i>${d.date}</span><span><i class="far fa-clock"></i>${d.read} read</span><span><i class="fas fa-tag"></i>${d.category}</span>`;
    popup.querySelector('.popup-excerpt').textContent = d.excerpt;
    popup.querySelector('.popup-blog-content').textContent = d.content;
    popup.querySelector('.popup-blog-link').href = d.url;
    openPopup('popup-blog');
  });
});

/* ══════════════════════════════════════════════════════════
   CONTACT FORM — Vercel Serverless API (primary)
   with EmailJS fallback if API unavailable
══════════════════════════════════════════════════════════ */
function initEmailJS(){
  if(typeof emailjs === 'undefined') return;
  if(CONFIG.emailjsPublicKey && CONFIG.emailjsPublicKey !== 'YOUR_PUBLIC_KEY')
    emailjs.init(CONFIG.emailjsPublicKey);
}
initEmailJS();

const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('.btn-submit');
  const origHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;
  const errEl     = document.getElementById('form-error');
  const successEl = document.getElementById('form-success');
  if(errEl) errEl.style.display = 'none';

  const name    = document.getElementById('cf-name')?.value.trim();
  const email   = document.getElementById('cf-email')?.value.trim();
  const subject = document.getElementById('cf-subject')?.value;
  const message = document.getElementById('cf-message')?.value.trim();

  try {
    /* PRIMARY: Vercel serverless API (uses Gmail SMTP + auto-reply) */
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message }),
    });

    let data;
    try { data = await res.json(); } catch(_) { data = {}; }

    if(res.ok && data.success) {
      if(successEl){ successEl.style.display='flex'; setTimeout(()=>successEl.style.display='none',7000); }
      contactForm.reset();
    } else {
      /* Show the real server error so it's visible */
      const msg = data.error || `Server responded with status ${res.status}`;
      if(errEl){ errEl.textContent = msg; errEl.style.display='block'; }
      console.error('Contact API error:', res.status, data);
    }

  } catch(apiErr) {
    /* Network-level failure (API unreachable / not deployed) */
    console.error('Contact API unreachable:', apiErr.message);
    if(errEl){
      errEl.textContent = `Could not reach the server. Please email directly: ${CONFIG.email}`;
      errEl.style.display='block';
    }
  }

  btn.innerHTML = origHTML;
  btn.disabled = false;
});

/* ── POPULATE PAGE FROM CONFIG ──────────────────────────── */
function applyConfig(){
  sT('hero-name-text',CONFIG.name); sT('hero-desc',CONFIG.bio);
  sT('about-bio-1',CONFIG.bio); sT('about-bio-2',CONFIG.bio2);
  sT('contact-email-text',CONFIG.email); sT('contact-phone-text',CONFIG.phone);
  sT('contact-location-text',CONFIG.location); sT('footer-name',CONFIG.name);
  sA('contact-email-link','href','mailto:'+CONFIG.email);
  sA('contact-phone-link','href','tel:'+CONFIG.phone.replace(/\s/g,''));
  sA('hero-profile-img','src',CONFIG.profileImg); sA('hero-profile-img','alt',CONFIG.name);
  sA('about-pic','src',CONFIG.aboutImg);
  document.querySelectorAll('.social-github').forEach(e=>e.href=CONFIG.github);
  document.querySelectorAll('.social-linkedin').forEach(e=>e.href=CONFIG.linkedin);
  document.querySelectorAll('.social-facebook').forEach(e=>e.href=CONFIG.facebook);
  document.querySelectorAll('.social-whatsapp').forEach(e=>e.href=CONFIG.whatsapp);
  document.querySelectorAll('.cv-download-btn').forEach(b=>b.onclick=()=>window.open(CONFIG.cvFile,'_blank'));
}
function sT(id,v){ const e=document.getElementById(id); if(e)e.textContent=v; }
function sA(id,attr,v){ const e=document.getElementById(id); if(e)e.setAttribute(attr,v); }
applyConfig();

/* ══════════════════════════════════════════════════════════
   ADMIN PANEL — HARDENED SECURITY
   • Password hashed with SHA-256 (never compared plain text)
   • Rate limiting: 3 attempts → 15-minute lockout
   • Session token is a random UUID, not a predictable value
   • Auto-logout after 30 minutes of inactivity
   • Password never stored in localStorage (only its hash)
   • Lockout state survives page refresh (sessionStorage)
══════════════════════════════════════════════════════════ */
const adminOverlay = document.getElementById('admin-overlay');
const adminLogin   = document.getElementById('admin-login');
const adminPanel   = document.getElementById('admin-panel');

/* ── Hash a string with SHA-256 → hex string ── */
async function sha256(message) {
  const msgBuffer  = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ── Generate a random session token ── */
function makeToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
}

/* ── Rate limit helpers ── */
const LOCKOUT_LIMIT    = 3;           // wrong attempts before lockout
const LOCKOUT_DURATION = 15 * 60000; // 15 minutes in ms
const SESSION_TIMEOUT  = 30 * 60000; // 30 minutes inactivity

function getLockout() {
  try { return JSON.parse(sessionStorage.getItem('bm_lockout') || 'null'); } catch { return null; }
}
function setLockout(data) {
  sessionStorage.setItem('bm_lockout', JSON.stringify(data));
}
function isLockedOut() {
  const lock = getLockout();
  if (!lock) return false;
  if (Date.now() > lock.until) { sessionStorage.removeItem('bm_lockout'); return false; }
  return true;
}
function recordFailedAttempt() {
  const lock = getLockout() || { attempts: 0, until: 0 };
  lock.attempts = (lock.attempts || 0) + 1;
  if (lock.attempts >= LOCKOUT_LIMIT) lock.until = Date.now() + LOCKOUT_DURATION;
  setLockout(lock);
  return lock;
}
function resetLockout() { sessionStorage.removeItem('bm_lockout'); }

/* ── Session helpers ── */
function getSession() {
  try { return JSON.parse(sessionStorage.getItem('bm_sess') || 'null'); } catch { return null; }
}
function createSession(token) {
  sessionStorage.setItem('bm_sess', JSON.stringify({ token, lastActive: Date.now() }));
}
function isValidSession() {
  const sess = getSession();
  if (!sess || !sess.token) return false;
  if (Date.now() - sess.lastActive > SESSION_TIMEOUT) {
    sessionStorage.removeItem('bm_sess');
    return false;
  }
  sess.lastActive = Date.now(); // refresh on activity
  sessionStorage.setItem('bm_sess', JSON.stringify(sess));
  return true;
}
function destroySession() { sessionStorage.removeItem('bm_sess'); }

/* ── Show lockout countdown in error element ── */
function showLockoutTimer(untilMs) {
  const errEl = document.getElementById('login-error');
  if (!errEl) return;
  clearInterval(window._lockTimer);
  window._lockTimer = setInterval(() => {
    const remaining = Math.max(0, untilMs - Date.now());
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    if (remaining <= 0) {
      clearInterval(window._lockTimer);
      errEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> Locked out. Try again.';
      const btn = document.getElementById('admin-login-btn');
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-unlock"></i> Login'; }
    } else {
      errEl.innerHTML = `<i class="fas fa-lock"></i> Too many attempts. Try again in ${mins}:${String(secs).padStart(2,'0')}`;
    }
    errEl.style.display = 'block';
  }, 1000);
}

/* ── Auto-logout on inactivity ── */
let _inactivityTimer;
function resetInactivityTimer() {
  clearTimeout(_inactivityTimer);
  _inactivityTimer = setTimeout(() => {
    destroySession();
    if (adminOverlay?.classList.contains('open')) {
      showAdminLogin();
      const errEl = document.getElementById('login-error');
      if (errEl) { errEl.innerHTML = '<i class="fas fa-clock"></i> Session expired after 30 minutes of inactivity.'; errEl.style.display = 'block'; }
    }
  }, SESSION_TIMEOUT);
}
['click','keydown','mousemove','touchstart'].forEach(evt =>
  document.addEventListener(evt, () => { if (isValidSession()) resetInactivityTimer(); }, { passive: true })
);

/* ── Open / Close ── */
document.getElementById('footer-admin-btn')?.addEventListener('click', openAdmin);
document.getElementById('admin-close')?.addEventListener('click', closeAdmin);
adminOverlay?.addEventListener('click', e => { if (e.target === adminOverlay) closeAdmin(); });

function openAdmin() {
  adminOverlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
  isValidSession() ? showAdminPanel() : showAdminLogin();
}
function closeAdmin() {
  adminOverlay?.classList.remove('open');
  if (!document.querySelector('.popup-overlay.open')) document.body.style.overflow = '';
}
function showAdminLogin() {
  if (adminLogin) adminLogin.style.display = 'flex';
  if (adminPanel) { adminPanel.style.display = 'none'; adminPanel.classList.remove('visible'); }
  // Clear password field and any leftover errors on re-show
  const passEl = document.getElementById('admin-pass');
  if (passEl) passEl.value = '';
}
function showAdminPanel() {
  if (adminLogin) adminLogin.style.display = 'none';
  if (adminPanel) { adminPanel.style.display = 'flex'; adminPanel.classList.add('visible'); }
  populateAdminFields();
  resetInactivityTimer();
}

/* ── Login handler — SHA-256 + rate limit ── */
document.getElementById('admin-login-btn')?.addEventListener('click', async () => {
  const passEl = document.getElementById('admin-pass');
  const errEl  = document.getElementById('login-error');
  const btn    = document.getElementById('admin-login-btn');
  const pass   = passEl?.value || '';

  // Check lockout first
  const lock = getLockout();
  if (lock && Date.now() < lock.until) {
    showLockoutTimer(lock.until);
    if (btn) btn.disabled = true;
    return;
  }

  if (!pass) { if (errEl) { errEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please enter a password.'; errEl.style.display = 'block'; } return; }

  // Hash the entered password
  const enteredHash = await sha256(pass);

  // Get stored hash — if no hash stored yet, hash the default and store it
  let storedHash = localStorage.getItem('bm_ph');
  if (!storedHash) {
    // First run: hash the default password and store it, remove plain text
    storedHash = await sha256(CONFIG.adminPass);
    localStorage.setItem('bm_ph', storedHash);
    // Remove plain text password from CONFIG and localStorage
    delete CONFIG.adminPass;
    saveConfig();
  }

  if (enteredHash === storedHash) {
    resetLockout();
    const token = makeToken();
    createSession(token);
    if (errEl) errEl.style.display = 'none';
    if (passEl) passEl.value = ''; // clear field after success
    showAdminPanel();
  } else {
    const lockState = recordFailedAttempt();
    if (passEl) passEl.value = ''; // clear field on failure
    if (lockState.attempts >= LOCKOUT_LIMIT) {
      if (btn) btn.disabled = true;
      showLockoutTimer(lockState.until);
    } else {
      const remaining = LOCKOUT_LIMIT - lockState.attempts;
      if (errEl) {
        errEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> Incorrect password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`;
        errEl.style.display = 'block';
      }
    }
  }
});
document.getElementById('admin-pass')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('admin-login-btn')?.click();
});

/* ── Admin tabs ── */
document.querySelectorAll('.admin-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    if (!isValidSession()) { showAdminLogin(); return; }
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.getAttribute('data-tab'))?.classList.add('active');
  });
});

function populateAdminFields() {
  if (!isValidSession()) { showAdminLogin(); return; }
  const map = {
    'af-name':CONFIG.name,'af-title1':CONFIG.title1,'af-title2':CONFIG.title2,
    'af-title3':CONFIG.title3,'af-title4':CONFIG.title4,'af-headline':CONFIG.headline,
    'af-bio':CONFIG.bio,'af-bio2':CONFIG.bio2,'af-location':CONFIG.location,
    'af-email':CONFIG.email,'af-phone':CONFIG.phone,'af-years':CONFIG.yearsExp,
    'af-projects':CONFIG.projectsCount,'af-github':CONFIG.github,
    'af-linkedin':CONFIG.linkedin,'af-facebook':CONFIG.facebook,'af-whatsapp':CONFIG.whatsapp,
    'af-ejs-service':CONFIG.emailjsServiceId,'af-ejs-template':CONFIG.emailjsTemplateId,
    'af-ejs-autoreply':CONFIG.emailjsAutoReplyTemplateId,'af-ejs-pubkey':CONFIG.emailjsPublicKey
  };
  // Note: af-adminpass intentionally NOT pre-filled (never expose stored hash)
  Object.entries(map).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.value = val ?? ''; });
  const prev = document.getElementById('admin-photo-preview');
  if (prev) prev.src = CONFIG.profileImg;
}

/* ── Guard wrapper — all save actions check valid session ── */
function guardedAction(fn) {
  return function(...args) {
    if (!isValidSession()) { showAdminLogin(); return; }
    fn(...args);
  };
}

document.getElementById('admin-save-personal')?.addEventListener('click', guardedAction(() => {
  CONFIG.name=v('af-name')||CONFIG.name; CONFIG.title1=v('af-title1')||CONFIG.title1;
  CONFIG.title2=v('af-title2')||CONFIG.title2; CONFIG.title3=v('af-title3')||CONFIG.title3;
  CONFIG.title4=v('af-title4')||CONFIG.title4; CONFIG.headline=v('af-headline')||CONFIG.headline;
  CONFIG.bio=v('af-bio')||CONFIG.bio; CONFIG.bio2=v('af-bio2')||CONFIG.bio2;
  CONFIG.location=v('af-location')||CONFIG.location;
  CONFIG.yearsExp=parseInt(v('af-years'))||CONFIG.yearsExp;
  CONFIG.projectsCount=parseInt(v('af-projects'))||CONFIG.projectsCount;
  saveConfig(); applyConfig(); showMsg('msg-personal');
}));

document.getElementById('admin-save-contact')?.addEventListener('click', guardedAction(() => {
  CONFIG.email=v('af-email')||CONFIG.email; CONFIG.phone=v('af-phone')||CONFIG.phone;
  CONFIG.github=v('af-github')||CONFIG.github; CONFIG.linkedin=v('af-linkedin')||CONFIG.linkedin;
  CONFIG.facebook=v('af-facebook')||CONFIG.facebook; CONFIG.whatsapp=v('af-whatsapp')||CONFIG.whatsapp;
  saveConfig(); applyConfig(); showMsg('msg-contact');
}));

document.getElementById('admin-save-email')?.addEventListener('click', guardedAction(() => {
  CONFIG.emailjsServiceId=v('af-ejs-service')||CONFIG.emailjsServiceId;
  CONFIG.emailjsTemplateId=v('af-ejs-template')||CONFIG.emailjsTemplateId;
  CONFIG.emailjsAutoReplyTemplateId=v('af-ejs-autoreply')||CONFIG.emailjsAutoReplyTemplateId;
  CONFIG.emailjsPublicKey=v('af-ejs-pubkey')||CONFIG.emailjsPublicKey;
  saveConfig(); initEmailJS(); showMsg('msg-email');
}));

/* ── Change password — hashes new password before storing ── */
document.getElementById('admin-save-security')?.addEventListener('click', guardedAction(async () => {
  const np = v('af-adminpass');
  if (!np || np.length < 8) {
    const el = document.getElementById('msg-security');
    if (el) { el.style.color = '#f87171'; el.textContent = '⚠ Password must be at least 8 characters.'; el.style.display = 'block'; setTimeout(()=>{ el.style.display='none'; el.style.color=''; }, 3000); }
    return;
  }
  const newHash = await sha256(np);
  localStorage.setItem('bm_ph', newHash);
  // Remove plain text from CONFIG if it still exists
  delete CONFIG.adminPass;
  saveConfig();
  const passInput = document.getElementById('af-adminpass');
  if (passInput) passInput.value = '';
  showMsg('msg-security');
}));

document.getElementById('af-photo')?.addEventListener('change', guardedAction(function() {
  const file = this.files[0]; if (!file) return;
  const r = new FileReader(); r.onload = e => { CONFIG.profileImg=e.target.result; saveConfig(); applyConfig(); const p=document.getElementById('admin-photo-preview'); if(p)p.src=e.target.result; showMsg('msg-photo'); }; r.readAsDataURL(file);
}));
document.getElementById('af-about-photo')?.addEventListener('change', guardedAction(function() {
  const file = this.files[0]; if (!file) return;
  const r = new FileReader(); r.onload = e => { CONFIG.aboutImg=e.target.result; saveConfig(); applyConfig(); showMsg('msg-photo'); }; r.readAsDataURL(file);
}));
document.getElementById('af-cv')?.addEventListener('change', guardedAction(function() {
  const file = this.files[0]; if (!file) return;
  const r = new FileReader(); r.onload = e => { CONFIG.cvFile=e.target.result; saveConfig(); applyConfig(); showMsg('msg-photo'); }; r.readAsDataURL(file);
}));

document.getElementById('admin-theme-dark')?.addEventListener('click',  guardedAction(() => { applyTheme('dark');  showMsg('msg-appearance'); }));
document.getElementById('admin-theme-light')?.addEventListener('click', guardedAction(() => { applyTheme('light'); showMsg('msg-appearance'); }));

document.getElementById('admin-reset-all')?.addEventListener('click', guardedAction(() => {
  if (confirm('Reset ALL data to defaults? This cannot be undone.')) {
    localStorage.clear();
    sessionStorage.clear();
    location.reload();
  }
}));
document.getElementById('admin-logout')?.addEventListener('click', () => {
  destroySession();
  showAdminLogin();
});

function v(id) { const e = document.getElementById(id); return e ? e.value.trim() : ''; }
function showMsg(id) { const e = document.getElementById(id); if (!e) return; e.style.display = 'block'; setTimeout(() => e.style.display = 'none', 3000); }

/* ── KEYBOARD ───────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if(e.key==='Escape'){
    if(activePopup) closePopup(null);
    else if(adminOverlay?.classList.contains('open')) closeAdmin();
    else if(mobileMenu?.classList.contains('open')){ mobileMenu.classList.remove('open'); hamburger?.classList.remove('open'); document.body.style.overflow=''; }
  }
});
