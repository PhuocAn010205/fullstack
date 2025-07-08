const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// ======= MySQL USERS DB =======
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: '01022005an',
  database: 'user_tables'
});

connection.connect(err => {
  if (err) return console.error('❌ Kết nối MySQL thất bại:', err);
  console.log('✅ Kết nối MySQL (users) thành công!');
});

// ======= MySQL PRODUCTS DB =======
const productDb = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: '01022005an',
  database: 'addproduct'
});

productDb.connect(err => {
  if (err) return console.error('❌ Kết nối product_db thất bại:', err);
  console.log('✅ Kết nối product_db thành công!');
});

// ======= File Upload Config =======
const uploadsDir = path.join(__dirname, '../client/src/uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

app.use('/uploads', express.static(uploadsDir)); // Serve static files

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = `${file.fieldname}-${Date.now()}${ext}`;
      cb(null, name);
    }
  })
});

// ======= ROUTES =======

// Register
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) return res.status(400).json({ message: 'Thiếu thông tin' });

  try {
    const hash = await bcrypt.hash(password, 13);
    connection.query(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hash, email],
      (err) => {
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

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Thiếu thông tin' });

  connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    if (results.length === 0) return res.status(400).json({ message: 'Email không tồn tại' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Sai mật khẩu' });

    res.status(200).json({ message: 'Đăng nhập thành công', username: user.username });
  });
});

// (Tuỳ chọn) Danh sách người dùng
app.get('/users', (req, res) => {
  connection.query('SELECT id, username, email, created_at FROM users', (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn CSDL' });
    res.status(200).json(results);
  });
});

// =================== PRODUCT API ===================

// 1. Upload ảnh riêng
app.post('/upload', upload.single('thumbnail'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Không có file được tải lên' });

  const thumbnail_url = `/uploads/${req.file.filename}`;
  res.status(200).json({ message: 'Upload thành công', thumbnail_url });
});

// 2. Thêm sản phẩm
app.post('/products', (req, res) => {
  const {
    product_name, current_price, discount_price,
    product_type, category, description,
    stock_quantity, thumbnail_url
  } = req.body;

  const query = `
    INSERT INTO addproduct (
      product_name, current_price, discount_price,
      product_type, category, description,
      stock_quantity, thumbnail_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  productDb.query(query, [
    product_name, current_price, discount_price,
    product_type, category, description,
    stock_quantity, thumbnail_url
  ], (err, result) => {
    if (err) {
      console.error('❌ Lỗi thêm sản phẩm:', err);
      return res.status(500).json({ message: 'Lỗi thêm sản phẩm' });
    }

    res.status(200).json({
      message: 'Thêm sản phẩm thành công',
      product_id: result.insertId
    });
  });
});

// 3. Lấy danh sách sản phẩm
app.get('/products', (req, res) => {
  const query = 'SELECT * FROM addproduct ORDER BY created_at DESC';

  productDb.query(query, (err, results) => {
    if (err) {
      console.error('❌ Lỗi khi truy vấn sản phẩm:', err);
      return res.status(500).json({ message: 'Lỗi khi lấy sản phẩm' });
    }
    res.status(200).json(results);
  });
});
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  console.log('Truy vấn ID:', id); // debug

  productDb.query('SELECT * FROM addproduct WHERE product_id = ?', [id], (err, results) => {
    if (err) {
      console.error('❌ Lỗi truy vấn sản phẩm theo ID:', err);
      return res.status(500).json({ message: 'Lỗi server' });
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
  });
});

// =================== START SERVER ===================
app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
});
