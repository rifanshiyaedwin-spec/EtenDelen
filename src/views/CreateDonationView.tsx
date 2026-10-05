import React, { useState, useRef } from 'react';
import { FoodCategory, FoodCondition, FoodDonation, StorageRequirement } from '../types';
import { useApp } from '../context/AppContext';
import { classifyFoodImage } from '../services/aiService';
import {
  Sparkles,
  Camera,
  Upload,
  Calendar,
  Clock,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  Repeat,
  Flame,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Utensils,
  Leaf,
  Image as ImageIcon,
  Check,
  X,
  FileText,
  Link2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CreateDonationViewProps {
  onNavigate: (view: string) => void;
  onDonationCreated: (donation: FoodDonation) => void;
}

const CATEGORIES: FoodCategory[] = [
  'Cooked Meals',
  'Rice',
  'Bread/Bakery',
  'Fruits',
  'Vegetables',
  'Dairy',
  'Packaged Food',
  'Beverages',
  'Groceries',
  'Other',
];

const CONDITIONS: FoodCondition[] = [
  'Freshly Prepared',
  'Good Condition',
  'Refrigerated/Chilled',
  'Frozen',
  'Packaged/Sealed',
  'Requires Immediate Pickup',
];

const STORAGE_OPTIONS: StorageRequirement[] = [
  'Dry / Room Temperature',
  'Refrigerated (0°C - 4°C)',
  'Frozen (-18°C)',
  'Insulated Warm (> 60°C)',
  'No Specific Storage',
];

const COMMON_ALLERGENS = [
  'Dairy / Milk',
  'Gluten / Wheat',
  'Peanuts / Tree Nuts',
  'Soy',
  'Eggs',
  'Mustard',
  'Sesame',
  'None / Nutritious',
];

const PRESET_FOOD_IMAGES = [
  { label: 'Hot Buffet Meals', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80', title: 'Buffet Prepared Cooked Meals (Curries & Rice)' },
  { label: 'Bakery Loaves', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80', title: 'Artisan Sourdough & Baguettes' },
  { label: 'Fresh Vegetables', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80', title: 'Farm Fresh Organic Harvest Vegetables' },
  { label: 'Dairy & Milk', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=80', title: 'Pasteurized Fresh Milk & Dairy Packs' },
  { label: 'Steamed Rice', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80', title: 'Steamed Basmati Rice & Lentil Curry' },
];

export const CreateDonationView: React.FC<CreateDonationViewProps> = ({
  onNavigate,
  onDonationCreated,
}) => {
  const { currentUser, createDonation } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Cooked Meals');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_FOOD_IMAGES[0].url);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');

  const [quantity, setQuantity] = useState<number>(30);
  const [unit, setUnit] = useState<'kg' | 'servings' | 'boxes' | 'liters' | 'packets'>('servings');
  const [condition, setCondition] = useState<FoodCondition>('Freshly Prepared');
  const [storageRequirements, setStorageRequirements] = useState<StorageRequirement>('Insulated Warm (> 60°C)');
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [allergens, setAllergens] = useState<string[]>(['Gluten / Wheat']);
  const [safetyNotes, setSafetyNotes] = useState(
    'Packed in commercial food-grade thermal containers. Kept at safe holding temperature.'
  );
  const [pickupAddress, setPickupAddress] = useState(currentUser.address || 'Central District Hotel Loading Dock 2');
  const [hoursUntilExpiry, setHoursUntilExpiry] = useState<number>(5);
  const [isEmergencyRescue, setIsEmergencyRescue] = useState(false);
  const [isScheduledRecurring, setIsScheduledRecurring] = useState(false);
  const [recurringFreq, setRecurringFreq] = useState<'daily' | 'weekly'>('daily');

  // File Input References
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // AI Classification state
  const [isAiClassifying, setIsAiClassifying] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);

  const handleRunAiAnalysis = async (customTitle?: string, customImg?: string) => {
    setIsAiClassifying(true);
    try {
      const result = await classifyFoodImage(customTitle || title || 'Cooked Meals', customImg || imageUrl);
      setAiResult(result);
      if (!title) setTitle(result.foodType);
      setCategory(result.category);
      setStorageRequirements(result.safeStorageRecommendation);
      setHoursUntilExpiry(result.estimatedShelfLifeHours);
      if (result.safetyTips?.length > 0) {
        setSafetyNotes(result.safetyTips.join('. '));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiClassifying(false);
    }
  };

  // Process uploaded image file
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const resultDataUrl = e.target?.result as string;
      if (resultDataUrl) {
        setImageUrl(resultDataUrl);
        setUploadedFileName(file.name);
        // Automatically trigger AI classification with the newly uploaded image
        handleRunAiAnalysis(title || file.name.replace(/\.[^/.]+$/, ''), resultDataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      setImageUrl(customUrlInput.trim());
      setUploadedFileName('Web Image Link');
      handleRunAiAnalysis(title, customUrlInput.trim());
      setShowUrlInput(false);
    }
  };

  const handleToggleAllergen = (item: string) => {
    if (allergens.includes(item)) {
      setAllergens(allergens.filter((a) => a !== item));
    } else {
      setAllergens([...allergens, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const expiryDate = new Date(now.getTime() + hoursUntilExpiry * 3600 * 1000);
    const pickupWindowStart = now.toISOString();
    const pickupWindowEnd = new Date(now.getTime() + Math.min(hoursUntilExpiry, 4) * 3600 * 1000).toISOString();

    const created = createDonation({
      title,
      category,
      description,
      imageUrl,
      quantity,
      unit,
      prepTime: now.toISOString(),
      expiryTime: expiryDate.toISOString(),
      condition,
      storageRequirements,
      allergens,
      isVegetarian,
      safetyNotes,
      pickupAddress,
      pickupLocation: currentUser.location,
      pickupWindowStart,
      pickupWindowEnd,
      isEmergencyRescue,
      isScheduledRecurring,
      recurringSchedule: isScheduledRecurring
        ? {
            frequency: recurringFreq,
            time: '18:00',
          }
        : undefined,
      aiAnalysis: aiResult || undefined,
    });

    try {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}

    onDonationCreated(created);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
          <Utensils className="w-3.5 h-3.5" />
          <span>Food Donor Registration Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          List Surplus Food for Immediate Rescue
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload food photographs, provide nutritional parameters, and let AI automatically classify shelf-life, match verified NGOs, and dispatch couriers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Upload Food Image & Smart AI Auto-Classification */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>1. Upload Food Image & AI Auto-Classification</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload a real photo from your device or camera to identify freshness & shelf-life.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleRunAiAnalysis()}
              disabled={isAiClassifying}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50 w-fit"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAiClassifying ? 'Analyzing Food Image...' : 'Re-run AI Analysis'}</span>
            </button>
          </div>

          {/* Hidden File and Camera Inputs */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          {/* Main Upload / Drag & Drop Interactive Zone */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Left/Main: Dropzone & Upload Buttons */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`md:col-span-7 border-2 border-dashed rounded-3xl p-6 text-center transition flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                  : 'border-slate-300 hover:border-emerald-500 bg-slate-50/60'
              }`}
            >
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                <Upload className="w-6 h-6" />
              </div>

              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  Drag and drop your food photo here, or click to browse
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Supports JPG, PNG, WEBP from phone camera or gallery (Max 10MB)
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose File</span>
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5 text-orange-400" />
                  <span>Take Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition cursor-pointer flex items-center gap-1"
                >
                  <Link2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Paste URL</span>
                </button>
              </div>

              {showUrlInput && (
                <div className="w-full mt-2 flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://example.com/food-photo.jpg"
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Right: Live Image Preview Card */}
            <div className="md:col-span-5 bg-slate-900 rounded-3xl p-3 border border-slate-800 relative overflow-hidden flex flex-col justify-between group">
              <div className="relative rounded-2xl overflow-hidden aspect-video sm:aspect-square bg-slate-950 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt="Food Item Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-emerald-400" />
                  <span>{uploadedFileName || 'Active Food Image'}</span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>AI Grounding Status:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Inspection
                </span>
              </div>
            </div>
          </div>

          {/* Preset Sample Gallery Shortcut */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-600">
              Or pick from sample surplus food dishes:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {PRESET_FOOD_IMAGES.map((preset, idx) => {
                const isSelected = imageUrl === preset.url;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setImageUrl(preset.url);
                      setUploadedFileName(preset.label);
                      if (!title) setTitle(preset.title);
                      handleRunAiAnalysis(preset.title, preset.url);
                    }}
                    className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-500/40 scale-95'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="h-16 w-full object-cover" />
                    <div className="p-1 bg-slate-900/80 text-white text-[10px] font-bold text-center truncate">
                      {preset.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Feedback Banner */}
          {aiResult && (
            <div className="p-4 bg-gradient-to-r from-purple-50 via-emerald-50 to-orange-50 border border-purple-200 rounded-2xl text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between font-bold text-purple-900">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" /> AI Classification Confidence: {(aiResult.confidence * 100).toFixed(0)}%
                </span>
                <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px]">
                  Estimated Shelf Life: ~{aiResult.estimatedShelfLifeHours}h
                </span>
              </div>
              <p className="text-slate-700">
                Identified as <strong>{aiResult.foodType}</strong> ({aiResult.category}). Carbon Offset Estimate: ~{aiResult.carbonOffsetEstimateKg} kg CO₂e.
              </p>
            </div>
          )}
        </div>

        {/* Step 2: Food Details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-emerald-600" />
            <span>2. Surplus Food Specifications</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Food Name / Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Surplus Banquet Basmati Rice & Paneer Curry"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Quantity *</label>
              <input
                type="number"
                required
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unit of Measurement *</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="servings">Servings (Individual meals)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="boxes">Boxes / Trays</option>
                <option value="packets">Packets / Containers</option>
                <option value="liters">Liters</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dietary Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsVegetarian(true)}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    isVegetarian
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-500'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  🌱 Vegetarian
                </button>
                <button
                  type="button"
                  onClick={() => setIsVegetarian(false)}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    !isVegetarian
                      ? 'bg-orange-100 text-orange-800 border-orange-500'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  🍖 Non-Veg
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Food Description & Preparation Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Prepared for corporate banquet 2 hours ago. Kept in steam tables. Delicious and untouched."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Step 3: Food Safety & Expiry Timestamps */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-orange-600" />
            <span>3. Food Safety, Storage & Remaining Availability</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Food Condition *</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as FoodCondition)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Storage Requirement *</label>
              <select
                value={storageRequirements}
                onChange={(e) => setStorageRequirements(e.target.value as StorageRequirement)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {STORAGE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Remaining Availability Window (Safe Consumption Period):
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="24"
                value={hoursUntilExpiry}
                onChange={(e) => setHoursUntilExpiry(parseInt(e.target.value))}
                className="flex-1 accent-emerald-600 cursor-pointer"
              />
              <span className="px-3 py-1 bg-slate-100 rounded-xl font-mono font-bold text-xs text-slate-800 w-24 text-center">
                {hoursUntilExpiry} hours
              </span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1h (Urgent Flash Rescue)</span>
              <span>6h (Standard Cooked Food)</span>
              <span>24h (Packaged / Bakery)</span>
            </div>
          </div>

          {/* Allergen Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Allergen Information:
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_ALLERGENS.map((all) => {
                const checked = allergens.includes(all);
                return (
                  <button
                    key={all}
                    type="button"
                    onClick={() => handleToggleAllergen(all)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer border ${
                      checked
                        ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {all}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Food Safety & Packaging Notes
            </label>
            <input
              type="text"
              value={safetyNotes}
              onChange={(e) => setSafetyNotes(e.target.value)}
              placeholder="e.g. Packaged in sealed food-grade foil containers with date labels."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Step 4: Pickup Logistics & Emergency Toggle */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>4. Pickup Location & Logistics</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Address *</label>
            <input
              type="text"
              required
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              placeholder="e.g. Grand Palace Hotel, Gate 4 Kitchen Service Ramp"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Urgent Emergency Rescue Flash Banner */}
          <div className="p-4 rounded-2xl border bg-orange-50/70 border-orange-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-orange-500 text-white">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-orange-950">
                  Mark as High-Priority Emergency Rescue
                </p>
                <p className="text-[11px] text-orange-800 mt-0.5">
                  Sends instant high-priority dispatch notifications to all couriers and verified NGOs within 5 km.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isEmergencyRescue}
              onChange={(e) => setIsEmergencyRescue(e.target.checked)}
              className="w-5 h-5 accent-orange-600 rounded-md cursor-pointer mt-1"
            />
          </div>

          {/* Recurring Schedule Option */}
          <div className="p-4 rounded-2xl border bg-slate-50 border-slate-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-800 text-white">
                <Repeat className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Schedule as Recurring Daily / Weekly Donation
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Automatically schedules recurring pickups for corporate dining & daily hotel surplus.
                </p>
                {isScheduledRecurring && (
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setRecurringFreq('daily')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        recurringFreq === 'daily'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border text-slate-700'
                      }`}
                    >
                      Daily (Every Evening)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecurringFreq('weekly')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        recurringFreq === 'weekly'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border text-slate-700'
                      }`}
                    >
                      Weekly (Weekends)
                    </button>
                  </div>
                )}
              </div>
            </div>
            <input
              type="checkbox"
              checked={isScheduledRecurring}
              onChange={(e) => setIsScheduledRecurring(e.target.checked)}
              className="w-5 h-5 accent-emerald-600 rounded-md cursor-pointer mt-1"
            />
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={() => onNavigate('donor_dashboard')}
            className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>Publish Surplus Donation & Dispatch AI Matcher</span>
          </button>
        </div>
      </form>
    </div>
  );
};
