import React from 'react';
import { Link } from 'react-router-dom';
import type { Goddess } from '../../../../types.js';

interface GoddessButtonProps {
  goddess: Goddess;
}

const colorVariants = {
    sky: 'from-sky-50 to-sky-200 text-sky-900 border-sky-300 hover:shadow-sky-300/40 dark:from-sky-900 dark:to-sky-800 dark:text-sky-100 dark:border-sky-700 dark:hover:shadow-sky-700/40',
    indigo: 'from-indigo-50 to-indigo-200 text-indigo-900 border-indigo-300 hover:shadow-indigo-300/40 dark:from-indigo-900 dark:to-indigo-800 dark:text-indigo-100 dark:border-indigo-700 dark:hover:shadow-indigo-700/40',
    rose: 'from-rose-50 to-rose-200 text-rose-900 border-rose-300 hover:shadow-rose-300/40 dark:from-rose-900 dark:to-rose-800 dark:text-rose-100 dark:border-rose-700 dark:hover:shadow-rose-700/40',
    emerald: 'from-emerald-50 to-emerald-200 text-emerald-900 border-emerald-300 hover:shadow-emerald-300/40 dark:from-emerald-900 dark:to-emerald-800 dark:text-emerald-100 dark:border-emerald-700 dark:hover:shadow-emerald-700/40',
    purple: 'from-purple-50 to-purple-200 text-purple-900 border-purple-300 hover:shadow-purple-300/40 dark:from-purple-900 dark:to-purple-800 dark:text-purple-100 dark:border-purple-700 dark:hover:shadow-purple-700/40',
    lime: 'from-lime-50 to-lime-200 text-lime-900 border-lime-300 hover:shadow-lime-300/40 dark:from-lime-900 dark:to-lime-800 dark:text-lime-100 dark:border-lime-700 dark:hover:shadow-lime-700/40',
    amber: 'from-amber-50 to-amber-200 text-amber-900 border-amber-300 hover:shadow-amber-300/40 dark:from-amber-900 dark:to-amber-800 dark:text-amber-100 dark:border-amber-700 dark:hover:shadow-amber-700/40',
    yellow: 'from-yellow-50 to-yellow-200 text-yellow-900 border-yellow-300 hover:shadow-yellow-300/40 dark:from-yellow-900 dark:to-yellow-800 dark:text-yellow-100 dark:border-yellow-700 dark:hover:shadow-yellow-700/40',
    slate: 'from-slate-50 to-slate-200 text-slate-900 border-slate-300 hover:shadow-slate-300/40 dark:from-slate-800 dark:to-slate-700 dark:text-slate-100 dark:border-slate-600 dark:hover:shadow-slate-600/40',
};


const GoddessButton: React.FC<GoddessButtonProps> = ({ goddess }) => {
    const colorClass = colorVariants[goddess.color as keyof typeof colorVariants] || colorVariants.slate;
  return (
    <Link
      to={goddess.path}
      className={`group flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br ${colorClass} rounded-2xl border shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 transform`}
    >
      <div className="mb-4">
        {goddess.icon}
      </div>
      <h3 className="text-2xl font-serif font-semibold">{goddess.name}</h3>
      <p className="text-sm opacity-80 mt-1">{goddess.description}</p>
    </Link>
  );
};

export default GoddessButton;