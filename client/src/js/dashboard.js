import { formatCurrency } from './utils.js';
import { displayUsers, usersData, fetchUsersFromServer } from './users.js';
import { displayProducts, productsData } from './products.js';
import { displayOrders, ordersData } from './orders.js';

let charts = {};
let currentSection = 'dashboard';

export function initializeAdmin() {
    showSection('dashboard');
    initializeCharts();
    fetchUsersFromServer();
}

export function setupEventListeners() {
    const searchInput = document.querySelector('.search-box input');
    searchInput?.addEventListener('input', handleSearch);

    window.addEventListener('click', function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

export function showSection(sectionName) {
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

function getSectionTitle(name) {
    const map = {
        dashboard: 'Dashboard',
        users: 'Quản lý người dùng',
        products: 'Quản lý sản phẩm',
        add: 'Thêm sản phẩm',
        orders: 'Quản lý đơn hàng',
        analytics: 'Phân tích dữ liệu',
        settings: 'Cài đặt hệ thống',
    };
    return map[name] || 'Admin Panel';
}

function loadDashboardData() {
    document.getElementById('total-users').textContent = usersData.length;
    document.getElementById('total-products').textContent = productsData.length;
    document.getElementById('total-orders').textContent = ordersData.length;
    document.getElementById('total-revenue').textContent = formatCurrency(
        ordersData.reduce((sum, o) => sum + o.totalAmount, 0)
    );

    updateRevenueChart([12, 19, 3, 5, 2, 3, 15, 8, 12, 18, 22, 25]);
}

function initializeCharts() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    charts.revenueChart = new Chart(ctx, {
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

function updateRevenueChart(data) {
    if (charts.revenueChart) {
        charts.revenueChart.data.datasets[0].data = data;
        charts.revenueChart.update();
    }
}

function handleSearch(e) {
    const value = e.target.value.toLowerCase();
    const section = document.querySelector('.section.active');
    if (!section) return;

    section.querySelectorAll('tbody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(value) ? '' : 'none';
    });
}
