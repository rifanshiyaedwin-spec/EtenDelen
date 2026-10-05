import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, Bell, AlertTriangle, Truck, Award, Sparkles } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDonation: (id: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectDonation,
}) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, currentUser } = useApp();

  if (!isOpen) return null;

  const userNotifs = notifications.filter(
    (n) => n.userId === currentUser.id || n.userId === 'admin-1'
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />;
      case 'pickup':
        return <Truck className="w-5 h-5 text-amber-500 flex-shrink-0" />;
      case 'announcement':
      case 'verification':
        return <Award className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
      case 'match':
        return <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500 flex-shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold">Notifications ({userNotifs.length})</h2>
            </div>
            <div className="flex items-center gap-2">
              {userNotifs.some((n) => !n.read) && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-emerald-300 hover:text-white underline cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
            {userNotifs.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium text-slate-600">No new notifications</p>
                <p className="text-xs text-slate-400 mt-1">You're all caught up with food rescues!</p>
              </div>
            ) : (
              userNotifs.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.link) {
                      onSelectDonation(notif.link);
                      onClose();
                    }
                  }}
                  className={`pt-3 first:pt-0 p-3 rounded-lg transition cursor-pointer ${
                    notif.read ? 'bg-white hover:bg-slate-50' : 'bg-emerald-50/70 border border-emerald-200/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notif.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-semibold ${notif.read ? 'text-slate-800' : 'text-emerald-950'}`}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                      <div className="flex items-center justify-between mt-2 pt-1 text-[11px] text-slate-400">
                        <span>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {notif.link && (
                          <span className="font-semibold text-emerald-700 hover:underline">
                            View Action &rarr;
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
