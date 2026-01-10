import React, { useState, useEffect, useCallback, useMemo } from 'react';
import GoddessPageLayout from '../components/GoddessPageLayout';
import { GODDESSES } from '../../../constants';


// --- 1. SVG ICONS ---
interface SvgProps {
    className: string;
}

const SvgZap = ({ className }: SvgProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);
const SvgPeace = ({ className }: SvgProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="2" x2="12" y2="22"></line><line x1="22" y1="12" x2="2" y2="12"></line><line x1="8" y1="17" x2="16" y2="7"></line></svg>
);
const SvgTimer = ({ className }: SvgProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2h4"></path><path d="M12 14v-4"></path><path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0 -20z"></path></svg>
);
const SvgPlay = ({ className }: SvgProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
);
const SvgPause = ({ className }: SvgProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
);
const SvgReset = ({ className }: SvgProps) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-7l3-3"></path><path d="M4 17h7l-3 3"></path><path d="M19 11a7 7 0 0 0-14 0"></path><path d="M5 13a7 7 0 0 0 14 0"></path></svg>
);


// --- 2. TYPE DEFINITIONS & CONSTANTS ---
type TimerMode = 'Work' | 'ShortBreak' | 'LongBreak';

interface TimeConfig {
  work: number; // in minutes
  shortBreak: number; // in minutes
  longBreak: number; // in minutes
  cyclesUntilLongBreak: number;
}

interface Visuals {
  icon: React.FC<{ className: string }>;
  title: string;
  startColor: string; // Hex color for interpolation
  endColor: string;   // Hex color for interpolation
  sceneryClass: string; // CSS class for layered animated scenery
  colorPalette: string[]; // Sequence of colors for multi-point transition
}

const CONFIGS: { [key: string]: TimeConfig } = {
  '25/5': {
    work: .5,
    shortBreak: .5,
    longBreak: .5,
    cyclesUntilLongBreak: 4,
  },
  '50/10': {
    work: 50,
    shortBreak: 10,
    longBreak: 30,
    cyclesUntilLongBreak: 4,
  },
};

// --- 3. HELPER FUNCTIONS ---

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const getInitialTime = (mode: TimerMode, config: TimeConfig): number => {
    switch (mode) {
        case 'Work':
            return config.work * 60;
        case 'ShortBreak':
            return config.shortBreak * 60;
        case 'LongBreak':
            return config.longBreak * 60;
        default:
            return config.work * 60;
    }
}

const hexToRgb = (hex: string): [number, number, number] => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
};

const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const r = Math.round(rgb1[0] + factor * (rgb2[0] - rgb1[0]));
  const g = Math.round(rgb1[1] + factor * (rgb2[1] - rgb1[1]));
  const b = Math.round(rgb1[2] + factor * (rgb2[2] - rgb1[2]));

  return `rgb(${r}, ${g}, ${b})`;
};

const getModeVisuals = (mode: TimerMode): Visuals => {
    switch (mode) {
        case 'Work':
            return {
                icon: SvgZap,
                title: 'Focus',
                sceneryClass: 'winter-scenery',
                startColor: '#1A237E',
                endColor: '#913d2aff',
                colorPalette: ['#1A237E', '#311B92', '#9b3d20ff', '#9E1C38', '#2E7D32'],
            };
        case 'ShortBreak':
            return {
                icon: SvgPeace,
                title: 'Break',
                sceneryClass: 'spring-scenery',
                startColor: '#9dddfaff', // Changed from B3E5FC
                endColor: '#a6d5a7ff',   // Changed from C8E6C9
                colorPalette: ['#9dddfaff', '#a6d5a7ff', '#f0a5bfff', '#f1a7afff', '#a2aae2ff'],
            };
        case 'LongBreak':
            return {
                icon: SvgPeace,
                title: 'Long Break',
                sceneryClass: 'summer-scenery',
                startColor: '#94da96ff', // Changed from F48FB1
                endColor: '#f487abff',   // Changed from A5D6A7
                colorPalette: ['#94da96ff', '#edd897ff','#fda852ff','#f487abff', '#a9b2ebff'],
            };
        default:
            return getModeVisuals('Work');
    }
};

// --- 4. MAIN COMPONENT ---
const PersephonePage: React.FC = () => {
    const persephone = GODDESSES.find(g => g.id === 'persephone')!;

    const [currentConfigKey, setCurrentConfigKey] = useState<'25/5' | '50/10'>('25/5');
    const currentConfig = useMemo(() => CONFIGS[currentConfigKey], [currentConfigKey]);
    const [mode, setMode] = useState<TimerMode>('Work');
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [cycleCount, setCycleCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number>(getInitialTime('Work', currentConfig));
    const totalTime = useMemo(() => getInitialTime(mode, currentConfig), [mode, currentConfig]);

    const [currentBgColor, setCurrentBgColor] = useState<string>('#1A237E');
    const [ambientTick, setAmbientTick] = useState(0);

    const visuals = getModeVisuals(mode);
    const textColorClass = useMemo(() => (mode === 'Work' ? 'text-white' : 'text-slate-800'), [mode]);

    const handleTimeEnd = useCallback(() => {
        setIsTimerActive(false);
        playNotificationSound();

        let nextMode: TimerMode;
        let nextCycleCount = cycleCount;

        if (mode === 'Work') {
            nextCycleCount += 1;
            if (nextCycleCount % currentConfig.cyclesUntilLongBreak === 0) {
                nextMode = 'LongBreak';
            } else {
                nextMode = 'ShortBreak';
            }
        } else {
            nextMode = 'Work';
            if (mode === 'LongBreak') {
                nextCycleCount = 0;
            }
        }

        setMode(nextMode);
        setCycleCount(nextCycleCount);
        setTimeLeft(getInitialTime(nextMode, currentConfig));
        
    }, [mode, cycleCount, currentConfig]);

    useEffect(() => {
        let interval: number | undefined;

        if (isTimerActive && timeLeft > 0) {
            interval = window.setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0 && isTimerActive) {
            handleTimeEnd();
        }

        return () => {
            if (interval !== undefined) {
                window.clearInterval(interval);
            }
        };
    }, [isTimerActive, timeLeft, handleTimeEnd]);

    useEffect(() => {
        let timer = window.setInterval(() => {
            setAmbientTick(prevTick => prevTick + 1);
        }, 1000);
        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        const colors = visuals.colorPalette;
        if (colors.length < 2) return;

        const transitionDuration = 10;
        const cycleLength = colors.length;
        const totalDuration = cycleLength * transitionDuration;
        const tickInCycle = ambientTick % totalDuration;
        
        const colorIndex = Math.floor(tickInCycle / transitionDuration) % cycleLength;
        const nextColorIndex = (colorIndex + 1) % cycleLength;
        
        const startColor = colors[colorIndex];
        const endColor = colors[nextColorIndex];

        const factor = (tickInCycle % transitionDuration) / transitionDuration;

        setCurrentBgColor(interpolateColor(startColor, endColor, factor));
    }, [ambientTick, visuals.colorPalette]);

    const playNotificationSound = () => {
        try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, context.currentTime); 
            gainNode.gain.setValueAtTime(0, context.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.01);
            oscillator.frequency.exponentialRampToValueAtTime(880, context.currentTime + 0.2); 
            gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);

            oscillator.connect(gainNode);
            gainNode.connect(context.destination);
            oscillator.start();
            oscillator.stop(context.currentTime + 0.5);

        } catch (e) {
          console.error("Audio Context error:", e);
        }
    };

    const handleReset = (newConfigKey?: '25/5' | '50/10') => {
        const configKey = newConfigKey || currentConfigKey;
        const config = CONFIGS[configKey];
        setIsTimerActive(false);
        setMode('Work');
        setCycleCount(0);
        setCurrentConfigKey(configKey);
        setTimeLeft(getInitialTime('Work', config));
    };

    const TimerIcon = visuals.icon;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalMessage = `${mode === 'Work' ? 'Focus Time' : 'Break'} Complete! Click 'Play' to start the next phase.`;

    useEffect(() => {
        if (timeLeft === 0 && !isTimerActive) {
            setIsModalOpen(true);
        }
    }, [timeLeft, isTimerActive]);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <GoddessPageLayout goddess={persephone}>
            {/* FIX: Removed non-standard `jsx` and `global` props from style tag. */}
            <style>{`
                .shadow-inner-gold {
                    box-shadow: none;
                }
                .animated-background {
                    background-size: 400% 400%;
                    animation: gradientShift 20s ease infinite;
                }
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                .winter-scenery::before, .spring-scenery::before, .summer-scenery::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    animation: none;
                    opacity: 0;
                }
            `}</style>

            {/* Adjusted spacing and height */}
            <div 
                className={`relative w-full max-w-2xl mx-auto py-10 px-8 rounded-3xl shadow-2xl transition-all duration-1000 ease-in-out overflow-hidden`}
                style={{
                    minHeight: '400px',
                    backgroundColor: currentBgColor,
                    backgroundImage: `linear-gradient(135deg, ${currentBgColor} 0%, ${interpolateColor(currentBgColor, visuals.colorPalette[(visuals.colorPalette.indexOf(visuals.colorPalette.find(c => c === currentBgColor) || visuals.colorPalette[0]) + 1) % visuals.colorPalette.length], 0.1)} 100%)`,
                    border: '4px solid #D4AF37', 
                    boxShadow: '0 0 0 4px #D4AF37'
                }}
            >
                <div className={`absolute inset-0 ${visuals.sceneryClass} animated-background`} />
                <div className={`relative z-10 flex flex-col items-center justify-center h-full ${textColorClass}`}>
                    
                    <div className="text-lg font-serif font-semibold opacity-100 mb-2">
                        Cycle {cycleCount} / {currentConfig.cyclesUntilLongBreak}
                    </div>

                    <h2 className="text-3xl font-serif font-extrabold mb-6 flex items-center">
                        <TimerIcon className="w-6 h-6 mr-2" />
                        {visuals.title}
                    </h2>

                    <div className="text-8xl font-serif font-black tabular-nums tracking-tighter drop-shadow-lg mb-8">
                        {formatTime(timeLeft)}
                    </div>

                    <div className="flex space-x-6">
                        <button
                            onClick={() => setIsTimerActive(!isTimerActive)}
                            className={`p-4 rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 text-white ${isTimerActive ? 'bg-[#D4AF37] hover:bg-[#C2A133]' : 'bg-[#D4AF37] hover:bg-[#C2A133]'}`}
                            aria-label={isTimerActive ? 'Pause Timer' : 'Start Timer'}
                        >
                            {isTimerActive ? <SvgPause className="w-6 h-6" /> : <SvgPlay className="w-6 h-6" />}
                        </button>
                        <button
                            onClick={() => handleReset()}
                            className="p-4 rounded-full bg-[#D4AF37] text-white shadow-lg transition-transform transform hover:scale-105 active:scale-95"
                            aria-label="Reset Timer"
                        >
                            <SvgReset className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex space-x-4">
                <button
                    onClick={() => handleReset('25/5')}
                    className={`px-4 py-2 rounded-full font-serif font-semibold transition-colors ${
                        currentConfigKey === '25/5' 
                            ? 'bg-[#D4AF37] text-white shadow-md' 
                            : 'bg-white text-black hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
                    }`}
                >
                    <SvgTimer className={`w-5 h-5 inline mr-2 ${currentConfigKey === '25/5' ? 'text-white' : 'text-black dark:text-slate-200'}`} /> 25/5
                </button>
                <button
                    onClick={() => handleReset('50/10')}
                    className={`px-4 py-2 rounded-full font-serif font-semibold transition-colors ${
                        currentConfigKey === '50/10' 
                            ? 'bg-[#D4AF37] text-white shadow-md' 
                            : 'bg-white text-black hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
                    }`}
                >
                    <SvgTimer className={`w-5 h-5 inline mr-2 ${currentConfigKey === '50/10' ? 'text-white' : 'text-black dark:text-slate-200'}`} /> 50/10
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 max-w-sm w-full text-center shadow-2xl">
                        <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-4">Phase Complete!</h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-6">{modalMessage}</p>
                        <button
                            onClick={closeModal}
                            className="w-full py-3 bg-slate-800 text-white font-serif font-semibold rounded-lg hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300 transition-colors shadow-md"
                        >
                            Got It
                        </button>
                    </div>
                </div>
            )}
            
            
        </GoddessPageLayout>
    );
};

export default PersephonePage;
