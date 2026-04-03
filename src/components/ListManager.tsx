import React, { useState, useMemo } from 'react';
import { Upload, UserPlus, Trash2, Users, HelpCircle, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { Person } from '../types';
import { playSound } from '../utils/sounds';

interface ListManagerProps {
  names: Person[];
  setNames: (names: Person[]) => void;
}

const MOCK_NAMES = [
  '小明', '小華', '阿強', '美美', '大雄', '胖虎', '靜香', '小夫', '柯南', '小哀',
  '路飛', '索隆', '娜美', '山治', '喬巴', '羅賓', '弗蘭奇', '布魯克', '甚平', '烏索普'
];

export default function ListManager({ names, setNames }: ListManagerProps) {
  const [inputText, setInputText] = useState('');

  const duplicates = useMemo(() => {
    const counts: Record<string, number> = {};
    names.forEach(p => {
      counts[p.name] = (counts[p.name] || 0) + 1;
    });
    return names.filter(p => counts[p.name] > 1);
  }, [names]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const newNames = results.data
          .flat()
          .filter(Boolean)
          .map((name: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            name: String(name).trim(),
          }));
        setNames([...names, ...newNames]);
        playSound('success');
      },
    });
  };

  const handleAddFromText = () => {
    if (!inputText.trim()) return;
    const lines = inputText.split(/[,\n]/).filter(s => s.trim());
    const newNames = lines.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
    }));
    setNames([...names, ...newNames]);
    setInputText('');
    playSound('click');
  };

  const loadMockData = () => {
    const mock = MOCK_NAMES.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
    }));
    setNames(mock);
    playSound('success');
  };

  const removeDuplicates = () => {
    const seen = new Set();
    const unique = names.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    setNames(unique);
    playSound('remove');
  };

  const clearAll = () => {
    if (confirm('確定要清除所有名單嗎？')) {
      setNames([]);
      playSound('remove');
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl shadow-xl border-4 border-orange-100">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
          <Users className="w-8 h-8" /> 名單管理
        </h2>
        <button
          onClick={loadMockData}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full transition-all font-bold shadow-md"
        >
          <HelpCircle className="w-5 h-5" /> 載入模擬名單
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 bg-orange-50 rounded-xl border-2 border-orange-200">
            <label className="block text-sm font-bold text-orange-700 mb-2">上傳 CSV 檔案</label>
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors text-orange-600 font-medium"
              >
                <Upload className="w-6 h-6" /> 點擊或拖曳 CSV 檔案
              </label>
            </div>
          </div>

          <div className="p-4 bg-pink-50 rounded-xl border-2 border-pink-200">
            <label className="block text-sm font-bold text-pink-700 mb-2">貼上姓名 (以逗號或換行分隔)</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-32 p-3 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none resize-none"
              placeholder="例如：小明, 小華, 阿強..."
            />
            <button
              onClick={handleAddFromText}
              className="mt-2 flex items-center justify-center gap-2 w-full py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-bold transition-colors shadow-md"
            >
              <UserPlus className="w-5 h-5" /> 加入名單
            </button>
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-gray-700">名單預覽 ({names.length} 人)</span>
            <div className="flex gap-2">
              {duplicates.length > 0 && (
                <button
                  onClick={removeDuplicates}
                  className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full hover:bg-red-200 font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> 移除重複 ({duplicates.length})
                </button>
              )}
              <button
                onClick={clearAll}
                className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200 font-bold"
              >
                全部清除
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[300px] border-2 border-gray-100 rounded-xl p-2 bg-gray-50">
            {names.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 py-10">
                <Users className="w-12 h-12 mb-2 opacity-20" />
                <p>尚無名單</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {names.map((p) => {
                  const isDup = duplicates.some(d => d.name === p.name);
                  return (
                    <div
                      key={p.id}
                      className={`px-3 py-1 rounded-full text-sm flex items-center justify-between ${
                        isDup ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-white text-gray-700 border border-gray-200 shadow-sm'
                      }`}
                    >
                      <span className="truncate">{p.name}</span>
                      {isDup && <AlertCircle className="w-3 h-3 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
