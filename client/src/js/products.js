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

        // B1: Upload ảnh nếu có file
        if (file && file.name) {
            const imageForm = new FormData();
            imageForm.append('thumbnail', file); // ĐÚNG TÊN với backend

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
                showToast('Lỗi khi upload ảnh', 'error');
                console.error(err);
                return;
            }
        }

        // B2: Gửi dữ liệu sản phẩm
        const productData = {
            product_name: formData.get('productName'),
            current_price: parseFloat(formData.get('price')),
            discount_price: parseFloat(formData.get('discountPrice')) || 0,
            product_type: formData.get('material'),
            description: formData.get('description'),
            category: formData.get('category') || '',
            stock_quantity: parseInt(formData.get('stock')) || 0,
            thumbnail_url: thumbnail_url
        };

        try {
            const res = await fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            const result = await res.json();
            if (res.ok) {
                showToast('Thêm sản phẩm thành công', 'success');

                productData.id = result.product_id || Date.now();
                productsData.push(productData);
                displayProducts(productsData);

                form.reset();
                document.getElementById('thumbnailPreview').style.display = 'none';
            } else {
                showToast('Lỗi: ' + (result.message || 'Không thêm được sản phẩm'), 'error');
            }
        } catch (err) {
            console.error('Lỗi gửi dữ liệu:', err);
            showToast('Không thể kết nối server', 'error');
        }
    });

    // Hiển thị ảnh preview khi chọn ảnh
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
}

async function fetchProducts() {
    try {
        const res = await fetch('http://localhost:3000/products');
        const data = await res.json();

        if (res.ok) {
            productsData = data; // cập nhật mảng toàn cục
            displayProducts(productsData); // render
        } else {
            showToast('Lỗi khi lấy sản phẩm: ' + (data.message || 'Không rõ'), 'error');
        }
    } catch (err) {
        console.error('Lỗi fetch sản phẩm:', err);
        showToast('Không thể kết nối server', 'error');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();     // ← gọi API và hiển thị sản phẩm khi trang vừa load
    setupProductEvents(); // ← gắn sự kiện form, upload ảnh, v.v.
});
