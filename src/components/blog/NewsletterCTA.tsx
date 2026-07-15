import React from 'react';

export default function NewsletterCTA() {
  return (
    <section className="w-full bg-gradient-to-br from-emerald-700 via-green-600 to-emerald-800 py-12 xs:py-14 sm:py-16 md:py-18 lg:py-20 xl:py-24 2xl:py-28 3xl:py-32 4xl:py-36 px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 text-center mt-auto">
      <div className="max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto">
        <h2 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl font-headline font-bold text-white mb-3 xs:mb-4 sm:mb-5 xl:mb-6">Stay Updated</h2>
        <p className="text-green-100 mb-6 xs:mb-7 sm:mb-8 xl:mb-10 text-xs xs:text-sm sm:text-base md:text-lg xl:text-xl 2xl:text-2xl">Get the latest insights on smart poultry farming delivered to your inbox. No spam, just value.</p>
        
        <form className="flex flex-col sm:flex-row items-center justify-center gap-2.5 xs:gap-3 sm:gap-4 xl:gap-5 max-w-md xl:max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="w-full sm:flex-1 px-4 xs:px-5 sm:px-6 xl:px-7 2xl:px-8 py-2.5 xs:py-3 sm:py-3.5 xl:py-4 rounded-full bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-xs xs:text-sm sm:text-base xl:text-lg 2xl:text-xl"
            required
          />
          <button type="submit" className="w-full sm:w-auto px-5 xs:px-6 sm:px-7 xl:px-8 2xl:px-10 py-2.5 xs:py-3 sm:py-3.5 xl:py-4 rounded-full bg-white text-primary font-bold text-xs xs:text-sm sm:text-base xl:text-lg 2xl:text-xl hover:bg-emerald-50 transition-colors">
            Subscribe
          </button>
        </form>
        <p className="text-green-200/70 text-[10px] xs:text-xs sm:text-xs xl:text-sm 2xl:text-base mt-3 xs:mt-4 xl:mt-5">Join 5,000+ forward-thinking farmers.</p>
      </div>
    </section>
  );
}
