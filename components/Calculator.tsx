
import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface Props {
  lang: Language;
}

const Calculator: React.FC<Props> = ({ lang }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [shouldReset, setShouldReset] = useState(false);
  const t = translations[lang].calculator;

  const handleNumber = (num: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setShouldReset(true);
  };

  const handleEqual = () => {
    try {
      const fullEquation = equation + display;
      const result = new Function(`return ${fullEquation.replace('×', '*').replace('÷', '/')}`)();
      setDisplay(Number.isInteger(result) ? result.toString() : result.toFixed(2).toString());
      setEquation('');
      setShouldReset(true);
    } catch (e) {
      setDisplay(lang === 'ar' ? 'خطأ' : 'Error');
      setEquation('');
      setShouldReset(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setShouldReset(false);
  };

  const deleteLast = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const buttons = [
    { label: 'AC', action: clear, type: 'special' },
    { label: 'DEL', action: deleteLast, type: 'special' },
    { label: '%', action: () => setDisplay((parseFloat(display)/100).toString()), type: 'special' },
    { label: '÷', action: () => handleOperator('÷'), type: 'operator' },
    { label: '7', action: () => handleNumber('7'), type: 'number' },
    { label: '8', action: () => handleNumber('8'), type: 'number' },
    { label: '9', action: () => handleNumber('9'), type: 'number' },
    { label: '×', action: () => handleOperator('×'), type: 'operator' },
    { label: '4', action: () => handleNumber('4'), type: 'number' },
    { label: '5', action: () => handleNumber('5'), type: 'number' },
    { label: '6', action: () => handleNumber('6'), type: 'number' },
    { label: '-', action: () => handleOperator('-'), type: 'operator' },
    { label: '1', action: () => handleNumber('1'), type: 'number' },
    { label: '2', action: () => handleNumber('2'), type: 'number' },
    { label: '3', action: () => handleNumber('3'), type: 'number' },
    { label: '+', action: () => handleOperator('+'), type: 'operator' },
    { label: '0', action: () => handleNumber('0'), type: 'number', wide: true },
    { label: '.', action: () => handleNumber('.'), type: 'number' },
    { label: '=', action: handleEqual, type: 'equal' },
  ];

  return (
    <div className="max-w-md mx-auto py-10">
      <div className="bg-slate-900 rounded-[3rem] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-[12px] border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
        <div className={`mb-10 px-4 py-8 min-h-[180px] flex flex-col justify-end ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="text-slate-500 text-xl mb-4 font-bold h-7 opacity-60">
            {equation}
          </div>
          <div className="text-white text-7xl font-light tracking-tighter">
            {display}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.action}
              className={`h-18 md:h-20 rounded-2xl font-black text-2xl transition-all active:scale-90 flex items-center justify-center
                ${btn.wide ? 'col-span-2' : ''}
                ${btn.type === 'number' ? 'bg-slate-800 text-white hover:bg-slate-700' : ''}
                ${btn.type === 'operator' ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg' : ''}
                ${btn.type === 'special' ? 'bg-slate-700/50 text-indigo-400 hover:bg-slate-700' : ''}
                ${btn.type === 'equal' ? 'bg-white text-slate-900 hover:bg-indigo-50 shadow-xl' : ''}
              `}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
      <div className={`mt-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
        <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
          <i className="fa-solid fa-lightbulb text-amber-500"></i>
          {t.tip}
        </h4>
        <p className="text-sm text-slate-500 leading-relaxed">{t.tipDesc}</p>
      </div>
    </div>
  );
};

export default Calculator;
