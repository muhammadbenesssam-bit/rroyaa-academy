// js/register.js

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    function getAllUserData() {
        const data = localStorage.getItem('raaya_user_data'); 
        return data ? JSON.parse(data) : {};
    }

    function saveAllUserData(data) {
        localStorage.setItem('raaya_user_data', JSON.stringify(data));
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const fullName = document.getElementById('register_fullname').value.trim();
            const username = document.getElementById('register_username').value.trim();
            const password = document.getElementById('register_password').value.trim();
            
            if (!fullName || !username || !password) {
                 alert('⚠️ الرجاء تعبئة جميع الحقول المطلوبة.');
                 return;
            }
            if (password.length < 6) {
                alert('⚠️ يجب أن تكون كلمة المرور 6 أحرف على الأقل.');
                return;
            }

            let allUsers = getAllUserData();

            // 1. التحقق من وجود المستخدم مسبقاً
            if (allUsers[username]) {
                alert('❌ اسم المستخدم مسجل مسبقاً. يرجى تسجيل الدخول.');
                return;
            }

            // 2. تسجيل المستخدم الجديد
            const newUser = {
                fullName: fullName,
                username: username,
                password: password,
                currentLevel: 1 
            };
            
            allUsers[username] = newUser;
            saveAllUserData(allUsers);

            // 3. تعيين المستخدم كـ نشط وتسجيل الدخول تلقائياً
            localStorage.setItem('raaya_user', username);
            
            alert(`🎉 تم التسجيل بنجاح! مرحباً بك يا ${fullName.split(' ')[0]} في أكاديمية رؤية.`);
            
            window.location.href = 'levels.html'; 
        });
    }
});