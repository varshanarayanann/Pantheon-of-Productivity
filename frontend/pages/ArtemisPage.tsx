
import React, { useState, useEffect } from 'react';
import GoddessPageLayout from '../../components/GoddessPageLayout';
import { GODDESSES, SunIcon, MoonIcon } from '../../constants';
import { useTheme } from '../../context/ThemeContext';

const ArtemisPage: React.FC = () => {
  const artemis = GODDESSES.find(g => g.id === 'artemis')!;
  const { theme, setTheme } = useTheme();

  const [bedtime, setBedtime] = useState(() => {
    const savedBedtime = localStorage.getItem('artemis-bedtime');
    return savedBedtime || '22:00';
  });

  useEffect(() => {
    localStorage.setItem('artemis-bedtime', bedtime);
  }, [bedtime]);

  useEffect(() => {
    const checkTime = () => {
      if (!bedtime) return;

      const now = new Date();
      const [bedtimeHours, bedtimeMinutes] = bedtime.split(':').map(Number);
      
      const bedtimeTotalMinutes = bedtimeHours * 60 + bedtimeMinutes;
      const nowTotalMinutes = now.getHours() * 60 + now.getMinutes();
      
      const triggerStartMinutes = bedtimeTotalMinutes - 15;

      if (triggerStartMinutes < 0) {
        if ((nowTotalMinutes >= (1440 + triggerStartMinutes)) || (nowTotalMinutes < bedtimeTotalMinutes)) {
          if (theme !== 'dark') setTheme('dark');
        }
      } else {
        if (nowTotalMinutes >= triggerStartMinutes && nowTotalMinutes < bedtimeTotalMinutes) {
          if (theme !== 'dark') setTheme('dark');
        }
      }
    };

    const intervalId = setInterval(checkTime, 60000); // Check every minute
    checkTime(); // Initial check

    return () => clearInterval(intervalId);
  }, [bedtime, theme, setTheme]);

  const handleBedtimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBedtime(e.target.value);
  };

  const toggleMode = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <GoddessPageLayout goddess={artemis}>
      <div className="max-w-lg mx-auto text-center">
        <p className="text-slate-600 dark:text-slate-400 mb-8">
            Artemis, goddess of the moon, guides your transition from the day's hunt to the night's rest. Set your bedtime to automatically shift your environment into a calming night mode, preparing you for restorative sleep.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12">
            <div className="flex flex-col items-center">
                <label htmlFor="bedtime" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Set Bedtime</label>
                <input
                    id="bedtime"
                    type="time"
                    value={bedtime}
                    onChange={handleBedtimeChange}
                    className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-center font-mono text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    aria-label="Set your bedtime"
                />
            </div>

            <div className="flex flex-col items-center">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mode</label>
                <button
                    onClick={toggleMode}
                    className="relative inline-flex items-center h-10 rounded-full w-20 px-1 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-slate-900"
                    aria-pressed={theme === 'dark'}
                >
                    <span className={`absolute inset-0 rounded-full transition-colors ${theme === 'light' ? 'bg-sky-200' : 'bg-indigo-900'}`}></span>
                    <span className={`absolute left-1 top-1 w-8 h-8 rounded-full bg-white transform transition-transform duration-300 ease-in-out ${theme === 'light' ? 'translate-x-0' : 'translate-x-10'}`}>
                        {theme === 'light' ? (
                            <SunIcon className="w-6 h-6 m-1 text-yellow-500" />
                        ) : (
                            <MoonIcon className="w-6 h-6 m-1 text-indigo-400" />
                        )}
                    </span>
                </button>
            </div>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Focus Timer</h3>
            <p className="text-slate-500 dark:text-slate-400">
                Use a pomodoro-style timer to hunt down your tasks with unwavering focus.
                <br/>
                <em className="text-sm">(Feature coming soon)</em>
            </p>
        </div>
      </div>
    </GoddessPageLayout>
  );
};

export default ArtemisPage;
