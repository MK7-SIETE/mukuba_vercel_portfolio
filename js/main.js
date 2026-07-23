/* ---------- EmailJS config — replace with my own keys ---------- */
const EMAILJS_PUBLIC_KEY = 'IV6EkLZ-dsih3bWDn';
const EMAILJS_SERVICE_ID = 'service_7ou24do';
const EMAILJS_TEMPLATE_ID = 'template_hqzo3tx';        
const EMAILJS_AUTOREPLY_TEMPLATE_ID = 'template_nzzdl9d';               

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- mobile nav ---------- */
  const mobileNav = document.getElementById('mobile-nav');
  const openBtn = document.getElementById('mobile-open');
  const closeBtn = document.getElementById('mobile-close');

  function openNav(){ mobileNav.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeNav(){ mobileNav.classList.remove('open'); document.body.style.overflow = ''; }

  if (openBtn) openBtn.addEventListener('click', openNav);
  if (closeBtn) closeBtn.addEventListener('click', closeNav);
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  /* ---------- active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main .section[id]');
  const railLinks = document.querySelectorAll('.rail-nav a[data-nav]');

  function setActive(id){
    railLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.nav === id);
    });
  }

  if ('IntersectionObserver' in window && sections.length){
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(sec => navObserver.observe(sec));
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length){
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- stat counters ---------- */
  const counters = document.querySelectorAll('.count');
  function animateCount(el){
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 900;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(progress * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window && counters.length){
    const countObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(el => countObserver.observe(el));
  }

  /* ---------- back to top ---------- */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop){
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- contact form (EmailJS) ---------- */
  const contactForm = document.getElementById('contact-form');
  const cfStatus = document.getElementById('cf-status');
  const cfSubmit = document.getElementById('cf-submit');

  if (contactForm && window.emailjs) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      cfSubmit.disabled = true;
      cfStatus.textContent = 'Sending…';
      cfStatus.className = 'form-status';

      emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
        .then(() => {
          if (EMAILJS_AUTOREPLY_TEMPLATE_ID) {
            return emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_TEMPLATE_ID, contactForm);
          }
        })
        .then(() => {
          cfStatus.textContent = "Message sent — I'll get back to you soon.";
          cfStatus.className = 'form-status ok';
          contactForm.reset();
        })
        .catch((err) => {
          console.error('EmailJS error:', err);
          cfStatus.textContent = 'Something went wrong — please email me directly.';
          cfStatus.className = 'form-status err';
        })
        .finally(() => {
          cfSubmit.disabled = false;
        });
    });
  }

});
