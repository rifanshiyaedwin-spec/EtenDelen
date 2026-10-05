import React from 'react';
import { FoodDonation } from '../types';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { calculateExpiryStatus } from '../services/aiService';
import {
  PlusCircle,
  Clock,
  Award,
  TrendingUp,
  Leaf,
  Users,
  Utensils,
  QrCode,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  Trash2,
} from 'lucide-react';

interface DonorDashboardViewProps {
  onNavigate: (view: string) => void;
  onSelectDonation: (donation: FoodDonation) => void;
  onOpenCertificate: (donation: FoodDonation) => void;
}

export const DonorDashboardView: React.FC<DonorDashboardViewProps> = ({
  onNavigate,
  onSelectDonation,
  onOpenCertificate,
}) => {
  const { currentUser, donations, cancelDonation, setIsQrScannerOpen } = useApp();
  const { t } = useLanguage();

  const myDonations = donations.filter(
    (d) => d.donorId === currentUser.id || d.donorName === currentUser.name
  );

  const completedDonations = myDonations.filter((d) => d.status === 'completed');
  const activeDonations = myDonations.filter(
    (d) => d.status !== 'completed' && d.status !== 'cancelled'
  );

  const totalKgDonated = myDonations.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  const totalBeneficiaries = completedDonations.reduce(
    (acc, curr) => acc + (curr.redistributionData?.beneficiariesCount || Math.round(curr.quantity * 2.5)),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Donor Profile Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-emerald-500/30 shadow-lg"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white">{currentUser.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Verified Food Donor
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {currentUser.organizationName} • {currentUser.phone}
            </p>
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {currentUser.badges.map((b) => (
                <span key={b} className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-amber-300 border border-white/10">
                  🏆 {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onNavigate('create_donation')}
            className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>+ Create New Donation</span>
          </button>
          <button
            onClick={() => setIsQrScannerOpen(true)}
            className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-emerald-300" />
            <span>QR Scanner</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs text-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Listed Food</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
            {totalKgDonated} <span className="text-xs font-normal text-slate-500">kg / portions</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">{myDonations.length} total rescue posts</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs text-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase">People Nourished</span>
          <p className="text-2xl sm:text-3xl font-black text-orange-600 mt-1">
            {totalBeneficiaries}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Across verified shelters</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs text-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase">CO₂ Offset</span>
          <p className="text-2xl sm:text-3xl font-black text-teal-600 mt-1">
            {Math.round(totalKgDonated * 2.5)} <span className="text-xs font-normal text-slate-500">kg CO₂e</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">100% landfill diversion</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs text-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Donor Points</span>
          <p className="text-2xl sm:text-3xl font-black text-purple-600 mt-1">
            {currentUser.points} <span className="text-xs font-normal text-slate-500">PTS</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Tier: Gold Champion</p>
        </div>
      </div>

      {/* Active Donations In-Flight */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span>Active Donations ({activeDonations.length})</span>
          </h2>
          <span className="text-xs text-slate-500">Live lifecycle tracking</span>
        </div>

        {activeDonations.length === 0 ? (
          <div className="p-8 bg-slate-50 border border-slate-200 rounded-3xl text-center space-y-3">
            <Utensils className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No active surplus donations right now</p>
            <p className="text-xs text-slate-400">Do you have kitchen or inventory surplus? List it to prevent waste!</p>
            <button
              onClick={() => onNavigate('create_donation')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer hover:bg-emerald-700"
            >
              + Create Surplus Food Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeDonations.map((d) => {
              const expiry = calculateExpiryStatus(d.expiryTime);
              return (
                <div
                  key={d.id}
                  onClick={() => onSelectDonation(d)}
                  className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-500 transition cursor-pointer space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {d.id}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-1">{d.title}</h3>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${expiry.color}`}>
                      {expiry.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span className="font-semibold text-slate-800">
                      {d.quantity} {d.unit} • {d.category}
                    </span>
                    <span className="uppercase text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Status: {d.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDonation(d);
                      }}
                      className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      Track Lifecycle &rarr;
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelDonation(d.id, 'Cancelled by donor dashboard');
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition cursor-pointer"
                      title="Cancel Donation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Donations & Certificates History */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Completed Reductions & Food Rescue Certificates ({completedDonations.length})</span>
        </h2>

        {completedDonations.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center text-xs text-slate-400">
            Completed donations and certified sustainability records will appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {completedDonations.map((d) => (
              <div
                key={d.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700">{d.id}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold">
                      ✓ Completed & Verified
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{d.title}</h4>
                  <p className="text-xs text-slate-500">
                    Redistributed to {d.redistributionData?.beneficiariesCount || 180} people at {d.redistributionData?.targetCommunity || 'Community Hub'}
                  </p>
                </div>

                <button
                  onClick={() => onOpenCertificate(d)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-center"
                >
                  <Award className="w-4 h-4" />
                  <span>View Official Certificate</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
