import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import {
  BarChart3,
  Leaf,
  Users,
  Utensils,
  TrendingUp,
  Droplet,
  ShieldCheck,
  Building,
  Heart,
  Globe,
  Award,
} from 'lucide-react';

export const ImpactDashboardView: React.FC = () => {
  const { impactStats, donations, users } = useApp();
  const { t } = useLanguage();

  // Category breakdown
  const categoryCounts = donations.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + (curr.quantity || 10);
    return acc;
  }, {} as Record<string, number>);

  const categoryEntries = Object.entries(categoryCounts);
  const maxCategoryVal = Math.max(...categoryEntries.map(([, v]) => v), 1);

  // Daily distribution data simulation
  const dailyData = [
    { day: 'Mon', kg: 420, meals: 950 },
    { day: 'Tue', kg: 510, meals: 1120 },
    { day: 'Wed', kg: 480, meals: 1050 },
    { day: 'Thu', kg: 630, meals: 1400 },
    { day: 'Fri', kg: 820, meals: 1950 },
    { day: 'Sat', kg: 940, meals: 2200 },
    { day: 'Sun', kg: 880, meals: 2100 },
  ];
  const maxDaily = Math.max(...dailyData.map((d) => d.kg));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Leaf className="w-3.5 h-3.5" />
          <span>Sustainability & Environmental Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Community Food Waste Prevention & Impact Index
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Real-time audited metrics quantifying rescued meals, landfill methane prevention, and water preservation across all registered donor kitchens and verified food banks.
        </p>
      </div>

      {/* Hero Environmental Impact Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl text-white shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Total Food Rescued
            </span>
            <Utensils className="w-5 h-5 text-emerald-200" />
          </div>
          <p className="text-3xl sm:text-4xl font-black">
            {impactStats.totalFoodRescuedKg.toLocaleString()}{' '}
            <span className="text-base font-normal text-emerald-200">kg</span>
          </p>
          <p className="text-xs text-emerald-100">
            Estimated Food Waste Prevented: ~{impactStats.estimatedFoodWastePreventedKg.toLocaleString()} kg
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-orange-600 to-amber-700 rounded-3xl text-white shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-200">
              Meals Provided
            </span>
            <Users className="w-5 h-5 text-orange-200" />
          </div>
          <p className="text-3xl sm:text-4xl font-black">
            {impactStats.beneficiariesSupported.toLocaleString()}
          </p>
          <p className="text-xs text-orange-100">
            Nourishing children, families & night shelters
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-teal-700 to-cyan-900 rounded-3xl text-white shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
              CO₂ Emissions Saved
            </span>
            <Leaf className="w-5 h-5 text-teal-200" />
          </div>
          <p className="text-3xl sm:text-4xl font-black">
            {impactStats.estimatedCo2SavedKg.toLocaleString()}{' '}
            <span className="text-base font-normal text-teal-200">kg CO₂e</span>
          </p>
          <p className="text-xs text-teal-100">
            * Estimated based on 2.5 kg CO₂e per kg food diverted
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-blue-700 to-indigo-900 rounded-3xl text-white shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Water Conserved
            </span>
            <Droplet className="w-5 h-5 text-blue-200" />
          </div>
          <p className="text-3xl sm:text-4xl font-black">
            {(impactStats.estimatedWaterSavedLiters / 1000).toLocaleString()}{' '}
            <span className="text-base font-normal text-blue-200">kL</span>
          </p>
          <p className="text-xs text-blue-100">
            * Estimated virtual agricultural water footprint
          </p>
        </div>
      </div>

      {/* Ecosystem Participants */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Active Donors</span>
          <p className="text-2xl font-black text-slate-900">{impactStats.activeDonors}</p>
          <p className="text-[10px] text-slate-500">Hotels, Cafes & Stores</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Verified NGOs</span>
          <p className="text-2xl font-black text-orange-600">{impactStats.verifiedNgos}</p>
          <p className="text-[10px] text-slate-500">Certified Food Banks</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Active Volunteers</span>
          <p className="text-2xl font-black text-amber-600">{impactStats.activeVolunteers}</p>
          <p className="text-[10px] text-slate-500">Rapid Couriers</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Successful Deliveries</span>
          <p className="text-2xl font-black text-emerald-600">{impactStats.successfulDonations}</p>
          <p className="text-[10px] text-slate-500">100% Zero Food Poisoning</p>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Trend Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>Daily Surplus Food Rescued (kg)</span>
            </h3>
            <span className="text-xs text-slate-400">Past 7 Days</span>
          </div>

          <div className="pt-4 flex items-end justify-between gap-2 h-48">
            {dailyData.map((item) => {
              const heightPercent = (item.kg / maxDaily) * 100;
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-bold text-slate-600">{item.kg}k</span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg transition-all hover:brightness-110 shadow-xs"
                  />
                  <span className="text-[11px] font-bold text-slate-500">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown Bars */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-orange-600" />
              <span>Surplus Rescued by Food Category</span>
            </h3>
            <span className="text-xs text-slate-400">Distribution %</span>
          </div>

          <div className="space-y-3 pt-2">
            {categoryEntries.map(([catName, val]) => {
              const pct = Math.round((val / maxCategoryVal) * 100);
              return (
                <div key={catName} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{catName}</span>
                    <span className="text-slate-500">{val} units</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-100 rounded-2xl text-[11px] text-slate-500 text-center">
        ℹ️ Environmental impact calculations (CO₂e emissions diverted and agricultural water conservation) are estimated in accordance with UNEP Food Waste Index and FAO guidelines.
      </div>
    </div>
  );
};
