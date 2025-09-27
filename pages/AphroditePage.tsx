
import React, {useEffect, useState} from 'react';
import GoddessPageLayout from '../components/GoddessPageLayout';
import { GODDESSES } from '../constants';

const AphroditePage: React.FC = () => {
  const aphrodite = GODDESSES.find(g => g.id === 'aphrodite')!;
  const [data, setData] = useState(null);

  React.useEffect(() => {
    fetch('http://localhost:5000/aphrodite')
      .then(response => response.json())
      .then(data => setData(data.message))
  }, []);


  return (
    <GoddessPageLayout goddess={aphrodite}>
      <div className="text-center text-slate-500 py-16">
        <p>Aphrodite's Self-Care Tracker Tool Placeholder</p>
        <p className="mt-2 text-sm">Build positive habits, track your well-being, and cultivate self-love.</p>
        <p>{!data ? "Loading..." : data}</p>
      </div>
    </GoddessPageLayout>
  );
};

export default AphroditePage;
