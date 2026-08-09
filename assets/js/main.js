const dataSources = {
  services: 'content/services.json',
  projects: 'content/projects.json',
  documents: 'content/documents.json'
};

const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const headerActions = document.querySelector('.header-actions');

const SERVICE_ICONS = {
  pipeline: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 15h6"></path>
      <path d="M10 15a4 4 0 0 1 4-4h6"></path>
      <path d="M14 11v6"></path>
      <path d="M16 11h4"></path>
      <circle cx="18" cy="11" r="1.5"></circle>
    </svg>
  `,
  fittings: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h7"></path>
      <path d="M13 7h7"></path>
      <path d="M4 17h7"></path>
      <path d="M13 17h7"></path>
      <path d="M11 7v10"></path>
      <path d="M13 12h2"></path>
    </svg>
  `,
  network: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="6" cy="7" r="1.8"></circle>
      <circle cx="18" cy="7" r="1.8"></circle>
      <circle cx="12" cy="17" r="1.8"></circle>
      <path d="M7.5 8.2 10.9 15"></path>
      <path d="M16.5 8.2 13.1 15"></path>
      <path d="M8 7h8"></path>
    </svg>
  `,
  welding: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 18l7-7"></path>
      <path d="M11 12l2 2"></path>
      <path d="M13 10l4 4"></path>
      <path d="M16 7l1 1"></path>
      <path d="M17 8l1-3"></path>
      <path d="M18 9l3-1"></path>
    </svg>
  `,
  project: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 5h14v14H5z"></path>
      <path d="M8 9h8"></path>
      <path d="M8 12h8"></path>
      <path d="M8 15h5"></path>
      <path d="M15 5v14"></path>
    </svg>
  `,
  support: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 14.5c1.5-2 3.5-3 6-3s4.5 1 6 3"></path>
      <path d="M7 13l-2 2"></path>
      <path d="M17 13l2 2"></path>
      <path d="M8 15h8"></path>
      <path d="M9 17h6"></path>
    </svg>
  `,
  default: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14"></path>
      <path d="M12 5v14"></path>
    </svg>
  `
};

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
      <div class="service-icon">${SERVICE_ICONS[item.icon] || SERVICE_ICONS.default}</div>
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
