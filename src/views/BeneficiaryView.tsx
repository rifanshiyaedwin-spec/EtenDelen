import React, { useState } from 'react';
import { FoodCategory } from '../types';
import { useApp } from '../context/AppContext';
import { Users, Heart, PlusCircle, CheckCircle2, Clock, MapPin, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BeneficiaryViewProps {
  onNavigate: (view: string) => void;
}

export const BeneficiaryView: React.FC<BeneficiaryViewProps> = ({ onNavigate }) => {
  const { currentUser, beneficiaryRequests, submitBeneficiaryRequest, donations } = useApp();

  const [familyMembers, setFamilyMembers] = useState(4);
  const [requestedCategory, setRequestedCategory] = useState<FoodCategory>('Cooked Meals');
  const [dietaryPref, setDietaryPref] = useState<'Any' | 'Vegetarian' | 'Non-Vegetarian'>('Vegetarian');
  const [urgentNeed, setUrgentNeed] = useState(false);
  const [notes, setNotes] = useState('Daily evening meal assistance for family and children.');
  const [submitted, setSubmitted] = useState(false);

  const myRequests = beneficiaryRequests.filter(
    (r) => r.beneficiaryId === currentUser.id || r.beneficiaryName === currentUser.name
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitBeneficiaryRequest({
      familyMembersCount: familyMembers,
      requestedCategory,
      dietaryPreference: dietaryPref,
      urgentNeed,
      notes,
    });
    setSubmitted(true);
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {}
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-500/30 shadow-lg"
          />
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-white">{currentUser.name}</h1>
            <p className="text-xs text-slate-300 font-medium">
              Community Beneficiary Account • {currentUser.address}
            </p>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/40">
              Authorized Community Member
            </span>
          </div>
        </div>

        <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Active Food Requests</span>
          <p className="text-2xl font-extrabold text-blue-300">{myRequests.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Request Submission Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Request Food Support</h3>
          </div>
          <p className="text-xs text-slate-500">
            Submit your household or community meal requirement. Authorized NGOs will allocate matching surplus food.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Family / Dependent Count
              </label>
              <input
                type="number"
                min="1"
                required
                value={familyMembers}
                onChange={(e) => setFamilyMembers(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Food Category Needed
              </label>
              <select
                value={requestedCategory}
                onChange={(e) => setRequestedCategory(e.target.value as FoodCategory)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-slate-50"
              >
                <option value="Cooked Meals">Cooked Meals (Ready to eat)</option>
                <option value="Rice">Rice & Grains</option>
                <option value="Bread/Bakery">Bread & Bakery</option>
                <option value="Vegetables">Fresh Vegetables</option>
                <option value="Dairy">Dairy & Milk</option>
                <option value="Groceries">Pantry Groceries</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dietary Preference
              </label>
              <select
                value={dietaryPref}
                onChange={(e) => setDietaryPref(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-slate-50"
              >
                <option value="Vegetarian">Pure Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Any">Any Safe Food</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Additional Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="urgentCheck"
                checked={urgentNeed}
                onChange={(e) => setUrgentNeed(e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded"
              />
              <label htmlFor="urgentCheck" className="text-xs font-bold text-orange-800 cursor-pointer">
                Urgent requirement today
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              {submitted ? '✓ Request Submitted' : 'Submit Food Request'}
            </button>
          </form>
        </div>

        {/* Requests & Allocations Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>My Community Requests & Allocations ({myRequests.length})</span>
          </h3>

          <div className="space-y-3">
            {myRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {req.id}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {req.requestedCategory} for {req.familyMembersCount} Family Members
                    </h4>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      req.status === 'allocated'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {req.status === 'allocated' ? '✓ Allocated by NGO' : 'Awaiting NGO Match'}
                  </span>
                </div>

                <p className="text-xs text-slate-600">{req.notes}</p>

                {req.allocatedNgoName && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                    <div>
                      <p className="font-bold">Allocated by: {req.allocatedNgoName}</p>
                      <p className="text-[11px] text-emerald-700">Food dispatch scheduled for collection.</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
