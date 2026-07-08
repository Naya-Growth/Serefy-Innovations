
export default function Gallery() {

  const photos = [
    { id: 1, title: 'Expert Meetups', description: 'Collaborating with industry experts to refine technology.', url: '/media/gallery-expert-meetups.jpg' },
    { id: 2, title: 'Farmer Centric Design', description: 'Testing our incubators directly on the field with local farmers.', url: '/media/gallery-farmer-design.jpg' },
    { id: 3, title: 'Farmer Capacity Setup', description: 'A local farmer showcasing the precision transition.', url: '/media/gallery-farmer-setup.jpg' },
    { id: 4, title: 'Real Challenges', description: 'Understanding real problems faced by small-scale farmers.', url: '/media/gallery-real-challenges.jpg' },
    { id: 5, title: 'Healthy Hatch Results', description: '90%+ hatch rates from our incubator machines.', url: '/media/gallery-healthy-hatch.jpg' },
    { id: 6, title: 'The Problem We Solve', description: 'Eliminating cruel handling of birds with automation.', url: '/media/gallery-problem-solve.jpg' },
    { id: 7, title: 'Incubator Assembly', description: 'Precision manufacturing process for SERE units.', url: '/media/gallery-incubator-assembly.jpg' },
    { id: 8, title: 'Lab & Testing', description: 'Quality control and rigorous testing of our hardware.', url: '/media/gallery-lab-testing.jpg' },
    { id: 9, title: 'Team at Work', description: 'Our team building the next generation of smart incubation.', url: '/media/gallery-team-work.jpg' },
  ];

  return (
    <div className="pt-24 pb-32 min-h-screen bg-white">

      {/* Calligraphy Mix Header - Compact Scale */}
      <header className="max-w-5xl mx-auto px-4 xs:px-5 sm:px-6 mb-12 xs:mb-14 sm:mb-16 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="inline-flex items-center gap-1.5 xs:gap-2 px-3 xs:px-4 py-1 xs:py-1.5 mb-6 xs:mb-8 text-[9px] xs:text-[10px] font-black tracking-[0.4em] uppercase bg-black text-white rounded-lg xs:rounded-xl shadow-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          Visual Journey
        </div>

        <h1 className="text-3xl xs:text-4xl md:text-6xl font-black text-black tracking-tight leading-tight mb-4 xs:mb-6">
          Gallery <span className="font-['Playfair_Display'] italic font-black text-green-600 lowercase mx-1.5 xs:mx-2">of</span> Impact.
        </h1>

        <div className="max-w-xl mx-auto">
          <p className="text-sm xs:text-base md:text-lg text-black font-black leading-relaxed">
            Real moments from the field — team meetings, field visits, farmer interactions, and the precision engineering behind SERE.
          </p>
        </div>
        <div className="w-12 xs:w-16 h-1 bg-green-500 mx-auto mt-6 xs:mt-8 rounded-full opacity-20"></div>
      </header>

      {/* 3x3 Equal Grid */}
      <main className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8">
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className="group relative animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="aspect-square rounded-[1.5rem] xs:rounded-[2rem] overflow-hidden bg-green-50 border border-green-100 shadow-xl shadow-green-200/50 transform group-hover:-translate-y-2 transition-all duration-700">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5 xs:p-8">
                  <h3 className="text-white text-lg xs:text-xl font-black mb-1.5 xs:mb-2 tracking-tight">{photo.title}</h3>
                  <p className="text-white text-[10px] xs:text-xs font-black leading-relaxed opacity-90">{photo.description}</p>
                </div>
              </div>

              <div className="mt-3 xs:mt-4 px-3 xs:px-4 group-hover:opacity-0 transition-opacity duration-300 text-center lg:text-left">
                <p className="text-green-600 text-[9px] xs:text-[10px] font-black uppercase tracking-widest mb-0.5 xs:mb-1">{photo.title}</p>
                <p className="text-black text-[10px] xs:text-xs font-black line-clamp-1">{photo.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
