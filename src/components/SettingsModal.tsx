import React, { useState } from 'react';
import { X, Sliders, Volume2, VolumeX, RotateCcw, Check, ShieldCheck } from 'lucide-react';
import { UserCalibration } from '../types';
import { sounds } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  calibration: UserCalibration;
  onSaveCalibration: (cal: UserCalibration) => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  calibration,
  onSaveCalibration,
  onResetAllData,
}) => {
  const [form, setForm] = useState<UserCalibration>(calibration);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playMechanicalClick();
    sounds.enabled = form.soundEnabled;
    onSaveCalibration(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#fcf2eb] rounded-3xl border-2 border-[#dbc2b0] shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#dbc2b0] pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8d4b00] pilot-lamp-amber" />
            <h2 className="font-headline font-bold text-sm text-[#1f1b17] uppercase tracking-wider">
              Metabolic Calibration &amp; Tuning
            </h2>
          </div>
          <button
            onClick={() => {
              sounds.playMechanicalClick();
              onClose();
            }}
            className="w-7 h-7 rounded-lg tactile-button flex items-center justify-center text-[#554336] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3 font-mono-dial text-xs">
          {/* Calorie Datum */}
          <div className="p-3 bg-[#f6ece6] rounded-xl border border-[#dbc2b0]/50 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#1f1b17]">Daily Caloric Datum Target</span>
              <span className="text-[#8d4b00] font-bold">{form.targetCalories} kcal</span>
            </div>
            <input
              type="range"
              min="1200"
              max="4000"
              step="50"
              value={form.targetCalories}
              onChange={(e) =>
                setForm({ ...form, targetCalories: parseInt(e.target.value, 10) })
              }
              className="w-full accent-[#8d4b00] cursor-pointer"
            />
          </div>

          {/* Water Target */}
          <div className="p-3 bg-[#f6ece6] rounded-xl border border-[#dbc2b0]/50 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#1f1b17]">Hydration Vessel Target</span>
              <span className="text-[#006194] font-bold">{form.targetWaterMl} ml</span>
            </div>
            <input
              type="range"
              min="1000"
              max="5000"
              step="100"
              value={form.targetWaterMl}
              onChange={(e) =>
                setForm({ ...form, targetWaterMl: parseInt(e.target.value, 10) })
              }
              className="w-full accent-[#006194] cursor-pointer"
            />
          </div>

          {/* Macro Targets */}
          <div className="p-3 bg-[#f6ece6] rounded-xl border border-[#dbc2b0]/50 space-y-2">
            <span className="font-bold text-[#1f1b17] block">Macronutrient Targets (grams)</span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-[#8d4b00] block mb-0.5 font-bold">PROTEIN</label>
                <input
                  type="number"
                  value={form.targetProtein}
                  onChange={(e) =>
                    setForm({ ...form, targetProtein: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full p-1.5 rounded-lg bg-white border border-[#dbc2b0] text-center font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#006c4a] block mb-0.5 font-bold">CARBS</label>
                <input
                  type="number"
                  value={form.targetCarbs}
                  onChange={(e) =>
                    setForm({ ...form, targetCarbs: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full p-1.5 rounded-lg bg-white border border-[#dbc2b0] text-center font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#006194] block mb-0.5 font-bold">FATS</label>
                <input
                  type="number"
                  value={form.targetFat}
                  onChange={(e) =>
                    setForm({ ...form, targetFat: parseInt(e.target.value, 10) || 0 })
                  }
                  className="w-full p-1.5 rounded-lg bg-white border border-[#dbc2b0] text-center font-bold"
                />
              </div>
            </div>
          </div>

          {/* Sound & Haptics Toggle */}
          <div className="p-3 bg-[#f6ece6] rounded-xl border border-[#dbc2b0]/50 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {form.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#8d4b00]" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#887364]" />
              )}
              <span className="font-bold text-[#1f1b17]">Skeuomorphic Audio Clicks</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const nextVal = !form.soundEnabled;
                sounds.enabled = nextVal;
                if (nextVal) sounds.playMechanicalClick();
                setForm({ ...form, soundEnabled: nextVal });
              }}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                form.soundEnabled ? 'bg-[#8d4b00]' : 'bg-[#dbc2b0]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  form.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all tracked days back to factory demo state?')) {
                  onResetAllData();
                  onClose();
                }
              }}
              className="tactile-button py-2.5 px-3 rounded-xl text-[#ba1a1a] flex items-center gap-1 border border-[#ba1a1a]/40 hover:bg-[#ffdad6]/30 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Factory Reset</span>
            </button>

            <button
              type="submit"
              className="tactile-button-amber flex-1 py-2.5 rounded-xl text-white font-headline text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Check className="w-4 h-4 text-[#ffdcc3]" />
              <span>Save Calibration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
