
import React, { useState, useEffect } from 'react';
import { GPARow, Language } from '../types';
import { translations } from '../translations';

interface Props {
  lang: Language;
}

const GPACalculator: React.FC<Props> = ({ lang }) => {
  const [rows, setRows] = useState<GPARow[]>([
    { id: '1', grade: 'A', credits: 3 },
    { id: '2', grade: 'B+', credits: 3 },
  ]);
  const [currentGPA, setCurrentGPA] = useState<number>(0);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const t = translations[lang].gpa;

  const gradeValues: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };

  useEffect(() => {
    let totalPoints = 0;
    let credits = 0;
    rows.forEach(row => {
      const val = gradeValues[row.grade] || 0;
      totalPoints += val * row.credits;
      credits += row.credits;
    });
    setTotalCredits(credits);
    setCurrentGPA(credits > 0 ? parseFloat((totalPoints / credits).toFixed(2)) : 0);
  }, [rows]);

  const addRow = () => setRows([...rows, { id: Math.random().toString(), grade: 'A', credits: 3 }]);
  const removeRow = (id: string) => rows.length > 1 && setRows(rows.filter(r => r.id !== id));
  const updateRow = (id: string, field: keyof GPARow, value: string | number) => 
    setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));

  const getStatus = () => {
    if (lang === 'ar') {
      return currentGPA >= 3.7 ? 'ممتاز' : currentGPA >= 3.0 ? 'جيد جداً' : currentGPA >= 2.0 ? 'جيد' : 'مقبول';
    }
    return currentGPA >= 3.7 ? 'Excellent' : currentGPA >= 3.0 ? 'Very Good' : currentGPA >= 2.0 ? 'Good' : 'Fair';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-indigo-600 text-white p-8 rounded-3xl flex flex-col items-center justify-center shadow-xl shadow-indigo-100">
            <span className="text-xs font-black uppercase tracking-widest opacity-70 mb-2">{t.termGpa}</span>
            <span className="text-5xl font-black">{currentGPA}</span>
          </div>
          <div className="bg-slate-50 text-slate-800 p-8 rounded-3xl flex flex-col items-center justify-center border border-slate-100">
            <span className="text-xs font-black uppercase tracking-widest opacity-50 mb-2">{t.totalCredits}</span>
            <span className="text-4xl font-black">{totalCredits}</span>
          </div>
          <div className="bg-emerald-50 text-emerald-700 p-8 rounded-3xl flex flex-col items-center justify-center border border-emerald-100">
            <span className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">{t.expectedGrade}</span>
            <span className="text-3xl font-black">{getStatus()}</span>
          </div>
        </div>

        <div className="space-y-4">
          {rows.map((row, idx) => (
            <div key={row.id} className={`flex flex-wrap md:flex-nowrap items-center gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">{t.courseName}</label>
                <input type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold" />
              </div>
              <div className="w-32">
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">{t.grade}</label>
                <select value={row.grade} onChange={(e) => updateRow(row.id, 'grade', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 font-bold">
                  {Object.keys(gradeValues).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">{t.credits}</label>
                <input type="number" value={row.credits} onChange={(e) => updateRow(row.id, 'credits', parseInt(e.target.value) || 0)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 font-bold" />
              </div>
              <button onClick={() => removeRow(row.id)} className="mt-6 w-12 h-12 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          ))}
        </div>

        <button onClick={addRow} className="w-full mt-8 py-5 border-2 border-dashed border-slate-200 text-slate-400 rounded-3xl hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all font-black flex items-center justify-center gap-3">
          <i className="fa-solid fa-plus-circle text-xl"></i>
          {t.addCourse}
        </button>
      </div>
    </div>
  );
};

export default GPACalculator;
