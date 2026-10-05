import React, { useEffect, useRef, useState } from 'react';
import { FoodDonation, User } from '../../types';
import { MapPin, Navigation, Compass, Layers, ShieldCheck, Flame } from 'lucide-react';

interface InteractiveFoodMapProps {
  donations: FoodDonation[];
  users: User[];
  onSelectDonation: (donation: FoodDonation) => void;
  selectedDonationId?: string;
  heightClass?: string;
}

export const InteractiveFoodMap: React.FC<InteractiveFoodMapProps> = ({
  donations,
  users,
  onSelectDonation,
  selectedDonationId,
  heightClass = 'h-[480px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [filterType, setFilterType] = useState<'all' | 'donations' | 'ngos' | 'volunteers'>('all');
  const [activePin, setActivePin] = useState<{ id: string; type: string; title: string; subtitle: string; status?: string } | null>(null);

  // Fallback interactive visual SVG Map with realistic spatial coordinates & pins
  // Rendered cleanly so it works smoothly in all browser environments
  const centerLat = 13.0600;
  const centerLng = 80.2500;

  // Convert GPS lat/lng to container % coordinates
  const projectCoordinates = (lat: number, lng: number) => {
    // Chennai bounding box approx 13.00 to 13.12 lat, 80.18 to 80.30 lng
    const minLat = 13.01;
    const maxLat = 13.11;
    const minLng = 80.19;
    const maxLng = 80.29;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;

    return {
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(10, Math.min(90, y)),
    };
  };

  const filteredDonations = donations.filter(
    (d) => filterType === 'all' || filterType === 'donations'
  );
  const ngos = users.filter((u) => u.role === 'ngo' && (filterType === 'all' || filterType === 'ngos'));
  const volunteers = users.filter((u) => u.role === 'volunteer' && (filterType === 'all' || filterType === 'volunteers'));

  return (
    <div className={`relative w-full ${heightClass} rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl select-none`}>
      {/* Map Background Grids & Land Layout representation */}
      <div className="absolute inset-0 bg-[#0f172a]">
        {/* Subtle grid lines */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Coastal Ocean Line / Coastline on East (Chennai Geography) */}
        <svg className="w-full h-full opacity-30 absolute inset-0 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 600">
          <path
            d="M 800,0 Q 750,200 820,400 T 840,600 L 1000,600 L 1000,0 Z"
            fill="#0284c7"
            opacity="0.4"
          />
          {/* Main Arterial Roadways */}
          <path d="M 0,280 Q 400,290 800,310" stroke="#334155" strokeWidth="6" fill="none" />
          <path d="M 350,0 Q 420,300 480,600" stroke="#334155" strokeWidth="6" fill="none" />
          <path d="M 150,100 L 780,500" stroke="#1e293b" strokeWidth="4" fill="none" />
          <path d="M 120,500 L 680,80" stroke="#1e293b" strokeWidth="4" fill="none" />

          {/* Active Volunteer Route Polyline (Simulated GPS track) */}
          <path
            d="M 380,240 Q 450,260 520,380"
            stroke="#10b981"
            strokeWidth="4"
            strokeDasharray="8 6"
            className="animate-pulse"
            fill="none"
          />
        </svg>
      </div>

      {/* Top Map Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filterType === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Live Pins ({donations.length + ngos.length + volunteers.length})
          </button>
          <button
            onClick={() => setFilterType('donations')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filterType === 'donations' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Donations ({donations.length})
          </button>
          <button
            onClick={() => setFilterType('ngos')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filterType === 'ngos' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            NGO Hubs ({ngos.length})
          </button>
          <button
            onClick={() => setFilterType('volunteers')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filterType === 'volunteers' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Couriers ({volunteers.length})
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Real-time GPS Dispatch Active (Chennai Metro)</span>
        </div>
      </div>

      {/* Map Interactive Pins */}
      <div className="absolute inset-0 z-10">
        {/* 1. Food Donations Pins (Green / Orange if Emergency) */}
        {filteredDonations.map((d) => {
          const pos = projectCoordinates(d.pickupLocation.lat, d.pickupLocation.lng);
          const isSelected = d.id === selectedDonationId;
          const isEmergency = d.isEmergencyRescue;

          return (
            <div
              key={d.id}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => {
                onSelectDonation(d);
                setActivePin({
                  id: d.id,
                  type: 'donation',
                  title: d.title,
                  subtitle: `${d.quantity} ${d.unit} • ${d.donorType}`,
                  status: d.status,
                });
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transform transition-all duration-300 hover:scale-125 z-20"
            >
              <div className="relative">
                {/* Ping wave */}
                <div
                  className={`absolute -inset-1 rounded-full animate-ping opacity-40 ${
                    isEmergency ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                />
                <div
                  className={`px-2 py-1 rounded-xl shadow-lg border text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap ${
                    isEmergency
                      ? 'bg-red-600 text-white border-red-300 shadow-red-500/50'
                      : isSelected
                      ? 'bg-white text-emerald-900 border-emerald-500 ring-2 ring-emerald-500'
                      : 'bg-emerald-600 text-white border-emerald-300 shadow-emerald-900/40'
                  }`}
                >
                  {isEmergency ? <Flame className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                  <span>{d.quantity} {d.unit}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* 2. NGO Hub Pins (Orange) */}
        {ngos.map((ngo) => {
          const pos = projectCoordinates(ngo.location.lat, ngo.location.lng);
          return (
            <div
              key={ngo.id}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() =>
                setActivePin({
                  id: ngo.id,
                  type: 'ngo',
                  title: ngo.organizationName || ngo.name,
                  subtitle: `Verified NGO • Capacity: ${ngo.capacityKg || 500}kg`,
                })
              }
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transform transition-all duration-300 hover:scale-125 z-20"
            >
              <div className="p-2 rounded-full bg-orange-600 text-white border-2 border-white shadow-lg flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
          );
        })}

        {/* 3. Volunteer Pins (Amber / Live Courier) */}
        {volunteers.map((vol) => {
          const pos = projectCoordinates(vol.location.lat, vol.location.lng);
          return (
            <div
              key={vol.id}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() =>
                setActivePin({
                  id: vol.id,
                  type: 'volunteer',
                  title: vol.name,
                  subtitle: `Active Volunteer Courier • Rating: 4.9★`,
                })
              }
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transform transition-all duration-300 hover:scale-125 z-20"
            >
              <div className="p-2 rounded-full bg-amber-500 text-slate-950 border-2 border-white shadow-lg flex items-center justify-center">
                <Navigation className="w-3.5 h-3.5 transform rotate-45" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Active Pin Card Details */}
      {activePin && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-30 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-2xl text-white animate-in slide-in-from-bottom-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                {activePin.type.toUpperCase()} PIN
              </span>
              <h4 className="font-bold text-sm text-white">{activePin.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5">{activePin.subtitle}</p>
            </div>
            <button
              onClick={() => setActivePin(null)}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Bottom Map Legend */}
      <div className="absolute bottom-4 right-4 z-20 hidden md:flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[11px] text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Surplus Food</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>Urgent Rescue</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span>Verified NGO</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span>Courier On Route</span>
        </div>
      </div>
    </div>
  );
};
