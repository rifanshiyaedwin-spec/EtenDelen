import React from 'react';
import { EtenDelenLogo } from './EtenDelenLogo';
import { ShieldCheck, Heart, Leaf, PhoneCall, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1 & 2: Branding & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <EtenDelenLogo size="md" showTagline={true} variant="inverted" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              EtenDelen is an intelligent surplus food management and redistribution platform connecting restaurants, hotels, grocers, and caterers with verified food banks, volunteers, and vulnerable communities.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <Leaf className="w-4 h-4" /> 100% Zero Food Waste Goal
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-orange-400">
                <ShieldCheck className="w-4 h-4" /> Verified NGO Network
              </span>
            </div>
          </div>

          {/* Col 3: Role Portals */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">User Portals</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('donor_dashboard')} className="hover:text-emerald-400 transition cursor-pointer">
                  Food Donor Portal (Hotels & Cafes)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ngo_dashboard')} className="hover:text-emerald-400 transition cursor-pointer">
                  Verified NGO & Food Banks
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('volunteer_dashboard')} className="hover:text-emerald-400 transition cursor-pointer">
                  Volunteer Courier Hub
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('beneficiary_dashboard')} className="hover:text-emerald-400 transition cursor-pointer">
                  Community Beneficiary Assistance
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin_dashboard')} className="hover:text-emerald-400 transition cursor-pointer">
                  Admin Platform Governance
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Workflows */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('browse')} className="hover:text-orange-400 transition cursor-pointer">
                  Surplus Food Listings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('emergency_rescue')} className="hover:text-orange-400 transition cursor-pointer">
                  Emergency Food Rescue
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how_it_works')} className="hover:text-orange-400 transition cursor-pointer">
                  Smart AI Matching & Verification
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('impact')} className="hover:text-orange-400 transition cursor-pointer">
                  Impact & Sustainability Metrics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('leaderboard')} className="hover:text-orange-400 transition cursor-pointer">
                  Community Leaderboard & Badges
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Food Safety & Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Safety & Dispatch</h4>
            <div className="text-xs text-slate-400 space-y-2.5">
              <div className="flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>24/7 Rescue Dispatch: <strong className="text-white">+91 1800-3836-335</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <span>support@etendelen.org</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>EtenDelen Open Food Network</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 EtenDelen. All rights reserved. “Share Surplus. Reduce Waste. Feed Communities.”</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Food Safety Standard FSSAI/WHO</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy & Data Charter</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Redistribution</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
