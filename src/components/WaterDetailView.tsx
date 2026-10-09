import React, { useState } from 'react';
import {
  Droplets,
  Plus,
  Trash2,
  RotateCcw,
  Coffee,
  Sparkles,
  CupSoda,
  Wine,
  GlassWater,
} from 'lucide-react';
import { WaterEntry } from '../types';
import { sounds } from '../utils/audio';

interface WaterDetailViewProps {
  currentWaterMl: number;
  targetWaterMl: number;
  waterEntries: WaterEntry[];
  onAddWater: (amountMl: number, label: string) => void;
  onDeleteWater: (id: string) => void;
  onResetWater: () => void;
}

export const WaterDetailView: React.FC<WaterDetailViewProps> = ({
  currentWaterMl,
  targetWaterMl,
  waterEntries,
  onAddWater,
  onDeleteWater,
  onResetWater,
}) => {
  const [customMl, setCustomMl] = useState<string>('');
  const percentage = Math.min(Math.round((currentWaterMl / (targetWaterMl || 1)) * 100), 100);
  const remainingMl = Math.max(targetWaterMl - currentWaterMl, 0);

  const presets = [
    { amount: 150, label: 'Espresso / Cup', icon: Coffee },
    { amount: 250, label: 'Standard Glass', icon: GlassWater },
    { amount: 350, label: 'Electrolyte Mug', icon: CupSoda },
    { amount: 500, label: 'Sports Bottle', icon: Droplets },
    { amount: 750, label: 'Thermos Flask', icon: Wine },
    { amount: 1000, label: 'Full Carafe', icon: Droplets },
  ];

  const handleAdd = (amount: number, label: string) => {
    sounds.playWaterPour();
    sounds.triggerHaptic(25);
    onAddWater(amount, label);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customMl, 10);
    if (!isNaN(val) && val > 0) {
      handleAdd(val, 'Custom Measure');
      setCustomMl('');
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Hero Hydration Chamber */}
      <section className="glass-card-over rounded-2xl p-5 border border-white/80 shadow-md relative">
        {/* Screw accents */}
        <div className="absolute top-2.5 left-2.5 screw-accent opacity-80" />
        <div className="absolute top-2.5 right-2.5 screw-accent opacity-80" />

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#cce5ff] flex items-center justify-center text-[#006194] border border-[#dbc2b0]/50 shadow-inner">
              <Droplets className="w-5 h-5 text-[#006194]" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-sm text-[#1f1b17] uppercase tracking-wider">
                Precision Hydration Vessel
              </h2>
              <span className="font-mono-dial text-[10px] text-[#554336] uppercase font-bold tracking-wider">
                Fluid Volume Calibrator
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playMechanicalClick();
              onResetWater();
            }}
            className="tactile-button p-2 rounded-lg text-[#554336] hover:text-[#ba1a1a] cursor-pointer"
            title="Reset Today's Water"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Large Crystal Vessel Cylinder */}
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-5 flex justify-center">
            <div className="relative w-24 h-56 bg-[#f4ebe4] rounded-3xl p-2 shadow-2xl border-2 border-[#dbc2b0] flex flex-col justify-end overflow-hidden">
              {/* Glass specular sheen */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-black/15 pointer-events-none z-20" />

              {/* Etched Glass Graduation Ticks */}
              <div className="absolute inset-y-4 right-2 flex flex-col justify-between text-[8px] font-mono-dial text-[#887364] pointer-events-none z-20 font-bold">
                <span>{targetWaterMl} ml</span>
                <span>{Math.round(targetWaterMl * 0.75)} ml</span>
                <span>{Math.round(targetWaterMl * 0.5)} ml</span>
                <span>{Math.round(targetWaterMl * 0.25)} ml</span>
                <span>0 ml</span>
              </div>

              {/* Liquid Column */}
              <div
                className="w-full water-shimmer rounded-2xl relative transition-all duration-700 ease-out z-10 flex flex-col justify-start overflow-hidden shadow-inner"
                style={{
                  height: `${Math.min(
                    Math.max((currentWaterMl / (targetWaterMl || 1)) * 100, 5),
                    100
                  )}%`,
                }}
              >
                <div className="h-3 w-full bg-[#b8e1ff] rounded-t-full opacity-90 shadow-sm flex-shrink-0" />
                <div className="absolute bottom-4 left-3 w-2 h-2 rounded-full bg-white/40 animate-ping" />
              </div>
            </div>
          </div>

          <div className="col-span-7 space-y-3">
            <div className="p-3 bg-[#f6ece6] rounded-xl border border-[#dbc2b0]/50 shadow-inner">
              <span className="font-mono-dial text-[10px] text-[#554336] font-bold uppercase tracking-wider block">
                Fluid Metric
              </span>
              <div className="flex items-baseline space-x-1 mt-0.5">
                <span className="font-mono-dial text-2xl font-bold text-[#006194]">
                  {currentWaterMl.toLocaleString()}
                </span>
                <span className="font-mono-dial text-xs text-[#554336]">
                  / {targetWaterMl.toLocaleString()} ml
                </span>
              </div>
              <div className="mt-2 h-2 bg-[#e2d8d2] rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#007bb9] to-[#006194] h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            <div className="p-3 bg-[#f6ece6] rounded-xl border border-[#dbc2b0]/50 shadow-inner font-mono-dial text-xs">
              <span className="text-[#554336] block text-[10px] uppercase font-bold">Status</span>
              <span className="font-bold text-[#006c4a] block mt-0.5">
                {percentage >= 100
                  ? '🎯 Target Met! Perfectly Hydrated'
                  : `${percentage}% completed (${remainingMl}ml remaining)`}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Volumetric Dispenser Controls */}
      <section className="bg-[#f0e6e0] rounded-2xl p-4 machined-plate border border-[#dbc2b0]/70 shadow-md space-y-3">
        <h3 className="font-headline font-bold text-xs text-[#1f1b17] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#006194]" />
          Calibrated Fluid Dispensers
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {presets.map((p, idx) => {
            const Icon = p.icon;
            return (
              <button
                key={idx}
                onClick={() => handleAdd(p.amount, p.label)}
                className="tactile-button p-2.5 rounded-xl flex flex-col items-center justify-center border border-[#dbc2b0]/70 hover:text-[#006194] active:translate-y-0.5 transition-all cursor-pointer group"
              >
                <Icon className="w-4 h-4 text-[#006194] mb-1 group-hover:scale-110 transition-transform" />
                <span className="font-headline text-xs font-bold text-[#1f1b17]">
                  +{p.amount} ml
                </span>
                <span className="font-mono-dial text-[8px] text-[#554336] uppercase truncate max-w-full font-semibold">
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom ml form */}
        <form onSubmit={handleAddCustom} className="flex gap-2 pt-1">
          <input
            type="number"
            placeholder="Custom volume (ml)..."
            value={customMl}
            onChange={(e) => setCustomMl(e.target.value)}
            className="flex-1 py-2 px-3 rounded-xl bg-white border border-[#dbc2b0] font-mono-dial text-xs text-[#1f1b17] placeholder:text-[#887364]/60 focus:outline-none focus:ring-1 focus:ring-[#006194]"
          />
          <button
            type="submit"
            className="tactile-button-blue text-white px-4 py-2 rounded-xl font-mono-dial text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Infuse</span>
          </button>
        </form>
      </section>

      {/* Today's Hydration Ledger */}
      <section className="bg-[#fcf2eb] rounded-2xl p-4 border border-[#dbc2b0] shadow-sm space-y-2.5">
        <div className="flex justify-between items-center border-b border-[#dbc2b0]/50 pb-2">
          <span className="font-headline font-bold text-xs text-[#1f1b17] uppercase tracking-wider">
            Hydration Ledger (Today)
          </span>
          <span className="font-mono-dial text-[10px] text-[#554336] font-bold">
            {waterEntries.length} LOGS
          </span>
        </div>

        {waterEntries.length === 0 ? (
          <p className="font-body text-xs text-[#887364] text-center py-4 italic">
            No fluids logged today yet. Dispense a cup above!
          </p>
        ) : (
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {waterEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-2 bg-[#f6ece6] rounded-xl border border-[#dbc2b0]/50 flex justify-between items-center text-xs font-mono-dial shadow-sm"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006194] pilot-lamp-blue" />
                  <span className="font-bold text-[#1f1b17]">{entry.label}</span>
                  <span className="text-[10px] text-[#554336]">({entry.timestamp})</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#006194]">+{entry.amountMl} ml</span>
                  <button
                    onClick={() => {
                      sounds.playMechanicalClick();
                      onDeleteWater(entry.id);
                    }}
                    className="text-[#887364] hover:text-[#ba1a1a] p-1 cursor-pointer"
                    title="Remove Entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
