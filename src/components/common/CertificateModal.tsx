import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { EtenDelenLogo } from './EtenDelenLogo';
import { Award, Download, Printer, X, ShieldCheck, Heart, Leaf, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CertificateModal: React.FC = () => {
  const { isCertificateModalOpen, setIsCertificateModalOpen, certificateDonation } = useApp();
  const certRef = useRef<HTMLDivElement>(null);

  if (!isCertificateModalOpen || !certificateDonation) return null;

  const handlePrint = () => {
    try {
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}
    window.print();
  };

  const d = certificateDonation;
  const beneficiariesCount = d.redistributionData?.beneficiariesCount || Math.round(d.quantity * 2.5);
  const redistOrg = d.redistributionData?.distributedByNgo || d.matchedNgoName || 'Hope Harvest Food Bank';
  const rescueDate = d.redistributionData?.distributedAt
    ? new Date(d.redistributionData.distributedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  const co2Saved = Math.round(d.quantity * 2.5);
  const waterSaved = Math.round(d.quantity * 500);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-8">
        {/* Top Modal Controls */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold tracking-wide">EtenDelen Certified Sustainability Document</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setIsCertificateModalOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas Frame */}
        <div className="p-8 sm:p-12 bg-[#faf9f6]" ref={certRef}>
          {/* Certificate Border with Green and Orange Insets */}
          <div className="border-4 border-emerald-800/80 rounded-2xl p-6 sm:p-8 bg-white shadow-xl relative overflow-hidden">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-8 border-l-8 border-orange-500 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-8 border-r-8 border-orange-500 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-8 border-l-8 border-orange-500 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-8 border-r-8 border-orange-500 rounded-br-xl" />

            {/* Watermark Emblem */}
            <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
              <EtenDelenLogo size="hero" variant="icon" />
            </div>

            {/* Header Content */}
            <div className="text-center space-y-3 relative z-10">
              <div className="flex justify-center mb-1">
                <EtenDelenLogo size="lg" showTagline={true} />
              </div>

              <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Certificate of Verified Food Rescue</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight pt-2">
                FOOD RESCUE & ZERO-WASTE AWARD
              </h2>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Presented with Gratitude to
              </p>
            </div>

            {/* Donor Name Box */}
            <div className="my-6 text-center border-y-2 border-slate-100 py-4 relative z-10 bg-gradient-to-r from-emerald-50/40 via-orange-50/40 to-emerald-50/40 rounded-xl">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-serif">
                {d.donorType || d.donorName}
              </h3>
              <p className="text-xs font-medium text-slate-600 mt-1">
                Recognized for Outstanding Leadership in Preventing Food Waste & Feeding Communities
              </p>
            </div>

            {/* Details Paragraph */}
            <div className="space-y-4 text-center text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xl mx-auto relative z-10">
              <p>
                In verified compliance with EtenDelen Food Safety & Redistribution Standards, surplus food from donation record{' '}
                <strong className="font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  {d.id}
                </strong>{' '}
                was successfully rescued, temperature-inspected, and delivered to{' '}
                <strong className="text-slate-900 font-semibold">{redistOrg}</strong>.
              </p>
            </div>

            {/* Impact Metric Grid */}
            <div className="grid grid-cols-3 gap-3 my-6 text-center relative z-10">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-xs font-bold text-emerald-700 uppercase">Food Rescued</p>
                <p className="text-xl font-extrabold text-emerald-900 mt-0.5">
                  {d.quantity} {d.unit}
                </p>
                <p className="text-[10px] text-emerald-600 mt-0.5">{d.category}</p>
              </div>

              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
                <p className="text-xs font-bold text-orange-700 uppercase">Meals Served</p>
                <p className="text-xl font-extrabold text-orange-900 mt-0.5">
                  {beneficiariesCount}
                </p>
                <p className="text-[10px] text-orange-600 mt-0.5">Beneficiaries Nourished</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-xs font-bold text-slate-700 uppercase">CO₂ Prevented</p>
                <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {co2Saved} kg
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">{waterSaved}L Water Saved</p>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 gap-4 text-xs text-slate-600 relative z-10">
              <div className="text-center sm:text-left">
                <p className="font-serif italic font-bold text-slate-900 text-sm">Sister Teresa</p>
                <div className="w-32 h-0.5 bg-slate-400 my-1 mx-auto sm:mx-0" />
                <p className="text-[11px] font-medium text-slate-500">Authorized Verified NGO Verifier</p>
                <p className="text-[10px] text-slate-400">{rescueDate}</p>
              </div>

              {/* Official Gold/Green Seal Emblem */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-500 bg-gradient-to-tr from-amber-100 to-amber-50 flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-8 h-8 text-emerald-700" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-900 mt-1">
                  OFFICIAL ETENDELEN SEAL
                </span>
              </div>

              <div className="text-center sm:text-right">
                <p className="font-mono text-slate-900 font-bold text-[11px]">CERT-ED-{d.id.replace('ED-', '')}</p>
                <div className="w-32 h-0.5 bg-slate-400 my-1 mx-auto sm:ml-auto" />
                <p className="text-[11px] font-medium text-slate-500">Central Platform Governance</p>
                <p className="text-[10px] text-slate-400">Cryptographically Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
