// Global variables
let currentSection = 'dashboard';
let charts = {};
let usersData = [];
let productsData = [];
let ordersData = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeAdmin();
    setupEventListeners();

    const addProductFormCustom = document.getElementById('addProductFormCustom');
    if (addProductFormCustom) {
        addProductFormCustom.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(addProductFormCustom);
            const productData = {
                name: formData.get('productName'),
                currentPrice: formData.get('currentPrice'),
                discountPrice: formData.get('discountPrice'),
                category: formData.get('category'),
                productType: formData.get('productType'),
                thumbnail: formData.get('thumbnail'),
                productImages: formData.getAll('productImages')
            };
            showToast('Đã thêm sản phẩm mới!', 'success');
            addProductFormCustom.reset();
        });
    }

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
});

function initializeAdmin() {
    showSection('dashboard');
    initializeCharts();
    fetchUsersFromServer(); // 🔄 Gọi API lấy danh sách users từ backend
    loadSampleData(); // Có thể bỏ dòng này sau khi dùng dữ liệu thật
}

function setupEventListeners() {
    document.getElementById('addUserForm')?.addEventListener('submit', handleAddUser);
    document.getElementById('addProductForm')?.addEventListener('submit', handleAddProduct);

    const searchInput = document.querySelector('.search-box input');
    searchInput?.addEventListener('input', handleSearch);

    window.addEventListener('click', function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });

    document.querySelectorAll('.sidebar-menu li').forEach(item => item.classList.remove('active'));

    const selectedSection = document.getElementById(sectionName);
    if (selectedSection) {
        selectedSection.classList.add('active');
        selectedSection.style.display = '';
    }

    const menuItem = document.querySelector(`[onclick="showSection('${sectionName}')"]`)?.parentElement;
    menuItem?.classList.add('active');

    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = getSectionTitle(sectionName);

    currentSection = sectionName;

    switch (sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'users':
            displayUsers(usersData);
            break;
        case 'products':
            displayProducts(productsData);
            break;
        case 'orders':
            displayOrders(ordersData);
            break;
    }
}

function getSectionTitle(sectionName) {
    const titles = {
        'dashboard': 'Dashboard',
        'users': 'Quản lý người dùng',
        'products': 'Quản lý sản phẩm',
        'add-product-section': 'Thêm sản phẩm',
        'orders': 'Quản lý đơn hàng',
        'analytics': 'Phân tích dữ liệu',
        'settings': 'Cài đặt hệ thống',
    };
    return titles[sectionName] || 'Admin Panel';
}

// function loadSampleData() {
//     usersData = [
//         { id: 1, fullName: 'Nguyễn Văn A', email: 'a@email.com', status: 'active', createdAt: new Date() }
//     ];
//     productsData = [
//         { id: 1, name: 'iPhone 15', price: 25000000, category: 'Điện tử', stock: 12, status: 'active', image: '' }
//     ];
//     ordersData = [
//         { id: 1, orderNumber: '#ORD001', customerName: 'Nguyễn Văn A', totalAmount: 25000000, status: 'pending', orderDate: new Date() }
//     ];
// }

function loadDashboardData() {
    document.getElementById('total-users').textContent = usersData.length;
    document.getElementById('total-products').textContent = productsData.length;
    document.getElementById('total-orders').textContent = ordersData.length;
    document.getElementById('total-revenue').textContent = formatCurrency(ordersData.reduce((sum, o) => sum + o.totalAmount, 0));
    loadRecentActivities();
    updateRevenueChart([12, 19, 3, 5, 2, 3, 15, 8, 12, 18, 22, 25]);
}

function loadRecentActivities() {
    const container = document.getElementById('recent-activities');
    if (!container) return;
    const activities = [
        { type: 'user', message: 'Người dùng mới đăng ký: Nguyễn Văn A', time: '2 phút trước' }
    ];
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">
                <i class="fas fa-${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-content">
                <p>${activity.message}</p>
                <small>${activity.time}</small>
            </div>
        </div>
    `).join('');
}

function getActivityIcon(type) {
    const icons = { 'user': 'user', 'order': 'shopping-cart', 'product': 'box' };
    return icons[type] || 'info-circle';
}
function fetchUsersFromServer() {
    fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(data => {
            // Chuyển đổi dữ liệu nhận được thành usersData định dạng chuẩn
            usersData = data.map(user => ({
                id: user.id,
                fullName: user.username || 'Không rõ',
                email: user.email,
                status: 'active',
                createdAt: user.created_at
            }));
            // Nếu đang ở phần quản lý user thì cập nhật bảng
            if (currentSection === 'users') {
                displayUsers(usersData);
            }
        })
        .catch(error => {
            console.error('Lỗi khi lấy danh sách users:', error);
            showToast('Không thể tải danh sách người dùng', 'error');
        });
}

function displayUsers(users) {
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td>${user.status}</td>
            <td>${formatDate(user.createdAt)}</td>
        </tr>
    `).join('');
}

function handleAddUser(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newUser = {
        id: Date.now(),
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        role: formData.get('role'),
        status: 'active',
        createdAt: new Date()
    };
    usersData.push(newUser);
    displayUsers(usersData);
    showToast('Thêm người dùng thành công', 'success');
    event.target.reset();
}

function displayProducts(products) {
    const tbody = document.getElementById('products-table-body');
    if (!tbody) return;
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td><img src="${product.image || 'https://via.placeholder.com/50'}" alt=""></td>
            <td>${product.name}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.category}</td>
            <td>${product.stock}</td>
            <td>${product.status}</td>
        </tr>
    `).join('');
}

function handleAddProduct(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
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
    event.target.reset();
}

function displayOrders(orders) {
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.orderNumber}</td>
            <td>${order.customerName}</td>
            <td>${formatCurrency(order.totalAmount)}</td>
            <td>${order.status}</td>
            <td>${formatDate(order.orderDate)}</td>
        </tr>
    `).join('');
}

// Charts
function initializeCharts() {
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        charts.revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
                datasets: [{
                    label: 'Doanh thu (triệu VNĐ)',
                    data: [],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}

function updateRevenueChart(data) {
    if (charts.revenueChart) {
        charts.revenueChart.data.datasets[0].data = data;
        charts.revenueChart.update();
    }
}

// Utility
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('vi-VN');
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const section = document.querySelector('.section.active');
    if (!section) return;

    const rows = section.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(searchTerm) ? '' : 'none';
    });
}
