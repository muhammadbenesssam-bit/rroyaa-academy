// js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    function getAllUserData() {
        const data = localStorage.getItem('raaya_user_data'); 
        return data ? JSON.parse(data) : {};
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const usernameInput = document.getElementById('login_username').value.trim();
            const passwordInput = document.getElementById('login_password').value.trim();
            
            const allUsers = getAllUserData();
            const userData = allUsers[usernameInput];

            if (!userData) {
                alert('⚠️ خطأ: لا يوجد حساب مسجل باسم المستخدم هذا. يرجى التسجيل أولاً.');
                return;
            }

            if (userData.password === passwordInput) {
                
                // تعيين المستخدم الحالي النشط
                localStorage.setItem('raaya_user', usernameInput); 
                
                const firstName = userData.fullName ? userData.fullName.split(' ')[0] : usernameInput;
                alert(`👋 تم تسجيل الدخول بنجاح، مرحباً بك يا ${firstName}!`);
                
                window.location.href = 'index.html';
                
            } else {
                alert('❌ خطأ في كلمة المرور. يرجى المحاولة مرة أخرى.');
            }
        });
    }
});