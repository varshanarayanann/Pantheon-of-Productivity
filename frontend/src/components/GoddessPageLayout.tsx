import React from 'react';
import { Link } from 'react-router-dom';
import type { Goddess } from '../../../types.ts';

interface GoddessPageLayoutProps {
  goddess: Goddess;
  children: React.ReactNode;
}

const colorVariants = {
    sky: 'text-sky-700',
    indigo: 'text-indigo-700',
    rose: 'text-rose-700',
    emerald: 'text-emerald-700',
    purple: 'text-purple-700',
    lime: 'text-lime-700',
    amber: 'text-amber-700',
    yellow: 'text-yellow-700',
    slate: 'text-slate-700',
};

const darkColorVariants = {
    sky: 'dark:text-sky-400',
    indigo: 'dark:text-indigo-400',
    rose: 'dark:text-rose-400',
    emerald: 'dark:text-emerald-400',
    purple: 'dark:text-purple-400',
    lime: 'dark:text-lime-400',
    amber: 'dark:text-amber-400',
    yellow: 'dark:text-yellow-400',
    slate: 'dark:text-slate-400',
};

const bgColorVariants = {
    sky: 'bg-sky-100 border-sky-200',
    indigo: 'bg-indigo-100 border-indigo-200',
    rose: 'bg-rose-100 border-rose-200',
    emerald: 'bg-emerald-100 border-emerald-200',
    purple: 'bg-purple-100 border-purple-200',
    lime: 'bg-lime-100 border-lime-200',
    amber: 'bg-amber-100 border-amber-200',
    yellow: 'bg-yellow-100 border-yellow-200',
    slate: 'bg-slate-100 border-slate-200',
};

const GoddessPageLayout: React.FC<GoddessPageLayoutProps> = ({ goddess, children }) => {
    const colorClass = colorVariants[goddess.color as keyof typeof colorVariants] || colorVariants.slate;
    const darkColorClass = darkColorVariants[goddess.color as keyof typeof darkColorVariants] || darkColorVariants.slate;
    const bgColorClass = bgColorVariants[goddess.color as keyof typeof bgColorVariants] || bgColorVariants.slate;

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <Link to="/" className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors duration-200 group flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to the Pantheon
        </Link>
      </div>

      <header className="text-center mb-12">
        <div className={`inline-block p-4 ${bgColorClass} rounded-full mb-4 dark:bg-slate-800 dark:border-slate-700 transition-colors duration-500`}>
            <div className={`${colorClass} ${darkColorClass}`}>{React.cloneElement(goddess.icon, {className: 'w-16 h-16'})}</div>
        </div>
        <h1 className={`text-5xl font-serif font-bold ${colorClass} ${darkColorClass}`}>{goddess.name}</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mt-2">{goddess.title}</p>
        <p className="text-md text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto">{goddess.description}</p>
      </header>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200 dark:bg-slate-900 dark:border-slate-700 transition-colors duration-500">
        <h2 className="text-3xl font-bold font-serif text-slate-700 dark:text-slate-200 mb-6 text-center">{goddess.toolName}</h2>
        {children}
      </div>
    </div>
  );
};

export default GoddessPageLayout;