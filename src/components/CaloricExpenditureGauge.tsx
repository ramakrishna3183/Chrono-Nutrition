import React from 'react';
import { Gauge, Plus, Flame } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CaloricExpenditureGaugeProps {
  consumedCalories: number;
  targetCalories: number;
  proteinGrams: number;
  targetProtein: number;
  carbsGrams: number;
  targetCarbs: number;
  fatGrams: number;
  targetFat: number;
  onOpenQuickAdd: () => void;
}

export const CaloricExpenditureGauge: React.FC<CaloricExpenditureGaugeProps> = ({
  consumedCalories,
  targetCalories,
  proteinGrams,
  targetProtein,
  carbsGrams,
  targetCarbs,
  fatGrams,
  targetFat,
  onOpenQuickAdd,
}) => {
  // Percentage calculations
  const rawRatio = targetCalories > 0 ? consumedCalories / targetCalories : 0;
  const clampedRatio = Math.min(Math.max(rawRatio, 0), 1);
  const remainingCalories = Math.max(targetCalories - consumedCalories, 0);
  const isOver = consumedCalories > targetCalories;

  // Arc math: 2 * Math.PI * 80 = 502.65
  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - clampedRatio * circumference;

  const proteinPct = Math.min(Math.round((proteinGrams / (targetProtein || 1)) * 100), 100);
  const carbsPct = Math.min(Math.round((carbsGrams / (targetCarbs || 1)) * 100), 100);
  const fatPct = Math.min(Math.round((fatGrams / (targetFat || 1)) * 100), 100);

  // Status status pill
  let statusText = 'ON TARGET';
  let statusColor = 'text-[#006c4a] border-[#006c4a]/30 bg-[#85f8c4]/25';
  let dotColor = 'bg-[#006c4a]';

  if (isOver) {
    statusText = 'SURPLUS';
    statusColor = 'text-[#b15f00] border-[#b15f00]/30 bg-[#ffdcc3]/40';
    dotColor = 'bg-[#b15f00]';
  } else if (rawRatio < 0.6) {
    statusText = 'BUILDING';
    statusColor = 'text-[#006194] border-[#006194]/30 bg-[#cce5ff]/35';
    dotColor = 'bg-[#006194]';
  }

  return (
    <section className="glass-card-over rounded-2xl p-5 relative border border-white/80 shadow-md">
      {/* Decorative corner rivets */}
      <div className="absolute top-2.5 left-2.5 screw-accent opacity-80" />
      <div className="absolute top-2.5 right-2.5 screw-accent opacity-80" />

      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#ffdcc3]/60 flex items-center justify-center text-[#8d4b00] border border-[#dbc2b0]/50 shadow-inner">
            <Gauge className="w-4 h-4" />
          </div>
          <span className="font-mono-dial text-[11px] tracking-widest text-[#1f1b17] font-bold uppercase">
            Caloric Expenditure
          </span>
        </div>

        <span
          className={`font-mono-dial text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 shadow-sm ${statusColor}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
          {statusText}
        </span>
      </div>

      {/* Circular Gauge Dial & Readout */}
      <div className="relative w-56 h-56 mx-auto my-1 flex items-center justify-center">
        {/* Background dial rim with drop shadow */}
        <div className="absolute inset-2 rounded-full brushed-metal border border-[#dbc2b0]/60 shadow-md" />
        <div className="absolute inset-5 rounded-full bg-[#fcf2eb] recessed-groove" />

        <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 200 200">
          {/* Subtle tick graduation notches around the circle */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#f0e6e0"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Energy Arc */}
          <circle
            className="transition-all duration-1000 ease-out"
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#8d4b00"
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Gauge Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-20 pointer-events-none">
          <span className="font-mono-dial text-[10px] text-[#554336] font-bold uppercase tracking-widest mb-1">
            Energy Consumed
          </span>

          <div className="flex items-baseline justify-center space-x-1">
            <span className="font-mono-dial text-[30px] font-bold text-[#1f1b17] leading-none tracking-tight">
              {consumedCalories.toLocaleString()}
            </span>
            <span className="font-mono-dial text-[12px] text-[#554336] font-medium">
              / {targetCalories.toLocaleString()}
            </span>
          </div>

          <span className="font-mono-dial text-[11px] text-[#554336] font-semibold mt-0.5">
            kcal
          </span>

          {/* Calorie Left Badge */}
          <div className="mt-2.5 px-3 py-1 rounded-full bg-[#f6ece6] border border-[#dbc2b0]/70 flex items-center space-x-1.5 shadow-inner">
            <span
              className={`w-2 h-2 rounded-full ${
                isOver ? 'bg-[#ba1a1a]' : 'bg-[#006c4a]'
              }`}
            />
            <span
              className={`font-mono-dial text-[10px] font-bold uppercase tracking-wider ${
                isOver ? 'text-[#ba1a1a]' : 'text-[#006c4a]'
              }`}
            >
              {isOver
                ? `${(consumedCalories - targetCalories).toLocaleString()} kcal over`
                : `${remainingCalories.toLocaleString()} kcal left`}
            </span>
          </div>
        </div>
      </div>

      {/* Macro Breakdown Rows */}
      <div className="mt-4 pt-3.5 border-t border-[#dbc2b0]/50 space-y-2.5">
        {/* Protein */}
        <div className="p-2.5 bg-[#f6ece6] rounded-xl border border-[#dbc2b0]/40 shadow-sm">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#8d4b00] pilot-lamp-amber" />
              <span className="font-mono-dial text-[11px] font-bold text-[#1f1b17] uppercase">
                Protein
              </span>
            </div>
            <div className="font-mono-dial text-[12px]">
              <span className="font-bold text-[#8d4b00]">{proteinGrams}g</span>{' '}
              <span className="text-[#887364] font-normal">
                / {targetProtein}g ({proteinPct}%)
              </span>
            </div>
          </div>
          <div className="h-2 bg-[#f0e6e0] rounded-full overflow-hidden recessed-shallow p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#8d4b00] to-[#b15f00] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${proteinPct}%` }}
            />
          </div>
        </div>

        {/* Carbohydrates */}
        <div className="p-2.5 bg-[#f6ece6] rounded-xl border border-[#dbc2b0]/40 shadow-sm">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#006194] pilot-lamp-blue" />
              <span className="font-mono-dial text-[11px] font-bold text-[#1f1b17] uppercase">
                Carbohydrates
              </span>
            </div>
            <div className="font-mono-dial text-[12px]">
              <span className="font-bold text-[#006194]">{carbsGrams}g</span>{' '}
              <span className="text-[#887364] font-normal">
                / {targetCarbs}g ({carbsPct}%)
              </span>
            </div>
          </div>
          <div className="h-2 bg-[#f0e6e0] rounded-full overflow-hidden recessed-shallow p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#007bb9] to-[#006194] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${carbsPct}%` }}
            />
          </div>
        </div>

        {/* Healthy Fats */}
        <div className="p-2.5 bg-[#f6ece6] rounded-xl border border-[#dbc2b0]/40 shadow-sm">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#006c4a] pilot-lamp-green" />
              <span className="font-mono-dial text-[11px] font-bold text-[#1f1b17] uppercase">
                Healthy Fats
              </span>
            </div>
            <div className="font-mono-dial text-[12px]">
              <span className="font-bold text-[#006c4a]">{fatGrams}g</span>{' '}
              <span className="text-[#887364] font-normal">
                / {targetFat}g ({fatPct}%)
              </span>
            </div>
          </div>
          <div className="h-2 bg-[#f0e6e0] rounded-full overflow-hidden recessed-shallow p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#006c4a] to-[#82f5c1] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${fatPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Add Button */}
      <div className="mt-3 flex justify-end">
        <button
          onClick={() => {
            sounds.playMechanicalClick();
            onOpenQuickAdd();
          }}
          className="tactile-button py-1.5 px-3 rounded-lg flex items-center space-x-1.5 text-xs font-mono-dial font-bold text-[#8d4b00] border border-[#dbc2b0]/70 cursor-pointer hover:bg-[#ffdcc3]/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Manual Entry / Quick Add</span>
        </button>
      </div>
    </section>
  );
};
