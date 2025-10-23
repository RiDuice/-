document.addEventListener('DOMContentLoaded', function () {
    // Код для левой панели серверов
    const serversList = document.getElementById('serversList');
    const serversContainer = document.getElementById('serversContainer');
    const homeServer = document.getElementById('homeServer');
    const addServer = document.getElementById('addServer');
    const serverImageInput = document.getElementById('serverImageInput');

    // Массив для хранения серверов
    let servers = [
        { id: 1, name: "Gaming", image: null, fallback: "G" },
        { id: 2, name: "Devs", image: null, fallback: "D" },
        { id: 3, name: "Music", image: null, fallback: "M" }
    ];

    // Функция для отображения серверов
    function displayServers() {
        serversContainer.innerHTML = '';

        servers.forEach(server => {
            const serverElement = document.createElement('div');
            serverElement.className = 'server-item';
            serverElement.setAttribute('data-server', server.id);
            serverElement.title = server.name;

            serverElement.innerHTML = `
                <div class="server-icon">
                    ${server.image ?
                    `<img src="${server.image}" alt="${server.name}" class="server-image">` :
                    ''
                }
                    <div class="server-fallback">${server.fallback}</div>
                </div>
                <div class="server-notification"></div>
            `;

            serversContainer.appendChild(serverElement);
        });
    }

    // Функция для загрузки изображения сервера
    function handleServerImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Проверяем тип файла
        if (!file.type.startsWith('image/')) {
            alert('Пожалуйста, выберите изображение');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const newServer = {
                id: servers.length + 1,
                name: `Сервер ${servers.length + 1}`,
                image: e.target.result,
                fallback: String.fromCharCode(65 + servers.length) // A, B, C...
            };

            servers.push(newServer);
            displayServers();

            // Сбрасываем input
            serverImageInput.value = '';
        };

        reader.readAsDataURL(file);
    }

    // Обработчики событий для серверов
    addServer.addEventListener('click', function () {
        serverImageInput.click();
    });

    serverImageInput.addEventListener('change', handleServerImageUpload);

    // Обработчики для выбора сервера
    document.addEventListener('click', function (e) {
        const serverItem = e.target.closest('.server-item');
        if (serverItem && !serverItem.classList.contains('add-server') && !serverItem.classList.contains('home-server')) {
            // Убираем активный класс у всех серверов
            document.querySelectorAll('.server-item').forEach(item => {
                item.classList.remove('active');
            });

            // Добавляем активный класс к выбранному серверу
            serverItem.classList.add('active');

            console.log('Выбран сервер:', serverItem.getAttribute('data-server'));
        }
    });

    // Инициализация серверов при загрузке
    displayServers();

    // Оригинальный код мессенджера
    const chatItems = document.querySelectorAll('.chat-item');
    const messagesContainer = document.getElementById('messagesContainer');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const chatHeader = document.querySelector('.chat-header h3');
    const chatHeaderInfo = document.querySelector('.chat-header-info p');
    const chatHeaderAvatar = document.querySelector('.chat-header-avatar');
    const backButton = document.getElementById('backButton');
    const themeToggle = document.getElementById('themeToggle');
    const settingsButton = document.getElementById('settingsButton');

    // Объект для хранения сообщений каждого чата
    const chatMessages = {
        '1': [], // Какой то тип 1
        '2': [], // Какой то тип 2
        '3': []  // Какой то тип 3
    };

    let currentChatId = null; // Текущий активный чат (изначально null)

    // Загрузка темы из localStorage
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }

    // Переключение темы
    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // Функция для отображения сообщений текущего чата
    function displayMessages() {
        messagesContainer.innerHTML = '';

        if (currentChatId && chatMessages[currentChatId].length > 0) {
            chatMessages[currentChatId].forEach(msg => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message', msg.type);
                messageElement.innerHTML = `
                    ${msg.text}
                    <div class="message-time">${msg.time}</div>
                `;
                messagesContainer.appendChild(messageElement);
            });
        } else if (currentChatId) {
            // Чат выбран, но сообщений нет
            messagesContainer.innerHTML = `
                <div class="welcome-message">
                    <h3>Начните общение</h3>
                    <p>Это начало вашего диалога с этим пользователем</p>
                </div>
            `;
        } else {
            // Чат не выбран
            messagesContainer.innerHTML = `
                <div class="welcome-message">
                    <h3>Добро пожаловать!</h3>
                    <p>Выберите чат из списка слева чтобы начать общение</p>
                </div>
            `;
        }

        // Прокручиваем к последнему сообщению
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Активация/деактивация поля ввода
    function toggleInput(active) {
        messageInput.disabled = !active;
        sendButton.disabled = !active;
        if (active) {
            messageInput.placeholder = "Сообщение";
        } else {
            messageInput.placeholder = "Выберите чат для общения";
        }
    }

    // Функция для открытия чата
    function openChat(chatId) {
        // Показываем аватарку
        chatHeaderAvatar.style.display = 'flex';

        // Обновляем информацию в заголовке чата
        const chatItem = document.querySelector(`[data-chat="${chatId}"]`);
        const chatName = chatItem.querySelector('.chat-name').textContent;
        const chatAvatar = chatItem.querySelector('.avatar-fallback').textContent;

        chatHeader.textContent = chatName;
        chatHeaderInfo.textContent = "в сети";
        chatHeaderAvatar.querySelector('.avatar-fallback').textContent = chatAvatar;

        // Очищаем поле ввода
        messageInput.value = '';

        // Активируем поле ввода
        toggleInput(true);

        // Отображаем сообщения для выбранного чата
        displayMessages();

        // Для мобильных устройств переключаем видимость
        if (window.innerWidth <= 768) {
            document.getElementById('chatsList').classList.remove('active');
            document.getElementById('chatArea').classList.add('active');
        }
    }

    // Функция для возврата к списку чатов
    function backToChats() {
        // Скрываем аватарку
        chatHeaderAvatar.style.display = 'none';

        // Восстанавливаем заголовок по умолчанию
        chatHeader.textContent = "Выберите чат";
        chatHeaderInfo.textContent = "Начните общение";

        // Сбрасываем текущий ID чата
        currentChatId = null;

        // Деактивируем поле ввода
        toggleInput(false);

        // Обновляем отображение сообщений
        displayMessages();

        // Убираем активный класс у всех чатов
        chatItems.forEach(chat => chat.classList.remove('active'));

        // Показываем список чатов на мобильных
        if (window.innerWidth <= 768) {
            document.getElementById('chatsList').classList.add('active');
            document.getElementById('chatArea').classList.remove('active');
        }
    }

    // Обработчики для выбора чата
    chatItems.forEach(item => {
        item.addEventListener('click', function () {
            // Убираем активный класс у всех чатов
            chatItems.forEach(chat => chat.classList.remove('active'));

            // Добавляем активный класс к выбранному чату
            this.classList.add('active');

            // Обновляем текущий ID чата
            currentChatId = this.getAttribute('data-chat');

            // Открываем чат
            openChat(currentChatId);
        });
    });

    // Обработчик отправки сообщения
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message === '' || !currentChatId) return;

        const time = new Date();
        const timeString = `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;

        // Сохраняем сообщение только для текущего чата
        chatMessages[currentChatId].push({
            text: message,
            time: timeString,
            type: 'sent'
        });

        // Очищаем поле ввода
        messageInput.value = '';

        // Сбрасываем высоту текстового поля
        messageInput.style.height = 'auto';

        // Обновляем отображение сообщений
        displayMessages();
    }

    // Обработчик кнопки "Назад"
    backButton.addEventListener('click', backToChats);

    // Обработчики событий для отправки сообщения
    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey && currentChatId) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Автоматическое изменение высоты текстового поля
    messageInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Обработчики для кнопок темы и настроек
    themeToggle.addEventListener('click', toggleTheme);

    // settingsButton пока не имеет функционала
    settingsButton.addEventListener('click', function () {
        console.log('Кнопка настроек нажата');
        // Здесь можно добавить функционал настроек в будущем
    });

    // Инициализация
    loadTheme();
    displayMessages();
    toggleInput(false); // Изначально поле ввода отключено
});