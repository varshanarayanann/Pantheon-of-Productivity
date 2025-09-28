import React, {useEffect, useState, useContext} from 'react';
import { useAuth } from '../context/AuthContext';
import GoddessPageLayout from '../components/GoddessPageLayout';
import { GODDESSES } from '../constants';

import mongoose from 'mongoose';
import { User } from '../pantheon-backend/index.js';


const AphroditePage: React.FC = () => {
  const aphrodite = GODDESSES.find(g => g.id === 'aphrodite')!;
  const [data, setData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetch('http://localhost:5001/aphrodite')
      .then(response => response.json())
      .then(data => setData(data.message))
  }, []);

  return (
    <GoddessPageLayout goddess={aphrodite}>
      <div className="text-center text-slate-500 py-16">
        <p>Aphrodite's Self-Care Journal</p>
        <p>{user.name}</p>
        <p>{user.id}</p>
        <p className="mt-2 text-sm">SELF CARE JOURNAL</p>
        <p>{!data ? "Loading..." : data}</p>
      </div>
    </GoddessPageLayout>
  );
};

// const journalSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   content: {
//     type: String,
//     required: true
//   },
//   mood: {
//     type: Number,
//     default: 'neutral'
//   },
//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',  // Reference to User collection
//     required: true
//   }
// });

export default AphroditePage;
