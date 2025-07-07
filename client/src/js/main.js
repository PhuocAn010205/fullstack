window.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username');
  const nameSpan = document.getElementById('name');
  const userIcon = document.getElementById('userIcon');
  const userLink = document.getElementById('userLink');

  if (username) {
    nameSpan.innerText = username;
    userIcon.classList.add('bracket_active');
    userLink.href = "#"; // Ngăn redirect lại login
    userLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm("Bạn có muốn đăng xuất không?")) {
        localStorage.removeItem('username');
        window.location.reload();
      }
    });
  }
});
