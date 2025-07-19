// ---------- DOM ----------
const inpUserName = document.querySelector("#username");
const inpEmail = document.querySelector("#email");
const inpPwd = document.querySelector("#password");
const inpConfirmPwd = document.querySelector("#confirm-password");
const regMessage = document.querySelector("#regMessage");
const registerForm = document.querySelector("#register-form");

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

// ---------- REGISTER ----------
if (registerForm && inpUserName && inpConfirmPwd) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let username = inpUserName.value.trim();
    let email = inpEmail.value.trim();
    let password = inpPwd.value.trim();
    let configPassword = inpConfirmPwd.value.trim();

    let lowerCaseLeter = /[a-z]/g;
    let upperCaseLeter = /[A-Z]/g;
    let numbers = /[0-9]/g;

    if (!username || !email || !password || !configPassword) {
      regMessage.innerText = "Điền vào các ô còn trống.";
      regMessage.style.color = "red";
      return;
    }
    if (password.length < 8) {
      regMessage.innerText = "Mật khẩu phải có ít nhất 8 ký tự";
      regMessage.style.color = "red";
      return;
    }
    if (!lowerCaseLeter.test(password)) {
      regMessage.innerText = "Mật khẩu chưa có chữ thường";
      regMessage.style.color = "red";
      return;
    }
    if (!upperCaseLeter.test(password)) {
      regMessage.innerText = "Mật khẩu chưa có chữ in hoa";
      regMessage.style.color = "red";
      return;
    }
    if (!numbers.test(password)) {
      regMessage.innerText = "Mật khẩu chưa có số 0-9";
      regMessage.style.color = "red";
      return;
    }
    if (password !== configPassword) {
      regMessage.innerText = "Mật khẩu không khớp!";
      regMessage.style.color = "red";
      return;
    }

    // Gửi yêu cầu đăng ký
    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await res.json();
      regMessage.innerText = data.message;
      regMessage.style.color = res.ok ? "green" : "red";

      if (res.ok) {
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
      }
    } catch (err) {
      regMessage.innerText = "Lỗi kết nối server!";
      regMessage.style.color = "red";
    }
  });
}

// ---------- LOGIN ----------
const loginForm = document.getElementById("register-form");

if (loginForm && !inpUserName && !inpConfirmPwd) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let email = inpEmail.value.trim();
    let password = inpPwd.value.trim();

    if (!email || !password) {
      regMessage.innerText = "Vui lòng điền đầy đủ thông tin.";
      regMessage.style.color = "red";
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      regMessage.innerText = data.message;
      regMessage.style.color = res.ok ? "green" : "red";

      if (res.ok) {
        localStorage.setItem("username", data.username);
        localStorage.setItem("user_id", data.user_id);
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1500);
      }
    } catch (err) {
      regMessage.innerText = "Lỗi kết nối server!";
      regMessage.style.color = "red";
    }
  });
}

// ---------- Dùng để xem hiển thị mật khẩu ----------
if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", function () {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });
}
