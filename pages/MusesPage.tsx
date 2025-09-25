
import React from 'react';
import GoddessPageLayout from '../components/GoddessPageLayout';
import { GODDESSES } from '../constants';

const MusesPage: React.FC = () => {
  const muses = GODDESSES.find(g => g.id === 'muses')!;

  return (
    <GoddessPageLayout goddess={muses}>
      <div className="text-center text-slate-500 py-16">
        <p>The Muses' Inspiration Board Tool Placeholder</p>
        <p className="mt-2 text-sm">Create mood boards, capture ideas, and find your spark of genius.</p>
      </div>
    </GoddessPageLayout>
  );
};

export default MusesPage;
