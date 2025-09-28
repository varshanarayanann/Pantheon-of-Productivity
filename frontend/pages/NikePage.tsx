import React from 'react';
import GoddessPageLayout from '../../components/GoddessPageLayout';
import { GODDESSES } from '../../constants';

const NikePage: React.FC = () => {
  const nike = GODDESSES.find(g => g.id === 'nike')!;

  return (
    <GoddessPageLayout goddess={nike}>
      <div className="text-center text-slate-600 dark:text-slate-400 py-16">
        <p>Nike's Achievement Log Tool Placeholder</p>
        <p className="mt-2 text-sm">Log your victories, big and small, to build unstoppable momentum.</p>
      </div>
    </GoddessPageLayout>
  );
};

export default NikePage;