import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import HeraPage from './frontend/pages/HeraPage';
import AthenaPage from './frontend/pages/AthenaPage';
import AphroditePage from './frontend/pages/AphroditePage';
import ArtemisPage from './frontend/pages/ArtemisPage';
import PersephonePage from './frontend/pages/PersephonePage';
import GaiaPage from './frontend/pages/GaiaPage';
import MusesPage from './frontend/pages/MusesPage';
import NikePage from './frontend/pages/NikePage';
import ErisPage from './frontend/pages/ErisPage';
import { GODDESSES } from './constants';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { MusicPlayerProvider } from './context/MPContext';
import LoginPage from './frontend/pages/LoginPage';
import { ThemeProvider } from './context/ThemeContext';

// This is the main layout for authenticated users, providing a consistent header and navigation.
const AppLayout: React.FC = () => {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("AppLayout must be used within an AuthProvider");
  }
  const { user, logout } = auth;

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-500">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-serif font-bold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Pantheon of Productivity
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 dark:text-slate-400 hidden sm:block">Welcome, {user?.name || 'Mortal'}</span>
            <button
              onClick={logout}
              className="bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 font-bold py-2 px-5 rounded-full hover:bg-rose-200 dark:hover:bg-rose-800/70 transition-colors duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet /> {/* Child routes (goddess pages) will render here */}
      </main>
    </div>
  );
};

// This component handles all the routing logic based on the user's authentication state.
const AppRoutes: React.FC = () => {
  const auth = useContext(AuthContext);

  // Render nothing until auth context is available
  if (!auth) {
    return null; 
  }

  const { isAuthenticated } = auth;

  return (
    <Routes>
      {isAuthenticated ? (
        // --- Authenticated Routes ---
        // These routes are only accessible after login and are wrapped in the AppLayout.
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
          {/* Redirect any other path to the homepage if logged in */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      ) : (
        // --- Unauthenticated Routes ---
        <>
          <Route path="/login" element={<LoginPage />} />
          {/* Redirect any other path to the login page if not logged in */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
};

// The root component that wraps the entire application with necessary context providers and the router.
const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MusicPlayerProvider>
          <HashRouter>
            <AppRoutes />
          </HashRouter>
        </MusicPlayerProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;