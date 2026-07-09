const dataSources = {
  services: 'content/services.json',
  projects: 'content/projects.json',
  documents: 'content/documents.json'
};

const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const headerActions = document.querySelector('.header-actions');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('is-open', !isOpen);
    headerActions?.classList.toggle('is-open', !isOpen);
  });
}

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Cannot load ${url}`);
  return response.json();
}

function renderServices(items) {
  const target = document.querySelector('#services-list');
  if (!target) return;
  target.innerHTML = items.map((item, index) => `
    <article class="service-card" id="${item.id}">
      <div class="service-icon">${String(index + 1).padStart(2, '0')}</div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <ul>${item.works.map(work => `<li>${work}</li>`).join('')}</ul>
      <a class="btn btn-secondary" href="#request">Получить расчет стоимости</a>
    </article>
  `).join('');
}

function renderProjects(items) {
  const target = document.querySelector('#projects-list');
  if (!target) return;
  target.innerHTML = items.map(item => `
    <article class="project-card">
      <div class="project-visual" role="img" aria-label="${item.title}"></div>
      <p class="project-meta">${item.region} • ${item.status}</p>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </article>
  `).join('');
}

function renderDocuments(items) {
  const target = document.querySelector('#documents-list');
  if (!target) return;
  target.innerHTML = items.map(item => `
    <a class="doc-card" href="${item.href}" target="_blank" rel="noreferrer">
      <strong>${item.title}</strong>
      <span>${item.type}</span>
    </a>
  `).join('');
}

async function initContent() {
  try {
    const [services, projects, documents] = await Promise.all([
      getJson(dataSources.services),
      getJson(dataSources.projects),
      getJson(dataSources.documents)
    ]);
    renderServices(services);
    renderProjects(projects);
    renderDocuments(documents);
  } catch (error) {
    console.error(error);
  }
}

const form = document.querySelector('[data-request-form]');
if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const status = form.querySelector('[data-form-status]');
    const formData = new FormData(form);
    if (formData.get('company')) return;
    const phone = String(formData.get('phone') || '').trim();
    if (phone.length < 6) {
      status.textContent = 'Укажите телефон для связи.';
      return;
    }
    const subject = encodeURIComponent('Заявка с сайта АРЕАЛ-ПРОМ');
    const body = encodeURIComponent([
      `Имя: ${formData.get('name') || ''}`,
      `Телефон: ${phone}`,
      `Комментарий: ${formData.get('message') || ''}`
    ].join('\n'));
    status.textContent = 'Заявка подготовлена. Откроется почтовая программа для отправки.';
    window.location.href = `mailto:info@areal-prom.ru?subject=${subject}&body=${body}`;
  });
}

initContent();
