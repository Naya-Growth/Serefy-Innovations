import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Metrics() {
  const { t } = useLanguage();
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [eggCapacity, setEggCapacity] = useState(200);
  const [chickPrice, setChickPrice] = useState(35);

  // Math for ROI Calculator
  const traditionalHatch = Math.round(eggCapacity * 0.60);
  const sereHatch = Math.round(eggCapacity * 0.90);
  const extraChicks = sereHatch - traditionalHatch;

  const monthlyUpside = extraChicks * chickPrice;
  const monthlyEggSavings = Math.round(eggCapacity * 0.30 * 10); // 30% difference in hatch, Rs. 10 per egg
  const totalMonthlyImpact = monthlyUpside + monthlyEggSavings;
  const totalYearlyImpact = totalMonthlyImpact * 12;

  return (
    <div className="pt-24 pb-32 min-h-screen bg-white">

      {/* Header Section */}
      <header className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[9px] font-black tracking-[0.4em] uppercase bg-black text-white rounded-xl shadow-lg">
              Performance Analysis
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter leading-tight mb-6">
              {t('metrics.title')}
            </h1>
            <p className="text-base md:text-lg text-black font-black leading-relaxed">
              {t('metrics.desc')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 xs:gap-4 animate-in fade-in slide-in-from-right-8 duration-1000">
            <Link
              to="/contact"
              className="bg-green-700 text-white px-4 xs:px-5 sm:px-6 md:px-8 py-2.5 xs:py-3 sm:py-3.5 md:py-4 rounded-xl xs:rounded-2xl font-black text-[9px] xs:text-[10px] sm:text-[11px] md:text-[11px] uppercase tracking-widest shadow-xl shadow-green-700/20 hover:-translate-y-1 hover:scale-[1.02] transition-all active:scale-95 text-center flex items-center justify-center cursor-pointer"
            >
              Request a Demo
            </Link>
            <a
              href="/media/Competitors/sere%20innovations%20KIT%20pitch%20deck..pptx.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-950 text-white px-4 xs:px-5 sm:px-6 md:px-8 py-2.5 xs:py-3 sm:py-3.5 md:py-4 rounded-xl xs:rounded-2xl font-black text-[9px] xs:text-[10px] sm:text-[11px] md:text-[11px] uppercase tracking-widest shadow-xl shadow-green-950/20 hover:-translate-y-1 hover:scale-[1.02] transition-all active:scale-95 text-center flex items-center justify-center cursor-pointer"
            >
              Download Report
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-12">

        {/* Model Comparison & Efficiency Delta Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <section className="lg:col-span-8 bg-green-50/30 rounded-[2rem] p-8 md:p-10 border border-green-100 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-2xl font-black text-black mb-10 tracking-tight underline decoration-green-500/30 underline-offset-8">{t('metrics.compare.title')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-black">
                    <th className="pb-4 pl-2 md:pl-6">Feature</th>
                    <th className="pb-4 text-center">Traditional</th>
                    <th className="pb-4 text-center">Competitors</th>
                    <th className="pb-4 text-center text-green-700">SERE</th>
                  </tr>
                </thead>
                <tbody className="space-y-4 text-center">
                  <tr className="bg-white rounded-3xl overflow-hidden shadow-sm group hover:shadow-md transition-shadow">
                    <td className="p-6 text-left font-black text-black text-xs uppercase tracking-widest">Hatch Rate</td>
                    <td className="p-6 font-black text-black opacity-40">~60%</td>
                    <td className="p-6 font-black text-black opacity-40">75% - 80%</td>
                    <td className="p-6 font-black text-green-700">✅ 90%+</td>
                  </tr>
                  <tr className="bg-white rounded-3xl overflow-hidden shadow-sm">
                    <td className="p-6 text-left font-black text-black text-xs uppercase tracking-widest">Operation</td>
                    <td className="p-6 font-black text-black opacity-40">Manual Guesswork</td>
                    <td className="p-6 font-black text-black opacity-40">Semi-Automatic</td>
                    <td className="p-6 font-black text-green-700">Plug & Play AI</td>
                  </tr>
                  <tr className="bg-white rounded-3xl overflow-hidden shadow-sm">
                    <td className="p-6 text-left font-black text-black text-xs uppercase tracking-widest">Monitoring</td>
                    <td className="p-6 font-black text-black opacity-40">Constant Presence</td>
                    <td className="p-6 font-black text-black opacity-40">Dials & Switches</td>
                    <td className="p-6 font-black text-green-700">Automated Sensors</td>
                  </tr>
                  <tr className="bg-white rounded-3xl overflow-hidden shadow-sm">
                    <td className="p-6 text-left font-black text-black text-xs uppercase tracking-widest">Yield Risk</td>
                    <td className="p-6 font-black text-black opacity-60">High (Volatility)</td>
                    <td className="p-6 font-black text-black opacity-40">Moderate</td>
                    <td className="p-6 font-black text-green-700 font-black">Zero Variance</td>
                  </tr>
                  <tr className="bg-white rounded-3xl overflow-hidden shadow-sm">
                    <td className="p-6 text-left font-black text-black text-xs uppercase tracking-widest">Build Quality</td>
                    <td className="p-6 font-black text-black opacity-40">Basic/Open</td>
                    <td className="p-6 font-black text-black opacity-40">Industrial Metal</td>
                    <td className="p-6 font-black text-green-700 text-sm">Aerospace Insulation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Right: Efficiency Delta Card from Screenshot */}
          <aside className="lg:col-span-4 bg-green-900 rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full"></div>
            <h3 className="text-xl font-black mb-10 tracking-tight">Efficiency Delta</h3>
            <div className="space-y-8 md:space-y-12">
              <div>
                <div className="flex justify-between items-end mb-3">
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white">SERE Tech</p>
                  <p className="text-2xl md:text-3xl font-black text-green-400">90%</p>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[90%] bg-green-500 rounded-full shadow-lg shadow-green-500/40"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-3">
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white">Traditional</p>
                  <p className="text-2xl md:text-3xl font-black text-white">60%</p>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[60%] bg-white/40 rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="mt-16 text-sm italic text-white leading-relaxed font-black opacity-90">
              "The 30% delta represents the difference between breaking even and consistent profitability."
            </p>
          </aside>
        </div>

        {/* ROI Intelligence Section from Screenshot */}
        <section className="bg-white rounded-[2rem] p-8 md:p-12 border border-green-100 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-black text-black mb-4 tracking-tighter">{t('metrics.roi.title')}</h2>
              <p className="text-black font-black mb-12 opacity-80 leading-relaxed">Our data reflects the real-world performance of deployed units.</p>

              <div className="space-y-6">
                <div className="bg-green-50/50 p-6 rounded-3xl flex items-center gap-6 group hover:bg-green-50 hover:scale-[1.02] transition-all">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-700">payments</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-black uppercase tracking-widest">Year 1 Savings</p>
                    <p className="text-xl font-black text-black">₹50,000+</p>
                  </div>
                </div>
                <div className="bg-green-50/50 p-6 rounded-3xl flex items-center gap-6 group hover:bg-green-50 hover:scale-[1.02] transition-all">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-700">trending_up</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-black uppercase tracking-widest">Profit Growth</p>
                    <p className="text-xl font-black text-black">32% Increase</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50/50 rounded-[2rem] p-10 border border-green-100 flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-black text-black uppercase tracking-[0.3em] mb-4">Financial Summary</p>
              <h3 className="text-6xl font-black text-black mb-2 tracking-tighter">₹50K</h3>
              <p className="text-black font-black mb-8 opacity-90 text-lg">Net Impact in 12 Months</p>

              <div className="grid grid-cols-2 gap-8 w-full border-t border-green-200 pt-8 mb-10">
                <div>
                  <p className="text-[9px] font-black text-black uppercase mb-1">Hatchery Cost Savings</p>
                  <p className="text-black font-black text-lg">- ₹18,400</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-black uppercase mb-1">Production Upside</p>
                  <p className="text-green-700 font-black text-lg">+ ₹68,400</p>
                </div>
              </div>

              <button
                onClick={() => setIsCalcOpen(true)}
                className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-green-600/20 hover:brightness-110 hover:scale-[1.02] transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">calculate</span>
                Calculate Your Specific Savings
              </button>
            </div>
          </div>
        </section>

      </main>

      <AnimatePresence>
        {isCalcOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={() => setIsCalcOpen(false)}></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 flex flex-col overflow-hidden border border-green-100 max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-green-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-700">calculate</span>
                  <h3 className="font-headline text-lg font-black text-black uppercase tracking-wider">ROI Calculator</h3>
                </div>
                <button
                  onClick={() => setIsCalcOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-green-50 flex items-center justify-center text-black/50 hover:text-black transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                {/* Slider 1: Egg Capacity */}
                <div className="space-y-2">
                  <div className="flex justify-between font-black text-xs uppercase tracking-wider text-black">
                    <span>Egg Capacity</span>
                    <span className="text-green-700">{eggCapacity} Eggs</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="50"
                    value={eggCapacity}
                    onChange={(e) => setEggCapacity(Number(e.target.value))}
                    className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer accent-green-700"
                  />
                  <div className="flex justify-between text-[10px] text-black/40 font-bold">
                    <span>50 Eggs</span>
                    <span>2,000 Eggs</span>
                  </div>
                </div>

                {/* Slider 2: Chick Sale Price */}
                <div className="space-y-2">
                  <div className="flex justify-between font-black text-xs uppercase tracking-wider text-black">
                    <span>Average Chick Price</span>
                    <span className="text-green-700">₹{chickPrice} / Chick</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="100"
                    step="5"
                    value={chickPrice}
                    onChange={(e) => setChickPrice(Number(e.target.value))}
                    className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer accent-green-700"
                  />
                  <div className="flex justify-between text-[10px] text-black/40 font-bold">
                    <span>₹15</span>
                    <span>₹100</span>
                  </div>
                </div>

                {/* Hatch Rate Comparison Cards */}
                <div className="grid grid-cols-2 gap-4 bg-green-50/50 p-4 rounded-2xl border border-green-100">
                  <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                    <p className="text-[9px] font-black text-black/40 uppercase mb-1">Traditional (60%)</p>
                    <p className="text-2xl font-black text-black">{traditionalHatch}</p>
                    <p className="text-[9px] text-black/40 font-bold">Chicks Hatched</p>
                  </div>
                  <div className="text-center p-3 bg-green-700 text-white rounded-xl shadow-sm">
                    <p className="text-[9px] font-black text-white/60 uppercase mb-1">SERE (90%)</p>
                    <p className="text-2xl font-black text-white">{sereHatch}</p>
                    <p className="text-[9px] text-white/80 font-bold">Chicks Hatched</p>
                  </div>
                </div>

                {/* Results Section */}
                <div className="border-t border-green-100 pt-6 space-y-4">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-black/60">Extra Chicks Hatched</span>
                    <span className="text-green-700 font-black">+{extraChicks} Chicks / batch</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-black/60">Egg Loss Savings</span>
                    <span className="text-green-700 font-black">₹{monthlyEggSavings.toLocaleString('en-IN')} / batch</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-black/60">Est. Profit Upside</span>
                    <span className="text-green-700 font-black">₹{monthlyUpside.toLocaleString('en-IN')} / batch</span>
                  </div>

                  {/* Highlight Box */}
                  <div className="bg-green-900 text-white p-5 rounded-2xl text-center space-y-1 shadow-lg">
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-300">Total Est. Yearly Impact</p>
                    <p className="text-4xl font-black text-white">₹{totalYearlyImpact.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] font-medium text-white/70">Based on standard 12 batches per year</p>
                  </div>
                </div>
              </div>

              {/* Footer Button */}
              <div className="p-6 bg-green-50 border-t border-green-100 flex gap-4">
                <Link
                  to="/contact"
                  className="w-full text-center bg-green-700 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-700/10 cursor-pointer"
                  onClick={() => setIsCalcOpen(false)}
                >
                  Get Started With SERE
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
