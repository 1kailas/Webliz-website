const menuToggle = document.querySelector('.menu-toggle');
menuToggle?.addEventListener('click', () => {
  const isOpen = document.body.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

document.querySelectorAll('.mobile-drawer a').forEach(link => link.addEventListener('click', () => {
  document.body.classList.remove('menu-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

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
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
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
  const packageMap = { foundation: 'New business website', growth: 'Growth website', care: 'Website care' };
  if (packageMap[packageName]) {
    const chosen = form.querySelector(`input[value="${packageMap[packageName]}"]`);
    if (chosen) chosen.checked = true;
  }

  function showStep(index) {
    steps.forEach((step, i) => step.classList.toggle('active', i === index));
    current = index;
    currentLabel.textContent = index + 1;
    nameLabel.textContent = stepNames[index];
    progress.style.width = `${(index + 1) * 25}%`;
    backButton.disabled = index === 0;
    nextButton.style.display = index === steps.length - 1 ? 'none' : 'inline-flex';
    submitButton.style.display = index === steps.length - 1 ? 'inline-flex' : 'none';
  }

  function validCurrentStep() {
    const fields = [...steps[current].querySelectorAll('input, select, textarea')];
    return fields.every(field => field.reportValidity());
  }

  nextButton.addEventListener('click', () => {
    if (validCurrentStep() && current < steps.length - 1) showStep(current + 1);
  });
  backButton.addEventListener('click', () => { if (current > 0) showStep(current - 1); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validCurrentStep()) return;
    document.querySelector('.wizard-progress').style.display = 'none';
    steps.forEach(step => step.classList.remove('active'));
    form.querySelector('.wizard-actions').style.display = 'none';
    form.querySelector('[data-client-name]').textContent = form.elements.firstName.value;
    form.querySelector('.form-success').classList.add('active');
  });
}
