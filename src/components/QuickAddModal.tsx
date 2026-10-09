import React, { useState } from 'react';
import { X, Plus, Utensils, Sparkles } from 'lucide-react';
import { MealEntry, MealType } from '../types';
import { sounds } from '../utils/audio';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeal: (meal: MealEntry) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, onAddMeal }) => {
  const [dishName, setDishName] = useState('');
  const [calories, setCalories] = useState('450');
  const [protein, setProtein] = useState('25');
  const [carbs, setCarbs] = useState('50');
  const [fat, setFat] = useState('15');
  const [mealType, setMealType] = useState<MealType>('lunch');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMeal: MealEntry = {
      id: `meal-${Date.now()}`,
      dishName: dishName.trim(),
      calories: parseInt(calories, 10) || 0,
      protein: parseInt(protein, 10) || 0,
      carbs: parseInt(carbs, 10) || 0,
      fat: parseInt(fat, 10) || 0,
      fiber: 4,
      healthRating: 'A BALANCED',
      confidence: 99,
      description: 'Manually calibrated desk entry',
      timestamp: timeStr,
      mealType,
      verified: true,
      scanCode: `#049${Math.floor(Math.random() * 90) + 10}-MK`,
      date: now.toISOString().split('T')[0],
    };

    sounds.playSuccessChime();
    onAddMeal(newMeal);
    onClose();
    setDishName('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#fcf2eb] rounded-3xl border-2 border-[#dbc2b0] shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#dbc2b0] pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8d4b00] pilot-lamp-amber" />
            <h2 className="font-headline font-bold text-sm text-[#1f1b17] uppercase tracking-wider">
              Manual Plate &amp; Calorie Entry
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

        <form onSubmit={handleSubmit} className="space-y-3 font-mono-dial text-xs">
          <div>
            <label className="text-[#554336] block mb-1 font-bold">Ration Title / Dish Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Turkey Sourdough Melt, Protein Smoothie..."
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-[#dbc2b0] font-sans text-xs text-[#1f1b17] focus:outline-none focus:ring-1 focus:ring-[#8d4b00]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[#554336] block mb-1 font-bold">Total Energy (kcal)</label>
              <input
                type="number"
                required
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full p-2 rounded-xl bg-white border border-[#dbc2b0] text-[#8d4b00] font-bold"
              />
            </div>
            <div>
              <label className="text-[#554336] block mb-1 font-bold">Protein (g)</label>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full p-2 rounded-xl bg-white border border-[#dbc2b0] text-[#1f1b17]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[#554336] block mb-1 font-bold">Carbohydrates (g)</label>
              <input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full p-2 rounded-xl bg-white border border-[#dbc2b0] text-[#006c4a]"
              />
            </div>
            <div>
              <label className="text-[#554336] block mb-1 font-bold">Healthy Fats (g)</label>
              <input
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="w-full p-2 rounded-xl bg-white border border-[#dbc2b0] text-[#006194]"
              />
            </div>
          </div>

          {/* Meal Type */}
          <div>
            <label className="text-[#554336] block mb-1.5 font-bold">Ration Category</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => {
                    sounds.playRatchetTick();
                    setMealType(t);
                  }}
                  className={`py-1.5 rounded-lg uppercase font-bold text-[10px] transition-all cursor-pointer ${
                    mealType === t
                      ? 'bg-[#8d4b00] text-white shadow-sm'
                      : 'bg-[#f0e6e0] text-[#554336] hover:bg-[#eae1da]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="tactile-button py-2.5 px-3 rounded-xl text-[#554336] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="tactile-button-amber flex-1 py-2.5 rounded-xl text-white font-headline text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4 text-[#ffdcc3]" />
              <span>Log into Daily Ledger</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
