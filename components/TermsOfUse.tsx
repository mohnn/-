
import React from 'react';

const TermsOfUse: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 max-w-4xl mx-auto text-right">
      <h1 className="text-3xl font-black text-slate-900 mb-8 pb-4 border-b border-slate-100">شروط الاستخدام</h1>
      
      <div className="space-y-8 text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-indigo-600 mb-4">1. قبول الشروط</h2>
          <p>بدخولك واستخدامك لموقع "أدوات أونلاين"، فإنك توافق على الالتزام بشروط الاستخدام هذه وكافة القوانين واللوائح المعمول بها. إذا كنت لا توافق على أي من هذه الشروط، يمنع عليك استخدام هذا الموقع.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-indigo-600 mb-4">2. ترخيص الاستخدام</h2>
          <p>يُمنح الإذن باستخدام الأدوات المتوفرة في الموقع للأغراض الشخصية وغير التجارية فقط. لا يجوز لك:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 mr-4">
            <li>تعديل أو نسخ المواد البرمجية.</li>
            <li>استخدام المواد لأي غرض تجاري أو للعرض العام.</li>
            <li>محاولة فك تشفير أو عكس هندسة أي برنامج يحتوي عليه الموقع.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-indigo-600 mb-4">3. إخلاء المسؤولية</h2>
          <div className="bg-amber-50 border-r-4 border-amber-400 p-4 rounded-l-lg">
            <p className="text-amber-800 text-sm">يتم توفير الأدوات (مثل حاسبة المعدل وحاسبة كتلة الجسم) "كما هي". لا يقدم الموقع أي ضمانات، صريحة أو ضمنية، بشأن دقة النتائج. يجب عدم الاعتماد الكلي على هذه الأدوات في اتخاذ قرارات طبية أو أكاديمية رسمية دون الرجوع للمتخصصين.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-indigo-600 mb-4">4. حدود المسؤولية</h2>
          <p>لا يتحمل موقع "أدوات أونلاين" أو موردوه المسؤولية عن أي أضرار ناتجة عن استخدام أو عدم القدرة على استخدام الأدوات المتاحة، حتى لو تم إخطارنا باحتمالية حدوث مثل هذه الأضرار.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-indigo-600 mb-4">5. التعديلات</h2>
          <p>قد يقوم الموقع بمراجعة شروط الاستخدام هذه في أي وقت دون إشعار مسبق. باستخدامك لهذا الموقع، فإنك توافق على الالتزام بالإصدار الحالي من شروط الاستخدام هذه.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfUse;
