import React from 'react';
import { ScanLine, CheckCircle2, Camera, Sparkles } from 'lucide-react';
import { MealEntry } from '../types';
import { sounds } from '../utils/audio';

interface AIOpticalScanCardProps {
  latestScan: MealEntry;
  onConfirmPlate: (meal: MealEntry) => void;
  onOpenScanner: () => void;
}

export const AIOpticalScanCard: React.FC<AIOpticalScanCardProps> = ({
  latestScan,
  onConfirmPlate,
  onOpenScanner,
}) => {
  return (
    <section className="glass-card-over rounded-2xl p-5 relative border border-white/80 shadow-md">
      {/* Decorative corner rivets */}
      <div className="absolute top-2.5 left-2.5 screw-accent opacity-80" />
      <div className="absolute top-2.5 right-2.5 screw-accent opacity-80" />

      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#ffdcc3]/60 flex items-center justify-center text-[#8d4b00] border border-[#dbc2b0]/50 shadow-inner">
            <ScanLine className="w-4 h-4" />
          </div>
          <span className="font-mono-dial text-[11px] text-[#8d4b00] font-bold uppercase tracking-wider">
            AI Optical Scan
          </span>
        </div>
        <span className="font-mono-dial text-[10px] text-[#006c4a] font-bold px-2 py-0.5 rounded-full bg-[#85f8c4]/30 border border-[#006c4a]/30 shadow-sm flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#006c4a]" />
          {latestScan.confidence}% MATCH
        </span>
      </div>

      {/* Food Plate Visual Frame */}
      <div className="relative rounded-xl overflow-hidden border border-[#dbc2b0]/80 shadow-inner bg-[#292524]">
        <img
          alt={latestScan.dishName}
          className="w-full h-44 object-cover hover:scale-105 transition-transform duration-500"
          src={
            latestScan.imageUrl ||
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
          }
        />
        {/* Optical Glass Specular sheen */}
        <div className="absolute inset-0 glass-specular pointer-events-none" />

        {/* Text overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-3">
          <span className="font-mono-dial text-[9px] text-[#ffdcc3] font-bold tracking-widest uppercase">
            Detected Meal Entry • {latestScan.scanCode || '#0492-MK'}
          </span>
          <h4 className="font-headline text-base font-bold text-white tracking-wide drop-shadow-md">
            {latestScan.dishName}
          </h4>
        </div>
      </div>

      {/* 3 Metric Readout Strips */}
      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        <div className="p-2 bg-[#f6ece6] rounded-xl border border-[#dbc2b0]/40 shadow-inner">
          <span className="font-mono-dial text-[9px] text-[#554336] font-bold block uppercase tracking-wider">
            Energy
          </span>
          <span className="font-mono-dial text-xs font-bold text-[#8d4b00]">
            {latestScan.calories} kcal
          </span>
        </div>

        <div className="p-2 bg-[#f6ece6] rounded-xl border border-[#dbc2b0]/40 shadow-inner">
          <span className="font-mono-dial text-[9px] text-[#554336] font-bold block uppercase tracking-wider">
            Protein
          </span>
          <span className="font-mono-dial text-xs font-bold text-[#1f1b17]">
            {latestScan.protein}g
          </span>
        </div>

        <div className="p-2 bg-[#f6ece6] rounded-xl border border-[#dbc2b0]/40 shadow-inner">
          <span className="font-mono-dial text-[9px] text-[#554336] font-bold block uppercase tracking-wider">
            Health Rating
          </span>
          <span className="font-mono-dial text-xs font-bold text-[#006c4a]">
            {latestScan.healthRating || 'A+ PRIME'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3.5 flex items-center space-x-2">
        <button
          onClick={() => {
            sounds.playSuccessChime();
            sounds.triggerHaptic(30);
            onConfirmPlate(latestScan);
          }}
          className="tactile-button-amber flex-1 py-3 px-4 rounded-xl flex items-center justify-center space-x-2 text-white font-headline text-xs font-bold tracking-wider uppercase active:translate-y-0.5 transition-all cursor-pointer shadow-md"
        >
          <CheckCircle2 className="w-4 h-4 text-[#ffdcc3]" />
          <span>Confirm & Log Plate</span>
        </button>

        <button
          onClick={() => {
            sounds.playMechanicalClick();
            onOpenScanner();
          }}
          aria-label="Scan or Retake Photo"
          className="tactile-button w-12 h-12 rounded-xl flex items-center justify-center text-[#554336] border border-[#dbc2b0]/70 active:translate-y-0.5 transition-all hover:text-[#8d4b00] cursor-pointer shadow-sm"
          title="Open AI Optical Scanner"
        >
          <Camera className="w-5 h-5 text-[#8d4b00]" />
        </button>
      </div>
    </section>
  );
};
