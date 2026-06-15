const menuToggle = document.querySelector('.menu-toggle');
menuToggle?.addEventListener('click', () => {
  const isOpen = document.body.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
    document.body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open menu');
    menuToggle?.focus();
  }
});

const header = document.querySelector('.site-header');
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);
window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
}, { passive: true });

let initParallax = () => {};
if (window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  window.addEventListener('pointermove', event => {
    glow.animate({ transform: `translate(${event.clientX - 150}px, ${event.clientY - 150}px)` }, { duration: 700, fill: 'forwards' });
  });

  initParallax = () => {
    const visual = document.querySelector('.hero-visual');
    if (!visual) return;
    visual.addEventListener('pointermove', event => {
      const box = visual.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - .5;
      const y = (event.clientY - box.top) / box.height - .5;
      visual.style.setProperty('--parallax-x', `${x * 12}px`);
      visual.style.setProperty('--parallax-y', `${y * 12}px`);
    });
    visual.addEventListener('pointerleave', () => {
      visual.style.setProperty('--parallax-x', '0px');
      visual.style.setProperty('--parallax-y', '0px');
    });
  };
}

function initPageScripts() {
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  initParallax();

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  document.querySelectorAll('.faq-item button').forEach(button => {
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('open');
        faq.querySelector('button')?.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const form = document.querySelector('#project-form');
  if (form) {
    const steps = [...form.querySelectorAll('.form-step')];
    const nextButton = form.querySelector('.next-button');
    const backButton = form.querySelector('.back-button');
    const submitButton = form.querySelector('.submit-button');
    const progress = document.querySelector('.progress-track i');
    const currentLabel = document.querySelector('[data-current-step]');
    const nameLabel = document.querySelector('[data-step-name]');
    const stepNames = ['About you', 'Your project', 'Scope & investment', 'Your goals'];
    let current = 0;

    const packageName = new URLSearchParams(window.location.search).get('package');
    const packageMap = { starter: 'New business website', business: 'Growth website', premium: 'Premium website' };
    if (packageMap[packageName]) {
      const chosen = form.querySelector(`input[value="${packageMap[packageName]}"]`);
      if (chosen) chosen.checked = true;
    }
    const budgetMap = { starter: 'Starter — ₹1,999', business: 'Business — ₹3,999', premium: 'Premium — ₹5,999' };
    if (budgetMap[packageName] && form.elements.budget) form.elements.budget.value = budgetMap[packageName];

    function showStep(index) {
      steps.forEach((step, i) => step.classList.toggle('active', i === index));
      current = index;
      currentLabel.textContent = index + 1;
      nameLabel.textContent = stepNames[index];
      progress.style.width = `${(index + 1) * 25}%`;
      backButton.disabled = index === 0;
      nextButton.style.display = index === steps.length - 1 ? 'none' : 'inline-flex';
      submitButton.style.display = index === steps.length - 1 ? 'inline-flex' : 'none';
      steps[index].querySelector('input, select, textarea')?.focus({ preventScroll: true });
    }

    function validCurrentStep() {
      const fields = [...steps[current].querySelectorAll('input, select, textarea')];
      return fields.every(field => field.reportValidity());
    }

    nextButton.addEventListener('click', () => {
      if (validCurrentStep() && current < steps.length - 1) showStep(current + 1);
    });
    backButton.addEventListener('click', () => { if (current > 0) showStep(current - 1); });
    
    // Clear previous submit listener if any (just in case)
    const newForm = form.cloneNode(true);
    form.replaceWith(newForm);
    newForm.addEventListener('submit', event => {
      event.preventDefault();
      const currentSteps = [...newForm.querySelectorAll('.form-step')];
      const stepFields = [...currentSteps[current].querySelectorAll('input, select, textarea')];
      if (!stepFields.every(field => field.reportValidity())) return;
      
      const subBtn = newForm.querySelector('.submit-button');
      subBtn.disabled = true;
      subBtn.innerHTML = 'Opening WhatsApp…';

      const data = new FormData(newForm);
      const message = [
        'New Webliz project enquiry',
        '',
        `Name: ${data.get('firstName')} ${data.get('lastName')}`,
        `Company: ${data.get('company')}`,
        `Email: ${data.get('email')}`,
        `Project: ${data.get('service')}`,
        `Package: ${data.get('budget')}`,
        `Timeline: ${data.get('timeline')}`,
        data.get('website') ? `Current website: ${data.get('website')}` : '',
        '',
        'Goals:',
        data.get('goals'),
        data.get('source') ? `How they found Webliz: ${data.get('source')}` : ''
      ].filter(Boolean).join('\n');
      const whatsappUrl = `https://wa.me/916282766374?text=${encodeURIComponent(message)}`;
      newForm.querySelector('[data-whatsapp-link]').href = whatsappUrl;
      newForm.querySelector('[data-client-name]').textContent = data.get('firstName');
      document.querySelector('.wizard-progress').style.display = 'none';
      currentSteps.forEach(step => step.classList.remove('active'));
      newForm.querySelector('.wizard-actions').style.display = 'none';
      newForm.querySelector('.form-success').classList.add('active');
      window.open(whatsappUrl, '_blank', 'noopener');
    });
  }
}

// Initialize on first load
initPageScripts();

async function navigateTo(url, isBack = false) {
  document.body.classList.add('leaving');
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    setTimeout(() => {
      document.title = doc.title;
      document.querySelector('main').innerHTML = doc.querySelector('main').innerHTML;
      
      const targetPath = new URL(url, window.location.origin).pathname;
      document.querySelectorAll('.desktop-nav a, .mobile-drawer nav a').forEach(a => {
        const linkPath = new URL(a.href, window.location.origin).pathname;
        if (linkPath === targetPath) a.classList.add('active');
        else a.classList.remove('active');
      });

      if (!isBack) window.history.pushState({}, '', url);
      window.scrollTo(0, 0);
      
      initPageScripts();
      
      document.body.classList.remove('leaving');
    }, 280);
  } catch (e) {
    window.location.href = url;
  }
}

window.addEventListener('popstate', () => {
  navigateTo(window.location.href, true);
});

document.body.addEventListener('click', event => {
  const link = event.target.closest('a[href]');
  if (!link) return;
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  
  const href = link.getAttribute('href');
  
  if (link.closest('.mobile-drawer') && document.body.classList.contains('menu-open')) {
    document.body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }

  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
  
  const target = new URL(link.href, window.location.href);
  if (target.origin !== window.location.origin) return;
  
  if (target.pathname === window.location.pathname && target.hash) return;
  
  event.preventDefault();

  if (document.body.classList.contains('menu-open')) {
    document.body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }

  navigateTo(link.href);
});
