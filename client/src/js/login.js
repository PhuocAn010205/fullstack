import { auth } from "./firebas-config.js";
import {signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const inpEmail = document.getElementById('email');
const inpPwd = document.getElementById('password');
const regMessage = document.getElementById('regMessage');

const loginForm = document.getElementById('register-form')
const handleLogin = function(event){
    event.preventDefault();

    let email = inpEmail.value.trim();
    let password = inpPwd.value.trim();
    if(!email||!password){
        regMessage.innerText =" Vui lòng điều đầy đủ thông tin."
        regMessage.style.color="red";
        return;
    }
    // hàm bất đồng bộ người then để trả về dl 
    // signInWithEmailAndPassword(auth,email,password)
    // .then((userCredential)=>{
    //     const user = userCredential.user;
    //     // usersession kiểu dữ liệu là đối tượng nên 
    //     // phải dùng JSON.stringify(vale); để thành chuỗi json; 

    //     const userSession = {
    //         user:{
    //             email: user.email
    //         },
    //         expiry:new Date().getTime() + 2*60*60*1000 // 2hours
    //     };
    //     localStorage.setItem('user_session',JSON.stringify(userSession));
    //     window.location.href='index.html';
    // })
    // .catch(e =>{
    //     regMessage.innerText="Lỗi"+e.messages;
    // });

}
// gọi hàm sự kiện 
loginForm.addEventListener('submit',handleLogin);
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
