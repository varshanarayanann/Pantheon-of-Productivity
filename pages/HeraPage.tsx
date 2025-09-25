
import React from 'react';
import GoddessPageLayout from '../components/GoddessPageLayout';
import { GODDESSES } from '../constants';

const HeraPage: React.FC = () => {
  const hera = GODDESSES.find(g => g.id === 'hera')!;

  return (
    <GoddessPageLayout goddess={hera}>
      <div className="text-center text-slate-500 py-16">
        <p>Hera's Family Organizer Tool Placeholder</p>
        <p className="mt-2 text-sm">Plan events, share calendars, and manage family life with divine order.</p>
      </div>
    </GoddessPageLayout>
  );
};

export default HeraPage;
