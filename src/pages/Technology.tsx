import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu,
  Thermometer,
  Droplets,
  RotateCw,
  Zap,
  Battery,
  Sun,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Play,
  RefreshCw
} from 'lucide-react';

const techDetails = {
  English: {
    title: "Interactive Technology Showcase",
    subtitle: "Click on each core system to view real-time operations, sensor telemetry, and performance specs.",
    simulateBtn: "Simulate System Action",
    simulating: "Running Simulation...",
    statusLabel: "System Status",
    sensorTelemetry: "Live Telemetry",
    specifications: "Technical Specifications",
    tabs: [
      {
        id: "thermal",
        title: "Thermal Precision Engine",
        short: "0.01°C PID Micro-heating",
        icon: Thermometer,
        desc: "Aerospace-grade thermal sensors combined with dual-zone heating elements keep temperature fluctuations under 0.01°C. This constant thermal blanket ensures optimal cell division and embryo health.",
        stats: [
          { label: "Accuracy", value: "±0.01°C" },
          { label: "Sensor Array", value: "SHT31-D Dual" },
          { label: "Calibration", value: "Factory Laser" }
        ],
        interactiveTitle: "Live Temperature Stabilization",
        interactiveDesc: "Our active PID algorithm continuously reads dual sensors and adjusts power in millisecond intervals to counter room temperature shifts.",
      },
      {
        id: "humidity",
        title: "HumidiSmart™ Automation",
        short: "Closed-loop Ultrasonic Mist",
        icon: Droplets,
        desc: "Automated ultrasonic mist generation eliminates the dangerous moisture dips of manual systems. Maintaining precise humidity ensures eggshell membranes remain porous and healthy.",
        stats: [
          { label: "Range Control", value: "40% - 70% RH" },
          { label: "Mist Method", value: "Ultrasonic 1.7MHz" },
          { label: "Water Level", value: "Auto-Sense Alert" }
        ],
        interactiveTitle: "Relative Humidity Control",
        interactiveDesc: "Monitors humidity levels and injects micro-fine mist to match the target incubation curve without dropping chamber temperature.",
      },
      {
        id: "rotation",
        title: "Maternal-Mimic Turning",
        short: "Scheduled 45° Smooth Rotation",
        icon: RotateCw,
        desc: "A vibration-free servo-driven turning mechanism slowly rotates the eggs 45 degrees on scheduled intervals, mimicking natural maternal nesting. This prevents embryo adhesion to the shell wall.",
        stats: [
          { label: "Turn Angle", value: "45° precise" },
          { label: "Interval", value: "Every 120 mins" },
          { label: "Drive Motor", value: "Ultra-quiet Servo" }
        ],
        interactiveTitle: "Gentle Rotation Cycle",
        interactiveDesc: "Vibration-free rotation prevents physical trauma to the embryo during critical early developmental stages.",
      },
      {
        id: "power",
        title: "Resilient Dual-Power Grid",
        short: "12V Solar & Battery Backup",
        icon: Zap,
        desc: "Operates natively on 12V DC power. During a power outage, the system automatically fails over to solar panels or battery backup within 10 milliseconds, preventing catastrophic heat loss.",
        stats: [
          { label: "Failover Time", value: "< 10ms" },
          { label: "Native Voltage", value: "12V DC" },
          { label: "Power Draw", value: "Avg. 25 Watts" }
        ],
        interactiveTitle: "Smart Failover Flow",
        interactiveDesc: "Seamless power routing ensures that even during extended rural power cuts, the chamber remains fully insulated and powered.",
      }
    ]
  },
  Hindi: {
    title: "इंटरएक्टिव तकनीक का प्रदर्शन",
    subtitle: "वास्तविक समय के संचालन, सेंसर टेलीमेट्री और प्रदर्शन विशिष्टताओं को देखने के लिए प्रत्येक कोर सिस्टम पर क्लिक करें।",
    simulateBtn: "सिस्टम एक्शन सिमुलेट करें",
    simulating: "सिमुलेशन चल रहा है...",
    statusLabel: "सिस्टम की स्थिति",
    sensorTelemetry: "लाइव टेलीमेट्री",
    specifications: "तकनीकी विनिर्देश",
    tabs: [
      {
        id: "thermal",
        title: "थर्मल प्रेसिजन इंजन",
        short: "0.01°C PID माइक्रो-हीटिंग",
        icon: Thermometer,
        desc: "एयरोस्पेस-ग्रेड थर्मल सेंसर और दोहरे क्षेत्र के हीटिंग तत्व तापमान के उतार-चढ़ाव को 0.01°C से नीचे रखते हैं। यह निरंतर सुरक्षात्मक ऊष्मा इष्टतम कोशिका विभाजन और भ्रूण स्वास्थ्य सुनिश्चित करती है।",
        stats: [
          { label: "सटीकता", value: "±0.01°C" },
          { label: "सेंसर एरे", value: "SHT31-D दोहरी" },
          { label: "अंशांकन", value: "फैक्ट्री लेजर" }
        ],
        interactiveTitle: "लाइव तापमान स्थिरीकरण",
        interactiveDesc: "हमारा सक्रिय PID एल्गोरिथम लगातार दोहरे सेंसरों से डेटा पढ़ता है और कमरे के तापमान में बदलावों का मुकाबला करने के लिए मिलीसेकंड अंतराल में हीटिंग को नियंत्रित करता है।",
      },
      {
        id: "humidity",
        title: "ह्यूमिडिस्मार्ट™ स्वचालन",
        short: "बंद-लूप अल्ट्रासोनिक मिस्ट",
        icon: Droplets,
        desc: "स्वचालित अल्ट्रासोनिक मिस्ट जनरेशन मैनुअल सिस्टम के खतरनाक नमी परिवर्तनों को समाप्त करता है। सटीक आर्द्रता बनाए रखने से अंडे के छिलके की झिल्ली स्वस्थ रहती है।",
        stats: [
          { label: "रेंज नियंत्रण", value: "40% - 70% RH" },
          { label: "मिस्ट विधि", value: "अल्ट्रासोनिक 1.7MHz" },
          { label: "जल स्तर", value: "ऑटो-सेंस अलर्ट" }
        ],
        interactiveTitle: "सापेक्ष आर्द्रता नियंत्रण",
        interactiveDesc: "चेंबर के तापमान को गिराए बिना आर्द्रता के स्तर की निगरानी करता है और वांछित इनक्यूबेशन चक्र से मेल खाने के लिए सूक्ष्म-महीन मिस्ट छोड़ता है।",
      },
      {
        id: "rotation",
        title: "मातृ-नकल अंडा घूमना",
        short: "अनुसूचित 45° सुचारू घूर्णन",
        icon: RotateCw,
        desc: "एक कंपन-मुक्त सर्वो-संचालित मोड़ तंत्र धीरे-धीरे अंडों को अनुसूचित अंतरालों पर 45 डिग्री घुमाता है, जो प्राकृतिक उबवणी की नकल करता है। यह भ्रूण को छिलके से चिपकने से रोकता है।",
        stats: [
          { label: "मोड़ कोण", value: "45° सटीक" },
          { label: "अंतराल", value: "प्रत्येक 120 मिनट" },
          { label: "ड्राइव मोटर", value: "अति-शांत सर्वो" }
        ],
        interactiveTitle: "कोमल घूर्णन चक्र",
        interactiveDesc: "कंपन-मुक्त घूर्णन महत्वपूर्ण प्रारंभिक विकास चरणों के दौरान भ्रूण को किसी भी शारीरिक क्षति से बचाता है।",
      },
      {
        id: "power",
        title: "लचीला दोहरा पावर ग्रिड",
        short: "12V सोलर और बैटरी बैकअप",
        icon: Zap,
        desc: "मूल रूप से 12V DC पावर पर काम करता है। बिजली कटौती के दौरान, सिस्टम स्वचालित रूप से 10 मिलीसेकंड के भीतर सौर पैनलों या बैटरी बैकअप पर स्विच हो जाता है, जिससे गर्मी के नुकसान को रोका जा सकता है।",
        stats: [
          { label: "फेलओवर समय", value: "< 10ms" },
          { label: "मूल वोल्टेज", value: "12V DC" },
          { label: "पावर खपत", value: "औसत 25 वाट" }
        ],
        interactiveTitle: "स्मार्ट फेलओवर प्रवाह",
        interactiveDesc: "सटीक पावर रूटिंग सुनिश्चित करती है कि ग्रामीण क्षेत्रों में लंबे समय तक बिजली कटौती के दौरान भी चेंबर पूरी तरह से इंसुलेटेड और चालू रहे।",
      }
    ]
  },
  Marathi: {
    title: "परस्परसंवादी तंत्रज्ञान प्रदर्शन",
    subtitle: "वास्तविक-वेळ ऑपरेशन्स, सेन्सर टेलिमेट्री आणि कार्यप्रदर्शन तपशील पाहण्यासाठी प्रत्येक मुख्य प्रणालीवर क्लिक करा.",
    simulateBtn: "सिस्टम ॲक्शन सिम्युलेट करा",
    simulating: "सिम्युलेशन सुरू आहे...",
    statusLabel: "सिस्टम स्थिती",
    sensorTelemetry: "लाइव्ह टेलिमेट्री",
    specifications: "तांत्रिक तपशील",
    tabs: [
      {
        id: "thermal",
        title: "Thermal Precision Engine",
        short: "0.01°C PID मायक्रो-हीटिंग",
        icon: Thermometer,
        desc: "एरोस्पेस-ग्रेड थर्मल सेन्सर्स आणि दुहेरी झोन हीटिंग घटक तापमान बदल 0.01°C च्या आत ठेवतात. हे सतत तापमान राखल्यामुळे भ्रूण निरोगी राहते आणि चांगला विकास होतो.",
        stats: [
          { label: "अचूकता", value: "±0.01°C" },
          { label: "सेन्सर ॲरे", value: "SHT31-D दुहेरी" },
          { label: "कॅलिब्रेशन", value: "फॅक्टरी लेझर" }
        ],
        interactiveTitle: "लाइव्ह तापमान स्थिरीकरण",
        interactiveDesc: "आमचे सक्रिय PID अल्गोरिदम सतत दोन्ही सेन्सर्स मोजते आणि खोलीतील तापमान बदलांना तोंड देण्यासाठी मिलिसेकंदच्या अंतराने हीटिंग पॉवर नियंत्रित करते.",
      },
      {
        id: "humidity",
        title: "ह्यूमिडिस्मार्ट™ ऑटोमेशन",
        short: "क्लोज्ड-लूप अल्ट्रासोनिक मिस्ट",
        icon: Droplets,
        desc: "स्वयंचलित अल्ट्रासोनिक मिस्ट निर्मिती मॅन्युअल फवारणीच्या त्रासापासून मुक्ती देते. अचूक आर्द्रता राखल्यामुळे अंड्याचे कवच मऊ आणि निरोगी राहते.",
        stats: [
          { label: "रेंज नियंत्रण", value: "40% - 70% RH" },
          { label: "मिस्ट पद्धत", value: "अल्ट्रासोनिक 1.7MHz" },
          { label: "पाण्याची पातळी", value: "ऑटो-सेन्स अलर्ट" }
        ],
        interactiveTitle: "सापेक्ष आर्द्रता नियंत्रण",
        interactiveDesc: "चेंबरचे तापमान कमी न करता आर्द्रता पातळीवर लक्ष ठेवते आणि योग्य उबवणी वातावरणासाठी अति-सूक्ष्म मिस्ट सोडते.",
      },
      {
        id: "rotation",
        title: "मॅटर्नल-मिमिक अंडी फिरवणे",
        short: "नियोजित 45° हळूवार फिरवणे",
        icon: RotateCw,
        desc: "कंपन-मुक्त सर्वो-चालित यंत्रणा नियोजित अंतराने अंडी हळूवारपणे 45 अंश फिरवते, जे नैसर्गिक उबवणी पद्धतीसारखे असते. यामुळे भ्रूण कवचाला चिकटत नाही.",
        stats: [
          { label: "फिरवण्याचा कोन", value: "45° अचूक" },
          { label: "अंतराल", value: "प्रत्येक 120 मिनिटांनी" },
          { label: "ड्राईव्ह मोटर", value: "अति-शांत सर्वो" }
        ],
        interactiveTitle: "हळूवार फिरवण्याचे चक्र",
        interactiveDesc: "कंपन-मुक्त हालचालीमुळे सुरुवातीच्या संवेदनशील टप्प्यात भ्रूणाला इजा होत नाही आणि सुरक्षित वाढ होते.",
      },
      {
        id: "power",
        title: "लवचिक दुहेरी पॉवर ग्रिड",
        short: "12V सोलर आणि बॅटरी बॅकअप",
        icon: Zap,
        desc: "मूळतः 12V DC पॉवरवर कार्य करते. वीज पुरवठा खंडित झाल्यास, सिस्टम केवळ 10 मिलिसेकंदात स्वयंचलितपणे सोलर पॅनेल किंवा बॅटरी बॅकअपवर स्विच होते, ज्यामुळे उष्णता कमी होत नाही.",
        stats: [
          { label: "फेलओव्हर वेळ", value: "< 10ms" },
          { label: "मूळ व्होल्टेज", value: "12V DC" },
          { label: "वीज वापर", value: "सरासरी 25 वॅट्स" }
        ],
        interactiveTitle: "स्मार्ट Failover प्रवाह",
        interactiveDesc: "दुहेरी वीज प्रवाह सुनिश्चित करतो की ग्रामीण भागात जास्त वेळ वीज नसली तरीही चेंबर पूर्णपणे इन्सुलेटेड आणि चालू राहील.",
      }
    ]
  }
};

export default function Technology() {
  const { t, language } = useLanguage();
  const currentLang = (language === 'Hindi' || language === 'Marathi') ? language : 'English';
  const content = techDetails[currentLang];

  const [activeTab, setActiveTab] = useState('thermal');
  const showcaseRef = useRef<HTMLDivElement>(null);

  // Telemetry simulation states
  const [temp, setTemp] = useState(37.52);
  const [humidity, setHumidity] = useState(55.4);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  // Power simulation states
  const [powerSource, setPowerSource] = useState<'grid' | 'battery'>('grid');
  const [isPowerSwitching, setIsPowerSwitching] = useState(false);

  // Fluctuating Telemetry Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTemp(prev => {
        const diff = (Math.random() - 0.5) * 0.02;
        return parseFloat((prev + diff).toFixed(2));
      });
      setHumidity(prev => {
        const diff = (Math.random() - 0.5) * 0.4;
        return parseFloat((prev + diff).toFixed(1));
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const triggerRotationSim = () => {
    if (isRotating) return;
    setIsRotating(true);
    setRotationAngle(prev => (prev === 0 ? 45 : 0));
    setTimeout(() => {
      setIsRotating(false);
    }, 2000);
  };

  const triggerPowerSim = () => {
    if (isPowerSwitching) return;
    setIsPowerSwitching(true);
    setTimeout(() => {
      setPowerSource(prev => (prev === 'grid' ? 'battery' : 'grid'));
      setIsPowerSwitching(false);
    }, 1000);
  };

  return (
    <div className="pt-16 pb-16 min-h-screen bg-slate-50 text-slate-800">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-10 md:pt-8 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-left-8 duration-1000 order-2 lg:order-1">
            <div className="inline-flex items-center px-3 py-1 mb-4 text-[9px] font-black tracking-widest uppercase bg-green-950 text-green-300 rounded-xl shadow-xl border border-green-800/30">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse mr-2"></span>
              {t('tech.hero.badge')}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-4">
              {t('tech.hero.title')}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-lg mb-6 leading-relaxed">
              {t('tech.hero.desc')}
            </p>
            <button
              onClick={() => showcaseRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-green-700 text-white px-5 xs:px-6 sm:px-8 xs:sm:px-10 py-2.5 xs:py-3 sm:py-3.5 xs:sm:py-4 rounded-xl xs:rounded-2xl font-black text-[9px] xs:text-[10px] sm:text-[11px] uppercase tracking-widest flex items-center gap-2 xs:gap-3 shadow-xl shadow-green-700/20 hover:-translate-y-1 hover:scale-[1.02] transition-all active:scale-95 cursor-pointer w-full sm:w-auto justify-center"
            >
              {t('tech.hero.cta')} <span className="material-symbols-outlined text-xs xs:text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 order-1 lg:order-2">
            <div className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl relative border-4 border-white">
              <img className="w-full h-full object-cover" src="/media/sere-120.webp" alt="SERE Incubator" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white p-3 sm:p-4 rounded-3xl shadow-xl border border-green-100 flex items-center gap-3 sm:gap-4 animate-float">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-green-700 text-lg sm:text-xl">precision_manufacturing</span>
              </div>
              <div>
                <p className="text-[8px] sm:text-[9px] font-black text-slate-900 uppercase tracking-widest">R&D Precision</p>
                <p className="text-[7px] sm:text-[8px] font-bold text-slate-400">Validated Technology</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 mb-12 sm:mb-16">
        <div className="bg-gradient-to-br from-green-50/20 via-white to-slate-50/50 rounded-3xl border border-slate-100 p-8 sm:p-12 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          {/* Subtle design node ambient glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-green-50/30 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content Column */}
            <div className="lg:col-span-5 border-l-4 border-green-700 pl-6">
              <span className="text-green-700 text-[10px] font-black uppercase tracking-[0.25em] mb-2 block">
                {t('tech.mission.badge')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {t('tech.mission.title')}
              </h2>
            </div>
            
            {/* Right Quote / Desc Column */}
            <div className="lg:col-span-7 flex items-start gap-3">
              <span className="text-green-300 font-serif text-5xl leading-none select-none -mt-2">“</span>
              <p className="text-slate-650 text-sm sm:text-base md:text-lg font-medium leading-relaxed italic">
                {t('tech.mission.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Technology Showcase Section */}
      <section ref={showcaseRef} id="explore-tech" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 border-t border-slate-200 scroll-mt-24">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 uppercase">
            {content.title}
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium text-xs sm:text-sm md:text-base px-2">
            {content.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">

          {/* Tabs Selector List */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-3">
            {content.tabs.map((tab) => {
              const TabIconComponent = tab.icon;
              const isSelected = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center sm:items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 ${isSelected
                    ? 'bg-green-700 text-white border-green-700 shadow-lg shadow-green-700/20 lg:translate-x-2'
                    : 'bg-white text-slate-700 border-slate-200/60 hover:border-green-700/40 hover:bg-green-50/20'
                    }`}
                >
                  <div className={`p-2 sm:p-3 rounded-xl ${isSelected ? 'bg-white/10 text-white' : 'bg-green-50 text-green-700'
                    }`}>
                    <TabIconComponent size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm md:text-base tracking-tight leading-snug">{tab.title}</h4>
                    <p className={`text-[10px] sm:text-xs mt-1 font-medium ${isSelected ? 'text-green-100' : 'text-slate-400'
                      }`}>
                      {tab.short}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Simulation Dashboard & Specs Display */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl shadow-slate-100/50 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {content.tabs.map((tab) => {
                if (tab.id !== activeTab) return null;
                const TabIconComponent = tab.icon;

                return (
                  <motion.div
                    key={tab.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col h-full justify-between gap-6 sm:gap-8"
                  >
                    <div>
                      {/* Section Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 sm:p-3 bg-green-50 text-green-700 rounded-2xl">
                          <TabIconComponent size={24} className="sm:w-7 sm:h-7" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-lg sm:text-xl md:text-2xl text-slate-900 tracking-tight">{tab.title}</h3>
                          <span className="text-[10px] sm:text-xs text-green-700 font-bold uppercase tracking-wider">{tab.short}</span>
                        </div>
                      </div>

                      {/* Main Copy */}
                      <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed mb-6 font-medium">
                        {tab.desc}
                      </p>

                      {/* Technical Grid Specs */}
                      <div className="mb-6">
                        <h5 className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-widest mb-3">
                          {content.specifications}
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {tab.stats.map((stat, index) => (
                            <div key={index} className="bg-slate-50 border border-slate-100 rounded-2xl p-3 sm:p-4 text-center">
                              <span className="block text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</span>
                              <span className="text-xs sm:text-sm font-black text-slate-800">{stat.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Telemetry Box */}
                      <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                          <span className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                            {content.sensorTelemetry}
                          </span>
                          <span className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {content.statusLabel}: <span className="text-green-600 font-black">ONLINE</span>
                          </span>
                        </div>

                        {/* Thermal Tab Interactive view */}
                        {tab.id === 'thermal' && (
                          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left w-full">
                              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-green-700/20 flex items-center justify-center relative bg-white shadow-inner shrink-0">
                                <Thermometer className="absolute text-green-700/10 w-10 h-10 sm:w-12 sm:h-12" />
                                <div className="text-center z-10">
                                  <span className="text-lg sm:text-xl font-black text-slate-800">{temp}°C</span>
                                  <span className="block text-[7px] sm:text-[8px] font-bold text-slate-400 uppercase tracking-wider">TEMP</span>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-extrabold text-sm text-slate-800 mb-1">{tab.interactiveTitle}</h4>
                                <p className="text-xs text-slate-500 leading-normal max-w-xs">{tab.interactiveDesc}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-center md:items-end gap-1.5 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-200/50">
                              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">PID DUTY CYCLE</span>
                              <div className="flex items-center gap-2 w-full justify-center md:justify-end">
                                <div className="w-32 sm:w-24 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                  <motion.div
                                    animate={{ width: `${40 + (temp - 37.5) * 100}%` }}
                                    className="h-full bg-green-600"
                                  ></motion.div>
                                </div>
                                <span className="text-xs font-black text-slate-700">42%</span>
                              </div>
                              <span className="text-[9px] font-black text-green-600 uppercase">STABILIZED</span>
                            </div>
                          </div>
                        )}

                        {/* Humidity Tab Interactive view */}
                        {tab.id === 'humidity' && (
                          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left w-full">
                              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-blue-400/20 flex items-center justify-center relative bg-white shadow-inner shrink-0">
                                <Droplets className="absolute text-blue-400/10 w-10 h-10 sm:w-12 sm:h-12" />
                                <div className="text-center z-10">
                                  <span className="text-lg sm:text-xl font-black text-slate-800">{humidity}%</span>
                                  <span className="block text-[7px] sm:text-[8px] font-bold text-slate-400 uppercase tracking-wider">HUMIDITY</span>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-extrabold text-sm text-slate-800 mb-1">{tab.interactiveTitle}</h4>
                                <p className="text-xs text-slate-500 leading-normal max-w-xs">{tab.interactiveDesc}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-200/50">
                              <div className="text-center md:text-right">
                                <span className="block text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider">WATER LEVEL</span>
                                <span className="text-xs font-black text-slate-800">85% (Optimal)</span>
                              </div>
                              <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-black border border-blue-100 w-full sm:w-auto">
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                MIST ACTIVE
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Rotation Tab Interactive view */}
                        {tab.id === 'rotation' && (
                          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left w-full">
                              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-amber-400/20 flex items-center justify-center relative bg-white shadow-inner overflow-hidden shrink-0">
                                <motion.div
                                  animate={{ rotate: rotationAngle }}
                                  transition={{ type: 'spring', damping: 12 }}
                                  className="w-10 h-14 sm:w-12 sm:h-16 bg-amber-50 rounded-[50%/60%_60%_40%_40%] border-2 border-amber-300 shadow-md relative flex items-center justify-center"
                                >
                                  <span className="w-1 h-3 bg-amber-400/40 rounded-full"></span>
                                </motion.div>
                              </div>
                              <div>
                                <h4 className="font-extrabold text-sm text-slate-800 mb-1">{tab.interactiveTitle}</h4>
                                <p className="text-xs text-slate-500 leading-normal max-w-xs">{tab.interactiveDesc}</p>
                              </div>
                            </div>
                            <div className="w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-200/50 flex flex-col items-center md:items-end">
                              <button
                                onClick={triggerRotationSim}
                                disabled={isRotating}
                                className="w-full sm:w-auto px-4 xs:px-5 py-2.5 xs:py-3 rounded-lg xs:rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-black text-[11px] xs:text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 xs:gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
                              >
                                <RotateCw size={12} xs:size={14} className={isRotating ? "animate-spin" : ""} />
                                {isRotating ? content.simulating : content.simulateBtn}
                              </button>
                              <span className="block text-center text-[9px] font-bold text-slate-400 mt-2">
                                CURRENT POSITION: <span className="font-black text-slate-800">{rotationAngle}°</span>
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Power Tab Interactive view */}
                        {tab.id === 'power' && (
                          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left w-full">
                              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-orange-400/20 flex items-center justify-center relative bg-white shadow-inner shrink-0">
                                {powerSource === 'grid' ? (
                                  <Zap className="text-orange-500 w-7 h-7 sm:w-8 sm:h-8" />
                                ) : (
                                  <Battery className="text-green-500 w-7 h-7 sm:w-8 sm:h-8" />
                                )}
                                <div className="absolute bottom-2">
                                  <span className="text-[6px] sm:text-[7px] font-black text-slate-400 uppercase tracking-widest">
                                    {powerSource === 'grid' ? 'GRID' : 'SOLAR'}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-extrabold text-sm text-slate-800 mb-1">{tab.interactiveTitle}</h4>
                                <p className="text-xs text-slate-500 leading-normal max-w-xs">{tab.interactiveDesc}</p>
                              </div>
                            </div>
                            <div className="w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-200/50 flex flex-col items-center md:items-end">
                              <button
                                onClick={triggerPowerSim}
                                disabled={isPowerSwitching}
                                className="w-full sm:w-auto px-4 xs:px-5 py-2.5 xs:py-3 rounded-lg xs:rounded-xl bg-slate-800 hover:bg-slate-900 disabled:bg-slate-600 text-white font-black text-[11px] xs:text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 xs:gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
                              >
                                {isPowerSwitching ? (
                                  <>
                                    <RefreshCw className="animate-spin" size={12} xs:size={14} />
                                    {content.simulating}
                                  </>
                                ) : (
                                  <>
                                    <AlertTriangle size={12} xs:size={14} />
                                    {powerSource === 'grid' ? 'Simulate Power Cut' : 'Restore Grid Power'}
                                  </>
                                )}
                              </button>
                              <span className="block text-center text-[9px] font-bold text-slate-400 mt-2">
                                BACKUP STANDBY: <span className="font-black text-green-600">ACTIVE (100%)</span>
                              </span>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>
      </section>

    </div>
  );
}
