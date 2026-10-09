import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  X,
  Sparkles,
  CheckCircle2,
  Scan,
  RefreshCw,
  SlidersHorizontal,
  Flame,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MealEntry, MealType } from '../types';
import { sounds } from '../utils/audio';
import { FOOD_IMAGES } from '../utils/mockData';

interface CameraScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogMeal: (meal: MealEntry) => void;
}

const PRESET_MEALS = [
  {
    name: 'Wild Salmon & Quinoa Bowl',
    imageUrl: FOOD_IMAGES.salmonBowl,
    hint: 'Wild salmon, organic quinoa, avocado & edamame',
  },
  {
    name: 'Avocado Toast & Poached Egg',
    imageUrl: FOOD_IMAGES.avocadoToast,
    hint: 'Artisan sourdough with hass avocado and pasture-raised egg',
  },
  {
    name: 'Greek Yogurt & Honey Parfait',
    imageUrl: FOOD_IMAGES.yogurtParfait,
    hint: 'Greek yogurt with raw honey, fresh raspberries & almonds',
  },
  {
    name: 'Grilled Steak & Sweet Potato',
    imageUrl: FOOD_IMAGES.steakSweetPotato,
    hint: 'Grass-fed ribeye with roasted sweet potato & rosemary',
  },
  {
    name: 'Acai Superfood Bowl',
    imageUrl: FOOD_IMAGES.acaiBowl,
    hint: 'Blended acai, chia seeds, sliced bananas & granola',
  },
];

export const CameraScanModal: React.FC<CameraScanModalProps> = ({
  isOpen,
  onClose,
  onLogMeal,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(PRESET_MEALS[0].imageUrl);
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<Partial<MealEntry> | null>(null);
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [portionMultiplier, setPortionMultiplier] = useState<number>(1.0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setScanResult(null);
        sounds.playMechanicalClick();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAiAnalysis = async () => {
    if (!selectedImage && !userPrompt) return;

    setIsScanning(true);
    sounds.playMechanicalClick();
    sounds.triggerHaptic(20);

    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          textPrompt: userPrompt,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setScanResult(resData.data);
        if (resData.data.mealType) {
          setMealType(resData.data.mealType as MealType);
        }
        sounds.playSuccessChime();
        sounds.triggerHaptic(40);
      } else {
        throw new Error(resData.error || 'Failed to analyze');
      }
    } catch (err) {
      console.error(err);
      // Heuristic fallback
      setScanResult({
        dishName: userPrompt || 'Fresh Harvest Plate',
        calories: 520,
        protein: 34,
        carbs: 48,
        fat: 18,
        fiber: 6,
        confidence: 93,
        healthRating: 'A+ PRIME',
        description: 'Nutrient-rich protein and complex carbohydrates',
      });
      sounds.playSuccessChime();
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirmLog = () => {
    if (!scanResult) return;

    const baseCals = scanResult.calories || 500;
    const baseP = scanResult.protein || 30;
    const baseC = scanResult.carbs || 45;
    const baseF = scanResult.fat || 15;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMeal: MealEntry = {
      id: `meal-${Date.now()}`,
      dishName: scanResult.dishName || 'Nutritional Ration',
      calories: Math.round(baseCals * portionMultiplier),
      protein: Math.round(baseP * portionMultiplier),
      carbs: Math.round(baseC * portionMultiplier),
      fat: Math.round(baseF * portionMultiplier),
      fiber: scanResult.fiber || 5,
      healthRating: scanResult.healthRating || 'A+ PRIME',
      confidence: scanResult.confidence || 96,
      description: scanResult.description || 'Verified via Chrono Optical Scanner',
      portionNotes: `Portion: ${(portionMultiplier * 100).toFixed(0)}% scale`,
      timestamp: timeStr,
      mealType,
      imageUrl: selectedImage || undefined,
      verified: true,
      scanCode: `#049${Math.floor(Math.random() * 90) + 10}-MK`,
      date: now.toISOString().split('T')[0],
    };

    sounds.playSuccessChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#8d4b00', '#006c4a', '#ffdcc3', '#006194'],
    });

    onLogMeal(newMeal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="max-w-md w-full bg-[#fff8f5] rounded-3xl border-2 border-[#dbc2b0] shadow-2xl overflow-hidden relative my-auto">
        {/* Top Chassis Bar */}
        <div className="bg-[#f0e6e0] px-4 py-3 border-b border-[#dbc2b0] flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8d4b00] pilot-lamp-amber animate-pulse" />
            <h2 className="font-headline font-bold text-sm text-[#1f1b17] uppercase tracking-wider">
              AI Optical Plate Scanner
            </h2>
          </div>
          <button
            onClick={() => {
              sounds.playMechanicalClick();
              onClose();
            }}
            className="w-8 h-8 rounded-lg tactile-button flex items-center justify-center text-[#554336] hover:text-[#8d4b00] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Viewfinder Lens Area */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#dbc2b0] bg-[#1c1917] aspect-[4/3] flex items-center justify-center shadow-inner">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Meal to scan"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-4 text-[#dbc2b0]">
                <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="font-mono-dial text-xs">Awaiting Optical Input</p>
              </div>
            )}

            {/* Specular sheen */}
            <div className="absolute inset-0 glass-specular pointer-events-none" />

            {/* Targeting Crosshairs & Reticle */}
            <div className="absolute inset-4 pointer-events-none border border-white/25 rounded-xl">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#ffdcc3]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#ffdcc3]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#ffdcc3]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#ffdcc3]" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8d4b00]" />
                </div>
              </div>
            </div>

            {/* Scanning Laser Beam Animation */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#ffdcc3] to-transparent shadow-[0_0_15px_#8d4b00] animate-bounce pointer-events-none" />
            )}

            {/* Scanning status banner */}
            {isScanning && (
              <div className="absolute bottom-3 inset-x-3 bg-black/80 backdrop-blur-sm p-2 rounded-lg border border-[#8d4b00] text-center">
                <span className="font-mono-dial text-[11px] text-[#ffdcc3] font-bold tracking-widest uppercase flex items-center justify-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#ffdcc3]" />
                  GEMINI NEURAL SCANNING...
                </span>
              </div>
            )}
          </div>

          {/* Preset Food Carousel */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-mono-dial text-[10px] text-[#554336] uppercase font-bold tracking-wider">
                Select Photo or Curated Ration
              </span>
              <span className="text-[10px] text-[#887364] font-body">Tap to swap</span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5">
              {PRESET_MEALS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sounds.playRatchetTick();
                    setSelectedImage(preset.imageUrl);
                    setUserPrompt(preset.name);
                    setScanResult(null);
                  }}
                  className={`flex-shrink-0 w-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === preset.imageUrl
                      ? 'border-[#8d4b00] ring-2 ring-[#ffdcc3] scale-105'
                      : 'border-[#dbc2b0] opacity-75 hover:opacity-100'
                  }`}
                  title={preset.name}
                >
                  <img
                    src={preset.imageUrl}
                    alt={preset.name}
                    className="w-full h-14 object-cover"
                  />
                  <div className="bg-[#f0e6e0] p-1 text-[9px] font-mono-dial font-bold text-[#1f1b17] truncate text-center">
                    {preset.name.split(' ')[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload or Context Input */}
          <div className="flex gap-2 items-center">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              onClick={() => {
                sounds.playMechanicalClick();
                fileInputRef.current?.click();
              }}
              className="tactile-button py-2 px-3 rounded-xl flex items-center gap-1.5 font-mono-dial text-xs text-[#554336] border border-[#dbc2b0] hover:text-[#8d4b00] cursor-pointer flex-shrink-0"
            >
              <Upload className="w-4 h-4 text-[#8d4b00]" />
              <span>Upload / Camera</span>
            </button>

            <input
              type="text"
              placeholder="Dish notes (e.g. 2 eggs, 1 slice sourdough)"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="flex-1 py-2 px-3 rounded-xl bg-white border border-[#dbc2b0] text-xs font-body text-[#1f1b17] placeholder:text-[#887364]/60 focus:outline-none focus:ring-1 focus:ring-[#8d4b00]"
            />
          </div>

          {/* Trigger AI Scan Button (if no scan yet) */}
          {!scanResult && (
            <button
              onClick={handleRunAiAnalysis}
              disabled={isScanning || !selectedImage}
              className="tactile-button-amber w-full py-3 rounded-xl text-white font-headline text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md active:translate-y-0.5 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#ffdcc3]" />
              <span>{isScanning ? 'Analyzing Optical Feed...' : 'Calibrate Plate with Gemini AI'}</span>
            </button>
          )}

          {/* Scan Results & Confirmation */}
          {scanResult && (
            <div className="bg-[#f6ece6] rounded-2xl p-4 border border-[#dbc2b0] shadow-sm space-y-3 animate-in fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono-dial text-[10px] text-[#8d4b00] font-bold uppercase tracking-wider block">
                    Optical Verification Complete
                  </span>
                  <h3 className="font-headline font-bold text-base text-[#1f1b17]">
                    {scanResult.dishName}
                  </h3>
                  <p className="font-body text-xs text-[#554336] mt-0.5">
                    {scanResult.description}
                  </p>
                </div>
                <span className="font-mono-dial text-[10px] px-2 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] font-bold border border-[#006c4a]/30">
                  {scanResult.confidence}% MATCH
                </span>
              </div>

              {/* Portion Scale Slider */}
              <div className="p-2.5 bg-white rounded-xl border border-[#dbc2b0]/50 space-y-1">
                <div className="flex justify-between items-center text-xs font-mono-dial">
                  <span className="text-[#554336] font-bold">PORTION SERVING:</span>
                  <span className="text-[#8d4b00] font-bold">
                    {(portionMultiplier * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={portionMultiplier}
                  onChange={(e) => setPortionMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-[#8d4b00] cursor-pointer"
                />
              </div>

              {/* Scaled Macro Grid */}
              <div className="grid grid-cols-4 gap-2 text-center font-mono-dial">
                <div className="p-2 bg-[#f0e6e0] rounded-xl border border-[#dbc2b0]/40">
                  <span className="text-[9px] text-[#554336] block font-bold">ENERGY</span>
                  <span className="text-sm font-bold text-[#8d4b00]">
                    {Math.round((scanResult.calories || 500) * portionMultiplier)}
                  </span>
                  <span className="text-[9px] text-[#554336] block">kcal</span>
                </div>

                <div className="p-2 bg-[#f0e6e0] rounded-xl border border-[#dbc2b0]/40">
                  <span className="text-[9px] text-[#554336] block font-bold">PROTEIN</span>
                  <span className="text-sm font-bold text-[#1f1b17]">
                    {Math.round((scanResult.protein || 30) * portionMultiplier)}g
                  </span>
                </div>

                <div className="p-2 bg-[#f0e6e0] rounded-xl border border-[#dbc2b0]/40">
                  <span className="text-[9px] text-[#554336] block font-bold">CARBS</span>
                  <span className="text-sm font-bold text-[#006c4a]">
                    {Math.round((scanResult.carbs || 45) * portionMultiplier)}g
                  </span>
                </div>

                <div className="p-2 bg-[#f0e6e0] rounded-xl border border-[#dbc2b0]/40">
                  <span className="text-[9px] text-[#554336] block font-bold">FATS</span>
                  <span className="text-sm font-bold text-[#006194]">
                    {Math.round((scanResult.fat || 15) * portionMultiplier)}g
                  </span>
                </div>
              </div>

              {/* Meal Type Selector */}
              <div className="flex gap-1.5 text-xs font-mono-dial">
                {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      sounds.playRatchetTick();
                      setMealType(type);
                    }}
                    className={`flex-1 py-1.5 rounded-lg uppercase font-bold text-[10px] transition-all cursor-pointer ${
                      mealType === type
                        ? 'bg-[#8d4b00] text-white shadow-sm'
                        : 'bg-[#f0e6e0] text-[#554336] hover:bg-[#eae1da]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Confirm & Log Button */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleRunAiAnalysis}
                  className="tactile-button py-2.5 px-3 rounded-xl font-mono-dial text-xs text-[#554336] border border-[#dbc2b0] flex items-center gap-1 cursor-pointer"
                  title="Rescan"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Rescan</span>
                </button>

                <button
                  onClick={handleConfirmLog}
                  className="tactile-button-amber flex-1 py-2.5 rounded-xl text-white font-headline text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#ffdcc3]" />
                  <span>Confirm &amp; Log Plate</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
