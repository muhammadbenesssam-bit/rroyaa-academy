// js/lesson_viewer.js

// استيراد الدوال الضرورية من progress_logic.js
import { saveProgress, isLessonCompleted, isLessonOpen, SUBJECT_DATA } from './progress_logic.js'; 

document.addEventListener('DOMContentLoaded', () => {
    // جلب البارامترات من URL: ?subject=fiqh&lesson=FdXl6jjCxP4
    const urlParams = new URLSearchParams(window.location.search);
    const subjectKey = urlParams.get('subject');
    const lessonId = urlParams.get('lesson');

    if (!subjectKey || !lessonId || !SUBJECT_DATA[subjectKey]) {
        alert('❌ خطأ: لم يتم تحديد المادة أو الدرس بشكل صحيح.');
        return;
    }
    
    const subjectData = SUBJECT_DATA[subjectKey];
    const lessonIndex = subjectData.lessons.indexOf(lessonId);
    const lessonNumber = lessonIndex + 1;
    const lessonTitle = `${lessonNumber}. ${subjectData.title} - درس الفيديو`; // محاكاة لاسم الدرس

    document.getElementById('lesson-title').textContent = lessonTitle;
    document.getElementById('page-title').textContent = lessonTitle;
    
    const lessonCompletionBtn = document.getElementById('lesson-completion-btn');

    // 1. التحقق من القفل (هذا مهم جداً!)
    if (!isLessonOpen(subjectKey, lessonIndex)) {
        alert('🔒 هذا الدرس مغلق حتى تكمل الدرس السابق.');
        window.location.href = `level1.html`; // العودة لقائمة المستوى
        return;
    }

    // 2. تحديث حالة زر الإكمال عند التحميل
    if (isLessonCompleted(subjectKey, lessonId)) {
        updateCompletionButton(true);
    } else {
        updateCompletionButton(false);
    }
    
    // 3. عرض الفيديو
    const iframe = document.getElementById('youtube-player');
    if (iframe) {
        iframe.src = `https://www.youtube.com/embed/${lessonId}?rel=0&showinfo=0&autoplay=0`;
    }

    // 4. منطق حفظ التقدم عند الضغط على زر "أكملت"
    lessonCompletionBtn.addEventListener('click', () => {
        saveProgress(subjectKey, lessonId);
        updateCompletionButton(true);
        alert('✅ تم حفظ تقدمك بنجاح! يمكنك الآن الانتقال للدرس التالي.');

        // إعادة تحميل الواجهة لتحديث حالة القفل في الواجهة الرئيسية
        // window.location.reload(); 
    });

    // 5. دالة تحديث مظهر الزر
    function updateCompletionButton(isCompleted) {
        if (isCompleted) {
            lessonCompletionBtn.textContent = '✅ مكتمل (تم حفظ التقدم)';
            lessonCompletionBtn.classList.remove('bg-raaya-sky', 'hover:bg-raaya-dark');
            lessonCompletionBtn.classList.add('bg-raaya-green', 'cursor-not-allowed');
            lessonCompletionBtn.disabled = true;
        } else {
            lessonCompletionBtn.textContent = 'أكملت مشاهدة الدرس';
            lessonCompletionBtn.classList.add('bg-raaya-sky', 'hover:bg-raaya-dark');
            lessonCompletionBtn.classList.remove('bg-raaya-green', 'cursor-not-allowed');
            lessonCompletionBtn.disabled = false;
        }
    }
});