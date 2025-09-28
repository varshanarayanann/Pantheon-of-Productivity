import React, { useState } from "react";
import Calendar from "./Calendar";
import Chatbot from "./Chatbot";
import TaskTracker from "./TaskTracker";
import type { CalendarEvent, Task } from "../../types";

const getInitialEvents = (): CalendarEvent[] => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  return [
    {
      id: "1",
      title: "Project Kickoff",
      start: new Date(new Date(today).setHours(10, 0, 0, 0)),
      end: new Date(new Date(today).setHours(11, 0, 0, 0)),
      description: "Initial meeting for the new project.",
    },
    {
      id: "2",
      title: "Design Review",
      start: new Date(new Date(tomorrow).setHours(14, 0, 0, 0)),
      end: new Date(new Date(tomorrow).setHours(15, 30, 0, 0)),
      description: "Review the latest UI mockups.",
    },
    {
      id: "3",
      title: "Dentist Appointment",
      start: new Date(new Date(yesterday).setHours(9, 0, 0, 0)),
      end: new Date(new Date(yesterday).setHours(9, 45, 0, 0)),
    },
  ];
};

const getInitialTasks = (): Task[] => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  return [
    {
      id: "t1",
      title: "Read Chapter 4 of History",
      type: "assignment",
      completed: false,
      dueDate: today.toISOString(),
    },
    {
      id: "t2",
      title: "Complete Math Homework",
      type: "assignment",
      completed: true,
      dueDate: tomorrow.toISOString(),
    },
    {
      id: "t3",
      title: "Drink 8 glasses of water",
      type: "habit",
      completed: false,
    },
    {
      id: "t4",
      title: "Go for a 30-min walk",
      type: "habit",
      completed: false,
    },
  ];
};

export default function App() {
  const [events, setEvents] = useState<CalendarEvent[]>(getInitialEvents());
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks());

  const handleAddEvent = (eventData: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: new Date().toISOString() + Math.random(), // simple unique id
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const handleAddTask = (taskData: Omit<Task, "id" | "completed">) => {
    const newTask: Task = {
      ...taskData,
      id: new Date().toISOString() + Math.random(),
      completed: false,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-700 dark:text-gray-200 p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 dark:from-purple-300 dark:to-indigo-300">
          HerAI Assistant
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Your personal AI-powered calendar and scheduler.
        </p>
      </header>
      <main className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-7 gap-8">
        <div className="lg:col-span-3 bg-white dark:bg-slate-800/50 rounded-2xl shadow-md p-6 backdrop-blur-sm border border-gray-200 dark:border-slate-700">
          <Calendar events={events} />
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 rounded-2xl shadow-md flex flex-col backdrop-blur-sm border border-gray-200 dark:border-slate-700">
          <TaskTracker
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 rounded-2xl shadow-md flex flex-col backdrop-blur-sm border border-gray-200 dark:border-slate-700">
          <Chatbot onAddEvent={handleAddEvent} onAddTask={handleAddTask} />
        </div>
      </main>
    </div>
  );
}