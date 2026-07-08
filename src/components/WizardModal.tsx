import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Leaf, LayoutGrid, Briefcase, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export interface WizardFormData {
  role: string;
  capacity: string;
  partnershipType: string;
  goal: string;
  timeline: string;
  message: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
}

interface WizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WizardFormData) => Promise<void> | void;
  isSubmitting?: boolean;
  submitError?: string;
}

const initialFormData: WizardFormData = {
  role: '',
  capacity: '',
  partnershipType: '',
  goal: '',
  timeline: '',
  message: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: ''
};

export default function WizardModal({ isOpen, onClose, onSubmit, isSubmitting = false, submitError = '' }: WizardModalProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<WizardFormData>(initialFormData);
  const totalSteps = 5;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset after closing animation 
      setTimeout(() => {
        setStep(1);
        setFormData(initialFormData);
      }, 300);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleNext = () => {
    if (step === 1 && !formData.role) return;
    if (step === 2 && (formData.role === 'farmer' || formData.role === 'hobbyist') && !formData.capacity) return;
    if (step === 2 && formData.role === 'investor' && !formData.partnershipType) return;
    if (step === 3 && (formData.role === 'farmer' || formData.role === 'hobbyist') && !formData.goal) return;
    if (step === 3 && formData.role === 'investor' && !formData.timeline) return;
    setStep((s) => s + 1);
  };

  const handlePrev = () => {
    setStep((s) => s - 1);
  };

  const handleSelectionNext = (nextData: WizardFormData) => {
    setFormData(nextData);
    window.setTimeout(() => {
      setStep((s) => Math.min(s + 1, totalSteps));
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 xs:p-4 sm:p-6 bg-surface-container-lowest/80 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-surface w-full max-w-[500px] xs:max-w-xl rounded-2xl xs:rounded-3xl shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden border border-outline-variant/30"
      >
        <div className="flex justify-between items-center p-4 xs:p-5 sm:p-6 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="font-label text-[10px] xs:text-xs font-bold text-primary uppercase tracking-widest">{t('wizard.step')} {step} {t('wizard.of')} {totalSteps}</span>
          </div>
          <button onClick={onClose} className="p-1.5 xs:p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
            <X size={16} xs:size={20} />
          </button>
        </div>

        <div className="p-4 xs:p-5 sm:p-6 md:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="font-headline text-xl xs:text-2xl font-bold text-on-surface mb-2">{t('wizard.step1.title')}</h3>
                <p className="text-on-surface-variant mb-4 xs:mb-6 text-xs xs:text-sm">{t('wizard.step1.desc')}</p>
                <div className="grid grid-cols-1 gap-3 xs:gap-4">
                  {[
                    { id: 'farmer', title: t('wizard.role.farmer'), icon: Leaf, desc: t('wizard.role.farmer.desc') },
                    { id: 'hobbyist', title: t('wizard.role.hobbyist'), icon: LayoutGrid, desc: t('wizard.role.hobbyist.desc') },
                    { id: 'investor', title: t('wizard.role.investor'), icon: Briefcase, desc: t('wizard.role.investor.desc') }
                  ].map((role) => (
                    <button
                      key={role.id}
                      onClick={() => handleSelectionNext({ ...formData, role: role.id })}
                      className={`flex items-center p-3 xs:p-4 rounded-2xl xs:rounded-3xl border-2 text-left hover:scale-[1.02] transition-all ${formData.role === role.id ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-outline bg-surface'}`}
                    >
                      <div className={`w-10 xs:w-12 h-10 xs:h-12 rounded-xl xs:rounded-2xl flex items-center justify-center shrink-0 mr-3 xs:mr-4 ${formData.role === role.id ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                        <role.icon size={18} xs:size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="font-headline font-bold text-base xs:text-lg text-on-surface">{role.title}</div>
                        <div className="text-on-surface-variant text-xs xs:text-sm">{role.desc}</div>
                      </div>
                      <ChevronRight className={`transition-opacity ${formData.role === role.id ? 'opacity-100 text-primary' : 'opacity-0'}`} size={16} xs:size={20} />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {(formData.role === 'farmer' || formData.role === 'hobbyist') ? (
                  <>
                     <h3 className="font-headline text-xl xs:text-2xl font-bold text-on-surface mb-2">{t('wizard.step2.capacity.title')}</h3>
                     <p className="text-on-surface-variant mb-4 xs:mb-6 text-xs xs:text-sm">{t('wizard.step2.capacity.desc')}</p>
                     <div className="grid grid-cols-1 gap-3 xs:gap-4">
                       {['120', '200', '500'].map((cap) => (
                         <button
                           key={cap}
                           onClick={() => handleSelectionNext({ ...formData, capacity: cap })}
                           className={`p-4 xs:p-5 rounded-2xl xs:rounded-3xl border-2 text-center hover:scale-[1.02] transition-all flex justify-between items-center ${formData.capacity === cap ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-outline bg-surface'}`}
                         >
                           <div className="font-headline text-xl xs:text-2xl font-extrabold text-on-surface">{t('section.infra.120.title').replace('120', cap)}</div>
                           <ChevronRight className={`transition-opacity ${formData.capacity === cap ? 'opacity-100 text-primary' : 'opacity-0'}`} size={16} xs:size={20} />
                         </button>
                       ))}
                     </div>
                  </>
                ) : (
                  <>
                     <h3 className="font-headline text-xl xs:text-2xl font-bold text-on-surface mb-2">{t('wizard.step2.partnership.title')}</h3>
                     <p className="text-on-surface-variant mb-4 xs:mb-6 text-xs xs:text-sm">{t('wizard.step2.partnership.desc')}</p>
                     <div className="grid grid-cols-1 gap-3 xs:gap-4">
                       {[
                         { id: 'strategic', title: t('wizard.partnership.strategic') },
                         { id: 'reseller', title: t('wizard.partnership.reseller') },
                         { id: 'institutional', title: t('wizard.partnership.institutional') },
                         { id: 'other', title: t('wizard.partnership.other') }
                       ].map((type) => (
                         <button
                           key={type.id}
                           onClick={() => handleSelectionNext({ ...formData, partnershipType: type.id })}
                           className={`p-4 xs:p-5 rounded-2xl xs:rounded-3xl border-2 text-left hover:scale-[1.02] transition-all flex justify-between items-center ${formData.partnershipType === type.id ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-outline bg-surface'}`}
                         >
                           <div className="font-headline text-base xs:text-lg font-bold text-on-surface">{type.title}</div>
                           <ChevronRight className={`transition-opacity ${formData.partnershipType === type.id ? 'opacity-100 text-primary' : 'opacity-0'}`} size={16} xs:size={20} />
                         </button>
                       ))}
                     </div>
                  </>
                )}
                <div className="mt-6 xs:mt-8 flex justify-between">
                  <button onClick={handlePrev} className="px-4 xs:px-6 py-2.5 xs:py-3 rounded-full font-label font-bold text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-2">
                    <ArrowLeft size={14} xs:size={18} /> {t('wizard.back')}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {(formData.role === 'farmer' || formData.role === 'hobbyist') ? (
                  <>
                     <h3 className="font-headline text-xl xs:text-2xl font-bold text-on-surface mb-2">{t('wizard.step3.goal.title')}</h3>
                     <p className="text-on-surface-variant mb-4 xs:mb-6 text-xs xs:text-sm">{t('wizard.step3.goal.desc')}</p>
                     <div className="grid grid-cols-1 gap-3 xs:gap-4">
                       {[
                         { id: 'hatch-rate', title: t('wizard.goal.hatch-rate') },
                         { id: 'scale', title: t('wizard.goal.scale') },
                         { id: 'research', title: t('wizard.goal.research') },
                         { id: 'first-time', title: t('wizard.goal.first-time') }
                       ].map((goal) => (
                         <button
                           key={goal.id}
                           onClick={() => handleSelectionNext({ ...formData, goal: goal.id })}
                           className={`p-3 xs:p-4 rounded-2xl xs:rounded-3xl border-2 text-left hover:scale-[1.02] transition-all flex justify-between items-center ${formData.goal === goal.id ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-outline bg-surface'}`}
                         >
                           <div className="font-headline text-base xs:text-lg font-bold text-on-surface">{goal.title}</div>
                           <ChevronRight className={`transition-opacity ${formData.goal === goal.id ? 'opacity-100 text-primary' : 'opacity-0'}`} size={16} xs:size={20} />
                         </button>
                       ))}
                     </div>
                  </>
                ) : (
                  <>
                     <h3 className="font-headline text-xl xs:text-2xl font-bold text-on-surface mb-2">{t('wizard.step3.timeline.title')}</h3>
                     <p className="text-on-surface-variant mb-4 xs:mb-6 text-xs xs:text-sm">{t('wizard.step3.timeline.desc')}</p>
                     <div className="grid grid-cols-1 gap-3 xs:gap-4">
                       {[
                         { id: 'immediate', title: t('wizard.timeline.immediate') },
                         { id: 'short', title: t('wizard.timeline.short') },
                         { id: 'exploring', title: t('wizard.timeline.exploring') }
                       ].map((tl) => (
                         <button
                           key={tl.id}
                           onClick={() => handleSelectionNext({ ...formData, timeline: tl.id })}
                           className={`p-3 xs:p-4 rounded-2xl xs:rounded-3xl border-2 text-left hover:scale-[1.02] transition-all flex justify-between items-center ${formData.timeline === tl.id ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-outline bg-surface'}`}
                         >
                           <div className="font-headline text-base xs:text-lg font-bold text-on-surface">{tl.title}</div>
                           <ChevronRight className={`transition-opacity ${formData.timeline === tl.id ? 'opacity-100 text-primary' : 'opacity-0'}`} size={16} xs:size={20} />
                         </button>
                       ))}
                     </div>
                  </>
                )}
                <div className="mt-6 xs:mt-8 flex justify-between">
                  <button onClick={handlePrev} className="px-4 xs:px-6 py-2.5 xs:py-3 rounded-full font-label font-bold text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-2">
                    <ArrowLeft size={14} xs:size={18} /> {t('wizard.back')}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="font-headline text-xl xs:text-2xl font-bold text-on-surface mb-2">{t('wizard.step4.title')}</h3>
                <p className="text-on-surface-variant mb-4 xs:mb-6 text-xs xs:text-sm">{t('wizard.step4.desc')}</p>
                <textarea
                  className="w-full px-3 xs:px-4 py-3 xs:py-4 rounded-xl xs:rounded-2xl border-2 border-outline-variant/50 bg-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none min-h-[140px] xs:min-h-[160px] resize-y text-xs xs:text-sm"
                  placeholder={formData.role === 'investor' ? t('wizard.step4.placeholder.investor') : t('wizard.step4.placeholder.farmer')}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />

                <div className="mt-6 xs:mt-8 flex justify-between">
                  <button onClick={handlePrev} className="px-4 xs:px-6 py-2.5 xs:py-3 rounded-full font-label font-bold text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-2">
                    <ArrowLeft size={14} xs:size={18} /> {t('wizard.back')}
                  </button>
                  <button onClick={handleNext} className="btn-primary text-on-primary px-6 xs:px-8 py-2.5 xs:py-3 rounded-full font-label font-bold hover:bg-primary-container transition-all flex items-center gap-2 shadow-lg text-xs xs:text-sm">
                    {t('wizard.next')} <ArrowRight size={14} xs:size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="font-headline text-xl xs:text-2xl font-bold text-on-surface mb-2">{t('wizard.step5.title')}</h3>
                <p className="text-on-surface-variant mb-4 xs:mb-6 text-xs xs:text-sm">{t('wizard.step5.desc')}</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 xs:gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-label text-[10px] xs:text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('form.firstName')}</label>
                      <input required type="text" className="w-full px-3 xs:px-4 py-2.5 xs:py-3 rounded-xl xs:rounded-2xl border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none text-xs xs:text-sm" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-label text-[10px] xs:text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('form.lastName')}</label>
                      <input required type="text" className="w-full px-3 xs:px-4 py-2.5 xs:py-3 rounded-xl xs:rounded-2xl border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none text-xs xs:text-sm" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label text-[10px] xs:text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('form.email')}</label>
                    <input required type="email" className="w-full px-3 xs:px-4 py-2.5 xs:py-3 rounded-xl xs:rounded-2xl border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none text-xs xs:text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label text-[10px] xs:text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('form.phone')}</label>
                    <input required type="tel" className="w-full px-3 xs:px-4 py-2.5 xs:py-3 rounded-xl xs:rounded-2xl border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none text-xs xs:text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 98765 43210" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label text-[10px] xs:text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('form.city')}</label>
                    <input required type="text" className="w-full px-3 xs:px-4 py-2.5 xs:py-3 rounded-xl xs:rounded-2xl border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none text-xs xs:text-sm" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                  </div>

                  <div className="mt-5 xs:mt-6 flex justify-between">
                    <button type="button" onClick={handlePrev} className="px-4 xs:px-6 py-2.5 xs:py-3 rounded-full font-label font-bold text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-2 text-xs xs:text-sm">
                      <ArrowLeft size={14} xs:size={18} /> {t('wizard.back')}
                    </button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary text-on-primary px-6 xs:px-8 py-2.5 xs:py-3 rounded-full font-label font-bold hover:bg-primary-container transition-all flex items-center gap-2 shadow-lg disabled:cursor-not-allowed disabled:opacity-60 text-xs xs:text-sm">
                      {isSubmitting ? t('wizard.submitting') : t('wizard.submit')} <ArrowRight size={14} xs:size={18} />
                    </button>
                  </div>
                  {submitError ? (
                    <p className="rounded-xl border border-green-200 bg-green-50 px-3 xs:px-4 py-2.5 xs:py-3 text-xs xs:text-sm font-semibold text-green-700">
                      {submitError}
                    </p>
                  ) : null}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
