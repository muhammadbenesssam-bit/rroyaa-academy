// js/forgot_password.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgot-password-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('forgot_username').value.trim();
            const allUsers = JSON.parse(localStorage.getItem('raaya_user_data') || '{}');
            
            if (allUsers[username]) {
                const userPassword = allUsers[username].password;
                
                alert(`✅ تم إرسال كلمة المرور (للمحاكاة فقط): كلمة مرورك هي: ${userPassword}`);
                
                // في تطبيق حقيقي، يتم إرسال بريد إلكتروني أو رسالة نصية هنا.
                
                window.location.href = 'login.html'; // العودة لصفحة الدخول
            } else {
                alert('❌ لم يتم العثور على اسم المستخدم هذا.');
            }
        });
    }
});