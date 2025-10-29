document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    const registerButton = document.getElementById('registerButton');
    const passwordStrength = document.getElementById('passwordStrength');

    // Элементы для отображения ошибок
    const usernameError = document.getElementById('usernameError');
    const phoneError = document.getElementById('phoneError');
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

    // Проверка номера телефона
    phoneInput.addEventListener('input', function () {
        const phone = phoneInput.value.trim();
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(phone)) {
            phoneError.style.display = 'block';
        } else {
            phoneError.style.display = 'none';
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
        const phone = phoneInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const termsChecked = termsCheckbox.checked;

        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;

        const isUsernameValid = username.length >= 3 && username.length <= 20;
        const isPhoneValid = phoneRegex.test(phone);
        const isPasswordValid = password.length >= 8;
        const isConfirmPasswordValid = password === confirmPassword;

        if (isUsernameValid && isPhoneValid && isPasswordValid && isConfirmPasswordValid && termsChecked) {
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

        // Сбор данных формы
        const formData = {
            username: usernameInput.value.trim(),
            phone: phoneInput.value.trim(),
            password: passwordInput.value,
            confirmPassword: confirmPasswordInput.value,
            terms: termsCheckbox.checked
        };

        // Отправка данных на сервер
        fetch('/register', {
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
                    // Редирект на страницу входа после успешной регистрации
                    window.location.href = '/';
                } else {
                    alert('Ошибка: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Произошла ошибка при регистрации');
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
    updateRegisterButton(); // Изначально кнопка должна быть отключена
});