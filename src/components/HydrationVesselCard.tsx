import React from 'react';
import { Droplets, Coffee, Plus, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HydrationVesselCardProps {
  currentWaterMl: number;
  targetWaterMl: number;
  onAddWater: (amountMl: number, label: string) => void;
  onResetWater?: () => void;
  onOpenWaterDetail?: () => void;
}

export const HydrationVesselCard: React.FC<HydrationVesselCardProps> = ({
  currentWaterMl,
  targetWaterMl,
  onAddWater,
  onResetWater,
  onOpenWaterDetail,
}) => {
  const percentage = Math.min(Math.round((currentWaterMl / (targetWaterMl || 1)) * 100), 100);
  const remainingMl = Math.max(targetWaterMl - currentWaterMl, 0);

  // Height percentage clamped 0 to 100
  const fillHeightPct = Math.min(Math.max((currentWaterMl / (targetWaterMl || 1)) * 100, 4), 100);

  const handleQuickAdd = (amount: number, label: string) => {
    sounds.playWaterPour();
    sounds.triggerHaptic(25);
    onAddWater(amount, label);
  };

  return (
    <section className="glass-card-over rounded-2xl p-5 relative border border-white/80 shadow-md">
      {/* Decorative rivets */}
      <div className="absolute top-2.5 left-2.5 screw-accent opacity-80" />
      <div className="absolute top-2.5 right-2.5 screw-accent opacity-80" />

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#cce5ff]/60 flex items-center justify-center text-[#006194] border border-[#dbc2b0]/50 shadow-inner">
            <Droplets className="w-4 h-4" />
          </div>
          <h2 className="font-headline text-xs font-bold text-[#1f1b17] uppercase tracking-wider">
            Hydration Vessel
          </h2>
        </div>
        <div className="text-right">
          <span className="font-mono-dial text-[16px] font-bold text-[#006194]">
            {currentWaterMl.toLocaleString()}
          </span>
          <span className="font-mono-dial text-[11px] text-[#554336] font-medium">
            {' '}
            / {targetWaterMl.toLocaleString()} ml
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Minimal Vintage Cylinder Gauge */}
        <div className="col-span-4 flex justify-center">
          <div
            onClick={onOpenWaterDetail}
            className="relative w-20 h-44 bg-[#f4ebe4] rounded-2xl p-1.5 shadow-inner border border-[#dbc2b0]/90 flex flex-col justify-end overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#006194]/40 transition-all"
            title="Click to view hydration detail"
          >
            {/* Top metallic collar ring */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-[#e5dad2] to-[#dbc2b0] border-b border-[#a8988d] z-20" />

            {/* Glass specular glare overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/35 via-transparent to-black/10 pointer-events-none z-20" />

            {/* Measurement etched ticks on glass */}
            <div className="absolute inset-y-3 right-1.5 flex flex-col justify-between text-[8px] font-mono-dial text-[#887364] pointer-events-none z-20 font-bold">
              <span>{targetWaterMl}</span>
              <span className="text-[#006194]">{Math.round(targetWaterMl * 0.7)}</span>
              <span>{Math.round(targetWaterMl * 0.4)}</span>
              <span>{Math.round(targetWaterMl * 0.2)}</span>
            </div>

            {/* Translucent fluid meniscus & volume fill */}
            <div
              className="w-full water-shimmer rounded-xl relative transition-all duration-700 ease-out z-10 flex flex-col justify-start overflow-hidden shadow-inner"
              style={{ height: `${fillHeightPct}%` }}
            >
              {/* Meniscus surface shimmer */}
              <div className="h-2.5 w-full bg-[#b8e1ff] rounded-t-full opacity-90 shadow-sm flex-shrink-0 animate-pulse" />
              {/* Subtle bubble effect */}
              <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-white/40 animate-ping" />
            </div>

            {/* Bottom metallic mounting bracket */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-[#e5dad2] to-[#dbc2b0] border-t border-[#a8988d] z-20" />
          </div>
        </div>

        {/* Quick Add Controls */}
        <div className="col-span-8 space-y-2.5">
          {/* Progress pill */}
          <div className="p-2.5 bg-[#f6ece6] rounded-xl border border-[#dbc2b0]/40 flex justify-between items-center shadow-inner">
            <span className="font-mono-dial text-[10px] text-[#554336] font-bold uppercase">
              Progress
            </span>
            <span className="font-mono-dial text-xs font-bold text-[#006194]">
              {percentage}% reached ({remainingMl}ml left)
            </span>
          </div>

          {/* Quick tactile volume buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickAdd(250, 'Standard Cup')}
              className="tactile-button py-2.5 px-3 rounded-xl flex flex-col items-center justify-center border border-[#dbc2b0]/70 hover:text-[#8d4b00] active:translate-y-0.5 transition-all cursor-pointer group"
            >
              <span className="font-headline text-sm font-bold text-[#1f1b17] group-hover:text-[#006194]">
                +250 ml
              </span>
              <span className="font-mono-dial text-[8px] text-[#554336] uppercase tracking-wider font-semibold">
                Standard Cup
              </span>
            </button>

            <button
              onClick={() => handleQuickAdd(500, 'Full Bottle')}
              className="tactile-button py-2.5 px-3 rounded-xl flex flex-col items-center justify-center border border-[#dbc2b0]/70 hover:text-[#8d4b00] active:translate-y-0.5 transition-all cursor-pointer group"
            >
              <span className="font-headline text-sm font-bold text-[#1f1b17] group-hover:text-[#006194]">
                +500 ml
              </span>
              <span className="font-mono-dial text-[8px] text-[#554336] uppercase tracking-wider font-semibold">
                Full Bottle
              </span>
            </button>
          </div>

          {/* Electrolyte infusion button */}
          <button
            onClick={() => handleQuickAdd(350, 'Electrolyte Infusion')}
            className="tactile-button w-full py-2 px-3 rounded-xl flex items-center justify-between border border-[#dbc2b0]/70 hover:text-[#006194] active:translate-y-0.5 transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-2">
              <Coffee className="w-4 h-4 text-[#006194]" />
              <span className="font-body text-xs font-semibold text-[#1f1b17] group-hover:text-[#006194]">
                Electrolyte Infusion
              </span>
            </div>
            <span className="font-mono-dial text-[11px] text-[#006194] font-bold">
              +350ml
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
