// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    checkLoginStatus();
});

// === 1. نظام الوضع الليلي ===
function initDarkMode() {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    const htmlEl = document.documentElement;
    const icon = toggleBtn.querySelector('i');

    // التحقق من التفضيل المحفوظ
    if (localStorage.getItem('theme') === 'dark') {
        htmlEl.classList.add('dark');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    toggleBtn.addEventListener('click', () => {
        if (htmlEl.classList.contains('dark')) {
            htmlEl.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            icon.classList.replace('fa-sun', 'fa-moon');
        } else {
            htmlEl.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            icon.classList.replace('fa-moon', 'fa-sun');
        }
    });
}

// === 2. التحقق من المستخدم ===
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const navLoginBtn = document.getElementById('nav-login-btn');
    const levelsBtn = document.getElementById('levels-btn');
    
    // الأزرار في الـ Hero Section (اختياري، يمكن جلبه بالـ ID)
    
    if (user) {
        // إذا كان المستخدم مسجلاً
        
        // 1. تحديث الشريط السفلي
        navLoginBtn.href = 'account.html';
        navLoginBtn.innerHTML = `
            <i class="fas fa-user text-lg mb-1"></i>
            <span class="text-xs font-bold">${user.name.split(' ')[0]}</span>
        `;

        // 2. إظهار زر المستويات العلوي
        if(levelsBtn) levelsBtn.classList.remove('hidden');

    } else {
        // إذا لم يكن مسجلاً
        if(levelsBtn) levelsBtn.classList.add('hidden');
    }
}

// دالة مساعدة للحفظ (سنستخدمها في صفحات التسجيل)
function saveUser(userData) {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    // حفظ في قاعدة بيانات وهمية للمستخدمين
    let users = JSON.parse(localStorage.getItem('usersDB')) || [];
    users.push(userData);
    localStorage.setItem('usersDB', JSON.stringify(users));
}