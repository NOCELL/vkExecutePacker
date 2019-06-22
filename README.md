# VK Execute Packer

Упаковщик запросов к VK API с использованием https://vk.com/dev/execute

## Использование

Вы как обычно делаете запросы, но на другой домен

```
https://api.vk.com
```
нужно заменить на  

```
http://localhost:{порт, по умолчанию 4300}
```

Для настройки порта используется переменная окружения "PORT"


## Деплой

### Небходимо

* Node.js 8+
* npm

#### Установка Node 12 и npm для Ubuntu
```sh
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Установка

```sh
git clone https://github.com/NOCELL/vkExecutePacker
cd vkExecutePacker
npm i
sudo npm i -g pm2
pm2 start index.js -name vk_execute
```

### Автозапуск при перезагрузке

```sh
pm2 startup
pm2 save
```