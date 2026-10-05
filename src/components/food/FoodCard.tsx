import React from 'react';
import { FoodDonation } from '../../types';
import { calculateExpiryStatus } from '../../services/aiService';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Clock,
  MapPin,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Flag,
  Share2,
  Thermometer,
} from 'lucide-react';

interface FoodCardProps {
  donation: FoodDonation;
  onViewDetails: (donation: FoodDonation) => void;
  onAccept?: (donation: FoodDonation) => void;
  onRequestPickup?: (donation: FoodDonation) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  donation,
  onViewDetails,
  onAccept,
  onRequestPickup,
}) => {
  const { currentUser, setReportTarget, setIsReportModalOpen } = useApp();
  const { t } = useLanguage();

  const expiry = calculateExpiryStatus(donation.expiryTime);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-600 text-white animate-pulse';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-slate-200 text-slate-700';
    }
  };

  const topMatch = donation.matchScores?.[0];

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReportTarget({
      type: 'donation',
      id: donation.id,
      title: donation.title,
    });
    setIsReportModalOpen(true);
  };

  return (
    <div
      onClick={() => onViewDetails(donation)}
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer relative"
    >
      {/* Top Image Banner with Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={donation.imageUrl}
          alt={donation.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30" />

        {/* Category & Veg indicator top left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md">
            {donation.category}
          </span>
          {donation.isVegetarian && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white border border-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white" /> Pure Veg
            </span>
          )}
        </div>

        {/* Emergency or Expiry Pill top right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {donation.isEmergencyRescue ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white flex items-center gap-1 animate-pulse shadow-md">
              <Flame className="w-3.5 h-3.5" /> Emergency Rescue
            </span>
          ) : (
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold border ${expiry.color}`}
            >
              {expiry.label}
            </span>
          )}
        </div>

        {/* Bottom Banner inside Image: Quantity & Donor */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="font-bold text-sm bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-xs border border-white/20">
            {donation.quantity} <span className="font-normal uppercase text-xs">{donation.unit}</span>
          </div>
          <span className="text-[11px] text-slate-200 font-medium bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs truncate max-w-[150px]">
            {donation.donorType}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Donation Title */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition line-clamp-2">
              {donation.title}
            </h3>
            <button
              onClick={handleReport}
              title="Report safety or listing issue"
              className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition cursor-pointer flex-shrink-0"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Description preview */}
          <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
            {donation.description || 'Nutritious surplus ready for redistribution.'}
          </p>

          {/* Location & Time info */}
          <div className="mt-3 space-y-1 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="truncate">{donation.pickupAddress}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
              <span>
                Window: {new Date(donation.pickupWindowStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(donation.pickupWindowEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Storage requirements note */}
          <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <Thermometer className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate font-medium">{donation.storageRequirements}</span>
          </div>

          {/* Smart AI Match Preview Pill */}
          {topMatch && (
            <div className="mt-3 p-2 bg-gradient-to-r from-emerald-50 to-orange-50 border border-emerald-200/80 rounded-xl text-xs flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{topMatch.score}% AI Match</span>
              </div>
              <span className="text-[10px] text-slate-600 truncate max-w-[140px]">{topMatch.ngoName}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono font-bold text-slate-400">
            {donation.id}
          </span>

          <div className="flex items-center gap-2">
            {currentUser.role === 'ngo' && donation.status === 'matched' && onAccept && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept(donation);
                }}
                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Accept</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            {currentUser.role === 'volunteer' && (donation.status === 'pickup_scheduled' || donation.status === 'matched') && onRequestPickup && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestPickup(donation);
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Take Task</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            <button
              onClick={() => onViewDetails(donation)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Details &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
