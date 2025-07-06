import { formatDate, showToast } from './utils.js';

export let usersData = [];

export function fetchUsersFromServer() {
    fetch('http://localhost:3000/users')
        .then(res => res.json())
        .then(data => {
            usersData = data.map(user => ({
                id: user.id,
                fullName: user.username || 'Không rõ',
                email: user.email,
                status: 'active',
                createdAt: user.created_at
            }));
            displayUsers(usersData);
        })
        .catch(err => {
            console.error(err);
            showToast('Không thể tải danh sách người dùng', 'error');
        });
}

export function displayUsers(users) {
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

export function setupUserEvents() {
    document.getElementById('addUserForm')?.addEventListener('submit', e => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
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
        form.reset();
    });
}
