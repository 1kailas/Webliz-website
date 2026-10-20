(() => {
  document.documentElement.classList.add('js');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuToggle = document.querySelector('.menu-toggle');
  const header = document.querySelector('.site-header');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  let lastFocusedElement = null;
  const currentPath = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  const activePath = currentPath === '/home' ? '/' : currentPath;

  if (menuToggle && mobileDrawer) {
    const drawerId = mobileDrawer.id || 'mobile-navigation';
    mobileDrawer.id = drawerId;
    mobileDrawer.querySelector('nav')?.setAttribute('aria-label', 'Mobile navigation');
    menuToggle.setAttribute('aria-controls', drawerId);
    mobileDrawer.setAttribute('aria-hidden', 'true');
  }
  document.querySelector('.desktop-nav')?.setAttribute('aria-label', 'Primary navigation');
  document.querySelectorAll('.desktop-nav a, .mobile-drawer nav a').forEach((link) => {
    const linkPath =
      new URL(link.href, window.location.href).pathname.replace(/\.html$/, '').replace(/\/$/, '') ||
      '/';
    const isCurrent = linkPath === activePath;
    link.classList.toggle('active', isCurrent);
    if (isCurrent) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  // Keep the mobile navigation state in sync with the button and keyboard.
  function setMenuOpen(open) {
    if (open) lastFocusedElement = document.activeElement;
    document.body.classList.toggle('menu-open', open);
    menuToggle?.setAttribute('aria-expanded', String(open));
    menuToggle?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileDrawer?.setAttribute('aria-hidden', String(!open));
    if (open) {
      mobileDrawer?.querySelector('a, button')?.focus({ preventScroll: true });
    } else if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus({ preventScroll: true });
      lastFocusedElement = null;
    }
  }

  menuToggle?.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
      setMenuOpen(false);
      menuToggle?.focus();
    }

    if (event.key === 'Tab' && document.body.classList.contains('menu-open') && mobileDrawer) {
      const focusable = [...mobileDrawer.querySelectorAll('a[href], button:not([disabled])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  document.querySelectorAll('.mobile-drawer a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  // Header treatment and reading progress are updated in one animation frame.
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  let scrollQueued = false;
  const updateScrollUI = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? window.scrollY / distance : 0})`;
    scrollQueued = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!scrollQueued) {
        scrollQueued = true;
        window.requestAnimationFrame(updateScrollUI);
      }
    },
    { passive: true },
  );
  updateScrollUI();

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Reveal content as it enters view; show it immediately on older browsers.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  // Accordion buttons expose their state to assistive technology.
  document.querySelectorAll('.faq-item button').forEach((button, index) => {
    const panel = button.nextElementSibling;
    const panelId = `faq-panel-${index + 1}`;
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', panelId);
    panel?.setAttribute('id', panelId);
    panel?.setAttribute('role', 'region');
    panel?.setAttribute('aria-labelledby', `faq-button-${index + 1}`);
    panel?.setAttribute('aria-hidden', 'true');
    button.setAttribute('id', `faq-button-${index + 1}`);
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const willOpen = !item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach((faq) => {
        faq.classList.remove('open');
        faq.querySelector('button')?.setAttribute('aria-expanded', 'false');
        faq.querySelector('[role="region"]')?.setAttribute('aria-hidden', 'true');
      });
      if (willOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
        item.querySelector('[role="region"]')?.setAttribute('aria-hidden', 'false');
      }
    });
  });

  initProjectForm();

  function initProjectForm() {
    const form = document.querySelector('#project-form');
    if (!form) return;

    const steps = [...form.querySelectorAll('.form-step')];
    const nextButton = form.querySelector('.next-button');
    const backButton = form.querySelector('.back-button');
    const submitButton = form.querySelector('.submit-button');
    const progressTrack = form.querySelector('.progress-track i');
    const progressRegion = form.querySelector('.progress-track');
    const currentLabel = form.querySelector('[data-current-step]');
    const nameLabel = form.querySelector('[data-step-name]');
    const actions = form.querySelector('.wizard-actions');
    const success = form.querySelector('.form-success');
    const stepNames = ['About you', 'Your project', 'Scope & investment', 'Your goals'];
    let current = 0;
    let isSubmitting = false;

    progressRegion?.setAttribute('role', 'progressbar');
    progressRegion?.setAttribute('aria-label', 'Enquiry progress');
    progressRegion?.setAttribute('aria-valuemin', '1');
    progressRegion?.setAttribute('aria-valuemax', String(steps.length));

    const params = new URLSearchParams(window.location.search);
    const packageName = params.get('package');
    const packageMap = {
      starter: ['New business website', 'Starter — ₹1,999'],
      business: ['Business website', 'Business — ₹3,999'],
      premium: ['Premium website', 'Premium — ₹5,999'],
    };
    if (packageMap[packageName]) {
      const [service, budget] = packageMap[packageName];
      const serviceOption = [...form.querySelectorAll('[name="service"]')].find(
        (input) => input.value === service,
      );
      if (serviceOption) serviceOption.checked = true;
      if (form.elements.budget) form.elements.budget.value = budget;
    }

    function showStep(index, moveFocus = true) {
      current = index;
      steps.forEach((step, stepIndex) => {
        step.classList.toggle('active', stepIndex === index);
        step.setAttribute('aria-hidden', String(stepIndex !== index));
      });
      if (currentLabel) currentLabel.textContent = String(index + 1);
      if (nameLabel) nameLabel.textContent = stepNames[index];
      if (progressTrack) progressTrack.style.width = `${((index + 1) / steps.length) * 100}%`;
      progressRegion?.setAttribute('aria-valuenow', String(index + 1));
      if (backButton) backButton.disabled = index === 0;
      if (nextButton) nextButton.hidden = index === steps.length - 1;
      if (submitButton) submitButton.hidden = index !== steps.length - 1;
      if (moveFocus)
        steps[index]
          .querySelector('input:not([type="radio"]), select, textarea, input[type="radio"]')
          ?.focus({ preventScroll: true });
    }

    function currentStepIsValid() {
      const invalidField = [...steps[current].querySelectorAll('input, select, textarea')].find(
        (field) => !field.checkValidity(),
      );
      if (!invalidField) return true;
      invalidField.reportValidity();
      return false;
    }

    nextButton?.addEventListener('click', () => {
      if (currentStepIsValid() && current < steps.length - 1) showStep(current + 1);
    });
    backButton?.addEventListener('click', () => {
      if (current > 0) showStep(current - 1);
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (isSubmitting) return;
      if (current < steps.length - 1) {
        if (currentStepIsValid()) showStep(current + 1);
        return;
      }
      if (!currentStepIsValid()) return;
      isSubmitting = true;

      const data = new FormData(form);
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
        data.get('source') ? `How they found Webliz: ${data.get('source')}` : '',
      ]
        .filter(Boolean)
        .join('\n');
      const whatsappUrl = `https://wa.me/916282766374?text=${encodeURIComponent(message)}`;
      const whatsappLink = form.querySelector('[data-whatsapp-link]');
      if (whatsappLink) whatsappLink.href = whatsappUrl;
      const clientName = form.querySelector('[data-client-name]');
      if (clientName) clientName.textContent = data.get('firstName') || 'there';
      if (submitButton) submitButton.disabled = true;

      // Open during the submit gesture so browsers do not block the WhatsApp tab.
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      form.querySelector('.wizard-progress')?.setAttribute('hidden', '');
      steps.forEach((step) => step.classList.remove('active'));
      actions?.setAttribute('hidden', '');
      success?.classList.add('active');
      success?.focus?.({ preventScroll: true });
    });

    showStep(0, false);
  }
})();
