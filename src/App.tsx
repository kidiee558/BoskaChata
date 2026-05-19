import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TreePine, MapPin, Phone, Car, Users, Dog, Sun,
  CloudSun, Leaf, Flame, Bike, Calendar as CalendarIcon, 
  MessageCircle, Heart, Bird, Bug, Coffee, ArrowRight, Star, Home, ChevronLeft, ChevronRight, Plus, Minus, Facebook, Instagram, Globe, CheckCircle2, XCircle, Droplets, Utensils, Wind, Umbrella, ShieldAlert, Mail
} from 'lucide-react';
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameMonth, isToday, addMonths, subMonths, isBefore, startOfToday 
} from 'date-fns';
import { pl } from 'date-fns/locale';

const allPhotos = Array.from({length: 29}, (_, i) => `https://github.com/kidiee558/BoskaChata/blob/main/1%20(${i+1}).jpg?raw=true`);

const IMAGES = {
  hero: allPhotos[0],
  cabin1: allPhotos[4], 
  cabin2: allPhotos[5], 
  relax: allPhotos[6],
  nature1: allPhotos[7],
  coffee: allPhotos[10],
  details1: allPhotos[11], 
  interior: allPhotos[13],
  details2: allPhotos[14], 
  bonfire: allPhotos[20]
};

const galleryPhotos = allPhotos.slice(1);

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const REVIEWS = [
  {
    name: "Weronika", tenure: "10 lat na Airbnb", rating: 4,
    text: "Przepiękne miejsce! Działka w środku lasu, bardzo blisko do Bugu, wiele pięknych miejsc na spacer. Chatka ma zadaszony ganek, więc świetne miejsce nawet przy deszczowej pogodzie. W środku chatki wiele uroczych elementów np. domek dla skrzatów, który skradł nam serca. Wspaniałe miejsce na wypad, na pewno wrócimy!"
  },
  {
    name: "Aleksandra", tenure: "5 lat na Airbnb", rating: 5,
    text: "Spędziłam w Boskiej Chacie długi weekend w czerwcu. Wybrałam się tam razem z koleżankami na babski wypad. Uważam, że to świetne miejsce na tego typu wyjazdy poza miasto. Boska Chata to domek w klimacie działki. Znajduje się zaledwie 50 minut od Warszawy i można liczyć na prywatność i spokój."
  },
  {
    name: "Yelizaveta", tenure: "8 lat na Airbnb", rating: 5,
    text: "Fajna miejscówka w lesie. Blisko do rzeki. Cicho i spokojnie. Wanna w podłodze z widokiem na las jest miłą opcją relaksu:)"
  },
  {
    name: "Agnieszka", tenure: "12 lat na Airbnb", rating: 5,
    text: "Świetnie się bawiliśmy w Boskiej chacie. Dom jest przytulny i dobrze wyposażony. Użyliśmy grilla. Atmosfera była wspaniała, a las wokół niesamowity."
  },
  {
    name: "Patryk", tenure: "9 lat na Airbnb", rating: 5,
    text: "Świetny wypoczynek w pięknym otoczeniu. Polecamy!"
  },
  {
    name: "Marta", tenure: "12 lat na Airbnb", rating: 5,
    text: "Miejsce było bardzo spokojne, idealne na relaks pod miastem w gronie znajomych."
  },
  {
    name: "Paweł", tenure: "4 lata na Airbnb", rating: 5,
    text: "Spędziliśmy bardzo przyjemny weekend w Chacie. Idealne na 6 osób. Można rozpalić kominek czy ognisko. Blisko do rzeki i las wokół. Polecam ogromnie na wyciszenie z przyrodą."
  },
  {
    name: "Irina", tenure: "9 lat na Airbnb", rating: 5,
    text: "Kameralny domek, duży teren, cisza i spokój. Idealne miejsce na grilla i wypoczynek. Trzy duże sypialnie, dwie łazienki, z czego jedna z wanną w podłodze."
  },
  {
    name: "Anna", tenure: "3 lata na Airbnb", rating: 5,
    text: "To nie pierwszy raz, kiedy tu przyjeżdżam, dom jest doskonały, jest cicho, teren jest piękny, a gospodyni, Magdalena, jest wspaniała."
  }
];

export default function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [aboutImageIdx, setAboutImageIdx] = useState(0);
  const [quoteImageIdx, setQuoteImageIdx] = useState(0);
  
  const aboutImages = [IMAGES.cabin1, IMAGES.relax, IMAGES.nature1, IMAGES.coffee].filter(Boolean);
  const quoteImages = [IMAGES.details2, IMAGES.bonfire, IMAGES.interior, IMAGES.cabin2].filter(Boolean);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAboutImageIdx(prev => (prev + 1) % aboutImages.length);
      setQuoteImageIdx(prev => (prev + 1) % quoteImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [aboutImages.length, quoteImages.length]);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const [mapSpan, setMapSpan] = useState(0.008);
  const handleZoomIn = () => setMapSpan(prev => Math.max(0.0002, prev / 1.5));
  const handleZoomOut = () => setMapSpan(prev => Math.min(0.05, prev * 1.5));

  const reviewsRef = useRef<HTMLDivElement>(null);
  
  const scrollReviews = (direction: 'left' | 'right') => {
    if (reviewsRef.current) {
      const { scrollLeft, clientWidth } = reviewsRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth + 40 : scrollLeft + clientWidth - 40;
      reviewsRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="font-sans text-forest overflow-x-hidden selection:bg-sage selection:text-forest bg-sage-light relative">
      <div className="spring-glow bg-amber-200/30 w-[800px] h-[800px] top-0 left-0 -ml-[400px] -mt-[400px]"></div>
      <div className="spring-glow bg-green-200/20 w-[600px] h-[600px] top-1/3 right-0 -mr-[200px]"></div>

      {/* Navigation */}
      <nav className="fixed top-3 left-3 right-3 md:top-4 md:left-4 md:right-4 z-50 p-3 md:p-4 glass-panel bg-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative px-2 md:px-4">
          <div className="font-serif text-xl md:text-2xl tracking-tight font-extrabold text-forest drop-shadow-sm flex items-center gap-2">
            Boska Chata
          </div>
          <div className="hidden md:flex items-center gap-8 text-[11px] tracking-widest uppercase font-bold text-forest/90 drop-shadow-sm">
            <a href="#o-nas" className="hover:text-amber-600 transition-colors flex items-center gap-1.5"><Leaf size={14} /> O nas</a>
            <a href="#galeria" className="hover:text-amber-600 transition-colors flex items-center gap-1.5"><Heart size={14} /> Galeria</a>
            <a href="#cennik" className="hover:text-amber-600 transition-colors flex items-center gap-1.5"><CalendarIcon size={14} /> Cennik</a>
            <a href="#rezerwacja" className="hover:text-amber-600 transition-colors flex items-center gap-1.5"><MapPin size={14} /> Rezerwacja</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" onClick={(e) => e.preventDefault()} className="hidden md:flex glass-btn items-center gap-2 text-xs font-bold text-forest uppercase tracking-wider py-2.5 px-6 rounded-full shadow-sm">
              <Phone size={14} /> Zadzwoń
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="glass-btn md:hidden flex items-center gap-1.5 text-[10px] font-bold text-forest uppercase tracking-wider py-2 px-4 rounded-full">
              Zapytaj <MessageCircle size={14} />
            </a>
          </div>
        </div>
      </nav>

      {/* Full Screen Hero Section */}
      <section className="relative h-[100svh] w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img src={IMAGES.hero} alt="Las w słońcu" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-sage-light" />
        </div>
        
        <div className="relative z-10 w-full mx-auto px-4 md:px-12 lg:px-24 flex flex-col items-center justify-center max-w-7xl h-full mt-10 md:mt-24">
          <FadeIn className="w-full flex flex-col md:items-start md:w-max">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              className="font-serif text-[48px] sm:text-7xl md:text-8xl lg:text-[10rem] mb-2 tracking-tight text-white drop-shadow-2xl font-bold leading-none pr-1 md:pr-0 md:self-start text-center md:text-left w-full"
            >
              Boska Chata.
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              className="font-sans text-[17px] sm:text-[22px] md:text-[26px] lg:text-[34px] text-white font-medium tracking-[0.25em] md:tracking-[0.3em] uppercase drop-shadow-md mb-8 lg:mb-12 md:self-start text-center md:text-left w-full"
            >
              Ucieknij w naturę.
            </motion.div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between w-full gap-6 md:gap-12 mt-2 md:mt-4">
              <motion.a
                href="#cennik"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
                className="glass-btn text-forest px-8 py-4 md:px-10 md:py-5 rounded-full font-extrabold uppercase tracking-widest text-[11px] md:text-sm flex items-center justify-center gap-2 md:gap-3 mt-4 md:mt-0 shadow-lg shrink-0 mx-auto md:mx-0 whitespace-nowrap self-center md:self-start order-2 md:order-1"
              >
                Zarezerwuj swój pobyt <ArrowRight size={16} />
              </motion.a>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="text-[16px] sm:text-[19px] md:text-xl font-semibold tracking-wide max-w-[600px] md:max-w-[400px] lg:max-w-[500px] text-white/95 drop-shadow-md px-2 md:px-0 text-center md:text-right order-1 md:order-2"
              >
                Twoja letniskowa przystań w Deskurowie nad Bugiem. Słońce przebijające przez drzewa, śpiew ptaków i totalny reset od miasta.
              </motion.p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Main Content Area with warm background pattern */}
      <div className="relative">
        {/* Removed internal background pattern to use solid cleaner backdrop */}
        
        {/* Info Grid - Why Us */}
        <section className="py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto -mt-12 md:-mt-24 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Sun, title: "Pełen Relaks", desc: "Słońce, leżaki i cisza, która leczy duszę." },
              { icon: Car, title: "Z Warszawy", desc: "Zaledwie 30 min trasą S8." },
              { icon: Dog, title: "Pet Friendly", desc: "Twój pupil jest mile widziany." },
              { icon: Users, title: "Dla Ekipy", desc: "Nocleg dla 6 dorosłych i dziecka." },
            ].map((item, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="glass-panel relative overflow-hidden bg-gradient-to-br from-amber-50 to-sage-light border-amber-200/40 p-5 md:p-10 text-center h-full hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center justify-center group shadow-md hover:shadow-xl aspect-square lg:aspect-auto">
                  <item.icon className="absolute -bottom-6 -right-6 w-24 h-24 md:w-48 md:h-48 text-forest opacity-[0.03] rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/60 backdrop-blur-sm text-forest border border-white/80 rounded-[14px] md:rounded-3xl flex items-center justify-center mx-auto mb-3 md:mb-5 shadow-sm group-hover:scale-110 transition-transform duration-500 relative z-10 shrink-0">
                    <item.icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif font-bold text-sm md:text-xl mb-1.5 md:mb-2 text-forest relative z-10">{item.title}</h3>
                  <p className="text-[9px] md:text-xs font-bold opacity-75 uppercase tracking-[1px] md:tracking-[1.5px] leading-relaxed relative z-10 px-1 md:px-2">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Intro / About */}
        <section id="o-nas" className="py-10 md:py-20 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="spring-glow bg-green-200/20 w-[600px] h-[600px] top-[10%] -left-20"></div>
          <FadeIn>
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="glass-panel p-6 md:p-14 bg-gradient-to-br from-[#f8f6ed] to-[#edece1] border-white/80 flex flex-col justify-center space-y-6 md:space-y-8 h-full relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.05)]">
                <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-sage-light/60 rounded-full blur-[60px] -mr-16 -mt-16 md:-mr-20 md:-mt-20 pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="tag mb-3 md:mb-4 bg-sage-light/80 text-forest border-forest/10 text-[9px] md:text-[11px] shadow-sm font-bold uppercase tracking-widest">Wakacyjny Reset</div>
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl text-forest leading-[1.1] mb-4 md:mb-8 font-bold">
                    Poczuj wiosnę i lato na nowo.
                  </h2>
                  <div className="text-sm md:text-lg text-forest/90 leading-relaxed font-semibold space-y-4 md:space-y-6">
                    <p className="font-serif italic text-xl md:text-2xl text-forest w-full border-l-4 border-amber-300 pl-4 py-1.5 bg-gradient-to-r from-amber-50/50 to-transparent">
                      Zwalniamy tempo. Wsłuchujemy się w wiatr i szum drzew.
                    </p>
                    <p>
                      Mamy nadzieję, że jeśli nie macie jeszcze pełnych planów wakacyjnych lub nudzi wam się wolny czas w mieście – przyjedziecie do nas. 
                      Przygotowujemy dla Was leśne siedliska na cały sezon.
                    </p>
                    <p className="hidden md:block">
                      Czeka tu na Was wolna głowa, wciągająca książka, blask ogniska, cudowne trasy rowerowe i absolutna natura dokoła.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative h-[350px] sm:h-[400px] lg:h-full lg:min-h-[550px] w-full p-0 shadow-2xl hover:rotate-1 transition-transform duration-700 rounded-3xl md:rounded-[40px] overflow-hidden bg-forest/5">
                <img key={aboutImageIdx} src={aboutImages[aboutImageIdx]} alt="Klimat z Boskiej Chaty" className="absolute inset-0 w-full h-full object-cover animate-fade-in" />
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Gallery - Masonry Layout for many photos */}
        <section id="galeria" className="py-12 md:py-20 px-4 md:px-6 max-w-[100rem] mx-auto overflow-hidden">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="font-serif text-4xl md:text-6xl text-forest mb-4 md:mb-6 font-bold">Tak tu pięknie...</h2>
            <p className="text-[10px] md:text-sm font-bold uppercase tracking-[4px] opacity-60 text-forest">Poczuj ten sielski klimat na własnej skórze</p>
          </div>
          
          <div className="columns-2 md:columns-3 lg:columns-4 gap-2 md:gap-6 space-y-2 md:space-y-6">
            {galleryPhotos.map((photo, idx) => (
              <FadeIn key={idx} delay={(idx % 6) * 0.05} className="break-inside-avoid">
                <div className="md:glass-panel p-0 md:p-2 rounded-xl md:rounded-[32px] overflow-hidden group shadow-md md:shadow-lg hover:shadow-2xl transition-all duration-500 bg-transparent">
                  <div className="relative overflow-hidden rounded-xl md:rounded-[24px] h-full">
                    <img 
                      src={photo}
                      onClick={() => setSelectedImage(photo)}
                      className="w-full object-cover md:h-auto group-hover:scale-110 transition-transform duration-[1.5s] ease-out cursor-pointer" 
                      alt={`Galeria ${idx + 1}`} 
                      loading="lazy"
                    />
                    <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-forest/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-12 md:py-24 relative w-full overflow-hidden">
          <div className="max-w-[100rem] mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center mb-6 md:mb-10 text-center relative">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 md:w-7 md:h-7 text-amber-500 fill-amber-500" />
                <span className="font-bold text-xl md:text-2xl text-forest">5.0</span>
              </div>
              <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[3px] opacity-60 text-forest">Ponad 50 opinii obiektu</p>
              
              <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 gap-3">
                <button onClick={() => scrollReviews('left')} className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-sage-light shadow-lg hover:shadow-xl transition-all border border-white/50 text-forest">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={() => scrollReviews('right')} className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-sage-light shadow-lg hover:shadow-xl transition-all border border-white/50 text-forest">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
          
          <div ref={reviewsRef} className="flex overflow-x-auto gap-4 md:gap-6 pb-4 md:pb-12 pt-4 snap-x snap-mandatory hide-scrollbar">
            <div className="w-4 md:w-[calc(50vw-min(50vw,50rem)+1rem)] shrink-0"></div>
            {REVIEWS.map((review, idx) => (
              <div key={idx} className="snap-center shrink-0 w-[280px] sm:w-[320px] md:w-[400px] glass-panel bg-white/70 p-6 md:p-8 rounded-[24px] md:rounded-[36px] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300">
                <div>
                  <div className="flex gap-1 mb-4 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm md:text-base italic leading-relaxed text-forest/90 mb-6">"{review.text}"</p>
                </div>
                <div className="flex items-center gap-4 border-t border-forest/10 pt-4 mt-auto">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-forest text-sage-light rounded-full flex items-center justify-center font-bold text-lg md:text-xl">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm md:text-base text-forest">{review.name}</p>
                    <p className="text-[10px] md:text-xs font-bold opacity-60 text-forest">{review.tenure}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="w-4 md:w-[calc(50vw-min(50vw,50rem)+1rem)] shrink-0"></div>
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-8 md:hidden px-4">
            <button onClick={() => scrollReviews('left')} className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg border border-white/50 text-forest">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={() => scrollReviews('right')} className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg border border-white/50 text-forest">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </section>

        {/* Amenities / Co znajdziesz w tym miejscu */}
        <section className="py-16 md:py-28 px-4 md:px-8 max-w-[90rem] mx-auto border-t border-forest/10 mt-12 md:mt-24">
          <div className="mb-12 md:mb-20 text-center md:text-left">
            <div>
              <h2 className="font-serif text-3xl md:text-6xl text-forest font-bold mb-4 md:mb-6">Co u nas znajdziesz?</h2>
              <p className="text-sm md:text-xl font-semibold opacity-70 text-forest">6 gości • 3 sypialnie • 5 łóżek • 2 łazienki</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-12 md:gap-y-20 gap-x-8 md:gap-x-16">
            <div className="flex flex-col items-center md:items-start text-left">
              <div className="w-full max-w-[280px] md:max-w-none">
                <h4 className="flex items-center justify-start gap-4 font-bold text-forest text-xl md:text-2xl mb-5 md:mb-6"><span className="p-2 md:p-3 bg-sage rounded-xl"><Droplets className="w-5 h-5 md:w-7 md:h-7" /></span> Łazienka</h4>
                <ul className="space-y-4 md:space-y-5 text-base md:text-lg font-semibold text-forest/80 text-left">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 opacity-40 shrink-0" /> Wanna</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 opacity-40 shrink-0" /> Środki czystości</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 opacity-40 shrink-0" /> Ciepła woda</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-start text-left">
              <div className="w-full max-w-[280px] md:max-w-none">
                <h4 className="flex items-center justify-start gap-4 font-bold text-forest text-xl md:text-2xl mb-5 md:mb-6"><span className="p-2 md:p-3 bg-sage rounded-xl"><Wind className="w-5 h-5 md:w-7 md:h-7" /></span> Sypialnia i pranie</h4>
                <ul className="space-y-4 md:space-y-5 text-base md:text-lg font-semibold text-forest/80 text-left">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 opacity-40 shrink-0" /> Ręczniki, pościel, mydło</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 opacity-40 shrink-0" /> Pościel bawełniana</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 opacity-40 shrink-0" /> Moskitiera, Wieszaki</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-start text-left">
              <div className="w-full max-w-[280px] md:max-w-none">
                <h4 className="flex items-center justify-start gap-4 font-bold text-forest text-xl md:text-2xl mb-5 md:mb-6"><span className="p-2 md:p-3 bg-sage rounded-xl"><Utensils className="w-5 h-5 md:w-7 md:h-7" /></span> Kuchnia i jadalnia</h4>
                <ul className="space-y-4 md:space-y-5 text-base md:text-lg font-semibold text-forest/80 text-left">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 opacity-40 shrink-0" /> Przestrzeń do gotowania</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 opacity-40 shrink-0" /> Lodówka, Czajnik</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 opacity-40 shrink-0" /> Garnki, naczynia, kieliszki</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-start text-left">
              <div className="w-full max-w-[280px] md:max-w-none">
                <h4 className="flex items-center justify-start gap-4 font-bold text-forest text-xl md:text-2xl mb-5 md:mb-6"><span className="p-2 md:p-3 bg-sage rounded-xl"><Umbrella className="w-5 h-5 md:w-7 md:h-7" /></span> Na świeżym powietrzu</h4>
                <ul className="space-y-4 md:space-y-5 text-base md:text-lg font-semibold text-forest/80 text-left">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 opacity-40 shrink-0" /> Prywatny taras, Meble</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 opacity-40 shrink-0" /> Ogrodzone podwórko z trawą</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 opacity-40 shrink-0" /> Palenisko, Grill</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-start text-left">
              <div className="w-full max-w-[280px] md:max-w-none">
                <h4 className="flex items-center justify-start gap-4 font-bold text-forest text-xl md:text-2xl mb-5 md:mb-6"><span className="p-2 md:p-3 bg-sage rounded-xl"><ShieldAlert className="w-5 h-5 md:w-7 md:h-7" /></span> Bezpieczeństwo i Inne</h4>
                <ul className="space-y-4 md:space-y-5 text-base md:text-lg font-semibold text-forest/80 text-left">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 opacity-40 shrink-0" /> Czujnik czadu, Gaśnica</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 opacity-40 shrink-0" /> Zwierzęta dozwolone</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 opacity-40 shrink-0" /> Pobyty długoterminowe (28+)</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-start text-left">
              <div className="w-full max-w-[280px] md:max-w-none">
                <h4 className="flex items-center justify-start gap-4 font-bold text-forest text-xl md:text-2xl mb-5 md:mb-6"><span className="p-2 md:p-3 bg-rose-200/50 rounded-xl"><XCircle className="w-5 h-5 md:w-7 md:h-7 text-rose-500" /></span> Niedostępne</h4>
                <ul className="space-y-4 md:space-y-5 text-base md:text-lg font-semibold text-forest/60 text-left">
                  <li className="flex items-center gap-3 line-through"><XCircle className="w-5 h-5 opacity-40 shrink-0" /> Wi-Fi i Telewizor</li>
                  <li className="flex items-center gap-3 line-through"><XCircle className="w-5 h-5 opacity-40 shrink-0" /> Pralka i Suszarka</li>
                  <li className="flex items-center gap-3 line-through"><XCircle className="w-5 h-5 opacity-40 shrink-0" /> Klimatyzacja i Czujnik dymu</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing / CTA Section */}
        <section id="cennik" className="py-12 md:py-24 px-4 md:px-6 max-w-6xl mx-auto relative">
          <div className="spring-glow bg-amber-200/40 w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          
          <FadeIn>
            <div className="glass flex flex-col md:flex-row gap-3 md:gap-4 p-2 md:p-4 rounded-[32px] md:rounded-[48px] shadow-2xl relative z-10 border border-white/80 bg-white/40 backdrop-blur-2xl">
              
              <div className="flex-1 glass-panel bg-white/80 rounded-[28px] md:rounded-[40px] p-8 md:p-14 shadow-inner flex flex-col justify-center">
                <div className="tag mb-4 md:mb-6 border-none inline-block self-start text-[9px] md:text-xs tracking-widest font-bold">Rezerwacje na sezon otwarte!</div>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-6 md:mb-8 leading-tight text-forest font-bold">
                  Złap swój termin!
                </h2>

                <div className="space-y-4 md:space-y-8 text-forest">
                  <div className="flex justify-between items-end border-b border-forest/10 pb-3 md:pb-4">
                    <span className="text-xs md:text-sm font-bold opacity-70">Dni powszednie</span>
                    <div className="text-right flex flex-col items-end">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="bg-rose-500 text-white text-[8px] md:text-[9px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm">Zniżka</span>
                        <span className="text-xs md:text-sm text-rose-500/80 line-through font-black">450 PLN</span>
                      </div>
                      <span className="text-xl md:text-3xl font-serif font-bold text-forest">350 PLN <small className="text-[9px] md:text-xs font-bold opacity-50 font-sans">/noc</small></span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end border-b border-forest/10 pb-3 md:pb-4">
                    <span className="text-xs md:text-sm font-bold opacity-70">Weekend <span className="hidden sm:inline">(Pt-Nd)</span></span>
                    <div className="text-right flex flex-col items-end">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="bg-rose-500 text-white text-[8px] md:text-[9px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm">Zniżka</span>
                        <span className="text-xs md:text-sm text-rose-500/80 line-through font-black">650 PLN</span>
                      </div>
                      <span className="text-xl md:text-3xl font-serif font-bold text-forest">550 PLN <small className="text-[9px] md:text-xs font-bold opacity-50 font-sans">/noc</small></span>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50/80 p-5 md:p-8 rounded-2xl md:rounded-3xl border border-amber-200/50 mt-4 md:mt-8 shadow-sm">
                    <ul className="text-[10px] md:text-xs font-bold uppercase opacity-80 grid gap-3 md:gap-4">
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 flex-shrink-0 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,1)]"></div> <strong>Min. rezerwacja:</strong> 2 noce</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 flex-shrink-0 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,1)]"></div> <strong>Sprzątanie:</strong> 250 PLN</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 flex-shrink-0 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,1)]"></div> <strong>Zwierzak:</strong> 60 PLN</li>
                      <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 flex-shrink-0 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,1)]"></div> <strong>Dla was:</strong> 6 dorosłych + 1</li>
                    </ul>
                  </div>
                  
                  <a href="#rezerwacja" className="w-full py-4 md:py-6 mt-4 md:mt-8 bg-forest text-white rounded-xl md:rounded-2xl font-bold tracking-[2px] text-xs md:text-sm hover:bg-forest/90 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(45,58,40,0.3)] active:transform-none transition-all flex items-center justify-center gap-3 uppercase shadow-xl text-center">
                    Zarezerwuj termin <CalendarIcon className="w-4 h-4 md:w-5 md:h-5" />
                  </a>
                </div>
              </div>

              <div className="md:w-[40%] relative rounded-[28px] md:rounded-[40px] overflow-hidden min-h-[300px] md:min-h-full">
                <img key={quoteImageIdx} src={quoteImages[quoteImageIdx]} className="absolute inset-0 w-full h-full object-cover animate-fade-in" alt="Klimat chaty" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-10 md:right-10 text-white">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/30">
                    <Leaf className="text-white w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <p className="font-serif text-lg md:text-2xl leading-relaxed italic drop-shadow-lg text-white/95">
                    "Zapomnisz tu o pośpiechu, mieście i troskach. Wieczory pachną lasem..."
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Calendar & Map Area */}
        <section id="rezerwacja" className="py-12 md:py-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center mb-10 md:mb-16">
                <h2 className="font-serif text-3xl md:text-5xl text-forest mb-3 md:mb-4 font-bold">Sprawdź wolne terminy i lokalizację</h2>
                <div className="flex justify-center flex-wrap gap-2 md:gap-4">
                  <span className="text-[10px] md:text-xs uppercase font-bold bg-amber-100/50 px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm border border-amber-200 text-amber-800">50km od Warszawy</span>
                </div>
              </div>
            </FadeIn>

            <div className="grid lg:grid-cols-5 gap-6 md:gap-10">
              
              {/* Minimal Calendar */}
              <FadeIn className="lg:col-span-2">
                <div className="glass-panel p-6 md:p-10 flex flex-col bg-white/70 border-white/80 shadow-2xl h-full">
                  <div className="flex justify-between items-center mb-8 md:mb-10">
                    <h3 className="font-serif text-2xl md:text-3xl capitalize font-bold text-forest">
                      {format(currentMonth, 'LLLL yyyy', { locale: pl })}
                    </h3>
                    <div className="flex gap-2">
                      <button onClick={prevMonth} className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white flex items-center justify-center hover:bg-sage-light shadow-[0_4px_12px_rgba(45,58,40,0.05)] transition-all text-sm font-bold border border-white">
                        ←
                      </button>
                      <button onClick={nextMonth} className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white flex items-center justify-center hover:bg-sage-light shadow-[0_4px_12px_rgba(45,58,40,0.05)] transition-all text-sm font-bold border border-white">
                        →
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/50 p-4 md:p-6 rounded-3xl md:rounded-[32px] border border-white flex-grow shadow-inner">
                    <div className="grid grid-cols-7 gap-1 md:gap-2 mb-3 md:mb-6">
                      {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'].map(d => (
                        <div key={d} className="text-[10px] md:text-[11px] text-center opacity-60 uppercase font-extrabold tracking-widest text-forest">{d}</div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 md:gap-2">
                      {Array.from({ length: (startOfMonth(currentMonth).getDay() + 6) % 7 }).map((_, i) => (
                        <div key={`empty-${i}`} className="w-full aspect-square"></div>
                      ))}
                      
                      {daysInMonth.map((date, i) => {
                        const isPast = isBefore(date, startOfToday());
                        const isTodayDate = isToday(date);
                        
                        let classes = "w-full aspect-square flex items-center justify-center rounded-[10px] md:rounded-2xl text-[11px] md:text-sm transition-all border border-transparent font-bold ";
                        
                        if (isPast) {
                          classes += " bg-white/20 text-forest/20 cursor-not-allowed";
                        } else if (isTodayDate) {
                          classes += " bg-forest text-white shadow-[0_10px_20px_rgba(45,58,40,0.2)] cursor-pointer scale-105 md:scale-110";
                        } else {
                          classes += " bg-white border-white cursor-pointer hover:bg-amber-100 hover:text-amber-900 hover:border-amber-200 shadow-sm";
                        }

                        return (
                          <div key={i} className={classes}>
                            {format(date, 'd')}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-forest/10">
                    <div className="flex flex-col gap-3 md:gap-4">
                      <div className="flex flex-wrap gap-4 md:gap-6 text-[10px] md:text-xs opacity-90 font-bold uppercase tracking-[2px] justify-center bg-white/60 p-3 md:p-4 rounded-2xl md:rounded-3xl border border-white">
                        <div className="flex items-center gap-2 text-forest"><div className="w-3 h-3 rounded-full bg-white border border-forest/20 shadow-sm"></div> Wolne</div>
                        <div className="flex items-center gap-2 text-forest"><div className="w-3 h-3 rounded-full bg-black/10"></div> Zajęte</div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Location Map Placeholder */}
              <FadeIn delay={0.2} className="lg:col-span-3 h-full">
                <div className="glass-panel p-2 md:p-4 h-full min-h-[400px] md:min-h-[500px] rounded-[32px] md:rounded-[48px] relative overflow-hidden flex flex-col bg-white/60 border-white/80 shadow-2xl">
                  {/* Map */}
                  <div className="absolute top-0 bottom-0 left-0 right-0 z-0 overflow-hidden md:rounded-[44px]">
                    <div className="absolute top-[-100px] bottom-[-100px] left-[-100px] right-[-100px] pointer-events-none">
                      <iframe 
                        className="w-full h-full grayscale-[25%] opacity-95 border-none pointer-events-none"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${21.401360 - mapSpan}%2C${52.550331 - mapSpan*0.6}%2C${21.401360 + mapSpan}%2C${52.550331 + mapSpan*0.6}&layer=mapnik`} 
                        allowFullScreen
                        loading="lazy"
                        title="Mapa okolicy Deskurów"
                      ></iframe>
                    </div>
                    
                    {/* Custom Map Pin */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center drop-shadow-2xl">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-forest text-white rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(45,58,40,0.5)] border-[3px] border-white animate-bounce pointer-events-none">
                        <Home className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2} />
                      </div>
                      <div className="w-1 h-8 md:h-10 bg-forest shadow-xl pointer-events-none"></div>
                      <div className="w-4 h-2 md:w-6 md:h-3 bg-black/40 rounded-full blur-[3px] pointer-events-none mt-0"></div>
                    </div>

                    {/* Zoom Controls */}
                    <div className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 z-20 flex flex-col gap-2">
                      <button onClick={handleZoomIn} className="w-10 h-10 md:w-12 md:h-12 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center text-forest shadow-[0_8px_16px_rgba(0,0,0,0.1)] border border-white hover:bg-white hover:scale-105 transition-all cursor-pointer">
                        <Plus className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                      </button>
                      <button onClick={handleZoomOut} className="w-10 h-10 md:w-12 md:h-12 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center text-forest shadow-[0_8px_16px_rgba(0,0,0,0.1)] border border-white hover:bg-white hover:scale-105 transition-all cursor-pointer">
                        <Minus className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                      </button>
                    </div>
                  </div>

                  {/* Text Overlay for Location - Minimalist at bottom left */}
                  <div className="absolute bottom-2 left-2 right-2 md:bottom-6 md:left-6 max-w-[calc(100%-16px)] md:max-w-sm z-20 bg-white/95 backdrop-blur-xl p-3 md:p-4 flex flex-row md:flex-col gap-2.5 md:gap-3 rounded-[16px] md:rounded-[28px] shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-white items-center md:items-start">
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 bg-gradient-to-br from-amber-100 to-amber-50 rounded-[10px] md:rounded-[14px] flex items-center justify-center text-amber-600 shadow-inner">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
                      </div>
                      <div className="hidden md:block">
                        <h4 className="font-serif text-lg md:text-xl font-bold text-forest leading-none mb-1">Deskurów</h4>
                        <p className="text-[9px] uppercase font-bold text-forest/70 tracking-[2px]">50km od Warszawy</p>
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-serif text-base md:text-lg font-bold text-forest leading-none mb-1 md:hidden">Deskurów</h4>
                      <p className="text-[11.5px] md:text-xs text-forest/80 leading-snug font-semibold line-clamp-2 md:line-clamp-none">
                        Dolina Bugu to ostoja ptaków, w otoczeniu starych lasów sosnowych.
                      </p>
                    </div>
                  </div>
                  
                </div>
              </FadeIn>

            </div>
          </div>
        </section>

        {/* Gospodarz / Hosting */}
        <section className="py-12 md:py-16 px-4 md:px-6 text-center max-w-2xl mx-auto space-y-4">
          <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full overflow-hidden bg-forest/10 border-4 border-white shadow-xl flex items-center justify-center text-forest">
            <span className="font-serif text-3xl font-bold text-forest">M</span>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-forest">Magdalena to Superhost</h3>
          <p className="text-xs md:text-sm text-forest/80 font-semibold px-4 pb-4">
            Gospodarze Superhost to wysoko oceniani gospodarze, którzy dokładają wszelkich starań, by zapewnić gościom niezapomniane wrażenia.
          </p>
          <div className="inline-flex gap-4 md:gap-8 justify-center items-center text-[10px] md:text-xs font-bold uppercase tracking-[2px] opacity-70">
            <span>Wskaźnik aktywności: 100%</span>
            <span>Odpowiada w ciągu godziny</span>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 md:py-20 px-4 md:px-6 mt-6 md:mt-12 bg-[#232d1f] text-sage-light overflow-hidden relative rounded-t-[40px] md:rounded-t-[80px]">
          <div className="absolute -bottom-10 -right-10 md:-bottom-20 md:-right-20 opacity-5">
            <TreePine className="w-[250px] h-[250px] md:w-[400px] md:h-[400px]" />
          </div>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 relative z-10">
            <div className="text-center md:text-left">
              <h4 className="font-serif text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4">Boska Chata</h4>
              <p className="text-[10px] md:text-xs uppercase font-bold opacity-60 tracking-[3px]">Twoje miejsce z dala od zgiełku.</p>
            </div>
            
            <div className="flex flex-col gap-6 md:gap-5 w-full md:w-auto items-center">
              <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-5 w-full md:w-auto">
                <div className="flex flex-row w-full md:w-auto gap-3 md:gap-5">
                  <a href="#" onClick={(e) => e.preventDefault()} className="flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-3 hover:bg-white hover:text-forest transition-colors duration-300 text-[11px] md:text-sm uppercase font-bold tracking-widest bg-white/10 py-3.5 md:px-8 md:py-4 rounded-[24px] md:rounded-full border border-white/20">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,1)] hidden md:block"></span>
                    <MessageCircle size={16} className="md:hidden" /> Napisz
                  </a>
                  <a href="#" onClick={(e) => e.preventDefault()} className="flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-3 hover:bg-white hover:text-forest transition-colors duration-300 text-[11px] md:text-sm uppercase font-bold tracking-widest bg-white/10 py-3.5 md:px-8 md:py-4 rounded-[24px] md:rounded-full border border-white/20">
                    <Phone size={16} /> Zadzwoń
                  </a>
                </div>
                <a href="mailto:info@boskas.pl" className="w-full md:w-auto flex flex-none items-center justify-center gap-2 md:gap-3 hover:bg-white hover:text-forest transition-colors duration-300 text-[11px] md:text-sm uppercase font-bold tracking-widest bg-white/10 py-3.5 md:px-8 md:py-4 rounded-[24px] md:rounded-full border border-white/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,1)] hidden md:block"></span>
                  <Mail size={16} className="md:hidden" /> Info@boskas.pl
                </a>
              </div>
              
              <div className="flex flex-row justify-center gap-3 w-full md:w-auto">
                <a href="https://www.facebook.com/profile.php?id=100070429842909" target="_blank" rel="noreferrer" className="flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-0 w-auto md:w-14 h-auto py-3 md:py-0 md:h-14 rounded-[20px] md:rounded-full border border-white/20 hover:bg-white hover:text-forest transition-all bg-white/5 md:bg-transparent">
                  <Facebook size={20} />
                  <span className="text-[9px] uppercase font-bold tracking-wider md:hidden mt-0.5 opacity-80">Facebook</span>
                </a>
                <a href="https://www.instagram.com/boska_chata/" target="_blank" rel="noreferrer" className="flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-0 w-auto md:w-14 h-auto py-3 md:py-0 md:h-14 rounded-[20px] md:rounded-full border border-white/20 hover:bg-white hover:text-forest transition-all bg-white/5 md:bg-transparent">
                  <Instagram size={20} />
                  <span className="text-[9px] uppercase font-bold tracking-wider md:hidden mt-0.5 opacity-80">Instagram</span>
                </a>
                <a href="https://www.airbnb.pl/rooms/593452868479231026" target="_blank" rel="noreferrer" className="flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-0 w-auto md:w-14 h-auto py-3 md:py-0 md:h-14 rounded-[20px] md:rounded-full border border-white/20 hover:bg-white hover:text-forest transition-all bg-white/5 md:bg-transparent">
                  <Globe size={20} />
                  <span className="text-[9px] uppercase font-bold tracking-wider md:hidden mt-0.5 opacity-80">Airbnb</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto mt-12 md:mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60">
            <p className="flex items-center gap-2">&copy; {new Date().getFullYear()} Boska Chata.</p>
            <p className="mt-4 md:mt-0 opacity-50">Deskurów nad Bugiem</p>
          </div>
        </footer>
        
        {/* Fullscreen Photo Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-2 md:p-8 backdrop-blur-sm cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }} 
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white p-2 transition-colors z-[110]"
            >
              <XCircle className="w-8 h-8 md:w-12 md:h-12" />
            </button>
            <img 
              src={selectedImage} 
              className="max-w-full max-h-[92svh] md:max-h-[95vh] rounded-lg md:rounded-xl object-contain shadow-2xl animate-fade-in" 
              alt="Powiększenie" 
            />
          </div>
        )}
      </div>
    </div>
  );
}

