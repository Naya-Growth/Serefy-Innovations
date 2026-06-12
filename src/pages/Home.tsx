import React, { useState } from 'react';
import WizardModal, { type WizardFormData } from '../components/WizardModal';
import ThankYouModal from '../components/ThankYouModal';
import { Link } from 'react-router-dom';

import AnimatedTags from '../components/AnimatedTags';
import SectionWrapper from '../components/SectionWrapper';
import GallerySection from '../components/GallerySection';
import LegalModal from '../components/LegalModal';
import { submitSERELead, type SERELeadInput } from '../lib/naya-lead';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Thermometer,
  ShieldCheck,
  User,
  Link as LinkIcon,
  Video,
  Mail,
  Linkedin,
  Youtube,
  Play,
  Facebook,
  Instagram,
  X
} from 'lucide-react';

export default function Home() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [submitName, setSubmitName] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [legalModalOpen, setLegalModalOpen] = useState<'terms' | 'privacy' | 'disclaimer' | null>(null);

  // Simulated Inhouse API function for tracking and submissions
  const trackEvent = async (eventName: string, data: any = {}) => {
    try {
      console.log(`[API TRACKING] ${eventName}:`, data);
      // await fetch('/api/track', { method: 'POST', body: JSON.stringify({ eventName, data }) });
    } catch (e) {
      console.error(e);
    }
  };

  const submitLead = async (data: SERELeadInput) => {
    setLeadError('');
    setIsSubmittingLead(true);

    try {
      await submitSERELead(data);
      trackEvent('lead_submitted', data);
      setSubmitName(data.firstName || 'There');
      setIsThankYouOpen(true);
      return true;
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Lead capture is temporarily unavailable. Please email SERE.connect@gmail.com.';
      setLeadError(message);
      return false;
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleWizardSubmit = async (data: WizardFormData) => {
    trackEvent('wizard_form_submitted', data);
    const ok = await submitLead({
      ...data,
      sourceCta: 'guided_wizard',
    });

    if (ok) {
      setIsWizardOpen(false);
    }
  };

  const handleOpenWizard = (e: React.MouseEvent, source: string) => {
    e.preventDefault();
    setLeadError('');
    trackEvent('wizard_opened', { source });
    setIsWizardOpen(true);
  };

  const handleBottomFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const ok = await submitLead({
      firstName: String(formData.get('first-name') ?? ''),
      lastName: String(formData.get('last-name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      city: String(formData.get('city') ?? ''),
      role: String(formData.get('role') ?? ''),
      message: String(formData.get('message') ?? ''),
      sourceCta: 'bottom_interest_form',
    });

    if (ok) {
      form.reset();
    }
  };

  const { t } = useLanguage();

  return (
    <div className="bg-surface text-on-surface font-body antialiased selection:bg-primary/20 flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <section className="w-full pt-24 md:pt-28 pb-12 md:pb-20 px-6 md:px-12 max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 min-h-[calc(100vh-80px)]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="mb-4">
              <AnimatedTags tags={t('hero.tags').split(',')} />
            </div>

            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] font-black text-on-surface tracking-tight leading-[1.1] mb-6">
              {t('hero.title').split(' ').map((word, i) => (
                <React.Fragment key={i}>
                  {word === 'Efficient' || word === 'Smart' || word === 'कुशल' || word === 'स्मार्ट' || word === 'कार्यक्षम' ? (
                    <span className="text-primary inline-block">
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                  {' '}
                </React.Fragment>
              ))}
            </h1>

            <p className="font-body text-base md:text-lg text-on-surface-variant max-w-xl leading-relaxed mb-8 font-medium whitespace-pre-line">
              {t('hero.tagline')}
            </p>

            <div className="flex flex-col gap-6 w-full sm:w-auto items-center lg:items-start mb-10">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                <a className="btn-primary w-full sm:w-auto justify-center text-on-primary font-label font-black px-8 py-4 rounded-2xl hover:bg-primary-container hover:scale-[1.02] transition-all shadow-xl hover:shadow-primary/30 hover:-translate-y-1 cursor-pointer flex items-center gap-3 text-base" onClick={(e) => handleOpenWizard(e, 'hero_cta')}>
                  {t('hero.cta')} <ArrowRight size={20} />
                </a>
                <Link to="/technology" className="w-full sm:w-auto justify-center text-slate-800 bg-white border border-slate-200 font-label font-black px-8 py-4 rounded-2xl hover:bg-slate-50 hover:scale-[1.02] transition-all shadow-md hover:-translate-y-1 cursor-pointer flex items-center gap-3 text-base">
                  {t('tech.hero.cta')} <ArrowRight size={20} />
                </Link>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-primary font-black text-xs">
                  <CheckCircle2 size={16} />
                  <span className="uppercase tracking-[0.1em]">{t('hero.preorder')}</span>
                </div>
                <p className="text-on-surface-variant font-bold text-xs opacity-70">{t('hero.incubated')}</p>
              </div>
            </div>

            <div className="bg-surface-container/30 backdrop-blur-sm border border-outline-variant/20 p-4 md:p-5 rounded-3xl w-fit shadow-sm">
              <p className="text-[10px] md:text-xs font-black text-primary uppercase tracking-[0.2em] mb-3">{t('hero.capacity')}</p>
              <div className="flex flex-wrap gap-x-6 md:gap-x-10 gap-y-3 justify-center lg:justify-start">
                <div className="flex flex-col group cursor-default">
                  <span className="text-xl md:text-3xl font-black text-on-surface transition-colors group-hover:text-primary">120</span>
                  <span className="text-[8px] md:text-[10px] text-on-surface-variant font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{t('hero.eggs')}</span>
                </div>
                <div className="w-px h-8 md:h-10 bg-outline-variant/30 self-center hidden xs:block"></div>
                <div className="flex flex-col group cursor-default">
                  <span className="text-xl md:text-3xl font-black text-on-surface transition-colors group-hover:text-primary">200</span>
                  <span className="text-[8px] md:text-[10px] text-on-surface-variant font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{t('hero.eggs')}</span>
                </div>
                <div className="w-px h-8 md:h-10 bg-outline-variant/30 self-center hidden xs:block"></div>
                <div className="flex flex-col group cursor-default">
                  <span className="text-xl md:text-3xl font-black text-on-surface transition-colors group-hover:text-primary">500</span>
                  <span className="text-[8px] md:text-[10px] text-on-surface-variant font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{t('hero.eggs')}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-[42%] relative group lg:-ml-12 mt-8 lg:mt-0"
          >
            <div className="absolute -inset-6 bg-primary/10 rounded-[3.5rem] blur-3xl opacity-50 transition-opacity group-hover:opacity-100"></div>
            <div className="relative rounded-[2rem] overflow-hidden border-2 border-outline-variant/20 shadow-xl bg-surface-container transition-all duration-700 hover:scale-[1.02] aspect-square">
              <img alt="Happy Indian poultry farmer" referrerPolicy="no-referrer" className="w-full h-full object-cover object-center" src="/media/indian-farmer-hero.png" />
            </div>
          </motion.div>
        </section>

        {/* 2 & 3. Problem & Solution Overview */}
        <SectionWrapper className="w-full py-16 md:py-24 px-4 md:px-12 bg-surface-container-low border-y border-outline-variant/20" id="problem-solution">
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline text-3xl md:text-5xl font-black text-on-surface mb-6 uppercase tracking-tighter">
                {t('section.problem.allChallenges')}
              </h2>
              <p className="text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto font-medium">
                {t('section.problem.allChallenges.desc')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-xl group-hover:bg-primary/30 transition-all duration-500"></div>
                <img src="/media/sere-120.webp" alt="SERE 120 Capacity Model" className="relative w-full rounded-3xl shadow-2xl border border-primary/20" />

                {/* Solution Pointers - Hidden on mobile/tablet for cleaner layout */}
                <div className="hidden md:flex absolute top-[20%] -left-6 bg-surface p-3 rounded-2xl shadow-lg border border-outline-variant/50 text-sm font-bold items-center gap-2 animate-bounce transition-all hover:scale-[1.02]">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  {t('section.solution.pointer1')}
                </div>
                <div className="hidden md:flex absolute top-[50%] -right-8 bg-surface p-3 rounded-2xl shadow-lg border border-outline-variant/50 text-sm font-bold items-center gap-2 transition-all hover:scale-[1.02]">
                  <span className="w-3 h-3 bg-primary rounded-full"></span>
                  {t('section.solution.pointer2')}
                </div>
                <div className="absolute bottom-4 left-4 right-4 md:bottom-[10%] md:left-4 md:right-auto bg-primary text-on-primary p-3 rounded-2xl shadow-lg font-bold flex items-center justify-center md:justify-start gap-2 text-base md:text-lg transition-all hover:scale-[1.02]">
                  <CheckCircle2 size={20} />
                  {t('section.solution.badge')}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-surface p-6 rounded-3xl border border-outline-variant/30 ambient-shadow hover:-translate-y-1 hover:scale-[1.02] transition-all">
                  <h3 className="font-headline font-bold text-xl mb-2 text-primary">{t('section.solution.plugPlay')}</h3>
                  <p className="text-on-surface-variant">{t('section.solution.plugPlay.desc')}</p>
                </div>
                <div className="bg-surface p-6 rounded-3xl border border-outline-variant/30 ambient-shadow hover:-translate-y-1 hover:scale-[1.02] transition-all">
                  <h3 className="font-headline font-bold text-xl mb-2 text-primary">{t('section.solution.reliableClimate')}</h3>
                  <p className="text-on-surface-variant">{t('section.solution.reliableClimate.desc')}</p>
                </div>
                <div className="bg-surface p-6 rounded-3xl border border-outline-variant/30 ambient-shadow hover:-translate-y-1 hover:scale-[1.02] transition-all">
                  <h3 className="font-headline font-bold text-xl mb-2 text-primary">{t('section.solution.financialIndep')}</h3>
                  <p className="text-on-surface-variant">{t('section.solution.financialIndep.desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* How to Use */}
        <SectionWrapper className="w-full py-20 px-4 md:px-12 bg-surface-container-low border-b border-outline-variant/20 relative overflow-hidden" id="how-to-use">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-40">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
          </div>

          <div className="max-w-screen-xl mx-auto text-center relative z-10">
            <h2 className="font-headline text-3xl md:text-5xl font-black text-on-surface mb-4 tracking-tighter uppercase">{t('section.how.plugPlay')}</h2>
            <p className="text-on-surface-variant font-bold mb-16 tracking-widest uppercase text-xs">{t('section.how.deployDesc')}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {[
                { step: "1", title: t('section.how.step1.title'), desc: t('section.how.step1.desc'), icon: "electric_bolt" },
                { step: "2", title: t('section.how.step2.title'), desc: t('section.how.step2.desc'), icon: "water_drop" },
                { step: "3", title: t('section.how.step3.title'), desc: t('section.how.step3.desc'), icon: "auto_awesome" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="p-10 bg-surface rounded-[2rem] border border-outline-variant/30 shadow-xl shadow-black/5 hover:shadow-primary/10 transition-all group relative overflow-hidden text-left"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="material-symbols-outlined text-8xl text-primary">{item.icon}</span>
                  </div>
                  <div className="w-16 h-16 bg-primary text-on-primary rounded-3xl flex items-center justify-center mb-8 text-2xl font-black shadow-lg shadow-primary/30 group-hover:scale-110 transition-all">
                    {item.step}
                  </div>
                  <h3 className="font-headline font-black text-2xl mb-4 text-on-surface group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-on-surface-variant font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* Market vs SERE Comparison */}
        <SectionWrapper className="w-full pt-20 pb-10 px-4 md:px-12 bg-surface">
          <div className="max-w-screen-lg mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-on-surface mb-4">{t('section.market.loseTitle')}</h2>
              <p className="text-on-surface-variant text-lg">{t('section.market.loseSubtitle')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10">
                <h3 className="text-2xl font-bold text-on-surface/60 mb-6 flex items-center gap-3"><X size={28} /> {t('section.market.traditional')}</h3>
                <ul className="space-y-4 text-on-surface-variant font-medium">
                  <li className="flex items-start gap-2"><span>-</span> <span>{t('section.market.traditional.list1')}</span></li>
                  <li className="flex items-start gap-2"><span>-</span> <span>{t('section.market.traditional.list2')}</span></li>
                  <li className="flex items-start gap-2"><span>-</span> <span>{t('section.market.traditional.list3')}</span></li>
                  <li className="flex items-start gap-2"><span>-</span> <span>{t('section.market.traditional.list4')}</span></li>
                </ul>
              </div>
              <div className="bg-primary/10 p-8 rounded-3xl border border-primary/20">
                <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3"><CheckCircle2 size={28} /> {t('section.market.SERE')}</h3>
                <ul className="space-y-4 text-primary/80 font-medium">
                  <li className="flex items-start gap-2"><span>+</span> <span>{t('section.market.SERE.list1')}</span></li>
                  <li className="flex items-start gap-2"><span>+</span> <span>{t('section.market.SERE.list2')}</span></li>
                  <li className="flex items-start gap-2"><span>+</span> <span>{t('section.market.SERE.list3')}</span></li>
                  <li className="flex items-start gap-2"><span>+</span> <span>{t('section.market.SERE.list4')}</span></li>
                </ul>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* 5. Product Options / Capacity Options */}
        <SectionWrapper className="w-full pt-10 md:pt-14 pb-20 md:pb-32 px-4 md:px-12 bg-surface" id="capacity">
          <div className="max-w-screen-2xl mx-auto">
            <div className="mb-12 md:mb-20 text-center">
              <h2 className="font-headline text-3xl md:text-6xl font-extrabold text-on-surface tracking-tight mb-6">{t('section.infra.title')}</h2>
              <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto">{t('section.infra.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Option 120 */}
              <div className="bg-primary/5 p-6 md:p-10 rounded-3xl border-2 border-primary/20 ambient-shadow flex flex-col h-full hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                <div className="mb-8 md:mb-12">
                  <span className="inline-block px-3 py-1 bg-primary/10 rounded-full font-label text-xs font-bold text-primary tracking-widest uppercase mb-4">{t('section.infra.120.title')}</span>
                  <h3 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface">120<span className="text-lg md:text-xl font-medium text-on-surface-variant ml-2">{t('hero.eggs')}</span></h3>
                </div>
                <p className="font-body text-sm md:text-base text-on-surface-variant mb-8 md:mb-12 flex-grow">
                  {t('section.infra.120.desc')}
                </p>
                <a className="w-full text-center bg-primary text-on-primary font-label font-bold px-6 py-4 rounded-2xl hover:bg-primary-container hover:scale-[1.02] transition-all shadow-lg cursor-pointer" onClick={(e) => handleOpenWizard(e, 'preorder_120')}>
                  {t('hero.cta')}
                </a>
              </div>
              {/* Option 200 */}
              <div className="bg-primary p-6 md:p-10 rounded-3xl ambient-shadow flex flex-col h-full relative overflow-hidden transform md:scale-105 z-10 text-on-primary opacity-90">
                <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none"></div>
                <div className="mb-8 md:mb-12 relative z-10">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full font-label text-xs font-bold text-white tracking-widest uppercase mb-4">{t('section.infra.200.title')}</span>
                  <h3 className="font-headline text-4xl md:text-5xl font-extrabold text-white">200<span className="text-lg md:text-xl font-medium text-white/80 ml-2">{t('hero.eggs')}</span></h3>
                </div>
                <p className="font-body text-sm md:text-base text-white/90 mb-8 md:mb-12 flex-grow relative z-10">
                  {t('section.infra.200.desc')}
                </p>
                <a className="w-full text-center bg-white text-primary font-label font-bold px-6 py-4 rounded-2xl hover:bg-surface-container-low hover:scale-[1.02] transition-all relative z-10 shadow-lg cursor-pointer" onClick={(e) => handleOpenWizard(e, 'preorder_200')}>
                  {t('hero.cta')}
                </a>
              </div>
              {/* Option 500 */}
              <div className="bg-surface-container-lowest p-6 md:p-10 rounded-3xl ghost-border ambient-shadow flex flex-col h-full hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 opacity-90">
                <div className="mb-8 md:mb-12">
                  <span className="inline-block px-3 py-1 bg-surface-container-low rounded-full font-label text-xs font-bold text-primary tracking-widest uppercase mb-4">{t('section.infra.500.title')}</span>
                  <h3 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface">500<span className="text-lg md:text-xl font-medium text-on-surface-variant ml-2">{t('hero.eggs')}</span></h3>
                </div>
                <p className="font-body text-sm md:text-base text-on-surface-variant mb-8 md:mb-12 flex-grow">
                  {t('section.infra.500.desc')}
                </p>
                <a className="w-full text-center bg-surface-container-low text-primary font-label font-bold px-6 py-4 rounded-2xl hover:bg-primary hover:text-on-primary hover:scale-[1.02] transition-all border border-primary/20 cursor-pointer" onClick={(e) => handleOpenWizard(e, 'inquire_500')}>
                  {t('section.infra.inquire.cta')}
                </a>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* 6. Why Trust Sere */}
        <SectionWrapper className="w-full py-20 px-6 md:px-12 bg-surface-container-low border-y border-outline-variant/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>

          <div className="max-w-screen-xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="font-headline text-3xl md:text-5xl font-black text-on-surface mb-4 tracking-tighter">{t('section.trust.title')}</h2>
              <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Cpu, title: t('section.trust.feat1.title'), desc: t('section.trust.feat1.desc') },
                { icon: Thermometer, title: t('section.trust.feat2.title'), desc: t('section.trust.feat2.desc') },
                { icon: ShieldCheck, title: t('section.trust.feat3.title'), desc: t('section.trust.feat3.desc') }
              ].map((feat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group p-8 bg-surface rounded-[2rem] border border-outline-variant/30 shadow-md hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 flex flex-col items-center text-center relative"
                >
                  <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-6 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-500 shadow-sm group-hover:shadow-primary/20">
                    <feat.icon size={32} strokeWidth={2} />
                  </div>
                  <h3 className="font-headline text-xl font-bold mb-3 text-on-surface tracking-tight">{feat.title}</h3>
                  <p className="text-on-surface-variant text-sm font-medium leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* 6.5 Competitors Analysis */}
        <SectionWrapper className="w-full py-16 md:py-24 px-6 md:px-12 bg-surface" id="competitors">
          <div className="max-w-screen-xl mx-auto text-center">
            <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-on-surface mb-6">{t('section.competitors.title')}</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
              {t('section.competitors.desc')}
            </p>
            <a href="/media/Competitors/sere%20innovations%20KIT%20pitch%20deck..pptx.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 btn-primary text-on-primary font-label font-bold px-8 py-4 rounded-2xl hover:bg-primary-container hover:scale-[1.02] transition-all shadow-lg text-lg">
              {t('section.competitors.cta')} <ArrowRight size={20} />
            </a>
          </div>
        </SectionWrapper>

        {/* 7. Team + Supported By */}
        <SectionWrapper className="w-full pt-24 pb-12 px-6 md:px-12 bg-surface" id="team">
          <div className="max-w-screen-xl mx-auto">
            <div className="mb-16">
              <h2 className="font-headline text-4xl font-extrabold text-on-surface mb-12 text-center">{t('section.team.title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto mb-20">
                {/* Vidhya Card */}
                <motion.div whileHover={{ y: -8, scale: 1.02 }} className="group rounded-[2rem] overflow-hidden bg-surface-container-lowest border border-outline-variant/30 ambient-shadow flex flex-col relative transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30">
                  <div className="w-full aspect-square relative overflow-hidden bg-surface-container">
                    <img src="/media/Team-Section/IMG_9667.JPG" alt="Vidhya Gaikwad" className="w-full h-full object-cover object-[80%_center] group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"></div>
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                      <div>
                        <h4 className="font-headline font-extrabold text-3xl text-white mb-1">Vidhya Gaikwad</h4>
                        <p className="text-green-400 font-bold text-xs tracking-[0.2em] uppercase">{t('section.team.vidhya.title')}</p>
                      </div>
                      <a href="https://www.linkedin.com/in/vidhya-gaikwad-402475255" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-green-600 hover:scale-110 transition-all duration-300 shadow-lg border border-white/20">
                        <Linkedin size={22} fill="currentColor" className="ml-0.5" />
                      </a>
                    </div>
                  </div>
                  <div className="p-8 pt-6 flex-grow flex flex-col">
                    <p className="text-on-surface-variant leading-relaxed">
                      {t('section.team.vidhya.desc')}
                    </p>
                  </div>
                </motion.div>

                {/* Aditya Card */}
                <motion.div whileHover={{ y: -8, scale: 1.02 }} className="group rounded-[2rem] overflow-hidden bg-surface-container-lowest border border-outline-variant/30 ambient-shadow flex flex-col relative transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30">
                  <div className="w-full aspect-square relative overflow-hidden bg-surface-container">
                    <img src="/media/Team-Section/IMG_4234.PNG" alt="Aditya Magar" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100"></div>
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                      <div>
                        <h4 className="font-headline font-extrabold text-3xl text-white mb-1">Aditya Magar</h4>
                        <p className="text-green-400 font-bold text-xs tracking-[0.2em] uppercase">{t('section.team.aditya.title')}</p>
                      </div>
                      <a href="https://www.linkedin.com/in/aditya-magar-513b0b2a7" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-green-600 hover:scale-110 transition-all duration-300 shadow-lg border border-white/20">
                        <Linkedin size={22} fill="currentColor" className="ml-0.5" />
                      </a>
                    </div>
                  </div>
                  <div className="p-8 pt-6 flex-grow flex flex-col">
                    <p className="text-on-surface-variant leading-relaxed">
                      {t('section.team.aditya.desc')}
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="pt-12 border-t border-outline-variant/30 text-center">
                <p className="font-label text-xs font-bold text-primary uppercase tracking-widest mb-6">{t('section.team.supported')}</p>
                <div className="flex justify-center items-center">
                  <img src="/media/aic-mahindra.webp" alt="AIC Mahindra" className="h-20 md:h-28 w-auto object-contain transition-all duration-500" />
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Machine Process */}
        <SectionWrapper className="w-full pt-12 pb-24 px-6 md:px-12 bg-surface-container-lowest border-t border-outline-variant/20" id="machine-process">
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline text-4xl font-extrabold text-on-surface mb-4">{t('section.process.title')}</h2>
              <p className="text-on-surface-variant text-lg">{t('section.process.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-3xl overflow-hidden border border-outline-variant/30 aspect-[4/5] bg-surface flex flex-col relative group ambient-shadow hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300">
                <video src="/media/Machine%20process/IMG_4243.MOV" poster="/loading image.PNG" controls className="w-full h-full object-cover"></video>
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white font-bold text-sm tracking-wider uppercase">{t('section.process.loading')}</p>
                </div>
              </div>
              <div className="rounded-3xl overflow-hidden border border-outline-variant/30 aspect-[4/5] bg-surface flex flex-col relative group ambient-shadow hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300">
                <video src="/media/Machine%20process/IMG_4242.MOV" controls className="w-full h-full object-cover"></video>
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white font-bold text-sm tracking-wider uppercase">{t('section.process.incubation')}</p>
                </div>
              </div>
              <div className="rounded-3xl overflow-hidden border border-outline-variant/30 aspect-[4/5] bg-surface flex flex-col relative group ambient-shadow hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300">
                <video src="/media/Machine%20process/IMG_4246.MOV" poster="/media/Assets/Logo/incubation image.jpeg" controls className="w-full h-full object-cover"></video>
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white font-bold text-sm tracking-wider uppercase">{t('section.process.candling')}</p>
                </div>
              </div>
              <div className="rounded-3xl overflow-hidden border border-outline-variant/30 aspect-[4/5] bg-surface flex flex-col relative group ambient-shadow hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300">
                <img src="/media/Machine%20process/IMG_4238.jpg" alt="Machine Process Hatching" className="w-full h-full object-cover object-center" />
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white font-bold text-sm tracking-wider uppercase">{t('section.process.hatching')}</p>
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* 7.5 SereTalks (Media/Resources) */}
        <SectionWrapper className="w-full py-24 px-6 md:px-12 bg-surface border-t border-outline-variant/20" id="seretalks">
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline text-4xl font-extrabold text-on-surface mb-4">{t('section.seretalks.title')}</h2>
              <p className="text-on-surface-variant text-lg">{t('section.seretalks.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { id: 'talk1', title: t('section.seretalks.talk1'), src: '/media/Sere%20talks%20videos/copy_68756C70-6DA7-41F0-9FBA-B6FEA0D93B00.MOV' },
                { id: 'talk2', title: t('section.seretalks.talk2'), src: '/media/Sere%20talks%20videos/copy_8D4FB468-543C-46E3-8C19-3E03B7D51AED.MOV' },
                { id: 'talk3', title: t('section.seretalks.talk3'), src: '/media/Sere%20talks%20videos/copy_E4FC2012-C683-41FF-899C-3AEFE8A87DBC.MOV' }
              ].map((video) => (
                <div key={video.id} className="group rounded-3xl overflow-hidden border border-outline-variant/30 bg-surface-container-lowest ambient-shadow block transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300">
                  <div className="aspect-[9/16] bg-black relative flex items-center justify-center overflow-hidden">
                    <video src={video.src} controls preload="metadata" className="w-full h-full object-cover"></video>
                  </div>
                  <div className="p-6">
                    <h3 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors line-clamp-2">{video.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* 7.6 Gallery */}
        <GallerySection />

        {/* 8. Pre-Order / Interest Form */}
        <SectionWrapper className="w-full py-20 md:py-32 px-4 md:px-12 bg-surface-container-low" id="pre-order">
          <div className="max-w-screen-md mx-auto bg-surface p-6 sm:p-10 md:p-16 rounded-3xl border border-outline-variant/30 ambient-shadow">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="font-headline text-2xl md:text-4xl font-extrabold text-on-surface mb-4">{t('section.interest.title')}</h2>
              <p className="text-sm md:text-base text-on-surface-variant">{t('section.interest.desc')}</p>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleBottomFormSubmit}>
              <div className="flex flex-col gap-2">
                <label className="font-label text-sm font-semibold text-on-surface-variant" htmlFor="first-name">{t('form.firstName')}</label>
                <input className="w-full px-4 py-3 rounded-2xl border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" id="first-name" name="first-name" placeholder="John" required type="text" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label text-sm font-semibold text-on-surface-variant" htmlFor="last-name">{t('form.lastName')}</label>
                <input className="w-full px-4 py-3 rounded-2xl border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" id="last-name" name="last-name" placeholder="Doe" required type="text" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label text-sm font-semibold text-on-surface-variant" htmlFor="email">{t('form.email')}</label>
                <input className="w-full px-4 py-3 rounded-2xl border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" id="email" name="email" placeholder="john@doe.com" required type="email" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label text-sm font-semibold text-on-surface-variant" htmlFor="phone">{t('form.phone')}</label>
                <input className="w-full px-4 py-3 rounded-2xl border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" id="phone" name="phone" placeholder="+91 98765 43210" required type="tel" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label text-sm font-semibold text-on-surface-variant" htmlFor="city">{t('form.city')}</label>
                <input className="w-full px-4 py-3 rounded-2xl border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" id="city" name="city" placeholder="Hyderabad" required type="text" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label text-sm font-semibold text-on-surface-variant" htmlFor="role">{t('form.role')}</label>
                <select className="w-full px-4 py-3 rounded-2xl border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none appearance-none" id="role" name="role" required defaultValue="">
                  <option value="" disabled>{t('form.role')}</option>
                  <option value="farmer">{t('wizard.role.farmer')}</option>
                  <option value="hobbyist">{t('wizard.role.hobbyist')}</option>
                  <option value="investor">{t('wizard.role.investor')}</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="font-label text-sm font-semibold text-on-surface-variant" htmlFor="message">{t('form.message')}</label>
                <textarea className="w-full px-4 py-3 rounded-2xl border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none min-h-[80px] resize-y" id="message" name="message" placeholder="Any specific requirements..."></textarea>
              </div>
              <label className="md:col-span-2 flex items-start gap-3 rounded-2xl bg-surface-container-low px-4 py-3 text-left text-sm text-on-surface-variant">
                <input className="mt-1 h-4 w-4 rounded border-outline-variant accent-primary" required type="checkbox" name="consent" />
                <span>{t('form.consent')}</span>
              </label>
              {leadError && !isWizardOpen ? (
                <p className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {leadError}
                </p>
              ) : null}
              <div className="md:col-span-2 pt-4">
                <button className="w-full btn-primary text-on-primary font-label font-bold px-8 py-4 rounded-2xl hover:bg-primary-container hover:scale-[1.02] transition-all shadow-lg disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmittingLead} type="submit">
                  {isSubmittingLead ? '...' : t('form.submit')}
                </button>
              </div>
            </form>
          </div>
        </SectionWrapper>
      </main>

      <WizardModal isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} onSubmit={handleWizardSubmit} isSubmitting={isSubmittingLead} submitError={leadError} />
      <ThankYouModal isOpen={isThankYouOpen} onClose={() => setIsThankYouOpen(false)} name={submitName} />
      <LegalModal isOpen={!!legalModalOpen} onClose={() => setLegalModalOpen(null)} type={legalModalOpen} />
    </div>
  );
}
