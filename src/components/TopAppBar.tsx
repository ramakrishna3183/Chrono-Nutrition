import React from 'react';
import { Sliders, History } from 'lucide-react';
import { sounds } from '../utils/audio';

interface TopAppBarProps {
  onOpenSettings: () => void;
  onToggleView: () => void;
  activeTab: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ onOpenSettings, onToggleView, activeTab }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#f0e6e0]/95 backdrop-blur-md border-b border-[#dbc2b0] shadow-sm">
      <div className="max-w-md mx-auto h-16 px-4 flex justify-between items-center">
        {/* Left: Calibration / Tune Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              sounds.playMechanicalClick();
              onOpenSettings();
            }}
            aria-label="Settings and Calibration"
            className="tactile-button w-10 h-10 rounded-xl flex items-center justify-center text-[#554336] hover:text-[#8d4b00] active:translate-y-0.5 transition-all border border-[#dbc2b0]/60 cursor-pointer"
            title="Calibrate Targets & Vitals"
          >
            <Sliders className="w-5 h-5 text-[#8d4b00]" />
          </button>

          <div>
            <div className="font-headline font-bold text-sm tracking-wider uppercase text-[#8d4b00] leading-tight">
              Chrono Nutrition
            </div>
            <div className="font-mono-dial text-[10px] text-[#554336] tracking-wider uppercase opacity-75 font-semibold">
              {activeTab === 'logs' ? 'MK-IV MECHANICAL SUITE' : 'Precision Metabolic Desk'}
            </div>
          </div>
        </div>

        {/* Right: History Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              sounds.playMechanicalClick();
              onToggleView();
            }}
            aria-label="History Logs"
            className={`tactile-button w-10 h-10 rounded-xl flex items-center justify-center active:translate-y-0.5 transition-all border border-[#dbc2b0]/60 cursor-pointer ${
              activeTab === 'logs' ? 'bg-[#ffdcc3] text-[#8d4b00] ring-1 ring-[#8d4b00]' : 'text-[#554336] hover:text-[#8d4b00]'
            }`}
            title="Toggle Weekly Ledger & AI Scans"
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
