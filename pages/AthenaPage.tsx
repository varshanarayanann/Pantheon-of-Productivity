
import React from 'react';
import GoddessPageLayout from '../components/GoddessPageLayout';
import { GODDESSES } from '../constants';

const AthenaPage: React.FC = () => {
  const athena = GODDESSES.find(g => g.id === 'athena')!;

  return (
    <GoddessPageLayout goddess={athena}>
      <div className="text-center text-slate-500 py-16">
        <p>Athena's Project Planner Tool Placeholder</p>
        <p className="mt-2 text-sm">Outline projects, map strategies, and execute with wisdom.</p>
      </div>
    </GoddessPageLayout>
  );
};

export default AthenaPage;
