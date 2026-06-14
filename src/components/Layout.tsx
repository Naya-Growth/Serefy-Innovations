import { Link, Outlet, useLocation } from 'react-router-dom';
import { siteConfig } from '../config/siteConfig';
import LanguageSelection from './LanguageSelection';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import NayaGrowthSignature from './NayaGrowthSignature';
import DeveloperBadge from './DeveloperBadge';

export default function Layout() {
  const location = useLocation();
  const { t, language: selectedLang } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    const shareData = {
      title: siteConfig.brand.name,
      text: t('share.text'),
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.log('Web Share failed or cancelled, falling back to copy:', err);
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setToastMessage(t('share.copied'));
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Could not copy text: ', err);
      setToastMessage('Could not copy link');
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
    }
  };

  // Open language modal on mount (refresh)
  useEffect(() => {
    setIsLangModalOpen(true);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navItems = ['Technology', 'Metrics', 'Gallery', 'Contact'];

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-green-500/10 overflow-x-hidden">
      {/* Modern Minimalist Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-green-100">
        <div className="flex justify-between items-center px-4 md:px-6 py-3 md:py-4 w-full max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="h-10 md:h-14 flex items-center justify-center">
              <img
                src="/logo-master-tight-crop.png"
                srcSet="/logo-320w.png 320w, /logo-480w.png 480w, /logo-768w.png 768w, /logo-1024w.png 1024w, /logo-1366w.png 1366w, /logo-1440w.png 1440w, /logo-1920w.png 1920w, /logo-2560w.png 2560w"
                sizes="(max-width: 640px) 120px, (max-width: 768px) 160px, (max-width: 1024px) 200px, 240px"
                alt={siteConfig.brand.name}
                className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105 scale-110"
                style={{ filter: 'brightness(1.05) contrast(1.1)' }}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            {navItems.map((item) => {
              const path = `/${item.toLowerCase()}`;
              const isActive = location.pathname === path;
              const translationKey = `nav.${item.toLowerCase()}`;
              return (
                <Link
                  key={item}
                  to={path}
                  className={`transition-all font-black uppercase tracking-[0.1em] text-xs md:text-sm relative py-1 ${isActive ? 'text-green-700 border-b-2 border-green-700' : 'text-black/70 hover:text-green-700'}`}
                >
                  {t(translationKey)}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop Language Switcher */}
            <button
              onClick={() => setIsLangModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl border border-green-200 hover:border-green-500/50 hover:bg-green-50 hover:scale-[1.02] transition-all text-xs font-bold text-black/70"
            >
              <Globe size={14} className="text-green-600" />
              <span>{selectedLang}</span>
            </button>

            <Link to="/contact" className="hidden sm:block bg-black text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-black text-xs md:text-sm hover:bg-green-700 hover:shadow-xl hover:shadow-green-500/20 hover:-translate-y-0.5 hover:scale-[1.02] transition-all active:scale-95 uppercase tracking-widest">
              {t('nav.getStarted')}
            </Link>

            {/* Mobile Language & Menu Toggle */}
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={() => setIsLangModalOpen(true)}
                className="p-2 text-black/60 hover:bg-green-50 rounded-xl transition-colors"
                aria-label="Change Language"
              >
                <Globe size={20} />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-black hover:bg-green-50 rounded-xl transition-colors"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[40] md:hidden"
              />
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                className="md:hidden bg-white border-t border-green-100 overflow-hidden relative z-[50] shadow-2xl"
              >
                <div className="flex flex-col p-6 gap-2">
                  {navItems.map((item) => {
                    const path = `/${item.toLowerCase()}`;
                    const isActive = location.pathname === path;
                    const translationKey = `nav.${item.toLowerCase()}`;
                    return (
                      <Link
                        key={item}
                        to={path}
                        className={`transition-all font-black uppercase tracking-[0.2em] text-sm py-4 border-b border-green-50 last:border-0 ${isActive ? 'text-green-700' : 'text-black/60'}`}
                      >
                        {t(translationKey)}
                      </Link>
                    );
                  })}
                  <Link
                    to="/contact"
                    className="bg-black text-white px-6 py-5 rounded-3xl font-black text-center text-sm mt-4 uppercase tracking-widest hover:bg-green-700 hover:scale-[1.02] transition-all"
                  >
                    {t('nav.getStarted')}
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* High-Contrast Professional Footer */}
      <footer className="bg-black text-white w-full pt-20 pb-10 mt-auto relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 px-8 max-w-7xl mx-auto relative z-10">
          <div className="md:col-span-5">
            <div className="text-3xl font-black text-white mb-6 flex items-center gap-3">
              <div className="flex items-center justify-center h-16 sm:h-20 md:h-28 w-auto">
                <img
                  src="/logo-white-master.png"
                  srcSet="/logo-white-320w.png 320w, /logo-white-480w.png 480w, /logo-white-768w.png 768w, /logo-white-1024w.png 1024w, /logo-white-1366w.png 1366w, /logo-white-1440w.png 1440w, /logo-white-1920w.png 1920w, /logo-white-2560w.png 2560w"
                  sizes="(max-width: 640px) 240px, (max-width: 768px) 300px, (max-width: 1024px) 360px, 400px"
                  alt={siteConfig.brand.name}
                  className="h-full w-auto object-contain scale-110"
                />
              </div>
            </div>
            <p className="text-white text-lg leading-relaxed max-w-md mb-8 font-black opacity-100">
              {t('footer.desc')}
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-green-600 hover:border-green-600 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                aria-label="Share"
              >
                <span className="material-symbols-outlined text-xl">share</span>
              </button>
              <a
                href="#"
                className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-green-600 hover:border-green-600 hover:scale-[1.02] transition-all duration-300"
                aria-label="RSS Feed"
              >
                <span className="material-symbols-outlined text-xl">rss_feed</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h5 className="text-green-500 font-black uppercase text-xs tracking-[0.4em] mb-8">{t('footer.partners')}</h5>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-start group">
                <div className="bg-white/5 p-4 rounded-3xl border border-white/10 group-hover:border-green-500/30 transition-all duration-500">
                  <img src="/media/aic-mahindra.webp" alt="AIC Mahindra" className="h-16 md:h-20 w-auto object-contain" />
                </div>
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-4 ml-1">{t('footer.incubation')}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4">
            <h5 className="text-green-500 font-black uppercase text-xs tracking-[0.4em] mb-8">{t('footer.contact')}</h5>
            <div className="flex flex-col gap-4 text-white/80 text-sm font-medium">
              <p>{siteConfig.brand.address}</p>
              <p>
                <a href={`mailto:${siteConfig.brand.email}`} className="hover:text-green-400 transition-colors">
                  {siteConfig.brand.email}
                </a>
              </p>
              <p>
                <a href={`tel:${siteConfig.brand.phone.replace(/\s+/g, '')}`} className="hover:text-green-400 transition-colors">
                  {siteConfig.brand.phone}
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 px-8 max-w-7xl mx-auto">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} {siteConfig.brand.name}. {t('footer.rights')}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <NayaGrowthSignature eyebrow={t('footer.devBy')} />
            <DeveloperBadge />
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${siteConfig.brand.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 md:bottom-10 right-6 md:right-8 z-[9999] w-12 h-12 md:w-14 md:h-14 bg-[#25D366] text-white rounded-3xl flex items-center justify-center shadow-2xl hover:scale-[1.15] active:scale-90 transition-all group overflow-hidden"
        aria-label="Contact on WhatsApp"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <svg className="w-6 h-6 md:w-7 md:h-7 fill-current relative z-10" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      <LanguageSelection isOpen={isLangModalOpen} onClose={() => setIsLangModalOpen(false)} />

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[10000] bg-black/90 text-white px-6 py-3.5 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
              <span className="material-symbols-outlined text-green-400 text-sm font-bold">check</span>
            </div>
            <span className="text-xs md:text-sm font-black tracking-wide uppercase">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
