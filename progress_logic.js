// js/progress_logic.js

// الثوابت - بيانات الدروس والعد
const SUBJECT_DATA = { 
    fiqh: {
        title: 'الفقه',
        color: 'raaya-green',
        lessons: [
            'FdXl6jjCxP4', 'QjNxtAGUJio', 'Y1-fpaSZl54', 'DM_SWIiDD4E', 'Y_ZsDrHmves', 
            'lYR2bs_60pY', 'heMSVcPu9-A', 'M_4SBZodQ_o', 'dH6iAWN7xzE', 'W1VflF7YyKU', 
            'K4IS3T6U9sQ', 'wj8PzrDjaCQ', 'WfKibTjH0fk', 'ljj6NZA_iUw', 'njiYrAcV-90', 
            'FIz-3mKLAj8', 'H8mlg7wTd5Y', 'yq_6e7tjgww', '3rCqkOCSmss', 'E-edxN9jpJI', 
            'tOEL8jgV7q0' // 21 درس
        ]
    },
    seerah: {
        title: 'السيرة النبوية',
        color: 'raaya-sky',
        lessons: [
            'DH0vF7DsiE8', 'Ys2W-xsyw2M', '0nCBMsZvxdw', '0ay8j32yS0U', 'KkMt_SM9gYY', 
            'giE6Mt-IYm4', 'HkX6PpoS6w', 'aFDR9wpUXXE', '9xt4XUgOzZ0', 'VN3y6HZp9Nc', 
            '2eDmPFZbHSU', '_5VpSC-lM7g', 't0xXsBy2jaM', 'IwenOooQzEA', 'gLriOZ-UILE', 
            '-eXPo4U4bG4', 'swLse-J5YD0', 'E5Ay-oD-h88', '4A_rvW2bU-4', 'BQ8HnykBMP0', 
            '78MJ1J5WZWw' // 21 درس
        ]
    },
    aqidah: { 
        title: 'العقيدة',
        color: 'raaya-babyblue',
        lessons: [
            'TZHeTaOavdI', 'vPl0TqkWpKc', 'dAZ9QOYedT8', 'QudujV8DS_s', 'lmwkTa_QoGo', 
            '0faif6KiddY', 'g6c8KQSFRas', 'kMrTd9QMQG8', 'myzh6RgoI0A', 'melfqDwR7fI', 
            'ty4dd5UepJ4', 'QRjV1uJ8yBY', '7yVTmrPGYrw' // 13 درس
        ]
    }
};

const LESSON_COUNTS = {
    fiqh: SUBJECT_DATA.fiqh.lessons.length,
    seerah: SUBJECT_DATA.seerah.lessons.length,
    aqidah: SUBJECT_DATA.aqidah.lessons.length
};
const TOTAL_LEVEL_LESSONS = LESSON_COUNTS.fiqh + LESSON_COUNTS.seerah + LESSON_COUNTS.aqidah;
const REQUIRED_COMPLETION = 0.95; 

// مفاتيح التخزين الموحدة
const USERS_DATA_KEY = 'raaya_user_data'; 
const CURRENT_USER_KEY = 'raaya_user'; // اسم المستخدم النشط حالياً
const PROGRESS_KEY_PREFIX = 'raaya_progress_';
const GUEST_PROGRESS_KEY = 'raaya_guest_progress'; // مفتاح تخزين مؤقت للزوار

// ------------------------------------------------------------------
// 1. منطق المستخدمين والمصادقة (مساعد)
// ------------------------------------------------------------------

export const getAllUsersData = () => {
    const data = localStorage.getItem(USERS_DATA_KEY);
    return data ? JSON.parse(data) : {};
};

// ------------------------------------------------------------------
// 2. منطق حفظ التقدم (Persistence)
// ------------------------------------------------------------------

export const getCurrentUser = () => {
    return localStorage.getItem(CURRENT_USER_KEY);
};

const getCurrentProgressKey = () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
        return PROGRESS_KEY_PREFIX + currentUser; // مفتاح خاص بالمستخدم
    }
    return GUEST_PROGRESS_KEY; // مفتاح الزائر
};

export const getProgress = () => {
    const progressKey = getCurrentProgressKey();
    if (!progressKey) return {}; 
    
    const progressData = localStorage.getItem(progressKey);
    return progressData ? JSON.parse(progressData) : {};
};

const saveProgressState = (progressState) => {
    const progressKey = getCurrentProgressKey();
    if (!progressKey) return;

    localStorage.setItem(progressKey, JSON.stringify(progressState));
};

export const saveProgress = (subjectName, lessonId) => {
    const progress = getProgress();
    if (!progress[subjectName]) {
        progress[subjectName] = [];
    }
    if (!progress[subjectName].includes(lessonId)) {
        progress[subjectName].push(lessonId);
        saveProgressState(progress);
    }
};

export const isLessonCompleted = (subjectName, lessonId) => {
    const progress = getProgress();
    return progress[subjectName] && progress[subjectName].includes(lessonId);
};

// ------------------------------------------------------------------
// 3. منطق فتح الدروس والتقدم
// ------------------------------------------------------------------

export const isLessonOpen = (subjectName, lessonIndex) => { // index 0-based
    const lessonNumber = lessonIndex + 1;

    // 1. الدرس الأول مفتوح دائمًا للجميع
    if (lessonNumber === 1) {
        return true;
    }
    
    // 2. التحقق من إكمال الدرس السابق (الذي يسبقه مباشرةً)
    const prevLessonIndex = lessonIndex - 1; 
    
    // بناء معرّف الدرس السابق بناءً على ترتيبه (lessonId)
    const prevLessonId = SUBJECT_DATA[subjectName].lessons[prevLessonIndex];

    return isLessonCompleted(subjectName, prevLessonId);
};

export const calculateSubjectProgress = (subjectName) => {
    const progress = getProgress()[subjectName];
    const completedLessons = progress ? progress.length : 0;
    const totalLessons = LESSON_COUNTS[subjectName] || 1; 

    return {
        completed: completedLessons,
        total: totalLessons,
        percentage: Math.floor((completedLessons / totalLessons) * 100)
    };
};

// ------------------------------------------------------------------
// 4. منطق تحديث الواجهة (مخصص لـ level1.html)
// ------------------------------------------------------------------

export const updateSubjectProgressBar = (subjectKey, barId, textId) => {
    const progressData = calculateSubjectProgress(subjectKey);
    const progressBar = document.getElementById(barId);
    const progressText = document.getElementById(textId);

    if (progressBar) {
        progressBar.style.width = `${progressData.percentage}%`;
    }
    if (progressText) {
        progressText.textContent = `التقدم: ${progressData.percentage}%`;
    }
    return progressData;
};

export const updateExamStatus = () => {
    const examCard = document.getElementById('exam-card');
    const examStatus = document.getElementById('exam-status');
    const startExamBtn = document.getElementById('start-exam-btn');

    if (!examCard || !startExamBtn) return;
    
    const currentUser = getCurrentUser();

    // 1. حالة الزائر (غير مسجل)
    if (!currentUser) {
        examCard.classList.add('opacity-50', 'cursor-not-allowed', 'bg-red-100', 'dark:bg-red-900/50', 'border-red-500');
        examCard.classList.remove('bg-raaya-babyblue/50', 'dark:bg-raaya-babyblue/20', 'border-raaya-sky', 'cursor-pointer');
        examStatus.textContent = '🚫 الامتحان مغلق. يجب تسجيل الدخول لفتح الامتحان.';
        examStatus.classList.replace('text-green-800', 'text-red-700');
        startExamBtn.disabled = true;
        startExamBtn.classList.replace('bg-raaya-sky', 'bg-red-500');
        return;
    }

    // 2. حالة المستخدم المسجل (تحقق من الإكمال)
    let allSubjectsCompleted = true;
    const subjectKeys = Object.keys(SUBJECT_DATA);

    subjectKeys.forEach(key => {
        const progress = calculateSubjectProgress(key);
        // التحقق من أن التقدم يفي بـ 95%
        if (progress.percentage < (REQUIRED_COMPLETION * 100)) { 
            allSubjectsCompleted = false;
        }
    });

    if (allSubjectsCompleted) {
        // تفعيل الامتحان
        examCard.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-red-100', 'dark:bg-red-900/50', 'border-red-500');
        examCard.classList.add('bg-raaya-babyblue/50', 'dark:bg-raaya-babyblue/20', 'border-raaya-sky', 'cursor-pointer');
        examStatus.textContent = '🎉 تهانينا! يمكنك الآن بدء الامتحان النهائي.';
        examStatus.classList.remove('text-red-700', 'dark:text-red-400');
        examStatus.classList.add('text-green-800', 'dark:text-raaya-green');
        startExamBtn.disabled = false;
        startExamBtn.classList.remove('bg-red-500', 'hover:bg-red-600');
        startExamBtn.classList.add('bg-raaya-sky', 'hover:bg-raaya-green');
        
        startExamBtn.onclick = () => { 
             window.location.href = 'exam.html'; 
        };

    } else {
        // الإبقاء على حالة الإغلاق
        examCard.classList.add('opacity-50', 'cursor-not-allowed', 'bg-red-100', 'dark:bg-red-900/50', 'border-red-500');
        examCard.classList.remove('bg-raaya-babyblue/50', 'dark:bg-raaya-babyblue/20', 'border-raaya-sky', 'cursor-pointer');
        examStatus.textContent = '🔒 الامتحان مغلق. أكمل جميع المواد (95%) لفتحه.';
        examStatus.classList.replace('text-green-800', 'text-red-700');
        startExamBtn.disabled = true;
        startExamBtn.classList.replace('bg-raaya-sky', 'bg-red-500');
    }
};