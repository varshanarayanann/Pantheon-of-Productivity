
import React from 'react';
import GoddessPageLayout from '../components/GoddessPageLayout';
import { GODDESSES } from '../constants';

const GaiaPage: React.FC = () => {
  const gaia = GODDESSES.find(g => g.id === 'gaia')!;

  return (
    <GoddessPageLayout goddess={gaia}>
      <div className="text-center text-slate-500 py-16">
        <p>Gaia's Digital Garden Tool Placeholder</p>
        <p className="mt-2 text-sm">Nurture your notes, ideas, and knowledge in an interconnected space.</p>
      </div>
    </GoddessPageLayout>
  );
};

export default GaiaPage;
