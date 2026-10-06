'use client';

import React from 'react';
import { ActiveView } from '@/types/music';

interface MobileNavBarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

export function MobileNavBar({ activeView, setActiveView }: MobileNavBarProps) {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: 'fa-solid fa-house',
      isActive: activeView.type === 'home',
      onClick: () => setActiveView({ type: 'home' })
    },
    {
      id: 'search',
      label: 'Search',
      icon: 'fa-solid fa-magnifying-glass',
      isActive: activeView.type === 'search',
      onClick: () => setActiveView({ type: 'search' })
    },
    {
      id: 'favorites',
      label: 'Liked',
      icon: 'fa-solid fa-heart',
      isActive: activeView.type === 'favorites',
      onClick: () => setActiveView({ type: 'favorites' })
    },
    {
      id: 'history',
      label: 'History',
      icon: 'fa-solid fa-clock-rotate-left',
      isActive: activeView.type === 'history',
      onClick: () => setActiveView({ type: 'history' })
    }
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-900/90 flex items-center justify-around h-[56px] px-2 select-none"
      data-purpose="mobile-bottom-nav"
      aria-label="Mobile Navigation"
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={item.onClick}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition cursor-pointer ${
            item.isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <i className={`${item.icon} text-lg mb-1 ${item.isActive ? 'text-spotify-green scale-110' : ''} transition-transform`}></i>
          <span className={`text-[10px] tracking-tight ${item.isActive ? 'font-bold text-white' : 'font-medium'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
