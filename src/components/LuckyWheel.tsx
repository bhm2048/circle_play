import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Trophy, RotateCcw, Settings2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Person } from '../types';
import { playSound, Ticker } from '../utils/sounds';

interface LuckyWheelProps {
  names: Person[];
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#82E0AA', '#F1948A', '#85C1E9'
];

export default function LuckyWheel({ names }: LuckyWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Person | null>(null);
  const [repeat, setRepeat] = useState(false);
  const [history, setHistory] = useState<Person[]>([]);
  const controls = useAnimation();
  const rotationRef = useRef(0);
  const tickerRef = useRef(new Ticker());

  const availableNames = repeat ? names : names.filter(n => !history.some(h => h.id === n.id));

  const spin = async () => {
    if (isSpinning || availableNames.length === 0) return;

    setIsSpinning(true);
    setWinner(null);
    playSound('click');

    const spinDuration = 5; // seconds
    const extraSpins = 5 + Math.random() * 5;
    const targetRotation = rotationRef.current + (extraSpins * 360) + Math.random() * 360;

    // Ticking sound logic
    let lastTickAngle = 0;
    const sliceAngle = 360 / availableNames.length;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = rotationRef.current + (targetRotation - rotationRef.current) * easeOut;

      // Tick sound when passing a slice
      if (Math.abs(currentRotation - lastTickAngle) >= sliceAngle) {
        tickerRef.current.play();
        lastTickAngle = currentRotation;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);

    await controls.start({
      rotate: targetRotation,
      transition: { duration: spinDuration, ease: [0.15, 0, 0.15, 1] }
    });

    rotationRef.current = targetRotation % 360;
    const finalAngle = (360 - (rotationRef.current % 360)) % 360;
    const winnerIndex = Math.floor(finalAngle / sliceAngle);
    const selectedWinner = availableNames[winnerIndex];

    setWinner(selectedWinner);
    setHistory(prev => [...prev, selectedWinner]);
    setIsSpinning(false);
    playSound('win');
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: COLORS
    });
  };

  const resetHistory = () => {
    setHistory([]);
    setWinner(null);
    playSound('remove');
  };

  if (names.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-xl border-4 border-yellow-100 text-center">
        <Trophy className="w-16 h-16 text-yellow-400 mb-4 opacity-50" />
        <p className="text-xl font-bold text-gray-500">請先加入至少 2 位名單成員</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white p-8 rounded-2xl shadow-xl border-4 border-yellow-100">
      <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-8">
        <div className="relative w-full max-w-[400px] aspect-square">
          {/* Pointer */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-8 h-10 bg-red-500 clip-path-triangle shadow-lg">
             <div className="w-full h-full bg-red-600 rounded-t-lg" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}></div>
          </div>

          {/* Wheel */}
          <motion.div
            animate={controls}
            className="w-full h-full rounded-full border-8 border-yellow-400 shadow-2xl relative overflow-hidden"
            style={{ transformOrigin: 'center' }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {availableNames.map((p, i) => {
                const angle = 360 / availableNames.length;
                const startAngle = i * angle;
                const endAngle = (i + 1) * angle;
                const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);
                const largeArcFlag = angle > 180 ? 1 : 0;

                return (
                  <g key={p.id}>
                    <path
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={COLORS[i % COLORS.length]}
                      stroke="white"
                      strokeWidth="0.5"
                    />
                    <text
                      x="50"
                      y="20"
                      transform={`rotate(${startAngle + angle / 2}, 50, 50)`}
                      fill="white"
                      fontSize={availableNames.length > 10 ? "3" : "4"}
                      fontWeight="bold"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      {p.name}
                    </text>
                  </g>
                );
              })}
            </svg>
            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border-4 border-yellow-400 z-20 flex items-center justify-center shadow-inner">
              <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 bg-yellow-50 p-3 rounded-full border-2 border-yellow-200">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-yellow-700">
              <input
                type="checkbox"
                checked={repeat}
                onChange={(e) => setRepeat(e.target.checked)}
                className="w-5 h-5 accent-yellow-500"
              />
              重複抽取
            </label>
            <div className="w-px h-6 bg-yellow-200"></div>
            <button
              onClick={resetHistory}
              className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-red-500 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> 重置
            </button>
          </div>

          <button
            onClick={spin}
            disabled={isSpinning || availableNames.length === 0}
            className={`px-12 py-4 rounded-full text-2xl font-black text-white shadow-xl transition-all transform hover:scale-105 active:scale-95 ${
              isSpinning || availableNames.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600'
            }`}
          >
            {isSpinning ? '轉動中...' : '開始抽獎！'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-200 h-full flex flex-col">
          <h3 className="text-xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6" /> 抽獎結果
          </h3>
          
          {winner && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-6 rounded-xl shadow-lg border-4 border-yellow-400 text-center mb-6"
            >
              <p className="text-sm text-gray-500 font-bold mb-1">恭喜中獎者</p>
              <h4 className="text-4xl font-black text-orange-600">{winner.name}</h4>
            </motion.div>
          )}

          <div className="flex-1 overflow-y-auto max-h-[400px] space-y-2 pr-2">
            <p className="text-sm font-bold text-gray-500 mb-2">抽取紀錄 ({history.length})</p>
            {history.slice().reverse().map((p, i) => (
              <div key={`${p.id}-${i}`} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-orange-100">
                <span className="font-bold text-gray-700">{p.name}</span>
                <span className="text-xs text-gray-400">#{history.length - i}</span>
              </div>
            ))}
            {history.length === 0 && (
              <p className="text-center text-gray-400 py-10 italic">尚無紀錄</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
