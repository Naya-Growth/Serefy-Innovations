import React, { useState, useEffect, useRef } from 'react';
import WizardModal, { type WizardFormData } from '../components/WizardModal';
import ThankYouModal from '../components/ThankYouModal';
import { Link } from 'react-router-dom';

import AnimatedTags from '../components/AnimatedTags';
import SectionWrapper from '../components/SectionWrapper';
import GallerySection from '../components/GallerySection';
import LegalModal from '../components/LegalModal';
import { submitSERELead, type SERELeadInput } from '../lib/naya-lead';
import { motion, AnimatePresence } from 'motion/react';
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
  X,
  Zap,
  TrendingUp
} from 'lucide-react';

export default function Home() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [submitName, setSubmitName] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [legalModalOpen, setLegalModalOpen] = useState<'terms' | 'privacy' | 'disclaimer' | null>(null);
  const [activeCompareTab, setActiveCompareTab] = useState(0);

  const [activeTab, setActiveTab] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isTabHovered, setIsTabHovered] = useState(false);

  // Core product ticker representing the single active heating pulse temperature
  const [activeTemp, setActiveTemp] = useState(37.5);



  useEffect(() => {
    const tempInterval = setInterval(() => {
      setActiveTemp((prev) => (prev === 37.5 ? 37.6 : 37.5));
    }, 4000);
    return () => clearInterval(tempInterval);
  }, []);

  useEffect(() => {
    if (isTabHovered) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveTab((currentTab) => (currentTab + 1) % 3);
          return 0;
        }
        return prev + 0.83; // Fills 100% in ~6 seconds
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isTabHovered]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setProgress(0);
  };

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

  const { t, language } = useLanguage();
  const heroCtaText = t('hero.cta');
  const heroCtaSplit = heroCtaText.match(/^(.+?)\s*(?:&|और|आणि)\s*(.+)$/u);
  const heroCtaAction = heroCtaSplit?.[1]?.trim() || heroCtaText;
  const heroCtaOffer = heroCtaSplit?.[2]?.trim() || '';

  return (
    <div className="bg-surface text-on-surface font-body antialiased selection:bg-primary/20 flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <section className="relative w-full pt-20 xs:pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-12 xs:pb-14 sm:pb-16 md:pb-20 lg:pb-24 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 xs:gap-10 sm:gap-12 lg:gap-12 min-h-[75vh] xs:min-h-[80vh] sm:min-h-[85vh] bg-[#fbfbfa]">
          
          {/* Subtle noise/paper grain background texture overlay */}
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none -z-10 bg-repeat bg-center" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

          {/* Left Column: Editorial Layout */}
          <div className="w-full lg:w-[48%] flex flex-col items-center lg:items-start text-center lg:text-left z-10 pr-0 lg:pr-8 order-2 lg:order-1">
            
            {/* Tagline Badge with accent dot */}
            <div className="mb-3 xs:mb-4 sm:mb-5 flex items-center justify-center lg:justify-start gap-2 xs:gap-3">
              <span className="inline-flex items-center gap-1.5 xs:gap-2 px-2.5 xs:px-3 sm:px-4 py-1 xs:py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-[8px] xs:text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] xs:tracking-[0.2em] text-emerald-700">
                <span className="h-1 xs:h-1.5 w-1 xs:w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {language === 'Hindi' ? 'भारत का अग्रणी कृषि नवाचार' : language === 'Marathi' ? 'भारतातील आघाडीचे कृषी संशोधन' : 'Leading Agricultural Innovation'}
              </span>
            </div>

            {/* Asymmetrical Bold Headline */}
            <h1 className="font-headline text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[3.85rem] font-black text-slate-900 tracking-tight leading-[1.1] xs:leading-[1.08] mb-4 xs:mb-5">
              {language === 'Hindi' ? (
                <>
                  भारत का सबसे <span className="text-slate-900">कुशल</span><br />
                  <span className="bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">स्मार्ट अंडा इनक्यूबेटर।</span>
                </>
              ) : language === 'Marathi' ? (
                <>
                  भारतातील सर्वात <span className="text-slate-900">कार्यक्षम</span><br />
                  <span className="bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">स्मार्ट अंडी इनक्यूबेटर.</span>
                </>
              ) : (
                <>
                  India's Most Efficient<br />
                  <span className="bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">Smart Egg Incubator.</span>
                </>
              )}
            </h1>

            {/* Value Proposition with accent border */}
            <p className="font-body text-[13px] xs:text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] text-slate-500 max-w-xs xs:max-w-sm sm:max-w-md leading-[1.6] xs:leading-[1.7] mb-6 xs:mb-8 font-medium whitespace-pre-line lg:border-l-2 lg:border-emerald-200 lg:pl-5">
              {t('hero.tagline')}
            </p>

            {/* Credential Strip — compact icon cards */}
            <div className="mb-6 xs:mb-8 sm:mb-9 grid grid-cols-3 gap-2 xs:gap-2.5 sm:gap-3 w-full max-w-xs xs:max-w-sm sm:max-w-md">
              <div className="flex flex-col items-center lg:items-start gap-1 xs:gap-1.5 px-2 xs:px-2.5 sm:px-3.5 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                <span className="text-[8px] xs:text-[9px] font-black uppercase tracking-wider xs:tracking-widest text-slate-400">{language === 'Hindi' ? 'क्षमता' : language === 'Marathi' ? 'क्षमता' : 'Capacity'}</span>
                <span className="text-[11px] xs:text-[12px] sm:text-[13px] font-black text-slate-800">120 • 200 • 500</span>
              </div>
              <div className="flex flex-col items-center lg:items-start gap-1 xs:gap-1.5 px-2 xs:px-2.5 sm:px-3.5 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                <span className="text-[8px] xs:text-[9px] font-black uppercase tracking-wider xs:tracking-widest text-slate-400">{language === 'Hindi' ? 'प्रमाणित' : language === 'Marathi' ? 'प्रमाणित' : 'Certified'}</span>
                <span className="text-[11px] xs:text-[12px] sm:text-[13px] font-black text-slate-800">Startup India</span>
              </div>
              <div className="flex flex-col items-center lg:items-start gap-1 xs:gap-1.5 px-2 xs:px-2.5 sm:px-3.5 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                <span className="text-[8px] xs:text-[9px] font-black uppercase tracking-wider xs:tracking-widest text-slate-400">{language === 'Hindi' ? 'इनक्यूबेशन' : language === 'Marathi' ? 'इनक्यूबेशन' : 'Incubated'}</span>
                <span className="text-[11px] xs:text-[12px] sm:text-[13px] font-black text-slate-800">AIC Mahindra</span>
              </div>
            </div>

            {/* Premium CTA block */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 xs:gap-3 sm:gap-5 w-full sm:w-auto">
              <a
                className="group/heroCta relative w-full sm:w-auto flex items-center justify-center gap-1.5 xs:gap-2.5 sm:gap-3 overflow-hidden px-4 xs:px-5 sm:px-8 py-2.5 xs:py-3 sm:py-4 bg-gradient-to-br from-emerald-700 via-green-600 to-emerald-800 text-white text-center font-black text-[11px] xs:text-xs sm:text-sm tracking-wide rounded-lg xs:rounded-xl shadow-[0_12px_28px_rgba(21,128,61,0.2)] hover:shadow-[0_16px_36px_rgba(21,128,61,0.28)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
                onClick={(e) => handleOpenWizard(e, 'hero_cta')}
              >
                <span className="pointer-events-none absolute inset-y-0 left-0 w-8 xs:w-10 sm:w-14 -translate-x-24 skew-x-[-16deg] bg-white/25 blur-sm animate-[hero-cta-sheen_3.8s_ease-in-out_infinite]" />
                <span className="relative z-10">{heroCtaAction}</span>
                <span className="relative z-10 flex h-4 xs:h-5 sm:h-7 w-4 xs:w-5 sm:w-7 items-center justify-center rounded-full bg-white/15 group-hover/heroCta:bg-white group-hover/heroCta:text-primary transition-colors">
                  <ArrowRight size={10} xs:size={12} sm:size={15} />
                </span>
              </a>
              <Link to="/technology" className="text-[11px] xs:text-xs sm:text-sm font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1 xs:gap-1.5 group">
                <span className="border-b border-transparent group-hover:border-primary transition-colors">{t('tech.hero.cta')}</span> 
                <ArrowRight size={10} xs:size={12} sm:size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-3 xs:mt-4 sm:mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-1.5 xs:gap-2 sm:gap-3">
              <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-2 xs:px-2.5 sm:px-3 py-0.75 xs:py-1 sm:py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60">
                <ShieldCheck size={8} xs:size={10} sm:size={12} className="text-emerald-600 shrink-0" />
                <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-bold text-emerald-700">{language === 'Hindi' ? '१ वर्ष वॉरंटी' : language === 'Marathi' ? '१ वर्ष वॉरंटी' : '1 Year Warranty'}</span>
              </div>
              <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-2 xs:px-2.5 sm:px-3 py-0.75 xs:py-1 sm:py-1.5 rounded-full bg-orange-50 border border-orange-200/60">
                <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-bold text-orange-700">{language === 'Hindi' ? 'भारत में निर्मित' : language === 'Marathi' ? 'भारतात बनवले' : 'Made in India'}</span>
              </div>
              <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 px-2 xs:px-2.5 sm:px-3 py-0.75 xs:py-1 sm:py-1.5 rounded-full bg-blue-50 border border-blue-200/60">
                <Mail size={8} xs:size={10} sm:size={12} className="text-blue-600 shrink-0" />
                <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-bold text-blue-700">{language === 'Hindi' ? '२४/७ समर्थन' : language === 'Marathi' ? '२४/७ सपोर्ट' : '24/7 Support'}</span>
              </div>
            </div>
            
            {/* Trust footer with checkmark */}
            <div className="mt-3 xs:mt-4 sm:mt-6 flex items-center justify-center lg:justify-start gap-1 xs:gap-1.5 sm:gap-2 text-[9px] xs:text-[10px] sm:text-xs font-semibold text-slate-400">
              <CheckCircle2 size={10} xs:size={12} sm:size={14} className="text-emerald-500 shrink-0" />
              <span className="text-center">{language === 'Hindi' ? '500+ खेतों द्वारा सत्यापित तकनीक।' : language === 'Marathi' ? '५००+ पेक्षा जास्त शेतांवर सिद्ध तंत्रज्ञान.' : 'Proven technology deployed on 500+ farms across India.'}</span>
            </div>
          </div>

          {/* Right Column: Handcrafted Photo Composition */}
          <div className="w-full lg:w-[48%] relative flex flex-col items-center lg:items-center justify-center mt-6 xs:mt-8 sm:mt-10 lg:mt-0 lg:-ml-8 select-none order-1 lg:order-2">
            {/* Photo Composition Frame */}
            <div className="relative w-full max-w-[320px] xs:max-w-[380px] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[480px] aspect-[4/5] xs:aspect-[3/4] sm:aspect-square flex items-center justify-center">
              
              {/* Photo 1: The Farmer (Base Photograph in a classic paper frame) */}
              <motion.div
                initial={{ opacity: 0, x: 80, filter: "blur(8px)", rotate: -8 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  filter: "blur(0px)", 
                  rotate: -2,
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 70, 
                  damping: 16,
                  delay: 0.2
                }}
                className="absolute left-[4%] top-[4%] w-[70%] xs:w-[72%] sm:w-[74%] aspect-[3/4] bg-white p-2 xs:p-2.5 sm:p-3 shadow-[0_12px_36px_rgba(15,23,42,0.06)] border border-slate-200/50 rounded-xs flex flex-col z-0"
              >
                <div className="w-full flex-grow overflow-hidden rounded-xs bg-slate-50">
                  <img 
                    alt="Happy Indian poultry farmer" 
                    referrerPolicy="no-referrer" 
                    className="w-full h-full object-cover grayscale-[15%] contrast-[102%]" 
                    src="/media/indian-farmer-hero.png" 
                  />
                </div>
                {/* Print caption */}
                <div className="pt-1.5 xs:pt-2 sm:pt-2.5 text-left">
                  <span className="font-mono text-[7px] xs:text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                    {language === 'Hindi' ? 'चित्र १: ग्रामीण पोल्ट्री उद्यमी' : language === 'Marathi' ? 'चित्र १: ग्रामीण पोल्ट्री व्यावसायिक' : 'Fig. 1 — Rural poultry entrepreneurship.'}
                  </span>
                </div>
              </motion.div>

              {/* Photo 2: The Incubator (Signature animation inside, overlapping asymmetrically) */}
              <motion.div
                initial={{ opacity: 0, y: 80, filter: "blur(8px)", rotate: 6, scale: 0.97 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px)", 
                  rotate: 1,
                  scale: 1,
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 65, 
                  damping: 15,
                  delay: 0.45
                }}
                className="absolute right-[4%] bottom-[4%] w-[54%] xs:w-[56%] sm:w-[58%] aspect-square bg-white p-2 xs:p-2.5 sm:p-3 shadow-[0_20px_45px_rgba(15,23,42,0.1)] border border-slate-200/80 rounded-xs flex flex-col z-10"
              >
                {/* Real photo wrapper with signature slow zoom */}
                <div className="w-full flex-grow overflow-hidden rounded-xs bg-slate-50 relative">
                  <motion.div
                    animate={{ scale: [1, 1.025, 1] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-full"
                  >
                    <img 
                      alt="Smart Egg Incubator Unit" 
                      referrerPolicy="no-referrer" 
                      className="w-full h-full object-cover" 
                      src="/media/sere-120.webp" 
                    />
                  </motion.div>

                  {/* Warm orange glow pulsing inside to show active heating (Signature Animation) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-500/15 via-amber-500/5 to-transparent mix-blend-screen animate-pulse pointer-events-none" />

                  {/* Digital screen display - authentic brand detail */}
                  <div className="absolute top-[8%] right-[8%] flex flex-col gap-1 items-end z-20">
                    <div className="bg-black/90 px-1 xs:px-1.5 py-0.5 rounded border border-white/10 shadow-inner flex items-center justify-center min-w-[32px] xs:min-w-[38px] sm:min-w-[42px]">
                      <span className="font-mono text-[7px] xs:text-[8px] font-black text-amber-500 tracking-wider">
                        {activeTemp.toFixed(1)}°C
                      </span>
                    </div>
                  </div>
                </div>

                {/* Print caption */}
                <div className="pt-1.5 xs:pt-2 sm:pt-2.5 text-left">
                  <span className="font-mono text-[7px] xs:text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                    {language === 'Hindi' ? 'चित्र २: सेरे १२० हॅचर युनिट' : language === 'Marathi' ? 'चित्र २: सेरे १२० हॅचर युनिट' : 'Fig. 2 — SERE-120 Hatcher unit.'}
                  </span>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* 2 & 3. Problem & Solution Overview */}
        <SectionWrapper className="w-full py-12 xs:py-14 sm:py-16 md:py-20 lg:py-28 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 bg-surface-container-low border-y border-outline-variant" id="problem-solution">
          <div className="max-w-screen-xl mx-auto">
            {/* Header Block */}
            <div className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16 max-w-4xl mx-auto px-3 xs:px-4">
              <span className="inline-flex items-center gap-1 xs:gap-1.5 px-2.5 xs:px-3.5 py-1 xs:py-1.5 rounded-full bg-emerald-100/40 border border-emerald-300/30 text-emerald-800 text-[10px] xs:text-xs font-black uppercase tracking-[0.12em] xs:tracking-[0.15em] mb-3 xs:mb-4 shadow-sm backdrop-blur-sm">
                <span className="h-1.5 xs:h-2 w-1.5 xs:w-2 rounded-full bg-emerald-600 animate-pulse-soft"></span>
                {t('section.solution.badge')}
              </span>
              <h2 className="font-headline text-2xl xs:text-2.5xl sm:text-3xl md:text-4xl lg:text-[3.25rem] font-black text-on-surface mb-4 xs:mb-5 sm:mb-6 tracking-tight leading-[1.2] xs:leading-[1.15]">
                {t('section.problem.allChallenges').split(' ').map((word, idx) => {
                  const isHighlight = word.toLowerCase().includes('challenge') || word.toLowerCase().includes('solution') || word.includes('समाधान') || word.includes('उपाय');
                  return (
                    <span key={idx} className={isHighlight ? "bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent inline-block" : ""}>
                      {word}{' '}
                    </span>
                  );
                })}
              </h2>
              <div className="h-0.5 xs:h-1 w-16 xs:w-20 bg-gradient-to-r from-emerald-500 to-green-600 mx-auto rounded-full mb-4 xs:mb-6"></div>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto font-medium leading-relaxed">
                {t('section.problem.allChallenges.desc')}
              </p>
            </div>

            {/* Content Stage (Grid) */}
            <div className="grid lg:grid-cols-2 gap-8 xs:gap-10 sm:gap-12 lg:gap-16 items-center">
              {/* Left Side: Dynamic Media Player Stage */}
              <div
                className="relative group max-w-xl mx-auto lg:max-w-none w-full order-2 lg:order-1"
                onMouseEnter={() => setIsTabHovered(true)}
                onMouseLeave={() => setIsTabHovered(false)}
              >
                {/* Background soft lighting */}
                <div className="absolute -inset-3 xs:-inset-4 sm:-inset-6 bg-gradient-to-tr from-emerald-500/20 to-green-500/10 rounded-[2rem] xs:rounded-[2.5rem] sm:rounded-[3rem] blur-xl xs:blur-2xl opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"></div>

                {/* Media screen */}
                <div className="relative rounded-[1.5rem] xs:rounded-[2rem] sm:rounded-[2.5rem] p-2 xs:p-2.5 sm:p-3 bg-white/60 backdrop-blur-md border border-white/40 shadow-2xl overflow-hidden aspect-[4/3] flex items-center justify-center">
                  <div className="w-full h-full rounded-[1.2rem] xs:rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden relative bg-black flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {activeTab === 0 && (
                        <motion.img
                          key="tab-image-0"
                          initial={{ opacity: 0, scale: 1.02 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          src="/media/sere-120.webp"
                          alt="SERE 120 Model"
                          className="w-full h-full object-cover"
                        />
                      )}
                      {activeTab === 1 && (
                        <motion.img
                          key="tab-image-1"
                          initial={{ opacity: 0, scale: 1.02 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          src="/media/happy-poultry-farmer.png"
                          alt="Reliable Climate"
                          className="w-full h-full object-cover"
                        />
                      )}
                      {activeTab === 2 && (
                        <motion.img
                          key="tab-image-2"
                          initial={{ opacity: 0, scale: 1.02 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          src="/media/Machine%20process/IMG_4238.jpg"
                          alt="Chicks Yield"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Floating dynamic status tags based on activeTab */}
                <div className="hidden md:flex absolute top-[12%] -left-4 xs:-left-6 sm:-left-8 bg-white/90 backdrop-blur-md px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-xl xs:rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-white/60 text-[11px] xs:text-xs sm:text-sm font-bold items-center gap-1.5 xs:gap-2 sm:gap-2.5 transition-all duration-300 hover:scale-105 hover:bg-white animate-float-slow">
                  <span className="relative flex h-2.5 xs:h-3 sm:h-3.5 w-2.5 xs:w-3 sm:w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 xs:h-3 sm:h-3.5 w-2.5 xs:w-3 sm:w-3.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-slate-800">
                    {activeTab === 0 ? t('section.solution.pointer1') : activeTab === 1 ? "0.01°C Accuracy" : "90% Hatch Rate"}
                  </span>
                </div>

                <div className="hidden md:flex absolute top-[58%] -right-4 xs:-right-6 sm:-right-8 bg-white/90 backdrop-blur-md px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-xl xs:rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-white/60 text-[11px] xs:text-xs sm:text-sm font-bold items-center gap-1.5 xs:gap-2 sm:gap-2.5 transition-all duration-300 hover:scale-105 hover:bg-white animate-float-medium">
                  <span className="relative flex h-2.5 xs:h-3 sm:h-3.5 w-2.5 xs:w-3 sm:w-3.5">
                    <span className="relative inline-flex rounded-full h-2.5 xs:h-3 sm:h-3.5 w-2.5 xs:w-3 sm:w-3.5 bg-emerald-600"></span>
                  </span>
                  <span className="text-slate-800">
                    {activeTab === 0 ? "Solar Compatible" : activeTab === 1 ? t('section.solution.pointer1') : "Farmer Certified"}
                  </span>
                </div>

                <div className="absolute bottom-4 xs:bottom-5 sm:bottom-6 left-4 xs:left-5 sm:left-6 right-4 xs:right-5 sm:right-6 md:bottom-[8%] md:left-6 md:right-auto bg-gradient-to-r from-emerald-600 to-green-700 text-white px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 sm:py-3 rounded-xl xs:rounded-2xl shadow-lg shadow-emerald-700/20 font-bold flex items-center justify-center md:justify-start gap-1.5 xs:gap-2 sm:gap-2.5 text-xs xs:text-sm sm:text-base hover:shadow-emerald-700/30 transition-all duration-300 hover:scale-[1.03] animate-float-delayed">
                  <CheckCircle2 size={14} xs:size={16} sm:size={18} md:size={20} className="text-emerald-100 animate-pulse-soft" />
                  <span className="text-[10px] xs:text-xs sm:text-sm">
                    {activeTab === 0 ? t('section.solution.badge') : activeTab === 1 ? "Smart Inhouse API Tracking" : "High Hatch Yield Guaranteed"}
                  </span>
                </div>
              </div>

              {/* Right Side: Interactive Progress Cards */}
              <div
                className="space-y-4 xs:space-y-5 sm:space-y-6 order-1 lg:order-2"
                onMouseEnter={() => setIsTabHovered(true)}
                onMouseLeave={() => setIsTabHovered(false)}
              >
                {[
                  {
                    id: 0,
                    title: t('section.solution.plugPlay'),
                    desc: t('section.solution.plugPlay.desc'),
                    icon: Zap,
                    color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  },
                  {
                    id: 1,
                    title: t('section.solution.reliableClimate'),
                    desc: t('section.solution.reliableClimate.desc'),
                    icon: Thermometer,
                    color: "bg-green-50 text-green-700 hover:bg-green-100"
                  },
                  {
                    id: 2,
                    title: t('section.solution.financialIndep'),
                    desc: t('section.solution.financialIndep.desc'),
                    icon: TrendingUp,
                    color: "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                  }
                ].map((card) => {
                  const IconComponent = card.icon;
                  const isActive = activeTab === card.id;

                  return (
                    <div
                      key={card.id}
                      onClick={() => handleTabClick(card.id)}
                      className={`group relative p-4 xs:p-5 sm:p-6 md:p-7 rounded-2xl xs:rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden ${isActive
                        ? "bg-gradient-to-br from-white via-white to-emerald-50/10 border-emerald-500/30 shadow-[0_16px_36px_rgba(21,128,61,0.08)] scale-[1.01]"
                        : "bg-white/40 border-outline-variant hover:bg-white hover:border-emerald-500/10 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:scale-[1.005]"
                        }`}
                    >
                      {/* Active Progress Bar (Fills automatically) */}
                      {isActive && (
                        <div className="absolute left-0 bottom-0 top-0 w-[3px] xs:w-[4px] bg-slate-100">
                          <div
                            className="h-full bg-gradient-to-b from-emerald-500 to-green-600 transition-all duration-75 ease-linear"
                            style={{ height: `${progress}%` }}
                          />
                        </div>
                      )}

                      <div className="flex gap-3 xs:gap-4 sm:gap-5 relative z-10 items-start">
                        {/* Icon Badge */}
                        <div className={`flex shrink-0 w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 items-center justify-center rounded-xl xs:rounded-2xl ${card.color} group-hover:scale-110 transition-transform duration-300 shadow-sm ${isActive ? "ring-2 ring-emerald-500/20" : ""}`}>
                          <IconComponent size={18} xs:size={20} sm:size={22} md:size={24} className={`group-hover:rotate-12 transition-transform duration-300 ${isActive ? "animate-pulse" : ""}`} />
                        </div>

                        <div className="space-y-1 xs:space-y-1.5">
                          <h3 className={`font-headline font-extrabold text-base xs:text-lg sm:text-xl transition-colors duration-300 ${isActive ? "text-primary" : "text-slate-900"}`}>
                            {card.title}
                          </h3>
                          <p className={`text-xs xs:text-sm sm:text-base transition-colors duration-300 font-medium leading-relaxed ${isActive ? "text-on-surface-variant" : "text-on-surface-variant/70"}`}>
                            {card.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* How to Use */}
        <SectionWrapper className="w-full py-12 xs:py-14 sm:py-16 md:py-20 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 bg-surface-container-low border-b border-outline-variant/20 relative overflow-hidden" id="how-to-use">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-40">
            <div className="absolute top-0 left-1/4 w-64 xs:w-80 sm:w-96 h-64 xs:h-80 sm:h-96 bg-primary/5 rounded-full blur-[80px] xs:blur-[100px]"></div>
            <div className="absolute bottom-0 right-1/4 w-64 xs:w-80 sm:w-96 h-64 xs:h-80 sm:h-96 bg-primary/10 rounded-full blur-[80px] xs:blur-[100px]"></div>
          </div>

          <div className="max-w-screen-xl mx-auto text-center relative z-10">
            <h2 className="font-headline text-2xl xs:text-2.5xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-on-surface mb-3 xs:mb-4 tracking-tighter uppercase">{t('section.how.plugPlay')}</h2>
            <p className="text-on-surface-variant font-bold mb-10 xs:mb-12 sm:mb-14 md:mb-16 tracking-wider xs:tracking-widest uppercase text-[10px] xs:text-xs">{t('section.how.deployDesc')}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8 lg:gap-10">
              {[
                { step: "1", title: t('section.how.step1.title'), desc: t('section.how.step1.desc'), icon: "electric_bolt" },
                { step: "2", title: t('section.how.step2.title'), desc: t('section.how.step2.desc'), icon: "water_drop" },
                { step: "3", title: t('section.how.step3.title'), desc: t('section.how.step3.desc'), icon: "auto_awesome" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="p-6 xs:p-7 sm:p-8 md:p-10 bg-surface rounded-[1.5rem] xs:rounded-[2rem] border border-outline-variant/30 shadow-xl shadow-black/5 hover:shadow-primary/10 transition-all group relative overflow-hidden text-left"
                >
                  <div className="absolute top-0 right-0 p-4 xs:p-6 sm:p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span className="material-symbols-outlined text-5xl xs:text-6xl sm:text-7xl md:text-8xl text-primary">{item.icon}</span>
                  </div>
                  <div className="w-12 xs:w-14 sm:w-16 h-12 xs:h-14 sm:h-16 bg-primary text-on-primary rounded-2xl xs:rounded-3xl flex items-center justify-center mb-5 xs:mb-6 sm:mb-8 text-xl xs:text-2xl font-black shadow-lg shadow-primary/30 group-hover:scale-110 transition-all">
                    {item.step}
                  </div>
                  <h3 className="font-headline font-black text-lg xs:text-xl sm:text-2xl mb-3 xs:mb-4 text-on-surface group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-on-surface-variant text-sm xs:text-base font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* Market vs SERE Comparison */}
        <SectionWrapper className="w-full pt-12 xs:pt-14 sm:pt-16 md:pt-20 pb-10 xs:pb-12 sm:pb-14 md:pb-16 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 bg-surface">
          <div className="max-w-screen-xl mx-auto">
            {/* Title block */}
            <div className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16 max-w-3xl mx-auto px-3 xs:px-4">
              <span className="inline-flex items-center gap-1 xs:gap-1.5 px-2.5 xs:px-3 py-0.5 xs:py-1 bg-red-50 rounded-full font-label text-[10px] xs:text-xs font-bold text-red-700 tracking-wider xs:tracking-widest uppercase mb-3 xs:mb-4 border border-red-200/50">
                LIMITATION VS TECHNOLOGY
              </span>
              <h2 className="font-headline text-2xl xs:text-2.5xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-on-surface mb-3 xs:mb-4 tracking-tight leading-tight">
                {t('section.market.loseTitle')}
              </h2>
              <div className="h-0.5 xs:h-1 w-16 xs:w-20 bg-gradient-to-r from-red-400 to-emerald-500 mx-auto rounded-full mb-4 xs:mb-6"></div>
              <p className="text-on-surface-variant font-medium text-sm xs:text-base sm:text-lg">{t('section.market.loseSubtitle')}</p>
            </div>

            {/* Interactive Battle Arena Dashboard */}
            {(() => {
              const comparisonFeatures = [
                {
                  id: 0,
                  title: "Climate Control",
                  subtitle: "Temp & Humidity regulation",
                  icon: Thermometer,
                  traditional: t('section.market.traditional.list1'),
                  sere: t('section.market.SERE.list1'),
                  traditionalDetail: "Traditional incubators use basic thermostats and manual water trays. This leads to dangerous temperature spikes or dry spells that ruin eggs.",
                  sereDetail: "SERE uses advanced PID digital controllers and automatic humidity pumps to maintain a perfect, stable climate 24/7.",
                  metricType: "climate",
                  label: "Environment Stability"
                },
                {
                  id: 1,
                  title: "Operational Effort",
                  subtitle: "Manual labor vs Automation",
                  icon: Cpu,
                  traditional: t('section.market.traditional.list2'),
                  sere: t('section.market.SERE.list2'),
                  traditionalDetail: "Requires waking up throughout the night to turn eggs manually and check water levels. Missing a cycle can result in high embryonic mortality.",
                  sereDetail: "Set and forget. SERE features automatic egg turning, automatic ventilation, and alerts, letting you focus on your other farm activities.",
                  metricType: "effort",
                  label: "Labor & Monitoring"
                },
                {
                  id: 2,
                  title: "Energy Efficiency",
                  subtitle: "Insulation & Backup source",
                  icon: Zap,
                  traditional: t('section.market.traditional.list3'),
                  sere: t('section.market.SERE.list3'),
                  traditionalDetail: "Uninsulated plastic/metal allows heat to escape rapidly, drawing high electricity constant loads and causing total hatch failure during outages.",
                  sereDetail: "Double-walled premium thermal insulation reduces power draw by 70%. Easily connects directly to hybrid solar panels and standard batteries.",
                  metricType: "energy",
                  label: "Power & Running Costs"
                },
                {
                  id: 3,
                  title: "Hatch Yield Rate",
                  subtitle: "Hatching success numbers",
                  icon: TrendingUp,
                  traditional: t('section.market.traditional.list4'),
                  sere: t('section.market.SERE.list4'),
                  traditionalDetail: "Fluctuating parameters and unstable heating lead to a low average hatch rate of 55-65%, meaning you lose 4 out of every 10 eggs.",
                  sereDetail: "High-precision heat distribution and digital ventilation ensure a consistent 90%+ hatch rate, ensuring every fertile egg counts.",
                  metricType: "yield",
                  label: "Hatch Success Rate"
                }
              ];

              const renderVisualWidget = (type: string, isSere: boolean) => {
                if (type === 'climate') {
                  if (isSere) {
                    return (
                      <div className="relative w-full h-28 bg-emerald-950/5 border border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-inner">
                        <div className="flex justify-between items-center z-10">
                          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">SERE ENVIRONMENT</span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-700 rounded text-[10px] font-bold animate-pulse-soft">37.8°C STABLE</span>
                        </div>
                        <div className="h-10 flex items-center justify-center relative">
                          <svg className="w-full h-full stroke-emerald-500 fill-none" viewBox="0 0 200 40" preserveAspectRatio="none">
                            <path
                              d="M 0 20 Q 25 20 50 20 T 100 20 T 150 20 T 200 20"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              className="stroke-emerald-500 drop-shadow-[0_0_6px_rgba(16,185,129,0.7)]"
                            />
                            <circle cx="100" cy="20" r="4" className="fill-emerald-400 animate-ping" />
                            <circle cx="100" cy="20" r="2.5" className="fill-emerald-500" />
                          </svg>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-emerald-700/80 z-10">
                          <span>HUMIDITY: 60%</span>
                          <span>TEMP: 37.8°C</span>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="relative w-full h-28 bg-red-950/5 border border-red-500/10 rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-inner">
                        <div className="flex justify-between items-center z-10">
                          <span className="text-[10px] font-black text-red-700 uppercase tracking-widest">TRADITIONAL TEMP</span>
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-600 rounded text-[10px] font-bold">39.5°C CRITICAL</span>
                        </div>
                        <div className="h-10 flex items-center justify-center relative">
                          <svg className="w-full h-full stroke-red-400 fill-none" viewBox="0 0 200 40" preserveAspectRatio="none">
                            <path
                              d="M 0 25 L 25 10 L 50 35 L 75 5 L 100 30 L 125 15 L 150 38 L 175 8 L 200 28"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <circle cx="75" cy="5" r="4" className="fill-red-500 animate-ping" />
                            <circle cx="75" cy="5" r="2.5" className="fill-red-600" />
                          </svg>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-red-700/60 z-10">
                          <span>HUMIDITY: 40% (DRY)</span>
                          <span>TEMP: 35.5 - 39.5°C</span>
                        </div>
                      </div>
                    );
                  }
                }

                if (type === 'effort') {
                  if (isSere) {
                    return (
                      <div className="relative w-full h-28 bg-emerald-950/5 border border-emerald-500/20 rounded-2xl p-3 flex flex-col justify-between overflow-hidden shadow-inner">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">AUTOMATED TIMELINE</span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-700 rounded text-[10px] font-bold">SET & FORGET</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-bold mt-1">
                          <div className="p-1 bg-emerald-500/5 rounded border border-emerald-500/15 flex flex-col items-center justify-center">
                            <span className="material-symbols-outlined text-sm text-emerald-600 mb-0.5">published_with_changes</span>
                            <span className="font-bold text-emerald-900">Auto-Turn</span>
                            <span className="text-[7px] text-emerald-600/70">Every 2 Hours</span>
                          </div>
                          <div className="p-1 bg-emerald-500/5 rounded border border-emerald-500/15 flex flex-col items-center justify-center">
                            <span className="material-symbols-outlined text-sm text-emerald-600 mb-0.5">water_drop</span>
                            <span className="font-bold text-emerald-900">Auto-Humidity</span>
                            <span className="text-[7px] text-emerald-600/70">Sensors Active</span>
                          </div>
                          <div className="p-1 bg-emerald-500/5 rounded border border-emerald-500/15 flex flex-col items-center justify-center">
                            <span className="material-symbols-outlined text-sm text-emerald-600 mb-0.5">notifications_active</span>
                            <span className="font-bold text-emerald-900">Smart Alerts</span>
                            <span className="text-[7px] text-emerald-600/70">GSM Enabled</span>
                          </div>
                        </div>
                        <div className="w-full bg-emerald-100 rounded-full h-1 mt-1 overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[95%] animate-pulse-soft"></div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="relative w-full h-28 bg-red-950/5 border border-red-500/10 rounded-2xl p-3 flex flex-col justify-between overflow-hidden shadow-inner">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-red-700 uppercase tracking-widest">MANUAL CHORES</span>
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-600 rounded text-[10px] font-bold">24/7 ATTENTION</span>
                        </div>
                        <div className="flex flex-col gap-1 mt-1 text-[9px] font-bold text-red-800">
                          <div className="flex items-center gap-1.5 bg-red-500/5 px-2 py-1 rounded">
                            <span className="material-symbols-outlined text-xs text-red-500">lock_clock</span>
                            <span>Wake up at 2 AM to check temperature manually</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-red-500/5 px-2 py-1 rounded">
                            <span className="material-symbols-outlined text-xs text-red-500">rotate_right</span>
                            <span>Manually turn all egg trays by hand 4x daily</span>
                          </div>
                        </div>
                        <div className="w-full bg-red-100 rounded-full h-1 mt-1">
                          <div className="bg-red-500 h-full w-[15%]"></div>
                        </div>
                      </div>
                    );
                  }
                }

                if (type === 'energy') {
                  if (isSere) {
                    return (
                      <div className="relative w-full h-28 bg-emerald-950/5 border border-emerald-500/20 rounded-2xl p-3 flex flex-col justify-between overflow-hidden shadow-inner">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">HYBRID POWER SETUP</span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-700 rounded text-[10px] font-bold">SOLAR COMPATIBLE</span>
                        </div>
                        <div className="flex items-center justify-around my-1">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                              <span className="material-symbols-outlined text-base">wb_sunny</span>
                            </div>
                            <span className="text-[8px] font-bold text-emerald-900 mt-1">Solar Inputs</span>
                          </div>
                          <div className="text-emerald-500 text-lg font-black animate-pulse-soft">→</div>
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                              <span className="material-symbols-outlined text-base">battery_charging_full</span>
                            </div>
                            <span className="text-[8px] font-bold text-emerald-900 mt-1">Eco-Mode (40W)</span>
                          </div>
                        </div>
                        <div className="text-[9px] font-bold text-emerald-800 text-center leading-tight">
                          Double-walled insulation retains heat for up to 12 hours without grid power
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="relative w-full h-28 bg-red-950/5 border border-red-500/10 rounded-2xl p-3 flex flex-col justify-between overflow-hidden shadow-inner">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-red-700 uppercase tracking-widest">POWER SYSTEM</span>
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-600 rounded text-[10px] font-bold">GRID DEPENDENT</span>
                        </div>
                        <div className="flex items-center justify-around my-1 opacity-70">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-600">
                              <span className="material-symbols-outlined text-base">bolt</span>
                            </div>
                            <span className="text-[8px] font-bold text-red-800 mt-1">High Draw (150W)</span>
                          </div>
                          <span className="text-red-500 text-lg font-black">✖</span>
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-600">
                              <span className="material-symbols-outlined text-base">battery_alert</span>
                            </div>
                            <span className="text-[8px] font-bold text-red-800 mt-1">No Solar Option</span>
                          </div>
                        </div>
                        <div className="text-[9px] font-bold text-red-700/80 text-center leading-tight">
                          Metal or thin plastic leaks heat instantly, spoiling entire hatch in a power cut
                        </div>
                      </div>
                    );
                  }
                }

                if (type === 'yield') {
                  if (isSere) {
                    return (
                      <div className="relative w-full h-28 bg-emerald-950/5 border border-emerald-500/20 rounded-2xl p-3 flex flex-col justify-between overflow-hidden shadow-inner">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">PROVEN HATCH RATE</span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-700 rounded text-[10px] font-bold">90%+ SUCCESS</span>
                        </div>
                        <div className="flex items-center gap-3 my-1">
                          {/* Circular progress */}
                          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="24" cy="24" r="20" stroke="#f0fdf4" strokeWidth="4" fill="transparent" />
                              <circle cx="24" cy="24" r="20" stroke="#10b981" strokeWidth="4" fill="transparent"
                                strokeDasharray={2 * Math.PI * 20}
                                strokeDashoffset={2 * Math.PI * 20 * (1 - 0.92)}
                                className="stroke-emerald-500"
                              />
                            </svg>
                            <span className="absolute text-[10px] font-black text-emerald-900">92%</span>
                          </div>
                          <div className="flex flex-wrap gap-1 items-center flex-1">
                            {Array.from({ length: 10 }).map((_, i) => (
                              <span key={i} className={`text-xs leading-none ${i < 9 ? 'text-amber-500' : 'text-slate-300'}`}>🥚</span>
                            ))}
                            <span className="text-[8px] font-bold text-emerald-800 block w-full mt-0.5">9 out of 10 eggs hatch healthy</span>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="relative w-full h-28 bg-red-950/5 border border-red-500/10 rounded-2xl p-3 flex flex-col justify-between overflow-hidden shadow-inner">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-red-700 uppercase tracking-widest">MARKET HATCH RATE</span>
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-600 rounded text-[10px] font-bold">~60% AVERAGE</span>
                        </div>
                        <div className="flex items-center gap-3 my-1">
                          {/* Circular progress */}
                          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="24" cy="24" r="20" stroke="#fee2e2" strokeWidth="4" fill="transparent" />
                              <circle cx="24" cy="24" r="20" stroke="#ef4444" strokeWidth="4" fill="transparent"
                                strokeDasharray={2 * Math.PI * 20}
                                strokeDashoffset={2 * Math.PI * 20 * (1 - 0.60)}
                                className="stroke-red-500"
                              />
                            </svg>
                            <span className="absolute text-[10px] font-black text-red-900">60%</span>
                          </div>
                          <div className="flex flex-wrap gap-1 items-center flex-1">
                            {Array.from({ length: 10 }).map((_, i) => (
                              <span key={i} className={`text-xs leading-none ${i < 6 ? 'text-amber-500' : 'text-red-500'}`}>{i < 6 ? '🥚' : '✖'}</span>
                            ))}
                            <span className="text-[8px] font-bold text-red-700 block w-full mt-0.5">4 out of 10 eggs fail to hatch</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                }

                return null;
              };

              return (
                <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[280px_1fr] gap-6 xs:gap-8 max-w-5xl mx-auto items-stretch">

                  {/* Left Column: Feature Selectors */}
                  <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2 xs:gap-3 scrollbar-none snap-x snap-mandatory">
                    {comparisonFeatures.map((item, idx) => {
                      const IconComponent = item.icon;
                      const isActive = activeCompareTab === idx;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveCompareTab(idx)}
                          className={`relative flex items-center gap-2 xs:gap-3 p-3 xs:p-4 rounded-xl xs:rounded-2xl border text-left transition-all duration-300 group shrink-0 snap-center lg:snap-align-none ${isActive
                            ? 'border-emerald-600 bg-emerald-50/10 shadow-md shadow-emerald-500/5'
                            : 'border-outline-variant hover:border-slate-300 bg-white hover:bg-slate-50/50'
                            } w-[180px] xs:w-[200px] sm:w-[220px] lg:w-full`}
                        >
                          {/* Active green indicator line on the left border */}
                          {isActive && (
                            <motion.div
                              layoutId="activeCompareIndicator"
                              className="absolute left-0 top-0 bottom-0 w-0.5 xs:w-1 bg-emerald-600 rounded-l-xl xs:rounded-l-2xl"
                              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                          )}

                          {/* Icon */}
                          <div className={`w-8 h-8 xs:w-9 xs:h-9 rounded-lg xs:rounded-xl flex items-center justify-center transition-all shrink-0 ${isActive
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                            : 'bg-slate-50 text-slate-600 group-hover:bg-slate-100'
                            }`}>
                            <IconComponent size={16} xs:size={18} />
                          </div>

                          {/* Text details */}
                          <div className="flex-1 min-w-0">
                            <span className="block text-[7px] xs:text-[8px] font-black text-slate-400 uppercase tracking-wider xs:tracking-widest mb-0.5">0{idx + 1} / FEATURE</span>
                            <h4 className={`text-[10px] xs:text-xs font-bold tracking-tight leading-snug transition-colors ${isActive ? 'text-emerald-950' : 'text-slate-800'
                              }`}>
                              {item.title}
                            </h4>
                            <span className="block text-[9px] xs:text-[10px] text-slate-500 font-medium truncate">
                              {item.subtitle}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column: Comparative Showcase Card */}
                  <div className="relative bg-white rounded-2xl xs:rounded-3xl border border-outline-variant p-4 xs:p-5 sm:p-6 lg:p-7 flex flex-col justify-between overflow-hidden shadow-lg shadow-slate-100/50 min-h-[350px] xs:min-h-[380px] sm:min-h-[420px]">
                    {/* Background ambient light */}
                    <div className="absolute top-0 right-0 w-48 xs:w-56 sm:w-64 h-48 xs:h-56 sm:h-64 bg-emerald-500/5 rounded-full blur-2xl xs:blur-3xl -z-10" />
                    <div className="absolute bottom-0 left-0 w-48 xs:w-56 sm:w-64 h-48 xs:h-56 sm:h-64 bg-red-500/5 rounded-full blur-2xl xs:blur-3xl -z-10" />

                    {/* Active Feature Tag */}
                    <div className="text-center mb-4 xs:mb-5 sm:mb-6 border-b border-slate-100 pb-2 xs:pb-3 shrink-0">
                      <span className="font-headline font-black text-[9px] xs:text-[10px] text-slate-800 tracking-wider xs:tracking-widest uppercase bg-slate-50 px-2.5 xs:px-3 py-0.5 xs:py-1 rounded-full border border-slate-200/60 inline-block">
                        {comparisonFeatures[activeCompareTab].label}
                      </span>
                    </div>

                    {/* Split Arena */}
                    <div className="flex-1 flex flex-col justify-center relative">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeCompareTab}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          transition={{ duration: 0.25 }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6 sm:gap-8 items-stretch relative"
                        >
                          {/* Visual VS Badge in between (desktop only) */}
                          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-7 xs:w-8 sm:w-9 h-7 xs:h-8 sm:h-9 rounded-full bg-slate-100 text-slate-600 font-headline font-black text-[9px] xs:text-[10px] items-center justify-center border-3 xs:border-4 border-white shadow-md">
                            VS
                          </div>

                          {/* Left: Traditional Machine (Problem) */}
                          <div className="flex flex-col justify-between p-3 xs:p-4 bg-red-50/10 border border-red-100/30 rounded-xl xs:rounded-2xl text-left hover:bg-red-50/20 transition-all duration-300">
                            <div>
                              <div className="flex items-center gap-1 xs:gap-1.5 mb-1.5 xs:mb-2">
                                <div className="w-4 h-4 xs:w-5 xs:h-5 rounded-full bg-red-100/60 text-red-600 flex items-center justify-center">
                                  <X size={10} xs:size={12} />
                                </div>
                                <span className="text-[8px] xs:text-[9px] font-black text-red-800 uppercase tracking-wider xs:tracking-widest">
                                  {t('section.market.traditional')}
                                </span>
                              </div>

                              <h5 className="text-xs xs:text-sm font-bold text-red-950 mb-1 xs:mb-1.5 leading-snug">
                                {comparisonFeatures[activeCompareTab].traditional}
                              </h5>

                              <p className="text-[10px] xs:text-[11px] font-medium text-slate-500 leading-relaxed mb-3 xs:mb-4">
                                {comparisonFeatures[activeCompareTab].traditionalDetail}
                              </p>
                            </div>

                            {/* Visual Widget */}
                            {renderVisualWidget(comparisonFeatures[activeCompareTab].metricType, false)}
                          </div>

                          {/* Right: SERE Smart Technology (Solution) */}
                          <div className="flex flex-col justify-between p-3 xs:p-4 bg-emerald-50/20 border border-emerald-500/20 rounded-xl xs:rounded-2xl text-left hover:bg-emerald-50/30 transition-all duration-300 shadow-sm shadow-emerald-500/5">
                            <div>
                              <div className="flex items-center gap-1 xs:gap-1.5 mb-1.5 xs:mb-2">
                                <div className="w-4 h-4 xs:w-5 xs:h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                                  <CheckCircle2 size={10} xs:size={12} />
                                </div>
                                <span className="text-[8px] xs:text-[9px] font-black text-emerald-800 uppercase tracking-wider xs:tracking-widest">
                                  {t('section.market.SERE')}
                                </span>
                              </div>

                              <h5 className="text-xs xs:text-sm font-black text-emerald-950 mb-1 xs:mb-1.5 leading-snug">
                                {comparisonFeatures[activeCompareTab].sere}
                              </h5>

                              <p className="text-[10px] xs:text-[11px] font-bold text-slate-700 leading-relaxed mb-3 xs:mb-4">
                                {comparisonFeatures[activeCompareTab].sereDetail}
                              </p>
                            </div>

                            {/* Visual Widget */}
                            {renderVisualWidget(comparisonFeatures[activeCompareTab].metricType, true)}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </SectionWrapper>

        {/* 5. Product Options / Capacity Options */}
        <SectionWrapper className="w-full pt-10 md:pt-14 pb-20 md:pb-32 px-4 md:px-12 bg-surface" id="capacity">
          <div className="max-w-screen-2xl mx-auto">
            <div className="mb-12 md:mb-20 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full font-label text-xs font-bold text-emerald-800 tracking-widest uppercase mb-4 border border-emerald-200/50">{t('hero.capacity')}</span>
              <h2 className="font-headline text-3xl md:text-6xl font-black text-on-surface tracking-tight mb-6">{t('section.infra.title')}</h2>
              <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto font-medium">{t('section.infra.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
              {[
                {
                  id: "120",
                  title: t('section.infra.120.title'),
                  eggs: "120",
                  desc: t('section.infra.120.desc'),
                  badge: "SPECIALTY BREEDING",
                  isFeatured: false,
                  cta: 'preorder_120',
                  specs: [
                    "120 Chicken Eggs capacity",
                    "80W Low Power (Solar Ready)",
                    "Automatic Turning (Every 2h)",
                    "Single Zone Thermal Control"
                  ]
                },
                {
                  id: "200",
                  title: t('section.infra.200.title'),
                  eggs: "200",
                  desc: t('section.infra.200.desc'),
                  badge: "MOST POPULAR",
                  isFeatured: true,
                  cta: 'preorder_200',
                  specs: [
                    "200 Chicken Eggs capacity",
                    "120W Low Power (Solar Ready)",
                    "Guaranteed 90% Hatch Rate",
                    "Dual Zone Thermal Control"
                  ]
                },
                {
                  id: "500",
                  title: t('section.infra.500.title'),
                  eggs: "500",
                  desc: t('section.infra.500.desc'),
                  badge: "COMMERCIAL GROW",
                  isFeatured: false,
                  cta: 'inquire_500',
                  specs: [
                    "500 Chicken Eggs capacity",
                    "250W Power (Solar Ready)",
                    "Ultrasonic Auto-Humidity",
                    "Smart API Data Logging"
                  ]
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={(e) => handleOpenWizard(e, `preorder_${item.id}`)}
                  className={`group relative rounded-[2.5rem] border p-6 flex flex-col justify-between transition-all duration-500 cursor-pointer shadow-sm hover:shadow-2xl overflow-hidden hover:-translate-y-2 ${item.isFeatured
                    ? "bg-slate-900 border-emerald-500/40 text-white shadow-emerald-950/20 scale-105 z-10"
                    : "bg-white border-outline-variant text-on-surface hover:border-emerald-500/20"
                    }`}
                >
                  {/* Card visual showcase */}
                  <div className="relative rounded-[1.75rem] overflow-hidden aspect-[16/10] mb-6 border border-emerald-500/5 bg-slate-100">
                    <img
                      src="/media/sere-120.webp"
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black tracking-wider shadow-sm uppercase ${item.isFeatured ? "bg-emerald-500 text-slate-950" : "bg-slate-900 text-white"
                      }`}>
                      {item.badge}
                    </div>
                  </div>

                  {/* Header Text */}
                  <div className="mb-4">
                    <h3 className={`font-headline font-black text-2xl mb-1 ${item.isFeatured ? "text-emerald-400" : "text-on-surface"}`}>
                      {item.title}
                    </h3>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-4xl font-extrabold tracking-tight">{item.eggs}</span>
                      <span className={`text-sm font-medium ${item.isFeatured ? "text-slate-400" : "text-on-surface-variant"}`}>{t('hero.eggs')}</span>
                    </div>
                    <p className={`text-sm font-medium leading-relaxed mb-6 ${item.isFeatured ? "text-slate-300" : "text-on-surface-variant"}`}>
                      {item.desc}
                    </p>
                  </div>

                  {/* Specs Bullets List */}
                  <ul className="space-y-3 mb-20 text-left relative z-10 border-t pt-5 border-outline-variant/10">
                    {item.specs.map((spec, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-2.5 text-xs font-semibold">
                        <CheckCircle2 size={16} className={item.isFeatured ? "text-emerald-400 shrink-0" : "text-emerald-700 shrink-0"} />
                        <span className={item.isFeatured ? "text-slate-200" : "text-on-surface-variant"}>{spec}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Bottom Action Area with Circular arrow button */}
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-outline-variant/10">
                    <span className={`text-xs font-black tracking-widest uppercase ${item.isFeatured ? "text-emerald-400" : "text-primary"}`}>
                      {item.id === "500" ? t('section.infra.inquire.cta') : t('hero.cta')}
                    </span>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-x-1 group-hover:scale-105 ${item.isFeatured ? "bg-white text-slate-950 hover:bg-emerald-50" : "bg-emerald-700 text-white hover:bg-emerald-800"
                      }`}>
                      <ArrowRight size={20} className="transition-transform duration-300 group-hover:rotate-45" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* 6. Why Trust Sere */}
        <SectionWrapper className="w-full py-20 px-6 md:px-12 bg-surface-container-low border-y border-outline-variant/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>

          <div className="max-w-screen-xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/40 border border-emerald-300/30 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm backdrop-blur-sm rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse-soft"></span>
                TRUST & COMPLIANCE
              </span>
              <h2 className="font-headline text-3xl md:text-5xl font-black text-on-surface mb-4 tracking-tight">{t('section.trust.title')}</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-green-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Cpu, title: t('section.trust.feat1.title'), desc: t('section.trust.feat1.desc'), index: "01" },
                { icon: Thermometer, title: t('section.trust.feat2.title'), desc: t('section.trust.feat2.desc'), index: "02" },
                { icon: ShieldCheck, title: t('section.trust.feat3.title'), desc: t('section.trust.feat3.desc'), index: "03" }
              ].map((feat, i) => {
                const IconComponent = feat.icon;
                return (
                  <motion.div
                    key={i}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group p-8 bg-white rounded-[2.25rem] border border-outline shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(21,128,61,0.05)] hover:border-emerald-500/20 transition-all duration-500 flex flex-col justify-between relative overflow-hidden cursor-default"
                  >
                    {/* Background giant index number */}
                    <div className="absolute top-2 right-4 text-emerald-500/5 font-headline font-black text-8xl pointer-events-none select-none transition-colors group-hover:text-emerald-500/10">
                      {feat.index}
                    </div>

                    <div className="relative z-10 text-left">
                      {/* Icon with glowing wrapper */}
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-all duration-500 shadow-inner">
                        <IconComponent size={26} strokeWidth={2} className="group-hover:rotate-12 transition-transform duration-300" />
                      </div>

                      <h3 className="font-headline text-xl font-extrabold mb-3 text-slate-900 group-hover:text-primary transition-colors tracking-tight">
                        {feat.title}
                      </h3>
                      <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
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
                    <img src="/media/Team-Section/IMG_9667.JPG" alt="Vidhya Gaikwad" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" style={{ objectPosition: '80% 25%' }} />
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
                    <img src="/media/Team-Section/IMG_4234.PNG" alt="Aditya Magar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" style={{ objectPosition: 'center 20%' }} />
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
        <SectionWrapper className="w-full pt-20 pb-28 px-6 md:px-12 bg-surface border-y border-outline-variant/30 relative overflow-hidden" id="machine-process">
          {/* Subtle background glows */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-screen-xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100/40 border border-emerald-300/30 text-emerald-800 text-xs font-bold uppercase tracking-[0.15em] mb-4 shadow-sm backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse-soft"></span>
                STEP-BY-STEP WORKFLOW
              </span>
              <h2 className="font-headline text-3xl md:text-5xl font-black text-on-surface mb-4 tracking-tight">{t('section.process.title')}</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-green-600 mx-auto rounded-full"></div>
              <p className="text-on-surface-variant font-medium text-lg mt-4 max-w-xl mx-auto">{t('section.process.subtitle')}</p>
            </div>

            <div className="grid lg:grid-cols-[1.1fr_1.9fr] gap-12 lg:gap-16 items-center max-w-5xl mx-auto">
              {/* Left Column: Vertical Video Theater (App Demo style) */}
              <div className="relative w-full max-w-sm mx-auto lg:max-w-none group/theater">
                {/* Visual phone screen bezel framing */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/10 to-green-500/5 rounded-[3rem] blur-2xl opacity-75"></div>

                <div className="relative rounded-[2.75rem] p-3 bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden aspect-[9/16] flex items-center justify-center">
                  {/* Phone notch details */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20" />

                  {/* Phase live diagnostic badge */}
                  <span className="absolute top-6 left-6 z-20 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[8px] font-bold text-white uppercase tracking-widest border border-slate-800/60 shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    PHASE {activeStep + 1} LIVE
                  </span>

                  <div className="w-full h-full rounded-[2.25rem] overflow-hidden relative bg-slate-950 flex items-center justify-center">
                    {/* Metallic sheen reflect animation */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none z-10 skew-x-12 translate-x-full group-hover/theater:translate-x-[-150%] transition-transform duration-1000"></div>

                    <AnimatePresence mode="wait">
                      {activeStep === 0 && (
                        <motion.img
                          key="step-image-0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          src="/media/gallery-farmer-design.jpg"
                          alt="Modular loading"
                          className="w-full h-full object-cover"
                        />
                      )}
                      {activeStep === 1 && (
                        <motion.img
                          key="step-image-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          src="/media/gallery-healthy-hatch.jpg"
                          alt="Incubation Climate"
                          className="w-full h-full object-cover"
                        />
                      )}
                      {activeStep === 2 && (
                        <motion.img
                          key="step-image-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          src="/media/Machine%20process/IMG_3706.jpg"
                          alt="Egg Candling"
                          className="w-full h-full object-cover"
                        />
                      )}
                      {activeStep === 3 && (
                        <motion.img
                          key="step-image-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          src="/media/Machine%20process/IMG_4238.jpg"
                          alt="Hatching chicks yield"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Right Column: Process Interactive Steps Timeline */}
              <div className="relative flex flex-col justify-center py-4">
                {/* Vertical Timeline Guide Line */}
                <div className="absolute left-7 top-6 bottom-6 w-[2px] bg-slate-200/60 pointer-events-none z-0"></div>

                {[
                  {
                    id: 0,
                    step: "01",
                    title: t('section.process.loading'),
                    desc: "Modular egg loading setup. Snaps in place safely to prevent any accidental dynamic shifting or eggs bumping during automatic rotation cycles.",
                    icon: "layers",
                    meta: { A: "Prep State", valA: "Ready", B: "Tray Type", valB: "Grid-Lock", C: "Secure Lock", valC: "OK" }
                  },
                  {
                    id: 1,
                    step: "02",
                    title: t('section.process.incubation'),
                    desc: "Precision climate incubation. Uses automated egg-rolling mechanics (mimicking natural hen movements) coupled with dynamic humidity sensors.",
                    icon: "device_thermostat",
                    meta: { A: "Target Temp", valA: "37.52°C", B: "Target RH", valB: "55.4%", C: "Roll Servo", valC: "ACTIVE" }
                  },
                  {
                    id: 2,
                    step: "03",
                    title: t('section.process.candling'),
                    desc: "Verifying growth. At regular intervals, integrated LED arrays candle the eggs to confirm embryo health, allowing early removal of unfertile batches.",
                    icon: "highlight",
                    meta: { A: "LED Array", valA: "Active", B: "Scan Log", valB: "Factory L.", C: "Growth Check", valC: "PASS" }
                  },
                  {
                    id: 3,
                    step: "04",
                    title: t('section.process.hatching'),
                    desc: "Yield stage emergence. In the final hatching stage, the chicks safely emerge in a temperature-controlled incubator, achieving consistent 90% rates.",
                    icon: "egg_alt",
                    meta: { A: "Cabinet Mode", valA: "Hatching", B: "Est. Yield", valB: "90%+", C: "Hatch Cycle", valC: "COMPLETED" }
                  }
                ].map((item) => {
                  const isActive = activeStep === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveStep(item.id)}
                      className={`group relative z-10 flex gap-6 p-5 sm:p-6 mb-4 last:mb-0 rounded-[1.75rem] border transition-all duration-550 cursor-pointer text-left ${isActive
                        ? "bg-emerald-50/20 border-emerald-500/20 shadow-sm"
                        : "bg-transparent border-transparent hover:bg-slate-50/50"
                        }`}
                    >
                      {/* Step index dot */}
                      <div className={`flex shrink-0 w-14 h-14 rounded-2xl items-center justify-center font-headline font-black text-lg transition-all duration-500 shadow-sm ${isActive
                        ? "bg-emerald-700 text-white shadow-emerald-700/25 scale-105"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                        }`}>
                        {item.step}
                      </div>

                      {/* Content block */}
                      <div className="space-y-1 self-center w-full">
                        <h3 className={`font-headline font-extrabold text-lg transition-colors duration-305 ${isActive ? "text-primary" : "text-slate-900"
                          }`}>
                          {item.title}
                        </h3>
                        {/* Expanded details only for active step */}
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden mt-1.5"
                            >
                              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed mb-3">
                                {item.desc}
                              </p>
                              {/* Small Diagnostics Bar */}
                              <div className="grid grid-cols-3 gap-2 border-t border-slate-200/50 pt-3">
                                <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-100">
                                  <span className="block text-[7px] font-bold text-slate-450 uppercase tracking-wider">{item.meta.A}</span>
                                  <span className="text-[10px] font-bold text-slate-700">{item.meta.valA}</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-100">
                                  <span className="block text-[7px] font-bold text-slate-450 uppercase tracking-wider">{item.meta.B}</span>
                                  <span className="text-[10px] font-bold text-slate-700">{item.meta.valB}</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-100">
                                  <span className="block text-[7px] font-bold text-slate-450 uppercase tracking-wider">{item.meta.C}</span>
                                  <span className="text-[10px] font-black text-green-700 uppercase tracking-wide">{item.meta.valC}</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
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
