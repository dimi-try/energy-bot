# Используем официальный образ Node.js (версия 22, легкая сборка)
FROM node:22-alpine

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код приложения
COPY . .

# Указываем порт, который будет открыт в контейнере
EXPOSE 2000

# Команда для запуска приложения
CMD ["node", "index.js"]