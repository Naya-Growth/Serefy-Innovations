import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import SectionWrapper from '../components/SectionWrapper';

export default function Blog() {
  const { t } = useLanguage();

  return (
    <div className="bg-surface text-on-surface font-body antialiased selection:bg-primary/20 min-h-screen">
      <SectionWrapper className="w-full py-20 xs:py-24 sm:py-28 md:py-32 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 bg-[#fbfbfa]">
        <div className="max-w-screen-xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/40 border border-emerald-300/30 text-emerald-800 text-xs font-black uppercase tracking-[0.15em] mb-6">
            Coming Soon
          </span>
          <h1 className="font-headline text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            {t('nav.blog')}
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Insights, tutorials, and updates about smart poultry farming and precision incubation technology. Powered by ContentOS.
          </p>
        </div>
      </SectionWrapper>
    </div>
  );
}
