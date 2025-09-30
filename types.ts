import React from 'react';

export interface Goddess {
  id: string;
  name: string;
  title: string;
  path: string;
  description: string;
  toolName: string;
  color: string;
  // Fix: Specify that the icon is a ReactElement that can accept a className prop.
  // This resolves a TypeScript error when using React.cloneElement in GoddessPageLayout.tsx.
  icon: React.ReactElement<{ className?: string }>;
}
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
}

export interface Task {
  id: string;
  title: string;
  type: "assignment" | "habit";
  completed: boolean;
  dueDate?: string; // Storing as ISO string for simplicity
}
export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot" | "error";
}

export interface PlanStep {
  id: string;
  text: string;
  completed: boolean;
}
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Goal {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  completed: boolean;
  dateAdded: string;
  dateCompleted?: string;
}

export interface LevelUpResponse {
  message: string;
  tip: string;
}

