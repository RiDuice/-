// scriptReg.js

// Стили с исходными цветами и без масштабирования
const styles = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    body {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: #412861;
        background: linear-gradient(165deg, rgba(65, 40, 97, 1) 0%, rgba(1, 1, 23, 1) 100%);
        padding: 20px;
    }

    .register-container {
        background: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
    }

    .register-header {
        text-align: center;
        margin-bottom: 25px;
    }

    .register-header h1 {
        color: #333;
        font-size: 24px;
        margin-bottom: 8px;
        font-weight: 600;
    }

    .register-header p {
        color: #666;
        font-size: 14px;
    }

    .form-group {
        margin-bottom: 15px;
    }

    .form-group label {
        display: block;
        margin-bottom: 6px;
        color: #333;
        font-weight: 500;
        font-size: 14px;
    }

    .form-input {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        transition: border-color 0.2s;
        background: #fafafa;
    }

    .form-input:focus {
        outline: none;
        border-color: #007bff;
        background: white;
    }

    .error-message {
        color: #dc3545;
        font-size: 12px;
        margin-top: 4px;
        display: none;
    }

    .pass-strength {
        margin-top: 5px;
        font-size: 11px;
        padding: 3px 8px;
        border-radius: 3px;
        display: inline-block;
    }

    .pass-strength.weak {
        background-color: #ffebee;
        color: #c62828;
        border: 1px solid #ffcdd2;
    }

    .pass-strength.medium {
        background-color: #fff3e0;
        color: #ef6c00;
        border: 1px solid #ffe0b2;
    }

    .pass-strength.strong {
        background-color: #e8f5e8;
        color: #2e7d32;
        border: 1px solid #c8e6c9;
    }

    .terms-group {
        margin: 20px 0;
        display: flex;
        align-items: flex-start;
        gap: 8px;
    }

    .terms-checkbox {
        width: 16px;
        height: 16px;
        margin-top: 2px;
    }

    .terms-text {
        font-size: 13px;
        color: #555;
        line-height: 1.4;
        flex: 1;
    }

    .terms-text a {
        color: #007bff;
        text-decoration: none;
    }

    .terms-text a:hover {
        text-decoration: underline;
    }

    .register-button {
        width: 100%;
        padding: 12px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .register-button:hover:not(:disabled) {
        background: #0056b3;
    }

    .register-button:disabled {
        background: #6c757d;
        cursor: not-allowed;
        opacity: 0.6;
    }

    .login-link {
        text-align: center;
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid #eee;
        color: #666;
        font-size: 14px;
    }

    .login-link a {
        color: #007bff;
        text-decoration: none;
        font-weight: 500;
    }

    .login-link a:hover {
        text-decoration: underline;
    }

    /* Темная тема */
    .dark-theme {
        background: #1a1a1a;
    }

    .dark-theme .register-container {
        background: #2d2d2d;
        color: #e0e0e0;
    }

    .dark-theme .register-header h1 {
        color: #ffffff;
    }

    .dark-theme .register-header p {
        color: #b0b0b0;
    }

    .dark-theme .form-group label {
        color: #e0e0e0;
    }

    .dark-theme .form-input {
        background: #3d3d3d;
        border-color: #555;
        color: #e0e0e0;
    }

    .dark-theme .form-input:focus {
        border-color: #007bff;
        background: #4a4a4a;
    }

    .dark-theme .terms-text {
        color: #b0b0b0;
    }

    .dark-theme .login-link {
        border-color: #555;
        color: #b0b0b0;
    }
`;

// Добавляем стили в документ
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

document.addEventListener('DOMContentLoaded', function () {
    console.log('🔧 ScriptREG.js загружен');
    
    const registerForm = document.getElementById('registerForm');
    
    if (!registerForm) {
        console.error('❌ Форма регистрации не найдена!');
        return;
    }

    const usernameInput = document.getElementById('username');
    const phoneInput = document.getElementById('phone');
    const passInput = document.getElementById('pass');
    const confirmPassInput = document.getElementById('confirmPass');
    const termsCheckbox = document.getElementById('terms');
    const registerButton = document.getElementById('registerButton');

    // Создаем индикатор сложности пароля если его нет
    let passStrength = document.getElementById('passStrength');
    if (!passStrength) {
        passStrength = document.createElement('div');
        passStrength.id = 'passStrength';
        passInput.parentNode.insertBefore(passStrength, passInput.nextSibling);
    }

    // Элементы для отображения ошибок
    const usernameError = document.getElementById('usernameError');
    const phoneError = document.getElementById('phoneError');
    const passError = document.getElementById('passError');
    const confirmPassError = document.getElementById('confirmPassError');

    // Функция для показа/скрытия ошибок
    function toggleError(element, show) {
        if (element) {
            element.style.display = show ? 'block' : 'none';
        }
    }

    // Функция для обновления индикатора сложности пароля
    function updatePassStrength(pass) {
        if (!passStrength) return;
        
        let strength = 0;
        let strengthText = '';
        let strengthClass = '';
        
        if (pass.length >= 8) strength++;
        if (/[a-z]/.test(pass)) strength++;
        if (/[A-Z]/.test(pass)) strength++;
        if (/[0-9]/.test(pass)) strength++;
        if (/[^a-zA-Z0-9]/.test(pass)) strength++;

        if (pass.length === 0) {
            strengthText = '';
            strengthClass = '';
        } else if (strength <= 2) {
            strengthText = 'Слабый';
            strengthClass = 'weak';
        } else if (strength <= 3) {
            strengthText = 'Средний';
            strengthClass = 'medium';
        } else {
            strengthText = 'Сильный';
            strengthClass = 'strong';
        }

        passStrength.textContent = strengthText;
        passStrength.className = 'pass-strength ' + strengthClass;
    }

    // Проверка имени пользователя
    usernameInput.addEventListener('input', function () {
        const username = usernameInput.value.trim();
        toggleError(usernameError, username.length < 3 || username.length > 20);
        updateRegisterButton();
    });

    // Проверка номера телефона
    phoneInput.addEventListener('input', function () {
        const phone = phoneInput.value.trim();
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        toggleError(phoneError, !phoneRegex.test(phone));
        updateRegisterButton();
    });

    // Проверка пароля
    passInput.addEventListener('input', function () {
        const pass = passInput.value;
        toggleError(passError, pass.length < 8);
        updatePassStrength(pass);
        updateRegisterButton();
    });

    // Проверка подтверждения пароля
    confirmPassInput.addEventListener('input', function () {
        const pass = passInput.value;
        const confirmPass = confirmPassInput.value;
        toggleError(confirmPassError, pass !== confirmPass);
        updateRegisterButton();
    });

    // Обновление состояния кнопки регистрации
    function updateRegisterButton() {
        const username = usernameInput.value.trim();
        const phone = phoneInput.value.trim();
        const pass = passInput.value;
        const confirmPass = confirmPassInput.value;
        const termsChecked = termsCheckbox.checked;

        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;

        const isUsernameValid = username.length >= 3 && username.length <= 20;
        const isPhoneValid = phoneRegex.test(phone);
        const isPassValid = pass.length >= 8;
        const isConfirmPassValid = pass === confirmPass;

        const isValid = isUsernameValid && isPhoneValid && isPassValid && isConfirmPassValid && termsChecked;
        
        if (registerButton) {
            registerButton.disabled = !isValid;
        }
    }

    // Обработка чекбокса условий
    termsCheckbox.addEventListener('change', updateRegisterButton);

    // Обработка отправки формы
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('🔄 Отправка формы...');

        // Показываем loading state
        if (registerButton) {
            registerButton.disabled = true;
            registerButton.textContent = 'Регистрация...';
        }

        const data = {
            username: usernameInput.value.trim(),
            phone: phoneInput.value.trim(),
            pass: passInput.value,
            confirmPass: confirmPassInput.value,
            terms: termsCheckbox.checked
        };

        console.log('📤 Отправка данных:', { ...data, pass: '***', confirmPass: '***' });

        // Используем абсолютный URL для надежности
        fetch('/login/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            console.log('📥 Ответ сервера, статус:', response.status);
            return response.json().then(data => ({
                status: response.status,
                data: data
            }));
        })
        .then(({ status, data }) => {
            console.log('✅ Результат:', data);
            if (status === 200 && data.success) {
                alert('🎉 Регистрация успешна!');
                window.location.href = '/login';
            } else {
                alert('❌ Ошибка: ' + (data.message || 'Неизвестная ошибка'));
            }
        })
        .catch(error => {
            console.error('❌ Ошибка запроса:', error);
            alert('💥 Ошибка при регистрации: ' + error.message);
        })
        .finally(() => {
            // Восстанавливаем кнопку
            if (registerButton) {
                registerButton.disabled = false;
                registerButton.textContent = 'Зарегистрироваться';
                updateRegisterButton();
            }
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
    updateRegisterButton();
    console.log('✅ ScriptREG.js инициализирован');
});