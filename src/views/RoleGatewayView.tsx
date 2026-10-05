import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { EtenDelenLogo } from '../components/common/EtenDelenLogo';
import {
  Utensils,
  HeartHandshake,
  Truck,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Globe,
  ArrowLeft,
  Building,
  Phone,
  MapPin,
  Check,
  LogIn,
  UserPlus,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RoleGatewayViewProps {
  onSelectRoleDashboard: (role: UserRole) => void;
  onExplorePublic: () => void;
}

export const RoleGatewayView: React.FC<RoleGatewayViewProps> = ({
  onSelectRoleDashboard,
  onExplorePublic,
}) => {
  const { login, register, users, savedEmail, rememberMe } = useApp();

  // Selected Role State (null = Step 1 Choose Role Page, value = Step 2/3 Auth Form)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('Chennai');
  const [regOrgName, setRegOrgName] = useState('');
  const [regDonorType, setRegDonorType] = useState<any>('restaurant');
  const [regCapacity, setRegCapacity] = useState<number>(300);
  const [regDocNumber, setRegDocNumber] = useState('');
  const [regFssai, setRegFssai] = useState('');
  const [regVehicle, setRegVehicle] = useState('Electric 2-Wheeler (Insulated Box)');
  const [regFamilyMembers, setRegFamilyMembers] = useState(4);
  const [regDietaryPref, setRegDietaryPref] = useState('Vegetarian');
  const [adminPasscode, setAdminPasscode] = useState('');

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState(savedEmail || '');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(rememberMe ?? true);

  // Status feedback
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const roles = [
    {
      role: 'donor' as UserRole,
      title: 'Food Donor',
      subtitle: 'Restaurants, Hotels, Supermarkets, Caterers & Food Suppliers',
      description: 'Register surplus food with AI image classification, manage shelf-life, and obtain official Food Rescue Certificates.',
      icon: Utensils,
      badge: 'Zero-Waste Kitchen',
      color: 'from-emerald-600 to-teal-700',
      borderHover: 'hover:border-emerald-500',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
      features: ['List Surplus Food Items', 'AI Shelf-Life Estimation', 'Scheduled Recurring Pickups', 'Digital Impact Award'],
    },
    {
      role: 'ngo' as UserRole,
      title: 'Verified NGO / Food Bank',
      subtitle: 'Charities, Relief Foundations, Soup Kitchens & Shelters',
      description: 'Access AI matched surplus food in the local area, perform intake food safety inspections, and log direct redistribution.',
      icon: HeartHandshake,
      badge: 'Verified Intake Hub',
      color: 'from-orange-600 to-amber-700',
      borderHover: 'hover:border-orange-500',
      buttonBg: 'bg-orange-600 hover:bg-orange-700',
      features: ['Smart Proximity Matching', 'Intake Safety Verification Log', 'Beneficiary Redistribution', 'Verified NGO Badge'],
    },
    {
      role: 'volunteer' as UserRole,
      title: 'Volunteer Courier',
      subtitle: 'Community Food Rescuers & Delivery Transport',
      description: 'Accept nearby dispatch tasks, use real-time route navigation with temperature-safe boxes, and verify handoffs with QR codes.',
      icon: Truck,
      badge: 'Rapid Logistics Responder',
      color: 'from-amber-600 to-yellow-600',
      borderHover: 'hover:border-amber-500',
      buttonBg: 'bg-amber-600 hover:bg-amber-700 text-slate-950',
      features: ['Nearby Pickup Tasks', 'Live Route Navigation', 'QR Handover Scanner', 'Volunteer Milestones'],
    },
    {
      role: 'beneficiary' as UserRole,
      title: 'Beneficiary Community',
      subtitle: 'Shelters, Care Centers & Community Groups',
      description: 'Submit meal assistance requests, specify dietary preferences, and track allocated surplus nourishment from verified NGOs.',
      icon: Users,
      badge: 'Community Member',
      color: 'from-blue-600 to-indigo-700',
      borderHover: 'hover:border-blue-500',
      buttonBg: 'bg-blue-600 hover:bg-blue-700',
      features: ['Request Meal Support', 'Vegetarian / Dietary Filters', 'Real-Time Allocation Status', 'Direct Assistance'],
    },
    {
      role: 'admin' as UserRole,
      title: 'Platform Administrator',
      subtitle: 'Central Governance, Trust & Safety Team',
      description: 'Audit NGO registration credentials, review food safety & fraud reports, broadcast emergency rescue alerts, and track citywide impact.',
      icon: ShieldCheck,
      badge: 'Platform Security Master',
      color: 'from-slate-800 to-slate-950',
      borderHover: 'hover:border-slate-600',
      buttonBg: 'bg-slate-900 hover:bg-slate-800',
      features: ['NGO Verification Approvals', 'Fraud & Safety Audit Queue', 'Citywide Impact Analytics', 'Emergency Broadcasts'],
    },
  ];

  const currentRoleConfig = roles.find((r) => r.role === selectedRole);

  const handleRoleSelect = (role: UserRole, preferredMode: 'register' | 'login' = 'register') => {
    setSelectedRole(role);
    setAuthMode(preferredMode);
    setErrorMsg(null);
    setSuccessMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedRole) return;

    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    const res = register({
      name: regOrgName || regName || 'Entity Account',
      email: regEmail,
      password: regPassword,
      role: selectedRole,
      phone: regPhone || '+91 98400 00000',
      address: `${regAddress || 'Main Road'}, ${regCity}`,
      location: { lat: 13.0827, lng: 80.2707, city: regCity },
      organizationName:
        selectedRole === 'donor' || selectedRole === 'ngo' || selectedRole === 'admin'
          ? regOrgName || regName
          : undefined,
      donorType: selectedRole === 'donor' ? regDonorType : undefined,
      capacityKg: selectedRole === 'ngo' || selectedRole === 'donor' ? regCapacity : undefined,
      vehicleType: selectedRole === 'volunteer' ? regVehicle : undefined,
      familyMembersCount: selectedRole === 'beneficiary' ? regFamilyMembers : undefined,
      dietaryPreference: selectedRole === 'beneficiary' ? regDietaryPref : undefined,
      fssaiNumber: regFssai || undefined,
      verificationDocs:
        selectedRole === 'ngo'
          ? {
              docType: 'Non-Profit / NGO Registration Document',
              docNumber: regDocNumber || 'NGO-REG-2026-PENDING',
              docUrl: 'https://example.com/docs/pending.pdf',
              submittedAt: new Date().toISOString(),
            }
          : undefined,
    });

    if (!res.success) {
      setErrorMsg(res.error || 'Registration failed. Please check the entered information.');
      return;
    }

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    // Success step: Auto-fill sign-in fields and switch to Sign In step
    setSuccessMsg(
      `Registration successful for ${currentRoleConfig?.title}! Please enter the registered password to sign in.`
    );
    setLoginEmail(regEmail);
    setLoginPassword(regPassword);
    setAuthMode('login');
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedRole) return;

    const res = login(loginEmail, loginPassword, rememberLogin);
    if (!res.success) {
      setErrorMsg(res.error || 'Invalid email or password.');
      return;
    }

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    onSelectRoleDashboard(selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10 space-y-8">
        {/* Top Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="flex justify-center mb-1">
            <EtenDelenLogo size="lg" showTagline={true} variant="inverted" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Role-Based Surplus Food Redistribution Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            {selectedRole ? (
              <>
                {currentRoleConfig?.title} <span className="text-emerald-400">Portal</span>
              </>
            ) : (
              <>
                Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-orange-400">Role</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            {selectedRole
              ? `Step ${authMode === 'register' ? '2: Enter details to register' : '3: Sign in with registered credentials'} as ${currentRoleConfig?.title}`
              : 'Select a stakeholder role below to register a new account or sign in.'}
          </p>
        </div>

        {/* Global Feedback Banners */}
        {errorMsg && (
          <div className="max-w-lg mx-auto p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 text-xs flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="max-w-lg mx-auto p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-emerald-200 text-xs flex items-center gap-3 animate-in fade-in">
            <Check className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ================= STEP 1: CHOOSE ROLE PAGE ================= */}
        {!selectedRole && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* 5-Role Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.role}
                    className={`bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-xl ${item.borderHover} hover:shadow-2xl hover:scale-[1.01]`}
                  >
                    <div className="space-y-4">
                      {/* Card Header Icon & Badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-md`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-slate-300 border border-white/10">
                          {item.badge}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-black text-white">{item.title}</h3>
                        <p className="text-xs font-semibold text-emerald-400 mt-0.5">{item.subtitle}</p>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.description}</p>
                      </div>

                      {/* Feature Checklist */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                        {item.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step Action Buttons */}
                    <div className="pt-6 space-y-2">
                      <button
                        type="button"
                        onClick={() => handleRoleSelect(item.role, 'register')}
                        className={`w-full py-3 ${item.buttonBg} text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer`}
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Register as {item.title}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRoleSelect(item.role, 'login')}
                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                      >
                        <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Sign In (Existing Account)</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* 6th Card: Public Visitor Mode */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl hover:border-emerald-500 transition">
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-300 w-fit">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-white">Public Visitor Mode</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Explore active surplus listings, citywide waste reduction metrics, and the spatial GIS rescue map.
                  </p>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={onExplorePublic}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Browse Platform &rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEPS 2 & 3: DEDICATED ROLE AUTHENTICATION ================= */}
        {selectedRole && currentRoleConfig && (
          <div className="max-w-2xl mx-auto bg-slate-900/95 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Top Navigation & Selected Role Badge */}
            <div className="p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBackToRoles}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Choose Different Role</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {currentRoleConfig.title}
                </span>
              </div>
            </div>

            {/* Mode Switch Tabs: Register vs Sign In */}
            <div className="flex border-b border-slate-800 bg-slate-950 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-3.5 text-center transition cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === 'register'
                    ? 'bg-slate-900 text-emerald-400 border-b-2 border-emerald-500'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>1. Register New Account</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-3.5 text-center transition cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === 'login'
                    ? 'bg-slate-900 text-emerald-400 border-b-2 border-emerald-500'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>2. Sign In</span>
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 sm:p-8">
              {authMode === 'register' ? (
                /* ================= REGISTER FORM ================= */
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="border-b border-slate-800 pb-3 mb-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Enter Registration Details for {currentRoleConfig.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Fill in the required information to create an account.
                    </p>
                  </div>

                  {/* Basic Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        {selectedRole === 'donor' || selectedRole === 'ngo'
                          ? 'Organization / Establishment Name *'
                          : 'Entity / Account Name *'}
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={regOrgName}
                          onChange={(e) => setRegOrgName(e.target.value)}
                          placeholder={
                            selectedRole === 'donor'
                              ? 'e.g. Grand Palace Hotel'
                              : selectedRole === 'ngo'
                              ? 'e.g. Hope Harvest Food Bank'
                              : 'e.g. Dispatch Unit Name'
                          }
                          className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Contact Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="contact@organization.com"
                          className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Password * (min. 6 characters)
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Enter password"
                          className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                        >
                          {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Contact Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                        <input
                          type="tel"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+91 98400 12345"
                          className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Role Specific Attributes */}
                  {selectedRole === 'donor' && (
                    <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-800/60 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-emerald-300 mb-1">
                            Donor Category *
                          </label>
                          <select
                            value={regDonorType}
                            onChange={(e) => setRegDonorType(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-emerald-700/60 rounded-xl text-xs text-white"
                          >
                            <option value="hotel">Hotel / Banquet</option>
                            <option value="restaurant">Restaurant / Fine Dining</option>
                            <option value="supermarket">Supermarket / Bakery</option>
                            <option value="caterer">Event Caterer</option>
                            <option value="household">Community Kitchen / Residential</option>
                            <option value="food_supplier">Food Supplier / Distributor</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-emerald-300 mb-1">
                            Avg Surplus Capacity (kg/week)
                          </label>
                          <input
                            type="number"
                            value={regCapacity}
                            onChange={(e) => setRegCapacity(parseInt(e.target.value) || 100)}
                            className="w-full px-3 py-2 bg-slate-950 border border-emerald-700/60 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedRole === 'ngo' && (
                    <div className="p-4 bg-orange-950/40 rounded-2xl border border-orange-800/60 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-orange-300 mb-1">
                            Govt / DARPAN Reg Number *
                          </label>
                          <input
                            type="text"
                            required
                            value={regDocNumber}
                            onChange={(e) => setRegDocNumber(e.target.value)}
                            placeholder="e.g. NGO-TN-2026-9812"
                            className="w-full px-3 py-2 bg-slate-950 border border-orange-700/60 rounded-xl text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-orange-300 mb-1">
                            Daily Food Intake Capacity (kg/day) *
                          </label>
                          <input
                            type="number"
                            value={regCapacity}
                            onChange={(e) => setRegCapacity(parseInt(e.target.value) || 200)}
                            className="w-full px-3 py-2 bg-slate-950 border border-orange-700/60 rounded-xl text-xs text-white font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedRole === 'volunteer' && (
                    <div className="p-4 bg-amber-950/40 rounded-2xl border border-amber-800/60 space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-amber-300 mb-1">
                          Transport / Courier Vehicle Type *
                        </label>
                        <select
                          value={regVehicle}
                          onChange={(e) => setRegVehicle(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-amber-700/60 rounded-xl text-xs text-white"
                        >
                          <option value="Electric 2-Wheeler (Insulated Box)">Electric 2-Wheeler (Insulated Carrier)</option>
                          <option value="Motorcycle / Scooter">Motorcycle / Scooter</option>
                          <option value="Sedan / Hatchback Car">Sedan / Hatchback Car (Cargo boot)</option>
                          <option value="Van / Commercial Carrier">Van / Commercial Carrier (Bulk Delivery)</option>
                          <option value="Bicycle">Bicycle (Local area &lt; 2km)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {selectedRole === 'beneficiary' && (
                    <div className="p-4 bg-blue-950/40 rounded-2xl border border-blue-800/60 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-blue-300 mb-1">
                            Family / Dependents Count *
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={regFamilyMembers}
                            onChange={(e) => setRegFamilyMembers(parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 bg-slate-950 border border-blue-700/60 rounded-xl text-xs text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-blue-300 mb-1">
                            Dietary Preference *
                          </label>
                          <select
                            value={regDietaryPref}
                            onChange={(e) => setRegDietaryPref(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-blue-700/60 rounded-xl text-xs text-white"
                          >
                            <option value="Vegetarian">Pure Vegetarian</option>
                            <option value="Non-Vegetarian">Non-Vegetarian</option>
                            <option value="Any">Any Safe Food</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Location Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Street Address *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={regAddress}
                          onChange={(e) => setRegAddress(e.target.value)}
                          placeholder="e.g. 42 Royal Road"
                          className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Action Button: Click Register */}
                  <button
                    type="submit"
                    className="w-full mt-4 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Click to Register {currentRoleConfig.title}</span>
                  </button>
                </form>
              ) : (
                /* ================= SIGN IN FORM ================= */
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div className="border-b border-slate-800 pb-3 mb-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Sign In with Required Details
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Enter the registered email and password for {currentRoleConfig.title}.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="contact@organization.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-300">
                        Password *
                      </label>
                      <span className="text-[11px] text-emerald-400 hover:underline cursor-pointer">
                        Forgot Password?
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full pl-9 pr-9 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Login Checkbox */}
                  <div className="flex items-center justify-between py-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberLogin}
                        onChange={(e) => setRememberLogin(e.target.checked)}
                        className="w-4 h-4 rounded-sm border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-950 cursor-pointer"
                      />
                      <span className="text-xs font-medium text-slate-300">Remember login on this device</span>
                    </label>
                    {savedEmail && (
                      <span className="text-[11px] text-emerald-400 font-medium">Saved credentials ready</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In & Access {currentRoleConfig.title} Dashboard</span>
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode('register')}
                      className="text-xs text-slate-400 hover:text-emerald-400 transition cursor-pointer"
                    >
                      Don't have an account yet? <strong className="text-emerald-400 underline">Register here</strong>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 EtenDelen. “Share Surplus. Reduce Waste. Feed Communities.”</p>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 font-medium">✓ Food Safety Standard Enforced</span>
            <span>•</span>
            <span className="text-orange-400 font-medium">✓ Verified Non-Profit Network</span>
          </div>
        </div>
      </div>
    </div>
  );
};
