const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3000;

// ======= Middleware =======
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// ======= Static folders =======
const thumbnailDir = path.join(__dirname, '../client/src/uploads');
const productImagesDir = path.join(__dirname, '../client/src/product_images');

if (!fs.existsSync(thumbnailDir)) fs.mkdirSync(thumbnailDir, { recursive: true });
if (!fs.existsSync(productImagesDir)) fs.mkdirSync(productImagesDir, { recursive: true });

app.use('/uploads', express.static(thumbnailDir));
app.use('/product_images', express.static(productImagesDir));

// ======= MySQL Connections =======
const userDb = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: '01022005an',
  database: 'user_tables'
});

userDb.connect(err => {
  if (err) return console.error('❌ Kết nối MySQL (users) thất bại:', err);
  console.log('✅ Kết nối MySQL (users) thành công!');
});

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

// ======= Multer for Uploads =======
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = file.fieldname === 'thumbnail' ? thumbnailDir : productImagesDir;
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const prefix = file.fieldname === 'thumbnail' ? 'thumbnail' : 'product';
      cb(null, `${prefix}-${Date.now()}${ext}`);
    }
  })
});

// ======= USER ROUTES =======

// Register
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) return res.status(400).json({ message: 'Thiếu thông tin' });

  try {
    const hash = await bcrypt.hash(password, 13);
    userDb.query(
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

  userDb.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    if (results.length === 0) return res.status(400).json({ message: 'Email không tồn tại' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Sai mật khẩu' });

    res.status(200).json({ message: 'Đăng nhập thành công', username: user.username });
  });
});

// Danh sách người dùng
app.get('/users', (req, res) => {
  userDb.query('SELECT id, username, email, created_at FROM users', (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn CSDL' });
    res.status(200).json(results);
  });
});

// ======= PRODUCTS ROUTES =======

// Thêm sản phẩm kèm ảnh đại diện và ảnh phụ
app.post('/products', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images[]', maxCount: 10 }
]), (req, res) => {
  const {
    product_name, current_price, discount_price,
    product_type, category, description, stock_quantity
  } = req.body;

  const thumbnailFile = req.files?.thumbnail?.[0];
  const images = req.files?.['images[]'] || [];

  if (!product_name || !current_price || !thumbnailFile) {
    return res.status(400).json({ message: 'Thiếu thông tin sản phẩm hoặc ảnh đại diện' });
  }

  const thumbnail_url = `/uploads/${thumbnailFile.filename}`;

  const insertProductQuery = `
    INSERT INTO addproduct (
      product_name, current_price, discount_price,
      product_type, category, description,
      stock_quantity, thumbnail_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  productDb.query(insertProductQuery, [
    product_name, current_price, discount_price || null,
    product_type, category, description, stock_quantity,
    thumbnail_url
  ], (err, result) => {
    if (err) {
      console.error('❌ Lỗi thêm sản phẩm:', err);
      return res.status(500).json({ message: 'Lỗi thêm sản phẩm' });
    }

    const product_id = result.insertId;

    if (images.length > 0) {
      const values = images.map(file => [product_id, `/product_images/${file.filename}`]);
      const insertImagesQuery = 'INSERT INTO product_images (product_id, image_url) VALUES ?';

      productDb.query(insertImagesQuery, [values], (imgErr) => {
        if (imgErr) {
          console.error('❌ Lỗi lưu ảnh phụ:', imgErr);
          return res.status(500).json({ message: 'Lỗi lưu ảnh phụ' });
        }

        return res.status(200).json({ message: 'Thêm sản phẩm và ảnh thành công', product_id });
      });
    } else {
      return res.status(200).json({ message: 'Thêm sản phẩm thành công (không có ảnh phụ)', product_id });
    }
  });
});

// Lấy danh sách sản phẩm
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

// Lấy chi tiết sản phẩm theo ID
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;

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

// Lấy ảnh phụ của sản phẩm
app.get('/api/images/:productId', (req, res) => {
  const { productId } = req.params;
  productDb.query('SELECT * FROM product_images WHERE product_id = ?', [productId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi lấy ảnh phụ' });
    res.status(200).json(results);
  });
});

// ======= START SERVER =======
app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
});
