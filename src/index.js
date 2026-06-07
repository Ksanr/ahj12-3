const API_BASE = process.env.API_BASE_URL || '';
const url = `${API_BASE}/api/news`;

require('./styles.css');

const newsListDiv = document.getElementById('newsList');
const errorMessageDiv = document.getElementById('errorMessage');

let currentData = null;
let isError = false;

// Функция отрисовки новостей
function renderNews(news) {
  if (!news || !Array.isArray(news)) {
    newsListDiv.innerHTML = '<div class="skeleton-item">Нет новостей</div>';
    return;
  }
  newsListDiv.innerHTML = news.map(item => `
    <div class="news-item">
      <div class="news-title">${escapeHtml(item.title)}</div>
      <div class="news-body">${escapeHtml(item.body)}</div>
    </div>
  `).join('');
}

// Защита от XSS
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// Загрузка новостей с API
async function loadNews() {
  try {
    const response = await fetch(url); //вместо локального ('/api/news');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    currentData = data;
    renderNews(data);
    isError = false;
    errorMessageDiv.classList.add('hidden');
  } catch (err) {
    console.error('Ошибка загрузки:', err);
    isError = true;
    errorMessageDiv.classList.remove('hidden');
    if (!currentData) {
      newsListDiv.innerHTML = '<div class="skeleton-item">Не удалось загрузить новости. Проверьте соединение.</div>';
    }
  }
}

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('SW зарегистрирован:', reg))
      .catch(err => console.log('SW регистрация не удалась:', err));
  });
}

// Запуск загрузки
loadNews();