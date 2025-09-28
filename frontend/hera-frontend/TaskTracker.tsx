import React, { useState } from "react";
import type { Task } from "../../types";

interface TaskTrackerProps {
  tasks: Task[];
  onAddTask: (taskData: Omit<Task, "id" | "completed">) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

// Icons
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const TaskItem: React.FC<{
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}> = ({ task, onToggle, onDelete }) => {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && !task.completed && dueDate < new Date();

  return (
    <div className="flex items-center gap-3 p-2 bg-gray-100 dark:bg-slate-700/50 rounded-lg group">
      <button
        onClick={onToggle}
        className={`flex-shrink-0 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors ${
          task.completed
            ? "bg-green-200 dark:bg-green-800/50 border-green-300 dark:border-green-700"
            : "border-gray-300 dark:border-gray-600 group-hover:border-indigo-300 dark:group-hover:border-indigo-500 text-gray-500"
        }`}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {task.completed && <CheckIcon />}
      </button>
      <div className="flex-grow">
        <p
          className={`text-sm text-gray-700 dark:text-gray-200 ${
            task.completed ? "line-through text-gray-400 dark:text-gray-500" : ""
          }`}
        >
          {task.title}
        </p>
        {task.type === "assignment" && dueDate && (
          <p
            className={`text-xs ${
              isOverdue ? "text-red-400" : "text-gray-400 dark:text-gray-500"
            }`}
          >
            Due:{" "}
            {dueDate.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </p>
        )}
      </div>
      <button
        onClick={onDelete}
        className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Delete task"
      >
        <TrashIcon />
      </button>
    </div>
  );
};

const TaskTracker: React.FC<TaskTrackerProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskType, setNewTaskType] = useState<"assignment" | "habit">(
    "assignment"
  );
  const [newDueDate, setNewDueDate] = useState("");

  const assignments = tasks.filter((t) => t.type === "assignment");
  const habits = tasks.filter((t) => t.type === "habit");

  const handleManualAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const taskData: Omit<Task, "id" | "completed"> = {
      title: newTaskTitle,
      type: newTaskType,
    };

    if (newTaskType === "assignment" && newDueDate) {
      const [year, month, day] = newDueDate.split("-").map(Number);
      taskData.dueDate = new Date(year, month - 1, day).toISOString();
    }

    onAddTask(taskData);
    setNewTaskTitle("");
    setNewDueDate("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 dark:from-green-300 dark:to-teal-300">
          Task Tracker
        </h2>
      </div>

      <div className="flex-grow p-4 overflow-y-auto space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-500 dark:text-gray-400">
            Assignments
          </h3>
          <div className="space-y-2">
            {assignments.length > 0 ? (
              assignments.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => onToggleTask(task.id)}
                  onDelete={() => onDeleteTask(task.id)}
                />
              ))
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                No assignments yet.
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-500 dark:text-gray-400">Habits</h3>
          <div className="space-y-2">
            {habits.length > 0 ? (
              habits.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => onToggleTask(task.id)}
                  onDelete={() => onDeleteTask(task.id)}
                />
              ))
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                No habits to track.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-slate-700">
        <form onSubmit={handleManualAddTask}>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-grow bg-gray-100 dark:bg-slate-700 dark:text-gray-200 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-300 dark:bg-indigo-500 rounded-md p-2 text-gray-700 dark:text-white hover:bg-indigo-200 dark:hover:bg-indigo-400 transition-colors"
            >
              <PlusIcon />
            </button>
          </div>
          <div className="flex items-center justify-between gap-2 text-sm">
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="taskType"
                  value="assignment"
                  checked={newTaskType === "assignment"}
                  onChange={() => setNewTaskType("assignment")}
                  className="accent-indigo-300 dark:accent-indigo-400 bg-gray-100"
                />
                Assignment
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="taskType"
                  value="habit"
                  checked={newTaskType === "habit"}
                  onChange={() => setNewTaskType("habit")}
                  className="accent-indigo-300 dark:accent-indigo-400 bg-gray-100"
                />
                Habit
              </label>
            </div>
            {newTaskType === "assignment" && (
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="bg-gray-100 dark:bg-slate-700 rounded-md py-1 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskTracker;