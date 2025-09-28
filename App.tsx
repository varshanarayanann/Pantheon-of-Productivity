import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import HeraPage from './pages/HeraPage';
import AthenaPage from './pages/AthenaPage';
import AphroditePage from './pages/AphroditePage';
import ArtemisPage from './pages/ArtemisPage';
import PersephonePage from './pages/PersephonePage';
import GaiaPage from './pages/GaiaPage';
import MusesPage from './pages/MusesPage';
import NikePage from './pages/NikePage';
import ErisPage from './pages/ErisPage';
import { GODDESSES } from './constants';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { MusicPlayerProvider } from './context/MPContext'; // Import the MusicPlayerProvider
import LoginPage from './pages/LoginPage';

// A consistent layout for all authenticated pages with a persistent header
const AppLayout: React.FC = () => {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("AppLayout must be used within an AuthProvider");
  }
  const { user, logout } = auth;

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-slate-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-serif font-bold text-slate-800 hover:text-indigo-600 transition-colors">
            Pantheon of Productivity
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 hidden sm:block">Welcome, {user?.name || 'Mortal'}</span>
            <button
              onClick={logout}
              className="bg-rose-100 text-rose-800 font-bold py-2 px-5 rounded-full hover:bg-rose-200 transition-colors duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet /> {/* Child routes will render inside this layout */}
      </main>
    </div>
  );
};

const AppContent: React.FC = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { isAuthenticated } = auth;

  return (
    <HashRouter>
      <Routes>
        {isAuthenticated ? (
          // --- Authenticated Routes ---
          // All these routes are children of AppLayout
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path={GODDESSES[0].path} element={<HeraPage />} />
            <Route path={GODDESSES[1].path} element={<AthenaPage />} />
            <Route path={GODDESSES[2].path} element={<AphroditePage />} />
            <Route path={GODDESSES[3].path} element={<ArtemisPage />} />
            <Route path={GODDESSES[4].path} element={<PersephonePage />} />
            <Route path={GODDESSES[5].path} element={<GaiaPage />} />
            <Route path={GODDESSES[6].path} element={<MusesPage />} />
            <Route path={GODDESSES[7].path} element={<NikePage />} />
            <Route path={GODDESSES[8].path} element={<ErisPage />} />
            {/* If an authenticated user tries any other path, redirect them to the homepage */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        ) : (
          // --- Unauthenticated Routes ---
          <>
            <Route path="/login" element={<LoginPage />} />
            {/* If an unauthenticated user tries any other path, redirect them to the login page */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MusicPlayerProvider> {/* The MusicPlayerProvider wraps the entire app */}
        <AppContent />
      </MusicPlayerProvider>
    </AuthProvider>
  );
};

export default App;