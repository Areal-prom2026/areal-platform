const dataSources = {
  services: 'content/services.json',
  projects: 'content/projects.json',
  documents: 'content/documents.json'
};

const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const header = document.querySelector('[data-header]');
const headerActions = document.querySelector('.header-actions');

const SERVICE_ICONS = {
  pipeline: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 15h6"></path><path d="M10 15a4 4 0 0 1 4-4h6"></path>
      <path d="M14 11v6"></path><path d="M16 11h4"></path><circle cx="18" cy="11" r="1.5"></circle>
    </svg>`,
  fittings: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h7"></path><path d="M13 7h7"></path><path d="M4 17h7"></path>
      <path d="M13 17h7"></path><path d="M11 7v10"></path><path d="M13 12h2"></path>
    </svg>`,
  network: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="6" cy="7" r="1.8"></circle><circle cx="18" cy="7" r="1.8"></circle>
      <circle cx="12" cy="17" r="1.8"></circle><path d="M7.5 8.2 10.9 15"></path>
      <path d="M16.5 8.2 13.1 15"></path><path d="M8 7h8"></path>
    </svg>`,
  welding: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 18l7-7"></path><path d="M11 12l2 2"></path><path d="M13 10l4 4"></path>
      <path d="M16 7l1 1"></path><path d="M17 8l1-3"></path><path d="M18 9l3-1"></path>
    </svg>`,
  project: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 5h14v14H5z"></path><path d="M8 9h8"></path><path d="M8 12h8"></path>
      <path d="M8 15h5"></path><path d="M15 5v14"></path>
    </svg>`,
  support: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 14.5c1.5-2 3.5-3 6-3s4.5 1 6 3"></path>
      <path d="M7 13l-2 2"></path><path d="M17 13l2 2"></path><path d="M8 15h8"></path><path d="M9 17h6"></path>
    </svg>`,
  default: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14"></path><path d="M12 5v14"></path>
    </svg>`
};

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('is-open', !isOpen);
    headerActions?.classList.toggle('is-open', !isOpen);
  });
}

function updateHeaderState() {
  if (!header) return;
  header.classList.toggle('is-scrolled', header.hasAttribute('data-solid-header') || window.scrollY > 12);
}
updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Cannot load ${url}`);
  return response.json();
}

function getSlug() {
  return new URLSearchParams(window.location.search).get('id');
}

function renderServices(items) {
  const target = document.querySelector('#services-list');
  if (!target) return;
  target.innerHTML = items.map(item => `
    <a class="service-card" id="${item.id}" href="service.html?id=${encodeURIComponent(item.id)}">
      <div class="service-icon">${SERVICE_ICONS[item.icon] || SERVICE_ICONS.default}</div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <ul>${item.works.slice(0, 3).map(work => `<li>${work}</li>`).join('')}</ul>
      <span class="btn btn-secondary">Подробнее</span>
    </a>
  `).join('');
}

function renderProjects(items) {
  const tabs = document.querySelector('#project-tabs');
  const target = document.querySelector('#projects-list');
  const prev = document.querySelector('[data-project-prev]');
  const next = document.querySelector('[data-project-next]');
  if (!tabs || !target) return;

  let active = 0;
  const visibleItems = items.slice(0, 3);

  function paint() {
    const item = visibleItems[active];
    tabs.innerHTML = visibleItems.map((project, index) => `
      <button class="project-tab ${index === active ? 'is-active' : ''}" type="button" role="tab" aria-selected="${index === active}" data-project-tab="${index}">
        ${project.title}
      </button>
    `).join('');
    target.innerHTML = `
      <div class="project-image" style="background-image: linear-gradient(135deg, rgba(10,31,53,.16), rgba(243,107,33,.22)), url('${item.image || 'assets/img/fon_main_present.png'}')"></div>
      <article class="project-card">
        <p class="project-meta">${item.location} • ${item.type}</p>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <p><strong>Выполненные работы:</strong> ${item.works}</p>
        <a class="btn project-link" href="project.html?id=${encodeURIComponent(item.id)}">Открыть объект</a>
      </article>
    `;
    tabs.querySelectorAll('[data-project-tab]').forEach(button => {
      button.addEventListener('click', () => {
        active = Number(button.dataset.projectTab);
        paint();
      });
    });
  }

  prev?.addEventListener('click', () => {
    active = (active - 1 + visibleItems.length) % visibleItems.length;
    paint();
  });
  next?.addEventListener('click', () => {
    active = (active + 1) % visibleItems.length;
    paint();
  });
  paint();
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

function renderServiceDetail(items) {
  const target = document.querySelector('[data-service-detail]');
  if (!target) return;
  const slug = getSlug();
  const item = items.find(service => service.id === slug) || items[0];
  document.title = `${item.title} - АРЕАЛ-ПРОМ`;
  target.innerHTML = `
    <section class="detail-hero">
      <div>
        <p class="hero-eyebrow">Услуга</p>
        <h1>${item.title}</h1>
        <p>${item.description}</p>
        <a class="btn" href="index.html#request">Получить расчет стоимости</a>
      </div>
      <div class="detail-visual" style="background-image: url('${item.image || 'assets/img/fon_main_present.png'}')"></div>
    </section>
    <section class="detail-layout">
      <aside class="detail-aside">
        <p class="eyebrow">Состав работ</p>
        <h2>Что входит</h2>
      </aside>
      <div class="detail-list">
        ${item.works.map((work, index) => `
          <section>
            <h3>${String(index + 1).padStart(2, '0')}. ${work}</h3>
            <p>${item.details?.[index] || 'Работы выполняются по проекту, с учетом требований объекта, нормативной документации и дальнейшей эксплуатации.'}</p>
          </section>
        `).join('')}
      </div>
    </section>
  `;
}

function renderProjectDetail(items) {
  const target = document.querySelector('[data-project-detail]');
  if (!target) return;
  const slug = getSlug();
  const item = items.find(project => project.id === slug) || items[0];
  document.title = `${item.title} - АРЕАЛ-ПРОМ`;
  target.innerHTML = `
    <section class="detail-hero">
      <div>
        <p class="hero-eyebrow">Объект</p>
        <h1>${item.title}</h1>
        <p>${item.description}</p>
        <a class="btn" href="index.html#request">Обсудить похожий проект</a>
      </div>
      <div class="detail-visual" style="background-image: url('${item.image || 'assets/img/fon_main_present.png'}')"></div>
    </section>
    <section class="section">
      <div class="gallery-grid">
        ${(item.gallery || [item.image, 'assets/img/fon_main_present.png', 'assets/img/fon_pipe.png']).map(image => `<div style="background-image: url('${image}')"></div>`).join('')}
      </div>
    </section>
    <section class="detail-layout">
      <aside class="detail-aside">
        <p class="eyebrow">Паспорт объекта</p>
        <h2>Проект и выполненные работы</h2>
      </aside>
      <div class="detail-list">
        <section><h3>Местоположение</h3><p>${item.location}</p></section>
        <section><h3>Тип объекта</h3><p>${item.type}</p></section>
        <section><h3>Выполненные работы</h3><p>${item.works}</p></section>
        <section><h3>Основные характеристики и задачи</h3><p>${item.tasks}</p></section>
        <section><h3>Результат</h3><p>${item.result}</p></section>
      </div>
    </section>
  `;
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
    renderServiceDetail(services);
    renderProjectDetail(projects);
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
