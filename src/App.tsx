import React, { useState } from 'react';
import { Sparkles, Users, Trophy, LayoutGrid } from 'lucide-react';
import ListManager from './components/ListManager';
import LuckyWheel from './components/LuckyWheel';
import GroupingTool from './components/GroupingTool';
import { Person } from './types';
import { playSound } from './utils/sounds';

export default function App() {
  const [names, setNames] = useState<Person[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'draw' | 'group'>('list');

  const handleTabChange = (tab: 'list' | 'draw' | 'group') => {
    setActiveTab(tab);
    playSound('click');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] text-gray-800 font-sans selection:bg-orange-200">
      {/* Header */}
      <header className="bg-white border-b-4 border-orange-100 py-6 px-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-3 rounded-2xl shadow-lg rotate-3">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-orange-600 tracking-tight">歡樂名單小助手</h1>
              <p className="text-sm font-bold text-orange-400">HR 與老師的抽獎分組神器</p>
            </div>
          </div>
          
          <nav className="flex bg-orange-50 p-1.5 rounded-2xl border-2 border-orange-100">
            <button
              onClick={() => handleTabChange('list')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'list' 
                  ? 'bg-white text-orange-600 shadow-md scale-105' 
                  : 'text-orange-400 hover:text-orange-600'
              }`}
            >
              <Users className="w-5 h-5" /> 名單
            </button>
            <button
              onClick={() => handleTabChange('draw')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'draw' 
                  ? 'bg-white text-yellow-600 shadow-md scale-105' 
                  : 'text-yellow-400 hover:text-yellow-600'
              }`}
            >
              <Trophy className="w-5 h-5" /> 抽獎
            </button>
            <button
              onClick={() => handleTabChange('group')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === 'group' 
                  ? 'bg-white text-green-600 shadow-md scale-105' 
                  : 'text-green-400 hover:text-green-600'
              }`}
            >
              <LayoutGrid className="w-5 h-5" /> 分組
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-10 px-4">
        {activeTab === 'list' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ListManager names={names} setNames={setNames} />
          </div>
        )}
        
        {activeTab === 'draw' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <LuckyWheel names={names} />
          </div>
        )}
        
        {activeTab === 'group' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GroupingTool names={names} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-10 text-center text-orange-300 font-bold">
        <p>© 2026 歡樂名單小助手 · 讓管理變得更有趣 ✨</p>
      </footer>
    </div>
  );
}
