
import React, { useState } from 'react';
import { ROOMS } from '../constants';

interface BookNowPageProps {
  onNavigate: (view: 'home' | 'suites' | 'reserve' | 'booking') => void;
}

const BookNowPage: React.FC<BookNowPageProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    roomId: ROOMS[0].id,
    addons: {
      spa: false,
      breakfast: false,
      transfer: false
    },
    dates: {
      checkIn: '',
      checkOut: ''
    },
    personal: {
      name: '',
      email: ''
    }
  });

  const selectedRoom = ROOMS.find(r => r.id === bookingData.roomId)!;
  
  const calculateTotal = () => {
    let base = selectedRoom.price;
    if (bookingData.addons.spa) base += 45;
    if (bookingData.addons.breakfast) base += 25;
    if (bookingData.addons.transfer) base += 60;
    return base;
  };

  const handleFinish = () => {
    const addonsText = [
      bookingData.addons.spa ? 'Deep Well Spa Access' : null,
      bookingData.addons.breakfast ? 'Silesian Hearth Breakfast' : null,
      bookingData.addons.transfer ? 'VIP Airport Transfer' : null,
    ].filter(Boolean).join(', ');

    const message = `URGENT BOOKING REQUEST: My name is ${bookingData.personal.name}. I'm booking the ${selectedRoom.name} from ${bookingData.dates.checkIn} to ${bookingData.dates.checkOut}. Enhancements: ${addonsText || 'None'}. Please confirm this itinerary.`;

    window.dispatchEvent(new CustomEvent('concierge-booking-request', { 
      detail: { message } 
    }));
  };

  return (
    <div className="bg-stone-950 min-h-screen pt-32 pb-32 text-white selection:bg-amber-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left: Interactive Wizard */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-4 mb-16 overflow-hidden">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-4 group cursor-default">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                  step === s ? 'bg-amber-600 border-amber-600 text-white scale-110' : 
                  step > s ? 'bg-white border-white text-stone-900' : 'border-stone-800 text-stone-500'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${
                  step === s ? 'text-white' : 'text-stone-600'
                }`}>
                  {s === 1 ? 'Suite' : s === 2 ? 'Experience' : 'Arrival'}
                </span>
                {s < 3 && <div className="w-12 h-[1px] bg-stone-800"></div>}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom duration-700">
              <h2 className="text-4xl font-serif mb-12">Select Your Sanctuary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {ROOMS.map(room => (
                  <div 
                    key={room.id}
                    onClick={() => setBookingData({...bookingData, roomId: room.id})}
                    className={`relative aspect-[4/5] overflow-hidden cursor-pointer group rounded-lg border-2 transition-all ${
                      bookingData.roomId === room.id ? 'border-amber-600 shadow-2xl scale-[1.02]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={room.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt={room.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>
                    <div className="absolute bottom-8 left-8 right-8">
                      <h3 className="text-xl font-serif mb-2">{room.name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest">From ${room.price}</span>
                        {bookingData.roomId === room.id && (
                          <span className="bg-amber-600 text-white text-[8px] uppercase font-bold px-2 py-1 rounded">Selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom duration-700 space-y-12">
              <h2 className="text-4xl font-serif">Enhance Your Experience</h2>
              <div className="space-y-6">
                <button 
                  onClick={() => setBookingData({...bookingData, addons: {...bookingData.addons, spa: !bookingData.addons.spa}})}
                  className={`w-full flex items-center justify-between p-8 border rounded-lg transition-all ${
                    bookingData.addons.spa ? 'bg-amber-600/10 border-amber-600 shadow-lg' : 'bg-stone-900/50 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex gap-6 items-center text-left">
                    <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center text-amber-500 italic font-serif text-xl">S</div>
                    <div>
                      <h4 className="font-bold uppercase text-[10px] tracking-widest mb-1">Deep Well Spa Access</h4>
                      <p className="text-xs text-stone-500">Subterranean salt-mine thermal pools and relaxation rituals.</p>
                    </div>
                  </div>
                  <span className="font-serif text-lg text-amber-500">+$45</span>
                </button>

                <button 
                  onClick={() => setBookingData({...bookingData, addons: {...bookingData.addons, breakfast: !bookingData.addons.breakfast}})}
                  className={`w-full flex items-center justify-between p-8 border rounded-lg transition-all ${
                    bookingData.addons.breakfast ? 'bg-amber-600/10 border-amber-600 shadow-lg' : 'bg-stone-900/50 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex gap-6 items-center text-left">
                    <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center text-amber-500 italic font-serif text-xl">B</div>
                    <div>
                      <h4 className="font-bold uppercase text-[10px] tracking-widest mb-1">Silesian Hearth Breakfast</h4>
                      <p className="text-xs text-stone-500">Daily artisanal buffet featuring "Black Gold" delicacies.</p>
                    </div>
                  </div>
                  <span className="font-serif text-lg text-amber-500">+$25</span>
                </button>

                <button 
                  onClick={() => setBookingData({...bookingData, addons: {...bookingData.addons, transfer: !bookingData.addons.transfer}})}
                  className={`w-full flex items-center justify-between p-8 border rounded-lg transition-all ${
                    bookingData.addons.transfer ? 'bg-amber-600/10 border-amber-600 shadow-lg' : 'bg-stone-900/50 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex gap-6 items-center text-left">
                    <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center text-amber-500 italic font-serif text-xl">T</div>
                    <div>
                      <h4 className="font-bold uppercase text-[10px] tracking-widest mb-1">VIP Airport Transfer</h4>
                      <p className="text-xs text-stone-500">Luxury car service from Katowice or Krakow Airport.</p>
                    </div>
                  </div>
                  <span className="font-serif text-lg text-amber-500">+$60</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom duration-700 space-y-12">
              <h2 className="text-4xl font-serif">Details of Arrival</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Check-In</label>
                  <input 
                    type="date" required
                    className="w-full bg-transparent border-b border-stone-800 py-4 focus:outline-none focus:border-amber-600 transition-all font-serif text-2xl"
                    value={bookingData.dates.checkIn}
                    onChange={e => setBookingData({...bookingData, dates: {...bookingData.dates, checkIn: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Check-Out</label>
                  <input 
                    type="date" required
                    className="w-full bg-transparent border-b border-stone-800 py-4 focus:outline-none focus:border-amber-600 transition-all font-serif text-2xl"
                    value={bookingData.dates.checkOut}
                    onChange={e => setBookingData({...bookingData, dates: {...bookingData.dates, checkOut: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Guest Name</label>
                  <input 
                    type="text" required placeholder="E.g. Antoni Korfanty"
                    className="w-full bg-transparent border-b border-stone-800 py-4 focus:outline-none focus:border-amber-600 transition-all font-serif text-2xl"
                    value={bookingData.personal.name}
                    onChange={e => setBookingData({...bookingData, personal: {...bookingData.personal, name: e.target.value}})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Email Address</label>
                  <input 
                    type="email" required placeholder="name@domain.com"
                    className="w-full bg-transparent border-b border-stone-800 py-4 focus:outline-none focus:border-amber-600 transition-all font-serif text-2xl"
                    value={bookingData.personal.email}
                    onChange={e => setBookingData({...bookingData, personal: {...bookingData.personal, email: e.target.value}})}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-16 flex justify-between border-t border-stone-900">
            {step > 1 ? (
              <button 
                onClick={() => setStep(step - 1)}
                className="text-[10px] uppercase tracking-widest font-bold text-stone-500 hover:text-white transition-colors"
              >
                ← Back
              </button>
            ) : <div />}
            
            {step < 3 ? (
              <button 
                onClick={() => setStep(step + 1)}
                className="bg-white text-stone-950 px-12 py-5 uppercase text-[10px] font-bold tracking-widest hover:bg-amber-600 hover:text-white transition-all shadow-xl active:scale-95"
              >
                Continue Path
              </button>
            ) : (
              <button 
                onClick={handleFinish}
                className="bg-amber-600 text-white px-12 py-5 uppercase text-[10px] font-bold tracking-widest hover:bg-amber-700 transition-all shadow-xl active:scale-95"
              >
                Finalize via Guide
              </button>
            )}
          </div>
        </div>

        {/* Right: Stay Summary Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-8">
          <div className="bg-stone-900/40 backdrop-blur-md border border-stone-800 p-8 rounded-lg space-y-8">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-500 border-b border-stone-800 pb-4">Itinerary Summary</h3>
            
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded bg-stone-800 overflow-hidden flex-shrink-0">
                <img src={selectedRoom.image} className="w-full h-full object-cover" alt="Suite Preview" />
              </div>
              <div>
                <span className="block text-[8px] uppercase tracking-widest text-amber-500 font-bold mb-1">Stay Category</span>
                <h4 className="font-serif text-lg leading-tight">{selectedRoom.name}</h4>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-stone-500">
                <span>Suite Rate</span>
                <span className="text-white">${selectedRoom.price}</span>
              </div>
              
              {bookingData.addons.spa && (
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-stone-500">
                  <span>Spa Access</span>
                  <span className="text-white">+$45</span>
                </div>
              )}
              {bookingData.addons.breakfast && (
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-stone-500">
                  <span>Hearth Breakfast</span>
                  <span className="text-white">+$25</span>
                </div>
              )}
              {bookingData.addons.transfer && (
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-stone-500">
                  <span>VIP Transfer</span>
                  <span className="text-white">+$60</span>
                </div>
              )}

              <div className="pt-6 border-t border-stone-800 flex justify-between items-baseline">
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-400">Total Est.</span>
                <span className="text-4xl font-serif text-amber-500">${calculateTotal()}</span>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded text-[9px] text-stone-500 leading-relaxed italic border border-white/5">
              "Your selection reflects the bold, modernist spirit of Katowice. Our AI Guide is standing by to confirm these exclusive arrangements."
            </div>
          </div>
          
          <button 
            onClick={() => onNavigate('home')}
            className="w-full text-center text-[10px] uppercase tracking-widest font-bold text-stone-600 hover:text-stone-400 transition-colors"
          >
            ← Discard and Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookNowPage;
