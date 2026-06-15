import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, X, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { createPortal } from 'react-dom';

interface LanguageSelectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageSelection({ isOpen, onClose }: LanguageSelectionProps) {
  const { language: selectedLang, setLanguage } = useLanguage();

  const handleSelect = (lang: string) => {
    setLanguage(lang as any);
    onClose();
  };

  const languages = [
    { name: 'English', native: 'English', desc: 'Global Standard' },
    { name: 'Hindi', native: 'हिन्दी', desc: 'मातृभाषा' },
    { name: 'Marathi', native: 'मराठी', desc: 'प्रादेशिक' }
  ];

  return (
    <>
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                {/* Backdrop overlay with hardware-accelerated fade */}
                <motion.div
                  key="language-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={onClose}
                  className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
                />

                {/* Main Card with smooth, lag-free spring transition */}
                <motion.div
                  key="language-card"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  className="bg-white w-full max-w-[340px] rounded-[1.75rem] p-5 shadow-[0_24px_50px_rgba(0,0,0,0.25)] border border-green-50/50 relative z-10 my-auto flex flex-col gap-4 overflow-hidden"
                >
                  {/* Decorative Background Elements */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-7.5 h-7.5 rounded-full bg-neutral-100 flex items-center justify-center text-black/40 hover:text-black hover:bg-neutral-200 active:scale-95 transition-all duration-200"
                    aria-label="Close modal"
                  >
                    <X size={14} />
                  </button>

                  <div className="text-center">
                    <div className="w-11 h-11 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner group/globe">
                      <Globe className="text-green-700 w-5.5 h-5.5 transition-transform duration-500 group-hover/globe:rotate-12" />
                    </div>
                    <h2 className="font-headline text-lg font-black text-black tracking-tight">Choose Language</h2>
                    <p className="text-black/50 text-[11px] mt-1.5 leading-relaxed max-w-[240px] mx-auto">
                      Customize your experience by selecting your preferred language.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {languages.map((lang) => (
                      <button
                        key={lang.name}
                        onClick={() => handleSelect(lang.name)}
                        className={`w-full p-3 rounded-xl border transition-all duration-200 flex items-center justify-between group relative overflow-hidden active:scale-[0.99] cursor-pointer ${
                          selectedLang === lang.name
                            ? 'border-green-600 bg-green-50/30'
                            : 'border-neutral-100 hover:border-green-200 hover:bg-green-50/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm transition-colors ${
                            selectedLang === lang.name ? 'bg-green-600 text-white' : 'bg-green-50 text-black/40 group-hover:bg-green-100 group-hover:text-green-600'
                          }`}>
                            {lang.native[0]}
                          </div>
                          <div className="text-left">
                            <div className="text-[8px] font-black uppercase tracking-[0.1em] text-green-700/60">{lang.name}</div>
                            <div className="text-sm font-black text-black leading-none mt-1">{lang.native}</div>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedLang === lang.name ? 'border-green-600 bg-green-600 text-white scale-105' : 'border-green-200 group-hover:border-green-300'
                        }`}>
                          {selectedLang === lang.name && <Check size={10} strokeWidth={3} />}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-1 pt-3.5 border-t border-neutral-100">
                    <button
                      onClick={onClose}
                      className="w-full bg-black hover:bg-green-700 text-white py-3.5 rounded-xl font-bold text-xs shadow-xl active:scale-[0.98] transition-all duration-200 uppercase tracking-widest cursor-pointer"
                    >
                      Continue / आगे बढ़ें
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )
      }
    </>
  );
}
