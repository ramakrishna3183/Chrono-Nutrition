import React from 'react';
import { Gauge, Droplets, Camera, BarChart2 } from 'lucide-react';
import { NavTab } from '../types';
import { sounds } from '../utils/audio';

interface BottomNavBarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onTriggerCamera: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  onTriggerCamera,
}) => {
  const handleNav = (tab: NavTab) => {
    sounds.playMechanicalClick();
    if (tab === 'camera') {
      onTriggerCamera();
    } else {
      onSelectTab(tab);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 bg-[#f6ece6] border-t border-[#dbc2b0] shadow-[0_-4px_16px_rgba(41,37,36,0.1)]">
      <div className="max-w-md mx-auto flex justify-around items-center px-2 py-2">
        {/* Destination 1: Gauge (Dashboard) */}
        <button
          onClick={() => handleNav('gauge')}
          className={`flex flex-col items-center justify-center px-3.5 py-1.5 rounded-xl transition-all duration-75 cursor-pointer ${
            activeTab === 'gauge'
              ? 'bg-[#b15f00] text-white shadow-sm ring-1 ring-[#ffdcc3]/40'
              : 'text-[#554336] hover:text-[#8d4b00]'
          }`}
          title="Caloric Expenditure Gauge"
        >
          <Gauge className="w-5 h-5" />
          <span className="font-mono-dial text-[10px] mt-0.5 font-bold uppercase tracking-wider">
            Gauge
          </span>
        </button>

        {/* Destination 2: Water (Hydration) */}
        <button
          onClick={() => handleNav('water')}
          className={`flex flex-col items-center justify-center px-3.5 py-1.5 rounded-xl transition-all duration-75 cursor-pointer ${
            activeTab === 'water'
              ? 'bg-[#007bb9] text-white shadow-sm ring-1 ring-[#cce5ff]/40'
              : 'text-[#554336] hover:text-[#006194]'
          }`}
          title="Hydration Vessel & Fluids"
        >
          <Droplets className="w-5 h-5" />
          <span className="font-mono-dial text-[10px] mt-0.5 font-bold uppercase tracking-wider">
            Water
          </span>
        </button>

        {/* Destination 3: Camera (AI Optical Scan) */}
        <button
          onClick={() => handleNav('camera')}
          className={`flex flex-col items-center justify-center px-3.5 py-1.5 rounded-xl transition-all duration-75 cursor-pointer ${
            activeTab === 'camera'
              ? 'bg-[#8d4b00] text-white shadow-sm ring-1 ring-[#ffdcc3]/40'
              : 'text-[#554336] hover:text-[#8d4b00]'
          }`}
          title="Optical Meal Scanner"
        >
          <Camera className="w-5 h-5" />
          <span className="font-mono-dial text-[10px] mt-0.5 font-bold uppercase tracking-wider">
            Camera
          </span>
        </button>

        {/* Destination 4: Logs (Weekly Summary & Analytics) */}
        <button
          onClick={() => handleNav('logs')}
          className={`flex flex-col items-center justify-center px-3.5 py-1.5 rounded-xl transition-all duration-75 cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-[#b15f00] text-white shadow-sm ring-1 ring-[#ffdcc3]/40'
              : 'text-[#554336] hover:text-[#8d4b00]'
          }`}
          title="Weekly Summary & AI Vision Ledger"
        >
          <BarChart2 className="w-5 h-5" />
          <span className="font-mono-dial text-[10px] mt-0.5 font-bold uppercase tracking-wider">
            Logs
          </span>
        </button>
      </div>
    </nav>
  );
};
