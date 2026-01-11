import React, { useState } from 'react';
import { GODDESSES } from '../constants.js';
import type { Goddess } from '../../../../types.js';
import OrbitalButton from './OrbitalButton.js';
import TeamCredits from './TeamCredits.js';

const HomePage: React.FC = () => {
  const [hoveredGoddess, setHoveredGoddess] = useState<Goddess | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const colorVariants = {
    sky: 'text-sky-700 dark:text-sky-400',
    indigo: 'text-indigo-700 dark:text-indigo-400',
    rose: 'text-rose-700 dark:text-rose-400',
    emerald: 'text-emerald-700 dark:text-emerald-400',
    purple: 'text-purple-700 dark:text-purple-400',
    lime: 'text-lime-700 dark:text-lime-400',
    amber: 'text-amber-700 dark:text-amber-400',
    yellow: 'text-yellow-700 dark:text-yellow-400',
    slate: 'text-slate-700 dark:text-slate-400',
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-spin-slow {
          animation: spin 60s linear infinite;
        }
        .orbit-container.paused {
          animation-play-state: paused;
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-in-out forwards;
        }
      `}</style>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] overflow-hidden">
        <div className="relative w-[28rem] h-[28rem] sm:w-[32rem] sm:h-[32rem] md:w-[40rem] md:h-[40rem] flex items-center justify-center">
          
          {/* Central Content Area */}
          <div className="text-center z-10 flex flex-col items-center justify-center px-4 w-80 h-80 transition-all duration-300">
            {hoveredGoddess ? (
              <div key={hoveredGoddess.id} className="animate-fadeIn flex flex-col items-center">
                <div className={`${colorVariants[hoveredGoddess.color as keyof typeof colorVariants]}`}>
                  {React.cloneElement(hoveredGoddess.icon, { className: 'w-20 h-20 mb-3' })}
                </div>
                <h2 className={`text-2xl font-serif font-bold ${colorVariants[hoveredGoddess.color as keyof typeof colorVariants]}`}>
                  {hoveredGoddess.name}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  {hoveredGoddess.description}
                </p>
              </div>
            ) : (
              <div className="animate-fadeIn flex flex-col items-center">
                <img 
                  src="/logo.png" 
                  alt="Pantheon of Productivity Logo" 
                  className="w-48 h-48 md:w-72 md:h-72 object-contain mb-4" 
                />
                {/* <h1 className="text-xl md:text-2xl font-serif font-bold text-slate-800 dark:text-slate-100">
                  Welcome to the <br /> Pantheon of Productivity
                </h1> */}
              </div>
            )}
          </div>

          {/* Orbiting Buttons */}
          <div className={`absolute top-0 left-0 w-full h-full orbit-container animate-spin-slow ${isHovering ? 'paused' : ''}`}>
            {GODDESSES.map((goddess, i) => {
              const angle = i * (360 / GODDESSES.length);
              return (
                <div
                  key={goddess.id}
                  className="absolute top-1/2 left-1/2 w-20 h-20 -m-10"
                  style={{
                    transform: `rotate(${angle}deg) translate(clamp(11rem, 25vw, 17.5rem)) rotate(-${angle}deg)`,
                  }}
                  onMouseEnter={() => { setHoveredGoddess(goddess); setIsHovering(true); }}
                  onMouseLeave={() => { setHoveredGoddess(null); setIsHovering(false); }}
                >
                  <OrbitalButton goddess={goddess} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
            {/* Credits / Team dropdown */}
      <div className="fixed bottom-4 right-4 z-50">
        <TeamCredits />
      </div>

    </>
  );
};

export default HomePage;