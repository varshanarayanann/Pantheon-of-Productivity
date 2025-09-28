
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const UserIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const MailIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

const LockIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);


const LoginPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const auth = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const API_URL = 'http://localhost:5001/api';

    const endpoint = isLoginView ? `${API_URL}/login` : `${API_URL}/register`;
    
    const payload = isLoginView 
      ? { email, password } 
      : { name, email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors from the backend (e.g., "User with this email already exists.")
        alert(data.message || 'An error occurred. Please try again.');
        return;
      }
      
      // On success, the backend sends back a token and userName
      if (data.token && data.userName) {
        // NOTE: In a production app, you would securely store the JWT (data.token) here.
        auth?.login(data.userName, data.userId);
      } else {
        alert('Login failed. Please check your credentials.');
      }

    } catch (error) {
      console.error('Failed to connect to the server:', error);
      alert('Could not connect to the server. Please ensure it is running.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 font-sans" style={{
      backgroundImage: `radial-gradient(circle at top right, rgba(252, 211, 77, 0.05) 0%, transparent 50%), radial-gradient(circle at bottom left, rgba(252, 211, 77, 0.05) 0%, transparent 40%)`,
    }}>
      <div className="max-w-md w-full bg-slate-800/40 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-serif font-bold text-white text-center mb-2">Pantheon of Productivity</h1>
          <p className="text-slate-400 text-center mb-8">Enter the realm of the gods</p>

          <div className="flex border-b border-slate-700 mb-6">
            <button onClick={() => setIsLoginView(true)} className={`flex-1 pb-3 text-lg font-semibold transition-colors duration-300 ${isLoginView ? 'text-amber-300 border-b-2 border-amber-300' : 'text-slate-400 hover:text-white'}`}>
              Login
            </button>
            <button onClick={() => setIsLoginView(false)} className={`flex-1 pb-3 text-lg font-semibold transition-colors duration-300 ${!isLoginView ? 'text-amber-300 border-b-2 border-amber-300' : 'text-slate-400 hover:text-white'}`}>
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="animate-fadeIn">
            {!isLoginView && (
              <div className="mb-4 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <UserIcon className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            )}
            <div className="mb-4 relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <MailIcon className="w-5 h-5" />
                </span>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div className="mb-6 relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <LockIcon className="w-5 h-5" />
                </span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <button type="submit" className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-amber-500/30 transform hover:-translate-y-1">
              {isLoginView ? 'Enter the Pantheon' : 'Join the Pantheon'}
            </button>
          </form>
        </div>
      </div>
      <footer className="text-center mt-8 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Pantheon of Productivity. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
