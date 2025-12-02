// js/account_progress.js

// 1. بيانات الطالب الافتراضية
const studentProfile = {
    name: "student-name",
    email: "student-email",
    level: "student-levle",
};

// 2. تعريف بيانات الدروس الكلية والإنجاز الحالي (بيانات افتراضية يمكنك تعديلها)
const lessonData = {
    // مجموع الدروس الكلي في المستوى الأول
    totalLessons: 55, 
    // عدد الدروس التي أكملها الطالب
    completedLessons: 18, 
    
    // التقدم لكل مادة
    fiqh: { completed: 0, total: 20 },
    seerah: { completed: 0, total: 10 },
    aqidah: { completed: 0, total: 6 },
    // ملاحظة: المجموع الحالي لـ total هو 0. يجب مراجعة مجموع الدروس الكلي 55.
};

// 3. دالة حساب نسبة التقدم (تستخدم في جميع الحسابات)
function calculatePercentage(completed, total) {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
}

// 4. دالة تحديث الواجهة الرسومية (UI)
function updateDashboard() {
    
    // أ. تحديث المعلومات الشخصية
    document.getElementById('student-name').textContent = studentProfile.name;
    document.getElementById('student-name-greeting').textContent = studentProfile.name.split(' ')[0]; // فقط الاسم الأول في الترحيب
    document.getElementById('student-email').textContent = studentProfile.email;
    document.getElementById('student-level').textContent = studentProfile.level;


    // ب. تحديث الإحصائيات الكلية
    const overallProgress = calculatePercentage(lessonData.completedLessons, lessonData.totalLessons);
    const completedCount = lessonData.completedLessons;
    const totalCount = lessonData.totalLessons;
    
    document.getElementById('overall-progress-percentage').textContent = `${overallProgress}%`;
    document.getElementById('overall-progress-bar').style.width = `${overallProgress}%`;
    document.getElementById('completed-lessons-count').textContent = completedCount;
    document.getElementById('total-lessons-count').textContent = totalCount;

    // ج. تحديث أشرطة تقدم المواد الفردية
    const fiqhProgress = calculatePercentage(lessonData.fiqh.completed, lessonData.fiqh.total);
    document.getElementById('fiqh-progress').textContent = `${fiqhProgress}%`;

    const seerahProgress = calculatePercentage(lessonData.seerah.completed, lessonData.seerah.total);
    document.getElementById('seerah-progress').textContent = `${seerahProgress}%`;

    const aqidahProgress = calculatePercentage(lessonData.aqidah.completed, lessonData.aqidah.total);
    document.getElementById('aqidah-progress').textContent = `${aqidahProgress}%`;

    // د. منطق فتح الامتحان النهائي
    const examStatusElement = document.getElementById('exam-status');
    const examLinkElement = document.getElementById('exam-link');

    if (overallProgress === 100) {
        examStatusElement.textContent = 'مفتوح - تهانينا على إكمال الدروس!';
        examStatusElement.classList.remove('text-red-500');
        examStatusElement.classList.add('text-raaya-green', 'font-extrabold');
        
        examLinkElement.href = 'exam_level1.html'; 
        examLinkElement.classList.remove('bg-gray-400', 'cursor-not-allowed');
        examLinkElement.classList.add('bg-raaya-sky', 'hover:bg-raaya-babyblue'); 
        examLinkElement.style.boxShadow = '0 4px 10px rgba(135, 206, 235, 0.5)';

    } else {
        // إذا كان التقدم أقل من 100%
        examStatusElement.textContent = `مغلق - أكمل ${totalLessons - completedLessons} درسًا متبقياً لفتح الامتحان.`;
    }
}

// تشغيل دالة التحديث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', updateDashboard);