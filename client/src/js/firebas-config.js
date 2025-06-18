// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAe4tTYvo3BlV_RzlWWvlai9e1grYO6kJg",
    authDomain: "pharmacy-management-ee692.firebaseapp.com",
    projectId: "pharmacy-management-ee692",
    storageBucket: "pharmacy-management-ee692.firebasestorage.app",
    messagingSenderId: "333149298786",
    appId: "1:333149298786:web:f1215b57163d338ddcf13b",
    measurementId: "G-D3BTD4T451"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const db = getFirestore(app);
  export{auth,db};