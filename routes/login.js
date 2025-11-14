const express = require('express');
const mysql = require('mysql2');
const router = express.Router();

// Создаём соединение с базой данных
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_db_user',
    password: 'your_db_password',
    database: 'your_db_name'
});

// Главная страница логина
router.get('/', (req, res) => {
    res.render('login/index');
});

// Страница регистрации
router.get('/reg', (req, res) => {
    res.render('login/register');
});

// POST /login
router.post('/login', (req, res) => {
    const { login, password } = req.body;
    if (!login || login.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Логин обязателен' });
    }
    if (!password || password.length === 0) {
        return res.status(400).json({ success: false, message: 'Пароль обязателен' });
    }
    // Пример поиска пользователя (реализуйте хеширование паролей для безопасности)
    db.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [login, password],
        (err, results) => {
            if (err) return res.status(500).json({ success: false, message: 'Ошибка базы данных' });
            if (!results.length) {
                return res.status(401).json({ success: false, message: 'Неверные данные' });
            }
            return res.json({ success: true, message: 'Вход выполнен успешно!' });
        }
    );
});

// POST /register
router.post('/register', (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (!username || username.trim().length < 3 || username.trim().length > 20) {
        return res.status(400).json({ success: false, message: 'Имя пользователя должно быть от 3 до 20 символов' });
    }
    if (!password || password.length < 8) {
        return res.status(400).json({ success: false, message: 'Пароль должен быть не менее 8 символов' });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Пароли не совпадают' });
    }

    // Опциональная проверка сложности пароля (можно оставить простую)
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    if (strength < 2) {
        return res.status(400).json({ success: false, message: 'Пароль слишком слабый' });
    }

    // Добавление пользователя в базу
    db.query(
        'INSERT INTO users (username, password, created_at) VALUES (?, ?, NOW())',
        [username, password],
        (err, result) => {
            if (err) {
                console.error('Ошибка SQL:', err); // Выведет ошибку в консоль сервера
                return res.status(500).json({ success: false, message: 'Ошибка базы данных', error: err });
            }
            return res.json({ success: true, message: 'Регистрация завершена!' });
        }
    );


});

module.exports = router;
