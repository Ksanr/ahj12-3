# Buggy Service – Новости с кэшированием через Service Worker

[![Build and Deploy to GitHub Pages](https://github.com/ksanr/ahj12-3/actions/workflows/deploy.yml/badge.svg)](https://github.com/ksanr/ahj12-3/actions/workflows/deploy.yml)

[Ссылка на готовое приложение](https://ksanr.github.io/ahj12-3/)

## Описание

Сервер случайно возвращает ошибку 500 (вероятность 30%). Service Worker кэширует успешные ответы и при ошибке отдаёт кэшированные новости. Интерфейс показывает предупреждение при использовании кэша.

## Локальный запуск

```bash
npm install
npm run build   # собрать клиент
node server.js  # запустить сервер на порту 3000
npm start       # в другом терминале запустить клиент на порту 8080