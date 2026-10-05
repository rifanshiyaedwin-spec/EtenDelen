import React, { useState } from 'react';
import { FoodDonation } from '../types';
import { useApp } from '../context/AppContext';
import { calculateExpiryStatus } from '../services/aiService';
import {
  CheckCircle2,
  Clock,
  QrCode,
  ShieldCheck,
  Award,
  Truck,
  Building,
  User,
  AlertTriangle,
  ArrowRight,
  Flame,
  Thermometer,
} from 'lucide-react';

interface DonationTrackingViewProps {
  initialDonationId?: string;
  onOpenCertificate: (donation: FoodDonation) => void;
  onOpenVerificationModal: (donation: FoodDonation) => void;
}

export const DonationTrackingView: React.FC<DonationTrackingViewProps> = ({
  initialDonationId,
  onOpenCertificate,
  onOpenVerificationModal,
}) => {
  const { donations, setIsQrScannerOpen } = useApp();
  const [selectedId, setSelectedId] = useState<string>(initialDonationId || donations[0]?.id || '');

  const donation = donations.find((d) => d.id === selectedId) || donations[0];

  if (!donation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400">
        No donation found.
      </div>
    );
  }

  const expiry = calculateExpiryStatus(donation.expiryTime);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>End-to-End Tracking Timeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Surplus Food Redistribution Lifecycle
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-xs"
          >
            {donations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.id} - {d.title.slice(0, 30)}...
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsQrScannerOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan QR</span>
          </button>
        </div>
      </div>

      {/* Donation Overview Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={donation.imageUrl}
            alt={donation.title}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-slate-100"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {donation.id}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${expiry.color}`}>
                {expiry.label}
              </span>
              {donation.isEmergencyRescue && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white flex items-center gap-1 animate-pulse">
                  <Flame className="w-3 h-3" /> Emergency
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {donation.title}
            </h3>
            <p className="text-xs text-slate-500">
              Quantity: <strong>{donation.quantity} {donation.unit}</strong> • Donor: <strong>{donation.donorType}</strong>
            </p>
          </div>
        </div>

        {donation.status === 'completed' && (
          <button
            onClick={() => onOpenCertificate(donation)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>View Food Rescue Certificate</span>
          </button>
        )}
      </div>

      {/* 10-Step Interactive Lifecycle Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Redistribution Progress & Verification Checkpoints
        </h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {donation.trackingTimeline.map((step, idx) => {
            const isDone = step.completed;
            return (
              <div key={idx} className="relative group">
                <div
                  className={`absolute -left-6 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                    isDone
                      ? 'bg-emerald-600 border-white text-white shadow-md'
                      : 'bg-white border-slate-300 text-slate-300'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs sm:text-sm font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.title}
                    </h4>
                    {step.timestamp && (
                      <span className="text-[11px] font-medium text-slate-500">
                        {new Date(step.timestamp).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {step.actor && (
                    <p className="text-xs text-emerald-800 font-semibold">
                      Action Performed By: {step.actor}
                    </p>
                  )}

                  {step.notes && (
                    <p className="text-xs text-slate-600 leading-relaxed">{step.notes}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verification Data Inspection Box if available */}
      {donation.verificationData && (
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-xs p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Official NGO Food Safety Inspection Dossier</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <span className="text-slate-400 font-bold">Verified Weight</span>
              <p className="font-extrabold text-emerald-900 mt-0.5">
                {donation.verificationData.actualQuantity} {donation.verificationData.unit}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <span className="text-slate-400 font-bold">Core Temp</span>
              <p className="font-extrabold text-emerald-900 mt-0.5">
                {donation.verificationData.temperatureCelsius || 'Ambient'}°C
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <span className="text-slate-400 font-bold">Condition</span>
              <p className="font-extrabold text-emerald-900 mt-0.5">
                {donation.verificationData.conditionScore}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <span className="text-slate-400 font-bold">Inspection Result</span>
              <p className="font-extrabold text-emerald-900 mt-0.5">
                {donation.verificationData.approved ? '✓ Certified Safe' : 'Rejected'}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Inspector Notes: <em>{donation.verificationData.observations}</em> ({donation.verificationData.verifiedBy})
          </p>
        </div>
      )}
    </div>
  );
};
