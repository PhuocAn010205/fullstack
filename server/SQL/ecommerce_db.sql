-- Tạo và sử dụng database chính
DROP DATABASE IF EXISTS ecommerce_db;
CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce_db;

-- 1. Bảng người dùng
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng sản phẩm
CREATE TABLE addproduct (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    product_type VARCHAR(100),
    current_price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2),
    material VARCHAR(100),
    thumbnail_url VARCHAR(500),
    stock_quantity INT DEFAULT 0,
    description TEXT,
    gallery_urls TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Bảng ảnh phụ sản phẩm
CREATE TABLE product_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES addproduct(product_id) ON DELETE CASCADE
);

-- 4. Bảng giỏ hàng
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES addproduct(product_id) ON DELETE CASCADE
);

-- 5. Thêm dữ liệu mẫu
INSERT INTO users (username, password, email) VALUES
('nguyenvana', '123456', 'a@gmail.com');

INSERT INTO addproduct (
    product_name, category, product_type, current_price, discount_price,
    material, thumbnail_url, stock_quantity, description, gallery_urls
) VALUES (
    'Kem dưỡng Nivea Soft (Hộp 50ml)',
    'Chăm sóc cơ thể',
    'Hũ',
    76000,
    95000,
    'Dưỡng ẩm',
    '/uploads/anhproduct1.webp',
    20,
    'Kem dưỡng da giúp mềm mịn và dưỡng ẩm tự nhiên.',
    '/uploads/anhproduct1_1.webp,/uploads/anhproduct1_2.webp'
);

INSERT INTO product_images (product_id, image_url) VALUES
(1, '/uploads/anhproduct1_1.webp'),
(1, '/uploads/anhproduct1_2.webp');

INSERT INTO cart_items (user_id, product_id, quantity)
VALUES (3, 1, 2);
