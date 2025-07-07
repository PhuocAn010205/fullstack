const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Kết nối MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'admin',               // ← chỉnh user DB nếu cần
  password: '01022005an',      // ← chỉnh password DB nếu cần
  database: 'user_tables'
});

connection.connect(err => {
  if (err) {
    console.error('❌ Kết nối MySQL thất bại:', err);
    return;
  }
  console.log(' Kết nối MySQL done!');
});

// ---------------------- API ---------------------- //

// Đăng ký tài khoản
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Thiếu thông tin' });
  }

  try {
    const hash = await bcrypt.hash(password, 13);
    connection.query(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hash, email],
      (err, results) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email hoặc username đã tồn tại' });
          }
          return res.status(500).json({ message: 'Lỗi server khi thêm người dùng' });
        }
        res.status(200).json({ message: 'Đăng ký thành công!' });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Lỗi mã hóa mật khẩu' });
  }
});

// Lấy danh sách người dùng (tuỳ chọn - dùng để debug)
app.get('/register', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn CSDL' });
    res.status(200).json(results);
  });
});

// Đăng nhập
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Thiếu thông tin' });
  }

  connection.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: 'Lỗi server' });
      if (results.length === 0) return res.status(400).json({ message: 'Email không tồn tại' });

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) return res.status(400).json({ message: 'Sai mật khẩu' });

      // Đăng nhập thành công
      res.status(200).json({
        message: 'Đăng nhập thành công',
        username: user.username
      });
    }
  );
});

// ---------------------- START SERVER ---------------------- //
app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
});
