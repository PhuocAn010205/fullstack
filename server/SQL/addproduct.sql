CREATE DATABASE IF NOT EXISTS addproduct ;

-- Dùng database đó
USE addproduct ;
CREATE TABLE IF NOT EXISTS addproduct (
    product_id INT AUTO_INCREMENT PRIMARY KEY,               -- Mã sản phẩm
    product_name VARCHAR(255) NOT NULL,                      -- Tên sản phẩm
    category VARCHAR(100) NOT NULL,                          -- Danh mục (Áo, Quần, Giày, ...)
    product_type VARCHAR(100),                               -- Phân loại (Nam, Nữ, Trẻ em...)
    current_price DECIMAL(10, 2) NOT NULL,                   -- Giá hiện tại
    discount_price DECIMAL(10, 2),                           -- Giá khuyến mãi
    thumbnail_url VARCHAR(500),                              -- Ảnh đại diện (thumbnail)
    stock_quantity INT DEFAULT 0,                            -- Số lượng tồn kho
    description TEXT,                                        -- Mô tả sản phẩm
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,          -- Ngày tạo
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
    'Kem dưỡng Nivea Soft (Hộp 50ml)',
    'Chăm sóc cơ thể',
    'Hũ',
    76.000,
    950000,
    './src/img/anhproduct1.webp',
    20,
    'Danh mục

Hỗ trợ bảo vệ dạ dày
Công dụng

Hỗ trợ ngăn ngừa bệnh viêm loét dạ dày - tá tràng, dư acid trong dạ dày.

Quy cách

60 viên
Lưu ý

Thực phẩm này không phải là thuốc, không có tác dụng thay thế thuốc chữa bệnh. Chống chỉ định nếu dị ứng với bất kỳ thành phần nào trong sản phẩm. Đọc kỹ tờ hướng dẫn sử dụng trước khi dùng.'
);
CREATE TABLE IF NOT EXISTS product_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,                                 -- Khóa ngoại tới sản phẩm
    image_url VARCHAR(500) NOT NULL,                         -- Đường dẫn ảnh
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         -- Thời gian upload
    FOREIGN KEY (product_id) REFERENCES addproduct(product_id)
        ON DELETE CASCADE                                     -- Nếu xóa sản phẩm thì ảnh cũng bị xóa
);