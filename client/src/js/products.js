import { formatCurrency, showToast } from './utils.js';

export let productsData = [];

// ✅ Dùng một biến để giữ tham chiếu hàm
let handleFormSubmitRef = null;

export function displayProducts(products) {
    const tbody = document.getElementById('products-table-body');
    if (!tbody) return;

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
    const form = document.getElementById('addProductFormCustom');
    if (!form) return;

    // ❌ Loại bỏ nếu đã gán sự kiện trước đó
    if (handleFormSubmitRef) {
        form.removeEventListener('submit', handleFormSubmitRef);
    }

    // ✅ Tạo 1 tham chiếu duy nhất
  handleFormSubmitRef = async function (e) {
    e.preventDefault();

    const thumbnailFile = document.getElementById('thumbnail').files[0];
    const extraFiles = document.getElementById('extraImages').files;

    if (!thumbnailFile) {
        alert('Vui lòng chọn ảnh đại diện');
        return;
    }

    const formData = new FormData();
    formData.append('thumbnail', thumbnailFile);
   for (let i = 0; i < extraFiles.length; i++) {
    formData.append('images[]', extraFiles[i]);
}

    // ✅ Lấy giá trị từ CKEditor
    const descriptionEditor = ClassicEditor.instances?.description;
    const descriptionValue = descriptionEditor
        ? descriptionEditor.getData()
        : form.elements['description'].value;

    // ✅ Dùng form.elements để truy cập name
   
    formData.append('product_name', form.elements['productName'].value);
    formData.append('current_price', form.elements['price'].value);
    formData.append('discount_price', form.elements['discountPrice'].value || 0);
    formData.append('category', form.elements['category'].value);
    formData.append('description', descriptionValue);
    formData.append('stock_quantity', form.elements['stock'].value);
    formData.append('product_type', form.elements['material'].value);

    try {
        const res = await fetch('http://localhost:3000/products', {
            method: 'POST',
            body: formData
        });

        const result = await res.json();

        if (res.ok) {
            alert('✅ Thêm sản phẩm thành công!');
            form.reset();
            document.getElementById('thumbnailPreview').style.display = 'none';
            document.getElementById('productImagesPreview').style.display = 'none';
            fetchProducts();
        } else {
            showToast(result.message || 'Lỗi khi thêm sản phẩm', 'error');
        }
    } catch (err) {
        console.error('❌ Lỗi khi thêm sản phẩm:', err);
        alert('Lỗi khi thêm sản phẩm. Xem console để biết chi tiết.');
    }
};


    // ✅ Chỉ gán một lần duy nhất
    form.addEventListener('submit', handleFormSubmitRef);
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

// ✅ Khởi động khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    setupProductEvents();
});
