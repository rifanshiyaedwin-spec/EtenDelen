import React, { useState, useRef } from 'react';
import { FoodDonation, FoodVerificationData } from '../../types';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, X, Thermometer, CheckCircle2, AlertOctagon, Camera, Upload, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FoodVerificationModalProps {
  donation: FoodDonation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FoodVerificationModal: React.FC<FoodVerificationModalProps> = ({
  donation,
  isOpen,
  onClose,
}) => {
  const { currentUser, verifyDonationInspection } = useApp();

  const [actualQuantity, setActualQuantity] = useState<number>(donation?.quantity || 10);
  const [conditionScore, setConditionScore] = useState<'Excellent' | 'Good' | 'Fair' | 'Poor'>('Excellent');
  const [packagingIntact, setPackagingIntact] = useState<boolean>(true);
  const [temperatureCelsius, setTemperatureCelsius] = useState<number>(65);
  const [observations, setObservations] = useState(
    'Temperature verified with digital probe. Packaging seals intact and hygienic.'
  );
  const [verificationPhotoUrl, setVerificationPhotoUrl] = useState<string>(donation?.imageUrl || '');
  const [isApproved, setIsApproved] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !donation) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setVerificationPhotoUrl(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verificationData: FoodVerificationData = {
      actualQuantity,
      unit: donation.unit,
      conditionScore,
      packagingIntact,
      temperatureCelsius,
      observations,
      photoUrl: verificationPhotoUrl || donation.imageUrl,
      verifiedAt: new Date().toISOString(),
      verifiedBy: `${currentUser.name} (${currentUser.organizationName || currentUser.role.toUpperCase()})`,
      approved: isApproved,
    };

    verifyDonationInspection(donation.id, verificationData);

    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 my-6">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-300" />
            <div>
              <h3 className="text-base font-bold">Food Safety & Quality Inspection</h3>
              <p className="text-xs text-emerald-200">Official NGO / Intake Verifier Log</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>{donation.title}</span>
              <span className="font-mono text-emerald-700">{donation.id}</span>
            </div>
            <p className="text-slate-500">
              Declared: {donation.quantity} {donation.unit} • Storage: {donation.storageRequirements}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Actual Measured Weight/Qty
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  required
                  value={actualQuantity}
                  onChange={(e) => setActualQuantity(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-l-xl text-sm font-bold text-slate-800"
                />
                <span className="bg-slate-100 border border-l-0 border-slate-300 px-3 py-2 rounded-r-xl text-xs font-medium text-slate-600 uppercase">
                  {donation.unit}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Measured Temp (°C)
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  step="0.1"
                  value={temperatureCelsius}
                  onChange={(e) => setTemperatureCelsius(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-l-xl text-sm font-bold text-slate-800"
                />
                <span className="bg-slate-100 border border-l-0 border-slate-300 px-3 py-2 rounded-r-xl text-xs font-medium text-slate-600">
                  °C
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Visual Food Condition
              </label>
              <select
                value={conditionScore}
                onChange={(e) => setConditionScore(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-slate-50"
              >
                <option value="Excellent">🟢 Excellent (Pristine)</option>
                <option value="Good">🟢 Good (Standard)</option>
                <option value="Fair">🟡 Fair (Acceptable)</option>
                <option value="Poor">🔴 Poor (Rejection Risk)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Packaging Integrity
              </label>
              <select
                value={packagingIntact ? 'true' : 'false'}
                onChange={(e) => setPackagingIntact(e.target.value === 'true')}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-slate-50"
              >
                <option value="true">✓ Sealed & Intact</option>
                <option value="false">⚠ Damaged / Unsealed</option>
              </select>
            </div>
          </div>

          {/* Verification Photo Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Food Inspection Photograph
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
            <input
              type="file"
              ref={cameraInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              capture="environment"
              className="hidden"
            />

            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <img
                src={verificationPhotoUrl}
                alt="Inspection proof"
                className="w-16 h-16 object-cover rounded-lg border border-slate-300 flex-shrink-0"
              />
              <div className="flex-1 space-y-1.5">
                <p className="text-xs font-semibold text-slate-800">Inspection Proof Image</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-[11px] font-bold text-slate-700 rounded-lg cursor-pointer flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload New</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-[11px] font-bold text-white rounded-lg cursor-pointer flex items-center gap-1"
                  >
                    <Camera className="w-3 h-3 text-orange-400" />
                    <span>Take Photo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Safety Notes & Observations
            </label>
            <textarea
              rows={2}
              required
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs resize-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Approve / Reject Toggle */}
          <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Official Safety Decision:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsApproved(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                  isApproved ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600'
                }`}
              >
                ✓ Approve for Redistribution
              </button>
              <button
                type="button"
                onClick={() => setIsApproved(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                  !isApproved ? 'bg-red-600 text-white shadow-sm' : 'bg-white text-slate-600'
                }`}
              >
                ✕ Reject Food
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Sign & Save Inspection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
