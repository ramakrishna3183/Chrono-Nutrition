import React, { useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Droplets,
  PieChart,
  ScanLine,
  CheckCircle2,
  Camera,
  ArrowRight,
  Verified,
  Sparkles,
  Sliders,
  Utensils,
  X,
} from 'lucide-react';
import { DayData, MealEntry } from '../types';
import { sounds } from '../utils/audio';

interface WeeklySummaryViewProps {
  weekDays: DayData[];
  onOpenScanner: () => void;
  onOpenWaterDetail: () => void;
  onUpdateMeal: (meal: MealEntry) => void;
  onDeleteMeal: (mealId: string) => void;
}

export const WeeklySummaryView: React.FC<WeeklySummaryViewProps> = ({
  weekDays,
  onOpenScanner,
  onOpenWaterDetail,
  onUpdateMeal,
  onDeleteMeal,
}) => {
  const [selectedMealForReceipt, setSelectedMealForReceipt] = useState<MealEntry | null>(null);
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null);
  const [weekOffset, setWeekOffset] = useState<number>(0);

  // Compute Weekly totals & averages
  const allMeals = weekDays.flatMap((d) => d.meals);
  const totalWeeklyCalories = allMeals.reduce((sum, m) => sum + m.calories, 0);

  const totalWeeklyWaterMl = weekDays.reduce(
    (sum, d) => sum + d.waterEntries.reduce((wSum, w) => wSum + w.amountMl, 0),
    0
  );
  const dailyAvgWaterL = (totalWeeklyWaterMl / Math.max(weekDays.length, 1) / 1000).toFixed(1);

  // Macro calculation for rotary dial
  const totalProtein = allMeals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = allMeals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFat = allMeals.reduce((sum, m) => sum + m.fat, 0);
  const totalMacroGrams = Math.max(totalProtein + totalCarbs + totalFat, 1);

  const proteinPct = Math.round((totalProtein / totalMacroGrams) * 100);
  const carbsPct = Math.round((totalCarbs / totalMacroGrams) * 100);
  const fatPct = Math.max(100 - proteinPct - carbsPct, 0);

  const handleAdjustSave = () => {
    if (editingMeal) {
      sounds.playMechanicalClick();
      onUpdateMeal(editingMeal);
      setEditingMeal(null);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* SECTION 1: Vintage Chassis Instrument Header & Tactile Week Selector */}
      <section className="bg-[#f0e6e0] rounded-xl p-4 machined-plate relative overflow-hidden border border-[#dbc2b0]/70 shadow-md">
        {/* Decorative corner screws */}
        <div className="absolute top-2.5 left-2.5 screw-accent opacity-75" />
        <div className="absolute top-2.5 right-2.5 screw-accent opacity-75" />

        <div className="flex items-center justify-between mt-1 mb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006c4a] pilot-lamp-green" />
            <h1 className="font-headline font-bold text-sm text-[#1f1b17] uppercase tracking-wider">
              Weekly Audit &amp; Progress
            </h1>
          </div>
          <span className="font-mono-dial px-2 py-0.5 bg-[#342f2b] text-[#f9efe8] rounded font-bold text-[10px] tracking-widest shadow-inner">
            SYNC: ACTIVE
          </span>
        </div>

        {/* Week Switcher with Inset Channel & Physical Toggle Rockers */}
        <div className="recessed-shallow bg-[#e2d8d2] rounded-lg p-1.5 flex items-center justify-between mt-3 border border-[#dbc2b0]/60">
          <button
            onClick={() => {
              sounds.playRatchetTick();
              setWeekOffset((prev) => prev - 1);
            }}
            className="tactile-button px-2.5 py-1.5 rounded flex items-center text-[#554336] hover:text-[#8d4b00] active:translate-y-0.5 transition-transform border border-[#dbc2b0]/70 cursor-pointer"
            title="Previous Week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#8d4b00]" />
              <span className="font-mono-dial text-xs text-[#8d4b00] uppercase font-bold tracking-wider">
                {weekOffset === 0
                  ? 'WEEK 43: OCT 18 – OCT 24'
                  : `WEEK ${43 + weekOffset}: ARCHIVE`}
              </span>
            </div>
            <span className="font-body text-[11px] text-[#554336] opacity-80 font-medium">
              7-Day Chronological Ledger
            </span>
          </div>

          <button
            onClick={() => {
              sounds.playRatchetTick();
              setWeekOffset((prev) => Math.min(prev + 1, 0));
            }}
            disabled={weekOffset >= 0}
            className={`tactile-button px-2.5 py-1.5 rounded flex items-center border border-[#dbc2b0]/70 transition-transform ${
              weekOffset >= 0
                ? 'opacity-40 text-[#887364] cursor-not-allowed'
                : 'text-[#554336] hover:text-[#8d4b00] active:translate-y-0.5 cursor-pointer'
            }`}
            title="Next Week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* SECTION 2: Weekly Calorie Balance VU-Meter / Brass Bar Chart */}
      <section className="bg-[#f0e6e0] rounded-xl p-4 machined-plate relative border border-[#dbc2b0]/70 shadow-md">
        {/* Screw accents */}
        <div className="absolute top-2.5 left-2.5 screw-accent opacity-75" />
        <div className="absolute top-2.5 right-2.5 screw-accent opacity-75" />

        <div className="flex items-center justify-between border-b border-[#dbc2b0]/50 pb-2 mb-3">
          <div>
            <h2 className="font-headline font-bold text-xs text-[#1f1b17] flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#8d4b00]" />
              Calorie Balance Matrix
            </h2>
            <p className="font-body text-[11px] text-[#554336]">
              Daily burn vs 2,200 kcal calibrated datum
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono-dial text-base text-[#8d4b00] font-bold block leading-tight">
              {totalWeeklyCalories.toLocaleString()}
            </span>
            <span className="font-mono-dial text-[10px] text-[#554336] uppercase tracking-wider font-semibold">
              Weekly Total
            </span>
          </div>
        </div>

        {/* VU Meter Chart Chassis in Sunken Well */}
        <div className="recessed-groove bg-[#e2d8d2] rounded-lg p-3 relative pt-6 pb-2 border border-[#dbc2b0]/60">
          {/* Target Datum Line (2,200 kcal) */}
          <div className="absolute left-2 right-2 top-[38%] border-b border-dashed border-[#8d4b00] z-20 flex justify-between items-center pointer-events-none">
            <span className="text-[9px] font-mono-dial bg-[#8d4b00] text-white px-1.5 py-0.5 rounded -translate-y-1/2 uppercase tracking-widest font-bold shadow-sm">
              Datum: 2,200 kcal
            </span>
            <span className="text-[9px] font-mono-dial text-[#8d4b00] font-bold pr-1 -translate-y-1/2 tracking-wider">
              TARGET
            </span>
          </div>

          {/* 7-Day Channels & VU Gauges */}
          <div className="grid grid-cols-7 gap-1.5 h-44 items-end relative z-10">
            {weekDays.map((day, idx) => {
              const dayCals = day.meals.reduce((sum, m) => sum + m.calories, 0);
              const isToday = day.dayLabel === 'TODAY';
              const isUnder = dayCals < 2100;
              const isOver = dayCals > 2300;
              const isOptimal = !isUnder && !isOver;

              // Normalized height percent (target ~2200 is around 75%)
              const heightPct = Math.min(Math.max(Math.round((dayCals / 2700) * 100), 20), 98);

              let lampClass = 'bg-[#006c4a] pilot-lamp-green';
              let barColor = 'bg-[#006c4a]';
              if (isUnder) {
                lampClass = 'bg-[#006194] pilot-lamp-blue';
                barColor = 'bg-[#007bb9]';
              } else if (isOver) {
                lampClass = 'bg-[#8d4b00] pilot-lamp-amber';
                barColor = 'bg-[#b15f00]';
              }

              return (
                <div key={idx} className="flex flex-col items-center h-full justify-end group">
                  <span
                    className={`w-1.5 h-1.5 rounded-full mb-1 ${lampClass} ${
                      isToday ? 'animate-pulse' : ''
                    }`}
                  />
                  <div
                    className={`w-full bg-[#eae1da] rounded-t-sm relative h-36 flex items-end p-0.5 shadow-inner border border-[#dbc2b0]/40 ${
                      isToday ? 'ring-1 ring-[#8d4b00]' : ''
                    }`}
                  >
                    <div
                      className={`w-full ${barColor} rounded-t-sm transition-all duration-700 ease-out relative shadow-sm`}
                      style={{ height: `${heightPct}%` }}
                    >
                      <div className="absolute inset-0 glass-specular pointer-events-none" />
                    </div>
                  </div>
                  <span
                    className={`font-mono-dial text-[10px] mt-1.5 uppercase font-bold ${
                      isToday ? 'text-[#8d4b00] underline' : 'text-[#1f1b17]'
                    }`}
                  >
                    {day.shortDay}
                  </span>
                  <span className="text-[9px] font-mono-dial text-[#554336] mt-0.5 font-bold">
                    {(dayCals / 1000).toFixed(1)}k
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend Pill Rack */}
        <div className="flex items-center justify-around mt-3 text-[10px] font-mono-dial text-[#554336] pt-2 border-t border-[#dbc2b0]/50 font-bold">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006194] pilot-lamp-blue" />
            <span>UNDER (&lt;2.1k)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006c4a] pilot-lamp-green" />
            <span>OPTIMAL (2.2k)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#8d4b00] pilot-lamp-amber" />
            <span>SURPLUS (&gt;2.3k)</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: Analog Hydration Matrix (7 Glass Vials) */}
      <section className="bg-[#f0e6e0] rounded-xl p-4 machined-plate border border-[#dbc2b0]/70 shadow-md">
        <div className="flex items-center justify-between mb-3 border-b border-[#dbc2b0]/50 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#cce5ff]/60 flex items-center justify-center text-[#006194] border border-[#dbc2b0]/50 shadow-inner">
              <Droplets className="w-4 h-4 text-[#006194]" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-xs text-[#1f1b17] uppercase tracking-wide">
                Hydration Matrix
              </h2>
              <p className="font-body text-[11px] text-[#554336]">
                7-day vintage crystal cylinder manifold
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono-dial text-base text-[#006194] font-bold">
              {dailyAvgWaterL}L
            </span>
            <span className="text-[10px] font-mono-dial text-[#554336] block uppercase font-semibold">
              DAILY AVG
            </span>
          </div>
        </div>

        {/* Cylinders Manifold Housing */}
        <div className="recessed-shallow bg-[#f6ece6] rounded-lg p-3 pt-4 pb-3 border border-[#dbc2b0]/50">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, idx) => {
              const dayWaterMl = day.waterEntries.reduce((sum, w) => sum + w.amountMl, 0);
              const target = day.targetWaterMl || 2700;
              const heightPct = Math.min(Math.max(Math.round((dayWaterMl / target) * 95), 10), 100);
              const isToday = day.dayLabel === 'TODAY';

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={`w-full h-24 rounded-full glass-vial p-0.5 relative flex flex-col justify-end overflow-hidden border ${
                      isToday ? 'border-[#006194] ring-1 ring-[#006194]' : 'border-[#dbc2b0]'
                    }`}
                  >
                    {/* Liquid fill */}
                    <div
                      className="w-full vial-liquid rounded-b-full transition-all duration-700 ease-out"
                      style={{ height: `${heightPct}%` }}
                    />
                    {/* Glass specular sheen */}
                    <div className="absolute inset-0 glass-specular pointer-events-none" />
                  </div>
                  <span
                    className={`font-mono-dial text-[11px] font-bold mt-1 uppercase ${
                      isToday ? 'text-[#006194]' : 'text-[#1f1b17]'
                    }`}
                  >
                    {day.shortDay}
                  </span>
                  <span className="text-[9px] font-mono-dial text-[#006194] font-bold">
                    {(dayWaterMl / 1000).toFixed(1)}L
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2.5 px-1">
          <span className="font-body text-xs text-[#554336] flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#006c4a] pilot-lamp-green" />
            Hydro Target: 2.7L / 100% Reached
          </span>
          <button
            onClick={() => {
              sounds.playWaterPour();
              onOpenWaterDetail();
            }}
            className="font-mono-dial text-[11px] text-[#006194] font-bold uppercase hover:underline cursor-pointer"
          >
            LOG FLUIDS +
          </button>
        </div>
      </section>

      {/* SECTION 4: Macro Distribution Rotary Dial & Mechanical Breakdown */}
      <section className="bg-[#f0e6e0] rounded-xl p-4 machined-plate border border-[#dbc2b0]/70 shadow-md">
        <div className="flex items-center justify-between mb-3 border-b border-[#dbc2b0]/50 pb-2">
          <div>
            <h2 className="font-headline font-bold text-xs text-[#1f1b17] flex items-center gap-1.5 uppercase tracking-wide">
              <PieChart className="w-4 h-4 text-[#8d4b00]" />
              Macro Ratio Distribution
            </h2>
            <p className="font-body text-[11px] text-[#554336]">
              Calibrated ratio balance across 7 days
            </p>
          </div>
          <span className="font-mono-dial text-[10px] px-2 py-0.5 bg-[#ffffff] text-[#8d4b00] border border-[#dbc2b0] rounded font-bold shadow-sm uppercase">
            CALIBRATED
          </span>
        </div>

        <div className="grid grid-cols-12 gap-3 items-center">
          {/* Rotary Bezel Dial Display */}
          <div className="col-span-5 flex justify-center py-2">
            <div className="relative w-32 h-32 rounded-full knurled-dial p-2 flex items-center justify-center shadow-lg">
              {/* Inner Sunken Parchment Well */}
              <div className="w-full h-full rounded-full bg-[#fcf2eb] recessed-groove flex flex-col items-center justify-center relative p-2 text-center">
                {/* Conic Macro Color Ring */}
                <div
                  className="absolute inset-1.5 rounded-full border-4 border-transparent"
                  style={{
                    background: `conic-gradient(#8d4b00 0% ${proteinPct}%, #006c4a ${proteinPct}% ${
                      proteinPct + carbsPct
                    }%, #006194 ${proteinPct + carbsPct}% 100%) border-box`,
                    WebkitMask:
                      'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />

                {/* Brass Pin Core */}
                <div className="w-4 h-4 rounded-full bg-[#ffb77d] border border-[#887364] shadow-sm flex items-center justify-center z-10 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8d4b00]" />
                </div>
                <span className="font-mono-dial text-[13px] text-[#1f1b17] font-bold leading-none">
                  100%
                </span>
                <span className="text-[8px] font-mono-dial text-[#554336] uppercase mt-0.5 font-bold tracking-wider">
                  COMPLIANCE
                </span>
              </div>
            </div>
          </div>

          {/* Macro Physical Readout Strips */}
          <div className="col-span-7 space-y-2">
            {/* Protein: 35% */}
            <div className="recessed-shallow bg-[#f6ece6] p-2 rounded-lg border-l-4 border-[#8d4b00] shadow-sm">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono-dial text-[11px] text-[#8d4b00] uppercase font-bold">
                  Protein
                </span>
                <span className="font-mono-dial text-xs font-bold text-[#1f1b17]">
                  {proteinPct}%{' '}
                  <span className="text-[10px] text-[#554336] font-normal">({totalProtein}g)</span>
                </span>
              </div>
              <div className="w-full bg-[#e2d8d2] h-1.5 rounded-full mt-1 overflow-hidden">
                <div className="bg-[#8d4b00] h-full rounded-full" style={{ width: `${proteinPct}%` }} />
              </div>
            </div>

            {/* Carbohydrates: 45% */}
            <div className="recessed-shallow bg-[#f6ece6] p-2 rounded-lg border-l-4 border-[#006c4a] shadow-sm">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono-dial text-[11px] text-[#006c4a] uppercase font-bold">
                  Carbohydrates
                </span>
                <span className="font-mono-dial text-xs font-bold text-[#1f1b17]">
                  {carbsPct}%{' '}
                  <span className="text-[10px] text-[#554336] font-normal">({totalCarbs}g)</span>
                </span>
              </div>
              <div className="w-full bg-[#e2d8d2] h-1.5 rounded-full mt-1 overflow-hidden">
                <div className="bg-[#006c4a] h-full rounded-full" style={{ width: `${carbsPct}%` }} />
              </div>
            </div>

            {/* Lipids / Fat: 20% */}
            <div className="recessed-shallow bg-[#f6ece6] p-2 rounded-lg border-l-4 border-[#006194] shadow-sm">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono-dial text-[11px] text-[#006194] uppercase font-bold">
                  Lipids &amp; Fats
                </span>
                <span className="font-mono-dial text-xs font-bold text-[#1f1b17]">
                  {fatPct}%{' '}
                  <span className="text-[10px] text-[#554336] font-normal">({totalFat}g)</span>
                </span>
              </div>
              <div className="w-full bg-[#e2d8d2] h-1.5 rounded-full mt-1 overflow-hidden">
                <div className="bg-[#006194] h-full rounded-full" style={{ width: `${fatPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: AI Vision Ledger (Perforated Parchment Tickets) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline font-bold text-xs text-[#1f1b17] flex items-center gap-1.5 uppercase tracking-wide">
              <ScanLine className="w-4 h-4 text-[#8d4b00]" />
              AI Vision Ledger
            </h2>
            <p className="font-body text-[11px] text-[#554336]">
              Verified camera scans with neural confidence
            </p>
          </div>
          <span className="font-mono-dial text-[10px] text-[#554336] uppercase font-bold tracking-wider">
            {allMeals.length} ENTRIES TODAY
          </span>
        </div>

        {/* Meal Tickets */}
        {allMeals.map((meal, index) => {
          const isPrime = index === 0 && meal.imageUrl;

          if (isPrime) {
            // First item: Elaborate ticket with image and verify badge
            return (
              <article
                key={meal.id}
                className="bg-[#fcf2eb] rounded-xl border border-[#dbc2b0] shadow-md overflow-hidden relative"
              >
                {/* Parchment Top Strip */}
                <div className="bg-[#eae1da] px-4 py-1.5 border-b border-[#dbc2b0] flex justify-between items-center text-[11px] font-mono-dial text-[#554336]">
                  <span className="font-bold">{meal.scanCode || '#0492-MK'}</span>
                  <div className="flex items-center gap-1 text-[#006c4a] font-bold">
                    <Verified className="w-3.5 h-3.5" />
                    <span>CONFIDENCE: {meal.confidence || 98.4}%</span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex gap-3">
                    {/* Thumbnail with Glass Bezel */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-[#dbc2b0] relative flex-shrink-0 shadow-inner bg-[#292524]">
                      <img
                        className="w-full h-full object-cover"
                        src={
                          meal.imageUrl ||
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'
                        }
                        alt={meal.dishName}
                      />
                      <div className="absolute inset-0 glass-specular pointer-events-none" />
                    </div>

                    {/* Dish Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-headline font-bold text-sm text-[#1f1b17] truncate">
                          {meal.dishName}
                        </h3>
                        <span className="font-mono-dial text-sm text-[#8d4b00] font-bold ml-1">
                          {meal.calories} kcal
                        </span>
                      </div>
                      <p className="font-body text-xs text-[#554336] mt-0.5 line-clamp-1">
                        {meal.description || 'Nutrient-rich balanced meal'}
                      </p>

                      {/* Macro Badges */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="font-mono-dial text-[10px] px-1.5 py-0.5 rounded bg-[#ffdcc3] text-[#2f1500] font-bold">
                          P: {meal.protein}g
                        </span>
                        <span className="font-mono-dial text-[10px] px-1.5 py-0.5 rounded bg-[#85f8c4] text-[#002114] font-bold">
                          C: {meal.carbs}g
                        </span>
                        <span className="font-mono-dial text-[10px] px-1.5 py-0.5 rounded bg-[#cce5ff] text-[#001d31] font-bold">
                          F: {meal.fat}g
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Audit Stamps & Actions */}
                  <div className="pt-2 border-t border-dashed border-[#dbc2b0] flex justify-between items-center text-xs">
                    <span className="font-mono-dial text-[#554336] text-[10px] uppercase">
                      TIMESTAMP: {meal.timestamp} • {meal.mealType}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          sounds.playMechanicalClick();
                          setEditingMeal(meal);
                        }}
                        className="tactile-button px-2.5 py-1 rounded font-mono-dial text-[10px] text-[#554336] hover:text-[#8d4b00] cursor-pointer"
                      >
                        ADJUST
                      </button>
                      <button
                        onClick={() => {
                          sounds.playSuccessChime();
                          setSelectedMealForReceipt(meal);
                        }}
                        className="tactile-button-amber px-2.5 py-1 text-white rounded font-mono-dial text-[10px] font-bold cursor-pointer"
                      >
                        {meal.verified ? 'VERIFIED' : 'CONFIRM'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Perforated edge strip */}
                <div className="h-1.5 w-full bg-[#dbc2b0]/40" />
              </article>
            );
          }

          // Subsequent meal tickets: Clean receipts
          return (
            <article
              key={meal.id}
              className="bg-[#fcf2eb] rounded-xl border border-[#dbc2b0] shadow-sm p-4 space-y-2 relative"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-[#f0e6e0] border border-[#dbc2b0] flex items-center justify-center text-[#8d4b00]">
                    <Utensils className="w-4 h-4 text-[#8d4b00]" />
                  </span>
                  <div>
                    <h3 className="font-headline font-bold text-xs text-[#1f1b17]">
                      {meal.dishName}
                    </h3>
                    <span className="font-mono-dial text-[10px] text-[#554336] uppercase">
                      {meal.timestamp} • {meal.mealType}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono-dial text-sm text-[#8d4b00] font-bold">
                    {meal.calories} kcal
                  </span>
                  <span className="text-[9px] font-mono-dial text-[#006c4a] block font-bold">
                    {meal.confidence || 96}% CONFIDENCE
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-dashed border-[#dbc2b0]">
                <div className="flex gap-1.5">
                  <span className="font-mono-dial text-[10px] px-1.5 py-0.5 rounded bg-[#f0e6e0] text-[#554336] font-semibold">
                    P: {meal.protein}g
                  </span>
                  <span className="font-mono-dial text-[10px] px-1.5 py-0.5 rounded bg-[#f0e6e0] text-[#554336] font-semibold">
                    C: {meal.carbs}g
                  </span>
                  <span className="font-mono-dial text-[10px] px-1.5 py-0.5 rounded bg-[#f0e6e0] text-[#554336] font-semibold">
                    F: {meal.fat}g
                  </span>
                </div>

                <button
                  onClick={() => {
                    sounds.playMechanicalClick();
                    setSelectedMealForReceipt(meal);
                  }}
                  className="font-mono-dial text-[11px] text-[#8d4b00] hover:underline uppercase font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>VIEW RECEIPT</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {/* SECTION 6: Physical Quick Log Action Strip */}
      <section className="bg-[#eae1da] p-4 rounded-xl border border-[#dbc2b0] flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#ffdcc3] flex items-center justify-center text-[#8d4b00] border border-[#dbc2b0] shadow-sm">
            <Camera className="w-5 h-5 text-[#8d4b00]" />
          </div>
          <div>
            <h4 className="font-headline font-bold text-xs text-[#1f1b17] uppercase tracking-wide">
              Snap New Ration
            </h4>
            <p className="font-body text-xs text-[#554336]">
              Instantly calibrate macros via AI
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playMechanicalClick();
            onOpenScanner();
          }}
          className="tactile-button-amber text-white px-4 py-2.5 rounded-xl font-mono-dial text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-md font-bold"
        >
          <span>SCAN MEAL</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* RECEIPT MODAL */}
      {selectedMealForReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="max-w-sm w-full bg-[#fcf2eb] rounded-2xl border-2 border-[#dbc2b0] shadow-2xl p-5 relative space-y-4">
            <button
              onClick={() => setSelectedMealForReceipt(null)}
              className="absolute top-3 right-3 text-[#554336] hover:text-[#1f1b17] p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Header */}
            <div className="text-center border-b border-dashed border-[#dbc2b0] pb-3">
              <span className="font-mono-dial text-[10px] text-[#8d4b00] font-bold tracking-widest uppercase">
                CHRONO NUTRITION METABOLIC DESK
              </span>
              <h3 className="font-headline font-bold text-lg text-[#1f1b17] mt-1">
                {selectedMealForReceipt.dishName}
              </h3>
              <p className="font-mono-dial text-xs text-[#554336]">
                {selectedMealForReceipt.timestamp} • {selectedMealForReceipt.scanCode || '#0492-MK'}
              </p>
            </div>

            {/* Image if available */}
            {selectedMealForReceipt.imageUrl && (
              <div className="h-36 rounded-xl overflow-hidden border border-[#dbc2b0] shadow-inner">
                <img
                  src={selectedMealForReceipt.imageUrl}
                  alt={selectedMealForReceipt.dishName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Description & portion */}
            <p className="font-body text-xs text-[#554336] italic">
              "{selectedMealForReceipt.description}"
            </p>

            {/* Macro Matrix */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-[#f0e6e0] rounded-lg">
                <span className="font-mono-dial text-[9px] text-[#554336] block">ENERGY</span>
                <span className="font-mono-dial text-sm font-bold text-[#8d4b00]">
                  {selectedMealForReceipt.calories}
                </span>
                <span className="text-[9px] text-[#554336]">kcal</span>
              </div>
              <div className="p-2 bg-[#f0e6e0] rounded-lg">
                <span className="font-mono-dial text-[9px] text-[#554336] block">PROTEIN</span>
                <span className="font-mono-dial text-sm font-bold text-[#1f1b17]">
                  {selectedMealForReceipt.protein}g
                </span>
              </div>
              <div className="p-2 bg-[#f0e6e0] rounded-lg">
                <span className="font-mono-dial text-[9px] text-[#554336] block">CARBS</span>
                <span className="font-mono-dial text-sm font-bold text-[#006c4a]">
                  {selectedMealForReceipt.carbs}g
                </span>
              </div>
              <div className="p-2 bg-[#f0e6e0] rounded-lg">
                <span className="font-mono-dial text-[9px] text-[#554336] block">LIPIDS</span>
                <span className="font-mono-dial text-sm font-bold text-[#006194]">
                  {selectedMealForReceipt.fat}g
                </span>
              </div>
            </div>

            {/* Health rating stamp */}
            <div className="p-2.5 bg-[#85f8c4]/20 border border-[#006c4a]/40 rounded-xl flex justify-between items-center text-xs">
              <span className="font-mono-dial font-bold text-[#006c4a]">
                HEALTH EVALUATION:
              </span>
              <span className="font-mono-dial font-bold text-[#006c4a]">
                {selectedMealForReceipt.healthRating || 'A+ PRIME'}
              </span>
            </div>

            {/* Close / Delete actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  sounds.playMechanicalClick();
                  onDeleteMeal(selectedMealForReceipt.id);
                  setSelectedMealForReceipt(null);
                }}
                className="tactile-button py-2 px-3 rounded-xl font-mono-dial text-xs text-[#ba1a1a] border border-[#ba1a1a]/40 hover:bg-[#ffdad6]/40 cursor-pointer"
              >
                Delete Log
              </button>
              <button
                onClick={() => setSelectedMealForReceipt(null)}
                className="tactile-button-amber flex-1 py-2 rounded-xl text-white font-mono-dial text-xs uppercase font-bold cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADJUST / EDIT MEAL MODAL */}
      {editingMeal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-[#fcf2eb] rounded-2xl border-2 border-[#dbc2b0] shadow-2xl p-5 space-y-3">
            <div className="flex justify-between items-center border-b border-[#dbc2b0] pb-2">
              <h3 className="font-headline font-bold text-sm text-[#1f1b17] uppercase">
                Adjust Logged Ration
              </h3>
              <button onClick={() => setEditingMeal(null)} className="cursor-pointer">
                <X className="w-4 h-4 text-[#554336]" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono-dial">
              <div>
                <label className="text-[#554336] block mb-1">Dish Name</label>
                <input
                  type="text"
                  value={editingMeal.dishName}
                  onChange={(e) => setEditingMeal({ ...editingMeal, dishName: e.target.value })}
                  className="w-full p-2 rounded-lg bg-white border border-[#dbc2b0] font-sans text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#554336] block mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={editingMeal.calories}
                    onChange={(e) =>
                      setEditingMeal({ ...editingMeal, calories: Number(e.target.value) })
                    }
                    className="w-full p-2 rounded-lg bg-white border border-[#dbc2b0]"
                  />
                </div>
                <div>
                  <label className="text-[#554336] block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={editingMeal.protein}
                    onChange={(e) =>
                      setEditingMeal({ ...editingMeal, protein: Number(e.target.value) })
                    }
                    className="w-full p-2 rounded-lg bg-white border border-[#dbc2b0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#554336] block mb-1">Carbohydrates (g)</label>
                  <input
                    type="number"
                    value={editingMeal.carbs}
                    onChange={(e) =>
                      setEditingMeal({ ...editingMeal, carbs: Number(e.target.value) })
                    }
                    className="w-full p-2 rounded-lg bg-white border border-[#dbc2b0]"
                  />
                </div>
                <div>
                  <label className="text-[#554336] block mb-1">Fats / Lipids (g)</label>
                  <input
                    type="number"
                    value={editingMeal.fat}
                    onChange={(e) =>
                      setEditingMeal({ ...editingMeal, fat: Number(e.target.value) })
                    }
                    className="w-full p-2 rounded-lg bg-white border border-[#dbc2b0]"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEditingMeal(null)}
                className="tactile-button py-2 px-3 rounded-xl font-mono-dial text-xs text-[#554336] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustSave}
                className="tactile-button-amber flex-1 py-2 rounded-xl text-white font-mono-dial text-xs font-bold uppercase cursor-pointer"
              >
                Save Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
