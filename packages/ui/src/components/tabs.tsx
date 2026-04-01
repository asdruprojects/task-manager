'use client';

import React from 'react';
import { cn } from '../utils/cn';

export interface TabItem {
  key: string;
  name: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (key: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={cn('w-full border-b border-gray-200', className)}>
      <nav className="flex gap-4 -mb-px overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'shrink-0 pb-3 px-1 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap',
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            )}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
}
