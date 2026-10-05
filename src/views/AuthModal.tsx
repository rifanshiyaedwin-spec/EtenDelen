import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { EtenDelenLogo } from '../components/common/EtenDelenLogo';
import {
  X,
  Mail,
  Lock,
  User,
  Truck,
  HeartHandshake,
  Users,
  ShieldCheck,
  Utensils,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  onSuccessNavigate?: (view: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccessNavigate }) => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    authRoleTarget,
    login,
    register,
    savedEmail,
    rememberMe: contextRememberMe,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('donor');

  // Sign In Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Registration Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
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
  const [regError, setRegError] = useState<string | null>(null);

  useEffect(() => {
    if (authModalTab) {
      setActiveTab(authModalTab);
    }
    if (authRoleTarget) {
      setSelectedRole(authRoleTarget);
    }
    if (savedEmail) {
      setLoginEmail(savedEmail);
    }
    setRememberLogin(contextRememberMe ?? true);
    setLoginError(null);
    setRegError(null);
  }, [authModalTab, authRoleTarget, isAuthModalOpen, savedEmail, contextRememberMe]);

  if (!isAuthModalOpen) return null;

  const getDashboardForRole = (role: UserRole) => {
    switch (role) {
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const res = login(loginEmail, loginPassword, rememberLogin);
    if (!res.success) {
      setLoginError(res.error || 'Authentication failed.');
      return;
    }

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    if (onSuccessNavigate && res.user) {
      onSuccessNavigate(getDashboardForRole(res.user.role));
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }

    const res = register({
      name: regName,
      email: regEmail,
      password: regPassword,
      role: selectedRole,
      phone: regPhone || '+91 98400 00000',
      address: `${regAddress}, ${regCity}`,
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
      setRegError(res.error || 'Registration failed.');
      return;
    }

    try {
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}

    if (onSuccessNavigate && res.user) {
      onSuccessNavigate(getDashboardForRole(res.user.role));
    }
  };

  const handleQuickLogin = (email: string, pass: string) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    const res = login(email, pass);
    if (res.success && onSuccessNavigate && res.user) {
      onSuccessNavigate(getDashboardForRole(res.user.role));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Logo */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center space-y-2">
            <EtenDelenLogo size="sm" showTagline={false} variant="inverted" />
            <h3 className="text-xl font-black tracking-tight text-white mt-1">
              {activeTab === 'login' ? 'Authentication Portal' : 'New Account Registration'}
            </h3>
            <p className="text-xs text-slate-300 max-w-sm">
              Connecting surplus food donors with verified NGOs, couriers, and communities.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('login');
              setLoginError(null);
            }}
            className={`flex-1 py-3.5 text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white text-emerald-800 border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setRegError(null);
            }}
            className={`flex-1 py-3.5 text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-white text-emerald-800 border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>New Registration</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          {activeTab === 'login' ? (
            /* 1. Sign In Form */
            <div className="space-y-6">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="contact@organization.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    <span className="text-[11px] text-emerald-700 hover:underline cursor-pointer">
                      Forgot password?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                      className="w-4 h-4 rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600">Remember login on this device</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Instant Access Section */}
              <div className="pt-4 border-t border-slate-200 space-y-2.5">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                  Quick Portal Access
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('marcus@grandpalace.com', 'password123')}
                    className="p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 group-hover:text-emerald-800">
                      <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Food Donor</span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">Hotel / Commercial</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('contact@hopeharvest.ngo', 'password123')}
                    className="p-2.5 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl text-left transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 group-hover:text-orange-800">
                      <HeartHandshake className="w-3.5 h-3.5 text-orange-600" />
                      <span>Verified NGO</span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">Food Bank Intake Hub</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('karthik.volunteer@gmail.com', 'password123')}
                    className="p-2.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-left transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 group-hover:text-amber-800">
                      <Truck className="w-3.5 h-3.5 text-amber-600" />
                      <span>Volunteer</span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">Courier Dispatch</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin@etendelen.org', 'admin123')}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-400 rounded-xl text-left transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                      <span>Platform Admin</span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">Governance Console</p>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* 2. Registration Form with Role Selection */
            <div className="space-y-6">
              {regError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                  <span>{regError}</span>
                </div>
              )}

              {/* Role Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Stakeholder Role *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { role: 'donor' as UserRole, label: 'Food Donor', icon: Utensils, color: 'text-emerald-700' },
                    { role: 'ngo' as UserRole, label: 'NGO / Food Bank', icon: HeartHandshake, color: 'text-orange-700' },
                    { role: 'volunteer' as UserRole, label: 'Volunteer', icon: Truck, color: 'text-amber-700' },
                    { role: 'beneficiary' as UserRole, label: 'Beneficiary', icon: Users, color: 'text-blue-700' },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = selectedRole === item.role;
                    return (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => setSelectedRole(item.role)}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/30 font-bold'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${item.color}`} />
                        <span className="text-[11px]">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {selectedRole === 'donor' || selectedRole === 'ngo' ? 'Organization / Unit Name *' : 'Account Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Entity Name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="contact@email.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98400 12345"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Role Specific Fields */}
                {selectedRole === 'donor' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                    <div>
                      <label className="block text-xs font-bold text-emerald-950 mb-1">
                        Business / Establishment Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={regOrgName}
                        onChange={(e) => setRegOrgName(e.target.value)}
                        placeholder="e.g. Grand Palace Hotel"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-950 mb-1">Donor Category *</label>
                      <select
                        value={regDonorType}
                        onChange={(e) => setRegDonorType(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                      >
                        <option value="hotel">Hotel / Banquet</option>
                        <option value="restaurant">Restaurant / Fine Dining</option>
                        <option value="supermarket">Supermarket / Bakery</option>
                        <option value="caterer">Event Caterer</option>
                        <option value="household">Community Kitchen / Residential</option>
                        <option value="food_supplier">Food Supplier / Distributor</option>
                      </select>
                    </div>
                  </div>
                )}

                {selectedRole === 'ngo' && (
                  <div className="space-y-3 p-3 bg-orange-50/60 rounded-2xl border border-orange-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-orange-950 mb-1">
                          NGO / Food Bank Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={regOrgName}
                          onChange={(e) => setRegOrgName(e.target.value)}
                          placeholder="e.g. Hope Harvest Food Bank"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-orange-950 mb-1">
                          Govt / DARPAN Reg Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={regDocNumber}
                          onChange={(e) => setRegDocNumber(e.target.value)}
                          placeholder="e.g. NGO-TN-2026-XXXX"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-orange-950 mb-1">
                          Daily Capacity (kg/day)
                        </label>
                        <input
                          type="number"
                          value={regCapacity}
                          onChange={(e) => setRegCapacity(parseInt(e.target.value) || 200)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-orange-950 mb-1">
                          FSSAI License (Optional)
                        </label>
                        <input
                          type="text"
                          value={regFssai}
                          onChange={(e) => setRegFssai(e.target.value)}
                          placeholder="FSSAI-XXXX"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedRole === 'volunteer' && (
                  <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200">
                    <label className="block text-xs font-bold text-amber-950 mb-1">
                      Transport / Courier Vehicle Type *
                    </label>
                    <select
                      value={regVehicle}
                      onChange={(e) => setRegVehicle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                    >
                      <option value="Electric 2-Wheeler (Insulated Box)">Electric 2-Wheeler (Insulated Carrier)</option>
                      <option value="Motorcycle / Scooter">Motorcycle / Scooter</option>
                      <option value="Sedan / Hatchback Car">Sedan / Hatchback Car (Cargo boot)</option>
                      <option value="Van / Commercial Carrier">Van / Commercial Carrier (Bulk Delivery)</option>
                      <option value="Bicycle">Bicycle (Local area &lt; 2km)</option>
                    </select>
                  </div>
                )}

                {selectedRole === 'beneficiary' && (
                  <div className="grid grid-cols-2 gap-3 p-3 bg-blue-50/60 rounded-2xl border border-blue-200">
                    <div>
                      <label className="block text-xs font-bold text-blue-950 mb-1">
                        Family / Dependents Count
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={regFamilyMembers}
                        onChange={(e) => setRegFamilyMembers(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-blue-950 mb-1">
                        Dietary Preference
                      </label>
                      <select
                        value={regDietaryPref}
                        onChange={(e) => setRegDietaryPref(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                      >
                        <option value="Vegetarian">Pure Vegetarian</option>
                        <option value="Non-Vegetarian">Non-Vegetarian</option>
                        <option value="Any">Any Safe Food</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Location */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder="e.g. 42 Royal Avenue"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  Create {selectedRole.toUpperCase()} Account & Enter
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
