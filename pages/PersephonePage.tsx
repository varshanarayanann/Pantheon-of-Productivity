
import React from 'react';
import GoddessPageLayout from '../components/GoddessPageLayout';
import { GODDESSES } from '../constants';

const PersephonePage: React.FC = () => {
  const persephone = GODDESSES.find(g => g.id === 'persephone')!;

  return (
    <GoddessPageLayout goddess={persephone}>
      <div className="text-center text-slate-500 py-16">
        <p>Persephone's Seasonal Goal Setter Tool Placeholder</p>
        <p className="mt-2 text-sm">Set and review long-term goals that align with the seasons of your life.</p>
      </div>
    </GoddessPageLayout>
  );
};

export default PersephonePage;
