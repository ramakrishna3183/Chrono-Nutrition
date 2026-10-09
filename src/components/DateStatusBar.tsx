import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { sounds } from '../utils/audio';

interface DateStatusBarProps {
  displayDate: string;
  cycleDay: number;
  canGoNext: boolean;
  onPrevDay: () => void;
  onNextDay: () => void;
  onResetToday: () => void;
  isToday: boolean;
}

export const DateStatusBar: React.FC<DateStatusBarProps> = ({
  displayDate,
  cycleDay,
  canGoNext,
  onPrevDay,
  onNextDay,
  onResetToday,
  isToday,
}) => {
  return (
    <section className="brushed-metal rounded-2xl p-2.5 flex items-center justify-between border border-[#dbc2b0]/70 shadow-sm">
      <button
        onClick={() => {
          sounds.playRatchetTick();
          onPrevDay();
        }}
        aria-label="Previous Day"
        className="tactile-button w-8 h-8 rounded-lg flex items-center justify-center text-[#554336] hover:text-[#8d4b00] active:translate-y-0.5 transition-transform border border-[#dbc2b0]/50 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div
        onClick={() => {
          sounds.playMechanicalClick();
          onResetToday();
        }}
        className="flex items-center space-x-2.5 cursor-pointer hover:opacity-85 transition-opacity"
        title={isToday ? 'Viewing Today' : 'Click to jump to Today'}
      >
        <Calendar className="w-4 h-4 text-[#8d4b00]" />
        <span className="font-headline text-xs font-bold text-[#1f1b17] uppercase tracking-wider">
          {displayDate}
        </span>
        <span className="font-mono-dial text-[10px] px-2 py-0.5 rounded-full bg-[#f0e6e0] text-[#8d4b00] font-bold border border-[#dbc2b0]/60 shadow-inner">
          CYCLE DAY {cycleDay}
        </span>
      </div>

      <button
        onClick={() => {
          if (canGoNext) {
            sounds.playRatchetTick();
            onNextDay();
          }
        }}
        disabled={!canGoNext}
        aria-label="Next Day"
        className={`tactile-button w-8 h-8 rounded-lg flex items-center justify-center border border-[#dbc2b0]/50 transition-transform ${
          canGoNext
            ? 'text-[#554336] hover:text-[#8d4b00] active:translate-y-0.5 cursor-pointer'
            : 'text-[#887364]/40 opacity-40 cursor-not-allowed'
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </section>
  );
};
