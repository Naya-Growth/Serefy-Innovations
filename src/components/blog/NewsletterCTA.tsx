import React from 'react';

export default function NewsletterCTA() {
  return (
    <section className="w-full bg-gradient-to-br from-emerald-700 via-green-600 to-emerald-800 py-16 px-4 sm:px-6 lg:px-8 text-center mt-auto">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-white mb-4">Stay Updated</h2>
        <p className="text-green-100 mb-8 text-sm md:text-base">Get the latest insights on smart poultry farming delivered to your inbox. No spam, just value.</p>
        
        <form className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="w-full sm:flex-1 px-5 py-3 rounded-full bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            required
          />
          <button type="submit" className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-primary font-bold text-sm hover:bg-emerald-50 transition-colors">
            Subscribe
          </button>
        </form>
        <p className="text-green-200/70 text-xs mt-4">Join 5,000+ forward-thinking farmers.</p>
      </div>
    </section>
  );
}
