import React from 'react';
import GoddessPageLayout from '../../components/GoddessPageLayout';
import { GODDESSES } from '../../constants';

const AphroditePage: React.FC = () => {
  const aphrodite = GODDESSES.find(g => g.id === 'aphrodite')!;

  return (
    <GoddessPageLayout goddess={aphrodite}>
      <div className="text-center text-slate-600 dark:text-slate-400 py-16">
        <p>Aphrodite's Self-Care Tracker Tool Placeholder</p>
        <p className="mt-2 text-sm">Build positive habits, track your well-being, and cultivate self-love.</p>
      </div>
    </GoddessPageLayout>
  );
};

export default AphroditePage;