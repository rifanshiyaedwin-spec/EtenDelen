import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, X, ShieldAlert, CheckCircle } from 'lucide-react';

export const ReportModal: React.FC = () => {
  const { isReportModalOpen, setIsReportModalOpen, reportTarget, submitFraudReport } = useApp();
  const [reason, setReason] = useState('Unsafe food / Poor hygiene');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isReportModalOpen) return null;

  const reasons = [
    'Unsafe food / Poor hygiene condition',
    'Incorrect quantity or misleading description',
    'Suspicious donor / fake listing',
    'Failed volunteer pickup / unfulfilled commitment',
    'Suspicious organization / fraudulent activity',
    'Other platform violation',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFraudReport({
      targetType: reportTarget?.type || 'donation',
      targetId: reportTarget?.id || 'unknown',
      targetTitle: reportTarget?.title || 'Reported Entity',
      reason,
      description,
    });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsReportModalOpen(false);
      setDescription('');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-rose-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-200" />
            <h3 className="text-base font-bold">Report Platform Misuse / Safety Issue</h3>
          </div>
          <button
            onClick={() => setIsReportModalOpen(false)}
            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-rose-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-slate-800">Report Submitted to Trust & Safety</h4>
            <p className="text-sm text-slate-600">
              Our central administration team will audit this report immediately. Thank you for safeguarding our community food network.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {reportTarget && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
                Reporting: <strong>{reportTarget.title}</strong> ({reportTarget.type.toUpperCase()} ID: {reportTarget.id})
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Reason for Report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden bg-slate-50"
              >
                {reasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Detailed Observations & Safety Concerns
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe specific observations regarding temperature, packaging, quantity discrepancies, or suspicious communication..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-hidden resize-none"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-sm transition cursor-pointer"
              >
                Submit Safety Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
