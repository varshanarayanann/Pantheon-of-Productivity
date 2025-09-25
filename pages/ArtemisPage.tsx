
import React from 'react';
import GoddessPageLayout from '../components/GoddessPageLayout';
import { GODDESSES } from '../constants';

const ArtemisPage: React.FC = () => {
  const artemis = GODDESSES.find(g => g.id === 'artemis')!;

  return (
    <GoddessPageLayout goddess={artemis}>
      <div className="text-center text-slate-500 py-16">
        <p>Artemis's Focus Timer Tool Placeholder</p>
        <p className="mt-2 text-sm">Use a pomodoro-style timer to hunt down your tasks with unwavering focus.</p>
      </div>
    </GoddessPageLayout>
  );
};

export default ArtemisPage;
