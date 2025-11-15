var express = require('express');
var router = express.Router();
const mysql = require('mysql2/promise');

// Создание подключения к базе данных
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'clientchat',
  charset: 'utf8mb4'
};

// Функция для подключения к БД
async function getConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Подключение к БД установлено');
    return connection;
  } catch (error) {
    console.error('❌ Ошибка подключения к БД:', error.message);
    
    // Если база не существует, создаем ее
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('🔄 Попытка создать базу данных...');
      try {
        const tempConnection = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: ''
        });
        
        await tempConnection.execute('CREATE DATABASE IF NOT EXISTS clientchat');
        await tempConnection.execute('USE clientchat');
        await tempConnection.execute(`
          CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            phone VARCHAR(20) NOT NULL UNIQUE,
            pass VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        console.log('✅ База данных и таблица созданы');
        await tempConnection.end();
        
        // Пробуем подключиться снова
        return await mysql.createConnection(dbConfig);
      } catch (createError) {
        console.error('❌ Ошибка создания БД:', createError.message);
        throw createError;
      }
    }
    
    throw error;
  }
}

// Функция добавления пользователя в БД
async function addUserToDatabase(username, phone, pass) {
  const connection = await getConnection();
  try {
    console.log('🔄 Попытка добавить пользователя:', username);
    
    // Гарантируем существование таблицы
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL UNIQUE,
        pass VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    const [result] = await connection.execute(
      'INSERT INTO users (username, phone, pass) VALUES (?, ?, ?)',
      [username, phone, pass]
    );
    
    console.log('✅ Пользователь добавлен, ID:', result.insertId);
    
    // Проверяем, что данные действительно сохранились
    const [savedUsers] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    console.log('✅ Проверка сохраненных данных:', savedUsers.length > 0 ? 'ДАННЫЕ СОХРАНЕНЫ' : 'ДАННЫЕ НЕ СОХРАНЕНЫ');
    
    return result.affectedRows === 1;
  } catch (error) {
    console.error('❌ Ошибка БД:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      if (error.message.includes('username')) {
        throw new Error('Пользователь с таким именем уже существует');
      }
      if (error.message.includes('phone')) {
        throw new Error('Пользователь с таким телефоном уже существует');
      }
    }
    
    throw new Error('Ошибка при создании пользователя: ' + error.message);
  } finally {
    await connection.end();
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login/index');
});

router.get('/reg', function(req, res, next) {
  res.render('login/register');
});

// Тестовый маршрут для проверки работы сервера
router.get('/test', function(req, res, next) {
  res.json({ success: true, message: 'Сервер работает!' });
});

// Тестовый маршрут для проверки БД
router.get('/test-db', async function(req, res, next) {
  try {
    const connection = await getConnection();
    
    // Проверяем существование таблицы
    const [tables] = await connection.execute('SHOW TABLES LIKE "users"');
    const tableExists = tables.length > 0;
    
    // Если таблица существует, получаем количество записей
    let userCount = 0;
    let users = [];
    if (tableExists) {
      const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
      userCount = rows[0].count;
      const [userRows] = await connection.execute('SELECT id, username, phone, created_at FROM users LIMIT 10');
      users = userRows;
    }
    
    await connection.end();
    
    res.json({
      success: true,
      database: 'clientchat',
      tableExists: tableExists,
      userCount: userCount,
      users: users,
      message: tableExists ? 
        `Таблица users существует, записей: ${userCount}` : 
        'Таблица users не существует'
    });
  } catch (error) {
    console.error('❌ Ошибка теста БД:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка подключения к БД: ' + error.message
    });
  }
});

// POST /login — серверная валидация логина
router.post('/login', function(req, res, next) {
  const { login, pass } = req.body;

  if (!login || login.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Логин обязателен' });
  }

  if (!pass || pass.length === 0) {
    return res.status(400).json({ success: false, message: 'Пароль обязателен' });
  }

  return res.json({ success: true, message: 'Вход выполнен успешно!' });
});

// POST /register — серверная валидация и создание пользователя
router.post('/register', async function(req, res, next) {
  console.log('📨 Получен запрос на регистрацию');
  
  try {
    const { username, phone, pass, confirmPass, terms } = req.body;

    console.log('📋 Полученные данные:', { 
      username, 
      phone, 
      pass: pass ? '***' : 'undefined',
      confirmPass: confirmPass ? '***' : 'undefined',
      terms 
    });

    // Валидация
    if (!username || username.trim().length < 3 || username.trim().length > 20) {
      console.log('❌ Ошибка валидации: имя пользователя');
      return res.status(400).json({ success: false, message: 'Имя пользователя должно быть от 3 до 20 символов' });
    }

    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phone || !phoneRegex.test(phone.trim())) {
      console.log('❌ Ошибка валидации: телефон');
      return res.status(400).json({ success: false, message: 'Некорректный номер телефона' });
    }

    if (!pass || pass.length < 8) {
      console.log('❌ Ошибка валидации: пароль слишком короткий');
      return res.status(400).json({ success: false, message: 'Пароль должен быть не менее 8 символов' });
    }

    if (pass !== confirmPass) {
      console.log('❌ Ошибка валидации: пароли не совпадают');
      return res.status(400).json({ success: false, message: 'Пароли не совпадают' });
    }

    if (terms !== true && terms !== 'true' && terms !== 'on') {
      console.log('❌ Ошибка валидации: условия не приняты');
      return res.status(400).json({ success: false, message: 'Вы должны согласиться с условиями' });
    }

    // ПРОВЕРКА СЛОЖНОСТИ ПАРОЛЯ
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;

    console.log('🔐 Сложность пароля:', strength);

    if (strength < 3) {
      console.log('❌ Ошибка валидации: слабый пароль');
      return res.status(400).json({ 
        success: false, 
        message: 'Пароль слишком слабый. Используйте буквы в верхнем и нижнем регистре, цифры и специальные символы' 
      });
    }

    // Сохранение в БД
    console.log('💾 Сохранение пользователя в БД...');
    const userCreated = await addUserToDatabase(username.trim(), phone.trim(), pass);
    
    if (userCreated) {
      console.log('🎉 Регистрация успешна для пользователя:', username);
      return res.json({ success: true, message: 'Регистрация успешно завершена!' });
    } else {
      console.log('❌ Ошибка при создании пользователя');
      return res.status(500).json({ success: false, message: 'Ошибка при создании пользователя в базе' });
    }
  } catch (error) {
    console.error('💥 Ошибка регистрации:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;