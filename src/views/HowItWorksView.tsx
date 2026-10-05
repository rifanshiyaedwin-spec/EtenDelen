import React from 'react';
import { EtenDelenLogo } from '../components/common/EtenDelenLogo';
import {
  Utensils,
  Sparkles,
  HeartHandshake,
  Truck,
  ShieldCheck,
  Award,
  Flame,
  QrCode,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface HowItWorksViewProps {
  onNavigate: (view: string) => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <EtenDelenLogo size="lg" showTagline={true} />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight pt-3">
          How EtenDelen Works
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          EtenDelen provides a reliable, verified, and end-to-end audited infrastructure that guarantees surplus food reaches vulnerable communities swiftly while maintaining rigorous food safety standards.
        </p>
      </div>

      {/* 6 Step Cards Detailed */}
      <div className="space-y-6">
        {[
          {
            step: '01',
            title: 'Food Surplus Registration',
            role: 'Donors (Restaurants, Hotels, Supermarkets, Caterers)',
            desc: 'Donors register excess prepared meals, baked goods, dairy, or fresh produce with photos. The AI auto-detects shelf life, required storage holding temperatures, and food allergen profiles.',
            icon: Utensils,
            color: 'bg-emerald-600 text-white',
          },
          {
            step: '02',
            title: 'Intelligent AI Matching',
            role: 'AI Algorithm & Proximity Engine',
            desc: 'The platform calculates match scores for nearby verified NGOs based on distance, intake capacity, dietary requirements, and current cold storage capability.',
            icon: Sparkles,
            color: 'bg-purple-600 text-white',
          },
          {
            step: '03',
            title: 'Acceptance & Pickup Window Scheduling',
            role: 'Verified NGOs & Food Banks',
            desc: 'Authorized NGOs review food specifications and claim the surplus food. A synchronized pickup time window is established.',
            icon: HeartHandshake,
            color: 'bg-orange-600 text-white',
          },
          {
            step: '04',
            title: 'Volunteer Dispatch & QR Verification',
            role: 'Volunteer Couriers',
            desc: 'Nearby volunteers receive turn-by-turn navigation, arrive with insulated carrying gear, and perform digital QR scan checks at the donor kitchen.',
            icon: Truck,
            color: 'bg-amber-500 text-slate-950',
          },
          {
            step: '05',
            title: 'Intake Inspection & Quality Certification',
            role: 'NGO Food Safety Verifiers',
            desc: 'Upon delivery, food safety parameters (core probe temperature, packaging seals, actual weight) are recorded before approval for consumption.',
            icon: ShieldCheck,
            color: 'bg-teal-600 text-white',
          },
          {
            step: '06',
            title: 'Community Redistribution & Digital Award',
            role: 'Shelters & Beneficiaries',
            desc: 'Meals are distributed directly to shelter residents and community beneficiaries. The platform issues an official EtenDelen Food Rescue Certificate.',
            icon: Award,
            color: 'bg-slate-900 text-white',
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start gap-6 hover:shadow-md transition"
            >
              <div className={`p-4 rounded-2xl ${item.color} shadow-sm flex-shrink-0`}>
                <Icon className="w-8 h-8" />
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    STAGE {item.step}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{item.role}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Rescue Feature Callout */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full w-fit">
            <Flame className="w-4 h-4 text-amber-200" />
            <span>Emergency Food Rescue Protocol</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">Food Expiring in Under 3 Hours?</h3>
          <p className="text-xs sm:text-sm text-orange-100 max-w-xl">
            When Emergency Mode is triggered, our system broadcasts high-priority push notifications and moves the listing to top-priority courier routing.
          </p>
        </div>

        <button
          onClick={() => onNavigate('create_donation')}
          className="px-6 py-3.5 bg-white hover:bg-orange-50 text-orange-800 font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition cursor-pointer flex-shrink-0"
        >
          Post Emergency Surplus Food &rarr;
        </button>
      </div>
    </div>
  );
};
