import React from 'react';
import GoddessPageLayout from '../components/GoddessPageLayout.js';
import { GODDESSES } from '../constants.js';

const ErisPage: React.FC = () => {
  const eris = GODDESSES.find(g => g.id === 'eris')!;

  return (
    <GoddessPageLayout goddess={eris}>
      <div className="text-center text-slate-600 dark:text-slate-400 py-16">
        <p>Eris's Decision Journal Tool Placeholder</p>
        <p className="mt-2 text-sm">Bring clarity to conflict by documenting and analyzing your toughest decisions.</p>
      </div>
    </GoddessPageLayout>
  );
};

export default ErisPage;