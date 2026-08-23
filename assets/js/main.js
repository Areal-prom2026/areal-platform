const dataSources = {
  services: 'content/services.json',
  projects: 'content/projects.json',
  documents: 'content/documents.json'
};

const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const header = document.querySelector('[data-header]');
const headerActions = document.querySelector('.header-actions');

const STANDARD_FOOTER = `
  <div class="footer-main">
    <a class="footer-brand" href="index.html#top" aria-label="АРЕАЛ-ПРОМ"><img src="assets/img/logo_ho_web.png" alt="АРЕАЛ-ПРОМ"></a>
    <p>Монтаж и проектирование трубопроводов и инженерных сетей для промышленных, коммерческих и инфраструктурных объектов.</p>
    <div class="footer-socials" aria-label="Каналы связи">
      <a href="https://t.me/areal_prom" target="_blank" rel="noreferrer" aria-label="Telegram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 4-3 16-5.5-4-3.2 3.1.5-4.5L17 8 7 13l-4-1.5L21 4Z"/></svg></a>
      <a href="mailto:info@areal-prom.ru" aria-label="Электронная почта"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/></svg></a>
      <a href="tel:+79215317136" aria-label="Позвонить"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3 4.5 5.5c-1 1 1.5 7 5.5 11s10 6.5 11 5.5L21 19l-4-2-2 2c-2-1-5-4-6-6l2-2-2-4Z"/></svg></a>
    </div>
  </div>
  <div class="footer-nav-group"><h2>Навигация</h2><a href="index.html#services">Услуги</a><a href="index.html#projects">Наши объекты</a><a href="index.html#about">О компании</a><a href="index.html#contacts">Контакты</a></div>
  <div class="footer-nav-group"><h2>Для заказчиков</h2><a href="index.html#documents">Документы</a><a href="index.html#request">Заявка на расчет</a><a href="privacy.html">Политика конфиденциальности</a><a href="sitemap.xml">Карта сайта</a></div>
  <div class="footer-contacts"><h2>Связаться</h2><a href="tel:+79215317136">+7 921 531-71-36</a><a href="mailto:info@areal-prom.ru">info@areal-prom.ru</a><address>г. Череповец, ул. Олимпийская, д. 77, офис 216/1</address></div>
  <div class="footer-bottom"><span>© 2026 ООО «АРЕАЛ-ПРОМ»</span><span>Инженерный подрядчик</span></div>`;

function initFooter() {
  const footer = document.querySelector('.site-footer');
  if (footer && !footer.querySelector('.footer-main')) footer.innerHTML = STANDARD_FOOTER;
}

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
  header.classList.toggle('is-scrolled', window.scrollY > 12);
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
    <a class="service-card" id="${item.id}" href="service.html?id=${encodeURIComponent(item.id)}" style="--service-background: url('${item.backgroundImage || ''}')">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <span class="service-link">Подробнее <span aria-hidden="true">→</span></span>
    </a>
  `).join('');
}

function renderProjects(items) {
  const target = document.querySelector('#projects-list');
  if (!target) return;
  target.innerHTML = items.map(item => `
    <a class="project-case" href="project.html?id=${encodeURIComponent(item.id)}">
      <div class="project-case-image" style="background-image: linear-gradient(180deg, rgba(7,21,37,0) 38%, rgba(7,21,37,.82) 100%), url('${item.image}')">
        <span>${item.year || 'Реализованный проект'}</span>
      </div>
      <div class="project-case-content">
        <p class="project-meta">${item.location} <span aria-hidden="true">/</span> ${item.type}</p>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <span class="service-link">Смотреть кейс <span aria-hidden="true">→</span></span>
      </div>
    </a>
  `).join('');
}

function initProjectsCarousel() {
  const carousel = document.querySelector('[data-projects-carousel]');
  const track = document.querySelector('#projects-list');
  if (!carousel || !track) return;

  const previous = carousel.querySelector('[data-projects-prev]');
  const next = carousel.querySelector('[data-projects-next]');
  let position = 0;

  const visibleCards = () => window.matchMedia('(max-width: 820px)').matches ? 1 : window.matchMedia('(max-width: 1120px)').matches ? 2 : 3;

  const update = () => {
    const cards = track.children;
    const visible = visibleCards();
    const maximum = Math.max(0, cards.length - visible);
    position = Math.min(position, maximum);
    const firstCard = cards[0];
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
    const offset = firstCard ? position * (firstCard.getBoundingClientRect().width + gap) : 0;
    track.style.transform = `translateX(-${offset}px)`;
    previous.disabled = position === 0;
    next.disabled = position === maximum;
  };

  previous.addEventListener('click', () => { position -= 1; update(); });
  next.addEventListener('click', () => { position += 1; update(); });
  window.addEventListener('resize', update, { passive: true });
  update();
}

function renderDocuments(items) {
  const target = document.querySelector('#documents-list');
  if (!target) return;
  target.innerHTML = items.map(item => `
    <a class="doc-card" href="${item.href}" target="_blank" rel="noreferrer">
      <span class="doc-card-copy"><strong>${item.title}</strong><small>${item.description || 'Откройте документ в формате PDF'}</small></span>
      <span class="doc-card-type">${item.type}</span>
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
    <section class="detail-hero detail-service-hero">
      <div>
        <p class="hero-eyebrow">Услуга</p>
        <h1>${item.title}</h1>
        <p>${item.description}</p>
        <a class="btn" href="index.html#request">Получить расчет стоимости</a>
      </div>
    </section>
    <section class="detail-layout">
      <aside class="detail-aside detail-render">
        <img src="${item.iconImage || 'assets/img/service-pipelines-render.png'}" alt="3D-рендер: ${item.title}">
      </aside>
      <div class="detail-list">
        <section class="service-theses">
          <ul>${item.works.map(work => `<li>${work}</li>`).join('')}</ul>
        </section>
        <section class="service-explainer">
          <h3>Подробно об услуге</h3>
          ${(item.longDescription || [item.description]).map(text => `<p>${text}</p>`).join('')}
        </section>
        <section class="service-scope">
          <h3>Состав работ</h3>
          ${item.works.map((work, index) => `
          <section>
            <h3>${String(index + 1).padStart(2, '0')}. ${work}</h3>
            <p>${item.details?.[index] || 'Работы выполняются по проекту, с учетом требований объекта, нормативной документации и дальнейшей эксплуатации.'}</p>
          </section>
          `).join('')}
        </section>
        <section class="service-faq">
          <h3>Вопросы по услуге</h3>
          <details><summary>Для каких объектов подходит услуга?</summary><p>${item.audience || 'Для промышленных, коммерческих и инфраструктурных объектов, где требуется надежная инженерная система и понятная организация работ.'}</p></details>
          <details><summary>Как формируется состав работ?</summary><p>После изучения исходных данных, проекта, ограничений площадки и сроков заказчика.</p></details>
        </section>
      </div>
    </section>
    <section class="detail-cta">
      <p class="eyebrow">Обсудим задачу</p>
      <h2>Подготовим состав работ и расчет</h2>
      <a class="btn" href="index.html#request">Получить расчет стоимости</a>
    </section>
  `;
}

function renderProjectDetail(items) {
  const target = document.querySelector('[data-project-detail]');
  if (!target) return;
  const slug = getSlug();
  const item = items.find(project => project.id === slug) || items[0];
  const gallery = item.gallery?.length ? item.gallery : [item.image];
  document.title = `${item.title} - АРЕАЛ-ПРОМ`;
  target.innerHTML = `
    <section class="detail-hero detail-service-hero">
      <div>
        <p class="hero-eyebrow">Объект</p>
        <h1>${item.title}</h1>
        <p>${item.description}</p>
        <a class="btn" href="index.html#request">Обсудить похожий проект</a>
      </div>
    </section>
    <section class="detail-layout project-detail-layout">
      <aside class="detail-aside">
        <p class="eyebrow">Паспорт объекта</p>
        <h2>Проект и выполненные работы</h2>
        <section class="project-gallery" data-project-gallery data-images="${gallery.join('|')}">
          <div class="project-gallery-frame">
            <img src="${gallery[0]}" alt="Фотография объекта: ${item.title}" data-project-gallery-image>
          </div>
          <button class="project-gallery-arrow project-gallery-arrow-prev" type="button" data-project-gallery-prev aria-label="Предыдущая фотография">←</button>
          <button class="project-gallery-arrow project-gallery-arrow-next" type="button" data-project-gallery-next aria-label="Следующая фотография">→</button>
        </section>
      </aside>
      <div class="detail-list">
        <section><h3>Местоположение</h3><p>${item.location}</p></section>
        <section><h3>Тип объекта</h3><p>${item.type}</p></section>
        <section><h3>Срок / год</h3><p>${item.year || 'По согласованному графику'}</p></section>
        <section><h3>Выполненные работы</h3>${item.worksList ? `<ul class="project-work-list">${item.worksList.map(work => `<li>${work}</li>`).join('')}</ul>` : `<p>${item.works}</p>`}</section>
        <section><h3>Основные характеристики и задачи</h3><p>${item.tasks}</p></section>
        <section><h3>Результат</h3><p>${item.result}</p></section>
      </div>
    </section>
  `;
  initProjectGallery();
}

function initProjectGallery() {
  const gallery = document.querySelector('[data-project-gallery]');
  if (!gallery) return;

  const images = gallery.dataset.images.split('|').filter(Boolean);
  const image = gallery.querySelector('[data-project-gallery-image]');
  const previous = gallery.querySelector('[data-project-gallery-prev]');
  const next = gallery.querySelector('[data-project-gallery-next]');
  let position = 0;

  const update = () => {
    image.src = images[position];
    previous.disabled = position === 0;
    next.disabled = position === images.length - 1;
  };

  previous.addEventListener('click', () => { position -= 1; update(); });
  next.addEventListener('click', () => { position += 1; update(); });
  update();
}

function initMap() {
  const placeholder = document.querySelector('[data-map-placeholder]');
  if (!placeholder) return;

  const mountMap = () => {
    if (placeholder.dataset.loaded) return;
    placeholder.dataset.loaded = 'true';
    const map = document.createElement('div');
    map.className = 'map-frame';
    map.setAttribute('aria-label', 'Карта: офис АРЕАЛ-ПРОМ');
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A31c6beb00ab3d7ae9bb9c0b39de1e43b6eec7d78ed29c6a65e66e554174430de&width=100%25&height=640&lang=ru_RU&scroll=true';
    map.appendChild(script);
    placeholder.replaceWith(map);
  };

  if (!('IntersectionObserver' in window)) {
    mountMap();
    return;
  }

  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      mountMap();
      observer.disconnect();
    }
  }, { rootMargin: '240px 0px' });
  observer.observe(placeholder);
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
    initProjectsCarousel();
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
      `Компания: ${formData.get('company_name') || ''}`,
      `Комментарий: ${formData.get('message') || ''}`
    ].join('\n'));
    status.textContent = 'Заявка подготовлена. Откроется почтовая программа для отправки. Ответим в течение рабочего дня.';
    window.location.href = `mailto:info@areal-prom.ru?subject=${subject}&body=${body}`;
  });
}

initFooter();
initContent();
initMap();
