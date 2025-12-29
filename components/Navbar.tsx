
import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onNavigate: (view: 'home' | 'suites' | 'reserve' | 'booking') => void;
  currentView: 'home' | 'suites' | 'reserve' | 'booking';
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navTheme = isScrolled || currentView !== 'home' ? 'dark' : 'light';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      navTheme === 'dark' ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div 
          className={`text-2xl font-serif tracking-widest cursor-pointer transition-colors ${
            navTheme === 'dark' ? 'text-stone-900' : 'text-white'
          }`}
          onClick={() => onNavigate('home')}
        >
          SILESIA <span className="font-light">GRAND</span>
        </div>
        
        <div className={`hidden md:flex space-x-8 text-[10px] font-bold uppercase tracking-[0.2em] ${
          navTheme === 'dark' ? 'text-stone-600' : 'text-white/80'
        }`}>
          <button 
            onClick={() => onNavigate('home')} 
            className={`hover:text-amber-500 transition-colors ${currentView === 'home' ? 'text-amber-600' : ''}`}
          >
            Experience
          </button>
          <button 
            onClick={() => onNavigate('suites')} 
            className={`hover:text-amber-500 transition-colors ${currentView === 'suites' ? 'text-amber-600' : ''}`}
          >
            The Collection
          </button>
          <button 
            onClick={() => onNavigate('booking')} 
            className={`hover:text-amber-500 transition-colors ${currentView === 'booking' ? 'text-amber-600' : ''}`}
          >
            Reserve
          </button>
        </div>

        <button 
          onClick={() => onNavigate('booking')}
          className="bg-stone-900 hover:bg-amber-600 text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95"
        >
          Book Now
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
