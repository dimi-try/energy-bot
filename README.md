# 🤖 Telegram-бот "Топ энергетиков"

Добро пожаловать в **"Топ энергетиков"** — Telegram-бот, созданный для взаимодействия с пользователями и интеграции с **frontend-приложением**. Бот позволяет запускать **Telegram Mini App**, в котором пользователи могут оставлять отзывы, выставлять оценки и анализировать статистику популярных напитков. 🚀

## 🛠 Используемые технологии

[![Technologies](https://skillicons.dev/icons?i=nodejs,express,js)](https://skillicons.dev)

## 📂 Структура проекта

```sh
energy-bot/
│
├── .github/
│   └── workflows/
│       └── docker-deploy.yml   # CI/CD: деплой Docker-контейнера
│
├── src/
│   └── index.js                # Основной файл бота
│
├── .dockerignore               # Исключения для сборки контейнера
├── .env.sample                 # Пример файла с переменными окружения
├── .gitignore                  # Игнорируемые файлы
├── docker-compose.yml          # Конфигурация Docker
├── Dockerfile                  # Docker-сборка
├── package.json                # Зависимости и скрипты
└── README.md                   # Документация проекта
```

---

## 🔧 Установка проекта  

### 📋 Настройка .env
Скопируйте `.env.sample`, переименуйте в `.env` и добавьте свои данные.

Укажите свои значения переменных в `.env`.  

### 📥 Установка зависимостей  
```sh
npm install
```

## 🌐 Тестирование Telegram Mini App локально

Для разработки и тестирования mini app на локальном сервере необходим HTTPS. Используйте туннелирование для **порта, на котором запущен frontend**:

#### 1️⃣ Установка Tunnelmole

```sh
npm install -g tunnelmole
```

#### 2️⃣ Запуск туннеля (например, для порта 3000):

```sh
tmole 3000
```

Скопируйте выданный HTTPS-URL и установите его в `FRONTEND_URL` в `.env`.

> ⚠️ Убедитесь, что ваш фронтенд запущен. Инструкция: [репозиторий frontend](https://github.com/dimi-try/energy-frontend)

---

## 🚀 Запуск проекта

Перед запуском проверьте переменную `NODE_ENV` в `.env`. Она принимает два значения: `development` или `production`. 

С установленным значением `development` после запуска бот будет работать в режиме **Long Polling**. 

```sh
npm start
```

Приложение будет доступно по адресу:  
📍 `http://localhost:2000`

> ⚠️ Значение `production` устанавливается непосредственно при деплое или на сервере в `.env`. Бот будет слушать входящие запросы через **Webhook**
---

## 🌍 Деплой

Доступны два способа:

### Вариант 1: Docker Compose вручную

1.  Проверьте `.env` и `docker-compose.yml`
    
2.  Выполните сборку и пуш:
    
```sh
docker compose build
```
```sh
docker compose up -d
```
```sh
docker push <your-dockerhub>
```

### Вариант 2: Автоматически через GitHub Actions

1.  В файле `.github/workflows/docker-deploy.yml` уже всё готово
    
2.  При пуше в `main` ветку произойдёт автоматическая сборка и публикация образа в DockerHub
    
На прод-сервере можете использовать `docker-compose-server.yml` из [репозитория backend](https://github.com/dimi-try/energy-backend). Скопируйте `.env.example`, переименуйте в `.env` и добавьте свои данные.

---

## 🔧 Полезные команды  

##### 📌 Установка зависимостей  
```sh
npm install
```
##### 🚀 Запуск в продакшене  
```sh
npm run start
```
##### 🛠 Линтинг кода  
```sh
npm run lint
```
##### 🧹 Очистка кэша  
```sh
npm cache clean --force
```
##### 🗑 Очистка node_modules  
```sh
Get-ChildItem -Path . -Recurse -Directory -Filter "node_modules" | Remove-Item -Recurse -Force #windows
```
---

## 💡 Обратная связь  

Если у вас есть предложения или вопросы, создавайте **issue** в репозитории! 🚀

