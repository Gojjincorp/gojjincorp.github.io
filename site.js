const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
const form = document.querySelector('#brief-form');
const topic = document.querySelector('#topic');
const goal = document.querySelector('#goal');
const consent = document.querySelector('#brief-consent');
const privacyPolicy = document.querySelector('#brief-privacy');
const status = document.querySelector('#form-status');
let example = '';

document.documentElement.classList.add('js');

function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
}

menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!expanded));
});

navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

window.matchMedia('(max-width: 760px)').addEventListener('change', closeMenu);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});

for (const link of document.querySelectorAll('[data-topic]')) {
  link.addEventListener('click', () => {
    topic.value = link.dataset.topic;
    example = link.dataset.example || '';
    clearStatus();
  });
}

function clearStatus() {
  status.textContent = '';
}

form.addEventListener('input', clearStatus);
topic.addEventListener('change', () => { example = ''; });
goal.addEventListener('input', () => { goal.setCustomValidity(''); });

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearStatus();
  const projectGoals = goal.value.trim();
  if (!projectGoals) {
    goal.setCustomValidity('Please describe your project goals.');
    goal.reportValidity();
    return;
  }

  if (!consent.checked) {
    status.textContent = 'Please confirm your consent before opening your brief in your email app.';
    consent.focus();
    return;
  }

  const replyEmail = form.elements.email.value.trim();
  const company = form.elements.company.value.trim();
  const brief = [
    'Gojjin — Project brief',
    '',
    `Reply email: ${replyEmail}`,
    ...(company ? [`Company: ${company}`] : []),
    `Service: ${topic.value}`,
    ...(example ? [`Example project: ${example}`] : []),
    '',
    'Project goals',
    projectGoals,
    '',
  ].join('\n');

  const message = `${brief}\n${consent.labels[0].textContent.trim()}\nPrivacy Policy: ${privacyPolicy.href}`;
  const subject = encodeURIComponent('Gojjin project inquiry');
  const body = encodeURIComponent(message.replace(/\r?\n/g, '\r\n'));
  window.location.href = `mailto:hello@gojjin.com?subject=${subject}&body=${body}`;
  status.textContent = 'Review and send your brief in your email app. If your email app does not open, email hello@gojjin.com directly.';
});
