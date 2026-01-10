import React, { useState, useRef, useEffect } from "react";

const developers = [
  { name: "Varsha Narayanan", github: "https://github.com/varshanarayanann" },
  { name: "Forum Shah", github: "https://github.com/shahforum" },
  { name: "Ananya Raghunath", github: "https://github.com/ananyaraghunath"},
  { name: "Carlin Verano", github: "https://github.com/carlinnv" },
];

const TeamCredits: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="fixed bottom-4 right-4 z-50">
      {/* Credits Button */}
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 focus:outline-none"
      >
        Credits
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg overflow-hidden">
          {developers.map((dev) => (
            <a
              key={dev.name}
              href={dev.github}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {dev.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamCredits;
