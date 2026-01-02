
import React, { useState, useEffect } from 'react';
import { ToolType, PageType, Tool, Language } from './types';
import { translations } from './translations';
import GPACalculator from './components/GPACalculator';
import BMICalculator from './components/BMICalculator';
import PDFCompressor from './components/PDFCompressor';
import StudyTimer from './components/StudyTimer';
import AIPromptGenerator from './components/AIPromptGenerator';
import Calculator from './components/Calculator';
import TermsOfUse from './components/TermsOfUse';
import PrivacyPolicy from './components/PrivacyPolicy';

const TOOLS: Tool[] = [
  { 
    id: ToolType.GPA, 
    title: { ar: 'حاسبة المعدل التراكمي', en: 'GPA Calculator' }, 
    description: { ar: 'حلل أداءك الأكاديمي وحساب معدلك بدقة متناهية.', en: 'Analyze your academic performance and calculate your GPA precisely.' }, 
    icon: 'fa-graduation-cap', 
    category: { ar: 'حاسبات', en: 'Calculators' } 
  },
  { 
    id: ToolType.BMI, 
    title: { ar: 'حاسبة كتلة الجسم', en: 'BMI Calculator' }, 
    description: { ar: 'راقب صحتك البدنية من خلال مؤشرات علمية دقيقة.', en: 'Monitor your physical health through accurate scientific indicators.' }, 
    icon: 'fa-weight-scale', 
    category: { ar: 'حاسبات', en: 'Calculators' } 
  },
  { 
    id: ToolType.CALCULATOR, 
    title: { ar: 'آلة حاسبة ذكية', en: 'Smart Calculator' }, 
    description: { ar: 'إجراء العمليات الحسابية المعقدة بلمح البصر.', en: 'Perform complex calculations in a blink of an eye.' }, 
    icon: 'fa-calculator', 
    category: { ar: 'حاسبات', en: 'Calculators' } 
  },
  { 
    id: ToolType.PDF, 
    title: { ar: 'ضغط ملفات PDF', en: 'PDF Compressor' }, 
    description: { ar: 'تحسين حجم مستنداتك دون التضحية بالجودة الأصلية.', en: 'Optimize your document size without sacrificing quality.' }, 
    icon: 'fa-file-pdf', 
    category: { ar: 'أدوات ملفات', en: 'PDF Tools' } 
  },
  { 
    id: ToolType.TIMER, 
    title: { ar: 'مؤقت التركيز', en: 'Focus Timer' }, 
    description: { ar: 'ضاعف إنتاجيتك باستخدام تقنية Pomodoro العالمية.', en: 'Double your productivity using the global Pomodoro technique.' }, 
    icon: 'fa-stopwatch', 
    category: { ar: 'عدادات', en: 'Timers' } 
  },
  { 
    id: ToolType.AI_PROMPT, 
    title: { ar: 'مولد الأوامر (AI)', en: 'AI Prompt Generator' }, 
    description: { ar: 'أطلق العنان لقوة الذكاء الاصطناعي عبر صياغة أوامر احترافية.', en: 'Unleash AI power by crafting professional prompts.' }, 
    icon: 'fa-magic', 
    category: { ar: 'ذكاء اصطناعي', en: 'AI' } 
  },
];

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [activeTool, setActiveTool] = useState<ToolType | null>(null);
  const [activePage, setActivePage] = useState<PageType | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => setLang(l => l === 'ar' ? 'en' : 'ar');

  const navigateToHome = () => {
    setActiveTool(null);
    setActivePage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (activePage === PageType.TERMS) return <TermsOfUse />;
    if (activePage === PageType.PRIVACY) return <PrivacyPolicy />;

    switch (activeTool) {
      case ToolType.GPA: return <GPACalculator lang={lang} />;
      case ToolType.BMI: return <BMICalculator />;
      case ToolType.CALCULATOR: return <Calculator lang={lang} />;
      case ToolType.PDF: return <PDFCompressor />;
      case ToolType.TIMER: return <StudyTimer />;
      case ToolType.AI_PROMPT: return <AIPromptGenerator />;
      default: return (
        <div className="space-y-24">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 group card-hover transition-all duration-300 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
              >
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                  <i className={`fa-solid ${tool.icon}`}></i>
                </div>
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3 block px-3 py-1 bg-indigo-50/50 rounded-full w-fit">{tool.category[lang]}</span>
                <h3 className="text-2xl font-black mb-3 text-slate-900 tracking-tight">{tool.title[lang]}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">{tool.description[lang]}</p>
                <div className={`pt-4 border-t border-slate-50 flex items-center text-indigo-600 font-bold text-sm`}>
                  <span>{t.startNow}</span>
                  <i className={`fa-solid ${lang === 'ar' ? 'fa-chevron-left mr-2 group-hover:mr-4' : 'fa-chevron-right ml-2 group-hover:ml-4'} transition-all`}></i>
                </div>
              </button>
            ))}
          </section>
        </div>
      );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-white ${lang === 'en' ? 'font-sans' : ''}`}>
      {/* How It Works Modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setShowHowItWorks(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-start mb-10">
                <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">{t.howModalTitle}</h3>
                  <p className="text-slate-500 font-medium mt-2">{t.howModalDesc}</p>
                </div>
                <button onClick={() => setShowHowItWorks(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div className="space-y-8">
                {t.howSteps.map((item: any, idx: number) => (
                  <div key={idx} className={`flex gap-6 items-start group ${lang === 'ar' ? '' : 'flex-row-reverse text-right'}`}>
                    <div className="flex-grow">
                      <div className={`flex items-center gap-2 mb-1 ${lang === 'ar' ? 'justify-start' : 'justify-end'}`}>
                        <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">{lang === 'ar' ? `الخطوة ${idx+1}` : `Step ${idx+1}`}</span>
                      </div>
                      <h4 className="text-xl font-black text-slate-900">{item.title}</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                    </div>
                    <div className={`w-14 h-14 shrink-0 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                      <i className={`fa-solid ${idx === 0 ? 'fa-hand-pointer' : idx === 1 ? 'fa-keyboard' : 'fa-circle-check'}`}></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <header className={`sticky top-0 z-[100] w-full transition-all duration-300 ${scrolled ? 'glass-effect border-b border-slate-100 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center">
            <button onClick={navigateToHome} className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 group-hover:rotate-12 transition-transform">
                <i className="fa-solid fa-layer-group text-xl"></i>
              </div>
              <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                <h1 className="text-xl font-black tracking-tighter text-slate-900 leading-none">
                   {lang === 'ar' ? 'أدوات' : 'Adwat'} <span className="text-indigo-600">{lang === 'ar' ? 'أونلاين' : 'Online'}</span>
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">PRO TOOLS HUB</p>
              </div>
            </button>
            
            <nav className="hidden md:flex items-center bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
              <button onClick={navigateToHome} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!activeTool && !activePage ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-indigo-600'}`}>{t.home}</button>
              <button onClick={() => setLang(l => l === 'ar' ? 'en' : 'ar')} className="px-6 py-2 rounded-full text-sm font-black text-indigo-600 hover:bg-indigo-50 transition-all uppercase tracking-widest">
                {lang === 'ar' ? 'EN' : 'العربية'}
              </button>
            </nav>
            
            <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100" onClick={toggleLanguage}>
              <i className="fa-solid fa-language text-indigo-600"></i>
            </button>
          </div>
        </div>
      </header>

      {!activeTool && !activePage && (
        <section className="hero-gradient pt-24 pb-32 px-6 overflow-hidden relative">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-8 animate-bounce">
              {t.heroBadge}
            </div>
            <h2 className="text-5xl md:text-8xl font-black mb-8 text-slate-900 tracking-tighter leading-tight">
              {t.heroTitle} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">{t.heroTitleAccent}</span>
            </h2>
            <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
              {t.heroDesc}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button onClick={() => window.scrollTo({top: 800, behavior: 'smooth'})} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all">
                {t.exploreBtn}
              </button>
              <button onClick={() => setShowHowItWorks(true)} className="flex items-center gap-4 text-slate-400 hover:text-indigo-600 font-bold px-6 py-4 transition-colors group">
                <i className="fa-solid fa-circle-play text-indigo-600 text-3xl group-hover:scale-110 transition-transform"></i>
                <span>{t.howItWorksBtn}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 sm:px-8 py-20">
        {(activeTool || activePage) && (
          <div className="mb-16">
            <button onClick={navigateToHome} className={`inline-flex items-center text-slate-400 hover:text-indigo-600 transition-colors font-bold mb-6 group`}>
              <i className={`fa-solid ${lang === 'ar' ? 'fa-arrow-right ml-2 group-hover:ml-4' : 'fa-arrow-left mr-2 group-hover:mr-4'} transition-all`}></i>
              {t.backToHome}
            </button>
          </div>
        )}
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          {renderContent()}
        </div>
      </main>

      <footer className="bg-slate-900 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                <i className="fa-solid fa-layer-group"></i>
              </div>
              <h3 className="text-2xl font-black">{t.brand}</h3>
            </div>
            <p className={`max-w-md text-slate-400 leading-relaxed font-medium mb-10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              {t.footerDesc}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-indigo-400">{lang === 'ar' ? 'الأدوات' : 'Tools'}</h4>
            <ul className="space-y-4 font-medium text-slate-400">
              {TOOLS.slice(0, 4).map(tool => (
                <li key={tool.id}><button onClick={() => setActiveTool(tool.id)} className="hover:text-white transition-colors">/ {tool.title[lang]}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-indigo-400">{lang === 'ar' ? 'المساعدة' : 'Support'}</h4>
            <ul className="space-y-4 font-medium text-slate-400">
              <li><button onClick={() => setLang(l => l === 'ar' ? 'en' : 'ar')} className="hover:text-white transition-colors">{lang === 'ar' ? 'English Version' : 'النسخة العربية'}</button></li>
              <li><button onClick={() => setActivePage(PageType.PRIVACY)} className="hover:text-white transition-colors">{t.privacy}</button></li>
              <li><button onClick={() => setActivePage(PageType.TERMS)} className="hover:text-white transition-colors">{t.terms}</button></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
