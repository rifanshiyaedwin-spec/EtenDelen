import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award, Trophy, Medal, Sparkles, Utensils, Truck, Heart } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { leaderboard, users } = useApp();
  const [filterRole, setFilterRole] = useState<'all' | 'donor' | 'volunteer'>('all');

  const filtered = leaderboard.filter(
    (u) => filterRole === 'all' || u.role === filterRole
  );

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-md ring-2 ring-amber-300">
            🥇
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
            🥈
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-black flex items-center justify-center text-sm shadow-md">
            🥉
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
            #{rank}
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>EtenDelen Community Gamification & Badges</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Food Rescue Champions & Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Recognizing outstanding corporate donors, hotel chefs, and volunteer couriers driving zero food waste.
        </p>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 text-xs font-bold">
          <button
            onClick={() => setFilterRole('all')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              filterRole === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Champions
          </button>
          <button
            onClick={() => setFilterRole('donor')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              filterRole === 'donor' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-emerald-600" />
            <span>Top Donors</span>
          </button>
          <button
            onClick={() => setFilterRole('volunteer')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              filterRole === 'volunteer' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-amber-600" />
            <span>Top Volunteers</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Table List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
        {filtered.map((user) => (
          <div
            key={user.userId}
            className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-4">
              {getRankBadge(user.rank)}

              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
              />

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{user.name}</h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      user.role === 'donor'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                {user.organization && (
                  <p className="text-xs text-slate-500 font-medium">{user.organization}</p>
                )}
                <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                  {user.badges.map((b) => (
                    <span
                      key={b}
                      className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[9px] font-bold"
                    >
                      🏆 {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-base sm:text-lg font-black text-purple-700">
                {user.points.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400">PTS</span>
              </span>
              <p className="text-[11px] text-slate-500">
                {user.donationsOrPickupsCount} Rescues • {user.totalKg} kg saved
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
