import React from 'react';
import { GODDESSES } from '../constants';
import GoddessButton from './GoddessButton';

const HomePage: React.FC = () => {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-slate-800">
          The Pantheon
        </h1>
        <p className="text-lg text-slate-600 mt-2">
          Invoke the power of the goddesses to conquer your day.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {GODDESSES.map((goddess) => (
          <GoddessButton key={goddess.id} goddess={goddess} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;