import React, { useState } from 'react';
import { EtenDelenLogo } from './EtenDelenLogo';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  MessageSquare,
  Globe,
  PlusCircle,
  Menu,
  X,
  LayoutDashboard,
  Award,
  BarChart3,
  Search,
  Flame,
  ShieldCheck,
  User,
  LogOut,
  Settings,
  LogIn,
  UserPlus,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenNotifications: () => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenNotifications,
  onOpenChat,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const {
    currentUser,
    emergencyRescueCount,
    unreadNotificationsCount,
    isAuthenticated,
    openAuthModal,
    logout,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const getDashboardViewForRole = () => {
    switch (currentUser.role) {
      case 'donor':
        return 'donor_dashboard';
      case 'ngo':
        return 'ngo_dashboard';
      case 'volunteer':
        return 'volunteer_dashboard';
      case 'beneficiary':
        return 'beneficiary_dashboard';
      case 'admin':
        return 'admin_dashboard';
      default:
        return 'donor_dashboard';
    }
  };

  const navItems = [
    { key: 'gateway', label: 'Role Gateway', icon: ShieldCheck },
    { key: 'browse', label: t.nav.browseFood, icon: Search },
    { key: 'how_it_works', label: t.nav.howItWorks, icon: null },
    { key: 'impact', label: t.nav.impact, icon: BarChart3 },
    { key: 'leaderboard', label: t.nav.leaderboard, icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Official Logo */}
          <div className="flex items-center gap-6 lg:gap-8">
            <EtenDelenLogo
              size="sm"
              showTagline={false}
              onClick={() => onNavigate('landing')}
              className="py-1"
            />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map(({ key, label, icon: Icon }) => {
                const isActive = currentView === key;
                return (
                  <button
                    key={key}
                    onClick={() => onNavigate(key)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                      isActive
                        ? 'text-emerald-800 bg-emerald-50 font-bold'
                        : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-100/70'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4 opacity-70" />}
                    <span>{label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Items */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Emergency Rescue quick button */}
            {emergencyRescueCount > 0 && (
              <button
                onClick={() => onNavigate('emergency_rescue')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300 hover:bg-orange-200 transition cursor-pointer animate-pulse"
              >
                <Flame className="w-3.5 h-3.5 text-orange-600" />
                <span>{emergencyRescueCount} Urgent Rescue</span>
              </button>
            )}

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 flex items-center gap-1 text-xs font-semibold cursor-pointer"
                title="Change language"
              >
                <Globe className="w-4 h-4 text-emerald-600" />
                <span className="uppercase">{language}</span>
              </button>

              {langDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setLangDropdownOpen(false)}
                >
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer ${
                      language === 'en' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>English</span>
                    <span className="text-[10px] text-slate-400">EN</span>
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('ta');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer ${
                      language === 'ta' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>தமிழ்</span>
                    <span className="text-[10px] text-slate-400">TA</span>
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('hi');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer ${
                      language === 'hi' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>हिंदी</span>
                    <span className="text-[10px] text-slate-400">HI</span>
                  </button>
                </div>
              )}
            </div>

            {/* Chat button */}
            <button
              onClick={onOpenChat}
              className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-slate-100 relative cursor-pointer"
              title="Open Community Messages"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Notification bell */}
            <button
              onClick={onOpenNotifications}
              className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-slate-100 relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-orange-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Donate Food Primary Button */}
            <button
              onClick={() => onNavigate('create_donation')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-200" />
              <span>{t.nav.donateFood}</span>
            </button>

            {/* Authentication / User Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 bg-slate-100 hover:bg-slate-200/80 rounded-2xl transition cursor-pointer border border-slate-200"
                >
                  <div className="text-right hidden md:block">
                    <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[110px]">
                      {currentUser.name}
                    </p>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                      {currentUser.role}
                    </span>
                  </div>
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-emerald-500/40"
                  />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 divide-y divide-slate-100"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2">
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {currentUser.organizationName || currentUser.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          onNavigate(getDashboardViewForRole());
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        <span>My {currentUser.role.toUpperCase()} Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          onNavigate('profile');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-slate-500" />
                        <span>Account & Profile Settings</span>
                      </button>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          openAuthModal('login');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-4 h-4 text-purple-600" />
                        <span>Switch Account / Sign In</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          openAuthModal('login');
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-emerald-700 transition cursor-pointer flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={onOpenNotifications}
              className="p-2 rounded-lg text-slate-600 relative"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-orange-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navItems.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                onNavigate(key);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              {label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onNavigate('create_donation');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.nav.donateFood}</span>
            </button>

            <button
              onClick={() => {
                onNavigate(getDashboardViewForRole());
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-800 font-semibold text-sm flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              <span>{t.nav.dashboard} ({currentUser.role})</span>
            </button>

            <button
              onClick={() => {
                openAuthModal('login');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs text-center"
            >
              Sign In / Switch Role
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
