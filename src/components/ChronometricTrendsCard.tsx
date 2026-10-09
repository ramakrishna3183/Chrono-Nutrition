import React from 'react';
import { ChevronRight, BarChart3 } from 'lucide-react';
import { DayData } from '../types';
import { sounds } from '../utils/audio';

interface ChronometricTrendsCardProps {
  weekDays: DayData[];
  onOpenAudit: () => void;
}

export const ChronometricTrendsCard: React.FC<ChronometricTrendsCardProps> = ({
  weekDays,
  onOpenAudit,
}) => {
  // Calculate day calories
  const dayStats = weekDays.map((d) => {
    const totalCals = d.meals.reduce((sum, m) => sum + m.calories, 0);
    const datum = d.targetCalories || 2200;
    // Normalized height percentage against max 2800 kcal
    const heightPct = Math.min(Math.max(Math.round((totalCals / 2600) * 100), 20), 100);
    return {
      day: d.dayLabel,
      totalCals,
      heightPct,
      isToday: d.dayLabel === 'TODAY',
    };
  });

  const totalWeekCals = dayStats.reduce((sum, d) => sum + d.totalCals, 0);
  const avgCals = Math.round(totalWeekCals / Math.max(dayStats.length, 1));

  return (
    <section className="brushed-metal rounded-2xl p-5 border border-[#dbc2b0]/70 shadow-md relative">
      {/* Decorative corner rivets */}
      <div className="absolute top-2.5 left-2.5 screw-accent opacity-80" />
      <div className="absolute top-2.5 right-2.5 screw-accent opacity-80" />

      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="font-mono-dial text-[11px] text-[#8d4b00] font-bold uppercase tracking-wider block">
            Chronometric Trends
          </span>
          <h3 className="font-headline text-sm font-bold text-[#1f1b17] flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-[#8d4b00]" />
            7-Day Caloric Balance
          </h3>
        </div>

        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#85f8c4]/20 border border-[#006c4a]/30 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#006c4a] pilot-lamp-green animate-pulse" />
          <span className="font-mono-dial text-[10px] text-[#006c4a] font-bold uppercase">
            92% Compliant
          </span>
        </div>
      </div>

      {/* 7-Day Bar Chart Chassis */}
      <div className="p-3 bg-[#f6ece6] rounded-xl border border-[#dbc2b0]/40 recessed-shallow">
        <div className="grid grid-cols-7 gap-2 items-end h-28 pt-2 pb-1">
          {dayStats.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center h-full justify-end group">
              <div
                className={`w-full rounded-t-md transition-all duration-500 relative shadow-sm ${
                  item.isToday
                    ? 'bg-gradient-to-t from-[#006c4a] to-[#82f5c1] ring-1 ring-[#006c4a]'
                    : 'bg-[#8d4b00]/75 hover:bg-[#8d4b00]'
                }`}
                style={{ height: `${item.heightPct}%` }}
                title={`${item.day}: ${item.totalCals.toLocaleString()} kcal`}
              >
                {/* Specular sheen on top of bar */}
                <div className="absolute inset-0 glass-specular pointer-events-none rounded-t-md" />
              </div>

              <span
                className={`font-mono-dial text-[9px] font-bold mt-2 uppercase tracking-tighter ${
                  item.isToday ? 'text-[#006c4a] underline decoration-[#006c4a]' : 'text-[#554336]'
                }`}
              >
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Readout & Direct Audit Link */}
      <div className="mt-3 flex justify-between items-center text-xs">
        <span className="text-[#554336] font-body">
          Weekly Average:{' '}
          <strong className="text-[#1f1b17] font-mono-dial font-bold">
            {avgCals.toLocaleString()} kcal/day
          </strong>
        </span>

        <button
          onClick={() => {
            sounds.playMechanicalClick();
            onOpenAudit();
          }}
          className="text-[#8d4b00] font-mono-dial text-[11px] font-bold flex items-center hover:underline active:translate-x-0.5 transition-transform cursor-pointer"
        >
          <span>DETAILED AUDIT</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>
    </section>
  );
};
