import React, { useState } from 'react';
import { FoodDonation, RedistributionRecord } from '../../types';
import { useApp } from '../../context/AppContext';
import { HeartHandshake, X, Users, MapPin, CheckCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RedistributionModalProps {
  donation: FoodDonation | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCertificate: (donation: FoodDonation) => void;
}

export const RedistributionModal: React.FC<RedistributionModalProps> = ({
  donation,
  isOpen,
  onClose,
  onOpenCertificate,
}) => {
  const { currentUser, recordRedistribution } = useApp();

  const [beneficiariesCount, setBeneficiariesCount] = useState<number>(
    Math.round((donation?.quantity || 20) * 3)
  );
  const [targetCommunity, setTargetCommunity] = useState('George Town Community Center & Shelter');
  const [locationName, setLocationName] = useState('Central Community Meal Hub');
  const [notes, setNotes] = useState(
    'Redistributed as fresh, warm, wholesome meals directly to vulnerable families, children, and elderly residents.'
  );

  if (!isOpen || !donation) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const record: RedistributionRecord = {
      beneficiariesCount,
      targetCommunity,
      locationName,
      distributedAt: new Date().toISOString(),
      notes,
      distributedByNgo: currentUser.organizationName || currentUser.name,
    };

    recordRedistribution(donation.id, record);

    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
      });
    } catch (e) {}

    onClose();
    // Open certificate
    onOpenCertificate({
      ...donation,
      status: 'completed',
      redistributionData: record,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-orange-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HeartHandshake className="w-6 h-6 text-orange-200" />
            <div>
              <h3 className="text-base font-bold">Record Food Redistribution</h3>
              <p className="text-xs text-orange-200">Connect surplus meals directly to people in need</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-orange-950">
              <span>{donation.title}</span>
              <span className="font-mono">{donation.id}</span>
            </div>
            <p className="text-orange-700">
              Surplus Volume: {donation.quantity} {donation.unit} • Donor: {donation.donorType}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Number of Beneficiaries Nourished
            </label>
            <div className="relative">
              <Users className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="number"
                min="1"
                required
                value={beneficiariesCount}
                onChange={(e) => setBeneficiariesCount(parseInt(e.target.value) || 0)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target Community / Shelter Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={targetCommunity}
                onChange={(e) => setTargetCommunity(e.target.value)}
                placeholder="e.g. North Side Slum Settlement & Orphanage Hub"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Redistribution Summary & Meal Log
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs resize-none"
            />
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>
              Submitting this record will issue the official <strong>EtenDelen Food Rescue Certificate</strong> and update sustainability impact counters.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              Complete Redistribution & Issue Award
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
