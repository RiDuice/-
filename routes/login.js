var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login/index');
});

router.get('/reg', function(req, res, next) {
  res.render('login/register');
});

// POST /login — серверная валидация логина
router.post('/login', function(req, res, next) {
  const { login, password } = req.body;

  // Валидация логина (как в scriptLogin.js)
  if (!login || login.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Логин обязателен' });
  }

  // Валидация пароля (как в scriptLogin.js)
  if (!password || password.length === 0) {
    return res.status(400).json({ success: false, message: 'Пароль обязателен' });
  }

  // Здесь добавить аутентификацию пользователя (например, проверка в базе)

  // Для примера - успешный вход
  return res.json({ success: true, message: 'Вход выполнен успешно!' });
});

// POST /register — серверная валидация регистрации
router.post('/register', function(req, res, next) {
  const { username, phone, password, confirmPassword, terms } = req.body;

  // Валидация имени пользователя (как в scriptReg.js)
  if (!username || username.trim().length < 3 || username.trim().length > 20) {
    return res.status(400).json({ success: false, message: 'Имя пользователя должно быть от 3 до 20 символов' });
  }

  // Валидация телефона (как в scriptReg.js)
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  if (!phone || !phoneRegex.test(phone.trim())) {
    return res.status(400).json({ success: false, message: 'Некорректный номер телефона' });
  }

  // Проверка пароля (как в scriptReg.js)
  if (!password || password.length < 8) {
    return res.status(400).json({ success: false, message: 'Пароль должен быть не менее 8 символов' });
  }

  // Проверка подтверждения пароля (как в scriptReg.js)
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Пароли не совпадают' });
  }

  // Проверка согласия с условиями (как в scriptReg.js)
  if (terms !== true && terms !== 'true' && terms !== 'on') {
    return res.status(400).json({ success: false, message: 'Вы должны согласиться с условиями' });
  }

  // Дополнительная проверка сложности пароля (как в scriptReg.js)
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  // Опционально: можно добавить проверку на минимальную сложность
  if (strength < 2) {
    return res.status(400).json({ success: false, message: 'Пароль слишком слабый' });
  }

  // Здесь добавить логику создания нового пользователя в базе

  // Для примера - успешная регистрация
  return res.json({ success: true, message: 'Регистрация успешно завершена!' });
});

module.exports = router;