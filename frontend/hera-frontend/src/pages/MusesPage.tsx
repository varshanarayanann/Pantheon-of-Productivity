import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Track {
  id: number;
  muse: string;
  title: string;
  artist: string;
  url: string;
}

// A mapping of each Muse to a pastel color with dark mode variants
const museColors: { [key: string]: string } = {
  Calliope: 'bg-rose-50 border-rose-400 text-rose-900 dark:bg-rose-900/50 dark:border-rose-700 dark:text-rose-200',
  Clio: 'bg-blue-50 border-blue-400 text-blue-900 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-200',
  Erato: 'bg-indigo-50 border-indigo-400 text-indigo-900 dark:bg-indigo-900/50 dark:border-indigo-700 dark:text-indigo-200',
  Euterpe: 'bg-green-50 border-green-400 text-green-900 dark:bg-green-900/50 dark:border-green-700 dark:text-green-200',
  Melpomene: 'bg-purple-50 border-purple-400 text-purple-900 dark:bg-purple-900/50 dark:border-purple-700 dark:text-purple-200',
  Polyhymnia: 'bg-yellow-50 border-yellow-400 text-yellow-900 dark:bg-yellow-900/50 dark:border-yellow-700 dark:text-yellow-200',
  Terpsichore: 'bg-pink-50 border-pink-400 text-pink-900 dark:bg-pink-900/50 dark:border-pink-700 dark:text-pink-200',
  Thalia: 'bg-teal-50 border-teal-400 text-teal-900 dark:bg-teal-900/50 dark:border-teal-700 dark:text-teal-200',
  Urania: 'bg-cyan-50 border-cyan-400 text-cyan-900 dark:bg-cyan-900/50 dark:border-cyan-700 dark:text-cyan-200',
};

const MusesPage: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackUrl, setCurrentTrackUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
      const fetchMusic = async () => {
          try {
              const response = await axios.get<Track[]>(
  `${process.env.NEXT_PUBLIC_PANTHEON_BACKEND_URL}/api/music`
);
setTracks(response.data);

          } catch (error) {
              console.error('Error fetching music data:', error);
          }
      };
      fetchMusic();
  }, []);

  const playTrack = (url: string) => {
      if (audioRef.current) {
          if (audioRef.current.src !== url) {
              audioRef.current.src = url;
          }
          audioRef.current.play();
          setIsPlaying(true);
          setCurrentTrackUrl(url);
      }
  };

  const pauseTrack = () => {
      if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
      }
  };

  return (
    <div className="relative bg-white dark:bg-slate-900 min-h-screen p-8 font-serif text-gray-800 dark:text-gray-200 overflow-hidden">
      {/* Background graphics for visual enhancement */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-[0.03] pointer-events-none">
        <div className="w-full h-full bg-contain bg-center" style={{ backgroundImage: "url('greek-pattern.svg')" }}></div>
      </div>
      
      <div className="relative max-w-xl mx-auto z-10 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-lg border p-8" style={{borderColor: '#D4AF37'}}>
        <h1 className="text-4xl font-extrabold text-center mb-2" style={{color: '#D4AF37'}}>The Nine Muses 🏛️</h1>
        <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-8">A collection of calm and focusing music to inspire your productivity, whispered from the divine.</p>
        
        {tracks.length > 0 ? (
          <ul className="space-y-4">
            {tracks.map(track => {
              const baseClasses = "flex items-center justify-between p-4 rounded-lg border transition-all duration-300";
              const trackColorClass = museColors[track.muse] || 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600';
              const isCurrentTrack = currentTrackUrl === track.url;
              const activeClasses = isCurrentTrack ? `ring-2 ring-offset-2 dark:ring-offset-slate-900` : `hover:shadow-md`;
              const goldRing = isCurrentTrack ? `ring-[#D4AF37]` : '';

              return (
                <li key={track.id} className={`${baseClasses} ${trackColorClass} ${activeClasses} ${goldRing}`}>
                  <div>
                    <h3 className="text-lg font-semibold dark:text-inherit" style={{color: '#8B6508'}}>{track.muse}</h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{track.title}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      if (isCurrentTrack && isPlaying) {
                        pauseTrack();
                      } else {
                        playTrack(track.url);
                      }
                    }}
                    className="p-3 rounded-full text-white transition-colors duration-300 shadow-lg"
                    style={{ backgroundColor: isCurrentTrack && isPlaying ? '#dc2626' : '#D4AF37' }}
                  >
                    {isCurrentTrack && isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-12">
            <svg className="animate-spin h-8 w-8 mx-auto mb-4" style={{color: '#D4AF37'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p className="text-gray-500 dark:text-gray-400">The Muses are gathering their inspiration...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusesPage;