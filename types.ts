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
