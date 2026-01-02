
import React, { useState, useEffect } from 'react';

const BMICalculator: React.FC = () => {
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(175);
  const [bmi, setBmi] = useState<number>(0);
  const [status, setStatus] = useState<string>('');
  const [color, setColor] = useState<string>('');

  useEffect(() => {
    const heightInMeters = height / 100;
    const calculatedBmi = weight / (heightInMeters * heightInMeters);
    setBmi(parseFloat(calculatedBmi.toFixed(1)));

    if (calculatedBmi < 18.5) {
      setStatus('نقص في الوزن');
      setColor('text-blue-500 bg-blue-50');
    } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
      setStatus('وزن مثالي');
      setColor('text-emerald-500 bg-emerald-50');
    } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
      setStatus('وزن زائد');
      setColor('text-amber-500 bg-amber-50');
    } else {
      setStatus('سمنة');
      setColor('text-rose-500 bg-rose-50');
    }
  }, [weight, height]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">الوزن (كجم)</label>
            <div className="relative">
              <input 
                type="range" min="30" max="200" value={weight} 
                onChange={(e) => setWeight(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between mt-4">
                <span className="bg-indigo-50 text-indigo-700 font-bold px-4 py-2 rounded-xl border border-indigo-100">
                  {weight} كجم
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">الطول (سم)</label>
            <div className="relative">
              <input 
                type="range" min="100" max="250" value={height} 
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between mt-4">
                <span className="bg-indigo-50 text-indigo-700 font-bold px-4 py-2 rounded-xl border border-indigo-100">
                  {height} سم
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-10 rounded-3xl text-center border transition-colors duration-500 ${color}`}>
          <span className="block text-sm font-medium uppercase tracking-widest opacity-70 mb-2">مؤشر كتلة الجسم الخاص بك</span>
          <h3 className="text-6xl font-black mb-4">{bmi}</h3>
          <p className="text-2xl font-bold">{status}</p>
        </div>

        <div className="mt-8 grid grid-cols-4 gap-2 text-[10px] md:text-xs font-bold text-center">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-500 border border-blue-100">تحت 18.5</div>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500 border border-emerald-100">18.5 - 25</div>
          <div className="p-2 rounded-lg bg-amber-50 text-amber-500 border border-amber-100">25 - 30</div>
          <div className="p-2 rounded-lg bg-rose-50 text-rose-500 border border-rose-100">فوق 30</div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
