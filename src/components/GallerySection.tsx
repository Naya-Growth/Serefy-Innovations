import React from 'react';
import { motion } from 'motion/react';
import SectionWrapper from './SectionWrapper';
import { useLanguage } from '../context/LanguageContext';

export default function GallerySection() {
  const { t } = useLanguage();

  const impactPath = [
    {
      src: "/media/gallery-farmer-design.jpg",
      title: t('section.gallery.step1'),
      desc: t('section.gallery.img1'),
      step: "01"
    },
    {
      src: "/media/gallery-farmer-setup.jpg",
      title: t('section.gallery.step2'),
      desc: t('section.gallery.img2'),
      step: "02"
    },
    {
      src: "/media/gallery-lab-testing.jpg",
      title: t('section.gallery.step3'),
      desc: t('section.gallery.img3'),
      step: "03"
    },
    {
      src: "/media/gallery-expert-meetups.jpg",
      title: t('section.gallery.step4'),
      desc: t('section.gallery.img4'),
      step: "04"
    }
  ];

  return (
    <SectionWrapper className="w-full pt-12 md:pt-16 pb-20 md:pb-32 px-6 md:px-12 bg-surface overflow-hidden relative" id="gallery">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-16 md:mb-24">
          <div className="inline-block px-4 py-1.5 bg-primary text-on-primary rounded-full font-label text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-4 shadow-lg shadow-primary/20">
            {t('section.gallery.badge')}
          </div>
          <h2 className="font-headline text-3xl md:text-5xl font-black text-on-surface mb-4 tracking-tighter uppercase leading-none">
            {t('section.gallery.title')}
          </h2>
          <p className="text-on-surface-variant text-lg md:text-xl font-medium max-w-2xl">
            {t('section.gallery.subtitle')}
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10">
            {impactPath.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className="flex flex-col">
                  <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border-2 border-outline-variant/20 shadow-xl group-hover:border-primary/40 transition-all duration-500 mb-6">
                    <img 
                      src={item.src} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                    />
                    <div className="absolute top-6 left-6 w-10 h-10 bg-primary text-on-primary rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-primary/30 z-10">
                      {item.step}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
                    <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                       <h3 className="font-headline font-black text-lg md:text-2xl text-white mb-1 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-white/80 text-[10px] md:text-sm font-medium leading-tight md:leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Background accents - positioned safely within the relative+overflow-hidden parent */}
      <div className="absolute top-1/2 right-0 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </SectionWrapper>
  );
}
