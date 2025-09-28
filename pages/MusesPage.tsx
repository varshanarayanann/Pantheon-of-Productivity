import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMusicPlayer } from '../context/MPContext';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
}

const MusesPage: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const { playerState, playTrack, pauseTrack } = useMusicPlayer();

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/music');
        setTracks(response.data);
      } catch (error) {
        console.error('Error fetching music data:', error);
      }
    };
    fetchMusic();
  }, []);

  return (
    <div className="bg-stone-50 min-h-screen p-8 font-serif text-slate-800">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-stone-200 p-8">
        <h1 className="text-5xl font-bold text-center text-amber-700 mb-2">The Muses 🎼</h1>
        <p className="text-center text-lg text-slate-600 mb-8">A collection of calm and focusing music to inspire your productivity, whispered from the divine.</p>
        
        {tracks.length > 0 ? (
          <div className="space-y-4">
            {tracks.map(track => (
              <div
                key={track.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${playerState.currentTrackUrl === track.url ? 'bg-amber-50 border-amber-300 shadow-md' : 'bg-white hover:bg-stone-100 border-stone-200'}`}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold truncate text-amber-900">{track.title}</h3>
                  <p className="text-sm text-slate-500 truncate">{track.artist}</p>
                </div>
                <button
                  onClick={() => {
                    if (playerState.currentTrackUrl === track.url && playerState.isPlaying) {
                      pauseTrack();
                    } else {
                      playTrack(track.url);
                    }
                  }}
                  className="ml-4 p-3 rounded-full text-white transition-colors duration-300 transform hover:scale-105 shadow-lg"
                  style={{ backgroundColor: playerState.isPlaying && playerState.currentTrackUrl === track.url ? '#dc2626' : '#92400e' }} // Amber and red
                >
                  {playerState.isPlaying && playerState.currentTrackUrl === track.url ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="animate-spin h-10 w-10 text-amber-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p className="text-slate-500">The Muses are gathering their inspiration...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusesPage;