import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, X, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LanguageSelectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageSelection({ isOpen, onClose }: LanguageSelectionProps) {
  const { language: selectedLang, setLanguage, t } = useLanguage();

  useEffect(() => {
    // Note: Auto-open logic is now handled by the caller or by a separate effect if needed
  }, []);

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
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md overflow-y-auto">
            <div className="fixed inset-0" onClick={onClose} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-[92%] sm:max-w-[380px] rounded-[2rem] p-5 sm:p-6 md:p-8 shadow-2xl border border-green-100 relative z-10 my-auto"
            >
              {/* Decorative Background Elements */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-black/40 hover:text-black transition-colors"
              >
                <X size={16} />
              </button>

              <div className="text-center mb-6">
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-inner"
                >
                  <Globe className="text-green-700 w-6 h-6 sm:w-7 sm:h-7" />
                </motion.div>
                <h2 className="font-headline text-xl sm:text-2xl font-black text-black tracking-tight">Choose Language</h2>
                <p className="text-black/50 text-xs sm:text-sm mt-1 sm:mt-2 leading-relaxed">Customize your experience by selecting your preferred language.</p>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {languages.map((lang, idx) => (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={lang.name}
                    onClick={() => handleSelect(lang.name)}
                    whileHover={{ scale: 1.01 }}
                    className={`w-full p-3 sm:p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between group relative overflow-hidden ${selectedLang === lang.name
                      ? 'border-green-600 bg-green-50/50'
                      : 'border-green-100 hover:border-green-300 hover:bg-green-50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-sm sm:text-base transition-colors ${selectedLang === lang.name ? 'bg-green-600 text-white' : 'bg-green-50 text-black/40 group-hover:bg-green-100 group-hover:text-green-600'
                        }`}>
                        {lang.native[0]}
                      </div>
                      <div className="text-left">
                        <div className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.1em] text-green-700/60">{lang.name}</div>
                        <div className="text-sm sm:text-base font-black text-black">{lang.native}</div>
                      </div>
                    </div>

                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedLang === lang.name ? 'border-green-600 bg-green-600 text-white scale-110' : 'border-green-200 group-hover:border-green-300'
                      }`}>
                      {selectedLang === lang.name && <Check size={12} strokeWidth={3} />}
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-green-100">
                <button
                  onClick={onClose}
                  className="w-full bg-black text-white py-3 rounded-xl font-black text-sm shadow-xl hover:bg-green-700 hover:scale-[1.01] transition-all"
                >
                  Continue / आगे बढ़ें
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
