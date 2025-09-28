import React, {useEffect, useState, useContext} from 'react';
import { useAuth } from '../context/AuthContext';
import GoddessPageLayout from '../components/GoddessPageLayout';
import { GODDESSES } from '../constants';

const AphroditePage: React.FC = () => {
  const aphrodite = GODDESSES.find(g => g.id === 'aphrodite')!;
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingEntry, setExistingEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // useEffect(() => {
  //   fetch('http://localhost:5001/aphrodite')
  //     .then(response => response.json())
  //     .then(data => setData(data.message))
  // }, []);

  // Load today's journal entry when user is available
  useEffect(() => {
    if (user?.id) {
      loadTodaysEntry();
    }
  }, [user?.id]);

  const loadTodaysEntry = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/journal/${user.id}/today`);
      const entry = await response.json();
      
      if (entry && entry._id) {
        setExistingEntry(entry);
        setTitle(entry.title);
        setContent(entry.content);
        setMood(entry.mood || 1);
      }
    } catch (error) {
      console.error('Error loading today\'s entry:', error);
    } finally {
      setIsLoading(false);
    }
  };


  // Create or update journal entry
  const handleSubmitJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setMessage("User not authenticated.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setMessage("Please fill in both title and content.");
      return;
    }

    if (mood < 1 || mood > 5) {
      setMessage("Please select a mood rating between 1 and 5 hearts.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      let response;
      let successMessage;

      if (existingEntry) {
        // Update existing entry
        response = await fetch(`http://localhost:5001/api/journal/${existingEntry._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title.trim(),
            content: content.trim(),
            mood: mood
          })
        });
        successMessage = "Journal entry updated successfully!";
      } else {
        // Create new entry
        response = await fetch('http://localhost:5001/api/journal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title.trim(),
            content: content.trim(),
            author: user.id,
            mood: mood
          })
        });
        successMessage = "Journal entry created successfully!";
      }

      const result = await response.json();

      if (response.ok) {
        setMessage(successMessage);
        if (!existingEntry) {
          // If we created a new entry, reload today's entries to get the new entry
          await loadTodaysEntry();
        }
      } else {
        setMessage(result.message || `Failed to ${existingEntry ? 'update' : 'create'} journal entry.`);
      }
    } catch (error) {
      setMessage(`Error ${existingEntry ? 'updating' : 'creating'} journal entry. Please try again.`);
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  


  return (
    <GoddessPageLayout goddess={aphrodite}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center text-slate-500 mb-8">
          <h2 className="text-2xl font-bold text-pink-600 mb-2">Aphrodite's Self-Care Diary</h2>
          <p className="text-sm">This is your space to talk about your day, your feelings, or anything else you want to share.</p>
          {isLoading && (
            <p className="mt-2 text-sm text-blue-600">Loading today's entry...</p>
          )}
          {existingEntry && !isLoading && (
            <p className="mt-2 text-sm text-green-600">✏️ Editing today's entry</p>
          )}
        </div>

        <form onSubmit={handleSubmitJournal} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How are you feeling today? 💖
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setMood(rating)}
                  className={`text-2xl transition-all duration-200 hover:scale-110 ${
                    rating <= mood
                      ? 'text-red-500'
                      : 'text-gray-300 hover:text-red-300'
                  }`}
                >
                  {rating <= mood ? '❤️' : '🤍'}
                </button>
              ))}
              <span className="ml-3 text-sm text-gray-600">
                {mood} out of 5 hearts
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              How was your day?
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write a title that describes your day here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              maxLength={100}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Let's talk about it...
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts and feelings here..."
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-vertical"
              required
            />
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-md ${
              message.includes('successfully') 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Loading...' : isSubmitting ? (existingEntry ? 'Updating Entry...' : 'Creating Entry...') : (existingEntry ? 'Update Journal Entry' : 'Create Journal Entry')}
          </button>
        </form>
      </div>
    </GoddessPageLayout>
  );
};


export default AphroditePage;
