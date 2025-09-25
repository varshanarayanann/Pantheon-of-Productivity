
import React from 'react';
import GoddessPageLayout from '../components/GoddessPageLayout';
import { GODDESSES } from '../constants';

const ErisPage: React.FC = () => {
  const eris = GODDESSES.find(g => g.id === 'eris')!;

  return (
    <GoddessPageLayout goddess={eris}>
      <div className="text-center text-slate-500 py-16">
        <p>Eris's Decision Journal Tool Placeholder</p>
        <p className="mt-2 text-sm">Bring clarity to conflict by documenting and analyzing your toughest decisions.</p>
      </div>
    </GoddessPageLayout>
  );
};

export default ErisPage;
