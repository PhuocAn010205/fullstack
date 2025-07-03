import { auth, db } from "./firebas-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { collection,addDoc} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";


const inpUserName = document.querySelector("#username");
const inpEmail = document.querySelector("#email");
const inpPwd = document.querySelector("#password");
const inpConfirmPwd = document.querySelector("#confirm-password");
const registerForm =document.querySelector('#register-form');
const regMessage = document.querySelector("#regMessage");
const handleRegister = function (event) {
  event.preventDefault(); /* Dùng để ngăn chặn sk md submit */

  let username = inpUserName.value.trim();
  let email =  inpEmail.value.trim(); /**trim lay dl bo khoang trang dau va cuoi */
  let password = inpPwd.value.trim();
  let configPassword = inpConfirmPwd.value.trim();
  let role_id = 2; /*id là user còn id 1 là admin */
  let lowerCaseLeter = /[a-z]/g;
  let upperCaseLeter = /[A-Z]/g;
  let numbers = /[0-9]/g;

  if(!username ||!email || !password || !configPassword){
     regMessage.innerText ="Điều vào các ô còn trống."
     regMessage.style.color="red";
     return;
  }
 if (password.length < 8) {
    regMessage.innerText = "Mật khẩu phải có ít nhất 8 ký tự";
     regMessage.style.color="red";
    return;
  }
    if (!lowerCaseLeter.test(password)) {
    regMessage.innerText = "Mật khẩu chưa có chữ thường";
    regMessage.style.color="red";
    return;
  }

  if (!upperCaseLeter.test(password)) {
    regMessage.innerText = "Mật khẩu chưa có chữ in hoa";
     regMessage.style.color="red";
    return;
  }

  if (!numbers.test(password)) {
    regMessage.innerText = "Mật khẩu chưa có số 0-9";
     regMessage.style.color="red";

    return;
  }
  if (password !== configPassword){
       regMessage.innerText = "Mật khẩu không khớp!";
      regMessage.style.color="red";

       return;
  } 
   
  //  createUserWithEmailAndPassword(auth,email,password).then((userCredential)=> {
  //   const user = userCredential.user;
  //   const userData = {
  //       username,
  //       email,
  //       password:hashedPwd, /*không lưu password plaintext=> mã hóa */
  //       role_id,
  //       balance: 0,
  //   };
  //   return addDoc(collection(db,"users"),userData);
  //  })
  //  .then(()=>{
  //      regMessage.innerText="Đăng kí thành công ^.^."
  //      regMessage.style.color="green";
  //      window.location.href="login.html";
  //  })
  //  .catch((e) => {
  //   regMessage.innerText ="Lỗi:"+e.message;
  //   regMessage.style.color="red";
  //  })
};
registerForm.addEventListener('submit',handleRegister);
// hien thi mk
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", function () {
  // Đổi type input
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";

  // Đổi icon
  this.classList.toggle("fa-eye");
  this.classList.toggle("fa-eye-slash");
//   toggle dùng để 
});
