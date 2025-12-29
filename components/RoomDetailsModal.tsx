
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Room, UserImage } from '../types.ts';
import { compressImage } from '../utils/imageUtils.ts';

interface RoomDetailsModalProps {
  room: Room;
  userImages: UserImage[];
  roomRatings: number[];
  onAddRoomRating: (rating: number) => void;
  onUpload: (imageData: string) => void;
  onUpdate: (id: string, updates: Partial<UserImage>) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

const MiniAvailabilityCalendar: React.FC<{ roomId: string }> = ({ roomId }) => {
  const now = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'long' });
  const year = now.getFullYear();
  
  // Deterministic "booked" dates based on roomId for demo purposes
  const bookedDates = useMemo(() => {
    const seed = roomId.length;
    return [5, 6, 12, 13, 14, 20, 21, 27, 28].map(d => (d + seed) % 28 || 1);
  }, [roomId]);

  const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, now.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] uppercase tracking-widest font-bold text-stone-900 border-b border-stone-100 pb-2 flex-1">
          Monthly Availability
        </h4>
        <span className="text-[10px] text-stone-400 font-medium ml-4 pb-2 border-b border-stone-100">
          {currentMonth} {year}
        </span>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-[8px] font-bold text-stone-300 py-1">{day}</div>
        ))}
        {blanks.map(i => <div key={`blank-${i}`} />)}
        {days.map(day => {
          const isBooked = bookedDates.includes(day);
          const isToday = day === now.getDate();
          return (
            <div 
              key={day} 
              className={`text-[9px] py-1.5 rounded-sm transition-colors relative flex items-center justify-center
                ${isBooked ? 'bg-stone-50 text-stone-300' : 'bg-stone-50 text-stone-700'}
                ${isToday ? 'ring-1 ring-amber-500 font-bold' : ''}
              `}
            >
              {day}
              {isBooked && (
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                  <div className="w-full h-[1px] bg-stone-400 rotate-45"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex gap-4 text-[8px] uppercase tracking-widest font-bold text-stone-400 pt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-stone-50 rounded-sm ring-1 ring-stone-100"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-stone-50 rounded-sm relative overflow-hidden">
             <div className="absolute inset-0 flex items-center justify-center opacity-30"><div className="w-full h-[1px] bg-stone-400 rotate-45"></div></div>
          </div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

const ModalSkeleton: React.FC = () => (
  <div className="flex flex-col lg:flex-row w-full animate-pulse">
    <div className="lg:w-7/12">
      <div className="h-[400px] md:h-[550px] bg-stone-200" />
      <div className="grid grid-cols-4 gap-1 p-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 md:h-40 bg-stone-200" />
        ))}
      </div>
    </div>
    <div className="lg:w-5/12 p-8 md:p-14 space-y-12">
      <div className="space-y-6">
        <div className="h-2 w-24 bg-stone-100 rounded" />
        <div className="h-10 w-3/4 bg-stone-200 rounded" />
        <div className="h-4 w-1/4 bg-stone-100 rounded" />
        <div className="space-y-3 pt-4">
          <div className="h-3 w-full bg-stone-100 rounded" />
          <div className="h-3 w-full bg-stone-100 rounded" />
          <div className="h-3 w-2/3 bg-stone-100 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="h-3 w-20 bg-stone-200 rounded" />
          {[1, 2, 3].map(i => <div key={i} className="h-2 w-full bg-stone-100 rounded" />)}
        </div>
        <div className="space-y-4">
          <div className="h-3 w-20 bg-stone-200 rounded" />
          {[1, 2, 3].map(i => <div key={i} className="h-2 w-full bg-stone-100 rounded" />)}
        </div>
      </div>
      <div className="pt-10 flex items-center justify-between border-t border-stone-100">
        <div className="space-y-2">
          <div className="h-2 w-16 bg-stone-100 rounded" />
          <div className="h-8 w-24 bg-stone-200 rounded" />
        </div>
        <div className="h-14 w-40 bg-stone-900 rounded" />
      </div>
    </div>
  </div>
);

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ 
  room, 
  userImages, 
  roomRatings,
  onAddRoomRating,
  onUpload, 
  onUpdate,
  onRemove, 
  onClose 
}) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [isLightboxImageLoading, setIsLightboxImageLoading] = useState(false);
  const [userPendingRating, setUserPendingRating] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [room.id]);
  
  const officialGalleryCount = room.gallery.length + 1;
  const allImages = useMemo(() => [
    room.image, 
    ...room.gallery, 
    ...userImages.map(img => img.url)
  ], [room.image, room.gallery, userImages]);

  const averageRoomRating = useMemo(() => {
    if (roomRatings.length === 0) return 4.8;
    const sum = roomRatings.reduce((a, b) => a + b, 0);
    return (sum / roomRatings.length).toFixed(1);
  }, [roomRatings]);

  const topUserImageId = useMemo(() => {
    if (userImages.length === 0) return null;
    return [...userImages].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return b.rating - a.rating;
    })[0].id;
  }, [userImages]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsLightboxImageLoading(true);
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + allImages.length) % allImages.length : null));
  }, [allImages.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsLightboxImageLoading(true);
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % allImages.length : null));
  }, [allImages.length]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    setIsUploading(true);
    setUploadProgress({ current: 0, total: fileList.length });

    try {
      for (let i = 0; i < fileList.length; i++) {
        const result = await compressImage(fileList[i]);
        onUpload(result);
        setUploadProgress(prev => ({ ...prev, current: i + 1 }));
      }
    } catch (error) {
      console.error("Compression failed:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        fileInputRef.current?.click();
        return;
      }
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) closeLightbox();
        else onClose();
        return;
      }
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowLeft') handlePrev();
        else if (e.key === 'ArrowRight') handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handlePrev, handleNext, closeLightbox, onClose]);

  const progressPercentage = uploadProgress.total > 0 
    ? (uploadProgress.current / uploadProgress.total) * 100 
    : 0;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-300 rounded-lg">
        {/* Global Enhanced Progress Indicator */}
        {isUploading && (
          <div className="absolute top-0 left-0 right-0 z-[100] h-1.5 bg-stone-100 overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[8px] px-3 py-1 rounded-full uppercase tracking-widest font-bold shadow-lg animate-bounce">
              Processing {uploadProgress.current} of {uploadProgress.total} Memories
            </div>
          </div>
        )}

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 bg-white/80 hover:bg-white p-2 rounded-full text-stone-900 transition-colors shadow-sm"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isInitialLoading ? (
          <ModalSkeleton />
        ) : (
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-7/12">
              <div 
                className="h-[400px] md:h-[550px] cursor-zoom-in relative group overflow-hidden bg-stone-100"
                onClick={() => { setIsLightboxImageLoading(true); setLightboxIndex(0); }}
              >
                <img 
                  src={room.image} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  alt={room.name}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-1 p-1">
                {room.gallery.map((img, idx) => (
                  <div 
                    key={`official-${idx}`} 
                    className="h-32 md:h-40 overflow-hidden cursor-zoom-in relative group bg-stone-100"
                    onClick={() => { setIsLightboxImageLoading(true); setLightboxIndex(idx + 1); }}
                  >
                    <img src={img} className="w-full h-full object-cover transition-all group-hover:scale-110" alt="Gallery" />
                  </div>
                ))}

                {userImages.map((img, idx) => {
                  const isTopMemory = img.id === topUserImageId;
                  return (
                    <div 
                      key={img.id} 
                      className={`h-32 md:h-40 overflow-hidden cursor-zoom-in relative group bg-stone-100 border-2 transition-all ${img.isFavorite ? 'border-amber-400' : 'border-transparent'}`}
                      onClick={() => { setIsLightboxImageLoading(true); setLightboxIndex(officialGalleryCount + idx); }}
                    >
                      <img src={img.url} className="w-full h-full object-cover transition-all group-hover:scale-110" alt="Guest Memory" />
                      
                      {isTopMemory && (
                        <div className="absolute top-0 left-0 bg-amber-500 text-white text-[7px] uppercase tracking-widest px-2 py-1 z-10 font-bold shadow-md">
                          Top Memory
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-between items-center">
                          <button 
                            onClick={(e) => { e.stopPropagation(); onUpdate(img.id, { isFavorite: !img.isFavorite }); }}
                            className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${img.isFavorite ? 'bg-amber-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
                          >
                            <svg className="w-3 h-3" fill={img.isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onRemove(img.id); }}
                            className="p-1.5 rounded-full bg-red-500/80 text-white hover:bg-red-600 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="flex gap-0.5 justify-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={(e) => { e.stopPropagation(); onUpdate(img.id, { rating: star }); }}
                              className={`transition-transform hover:scale-125 ${star <= img.rating ? 'text-amber-400' : 'text-white/40'}`}
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div 
                  className={`h-32 md:h-40 flex flex-col items-center justify-center border-2 border-dashed border-stone-200 bg-stone-50 hover:bg-stone-100 hover:border-amber-400 transition-all cursor-pointer group relative overflow-hidden ${isUploading ? 'bg-stone-100 pointer-events-none' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload Memory (Ctrl+U)"
                >
                  {isUploading ? (
                    <div className="text-center px-4 animate-in fade-in duration-300">
                      <div className="flex justify-center mb-2">
                        <svg className="w-5 h-5 text-amber-500 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <span className="text-[9px] uppercase tracking-widest text-amber-600 font-bold block">
                        {Math.round(progressPercentage)}%
                      </span>
                      <span className="text-[8px] uppercase tracking-tighter text-stone-400">Processing...</span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-6 h-6 text-stone-300 group-hover:text-amber-500 mb-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">Add Memory</span>
                      <span className="text-[7px] text-stone-300 uppercase absolute bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">Ctrl + U</span>
                    </>
                  )}
                  <input type="file" hidden ref={fileInputRef} accept="image/*" multiple onChange={handleFileUpload} />
                </div>
              </div>
            </div>

            <div className="lg:w-5/12 p-8 md:p-14 flex flex-col justify-between h-full">
              <div className="space-y-8">
                <div>
                  <span className="text-amber-600 uppercase text-[10px] tracking-[0.4em] font-bold mb-4 block">Suite Exclusive</span>
                  <div className="flex items-center gap-4 mb-2">
                    <h2 className="text-4xl font-serif text-stone-800 leading-tight">{room.name}</h2>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded">
                      <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <span className="text-sm font-bold text-amber-700">{averageRoomRating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-stone-400">Rate this room:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onMouseEnter={() => setUserPendingRating(star)}
                          onMouseLeave={() => setUserPendingRating(0)}
                          onClick={() => onAddRoomRating(star)}
                          className={`transition-all hover:scale-125 ${star <= (userPendingRating || 0) ? 'text-amber-500' : 'text-stone-200'}`}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        </button>
                      ))}
                    </div>
                    {roomRatings.length > 0 && (
                      <span className="text-[9px] text-stone-400 font-medium">({roomRatings.length} reviews)</span>
                    )}
                  </div>

                  <p className="text-stone-500 font-light leading-relaxed text-sm mb-8">{room.fullDescription}</p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-stone-900 border-b border-stone-100 pb-2">Features</h4>
                    <ul className="space-y-2">
                      {room.features.map(f => (
                        <li key={f} className="text-[10px] text-stone-500 font-light flex items-center gap-2">
                          <span className="w-1 h-1 bg-amber-400 rounded-full"></span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-stone-900 border-b border-stone-100 pb-2">Amenities</h4>
                    <ul className="space-y-2">
                      {room.amenities.map(a => (
                        <li key={a} className="text-[10px] text-stone-500 font-light flex items-center gap-2">
                          <span className="w-1 h-1 bg-stone-300 rounded-full"></span> {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <MiniAvailabilityCalendar roomId={room.id} />
              </div>

              <div className="border-t border-stone-100 pt-8 mt-8 flex items-center justify-between">
                <div>
                  <span className="text-stone-400 text-[10px] uppercase tracking-widest block mb-1">Nightly Rate</span>
                  <span className="text-4xl font-serif text-stone-900">${room.price}</span>
                </div>
                <button className="bg-stone-900 hover:bg-amber-600 text-white px-10 py-5 uppercase tracking-[0.3em] text-[10px] font-bold transition-all shadow-xl active:scale-95">
                  Book Suite
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[80] bg-stone-950/98 flex flex-col items-center justify-center p-4 animate-in fade-in duration-300" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-8 right-8 text-white/50 hover:text-white transition-all z-[90] p-2 hover:bg-white/10 rounded-full">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="relative max-w-7xl w-full h-full flex items-center justify-center pointer-events-none">
            {isLightboxImageLoading && <div className="absolute w-12 h-12 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>}
            <img 
              src={allImages[lightboxIndex]} 
              className={`max-h-full max-w-full object-contain shadow-2xl transition-all duration-300 pointer-events-auto ${isLightboxImageLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
              onLoad={() => setIsLightboxImageLoading(false)}
              onClick={(e) => e.stopPropagation()}
              alt="Expanded view"
            />
          </div>

          <div className="absolute bottom-12 flex flex-col items-center gap-6">
            <div className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">
              Image {lightboxIndex + 1} of {allImages.length}
            </div>
            <div className="flex gap-4">
              <button onClick={handlePrev} className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all active:scale-90">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={handleNext} className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all active:scale-90">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetailsModal;
