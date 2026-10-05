import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QrCode, X, Camera, CheckCircle2, Scan, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const QrScannerModal: React.FC = () => {
  const { isQrScannerOpen, setIsQrScannerOpen, donations, advanceVolunteerProgress, updateDonation } = useApp();
  const [activeTab, setActiveTab] = useState<'scan' | 'generate'>('scan');
  const [selectedDonationId, setSelectedDonationId] = useState<string>(donations[0]?.id || '');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isQrScannerOpen) return null;

  const targetDonation = donations.find((d) => d.id === selectedDonationId) || donations[0];

  const handleSimulateScan = (dId: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      advanceVolunteerProgress(dId);
      setScanResult(`Successfully verified & updated status for ${dId}`);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch (e) {
        // Ignore
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">QR Verification Terminal</h3>
              <p className="text-xs text-slate-400">Scan at pickup, delivery, and distribution points</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsQrScannerOpen(false);
              setScanResult(null);
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('scan');
              setScanResult(null);
            }}
            className={`flex-1 py-3 text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'scan' ? 'bg-white text-emerald-700 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Scan className="w-4 h-4" />
            <span>Verify & Scan QR</span>
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-3 text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'generate' ? 'bg-white text-emerald-700 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>View Donation QR Pass</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {activeTab === 'scan' ? (
            <div className="space-y-4 text-center">
              {/* Camera Scanner Viewport View */}
              <div className="relative mx-auto w-64 h-64 bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center border-2 border-emerald-500/50 shadow-inner">
                {/* Laser scan animation bar */}
                <div className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce shadow-[0_0_8px_#34d399]" />

                <div className="w-44 h-44 border-2 border-dashed border-white/40 rounded-xl flex flex-col items-center justify-center text-white/70 p-4">
                  <Camera className="w-10 h-10 text-emerald-400 mb-2 opacity-80" />
                  <span className="text-[11px] font-medium text-slate-300">Point Camera at Donation Pass</span>
                </div>

                <div className="absolute bottom-2 text-[10px] text-emerald-300 font-mono tracking-wider">
                  SCANNER ACTIVE (1080p AI LENS)
                </div>
              </div>

              {scanResult ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-sm space-y-1">
                  <div className="flex items-center justify-center gap-2 font-bold text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>QR Verification Confirmed!</span>
                  </div>
                  <p className="text-xs text-emerald-700">{scanResult}</p>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-slate-600">
                    Select a donation to simulate real-world volunteer or NGO handoff check:
                  </p>
                  <select
                    value={selectedDonationId}
                    onChange={(e) => setSelectedDonationId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-slate-50 font-medium"
                  >
                    {donations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.id} - {d.title} (Status: {d.status.toUpperCase()})
                      </option>
                    ))}
                  </select>

                  <button
                    disabled={isProcessing}
                    onClick={() => handleSimulateScan(selectedDonationId)}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span>Verifying Cryptographic QR Token...</span>
                    ) : (
                      <>
                        <Scan className="w-4 h-4" />
                        <span>Confirm QR Scan Step</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Donation QR Pass</label>
                <select
                  value={selectedDonationId}
                  onChange={(e) => setSelectedDonationId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-slate-50 font-medium"
                >
                  {donations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.id} - {d.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic QR Code Canvas/SVG representation */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 inline-block mx-auto shadow-xs">
                <svg className="w-44 h-44 mx-auto" viewBox="0 0 200 200">
                  <rect width="200" height="200" fill="#ffffff" rx="8" />
                  {/* Outer Frame Corners */}
                  <rect x="20" y="20" width="45" height="45" fill="#0f172a" rx="4" />
                  <rect x="28" y="28" width="29" height="29" fill="#ffffff" rx="2" />
                  <rect x="34" y="34" width="17" height="17" fill="#16a34a" rx="2" />

                  <rect x="135" y="20" width="45" height="45" fill="#0f172a" rx="4" />
                  <rect x="143" y="28" width="29" height="29" fill="#ffffff" rx="2" />
                  <rect x="149" y="34" width="17" height="17" fill="#16a34a" rx="2" />

                  <rect x="20" y="135" width="45" height="45" fill="#0f172a" rx="4" />
                  <rect x="28" y="143" width="29" height="29" fill="#ffffff" rx="2" />
                  <rect x="34" y="149" width="17" height="17" fill="#16a34a" rx="2" />

                  {/* QR Data Grid Pattern */}
                  <rect x="80" y="25" width="12" height="12" fill="#0f172a" />
                  <rect x="100" y="25" width="12" height="12" fill="#f97316" />
                  <rect x="90" y="45" width="12" height="12" fill="#0f172a" />
                  <rect x="75" y="65" width="24" height="12" fill="#0f172a" />
                  <rect x="105" y="65" width="12" height="24" fill="#16a34a" />

                  <rect x="25" y="80" width="16" height="16" fill="#f97316" />
                  <rect x="48" y="80" width="16" height="16" fill="#0f172a" />
                  <rect x="80" y="95" width="40" height="14" fill="#0f172a" />
                  <rect x="135" y="80" width="20" height="20" fill="#0f172a" />
                  <rect x="160" y="105" width="15" height="15" fill="#f97316" />

                  <rect x="80" y="135" width="15" height="15" fill="#16a34a" />
                  <rect x="105" y="135" width="30" height="15" fill="#0f172a" />
                  <rect x="145" y="140" width="25" height="25" fill="#0f172a" />
                  <rect x="80" y="160" width="20" height="20" fill="#0f172a" />
                  <rect x="110" y="160" width="20" height="20" fill="#f97316" />
                </svg>

                <p className="font-mono text-xs font-bold text-slate-800 mt-3">{targetDonation?.id}</p>
                <p className="text-[10px] text-slate-500">Secure EtenDelen Verified Token</p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl text-left text-xs text-emerald-900 border border-emerald-200">
                <p className="font-bold flex items-center gap-1 text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Ready for Inspection & Handover
                </p>
                <p className="mt-0.5 text-slate-600">
                  Volunteers and NGO personnel scan this pass to verify temperature, weight, and delivery custody.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
