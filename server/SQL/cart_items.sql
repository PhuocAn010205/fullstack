CREATE DATABASE IF NOT EXISTS cart_items CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cart_items;
CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                         -- ID người dùng
    product_id INT NOT NULL,                      -- ID sản phẩm
    quantity INT DEFAULT 1,                       -- Số lượng
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Thời gian thêm

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES addproduct(product_id) ON DELETE CASCADE
);
INSERT INTO cart_items (user_id, product_id, quantity)
VALUES (29, 41, 2);