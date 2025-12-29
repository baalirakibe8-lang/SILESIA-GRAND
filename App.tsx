
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import AIConcierge from './components/AIConcierge.tsx';
import RoomDetailsModal from './components/RoomDetailsModal.tsx';
import SuitesPage from './components/SuitesPage.tsx';
import ReservePage from './components/ReservePage.tsx';
import BookNowPage from './components/BookNowPage.tsx';
import { ROOMS, AMENITIES } from './constants.tsx';
import { Room, UserImage } from './types.ts';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'suites' | 'reserve' | 'booking'>('home');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [userRoomImages, setUserRoomImages] = useState<Record<string, UserImage[]>>({});
  const [roomRatings, setRoomRatings] = useState<Record<string, number[]>>({});
  const [distanceToHotel, setDistanceToHotel] = useState<number | null>(null);

  const HOTEL_LAT = 50.2644;
  const HOTEL_LON = 19.0236;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const dist = calculateDistance(latitude, longitude, HOTEL_LAT, HOTEL_LON);
        setDistanceToHotel(Math.round(dist));
      });
    }
  }, []);

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const handleAddUserImage = (roomId: string, imageData: string) => {
    const newImage: UserImage = {
      id: Math.random().toString(36).substr(2, 9),
      url: imageData,
      rating: 0,
      isFavorite: false,
      timestamp: Date.now()
    };
    setUserRoomImages(prev => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), newImage]
    }));
  };

  const handleUpdateUserImage = (roomId: string, imageId: string, updates: Partial<UserImage>) => {
    setUserRoomImages(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || []).map(img => 
        img.id === imageId ? { ...img, ...updates } : img
      )
    }));
  };

  const handleRemoveUserImage = (roomId: string, imageId: string) => {
    setUserRoomImages(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || []).filter(img => img.id !== imageId)
    }));
  };

  const handleAddRoomRating = (roomId: string, rating: number) => {
    setRoomRatings(prev => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), rating]
    }));
  };

  return (
    <div className="min-h-screen relative font-sans selection:bg-amber-200 selection:text-amber-900 bg-stone-50">
      <Navbar onNavigate={setView} currentView={view} />
      
      <main>
        {view === 'home' && (
          <>
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-0 scale-110 motion-safe:animate-[pulse_10s_infinite]">
                <img 
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920" 
                  alt="Silesia Grand Hotel Exterior" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px]"></div>
              </div>
              
              <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
                <div className="overflow-hidden mb-6">
                  <span className="uppercase tracking-[0.4em] text-[10px] md:text-xs block animate-in slide-in-from-bottom duration-1000 font-bold text-amber-500">
                    Katowice | The Heart of Industrial Modernism
                  </span>
                </div>
                <h1 className="text-6xl md:text-[10rem] font-serif mb-8 leading-tight animate-in fade-in zoom-in duration-1000">
                  Silesia <span className="italic font-light opacity-80">Grand</span>
                </h1>
                <p className="text-lg md:text-2xl max-w-2xl mx-auto font-light opacity-90 leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
                  Experience the sophisticated rebirth of Katowice. From coal mine legacy to cultural sanctuary.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
                  <button onClick={() => setView('suites')} className="bg-amber-600 hover:bg-amber-700 text-white px-12 py-5 uppercase tracking-[0.2em] text-[10px] font-bold transition-all shadow-2xl hover:-translate-y-1 active:translate-y-0">
                    Explore Suites
                  </button>
                  <button onClick={() => setView('booking')} className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-12 py-5 uppercase tracking-[0.2em] text-[10px] font-bold transition-all hover:-translate-y-1 active:translate-y-0">
                    Book Your Stay
                  </button>
                </div>
              </div>

              {distanceToHotel !== null && (
                <div className="absolute bottom-12 right-12 z-20 text-white/40 text-[10px] uppercase tracking-widest hidden md:block">
                  You are {distanceToHotel}km from luxury
                </div>
              )}

              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-bold">Scroll to Discover</span>
                <div className="w-[1px] h-12 bg-white/20 animate-bounce"></div>
              </div>
            </section>

            {/* Modernist Quote */}
            <section className="py-40 px-6 bg-white border-b border-stone-100">
              <div className="max-w-4xl mx-auto text-center">
                <div className="text-amber-600 text-4xl mb-12 font-serif">“</div>
                <h2 className="text-3xl md:text-5xl font-serif italic text-stone-800 leading-snug mb-12">
                  Katowice is not just a destination; it is a transformation. We invite you to witness the architectural soul of Poland from our windows.
                </h2>
                <div className="flex items-center justify-center gap-6">
                  <div className="w-12 h-[1px] bg-stone-200"></div>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold">Silesian Heritage Council</span>
                  <div className="w-12 h-[1px] bg-stone-200"></div>
                </div>
              </div>
            </section>

            {/* Location Teaser */}
            <section id="location" className="py-32 px-6 bg-white overflow-hidden">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                  <div className="order-2 lg:order-1 relative">
                    <div className="absolute inset-0 border-[20px] border-stone-50 -z-10 translate-x-12 translate-y-12"></div>
                    <div className="aspect-video bg-stone-200 grayscale hover:grayscale-0 transition-all duration-1000 shadow-3xl overflow-hidden relative">
                      <img 
                        src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1200" 
                        className="w-full h-full object-cover" 
                        alt="Katowice View" 
                      />
                      <a 
                        href="https://www.google.com/maps/place/Aleja+Korfantego+2,+Katowice" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors group"
                      >
                        <div className="bg-white px-6 py-4 flex items-center gap-3 shadow-2xl group-hover:scale-105 transition-transform">
                          <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                          <span className="text-[10px] uppercase tracking-widest font-bold text-stone-900">Open in Maps</span>
                        </div>
                      </a>
                    </div>
                  </div>
                  <div className="order-1 lg:order-2 space-y-12">
                    <div>
                      <span className="text-amber-600 uppercase text-[10px] tracking-[0.4em] font-bold mb-4 block">The Neighborhood</span>
                      <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-8 leading-tight">Where History <br/>Meets Tomorrow.</h2>
                      <p className="text-stone-500 font-light leading-loose text-lg">
                        Katowice's transformation is most visible in the "Culture Zone," situated mere steps from our front door. Visit the world-class NOSPR concert hall, explore the Silesian Museum's underground galleries, or marvel at the Spodek arena's futuristic curves.
                      </p>
                      <button onClick={() => setView('booking')} className="mt-8 bg-stone-900 text-white px-10 py-4 uppercase text-[10px] tracking-widest font-bold hover:bg-amber-600 transition-colors">
                        Begin Booking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {view === 'suites' && (
          <SuitesPage onSelectRoom={setSelectedRoom} />
        )}

        {view === 'reserve' && (
          <ReservePage onNavigate={setView} />
        )}

        {view === 'booking' && (
          <BookNowPage onNavigate={setView} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-50 py-32 px-6 border-t border-stone-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="text-stone-900 text-3xl font-serif tracking-widest cursor-pointer" onClick={() => setView('home')}>
              SILESIA <span className="font-light">GRAND</span>
            </div>
            <p className="max-w-xs text-stone-500 text-sm leading-loose font-light">
              Aleja Korfantego 2, 40-001 Katowice, Poland.<br/>
              A member of the Elite Heritage Collection.
            </p>
          </div>
          <div>
            <h5 className="text-stone-900 uppercase text-[10px] tracking-widest font-bold mb-8">Quick Links</h5>
            <ul className="space-y-4 text-xs uppercase tracking-widest text-stone-400">
              <li><button onClick={() => setView('home')} className="hover:text-amber-600">Home</button></li>
              <li><button onClick={() => setView('suites')} className="hover:text-amber-600">Suites Collection</button></li>
              <li><button onClick={() => setView('booking')} className="hover:text-amber-600">Book Now</button></li>
            </ul>
          </div>
        </div>
      </footer>

      <AIConcierge />

      {selectedRoom && (
        <RoomDetailsModal 
          room={selectedRoom} 
          userImages={userRoomImages[selectedRoom.id] || []}
          roomRatings={roomRatings[selectedRoom.id] || []}
          onAddRoomRating={(rating) => handleAddRoomRating(selectedRoom.id, rating)}
          onUpload={(data) => handleAddUserImage(selectedRoom.id, data)}
          onUpdate={(id, updates) => handleUpdateUserImage(selectedRoom.id, id, updates)}
          onRemove={(id) => handleRemoveUserImage(selectedRoom.id, id)}
          onClose={() => setSelectedRoom(null)} 
        />
      )}
    </div>
  );
};

export default App;
