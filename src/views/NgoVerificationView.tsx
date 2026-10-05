import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Upload, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NgoVerificationViewProps {
  onNavigate: (view: string) => void;
}

export const NgoVerificationView: React.FC<NgoVerificationViewProps> = ({ onNavigate }) => {
  const { currentUser, setCurrentUser } = useApp();

  const [orgName, setOrgName] = useState(currentUser.organizationName || 'Hope Harvest Food Bank');
  const [regNumber, setRegNumber] = useState(currentUser.verificationDocs?.docNumber || 'NGO-TN-2024-8902');
  const [docType, setDocType] = useState(currentUser.verificationDocs?.docType || '12A & 80G Certified Non-Profit Registration');
  const [fssaiLicense, setFssaiLicense] = useState('FSSAI-FED-2026-99128');
  const [address, setAddress] = useState(currentUser.address || '102 Seva Lane, George Town, Chennai');
  const [contactPhone, setContactPhone] = useState(currentUser.phone || '+91 98405 67890');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      organizationName: orgName,
      address,
      phone: contactPhone,
      verificationStatus: 'pending',
      verificationDocs: {
        docType,
        docNumber: regNumber,
        docUrl: 'https://example.com/docs/verified-ngo-credential.pdf',
        submittedAt: new Date().toISOString(),
      },
    });

    setSubmitted(true);
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {}
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>NGO Trust & Verification Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Organization Verification & Credentialing
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Only verified NGOs and Food Banks are granted access to receive and redistribute surplus food on the EtenDelen network.
        </p>
      </div>

      {/* Verification Status Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {currentUser.verified ? (
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
          ) : (
            <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Current Status:{' '}
                <span className={currentUser.verified ? 'text-emerald-700' : 'text-amber-700'}>
                  {currentUser.verified ? '✓ Verified NGO Partner' : 'Verification Under Review'}
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser.verified
                ? 'Your organization is authorized for instant surplus matching and volunteer dispatch.'
                : 'Central admin audit in progress. Review takes 2-4 hours.'}
            </p>
          </div>
        </div>
      </div>

      {/* Verification Submission Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>Organization Verification Dossier</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Organization Legal Name *</label>
            <input
              type="text"
              required
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Document Type *</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-slate-50"
            >
              <option value="12A & 80G Certified Non-Profit Registration">12A & 80G Non-Profit Certificate</option>
              <option value="Public Charitable Trust Deed">Public Charitable Trust Deed</option>
              <option value="Societies Registration Act Certificate">Societies Registration Certificate</option>
              <option value="Municipal Food Relief Authorization">Municipal Food Relief License</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Govt Registration / DARPAN ID *</label>
            <input
              type="text"
              required
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Food Safety / FSSAI License Number</label>
            <input
              type="text"
              required
              value={fssaiLicense}
              onChange={(e) => setFssaiLicense(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Address *</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Primary Hotline Contact *</label>
            <input
              type="text"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* Upload Box */}
        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2 bg-slate-50">
          <Upload className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-xs font-bold text-slate-700">Attach Scanned Registration PDF / Seal Document</p>
          <p className="text-[10px] text-slate-400">Supported formats: PDF, JPG, PNG up to 15MB</p>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <button
            type="button"
            onClick={() => onNavigate('ngo_dashboard')}
            className="text-xs font-bold text-slate-600 hover:underline"
          >
            &larr; Back to NGO Dashboard
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            {submitted ? '✓ Dossier Updated & Submitted' : 'Submit Credentials for Verification'}
          </button>
        </div>
      </form>
    </div>
  );
};
