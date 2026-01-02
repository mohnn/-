
import React, { useState, useEffect, useRef } from 'react';

const StudyTimer: React.FC = () => {
  const [studyMinutes, setStudyMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const [sessionCount, setSessionCount] = useState(0);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (mode === 'study') {
        setMode('break');
        setTimeLeft(breakMinutes * 60);
        setSessionCount(prev => prev + 1);
        alert('وقت الاستراحة! أحسنت العمل.');
      } else {
        setMode('study');
        setTimeLeft(studyMinutes * 60);
        alert('عد للدراسة، أنت تستطيع!');
      }
      setIsActive(false);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode, studyMinutes, breakMinutes]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'study' ? studyMinutes * 60 : breakMinutes * 60);
  };

  const updateStudyTime = (mins: number) => {
    setStudyMinutes(mins);
    if (mode === 'study' && !isActive) {
      setTimeLeft(mins * 60);
    }
  };

  const updateBreakTime = (mins: number) => {
    setBreakMinutes(mins);
    if (mode === 'break' && !isActive) {
      setTimeLeft(mins * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const maxSeconds = mode === 'study' ? studyMinutes * 60 : breakMinutes * 60;
  const progress = (timeLeft / maxSeconds) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center">
        {/* Settings Inputs */}
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm mx-auto">
          <div className="text-right">
            <label className="block text-xs font-bold text-slate-500 mb-1 px-1">وقت الدراسة (د)</label>
            <input 
              type="number" min="1" max="120"
              value={studyMinutes}
              onChange={(e) => updateStudyTime(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="text-right">
            <label className="block text-xs font-bold text-slate-500 mb-1 px-1">وقت الراحة (د)</label>
            <input 
              type="number" min="1" max="60"
              value={breakMinutes}
              onChange={(e) => updateBreakTime(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => { setMode('study'); setTimeLeft(studyMinutes * 60); setIsActive(false); }}
            className={`px-6 py-2 rounded-full font-bold transition-all ${mode === 'study' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
          >
            تركيز
          </button>
          <button 
            onClick={() => { setMode('break'); setTimeLeft(breakMinutes * 60); setIsActive(false); }}
            className={`px-6 py-2 rounded-full font-bold transition-all ${mode === 'break' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
          >
            استراحة
          </button>
        </div>

        <div className="relative w-64 h-64 mx-auto mb-10">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-100"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={754}
              strokeDashoffset={754 - (754 * progress) / 100}
              className={`${mode === 'study' ? 'text-indigo-600' : 'text-emerald-500'} transition-all duration-1000 ease-linear`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-black text-slate-800 tabular-nums">{formatTime(timeLeft)}</span>
            <span className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-widest">
              {mode === 'study' ? 'وقت التركيز' : 'وقت الراحة'}
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={toggleTimer}
            className={`w-40 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${isActive ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'}`}
          >
            <i className={`fa-solid ${isActive ? 'fa-pause' : 'fa-play'}`}></i>
            {isActive ? 'إيقاف مؤقت' : 'ابدأ الآن'}
          </button>
          <button 
            onClick={resetTimer}
            className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all flex items-center justify-center text-xl"
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-3 text-slate-400">
          <div className="h-px bg-slate-200 flex-grow max-w-[50px]"></div>
          <div className="flex items-center gap-2 text-sm font-bold">
            <i className="fa-solid fa-fire text-orange-500"></i>
            الجلسات المكتملة اليوم: {sessionCount}
          </div>
          <div className="h-px bg-slate-200 flex-grow max-w-[50px]"></div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;
