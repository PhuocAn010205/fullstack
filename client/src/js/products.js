import { formatCurrency, showToast } from './utils.js';

export let productsData = [];

export function displayProducts(products) {
    const tbody = document.getElementById('products-table-body');
    if (!tbody) return;

    // Sắp xếp theo product_id
    products.sort((a, b) => a.product_id - b.product_id);

    tbody.innerHTML = products.map(p => `
        <tr>
            <td>${p.product_id}</td>
            <td><img src="${p.thumbnail_url || 'https://via.placeholder.com/50'}" alt="" width="50"></td>
            <td>${p.product_name}</td>
            <td>${formatCurrency(p.current_price)}</td>
            <td>${p.category || ''}</td>
            <td>${p.stock_quantity || 0}</td>
            <td>${p.status || 'active'}</td>
        </tr>
    `).join('');
}

export function setupProductEvents() {
    document.getElementById('addProductFormCustom')?.addEventListener('submit', async e => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const file = formData.get('thumbnail');
        let thumbnail_url = '';

        // ======= B1: Upload ảnh chính (thumbnail) =======
        if (file && file.name) {
            const imageForm = new FormData();
            imageForm.append('thumbnail', file);

            try {
                const uploadRes = await fetch('http://localhost:3000/upload', {
                    method: 'POST',
                    body: imageForm
                });

                const uploadResult = await uploadRes.json();
                if (uploadRes.ok) {
                    thumbnail_url = uploadResult.thumbnail_url;
                } else {
                    showToast('Upload ảnh thất bại: ' + uploadResult.message, 'error');
                    return;
                }
            } catch (err) {
                showToast('Lỗi khi upload ảnh chính', 'error');
                console.error(err);
                return;
            }
        }

        // ======= B2: Gửi dữ liệu sản phẩm chính =======
        const productData = {
            product_name: formData.get('productName'),
            current_price: parseFloat(formData.get('price')),
            discount_price: parseFloat(formData.get('discountPrice')) || 0,
            product_type: formData.get('material'),
            description: formData.get('description'),
            category: formData.get('category') || '',
            stock_quantity: parseInt(formData.get('stock')) || 0,
            thumbnail_url: thumbnail_url,
            status: 'active' // ⚠️ thêm status mặc định
        };

        let productId = null;

        try {
            const res = await fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            const result = await res.json();
            if (res.ok && result.product_id) {
                showToast('Thêm sản phẩm thành công', 'success');

                productId = result.product_id;

                // ======= B3: Upload ảnh phụ (nếu có) =======
                const extraImages = document.getElementById('extraImages');
                const extraFiles = extraImages?.files;

                if (extraFiles && extraFiles.length > 0) {
                    const imageForm = new FormData();
                    for (let i = 0; i < extraFiles.length; i++) {
                        imageForm.append('images', extraFiles[i]);
                    }
                    imageForm.append('product_id', productId); // ⚠️ gửi đúng tên

                    try {
                        const uploadExtra = await fetch('http://localhost:3000/upload-images', {
                            method: 'POST',
                            body: imageForm
                        });

                        const extraResult = await uploadExtra.json();
                        if (uploadExtra.ok) {
                            console.log('Ảnh phụ đã được thêm:', extraResult.inserted);
                        } else {
                            showToast('Không thể upload ảnh phụ: ' + extraResult.message, 'warning');
                        }
                    } catch (err) {
                        console.error('Lỗi upload ảnh phụ:', err);
                        showToast('Lỗi khi upload ảnh phụ', 'error');
                    }
                }

                // ======= B4: Cập nhật giao diện sau khi thêm =======
                productData.product_id = productId;
                productsData.push(productData);
                displayProducts(productsData);

                form.reset();
                document.getElementById('thumbnailPreview').style.display = 'none';
                document.getElementById('productImagesPreview').style.display = 'none';

            } else {
                showToast('Lỗi khi thêm sản phẩm: ' + (result.message || 'Không có product_id trả về'), 'error');
            }
        } catch (err) {
            console.error('Lỗi gửi dữ liệu:', err);
            showToast('Không thể kết nối server', 'error');
        }
    });

    // ======= Preview ảnh chính =======
    document.getElementById('thumbnail')?.addEventListener('change', function (e) {
        const file = e.target.files[0];
        const preview = document.getElementById('thumbnailPreview');
        if (file) {
            preview.src = URL.createObjectURL(file);
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
    });

    // ======= Preview ảnh phụ =======
    document.getElementById('extraImages')?.addEventListener('change', function (e) {
        const files = e.target.files;
        const preview = document.getElementById('productImagesPreview');
        if (files && files.length > 0) {
            preview.innerHTML = '';
            Array.from(files).forEach(file => {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.style.width = '50px';
                img.style.margin = '4px';
                preview.appendChild(img);
            });
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
    });
}

async function fetchProducts() {
    try {
        const res = await fetch('http://localhost:3000/products');
        const data = await res.json();

        if (res.ok) {
            productsData = data;
            displayProducts(productsData);
        } else {
            showToast('Lỗi khi lấy sản phẩm: ' + (data.message || 'Không rõ'), 'error');
        }
    } catch (err) {
        console.error('Lỗi fetch sản phẩm:', err);
        showToast('Không thể kết nối server', 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    setupProductEvents();
});
