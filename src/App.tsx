/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopAppBar } from './components/TopAppBar';
import { DateStatusBar } from './components/DateStatusBar';
import { CaloricExpenditureGauge } from './components/CaloricExpenditureGauge';
import { HydrationVesselCard } from './components/HydrationVesselCard';
import { AIOpticalScanCard } from './components/AIOpticalScanCard';
import { ChronometricTrendsCard } from './components/ChronometricTrendsCard';
import { WeeklySummaryView } from './components/WeeklySummaryView';
import { WaterDetailView } from './components/WaterDetailView';
import { CameraScanModal } from './components/CameraScanModal';
import { QuickAddModal } from './components/QuickAddModal';
import { SettingsModal } from './components/SettingsModal';
import { BottomNavBar } from './components/BottomNavBar';
import { DayData, MealEntry, NavTab, UserCalibration, WaterEntry } from './types';
import {
  DEFAULT_CALIBRATION,
  INITIAL_MEALS_TODAY,
  INITIAL_WATER_TODAY,
  INITIAL_WEEK_DATA,
} from './utils/mockData';
import { sounds } from './utils/audio';

const STORAGE_KEY_DAYS = 'chrono_nutrition_days_v2';
const STORAGE_KEY_CALIBRATION = 'chrono_nutrition_calibration_v2';

export default function App() {
  // Load state from localStorage or defaults
  const [days, setDays] = useState<DayData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DAYS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_WEEK_DATA;
  });

  const [currentDayIndex, setCurrentDayIndex] = useState<number>(() => {
    return INITIAL_WEEK_DATA.length - 1; // Default to Today
  });

  const [calibration, setCalibration] = useState<UserCalibration>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CALIBRATION);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CALIBRATION;
  });

  const [activeTab, setActiveTab] = useState<NavTab>('gauge');

  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DAYS, JSON.stringify(days));
    } catch {}
  }, [days]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CALIBRATION, JSON.stringify(calibration));
      sounds.enabled = calibration.soundEnabled;
    } catch {}
  }, [calibration]);

  const currentDay = days[currentDayIndex] || days[days.length - 1];

  // Derived current day metrics
  const consumedCalories = currentDay.meals.reduce((sum, m) => sum + m.calories, 0);
  const proteinGrams = currentDay.meals.reduce((sum, m) => sum + m.protein, 0);
  const carbsGrams = currentDay.meals.reduce((sum, m) => sum + m.carbs, 0);
  const fatGrams = currentDay.meals.reduce((sum, m) => sum + m.fat, 0);
  const currentWaterMl = currentDay.waterEntries.reduce((sum, w) => sum + w.amountMl, 0);

  // Latest scanned meal for Hero card
  const latestScannedMeal: MealEntry = currentDay.meals[0] || INITIAL_MEALS_TODAY[0];

  // Handlers for meals
  const handleAddMeal = (newMeal: MealEntry) => {
    setDays((prev) => {
      const updated = [...prev];
      const day = { ...updated[currentDayIndex] };
      day.meals = [newMeal, ...day.meals];
      updated[currentDayIndex] = day;
      return updated;
    });
  };

  const handleUpdateMeal = (updatedMeal: MealEntry) => {
    setDays((prev) => {
      const updated = [...prev];
      const day = { ...updated[currentDayIndex] };
      day.meals = day.meals.map((m) => (m.id === updatedMeal.id ? updatedMeal : m));
      updated[currentDayIndex] = day;
      return updated;
    });
  };

  const handleDeleteMeal = (mealId: string) => {
    setDays((prev) => {
      const updated = [...prev];
      const day = { ...updated[currentDayIndex] };
      day.meals = day.meals.filter((m) => m.id !== mealId);
      updated[currentDayIndex] = day;
      return updated;
    });
  };

  // Handlers for water
  const handleAddWater = (amountMl: number, label: string) => {
    const newEntry: WaterEntry = {
      id: `water-${Date.now()}`,
      amountMl,
      label,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: currentDay.date,
    };

    setDays((prev) => {
      const updated = [...prev];
      const day = { ...updated[currentDayIndex] };
      day.waterEntries = [...day.waterEntries, newEntry];
      updated[currentDayIndex] = day;
      return updated;
    });
  };

  const handleDeleteWater = (waterId: string) => {
    setDays((prev) => {
      const updated = [...prev];
      const day = { ...updated[currentDayIndex] };
      day.waterEntries = day.waterEntries.filter((w) => w.id !== waterId);
      updated[currentDayIndex] = day;
      return updated;
    });
  };

  const handleResetWater = () => {
    setDays((prev) => {
      const updated = [...prev];
      const day = { ...updated[currentDayIndex] };
      day.waterEntries = [];
      updated[currentDayIndex] = day;
      return updated;
    });
  };

  const handleResetAllData = () => {
    setDays(INITIAL_WEEK_DATA);
    setCalibration(DEFAULT_CALIBRATION);
    setCurrentDayIndex(INITIAL_WEEK_DATA.length - 1);
    localStorage.removeItem(STORAGE_KEY_DAYS);
    localStorage.removeItem(STORAGE_KEY_CALIBRATION);
  };

  return (
    <div className="chassis-texture min-h-screen text-[#1f1b17] font-body selection:bg-[#ffdcc3] selection:text-[#2f1500]">
      {/* Top App Bar */}
      <TopAppBar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleView={() => {
          setActiveTab((prev) => (prev === 'logs' ? 'gauge' : 'logs'));
        }}
        activeTab={activeTab}
      />

      {/* Main Content Area */}
      <main className="max-w-md mx-auto px-4 pt-20 pb-28 space-y-4">
        {/* VIEW 1: GAUGE DASHBOARD (Image 1 Mockup) */}
        {activeTab === 'gauge' && (
          <>
            {/* Date & Cycle Bar */}
            <DateStatusBar
              displayDate={currentDay.displayDate}
              cycleDay={currentDay.cycleDay}
              canGoNext={currentDayIndex < days.length - 1}
              onPrevDay={() => setCurrentDayIndex((prev) => Math.max(prev - 1, 0))}
              onNextDay={() =>
                setCurrentDayIndex((prev) => Math.min(prev + 1, days.length - 1))
              }
              onResetToday={() => setCurrentDayIndex(days.length - 1)}
              isToday={currentDayIndex === days.length - 1}
            />

            {/* Caloric Expenditure Gauge Hero */}
            <CaloricExpenditureGauge
              consumedCalories={consumedCalories}
              targetCalories={calibration.targetCalories}
              proteinGrams={proteinGrams}
              targetProtein={calibration.targetProtein}
              carbsGrams={carbsGrams}
              targetCarbs={calibration.targetCarbs}
              fatGrams={fatGrams}
              targetFat={calibration.targetFat}
              onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            />

            {/* Hydration Vessel Card */}
            <HydrationVesselCard
              currentWaterMl={currentWaterMl}
              targetWaterMl={calibration.targetWaterMl}
              onAddWater={handleAddWater}
              onResetWater={handleResetWater}
              onOpenWaterDetail={() => setActiveTab('water')}
            />

            {/* AI Optical Meal Scan Card */}
            <AIOpticalScanCard
              latestScan={latestScannedMeal}
              onConfirmPlate={(meal) => {
                // If not already in day's meals, add it
                if (!currentDay.meals.some((m) => m.id === meal.id)) {
                  handleAddMeal(meal);
                }
              }}
              onOpenScanner={() => setIsScannerOpen(true)}
            />

            {/* 7-Day Chronometric Trends Card */}
            <ChronometricTrendsCard
              weekDays={days}
              onOpenAudit={() => setActiveTab('logs')}
            />
          </>
        )}

        {/* VIEW 2: WATER DETAIL VIEW */}
        {activeTab === 'water' && (
          <>
            <DateStatusBar
              displayDate={currentDay.displayDate}
              cycleDay={currentDay.cycleDay}
              canGoNext={currentDayIndex < days.length - 1}
              onPrevDay={() => setCurrentDayIndex((prev) => Math.max(prev - 1, 0))}
              onNextDay={() =>
                setCurrentDayIndex((prev) => Math.min(prev + 1, days.length - 1))
              }
              onResetToday={() => setCurrentDayIndex(days.length - 1)}
              isToday={currentDayIndex === days.length - 1}
            />

            <WaterDetailView
              currentWaterMl={currentWaterMl}
              targetWaterMl={calibration.targetWaterMl}
              waterEntries={currentDay.waterEntries}
              onAddWater={handleAddWater}
              onDeleteWater={handleDeleteWater}
              onResetWater={handleResetWater}
            />
          </>
        )}

        {/* VIEW 3: WEEKLY SUMMARY & ANALYTICS (Image 3 Mockup) */}
        {activeTab === 'logs' && (
          <WeeklySummaryView
            weekDays={days}
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenWaterDetail={() => setActiveTab('water')}
            onUpdateMeal={handleUpdateMeal}
            onDeleteMeal={handleDeleteMeal}
          />
        )}
      </main>

      {/* MODALS */}
      <CameraScanModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onLogMeal={handleAddMeal}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddMeal={handleAddMeal}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        calibration={calibration}
        onSaveCalibration={setCalibration}
        onResetAllData={handleResetAllData}
      />

      {/* Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onTriggerCamera={() => setIsScannerOpen(true)}
      />
    </div>
  );
}
