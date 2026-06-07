import { useState, FormEvent } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { submitSERELead } from '../lib/naya-lead';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { t } = useLanguage();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setLoading(true);
    setSubmitError('');

    try {
      await submitSERELead({
        firstName: String(formData.get('name') ?? ''),
        email: String(formData.get('email') ?? ''),
        phone: String(formData.get('phone') ?? ''),
        message: String(formData.get('message') ?? ''),
        sourceCta: 'contact_page_form',
      });
      form.reset();
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : 'Lead capture is temporarily unavailable. Please try again or contact us on WhatsApp.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-24 pb-24 md:pb-0 px-6 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-green-600 text-5xl">check_circle</span>
          </div>
          <h1 className="font-headline text-4xl font-extrabold text-on-surface mb-4">{t('contact.success.title')}</h1>
          <p className="text-on-surface-variant text-lg mb-8">
            {t('contact.success.desc')}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-primary text-on-primary px-8 py-3 rounded-2xl font-bold hover:brightness-110 hover:scale-[1.02] transition-all"
          >
            {t('contact.form.submit')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 md:pb-0 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-6">{t('contact.title')}</h1>
          <p className="text-on-surface-variant text-lg mb-12 max-w-md leading-relaxed">
            {t('contact.desc')}
          </p>
        </div>

        <div className="bg-surface p-8 md:p-10 rounded-3xl shadow-xl border border-outline-variant/15">
          <h2 className="font-headline text-2xl font-bold mb-8">{t('contact.form.title')}</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-on-surface mb-2">{t('form.firstName')}</label>
                <input type="text" id="name" name="name" required className="w-full bg-surface-container border border-outline-variant/40 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="Your name" />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-on-surface mb-2">{t('form.email')}</label>
              <input type="email" id="email" name="email" required className="w-full bg-surface-container border border-outline-variant/40 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="you@example.com" />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-on-surface mb-2">{t('form.phone')}</label>
              <input type="tel" id="phone" name="phone" className="w-full bg-surface-container border border-outline-variant/40 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="+91 98765 43210" />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-bold text-on-surface mb-2">{t('form.message')}</label>
              <textarea id="message" name="message" rows={4} required className="w-full bg-surface-container border border-outline-variant/40 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none" placeholder="How can we help you?"></textarea>
            </div>

            <label className="flex items-start gap-3 rounded-2xl bg-surface-container-low px-4 py-3 text-left text-sm text-on-surface-variant">
              <input className="mt-1 h-4 w-4 rounded border-outline-variant accent-primary" required type="checkbox" name="consent" />
              <span>{t('form.consent')}</span>
            </label>

            {submitError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {submitError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary font-bold py-4 rounded-2xl hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? t('contact.form.sending') : t('contact.form.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
