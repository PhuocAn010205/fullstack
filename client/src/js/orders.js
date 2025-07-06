import { formatCurrency, formatDate } from './utils.js';

export let ordersData = [];

export function displayOrders(orders) {
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;
    tbody.innerHTML = orders.map(o => `
        <tr>
            <td>${o.orderNumber}</td>
            <td>${o.customerName}</td>
            <td>${formatCurrency(o.totalAmount)}</td>
            <td>${o.status}</td>
            <td>${formatDate(o.orderDate)}</td>
        </tr>
    `).join('');
}

export function setupOrderEvents() {
    // Tạm thời chưa có gì, dùng khi bạn cần thêm đơn hàng mới hoặc cập nhật trạng thái
}
