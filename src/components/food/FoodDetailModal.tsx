import React from 'react';
import { FoodDonation } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateExpiryStatus } from '../../services/aiService';
import {
  X,
  MapPin,
  Clock,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  Flame,
  QrCode,
  Sparkles,
  Share2,
  Calendar,
  CheckCircle2,
  Award,
  Truck,
  Building,
  User,
  HeartHandshake,
} from 'lucide-react';

interface FoodDetailModalProps {
  donation: FoodDonation | null;
  onClose: () => void;
  onAccept?: (donation: FoodDonation) => void;
  onRequestPickup?: (donation: FoodDonation) => void;
  onOpenCertificate?: (donation: FoodDonation) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  donation,
  onClose,
  onAccept,
  onRequestPickup,
  onOpenCertificate,
}) => {
  const {
    currentUser,
    setIsQrScannerOpen,
    toggleEmergencyRescue,
    setReportTarget,
    setIsReportModalOpen,
  } = useApp();

  if (!donation) return null;

  const expiry = calculateExpiryStatus(donation.expiryTime);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 my-8">
        {/* Top Image Banner */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900">
          <img
            src={donation.imageUrl}
            alt={donation.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on Banner */}
          <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm">
              {donation.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${expiry.color}`}>
              {expiry.label}
            </span>
            {donation.isEmergencyRescue && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white flex items-center gap-1 animate-pulse">
                <Flame className="w-3.5 h-3.5" /> Emergency Rescue
              </span>
            )}
          </div>

          {/* Title & Key Stats on Banner Bottom */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-[11px] font-mono text-emerald-300 font-bold">{donation.id}</span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-sm">
              {donation.title}
            </h2>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-200">
              <span className="font-bold text-sm text-emerald-300">
                {donation.quantity} {donation.unit}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5" /> {donation.donorType}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Food Description & Overview
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {donation.description || 'Nutritious surplus food stored and packed according to food safety protocols.'}
            </p>
          </div>

          {/* Specification Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Preparation</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {new Date(donation.prepTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Best Before</span>
              <p className="text-xs font-bold text-orange-700 mt-0.5">
                {new Date(donation.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Condition</span>
              <p className="text-xs font-bold text-emerald-700 mt-0.5">{donation.condition}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Storage Mode</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">{donation.storageRequirements}</p>
            </div>
          </div>

          {/* Allergens & Safety Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
              <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Allergen Information
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {donation.allergens.length > 0 ? (
                  donation.allergens.map((alg) => (
                    <span
                      key={alg}
                      className="px-2 py-0.5 bg-amber-200/70 text-amber-900 rounded-md text-[11px] font-medium"
                    >
                      {alg}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-amber-800">No major declared allergens (Standard Nutritious)</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
              <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Food Safety Guarantee
              </h5>
              <p className="text-xs text-emerald-800 leading-relaxed">{donation.safetyNotes}</p>
            </div>
          </div>

          {/* Smart AI Matching Analysis */}
          {donation.matchScores && donation.matchScores.length > 0 && (
            <div className="p-4 bg-gradient-to-br from-purple-50 via-slate-50 to-emerald-50 border border-purple-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" /> AI Smart Matching Recommendation
                </span>
                <span className="px-2.5 py-0.5 bg-purple-600 text-white rounded-full text-xs font-bold">
                  {donation.matchScores[0].score}% Top Match
                </span>
              </div>
              <p className="text-xs text-slate-700 font-semibold">
                Recommended NGO: {donation.matchScores[0].ngoName}
              </p>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                {donation.matchScores[0].reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Visual Tracking Lifecycle Timeline */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Donation Lifecycle Tracking Timeline
            </h4>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {donation.trackingTimeline.map((step, idx) => {
                const isCompleted = step.completed;
                return (
                  <div key={idx} className="relative group">
                    <div
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isCompleted
                          ? 'bg-emerald-600 border-white text-white shadow-xs'
                          : 'bg-white border-slate-300'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.title}
                        </span>
                        {step.timestamp && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      {step.notes && <p className="text-[11px] text-slate-500 mt-0.5">{step.notes}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* QR Pass button */}
            <button
              onClick={() => {
                setIsQrScannerOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>QR Pass</span>
            </button>

            {/* Emergency Rescue Toggle for Donors / Admins */}
            {(currentUser.role === 'donor' || currentUser.role === 'admin') && (
              <button
                onClick={() => toggleEmergencyRescue(donation.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  donation.isEmergencyRescue
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'bg-slate-200 text-slate-700 hover:bg-orange-100 hover:text-orange-800'
                }`}
              >
                <Flame className="w-4 h-4 text-orange-600" />
                <span>{donation.isEmergencyRescue ? 'Emergency Active' : 'Trigger Emergency'}</span>
              </button>
            )}

            {/* View Certificate if completed */}
            {donation.status === 'completed' && onOpenCertificate && (
              <button
                onClick={() => onOpenCertificate(donation)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
              >
                <Award className="w-4 h-4" />
                <span>View Certificate</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentUser.role === 'ngo' && donation.status === 'matched' && onAccept && (
              <button
                onClick={() => onAccept(donation)}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
              >
                Accept Donation & Schedule Pickup
              </button>
            )}

            {currentUser.role === 'volunteer' && (donation.status === 'pickup_scheduled' || donation.status === 'matched') && onRequestPickup && (
              <button
                onClick={() => onRequestPickup(donation)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer"
              >
                Accept Pickup Task
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
