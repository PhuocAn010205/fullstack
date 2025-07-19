const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3000;

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(morgan('combined'))
app.use(express.static(path.join(__dirname, '../client')));

// ===== Static Folders =====
const thumbnailDir = path.join(__dirname, '../client/src/uploads');
const productImagesDir = path.join(__dirname, '../client/src/product_images');

if (!fs.existsSync(thumbnailDir)) fs.mkdirSync(thumbnailDir, { recursive: true });
if (!fs.existsSync(productImagesDir)) fs.mkdirSync(productImagesDir, { recursive: true });

app.use('/uploads', express.static(thumbnailDir));
app.use('/product_images', express.static(productImagesDir));

// ===== MySQL Connection (gộp 1 DB) =====
const db = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: '01022005an',
  database: 'ecommerce_db'
});

db.connect(err => {
  if (err) return console.error('❌ Kết nối MySQL thất bại:', err);
  console.log('✅ Kết nối MySQL thành công!');
});

// ===== Multer Setup =====
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

// ===== USER Routes =====
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) return res.status(400).json({ message: 'Thiếu thông tin' });

  try {
    const hash = await bcrypt.hash(password, 13);
    db.query(
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
  } catch {
    res.status(500).json({ message: 'Lỗi mã hóa mật khẩu' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Thiếu thông tin' });

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    if (results.length === 0) return res.status(400).json({ message: 'Email không tồn tại' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Sai mật khẩu' });

    res.status(200).json({ message: 'Đăng nhập thành công', username: user.username, user_id: user.id });
  });
});

app.get('/users', (req, res) => {
  db.query('SELECT id, username, email, created_at FROM users', (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn CSDL' });
    res.status(200).json(results);
  });
});

// ===== PRODUCT Routes =====
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

  db.query(insertProductQuery, [
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

      db.query(insertImagesQuery, [values], (imgErr) => {
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

app.get('/products', (req, res) => {
  db.query('SELECT * FROM addproduct ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi lấy sản phẩm' });
    res.status(200).json(results);
  });
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM addproduct WHERE product_id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    if (results.length > 0) return res.json(results[0]);
    res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  });
});

app.get('/api/images/:productId', (req, res) => {
  const { productId } = req.params;
  db.query('SELECT * FROM product_images WHERE product_id = ?', [productId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi lấy ảnh phụ' });
    res.status(200).json(results);
  });
});

// ===== CART ROUTES =====
app.post('/cart', (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  if (!user_id || !product_id || !quantity) {
    return res.status(400).json({ message: 'Thiếu thông tin giỏ hàng' });
  }

  db.query(
    'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
    [user_id, product_id, quantity],
    (err) => {
      if (err) return res.status(500).json({ message: 'Lỗi thêm vào giỏ hàng' });
      res.status(200).json({ message: 'Thêm vào giỏ hàng thành công' });
    }
  );
});

app.get('/cart/:userId', (req, res) => {
  const { userId } = req.params;
  db.query(`
    SELECT c.id, c.quantity, p.product_name, p.current_price, p.thumbnail_url
    FROM cart_items c
    JOIN addproduct p ON c.product_id = p.product_id
    WHERE c.user_id = ?
  `, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi lấy giỏ hàng' });
    res.status(200).json(results);
  });
});

// ===== START SERVER =====
app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
});
