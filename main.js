// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    
    // العناصر الأساسية للواجهة
    const body = document.body; 
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    
    // عناصر الشريط العلوي/الجانبي
    const levelsButton = document.getElementById('levels-button');
    const accountLink = document.getElementById('account-link');
    const loginNavBtn = document.getElementById('login-nav-btn');
    const registerNavBtn = document.getElementById('register-nav-btn');
    const logoutNavBtn = document.getElementById('logout-nav-btn'); 

    // --- 1. منطق الوضع الليلي (Dark Mode) ---
    
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    if (isDarkMode) {
        body.classList.add('dark');
        if (sunIcon) sunIcon.classList.add('hidden');
        if (moonIcon) moonIcon.classList.remove('hidden');
    } else {
        body.classList.remove('dark');
        if (sunIcon) sunIcon.classList.remove('hidden');
        if (moonIcon) moonIcon.classList.add('hidden');
    }
    
    function toggleDarkMode() {
        if (body.classList.contains('dark')) {
            body.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
            if (sunIcon) sunIcon.classList.remove('hidden');
            if (moonIcon) moonIcon.classList.add('hidden');
        } else {
            body.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
            if (sunIcon) sunIcon.classList.add('hidden');
            if (moonIcon) moonIcon.classList.remove('hidden');
        }
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    // --- 2. منطق حالة تسجيل الدخول ---

    const activeUser = localStorage.getItem('raaya_user');
    const isLoggedIn = !!activeUser; 

    function updateUIForAuthStatus() {
        if (isLoggedIn) {
            // للمستخدم المسجل دخوله
            if (levelsButton) levelsButton.classList.remove('hidden'); 
            if (accountLink) accountLink.classList.remove('hidden'); 
            
            // إخفاء أزرار تسجيل الدخول والتسجيل الجديد
            if (loginNavBtn) loginNavBtn.classList.add('hidden');
            if (registerNavBtn) registerNavBtn.classList.add('hidden');
            
            // إظهار زر تسجيل الخروج
            if (logoutNavBtn) logoutNavBtn.classList.remove('hidden');

            // تحديث اسم المستخدم (يتطلب جلب الاسم الكامل من raaya_user_data)
            const allUsers = JSON.parse(localStorage.getItem('raaya_user_data') || '{}');
            const userData = allUsers[activeUser];

            if (accountLink && userData && userData.fullName) {
                 accountLink.textContent = `مرحباً، ${userData.fullName.split(' ')[0]}!`;
                 accountLink.href = 'account.html'; // يفترض وجود صفحة حساب
            }

        } else {
            // للمستخدم غير المسجل دخوله
            if (levelsButton) levelsButton.classList.add('hidden');
            if (accountLink) accountLink.classList.add('hidden');
            
            // إظهار أزرار تسجيل الدخول والتسجيل الجديد
            if (loginNavBtn) loginNavBtn.classList.remove('hidden');
            if (registerNavBtn) registerNavBtn.classList.remove('hidden');
            
            // إخفاء زر تسجيل الخروج
            if (logoutNavBtn) logoutNavBtn.classList.add('hidden');
        }
    }

    updateUIForAuthStatus();


    // 3. منطق تسجيل الخروج (Logout)
    if (logoutNavBtn) {
        logoutNavBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('raaya_user'); 
            
            alert('تم تسجيل الخروج بنجاح.');
            window.location.href = 'index.html'; 
        });
    }

});