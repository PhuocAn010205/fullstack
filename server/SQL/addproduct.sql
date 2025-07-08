-- 1. Tạo database
CREATE DATABASE IF NOT EXISTS addproduct CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE addproduct;

-- 2. Tạo bảng sản phẩm
CREATE TABLE IF NOT EXISTS addproduct (
    product_id INT AUTO_INCREMENT PRIMARY KEY,               -- Mã sản phẩm
    product_name VARCHAR(255) NOT NULL,                      -- Tên sản phẩm
    category VARCHAR(100) NOT NULL,                          -- Danh mục (Áo, Quần, Giày, ...)
    product_type VARCHAR(100),                               -- Phân loại (Nam, Nữ, Trẻ em...)
    current_price DECIMAL(10, 2) NOT NULL,                   -- Giá hiện tại
    discount_price DECIMAL(10, 2),                           -- Giá khuyến mãi
    material VARCHAR(100),                                   -- Chất liệu (nếu có)
    thumbnail_url VARCHAR(500),                              -- Ảnh đại diện
    stock_quantity INT DEFAULT 0,                            -- Tồn kho
    description TEXT,                                        -- Mô tả
    gallery_urls TEXT,                                       -- Danh sách ảnh phụ (nếu lưu dạng CSV)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Tạo bảng ảnh sản phẩm riêng
CREATE TABLE IF NOT EXISTS product_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES addproduct(product_id)
        ON DELETE CASCADE
);

-- 4. Thêm sản phẩm mẫu
INSERT INTO addproduct (
    product_name,
    category,
    product_type,
    current_price,
    discount_price,
    material,
    thumbnail_url,
    stock_quantity,
    description
) VALUES (
    'Kem dưỡng Nivea Soft (Hộp 50ml)',
    'Chăm sóc cơ thể',
    'Hũ',
    76000,
    95000,
    'Dưỡng ẩm',
    '/uploads/anhproduct1.webp',
    20,
    'Hỗ trợ ngăn ngừa viêm loét dạ dày - tá tràng. Quy cách 60 viên. Không phải thuốc.'
);

-- 5. Thêm ảnh phụ (ví dụ)
INSERT INTO product_images (product_id, image_url) VALUES
(1, '/uploads/anhproduct1_1.webp'),
(1, '/uploads/anhproduct1_2.webp');
