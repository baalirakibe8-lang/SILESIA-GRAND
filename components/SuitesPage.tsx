
import React, { useState } from 'react';
import { ROOMS } from '../constants';
import { Room } from '../types';

interface SuitesPageProps {
  onSelectRoom: (room: Room) => void;
}

const SuitesPage: React.FC<SuitesPageProps> = ({ onSelectRoom }) => {
  const [filter, setFilter] = useState<'all' | 'suite' | 'loft' | 'studio'>('all');

  const filteredRooms = ROOMS.filter(room => {
    if (filter === 'all') return true;
    return room.id.includes(filter);
  });

  return (
    <div className="bg-white min-h-screen pt-32 pb-32">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-24 text-center">
        <span className="text-amber-600 uppercase text-[10px] tracking-[0.4em] font-bold mb-6 block animate-in fade-in slide-in-from-bottom duration-700">The Silesian Collection</span>
        <h1 className="text-5xl md:text-7xl font-serif text-stone-900 mb-8 animate-in fade-in slide-in-from-bottom duration-700 delay-100">Extraordinary <br/><span className="italic font-light">LIVING</span></h1>
        <p className="max-w-2xl mx-auto text-stone-500 font-light leading-relaxed text-lg animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          Our suites are more than just rooms; they are carefully curated environments that celebrate the industrial heritage and modernist future of Katowice.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-[72px] z-40 bg-white/80 backdrop-blur-md border-y border-stone-100 mb-16">
        <div className="max-w-7xl mx-auto px-6 flex justify-center gap-12 py-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {(['all', 'suite', 'loft', 'studio'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-all relative pb-2 ${
                filter === cat ? 'text-amber-600' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              {cat}s
              {filter === cat && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-600 animate-in fade-in zoom-in duration-300"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 space-y-32">
        {filteredRooms.map((room, idx) => (
          <div 
            key={room.id} 
            className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center group`}
          >
            {/* Image side */}
            <div 
              className="w-full lg:w-3/5 relative overflow-hidden cursor-pointer aspect-[16/10]"
              onClick={() => onSelectRoom(room)}
            >
              <img 
                src={room.image} 
                alt={room.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors"></div>
              <div className="absolute bottom-8 left-8 z-10 text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-[10px] uppercase tracking-widest font-bold">View Interior Photography</span>
              </div>
            </div>

            {/* Content side */}
            <div className="w-full lg:w-2/5 space-y-8">
              <div>
                <div className="flex justify-between items-baseline mb-4">
                  <h3 className="text-3xl font-serif text-stone-900 group-hover:text-amber-600 transition-colors">{room.name}</h3>
                  <span className="text-amber-600 font-serif text-xl tracking-tighter">From ${room.price}</span>
                </div>
                <p className="text-stone-500 font-light leading-relaxed mb-6">
                  {room.fullDescription.split('.')[0]}. {room.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-8 border-t border-stone-100 pt-8">
                {room.features.slice(0, 4).map(feature => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onSelectRoom(room)}
                className="w-full bg-stone-900 text-white py-6 uppercase tracking-[0.4em] text-[10px] font-bold transition-all hover:bg-amber-600 shadow-xl hover:-translate-y-1 active:translate-y-0"
              >
                Inquire & Details
              </button>
            </div>
          </div>
        ))}
        
        {filteredRooms.length === 0 && (
          <div className="text-center py-40">
            <h3 className="text-2xl font-serif text-stone-400 italic">No suites match your criteria.</h3>
            <button onClick={() => setFilter('all')} className="mt-8 text-amber-600 text-[10px] font-bold uppercase tracking-widest border-b border-amber-600 pb-1">Reset Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuitesPage;
