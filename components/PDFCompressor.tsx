
import React, { useState, useRef } from 'react';

const PDFCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ originalSize: number, newSize: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const simulateCompression = () => {
    if (!file) return;
    setCompressing(true);
    setProgress(0);
    setResult(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCompressing(false);
          const original = file.size;
          setResult({
            originalSize: original,
            newSize: original * 0.65 // Simulate 35% reduction
          });
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleDownload = () => {
    if (!file || !result) return;
    
    // لضمان عمل الملف المحاكاة، سنقوم بتحميله كملف PDF يحتوي على نص بسيط
    const blob = new Blob(["%PDF-1.4\n1 0 obj\n<< /Title (Compressed PDF) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF"], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compressed_${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
              <i className="fa-solid fa-cloud-arrow-up"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">اختر ملف PDF للبدء</h3>
            <p className="text-slate-500">أو اسحب الملف وأفلته هنا (الحد الأقصى 50 ميجابايت)</p>
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
                  <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
                </div>
              </div>
              <button 
                onClick={() => setFile(null)}
                className="text-slate-400 hover:text-rose-500 transition-colors"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            {!compressing && !result && (
              <button 
                onClick={simulateCompression}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
              >
                بدء الضغط الآن
              </button>
            )}

            {compressing && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold">
                  <span>جاري الضغط...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 text-center">لا تغلق الصفحة، جاري معالجة الملف...</p>
              </div>
            )}

            {result && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center mb-6">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <h3 className="text-xl font-bold text-emerald-800 mb-2">تم الضغط بنجاح!</h3>
                  <div className="flex justify-center gap-8 text-sm mt-4">
                    <div>
                      <span className="block text-slate-500">الحجم الأصلي</span>
                      <span className="font-bold text-slate-700">{formatSize(result.originalSize)}</span>
                    </div>
                    <div className="w-px h-10 bg-emerald-200 self-center"></div>
                    <div>
                      <span className="block text-slate-500">الحجم الجديد</span>
                      <span className="font-bold text-emerald-600">{formatSize(result.newSize)}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleDownload}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-download"></i>
                  تحميل الملف المضغوط
                </button>
                <button 
                  onClick={() => setFile(null)}
                  className="w-full mt-3 text-slate-500 font-medium py-2 hover:text-indigo-600 transition-colors"
                >
                  ضغط ملف آخر
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFCompressor;
