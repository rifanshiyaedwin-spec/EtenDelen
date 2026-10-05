import React, { useState } from 'react';
import { FoodDonation } from '../types';
import { useApp } from '../context/AppContext';
import { InteractiveFoodMap } from '../components/map/InteractiveFoodMap';
import {
  Truck,
  Navigation,
  CheckCircle2,
  Clock,
  MapPin,
  QrCode,
  Award,
  Flame,
  ArrowRight,
  ShieldCheck,
  Camera,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VolunteerDashboardViewProps {
  onNavigate: (view: string) => void;
  onSelectDonation: (donation: FoodDonation) => void;
  onOpenCertificate: (donation: FoodDonation) => void;
}

export const VolunteerDashboardView: React.FC<VolunteerDashboardViewProps> = ({
  onNavigate,
  onSelectDonation,
  onOpenCertificate,
}) => {
  const {
    currentUser,
    donations,
    users,
    assignVolunteerToDonation,
    advanceVolunteerProgress,
    setIsQrScannerOpen,
  } = useApp();

  // Tasks available for volunteers to pick up
  const availableTasks = donations.filter(
    (d) =>
      (d.status === 'matched' || d.status === 'pickup_scheduled') &&
      !d.assignedVolunteerId
  );

  // Active task assigned to current volunteer
  const myActiveTask = donations.find(
    (d) =>
      d.assignedVolunteerId === currentUser.id &&
      d.status !== 'completed' &&
      d.status !== 'cancelled'
  );

  // Completed deliveries
  const myCompletedTasks = donations.filter(
    (d) => d.assignedVolunteerId === currentUser.id && d.status === 'completed'
  );

  const handleAdvanceStep = (donationId: string) => {
    advanceVolunteerProgress(donationId);
    try {
      confetti({ particleCount: 50, spread: 70 });
    } catch (e) {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Volunteer Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-amber-500/30 shadow-lg"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white">{currentUser.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-xs">
                <Truck className="w-3.5 h-3.5" /> Rapid Volunteer Courier
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Vehicle: Electric 2-Wheeler (Insulated Transport Box) • Santhome Hub
            </p>
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {currentUser.badges.map((b) => (
                <span key={b} className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-amber-300 border border-white/10">
                  🎖️ {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Volunteer Points</span>
            <p className="text-xl font-extrabold text-amber-400">{currentUser.points} PTS</p>
          </div>
          <button
            onClick={() => setIsQrScannerOpen(true)}
            className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Verification Pass</span>
          </button>
        </div>
      </div>

      {/* Active In-Progress Rescue Mission Card */}
      {myActiveTask && (
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-700/60 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Active Rescue Task In-Flight
              </span>
            </div>
            <span className="font-mono text-xs font-bold bg-white/10 px-2.5 py-1 rounded-lg">
              Mission ID: {myActiveTask.id}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">{myActiveTask.title}</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Surplus Volume: <strong>{myActiveTask.quantity} {myActiveTask.unit}</strong> ({myActiveTask.category})
                </p>
              </div>

              {/* Waypoint Steps */}
              <div className="space-y-3 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-emerald-600 rounded-lg text-white mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Origin (Donor Location):</span>
                    <p className="font-bold text-white">{myActiveTask.donorType}</p>
                    <p className="text-slate-300 text-[11px]">{myActiveTask.pickupAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-800">
                  <div className="p-1.5 bg-orange-600 rounded-lg text-white mt-0.5">
                    <Navigation className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Destination (Verified NGO Intake):</span>
                    <p className="font-bold text-white">{myActiveTask.matchedNgoName || 'Hope Harvest Food Bank'}</p>
                    <p className="text-slate-300 text-[11px]">102 Seva Lane, George Town</p>
                  </div>
                </div>
              </div>

              {/* Step progression Action Button */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => handleAdvanceStep(myActiveTask.id)}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Advance Mission:{' '}
                    {myActiveTask.status === 'volunteer_assigned' && 'Confirm Arriving at Donor'}
                    {myActiveTask.status === 'arriving' && 'Confirm Food Collected (QR Verified)'}
                    {myActiveTask.status === 'collected' && 'Start In-Transit Delivery'}
                    {myActiveTask.status === 'in_transit' && 'Confirm Handover at NGO'}
                    {myActiveTask.status === 'delivered' && 'Awaiting NGO Quality Inspection'}
                  </span>
                </button>
              </div>
            </div>

            {/* Live Navigation Map View */}
            <div className="h-64 rounded-2xl overflow-hidden border border-slate-800">
              <InteractiveFoodMap
                donations={[myActiveTask]}
                users={users}
                onSelectDonation={onSelectDonation}
                selectedDonationId={myActiveTask.id}
                heightClass="h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Available Pickup Tasks Nearby */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <span>Available Pickup Tasks Nearby ({availableTasks.length})</span>
          </h2>
          <span className="text-xs text-slate-500">Pick up & deliver within target window</span>
        </div>

        {availableTasks.length === 0 ? (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
            No unassigned pickup tasks in your dispatch zone at this moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableTasks.map((task) => (
              <div
                key={task.id}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                      {task.id}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{task.title}</h3>
                  </div>
                  {task.isEmergencyRescue && (
                    <span className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold animate-pulse">
                      Urgent Rescue
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500">
                  Pickup: <strong>{task.pickupAddress}</strong> • Volume: {task.quantity} {task.unit}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700">
                    Earn +80 Volunteer Points
                  </span>

                  <button
                    onClick={() => assignVolunteerToDonation(task.id, currentUser.id)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Accept Pickup Mission &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Missions History */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600" />
          <span>Completed Volunteer Deliveries ({myCompletedTasks.length})</span>
        </h2>

        {myCompletedTasks.length === 0 ? (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
            Completed delivery records and community impact certificates will be archived here.
          </div>
        ) : (
          <div className="space-y-2">
            {myCompletedTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{task.id}</span>
                  <h4 className="text-xs font-bold text-slate-800">{task.title}</h4>
                </div>
                <button
                  onClick={() => onOpenCertificate(task)}
                  className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
                >
                  View Certificate &rarr;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
