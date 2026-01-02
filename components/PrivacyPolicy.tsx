
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 max-w-4xl mx-auto text-right">
      <h1 className="text-3xl font-black text-slate-900 mb-8 pb-4 border-b border-slate-100">سياسة الخصوصية</h1>
      
      <div className="space-y-8 text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-indigo-600 mb-4">1. التزامنا بالخصوصية</h2>
          <p>خصوصيتك تهمنا جداً. نحن في "أدوات أونلاين" نتبع سياسة صارمة لضمان عدم جمع أي بيانات شخصية دون علمك الصريح.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-indigo-600 mb-4">2. التعامل مع الملفات (PDF)</h2>
          <p>عند استخدام أداة ضغط ملفات PDF، تتم عملية المعالجة محلياً في متصفحك أو عبر خوادم مؤقتة مشفرة. نحن <strong>لا نقوم بحفظ</strong> ملفاتك أو محتواها، ويتم حذفها تلقائياً فور انتهاء العملية.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-indigo-600 mb-4">3. الذكاء الاصطناعي</h2>
          <p>بالنسبة لمولد الأوامر (AI Prompt Generator)، يتم إرسال النصوص المدخلة إلى واجهة برمجة تطبيقات Gemini لمعالجتها وتوليد النتيجة. لا نقوم بربط هذه النصوص بأي معلومات تعريفية بك.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-indigo-600 mb-4">4. ملفات تعريف الارتباط (Cookies)</h2>
          <p>نستخدم ملفات تعريف الارتباط الأساسية فقط لتحسين تجربة المستخدم وحفظ تفضيلاتك البسيطة داخل الموقع (مثل عدد جلسات بومودورو المكتملة)، ولا نستخدمها لأغراض تتبع إعلانية.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-indigo-600 mb-4">5. أمن البيانات</h2>
          <p>نحن نستخدم بروتوكولات أمان قياسية (SSL) لضمان أن اتصالك بالموقع آمن ومشفر بالكامل.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
