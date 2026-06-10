import { useLanguage } from '../context/LanguageContext';

export default function Technology() {
   const { t } = useLanguage();

   return (
      <div className="pt-16 pb-16 min-h-screen bg-white">

         {/* Hero Section */}
         <section className="max-w-7xl mx-auto px-6 pt-4 pb-10 md:pt-8 md:pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
               <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                  <div className="inline-flex items-center px-3 py-1 mb-4 text-[9px] font-black tracking-widest uppercase bg-black text-white rounded-xl shadow-xl">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                     {t('tech.hero.badge')}
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black text-black tracking-tighter leading-tight mb-4">
                     {t('tech.hero.title')}
                  </h1>
                  <p className="text-base text-black font-black max-w-lg mb-6 leading-relaxed opacity-80">
                     {t('tech.hero.desc')}
                  </p>
                  <button 
                     onClick={() => document.getElementById('explore-tech')?.scrollIntoView({ behavior: 'smooth' })}
                     className="bg-green-700 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-green-700/20 hover:-translate-y-1 hover:scale-[1.02] transition-all active:scale-95 cursor-pointer"
                  >
                     {t('tech.hero.cta')} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
               </div>

               <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000">
                  <div className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl relative">
                     <img className="w-full h-full object-cover" src="/media/sere-120.webp" alt="SERE Incubator" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-3xl shadow-xl border border-green-100 flex items-center gap-4 animate-float">
                     <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-green-700 text-xl">precision_manufacturing</span>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-black uppercase tracking-widest">R&D Precision</p>
                        <p className="text-[8px] font-bold text-black opacity-40">Validated Technology</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Mission Section */}
         <section id="explore-tech" className="max-w-7xl mx-auto px-6 py-16 border-t border-green-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div>
                  <p className="text-green-700 text-[10px] font-black uppercase tracking-[0.3em] mb-4">{t('tech.mission.badge')}</p>
                  <h2 className="text-4xl font-black text-black tracking-tighter">{t('tech.mission.title')}</h2>
               </div>
               <div>
                  <p className="text-lg text-black font-black mb-8 leading-relaxed opacity-80">
                     {t('tech.mission.desc')}
                  </p>
               </div>
            </div>
         </section>
      </div>
   );
}
