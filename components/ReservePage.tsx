
import React, { useState } from 'react';
import { ROOMS } from '../constants.tsx';

interface ReservePageProps {
  onNavigate: (view: 'home' | 'suites' | 'reserve') => void;
}

const ReservePage: React.FC<ReservePageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
    roomId: ROOMS[0].id,
    name: '',
    email: '',
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const selectedRoom = ROOMS.find(r => r.id === formData.roomId)?.name || 'a suite';
    const message = `Hello, I'm ${formData.name}. I'd like to book the ${selectedRoom} for ${formData.guests} people, arriving on ${formData.checkIn} and departing on ${formData.checkOut}. My email is ${formData.email}. Special requests: ${formData.specialRequests || 'None'}.`;

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('concierge-booking-request', { 
        detail: { message } 
      }));
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="bg-stone-50 min-h-screen pt-32 pb-32">
      <div className="max-w-5xl mx-auto px-6">
        <header className="text-center mb-16">
          <span className="text-amber-600 uppercase text-[10px] tracking-[0.4em] font-bold mb-4 block">Reservation</span>
          <h1 className="text-4xl md:text-6xl font-serif text-stone-900 mb-6">Secure Your Experience</h1>
          <p className="text-stone-500 font-light max-w-xl mx-auto">
            Please provide your preferred dates and guest details. Our Grand Silesian Guide will finalize your inquiry instantly.
          </p>
        </header>

        <div className="bg-white shadow-3xl overflow-hidden rounded-lg flex flex-col lg:flex-row border border-stone-100">
          <div className="lg:w-7/12 p-8 md:p-16 border-b lg:border-b-0 lg:border-r border-stone-100">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Check-in</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full border-b border-stone-200 py-3 focus:outline-none focus:border-amber-600 transition-colors bg-transparent font-serif text-lg"
                    value={formData.checkIn}
                    onChange={e => setFormData({...formData, checkIn: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Check-out</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full border-b border-stone-200 py-3 focus:outline-none focus:border-amber-500 transition-colors bg-transparent font-serif text-lg"
                    value={formData.checkOut}
                    onChange={e => setFormData({...formData, checkOut: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Select Your Suite</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {ROOMS.map(room => (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setFormData({...formData, roomId: room.id})}
                      className={`relative group h-40 overflow-hidden rounded-md transition-all ${
                        formData.roomId === room.id ? 'ring-2 ring-amber-500 shadow-xl' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={room.image} alt={room.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className={`absolute inset-0 bg-stone-900/40 flex items-end p-3 transition-opacity ${
                        formData.roomId === room.id ? 'opacity-0' : 'opacity-100'
                      }`}>
                        <span className="text-[8px] uppercase tracking-widest font-bold text-white">{room.name}</span>
                      </div>
                      {formData.roomId === room.id && (
                        <div className="absolute top-2 right-2 bg-amber-500 text-white rounded-full p-1 shadow-md">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    required
                    className="w-full border-b border-stone-200 py-3 focus:outline-none focus:border-amber-500 transition-colors bg-transparent font-serif text-lg"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    required
                    className="w-full border-b border-stone-200 py-3 focus:outline-none focus:border-amber-500 transition-colors bg-transparent font-serif text-lg"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Special Requests (Optional)</label>
                <textarea 
                  rows={2}
                  placeholder="Tell us about special occasions or dietary needs..."
                  className="w-full border-b border-stone-200 py-3 focus:outline-none focus:border-amber-500 transition-colors bg-transparent font-serif text-lg resize-none"
                  value={formData.specialRequests}
                  onChange={e => setFormData({...formData, specialRequests: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-stone-900 text-white py-6 uppercase tracking-[0.4em] text-[10px] font-bold transition-all hover:bg-amber-600 shadow-xl relative overflow-hidden group"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                    Processing
                  </span>
                ) : (
                  'Request via AI Concierge'
                )}
              </button>
            </form>
          </div>

          <div className="lg:w-5/12 bg-stone-50 p-8 md:p-16 flex flex-col justify-between">
            <div className="space-y-12">
              <div className="pb-8 border-b border-stone-200">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-6">Selection Summary</h3>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
                    <img src={ROOMS.find(r => r.id === formData.roomId)?.image} className="w-full h-full object-cover" alt="Suite" />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif text-stone-900 leading-tight mb-1">
                      {ROOMS.find(r => r.id === formData.roomId)?.name}
                    </h4>
                    <span className="text-amber-600 text-[10px] font-bold uppercase tracking-widest">
                      ${ROOMS.find(r => r.id === formData.roomId)?.price} / Night
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-stone-400 uppercase tracking-widest font-bold">Base Total</span>
                   <span className="text-stone-900 font-serif text-lg">$---</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-stone-400 uppercase tracking-widest font-bold">Taxes & Fees</span>
                   <span className="text-stone-900 font-serif text-lg">Included</span>
                 </div>
                 <div className="pt-6 border-t border-stone-200 flex justify-between items-center">
                    <span className="text-stone-900 uppercase tracking-widest font-black text-sm">Estimated Total</span>
                    <span className="text-3xl font-serif text-amber-600 italic">Consult Guide</span>
                 </div>
              </div>

              <div className="bg-white p-6 rounded-md border border-stone-100 shadow-sm space-y-4">
                 <h5 className="text-[8px] uppercase tracking-[0.3em] font-bold text-stone-400">Included Benefits</h5>
                 <ul className="space-y-3">
                   {ROOMS.find(r => r.id === formData.roomId)?.amenities.slice(0, 3).map(a => (
                     <li key={a} className="flex items-center gap-3 text-[10px] font-medium text-stone-600 uppercase tracking-widest">
                       <svg className="w-3 h-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                       {a}
                     </li>
                   ))}
                 </ul>
              </div>
            </div>

            <div className="mt-12 text-[9px] uppercase tracking-widest text-stone-400 text-center leading-relaxed">
              * This is a reservation inquiry. Our AI Concierge or Front Desk will confirm availability within minutes.
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
           <button onClick={() => onNavigate('home')} className="text-stone-400 hover:text-stone-900 text-[10px] uppercase tracking-widest font-bold transition-colors">
             ← Return to Experience
           </button>
        </div>
      </div>
    </div>
  );
};

export default ReservePage;
