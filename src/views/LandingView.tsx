import React from 'react';
import { EtenDelenLogo } from '../components/common/EtenDelenLogo';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { FoodCard } from '../components/food/FoodCard';
import { InteractiveFoodMap } from '../components/map/InteractiveFoodMap';
import { FoodDonation } from '../types';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Truck,
  Leaf,
  Users,
  Utensils,
  Award,
  Zap,
  BarChart3,
  Flame,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface LandingViewProps {
  onNavigate: (view: string) => void;
  onSelectDonation: (donation: FoodDonation) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  onSelectDonation,
}) => {
  const { t } = useLanguage();
  const { donations, users, impactStats, switchUserRole } = useApp();

  const activeDonations = donations.filter(
    (d) => d.status !== 'completed' && d.status !== 'cancelled'
  );

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-18 lg:pb-28 bg-gradient-to-b from-emerald-950 via-slate-950 to-slate-900 text-white">
        {/* Glow ambient lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wide shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Share Surplus. Reduce Waste. Feed Communities.</span>
            </div>

            {/* Official Logo Banner */}
            <div className="flex justify-center py-2">
              <EtenDelenLogo size="hero" showTagline={false} variant="inverted" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Prevent Edible Food Waste.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-orange-400">
                Redistribute to People in Need.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Connecting restaurants, hotels, supermarkets, caterers, and households with verified NGOs, food banks, and rapid volunteer couriers.
            </p>

            {/* Action CTAs */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('create_donation')}
                className="px-7 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm sm:text-base shadow-xl hover:shadow-emerald-500/30 transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <Utensils className="w-5 h-5 text-slate-900" />
                <span>{t.hero.donateButton}</span>
              </button>

              <button
                onClick={() => onNavigate('browse')}
                className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm sm:text-base backdrop-blur-md transition flex items-center gap-2 cursor-pointer"
              >
                <span>{t.hero.findFoodButton}</span>
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </button>

              <button
                onClick={() => {
                  switchUserRole('volunteer');
                  onNavigate('volunteer_dashboard');
                }}
                className="px-6 py-4 rounded-2xl bg-orange-600/90 hover:bg-orange-500 text-white font-bold text-sm sm:text-base shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Truck className="w-5 h-5 text-orange-200" />
                <span>{t.hero.volunteerButton}</span>
              </button>
            </div>
          </div>

          {/* Live Impact Counter Metric Grid */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md text-center space-y-1">
              <div className="inline-flex p-2 bg-emerald-500/10 text-emerald-400 rounded-xl mb-1">
                <Utensils className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                {(impactStats.totalFoodRescuedKg).toLocaleString()} <span className="text-sm font-medium text-emerald-400">kg</span>
              </p>
              <p className="text-xs text-slate-400 font-medium">{t.stats.foodRescued}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md text-center space-y-1">
              <div className="inline-flex p-2 bg-orange-500/10 text-orange-400 rounded-xl mb-1">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                {(impactStats.beneficiariesSupported).toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 font-medium">{t.stats.beneficiariesServed}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md text-center space-y-1">
              <div className="inline-flex p-2 bg-teal-500/10 text-teal-400 rounded-xl mb-1">
                <Leaf className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                {(impactStats.estimatedCo2SavedKg).toLocaleString()} <span className="text-sm font-medium text-teal-400">kg</span>
              </p>
              <p className="text-xs text-slate-400 font-medium">{t.stats.wastePrevented}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md text-center space-y-1">
              <div className="inline-flex p-2 bg-amber-500/10 text-amber-400 rounded-xl mb-1">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                {impactStats.verifiedNgos} Hubs
              </p>
              <p className="text-xs text-slate-400 font-medium">{t.stats.verifiedNgos}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Live Surplus Food Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full mb-2">
              <Flame className="w-3.5 h-3.5 text-orange-600" />
              <span>Real-Time Surplus Listings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Surplus Food Ready for Redistribution
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Inspected, packed, and awaiting verified NGO or volunteer pickup.
            </p>
          </div>

          <button
            onClick={() => onNavigate('browse')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition cursor-pointer"
          >
            <span>View All Surplus Food ({donations.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeDonations.slice(0, 3).map((donation) => (
            <FoodCard
              key={donation.id}
              donation={donation}
              onViewDetails={onSelectDonation}
            />
          ))}
        </div>
      </section>

      {/* Interactive Map Live Dispatch Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 p-6 sm:p-10 rounded-3xl text-white shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Spatial Logistics Network
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Live Geographic Food Rescue Map
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
                Real-time tracking of surplus food locations, verified NGO receiving centers, and active courier routes across the city.
              </p>
            </div>

            <button
              onClick={() => onNavigate('map_view')}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition cursor-pointer self-start sm:self-center"
            >
              Open Fullscreen Interactive Map &rarr;
            </button>
          </div>

          <InteractiveFoodMap
            donations={donations}
            users={users}
            onSelectDonation={onSelectDonation}
            heightClass="h-[380px]"
          />
        </div>
      </section>

      {/* 6-Step End-to-End Workflow Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>Core Workflow & Logistics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.workflow.title}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t.workflow.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              step: '1',
              title: t.workflow.step1,
              desc: t.workflow.step1Desc,
              icon: Utensils,
              color: 'bg-emerald-500 text-white',
            },
            {
              step: '2',
              title: t.workflow.step2,
              desc: t.workflow.step2Desc,
              icon: Sparkles,
              color: 'bg-purple-600 text-white',
            },
            {
              step: '3',
              title: t.workflow.step3,
              desc: t.workflow.step3Desc,
              icon: HeartHandshake,
              color: 'bg-orange-600 text-white',
            },
            {
              step: '4',
              title: t.workflow.step4,
              desc: t.workflow.step4Desc,
              icon: Truck,
              color: 'bg-amber-500 text-slate-950',
            },
            {
              step: '5',
              title: t.workflow.step5,
              desc: t.workflow.step5Desc,
              icon: ShieldCheck,
              color: 'bg-teal-600 text-white',
            },
            {
              step: '6',
              title: t.workflow.step6,
              desc: t.workflow.step6Desc,
              icon: Award,
              color: 'bg-slate-900 text-white',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl ${item.color} shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono font-black text-2xl text-slate-200">0{item.step}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-4">{item.title}</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Integrated Quality & GPS Check</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Features Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>AI Assistance Engine</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Smart Food Classification, Expiry Risk & Demand Prediction
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                EtenDelen utilizes intelligent computer vision and predictive models to assist donors in registering surplus, calculate cold chain requirements, and forecast neighborhood hunger hot spots.
              </p>
              <div className="space-y-3 pt-2 text-xs text-slate-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Instant Food Image Recognition:</strong> Automatically detects category, allergens, and shelf life.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Expiry Urgency Scoring:</strong> Triggers Emergency Food Rescue workflows for near-expiry supplies.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Predictive Demand Allocation:</strong> Routes high-protein cooked surplus directly to high-capacity night shelters.</span>
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('ai_analysis')}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition cursor-pointer"
                >
                  Explore AI Food Intelligence &rarr;
                </button>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-400">AI Match & Prediction Terminal</span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono">MODEL v2.4</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <div className="flex justify-between font-bold text-white">
                    <span>Cooked Meals (Buffet Surplus)</span>
                    <span className="text-emerald-400">96% Match</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Optimal recipient: Hope Harvest Food Bank (Insulated van on standby, 180 dinner slots needed).
                  </p>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <div className="flex justify-between font-bold text-white">
                    <span>Dairy Products (Milk & Paneer)</span>
                    <span className="text-orange-400">Critical Expiry Warning</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Hold time: 2.5 hours at 3.2°C. Fast-track volunteer dispatch recommended.
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-200">
                🛡️ AI suggestions serve as operational assistance; food safety certification is always validated by on-site human verifiers.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-orange-600 text-white shadow-2xl space-y-6">
          <EtenDelenLogo size="lg" showTagline={true} variant="inverted" />
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto">
            Ready to Make Zero Food Waste a Reality in Your City?
          </h2>
          <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto">
            Join hundreds of restaurants, food banks, and volunteers creating a resilient food-secure future.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('create_donation')}
              className="px-8 py-4 bg-slate-950 hover:bg-slate-900 text-white font-black text-sm rounded-2xl shadow-xl transition cursor-pointer"
            >
              Start Donating Surplus Today
            </button>
            <button
              onClick={() => {
                switchUserRole('ngo');
                onNavigate('ngo_verification');
              }}
              className="px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-2xl shadow-xl transition cursor-pointer"
            >
              Register NGO for Food Allocation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
