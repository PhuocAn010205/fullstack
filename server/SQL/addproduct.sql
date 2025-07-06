CREATE DATABASE IF NOT EXISTS addproduct ;

-- Dùng database đó
USE addproduct ;
CREATE TABLE addproduct (
    product_id INT AUTO_INCREMENT PRIMARY KEY,       -- Mã sản phẩm
    product_name VARCHAR(255) NOT NULL,              -- Tên sản phẩm
    category VARCHAR(100) NOT NULL,                  -- Danh mục (Áo, Quần, Giày, ...)
    product_type VARCHAR(100),                       -- Phân loại (Nam, Nữ, Trẻ em...)
    current_price DECIMAL(10, 2) NOT NULL,           -- Giá hiện tại
    discount_price DECIMAL(10, 2),                   -- Giá khuyến mãi
    thumbnail_url VARCHAR(500),                      -- Ảnh đại diện (thumbnail)
    stock_quantity INT DEFAULT 0,                    -- Số lượng tồn kho
    description TEXT,                                -- Mô tả sản phẩm
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Ngày tạo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Ngày cập nhật
);
INSERT INTO addproduct (
    product_name,
    category,
    product_type,
    current_price,
    discount_price,
    thumbnail_url,
    stock_quantity,
    description
) VALUES (
    'Giày thể thao nam Nike',
    'Giày',
    'Nam',
    1200000,
    950000,
    'https://example.com/images/nike-1.jpg',
    20,
    'Giày thể thao nam chính hãng Nike, kiểu dáng trẻ trung năng động.'
);
CREATE TABLE product_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,                           -- FK tới sản phẩm
    image_url VARCHAR(500) NOT NULL,                   -- Đường dẫn ảnh chi tiết
    FOREIGN KEY (product_id) REFERENCES addproduct(product_id)
        ON DELETE CASCADE
);
