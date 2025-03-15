# Используем официальный Node.js образ
FROM node:22

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json в контейнер
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта в контейнер
COPY . .

# Открываем порт (если нужно для веб-сервера)
EXPOSE 3000

# Запускаем бота
CMD ["node", "index.js"]
