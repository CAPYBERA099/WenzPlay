# Деплой Wenz на VDS

Инструкция по развёртыванию форума **Wenz** (Next.js 16) на своём VDS-сервере.
Ниже два способа: **Docker** (проще и чище) и **вручную через PM2**.

Предполагается ОС **Ubuntu 22.04 / Debian 12**. Команды выполняются по SSH под root
или через `sudo`.

---

## 0. Загрузка кода на сервер

Сначала перенеси проект на сервер любым способом:

**Вариант А — через Git (рекомендуется):**
```bash
# на сервере
cd /opt
git clone <url-твоего-репозитория> wenz
cd wenz
```

**Вариант Б — скопировать ZIP с локального компьютера:**
```bash
# на локальной машине (распакованный проект в папке wenz)
scp -r ./wenz root@IP_СЕРВЕРА:/opt/wenz
```

---

## Способ 1. Docker (рекомендуется)

### 1.1 Установка Docker
```bash
curl -fsSL https://get.docker.com | sh
```

### 1.2 Сборка и запуск
```bash
cd /opt/wenz
docker compose up -d --build
```

Готово — приложение поднимется на `http://IP_СЕРВЕРА:3000`.

### 1.3 Полезные команды
```bash
docker compose logs -f       # смотреть логи
docker compose restart       # перезапустить
docker compose down          # остановить
docker compose up -d --build # пересобрать после обновления кода
```

---

## Способ 2. Вручную через PM2 (без Docker)

### 2.1 Установка Node.js 20 и pnpm
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
corepack enable
```

### 2.2 Установка зависимостей и сборка
```bash
cd /opt/wenz
pnpm install
pnpm build
```

### 2.3 Запуск через PM2
```bash
npm install -g pm2
pm2 start "pnpm start" --name wenz
pm2 save
pm2 startup        # выполни команду, которую выведет PM2, чтобы автозапуск работал после ребута
```

Приложение работает на `http://IP_СЕРВЕРА:3000`.

### 2.4 Полезные команды
```bash
pm2 logs wenz      # логи
pm2 restart wenz   # перезапуск
pm2 stop wenz      # остановка
```

---

## 3. Nginx как reverse proxy (домен + порт 80/443)

Чтобы сайт открывался по домену без `:3000`:

```bash
apt-get install -y nginx
# скопируй конфиг из репозитория
cp /opt/wenz/deploy/nginx.conf /etc/nginx/sites-available/wenz
# ОБЯЗАТЕЛЬНО замени server_name на свой домен/IP в этом файле
nano /etc/nginx/sites-available/wenz

ln -s /etc/nginx/sites-available/wenz /etc/nginx/sites-enabled/wenz
rm -f /etc/nginx/sites-enabled/default
nginx -t           # проверка конфига
systemctl reload nginx
```

Теперь сайт доступен по `http://твой-домен`.

---

## 4. HTTPS через Let's Encrypt (бесплатный SSL)

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d твой-домен -d www.твой-домен
```

Certbot сам выпустит сертификат и пропишет HTTPS в конфиг Nginx.
Автопродление уже настроено через systemd-таймер.

---

## 5. Firewall (опционально, но желательно)

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## 6. Обновление сайта

**Docker:**
```bash
cd /opt/wenz
git pull            # или загрузи новый код
docker compose up -d --build
```

**PM2:**
```bash
cd /opt/wenz
git pull
pnpm install
pnpm build
pm2 restart wenz
```

---

## Чек-лист

- [ ] Код загружен в `/opt/wenz`
- [ ] Приложение запущено (Docker или PM2) и отвечает на `:3000`
- [ ] Nginx проксирует домен на `127.0.0.1:3000`
- [ ] Выпущен SSL-сертификат (HTTPS работает)
- [ ] Настроен firewall
- [ ] Проверено автопродление сертификата и автозапуск после перезагрузки
