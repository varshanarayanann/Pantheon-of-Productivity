
import React from 'react';
import type { Goddess } from './types';

// Heroicon SVG components for illustrative purposes
const CalendarDaysIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" />
  </svg>
);

const LightBulbIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-11.62A6.01 6.01 0 0012 2.25C6.477 2.25 2 6.727 2 12.25a6.01 6.01 0 0011.5 2.122M12 18a.75.75 0 00.75-.75V15m0 0a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v1.5a.75.75 0 00.75.75h1.5z" />
  </svg>
);

const HeartIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const SunIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
);

const ArrowTrendingUpIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.976 5.197m-3.976-5.197L21.25 4.5M2.25 6v12h12" />
  </svg>
);

const SparklesIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.456-2.456L12.5 18l1.197-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.197a3.375 3.375 0 002.456 2.456L20.25 18l-1.197.398a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

const TrophyIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 1011.64-8.03A9.75 9.75 0 006.36 10.72M12 21V9" />
    </svg>
);

const ScaleIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-6.866-2.92c-.832-1.612-3.03-1.612-3.862 0a5.988 5.988 0 01-6.866 2.92c-.483-.174-.711-.703-.59-1.202L5.25 4.97m13.5 0c-1.01.143-2.01.317-3 .52M5.25 4.97c1.01.143 2.01.317 3 .52m0 0c1.01.143 2.01.317 3 .52M8.25 4.97c1.01.143 2.01.317 3 .52" />
    </svg>
);

const GlobeAltIcon: React.FC<{className: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM4.635 15.365A8.96 8.96 0 014.5 12c0-1.35.31-2.634.865-3.805m13.001 7.61a8.96 8.96 0 01-.131-3.555c.555-1.17.865-2.454.865-3.805 0-1.35-.31-2.634-.865-3.805m-1.73 7.61a8.96 8.96 0 00-1.73-7.61m-9.54 7.61a8.96 8.96 0 01-1.73-7.61" />
  </svg>
);

export const GODDESSES: Goddess[] = [
  {
    id: 'hera',
    name: 'Hera',
    title: 'Queen of the Gods',
    path: '/hera',
    description: 'Domain of family, marriage, and home. Plan your life with regal authority.',
    toolName: 'Family Organizer',
    color: 'sky',
    icon: <CalendarDaysIcon className="w-10 h-10" />,
  },
  {
    id: 'athena',
    name: 'Athena',
    title: 'Goddess of Wisdom',
    path: '/athena',
    description: 'Domain of strategy, wisdom, and crafts. Weave your plans with divine intellect.',
    toolName: 'Ask Athena',
    color: 'indigo',
    icon: <LightBulbIcon className="w-10 h-10" />,
  },
  {
    id: 'aphrodite',
    name: 'Aphrodite',
    title: 'Goddess of Love',
    path: '/aphrodite',
    description: 'Domain of beauty, love, and pleasure. Cultivate self-love and positive habits.',
    toolName: 'Self-Care Tracker',
    color: 'rose',
    icon: <HeartIcon className="w-10 h-10" />,
  },
  {
    id: 'artemis',
    name: 'Artemis',
    title: 'Goddess of the Hunt',
    path: '/artemis',
    description: 'Domain of the wild, the hunt, and focus. Hunt down your tasks with precision.',
    toolName: 'Focus Timer',
    color: 'emerald',
    icon: <SunIcon className="w-10 h-10" />,
  },
  {
    id: 'persephone',
    name: 'Persephone',
    title: 'Queen of the Underworld',
    path: '/persephone',
    description: 'Domain of seasons, change, and growth. Set goals that flourish and evolve.',
    toolName: 'Seasonal Goal Setter',
    color: 'purple',
    icon: <ArrowTrendingUpIcon className="w-10 h-10" />,
  },
  {
    id: 'gaia',
    name: 'Gaia',
    title: 'Primordial Earth Mother',
    path: '/gaia',
    description: 'Domain of the Earth and all creation. Cultivate your knowledge and ideas.',
    toolName: 'Digital Garden',
    color: 'lime',
    icon: <GlobeAltIcon className="w-10 h-10" />,
  },
  {
    id: 'muses',
    name: 'The Muses',
    title: 'Goddesses of Inspiration',
    path: '/muses',
    description: 'Domain of arts, literature, and science. Capture every brilliant thought.',
    toolName: 'Inspiration Board',
    color: 'amber',
    icon: <SparklesIcon className="w-10 h-10" />,
  },
  {
    id: 'nike',
    name: 'Nike',
    title: 'Goddess of Victory',
    path: '/nike',
    description: 'Domain of speed, strength, and victory. Track your wins and build momentum.',
    toolName: 'Achievement Log',
    color: 'yellow',
    icon: <TrophyIcon className="w-10 h-10" />,
  },
  {
    id: 'eris',
    name: 'Eris',
    title: 'Goddess of Discord',
    path: '/eris',
    description: 'Domain of strife and discord. Bring order to chaos by analyzing tough choices.',
    toolName: 'Decision Journal',
    color: 'slate',
    icon: <ScaleIcon className="w-10 h-10" />,
  },
];
