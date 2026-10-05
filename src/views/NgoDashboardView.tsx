import React, { useState } from 'react';
import { FoodDonation } from '../types';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { FoodCard } from '../components/food/FoodCard';
import {
  HeartHandshake,
  ShieldCheck,
  Award,
  Truck,
  Users,
  Utensils,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ClipboardCheck,
  AlertTriangle,
} from 'lucide-react';

interface NgoDashboardViewProps {
  onNavigate: (view: string) => void;
  onSelectDonation: (donation: FoodDonation) => void;
  onOpenVerificationModal: (donation: FoodDonation) => void;
  onOpenRedistributionModal: (donation: FoodDonation) => void;
  onOpenCertificate: (donation: FoodDonation) => void;
}

export const NgoDashboardView: React.FC<NgoDashboardViewProps> = ({
  onNavigate,
  onSelectDonation,
  onOpenVerificationModal,
  onOpenRedistributionModal,
  onOpenCertificate,
}) => {
  const { currentUser, donations, acceptDonationAsNgo, assignVolunteerToDonation } = useApp();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'matched' | 'intake' | 'redistributed'>('matched');

  // Matched / Available food for this NGO
  const matchedDonations = donations.filter(
    (d) => d.status === 'matched' || d.status === 'created'
  );

  // Accepted & In Transit / Awaiting Intake Verification
  const intakeDonations = donations.filter(
    (d) =>
      (d.matchedNgoId === currentUser.id || d.matchedNgoName === currentUser.organizationName) &&
      d.status !== 'completed' &&
      d.status !== 'cancelled'
  );

  // Completed / Redistributed
  const completedDonations = donations.filter(
    (d) =>
      (d.matchedNgoId === currentUser.id || d.matchedNgoName === currentUser.organizationName) &&
      d.status === 'completed'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* NGO Hub Header */}
      <div className="bg-gradient-to-r from-orange-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-orange-500/30 shadow-lg"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {currentUser.organizationName || currentUser.name}
              </h1>
              {currentUser.verified ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified NGO
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
                  Verification Pending
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300">
              Representative: {currentUser.name} • Capacity: {currentUser.capacityKg || 800} kg / day
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-amber-300 font-bold">
                ⭐ {currentUser.points} Community Redistribution Points
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('ngo_verification')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Verification Credentials & Audit
          </button>
          <button
            onClick={() => onNavigate('browse')}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
          >
            Browse All Surplus
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('matched')}
          className={`pb-3 px-4 text-xs font-bold transition cursor-pointer border-b-2 ${
            activeTab === 'matched'
              ? 'border-orange-600 text-orange-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Smart Matched Surplus ({matchedDonations.length})
        </button>
        <button
          onClick={() => setActiveTab('intake')}
          className={`pb-3 px-4 text-xs font-bold transition cursor-pointer border-b-2 ${
            activeTab === 'intake'
              ? 'border-orange-600 text-orange-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Active Pickups & Food Intake ({intakeDonations.length})
        </button>
        <button
          onClick={() => setActiveTab('redistributed')}
          className={`pb-3 px-4 text-xs font-bold transition cursor-pointer border-b-2 ${
            activeTab === 'redistributed'
              ? 'border-orange-600 text-orange-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Completed Distributions & Certificates ({completedDonations.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'matched' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Recommended Surplus Food Matched by AI
            </h3>
            <span className="text-xs text-slate-500">Ranked by proximity and capacity fit</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedDonations.map((donation) => (
              <FoodCard
                key={donation.id}
                donation={donation}
                onViewDetails={onSelectDonation}
                onAccept={() => acceptDonationAsNgo(donation.id)}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'intake' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              In-Progress Rescues & Intake Inspection Queue
            </h3>
            <span className="text-xs text-slate-500">
              Perform safety checks on received food and assign courier
            </span>
          </div>

          {intakeDonations.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 space-y-2">
              <HeartHandshake className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-bold text-slate-700">No active intakes currently underway</p>
              <p className="text-xs text-slate-400">Accept matched surplus to schedule logistics.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {intakeDonations.map((d) => (
                <div
                  key={d.id}
                  className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        {d.id}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{d.title}</span>
                      <span className="text-[11px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Stage: {d.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">
                      Volume: <strong>{d.quantity} {d.unit}</strong> • Donor: {d.donorType} • Address: {d.pickupAddress}
                    </p>

                    {d.assignedVolunteerName && (
                      <p className="text-xs text-slate-600 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Assigned Volunteer: <strong>{d.assignedVolunteerName}</strong></span>
                      </p>
                    )}
                  </div>

                  {/* Actions according to status */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Assign Volunteer button if not assigned */}
                    {!d.assignedVolunteerId && (
                      <button
                        onClick={() => assignVolunteerToDonation(d.id, 'volunteer-1')}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Assign Volunteer Courier
                      </button>
                    )}

                    {/* Food Verification Inspection button */}
                    <button
                      onClick={() => onOpenVerificationModal(d)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <ClipboardCheck className="w-4 h-4" />
                      <span>Verify Food Safety Log</span>
                    </button>

                    {/* Record Redistribution button */}
                    <button
                      onClick={() => onOpenRedistributionModal(d)}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Users className="w-4 h-4" />
                      <span>Record Redistribution</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'redistributed' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Completed Community Meal Distributions & Audit Certificates
            </h3>
            <span className="text-xs text-slate-500">{completedDonations.length} records completed</span>
          </div>

          <div className="space-y-3">
            {completedDonations.map((d) => (
              <div
                key={d.id}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800">{d.id}</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      ✓ Successfully Distributed
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{d.title}</h4>
                  <p className="text-xs text-slate-500">
                    Target Community: <strong>{d.redistributionData?.targetCommunity || 'Shelter'}</strong> • Beneficiaries: <strong>{d.redistributionData?.beneficiariesCount || 180}</strong>
                  </p>
                </div>

                <button
                  onClick={() => onOpenCertificate(d)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>View Official Award Certificate</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
