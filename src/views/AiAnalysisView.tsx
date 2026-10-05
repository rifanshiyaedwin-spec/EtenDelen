import React, { useState } from 'react';
import { classifyFoodImage, getDemandPredictions } from '../services/aiService';
import { Sparkles, Camera, TrendingUp, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

interface AiAnalysisViewProps {
  onNavigate: (view: string) => void;
}

export const AiAnalysisView: React.FC<AiAnalysisViewProps> = ({ onNavigate }) => {
  const [testFoodInput, setTestFoodInput] = useState('Buffet Biryani and Paneer Butter Masala');
  const [loading, setLoading] = useState(false);
  const [classification, setClassification] = useState<any | null>(null);

  const demandData = getDemandPredictions();

  const handleClassify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await classifyFoodImage(testFoodInput);
    setClassification(res);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Intelligent Redistribution Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Food Intelligence & Demand Forecasting
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Smart image classification, thermodynamic shelf-life modeling, and community hunger heat-map predictions.
        </p>
      </div>

      {/* Grid: Classifier + Expiry Analyzer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interactive Food Classifier Demo */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-bold text-slate-900">
              1. Food Image & Title Classifier
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Type food items or dishes (e.g. Sourdough bread, Steamed basmati rice, Fresh dairy yogurt, Sliced apples) to test AI classification:
          </p>

          <form onSubmit={handleClassify} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={testFoodInput}
                onChange={(e) => setTestFoodInput(e.target.value)}
                placeholder="Enter food description..."
                className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Run AI'}
              </button>
            </div>
          </form>

          {classification && (
            <div className="p-5 bg-gradient-to-br from-purple-50 via-slate-50 to-emerald-50 border border-purple-200 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900">
                  Detected Category: <strong>{classification.category}</strong>
                </span>
                <span className="px-2 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded-full">
                  {(classification.confidence * 100).toFixed(0)}% Confidence
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold text-[10px]">Estimated Shelf Life</span>
                  <p className="font-bold text-emerald-800">~{classification.estimatedShelfLifeHours} hours</p>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold text-[10px]">Safe Storage Mode</span>
                  <p className="font-bold text-slate-800 truncate">{classification.safeStorageRecommendation}</p>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Safety Precautions:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {classification.safetyTips?.map((tip: string, idx: number) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Demand Forecasting Overview */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              2. Predictive Community Food Demand
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Real-time neighborhood demand forecast based on historic consumption trends and night shelter requests:
          </p>

          <div className="space-y-3 pt-1">
            {demandData.map((d) => (
              <div
                key={d.category}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 hover:border-emerald-300 transition"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">{d.category}</h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      d.demandLevel === 'Very High'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {d.demandLevel} Demand (Index: {d.urgencyIndex}/100)
                  </span>
                </div>

                <div className="text-[11px] text-slate-600">
                  <p>
                    Peak Consumption Window: <strong>{d.peakHours}</strong>
                  </p>
                  <p className="mt-0.5 text-slate-500">
                    High Demand Zones: {d.highDemandLocations.join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
        <span>
          💡 AI models assist with speed and matching; authorized food safety verifiers always certify intake condition.
        </span>
        <button
          onClick={() => onNavigate('create_donation')}
          className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
        >
          Create AI-Assisted Donation &rarr;
        </button>
      </div>
    </div>
  );
};
