import React, { useState } from 'react';
import { Users, Download, Shuffle, LayoutGrid } from 'lucide-react';
import Papa from 'papaparse';
import { Person, Group } from '../types';
import { playSound } from '../utils/sounds';
import { motion } from 'motion/react';

interface GroupingToolProps {
  names: Person[];
}

export default function GroupingTool({ names }: GroupingToolProps) {
  const [groupSize, setGroupSize] = useState(2);
  const [groups, setGroups] = useState<Group[]>([]);

  const generateGroups = () => {
    if (names.length === 0) return;
    
    playSound('click');
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    const newGroups: Group[] = [];
    
    for (let i = 0; i < shuffled.length; i += groupSize) {
      newGroups.push({
        id: Math.floor(i / groupSize) + 1,
        members: shuffled.slice(i, i + groupSize),
      });
    }
    
    setGroups(newGroups);
    playSound('success');
  };

  const exportCSV = () => {
    if (groups.length === 0) return;
    
    const csvData = groups.flatMap(g => 
      g.members.map(m => ({
        '組別': `第 ${g.id} 組`,
        '姓名': m.name
      }))
    );
    
    const csv = Papa.unparse(csvData);
    const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `分組結果_${new Date().toLocaleDateString()}.csv`;
    link.click();
    playSound('success');
  };

  if (names.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-xl border-4 border-green-100 text-center">
        <Users className="w-16 h-16 text-green-400 mb-4 opacity-50" />
        <p className="text-xl font-bold text-gray-500">請先加入名單成員</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-white p-8 rounded-2xl shadow-xl border-4 border-green-100">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-green-600 flex items-center gap-2">
            <LayoutGrid className="w-8 h-8" /> 自動分組
          </h2>
          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border-2 border-green-200">
            <span className="text-sm font-bold text-green-700">每組人數：</span>
            <input
              type="number"
              min="1"
              max={names.length}
              value={groupSize}
              onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
              className="w-16 bg-transparent border-b-2 border-green-400 outline-none text-center font-bold text-green-800"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={generateGroups}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold transition-all shadow-lg transform hover:scale-105 active:scale-95"
          >
            <Shuffle className="w-5 h-5" /> 開始分組
          </button>
          {groups.length > 0 && (
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-bold transition-all shadow-lg transform hover:scale-105 active:scale-95"
            >
              <Download className="w-5 h-5" /> 下載結果
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {groups.map((group, idx) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-xl border-2 border-green-200 shadow-md overflow-hidden"
          >
            <div className="bg-green-500 px-4 py-2 text-white font-bold flex justify-between items-center">
              <span>第 {group.id} 組</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{group.members.length} 人</span>
            </div>
            <div className="p-4 space-y-2">
              {group.members.map((member) => (
                <div key={member.id} className="flex items-center gap-2 text-gray-700 font-medium p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  {member.name}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
        {groups.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-10" />
            <p className="text-lg">設定人數後點擊「開始分組」</p>
          </div>
        )}
      </div>
    </div>
  );
}
