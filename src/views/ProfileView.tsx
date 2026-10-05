import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import {
  User as UserIcon,
  Building,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  Lock,
  Save,
  LogOut,
  CheckCircle2,
  Truck,
  HeartHandshake,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProfileViewProps {
  onNavigate: (view: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const { currentUser, setCurrentUser, logout, openAuthModal } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [orgName, setOrgName] = useState(currentUser.organizationName || '');
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [capacity, setCapacity] = useState(currentUser.capacityKg || 300);
  const [vehicle, setVehicle] = useState(currentUser.vehicleType || 'Electric 2-Wheeler');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name,
      organizationName: orgName || currentUser.organizationName,
      phone,
      address,
      bio,
      capacityKg: capacity,
      vehicleType: vehicle,
    });
    setSavedSuccess(true);
    try {
      confetti({ particleCount: 40, spread: 60 });
    } catch (e) {}
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLogout = () => {
    logout();
    openAuthModal('login');
    onNavigate('landing');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-emerald-500/30 shadow-lg"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{currentUser.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-500 text-slate-950">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {currentUser.organizationName || 'Individual Stakeholder'} • {currentUser.email}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-amber-300 font-bold">
                ⭐ {currentUser.points} Community Contribution Points
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Badges Earned */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Earned Sustainability & Rescue Badges</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {currentUser.badges.map((b) => (
            <span
              key={b}
              className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <span>🏆</span>
              <span>{b}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Edit Details Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-emerald-600" />
            <span>Account & Organization Settings</span>
          </h3>
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" /> Changes Saved!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full / Representative Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Organization / Brand Name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={currentUser.email}
              className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs text-slate-500 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Physical Address / Pickup Gate</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
          />
        </div>

        {currentUser.role === 'ngo' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Daily Food Intake Capacity (kg)</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value) || 100)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
            />
          </div>
        )}

        {currentUser.role === 'volunteer' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Courier Vehicle</label>
            <input
              type="text"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">About / Bio</label>
          <textarea
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs resize-none"
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Updates</span>
          </button>
        </div>
      </form>
    </div>
  );
};
