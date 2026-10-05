import React from 'react';
import { AlertTriangle, Clock, Flame, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EmergencyRescueBannerProps {
  onNavigateToEmergency: () => void;
}

export const EmergencyRescueBanner: React.FC<EmergencyRescueBannerProps> = ({ onNavigateToEmergency }) => {
  const { donations } = useApp();

  const emergencyDonations = donations.filter(
    (d) => d.isEmergencyRescue && d.status !== 'completed' && d.status !== 'cancelled'
  );

  if (emergencyDonations.length === 0) return null;

  const topEmergency = emergencyDonations[0];

  return (
    <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white shadow-md relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
          <span className="flex items-center justify-center p-1 bg-white/20 rounded-full animate-pulse">
            <Flame className="w-4 h-4 text-amber-200" />
          </span>
          <span className="font-bold uppercase tracking-wider text-xs px-2 py-0.5 rounded bg-black/30 border border-white/20">
            Emergency Food Rescue
          </span>
          <span className="font-medium text-white/95">
            {emergencyDonations.length} urgent surplus food listing{emergencyDonations.length > 1 ? 's' : ''} expiring soon:{' '}
            <strong className="underline decoration-white/50">{topEmergency.title}</strong> ({topEmergency.quantity} {topEmergency.unit})
          </span>
        </div>

        <button
          onClick={onNavigateToEmergency}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-orange-700 font-bold rounded-full text-xs hover:bg-orange-50 transition shadow-sm flex-shrink-0 cursor-pointer"
        >
          <span>Respond to Emergency</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
