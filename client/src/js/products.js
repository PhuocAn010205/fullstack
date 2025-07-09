import { formatCurrency, showToast } from './utils.js';

export let productsData = [];

export function displayProducts(products) {
    const tbody = document.getElementById('products-table-body');
    if (!tbody) return;
    tbody.innerHTML = products.map(p => `
        <tr>
            <td>${p.id}</td>
            <td><img src="${p.image || 'https://via.placeholder.com/50'}" alt=""></td>
            <td>${p.name}</td>
            <td>${formatCurrency(p.price)}</td>
            <td>${p.category}</td>
            <td>${p.stock}</td>
            <td>${p.status}</td>
        </tr>
    `).join('');
}

export function setupProductEvents() {
    document.getElementById('addProductForm')?.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newProduct = {
            id: Date.now(),
            name: formData.get('productName'),
            price: parseFloat(formData.get('price')),
            category: formData.get('category'),
            stock: parseInt(formData.get('stock')),
            status: 'active',
            image: ''
        };
        productsData.push(newProduct);
        displayProducts(productsData);
        showToast('Thêm sản phẩm thành công', 'success');
        e.target.reset();
    });

    // Preview ảnh đại diện
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

