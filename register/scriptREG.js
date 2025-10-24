document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    const registerButton = document.getElementById('registerButton');
    const passwordStrength = document.getElementById('passwordStrength');

    // Элементы для отображения ошибок
    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    // Проверка имени пользователя
    usernameInput.addEventListener('input', function () {
        const username = usernameInput.value.trim();
        if (username.length < 3 || username.length > 20) {
            usernameError.style.display = 'block';
        } else {
            usernameError.style.display = 'none';
        }
        updateRegisterButton();
    });

    // Проверка email
    emailInput.addEventListener('input', function () {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            emailError.style.display = 'block';
        } else {
            emailError.style.display = 'none';
        }
        updateRegisterButton();
    });

    // Проверка пароля
    passwordInput.addEventListener('input', function () {
        const password = passwordInput.value;

        // Проверка длины пароля
        if (password.length < 8) {
            passwordError.style.display = 'block';
        } else {
            passwordError.style.display = 'none';
        }

        // Оценка сложности пароля
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        // Обновление индикатора сложности пароля
        passwordStrength.className = 'password-strength';
        if (strength <= 2) {
            passwordStrength.classList.add('weak');
        } else if (strength <= 4) {
            passwordStrength.classList.add('medium');
        } else {
            passwordStrength.classList.add('strong');
        }

        updateRegisterButton();
    });

    // Проверка подтверждения пароля
    confirmPasswordInput.addEventListener('input', function () {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            confirmPasswordError.style.display = 'block';
        } else {
            confirmPasswordError.style.display = 'none';
        }
        updateRegisterButton();
    });

    // Обновление состояния кнопки регистрации
    function updateRegisterButton() {
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const termsChecked = termsCheckbox.checked;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const isUsernameValid = username.length >= 3 && username.length <= 20;
        const isEmailValid = emailRegex.test(email);
        const isPasswordValid = password.length >= 8;
        const isConfirmPasswordValid = password === confirmPassword;

        if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && termsChecked) {
            registerButton.disabled = false;
        } else {
            registerButton.disabled = true;
        }
    }

    // Обработка чекбокса условий
    termsCheckbox.addEventListener('change', updateRegisterButton);

    // Обработка отправки формы
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Здесь обычно отправка данных на сервер
        alert('Регистрация успешно завершена!');
        // В реальном приложении здесь был бы redirect на страницу входа или мессенджера
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
    updateRegisterButton(); // Изначально кнопка должна быть отключена
});