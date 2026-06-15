import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Linkedin } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function DeveloperBadge() {
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState<{ bottom: number; right: number } | null>(null);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return true;
  });

  const linkedinUrl = "https://www.linkedin.com/in/bhavya-mishra-7a3b09324/";

  const updatePosition = () => {
    const mobile = window.innerWidth < 640;
    setIsMobile(mobile);
    
    if (!mobile) {
      const pill = document.getElementById('developer-badge-pill');
      if (pill) {
        const rect = pill.getBoundingClientRect();
        
        let rightVal = window.innerWidth - rect.right;
        const bottomVal = window.innerHeight - rect.top + 12; // 12px space above the badge
        
        // Prevent horizontal overflow:
        if (rightVal > window.innerWidth - 304) {
          rightVal = window.innerWidth - 304;
        }
        
        // Ensure rightVal is at least 16px from the right edge as well
        if (rightVal < 16) {
          rightVal = 16;
        }

        setCoords({
          bottom: bottomVal,
          right: rightVal,
        });
      }
    }
  };

  // Trigger a subtle confetti burst when card opens to wow the user
  useEffect(() => {
    if (isCardOpen) {
      const rect = document.getElementById('developer-badge-pill')?.getBoundingClientRect();
      if (rect) {
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top) / window.innerHeight;
        import('canvas-confetti').then((module) => {
          module.default({
            particleCount: 35,
            spread: 55,
            origin: { x, y },
            colors: ['#10b981', '#fbbf24', '#3b82f6'],
            disableForReducedMotion: true
          });
        });
      }
    }
  }, [isCardOpen]);

  useEffect(() => {
    if (isCardOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, { capture: true, passive: true });
    }
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isCardOpen]);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCardOpen((prev) => {
      const next = !prev;
      if (!next) {
        setCoords(null);
      }
      return next;
    });
  };

  const mobileView = typeof window !== 'undefined' ? window.innerWidth < 640 : true;

  return (
    <div className="relative inline-block text-left font-sans">
      {/* Floating Developer Portfolio Card */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isCardOpen && (mobileView || coords !== null) && (
              <>
                {/* Backdrop overlay to close when clicking outside */}
                <motion.div
                  key="developer-badge-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setIsCardOpen(false);
                    setCoords(null);
                  }}
                  className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
                />
                
                <motion.div
                  key="developer-badge-card"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="fixed z-50 text-white overflow-hidden bg-neutral-950/95 border border-white/10 backdrop-blur-2xl p-4 rounded-2xl shadow-[0_24px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col gap-3 w-[calc(100vw-2rem)] sm:w-72"
                  style={
                    mobileView
                      ? { bottom: '96px', left: '16px', right: '16px' }
                      : coords
                      ? { bottom: `${coords.bottom}px`, right: `${coords.right}px` }
                      : { bottom: '96px', right: '32px' }
                  }
                >
                  {/* Subtle dynamic background glow orbs */}
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                  {/* Close Button */}
                  <button
                    onClick={() => {
                      setIsCardOpen(false);
                      setCoords(null);
                    }}
                    className="absolute top-3 right-3 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 p-1 rounded-full transition-all duration-200 active:scale-90 cursor-pointer"
                    aria-label="Close card"
                  >
                    <X size={12} className="transition-transform duration-300 hover:rotate-90" />
                  </button>

                  {/* Card Header */}
                  <div className="flex items-center gap-2.5 mt-0.5">
                    {/* Visual Initials Avatar Box with custom gradient border */}
                    <div className="relative group shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-yellow-500 rounded-lg blur opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
                      <div className="relative w-10 h-10 rounded-lg bg-neutral-900 border border-white/10 p-[1.5px] flex items-center justify-center overflow-hidden bg-gradient-to-tr from-emerald-500 to-yellow-500">
                        <div className="w-full h-full bg-neutral-950 rounded-[7px] flex items-center justify-center">
                          <span className="font-extrabold text-sm bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
                            B
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <h4 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                        Bhavya Mishra
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0 animate-pulse" />
                      </h4>
                      <span className="text-[10px] font-semibold text-neutral-400 mt-0.5">
                        Frontend Developer
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-white/10 w-full" />

                  {/* Bio Description */}
                  <p className="text-[11px] text-neutral-300 leading-relaxed font-normal">
                    I design and build high-performance web applications with clean interactions, modern aesthetics, and seamless animations. Let's create something outstanding!
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col gap-2 mt-0.5 w-full">
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-[11px] py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-300 shadow-md hover:shadow-emerald-500/20 active:scale-[0.98] cursor-pointer"
                    >
                      Connect on LinkedIn
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )
      }

      {/* Main Pill-Shaped Badge */}
      <div
        id="developer-badge-pill"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center bg-neutral-900/90 hover:bg-neutral-900/95 border border-white/10 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden p-2.5 select-none relative group transition-all duration-300 hover:border-emerald-500/30 hover:shadow-emerald-950/20 cursor-pointer"
        onClick={handleLogoClick}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-full" />

        {/* Custom logo representing Bhavya */}
        <div
          className={`w-10 h-10 bg-neutral-950 border border-white/10 rounded-full flex items-center justify-center shadow-inner relative group/logo cursor-pointer transition-all duration-300 shrink-0 ${
            isCardOpen ? 'ring-2 ring-emerald-500/50 border-transparent' : ''
          }`}
        >
          <div className="absolute inset-0 bg-emerald-500/10 rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300 blur-sm" />
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 transition-all duration-500 group-hover/logo:rotate-12 group-hover/logo:scale-105"
          >
            <defs>
              <linearGradient id="b-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="60%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <path
              d="M 9 6 H 14.5 C 16.8 6, 18.5 7.2, 18.5 9.5 C 18.5 11.2, 17.2 12, 15 12 H 9 V 22 H 16 C 18.2 22, 19.8 20.8, 19.8 18.5 C 19.8 16.2, 18.2 15, 15.5 15"
              stroke="url(#b-logo-gradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M 9 5 V 23"
              stroke="url(#b-logo-gradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 17 9.5 L 21.5 5 M 21.5 5 H 17.5 M 21.5 5 V 9"
              stroke="#f59e0b"
              strokeWidth="2.0"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        <div
          className="flex items-center pl-3 pr-2 text-left cursor-pointer group/txt"
        >
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-neutral-400 tracking-[0.2em] leading-none uppercase transition-colors group-hover/txt:text-emerald-400">
              Developed By
            </span>
            <div className="flex items-center mt-1">
              <span className="text-sm font-extrabold text-white tracking-tight leading-none">
                Bhavya
              </span>
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                    animate={{ opacity: 1, width: 'auto', marginLeft: 4 }}
                    exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="text-[10px] font-bold text-neutral-400 tracking-wide overflow-hidden whitespace-nowrap pt-[2px]"
                  >
                    Mishra
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="h-6 w-[1px] bg-white/10 mx-2 shrink-0" />

        <div className="flex items-center gap-1.5 pr-1 shrink-0">
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:border-transparent hover:scale-105 active:scale-95 transition-all duration-300 hover:bg-gradient-to-br hover:from-sky-500 hover:to-blue-600 hover:shadow-lg hover:shadow-blue-500/25"
            aria-label="Bhavya's LinkedIn Profile"
          >
            <Linkedin size={13} className="fill-current" />
          </a>
        </div>
      </div>
    </div>
  );
}
