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

  const journalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100},
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  mood: {
    type: Number,
    default: 1
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to User collection
    required: true
  }
});

const Journal = mongoose.model('Journal', journalSchema);



  // Example journal entry using user.id as author
  const exampleJournal = {
    title: "My First Self-Care Journal Entry",
    content: "Today I practiced mindfulness and self-love.",
    date: new Date().toISOString(),
    mood: 5,
    author: user?.id ?? "No user id"
  };

  return (
    <GoddessPageLayout goddess={aphrodite}>
      <div className="text-center text-slate-500 py-16">
        <p>Aphrodite's Self-Care Journal</p>
        <p><strong>Example Journal Title:</strong> {exampleJournal.title}</p>
        <p><strong>Author ID:</strong> {exampleJournal.author}</p>
        <p className="mt-2 text-sm">SELF CARE JOURNAL</p>
        <p>{!data ? "Loading..." : data}</p>
      </div>
    </GoddessPageLayout>
  );
};


export default AphroditePage;
