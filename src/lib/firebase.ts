// src/lib/firebase.ts

// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app"; // Thêm getApp, getApps để tránh khởi tạo nhiều lần
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // <<<<<<< THÊM DÒNG NÀY

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyArCtsDdnOUpWCMx57voO2O2dZN3owRtqo", // Hãy cân nhắc sử dụng biến môi trường cho khóa API
    authDomain: "smartmeal-planner-31348.firebaseapp.com",
    projectId: "smartmeal-planner-31348",
    storageBucket: "smartmeal-planner-31348.appspot.com", // Hoặc "smartmeal-planner-31348.firebasestorage.app" - kiểm tra lại
    messagingSenderId: "2272414225",
    appId: "1:2272414225:web:2bb5efeeb3bd55121e3fb0",
    measurementId: "G-N450Z35FRL"
};

// Initialize Firebase
// Kiểm tra xem app đã được khởi tạo chưa để tránh lỗi
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const analytics = getAnalytics(app);
const auth = getAuth(app); // <<<<<<< KHỞI TẠO AUTHENTICATION

// Export các dịch vụ bạn muốn sử dụng trong ứng dụng
export { app, analytics, auth }; // <<<<<<< EXPORT AUTH