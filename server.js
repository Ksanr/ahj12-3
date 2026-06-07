const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: 'https://ksanr.github.io',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Генерация случайной ошибки (вероятность 0.3)
const buggyMiddleware = (req, res, next) => {
  const shouldFail = Math.random() < 0.3; // 30% ошибок
  if (shouldFail) {
    res.status(500).json({ error: 'Случайная ошибка сервера' });
  } else {
    next();
  }
};

// Данные новостей
const mockNews = [
  { id: 1, title: 'Новость 1', body: 'Содержимое первой новости. Сервер иногда выдаёт ошибку 500.' },
  { id: 2, title: 'Новость 2', body: 'Service Worker кэширует успешные ответы и при ошибке отдаёт кэш.' },
  { id: 3, title: 'Новость 3', body: 'Проверьте работу при обновлении страницы во время ошибки сервера.' },
  { id: 4, title: 'Новость 4', body: 'Кэш живёт даже после перезагрузки браузера.' },
  { id: 5, title: 'Новость 5', body: 'Интерфейс показывает предупреждение, если данные из кэша не удалось получить.' }
];

app.get('/api/news', buggyMiddleware, (req, res) => {
  res.json(mockNews);
});

// Раздача статики
app.use(express.static(path.join(__dirname, 'dist')));

// Все остальные маршруты – index.html
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

module.exports = app;