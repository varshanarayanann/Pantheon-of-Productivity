
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
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

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-100 font-sans text-slate-800">
      <main className="container mx-auto px-4 py-8">
        <HashRouter>
          <Routes>
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
          </Routes>
        </HashRouter>
      </main>
    </div>
  );
};

export default App;
