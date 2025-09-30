import React, { useState, useEffect } from "react";
import { Goal, Difficulty, LevelUpResponse } from "../../types";
import { generateLevelUpMessage } from "../hera-frontend/services/geminiServices";

const XP_VALUES: Record<Difficulty, number> = {
  Easy: 10,
  Medium: 25,
  Hard: 50,
};

const calculateXpToNextLevel = (level: number) => 100 + (level - 1) * 50;

const NikeApp: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");

  const [isLoading, setIsLoading] = useState(false);
  const [levelUpData, setLevelUpData] = useState<LevelUpResponse | null>(null);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const savedGoals = localStorage.getItem("nike_goals");
      const savedLevel = localStorage.getItem("nike_level");
      const savedXp = localStorage.getItem("nike_xp");

      if (savedGoals) setGoals(JSON.parse(savedGoals));
      if (savedLevel) setLevel(JSON.parse(savedLevel));
      if (savedXp) setXp(JSON.parse(savedXp));
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("nike_goals", JSON.stringify(goals));
      localStorage.setItem("nike_level", JSON.stringify(level));
      localStorage.setItem("nike_xp", JSON.stringify(xp));
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  }, [goals, level, xp]);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("A goal title is required.");
      return;
    }
    setError(null);

    const newGoal: Goal = {
      id: new Date().toISOString(),
      title,
      description,
      difficulty,
      completed: false,
      dateAdded: new Date().toLocaleDateString(),
    };

    setGoals([newGoal, ...goals]);
    setTitle("");
    setDescription("");
    setDifficulty("Medium");
  };

  const handleCompleteGoal = async (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const xpGained = XP_VALUES[goal.difficulty];
    const newXp = xp + xpGained;
    const xpToNextLevel = calculateXpToNextLevel(level);

    if (newXp >= xpToNextLevel) {
      const nextLevel = level + 1;
      const remainingXp = newXp - xpToNextLevel;
      setLevel(nextLevel);
      setXp(remainingXp);
      setIsLoading(true);
      setIsLevelUpModalOpen(true);
      setLevelUpData(null); // Clear previous data
      const data = await generateLevelUpMessage(nextLevel);
      setLevelUpData(data);
      setIsLoading(false);
    } else {
      setXp(newXp);
    }

    const updatedGoals = goals.map((g) =>
      g.id === goalId
        ? {
            ...g,
            completed: true,
            dateCompleted: new Date().toLocaleDateString(),
          }
        : g
    );
    setGoals(updatedGoals);
  };

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);
  const xpForNextLevel = calculateXpToNextLevel(level);
  const xpProgressPercent = Math.min((xp / xpForNextLevel) * 100, 100);

  const getDifficultyClass = (d: Difficulty) => {
    switch (d) {
      case "Easy":
        return "bg-yellow-200/80 text-yellow-600 border-yellow-300"; // Pastel yellow
      case "Medium":
        return "bg-yellow-300/80 text-yellow-700 border-yellow-400"; // Slightly darker pastel yellow
      case "Hard":
        return "bg-yellow-400/80 text-yellow-800 border-yellow-500"; // More saturated pastel yellow
    }
  };

  const LevelUpModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-yellow-100 rounded-xl shadow-2xl p-6 md:p-8 border border-yellow-300 w-full max-w-md text-center transform scale-100 transition-transform duration-300">
        {/* Gold icons and text made pastel with color adjustments */}
        <div className="flex justify-center items-center">
          <svg
            className="w-8 h-8 text-yellow-400 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c0-3.517 3.07-4 4.5-4 1.43 0 2.5.5 2.5 1.5 0 .665-.375 1.05-1 1.375M12 11c0 3.517-3.07 4-4.5 4-1.43 0-2.5-.5-2.5-1.5 0-.665.375-1.05 1-1.375M12 11v10"
            />
          </svg>
          <h2 className="text-3xl font-bold text-yellow-700 uppercase tracking-widest">
            Level Up!
          </h2>
          <svg
            className="w-8 h-8 text-yellow-400 ml-3 transform -scale-x-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c0-3.517 3.07-4 4.5-4 1.43 0 2.5.5 2.5 1.5 0 .665-.375 1.05-1 1.375M12 11c0 3.517-3.07 4-4.5 4-1.43 0-2.5-.5-2.5-1.5 0-.665.375-1.05 1-1.375M12 11v10"
            />
          </svg>
        </div>
        <p className="mt-2 text-xl text-gray-700">
          You have reached Level {level}!
        </p>
        <div className="my-6 p-4 bg-yellow-50 rounded-lg min-h-[8rem] flex flex-col items-center justify-center">
          {" "}
          {/* pastel yellow background */}
          {isLoading || !levelUpData ? (
            <p className="text-gray-400 italic">
              Summoning words of victory...
            </p>
          ) : (
            <div className="text-center">
              <p className="text-lg italic text-yellow-800">
                {" "}
                {/* Darker text for contrast */}"{levelUpData.message}"
              </p>
              <p className="mt-4 text-sm text-gray-600">
                <strong>Nike's Wisdom:</strong> {levelUpData.tip}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsLevelUpModalOpen(false)}
          className="w-full bg-yellow-400 text-gray-800 font-bold py-3 px-4 rounded-md uppercase tracking-wider hover:bg-yellow-500 transition-colors duration-300"
        >
          Continue Path to Glory
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-yellow-50 p-8 rounded-lg shadow-xl">
      {" "}
      {/* Pastel yellow background for the main container */}
      {isLevelUpModalOpen && <LevelUpModal />}
      {/* Player Stats */}
      <div className="bg-yellow-100 rounded-xl shadow-2xl p-6 md:p-8 border border-yellow-300 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-yellow-700">LEVEL {level}</h2>
          <p className="text-lg text-gray-600 font-semibold">
            {" "}
            {/* Slightly darker text */}
            {xp} / {xpForNextLevel} XP
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 border border-gray-300">
          {" "}
          {/* Lighter background */}
          <div
            className="bg-yellow-400 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${xpProgressPercent}%` }}
          ></div>
        </div>
      </div>
      {/* Add Goal Form */}
      <div className="bg-yellow-100 rounded-xl shadow-2xl p-6 md:p-8 border border-yellow-300 mb-12">
        <h2 className="text-2xl font-bold text-center text-yellow-700 uppercase tracking-widest">
          Set a New Goal
        </h2>
        <form onSubmit={handleAddGoal} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Goal Title (e.g., Read a book)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
          <textarea
            placeholder="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-md h-20 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full p-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <button
              type="submit"
              className="w-full bg-yellow-400 text-gray-800 font-bold py-3 px-4 rounded-md uppercase tracking-wider hover:bg-yellow-500 transition-colors duration-300"
            >
              Set Goal
            </button>
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </form>
      </div>
      {/* Active Goals */}
      <div>
        <h3 className="text-2xl font-bold text-center text-yellow-700 uppercase tracking-widest">
          Active Goals
        </h3>
        <div className="mt-6 space-y-4">
          {activeGoals.length > 0 ? (
            activeGoals.map((goal) => (
              <div
                key={goal.id}
                className="bg-yellow-100 p-5 rounded-lg border border-yellow-300 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <p className="text-xl font-bold text-yellow-800">
                      {goal.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      Added: {goal.dateAdded}
                    </p>
                  </div>
                  <div
                    className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-semibold rounded-full border ${getDifficultyClass(
                      goal.difficulty
                    )}`}
                  >
                    {goal.difficulty} (+{XP_VALUES[goal.difficulty]} XP)
                  </div>
                </div>
                {goal.description && (
                  <p className="mt-3 text-gray-700">{goal.description}</p>
                )}
                <button
                  onClick={() => handleCompleteGoal(goal.id)}
                  className="mt-4 w-full sm:w-auto bg-transparent border-2 border-yellow-400 text-yellow-700 font-bold py-2 px-6 rounded-md uppercase tracking-wider hover:bg-yellow-400 hover:text-gray-800 transition-colors duration-300"
                >
                  Claim Victory
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-8">
              Set a new goal to begin your journey to greatness.
            </p>
          )}
        </div>
      </div>
      {/* Triumph Archive */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-center text-yellow-700 uppercase tracking-widest">
          Triumph Archive
        </h3>
        <div className="mt-6 space-y-4">
          {completedGoals.length > 0 ? (
            completedGoals.map((goal) => (
              <div
                key={goal.id}
                className="bg-gray-100 p-5 rounded-lg border border-gray-300 opacity-70" /* Slightly gray pastel*/
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xl font-bold text-gray-500 line-through">
                      {goal.title}
                    </p>
                    <p
                      className={`text-sm ${getDifficultyClass(
                        goal.difficulty
                      )} inline-block px-2 py-0.5 rounded-md`}
                    >
                      {goal.difficulty}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {" "}
                    {/* Slightly darker than before */}
                    Completed: {goal.dateCompleted}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-8">
              Your history of victories will be recorded here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NikeApp;
