
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import * as pdfjsLib from 'pdfjs-dist';

// تهيئة عامل PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.mjs';

interface Attachment {
  file: File;
  preview: string;
  type: string;
  base64?: string;
  extractedText?: string;
}

const AIPromptGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [purpose, setPurpose] = useState('creative-writing');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = 'ar-SA';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTopic(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      setRecognition(rec);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      setResult('');
      setIsListening(true);
      recognition?.start();
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return fullText;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusMessage('جاري معالجة الملف...');
    let extractedText = '';
    
    if (file.type === 'application/pdf') {
      try {
        extractedText = await extractTextFromPDF(file);
      } catch (err) {
        console.error('PDF Error:', err);
      }
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAttachment({
        file,
        preview: file.type.startsWith('image/') ? base64 : '',
        type: file.type,
        base64: base64.split(',')[1],
        extractedText
      });
      setStatusMessage('');
    };
    reader.readAsDataURL(file);
  };

  const generatePrompt = async () => {
    if (!topic.trim() && !attachment) return;
    
    setLoading(true);
    setResult('');
    setStatusMessage('جاري تصميم الأمر الاحترافي...');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `
        أنت خبير في صياغة الأوامر (Prompt Engineering). مهمتك هي تحويل فكرة المستخدم البسيطة إلى أمر احترافي مفصل.
        القواعد:
        1. إذا كانت المدخلات بالعربي، اجعل الأمر الاحترافي بالعربي.
        2. إذا كانت بالإنجليزية، اجعل الأمر بالإنجليزية.
        3. قم بتضمين: الدور (Role)، المهمة (Task)، السياق (Context)، والقيود (Constraints).
        4. حلل الصور أو الملفات المرفقة وادمج تفاصيلها في صياغة الأمر.
      `;
      
      let inputData = `الفكرة: ${topic}\nالهدف: ${purpose}\n`;
      if (attachment?.extractedText) inputData += `محتوى الملف المرفق: ${attachment.extractedText}\n`;

      const contents: any[] = [{ text: inputData }];
      
      if (attachment && attachment.base64 && attachment.type.startsWith('image/')) {
        contents.push({
          inlineData: {
            mimeType: attachment.type,
            data: attachment.base64
          }
        });
      }

      const response = await ai.models.generateContent({
        model: attachment?.type.startsWith('image/') ? 'gemini-2.5-flash-image' : 'gemini-3-flash-preview',
        contents: { parts: contents },
        config: { systemInstruction }
      });
      
      setResult(response.text || 'فشل توليد الأمر.');
      setStatusMessage('');
    } catch (error) {
      console.error(error);
      setResult('حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-bold text-slate-700 mb-2">ما هي فكرتك أو مشروعك؟</label>
            <div className="relative">
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="اكتب فكرتك هنا أو استخدم الميكروفون..."
                className="w-full h-48 bg-slate-50 border border-slate-200 rounded-2xl p-5 pb-16 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none text-lg"
              ></textarea>
              
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                    title="إرفاق ملف أو صورة"
                  >
                    <i className="fa-solid fa-paperclip"></i>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf,.txt"
                  />
                  
                  <button 
                    onClick={toggleListening}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-white border border-slate-200 text-slate-500 hover:text-rose-500 hover:border-rose-200'}`}
                    title={isListening ? 'جاري الاستماع...' : 'تحدث الآن'}
                  >
                    <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
                  </button>
                </div>
                
                {(isListening || statusMessage) && (
                  <span className="text-xs font-bold text-indigo-500 animate-pulse flex items-center gap-1">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    {statusMessage || 'جاري الاستماع...'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {attachment && (
            <div className="flex items-center gap-4 p-3 bg-indigo-50 border border-indigo-100 rounded-2xl animate-in fade-in slide-in-from-top-2">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-indigo-600 text-xl border border-indigo-100">
                <i className={`fa-solid ${attachment.type === 'application/pdf' ? 'fa-file-pdf' : 'fa-image'}`}></i>
              </div>
              <div className="flex-grow">
                <p className="text-sm font-bold text-slate-700 line-clamp-1">{attachment.file.name}</p>
                <p className="text-xs text-slate-500">{(attachment.file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button 
                onClick={() => setAttachment(null)}
                className="w-8 h-8 text-slate-400 hover:text-rose-500 transition-colors"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">نوع الأداة المستهدفة</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'creative-writing', label: 'إبداعي', icon: 'fa-pen-nib' },
                { id: 'coding', label: 'برمجة', icon: 'fa-code' },
                { id: 'business', label: 'أعمال', icon: 'fa-briefcase' },
                { id: 'academic', label: 'أكاديمي', icon: 'fa-book' }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setPurpose(type.id)}
                  className={`p-3 rounded-xl border text-sm font-bold flex flex-col items-center gap-2 transition-all ${purpose === type.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'}`}
                >
                  <i className={`fa-solid ${type.icon}`}></i>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={generatePrompt}
            disabled={loading || (!topic.trim() && !attachment)}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
            {loading ? 'جاري التصميم...' : 'توليد الأمر الاحترافي'}
          </button>

          {result && (
            <div className="mt-8 animate-in fade-in zoom-in duration-500">
              <div className="flex items-center justify-between mb-3 px-2">
                <span className="text-sm font-bold text-slate-500">الأمر الاحترافي المولد:</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(result);
                    alert('تم نسخ الأمر بنجاح!');
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <i className="fa-solid fa-copy"></i>
                  نسخ الأمر
                </button>
              </div>
              <div className={`bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-slate-800 leading-relaxed whitespace-pre-wrap ${/[\u0600-\u06FF]/.test(result) ? 'text-right' : 'text-left'}`}>
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPromptGenerator;
