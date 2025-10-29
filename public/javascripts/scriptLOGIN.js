document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const loginInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');

    // Элементы для отображения ошибок
    const loginError = document.getElementById('loginError');
    const passwordError = document.getElementById('passwordError');

    // Проверка логина
    loginInput.addEventListener('input', function () {
        const login = loginInput.value.trim();
        if (login.length === 0) {
            loginError.style.display = 'block';
        } else {
            loginError.style.display = 'none';
        }
        updateLoginButton();
    });

    // Проверка пароля
    passwordInput.addEventListener('input', function () {
        const password = passwordInput.value;
        if (password.length === 0) {
            passwordError.style.display = 'block';
        } else {
            passwordError.style.display = 'none';
        }
        updateLoginButton();
    });

    // Обновление состояния кнопки входа
    function updateLoginButton() {
        const login = loginInput.value.trim();
        const password = passwordInput.value;

        const isLoginValid = login.length > 0;
        const isPasswordValid = password.length > 0;

        if (isLoginValid && isPasswordValid) {
            loginButton.disabled = false;
        } else {
            loginButton.disabled = true;
        }
    }

    // Обработка отправки формы
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Сбор данных формы
        const formData = {
            login: loginInput.value.trim(),
            password: passwordInput.value
        };

        // Отправка данных на сервер
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    // Редирект на главную страницу после успешного входа
                    window.location.href = '/index.html';
                } else {
                    alert('Ошибка: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Произошла ошибка при входе');
            });
    });

    // Загрузка темы из localStorage
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }

    // Инициализация
    loadTheme();
    updateLoginButton(); // Изначально кнопка должна быть отключена
});