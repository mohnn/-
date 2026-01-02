
import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.mjs';

const PDFToWord: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<boolean>(false);
  const [extractedText, setExtractedText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(false);
      setExtractedText('');
      setError(null);
      setProgress(0);
    }
  };

  const extractTextFromPDF = async (file: File) => {
    try {
      setConverting(true);
      setError(null);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      const numPages = pdf.numPages;
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
        setProgress(Math.round((i / numPages) * 100));
      }

      setExtractedText(fullText || 'لم يتم العثور على نص قابل للقراءة في هذا الملف.');
      setResult(true);
    } catch (err) {
      console.error('Error extracting PDF text:', err);
      setError('حدث خطأ أثناء قراءة ملف PDF. قد يكون الملف محمياً أو تالفاً.');
    } finally {
      setConverting(false);
    }
  };

  const handleDownload = () => {
    if (!file || !extractedText) return;
    
    // Create a Word-compatible HTML structure containing the ACTUAL extracted text
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <style>
          body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; }
          .header { color: #4f46e5; border-bottom: 1px solid #eee; margin-bottom: 20px; }
          .content { white-space: pre-wrap; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>مستند محول من PDF إلى Word</h1>
          <p><b>اسم الملف الأصلي:</b> ${file.name}</p>
          <p><b>تاريخ التحويل:</b> ${new Date().toLocaleString('ar-EG')}</p>
        </div>
        <div class="content">
          ${extractedText.replace(/\n/g, '<br>')}
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([content], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${file.name.replace(/\.[^/.]+$/, "")}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        {!file ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf" 
              className="hidden" 
            />
            <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all">
              <i className="fa-solid fa-file-word"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">اختر ملف PDF للتحويل</h3>
            <p className="text-slate-500">سيتم استخراج النصوص وتحويلها إلى مستند Word.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl">
                  <i className="fa-solid fa-file-pdf"></i>
                </div>
                <div>
                  <p className="font-bold text-slate-800 line-clamp-1">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={() => { setFile(null); setResult(false); }}
                className="text-slate-400 hover:text-rose-500 transition-colors"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl text-sm flex items-center gap-3">
                <i className="fa-solid fa-circle-exclamation"></i>
                {error}
              </div>
            )}

            {!converting && !result && !error && (
              <button 
                onClick={() => extractTextFromPDF(file)}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
              >
                تحويل واستخراج المحتوى الآن
              </button>
            )}

            {converting && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold text-indigo-600">
                  <span>جاري قراءة محتوى الملف...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {result && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">تم الاستخراج بنجاح!</h3>
                <p className="text-sm text-slate-500 mb-6">تم العثور على {extractedText.length} حرفاً من النصوص.</p>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-right h-32 overflow-y-auto text-xs text-slate-600">
                  <p className="font-bold mb-2">معاينة المحتوى:</p>
                  {extractedText.substring(0, 500)}...
                </div>

                <button 
                  onClick={handleDownload}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-download"></i>
                  تحميل ملف Word بالمحتوى
                </button>
                <button 
                  onClick={() => { setFile(null); setResult(false); }}
                  className="w-full mt-3 text-slate-500 font-medium py-2 hover:text-indigo-600 transition-colors"
                >
                  تحويل ملف آخر
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-600">
            <i className="fa-solid fa-file-export"></i>
            المميزات
          </h4>
          <ul className="space-y-3 text-slate-600 text-sm">
            <li className="flex items-start gap-3">
              <i className="fa-solid fa-check text-indigo-500 mt-1"></i>
              <span>استخراج النصوص العربية والإنجليزية بدقة من ملفات الـ PDF.</span>
            </li>
            <li className="flex items-start gap-3">
              <i className="fa-solid fa-check text-indigo-500 mt-1"></i>
              <span>معاينة فورية للنصوص قبل تحميل المستند النهائي.</span>
            </li>
            <li className="flex items-start gap-3">
              <i className="fa-solid fa-check text-indigo-500 mt-1"></i>
              <span>تنسيق ملف Word الناتج ليكون سهل التعديل والنسخ.</span>
            </li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-600">
            <i className="fa-solid fa-magnifying-glass-doc"></i>
            الإرشادات
          </h4>
          <ol className="space-y-3 text-slate-600 text-sm list-decimal list-inside pr-2">
            <li>اختر ملف PDF الذي يحتوي على نصوص قابلة للقراءة (غير مشفر).</li>
            <li>اضغط على زر "تحويل" للبدء في تحليل صفحات الملف.</li>
            <li>بعد اكتمال التحليل، يمكنك معاينة النص المستخرج في المربع الصغير.</li>
            <li>اضغط "تحميل ملف Word" لحفظ النتيجة كملف قابل للتعديل.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PDFToWord;
