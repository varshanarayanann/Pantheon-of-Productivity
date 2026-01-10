import React from 'react';
import { Link } from 'react-router-dom';
import type { Goddess } from '../../../types.ts';

interface OrbitalButtonProps {
  goddess: Goddess;
}

const colorVariants = {
    sky: 'bg-sky-200 text-sky-700 hover:bg-sky-300 dark:bg-sky-900/50 dark:text-sky-300 dark:hover:bg-sky-800/70',
    indigo: 'bg-indigo-200 text-indigo-700 hover:bg-indigo-300 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-800/70',
    rose: 'bg-rose-200 text-rose-700 hover:bg-rose-300 dark:bg-rose-900/50 dark:text-rose-300 dark:hover:bg-rose-800/70',
    emerald: 'bg-emerald-200 text-emerald-700 hover:bg-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-800/70',
    purple: 'bg-purple-200 text-purple-700 hover:bg-purple-300 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-800/70',
    lime: 'bg-lime-200 text-lime-700 hover:bg-lime-300 dark:bg-lime-900/50 dark:text-lime-300 dark:hover:bg-lime-800/70',
    amber: 'bg-amber-200 text-amber-700 hover:bg-amber-300 dark:bg-amber-900/50 dark:text-amber-300 dark:hover:bg-amber-800/70',
    yellow: 'bg-yellow-200 text-yellow-700 hover:bg-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-300 dark:hover:bg-yellow-800/70',
    slate: 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600',
};

const OrbitalButton: React.FC<OrbitalButtonProps> = ({ goddess }) => {
    const colorClass = colorVariants[goddess.color as keyof typeof colorVariants] || colorVariants.slate;
  return (
    <Link
      to={goddess.path}
      title={goddess.name} // Tooltip for the name
      className={`group flex items-center justify-center w-20 h-20 rounded-full ${colorClass} shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110 transform`}
    >
      {React.cloneElement(goddess.icon, { className: 'w-10 h-10 transition-transform duration-300 group-hover:scale-125' })}
    </Link>
  );
};

export default OrbitalButton;
