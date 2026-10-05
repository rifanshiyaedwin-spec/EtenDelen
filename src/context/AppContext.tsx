import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BeneficiaryRequest,
  ChatMessage,
  DonationStatus,
  FoodDonation,
  FoodVerificationData,
  FraudReport,
  ImpactStatistics,
  LeaderboardUser,
  NotificationItem,
  RedistributionRecord,
  User,
  UserRole,
} from '../types';
import {
  INITIAL_BENEFICIARY_REQUESTS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_DONATIONS,
  INITIAL_FRAUD_REPORTS,
  INITIAL_IMPACT_STATS,
  INITIAL_LEADERBOARD,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
} from '../data/mockData';
import { computeSmartMatches } from '../services/aiService';

interface AppContextType {
  currentUser: User;
  users: User[];
  donations: FoodDonation[];
  notifications: NotificationItem[];
  chatMessages: ChatMessage[];
  beneficiaryRequests: BeneficiaryRequest[];
  fraudReports: FraudReport[];
  leaderboard: LeaderboardUser[];
  impactStats: ImpactStatistics;
  emergencyRescueCount: number;
  unreadNotificationsCount: number;
  selectedDonation: FoodDonation | null;
  setSelectedDonation: (d: FoodDonation | null) => void;
  // Modals & UI states
  isQrScannerOpen: boolean;
  setIsQrScannerOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  reportTarget: { type: 'donation' | 'donor' | 'ngo' | 'volunteer'; id: string; title: string } | null;
  setReportTarget: (t: { type: 'donation' | 'donor' | 'ngo' | 'volunteer'; id: string; title: string } | null) => void;
  isCertificateModalOpen: boolean;
  setIsCertificateModalOpen: (open: boolean) => void;
  certificateDonation: FoodDonation | null;
  setCertificateDonation: (d: FoodDonation | null) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  activeChatConversationId: string | null;
  setActiveChatConversationId: (id: string | null) => void;
  // Auth state & actions
  isAuthenticated: boolean;
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  savedEmail: string;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register';
  authRoleTarget?: UserRole;
  openAuthModal: (tab?: 'login' | 'register', targetRole?: UserRole) => void;
  closeAuthModal: () => void;
  login: (email: string, password: string, remember?: boolean) => { success: boolean; error?: string; user?: User };
  register: (userData: Partial<User> & { password: string }) => { success: boolean; error?: string; user?: User };
  logout: () => void;
  // Actions
  switchUserRole: (role: UserRole) => void;
  setCurrentUser: (u: User) => void;
  createDonation: (data: Partial<FoodDonation>) => FoodDonation;
  updateDonation: (id: string, updates: Partial<FoodDonation>) => void;
  cancelDonation: (id: string, reason?: string) => void;
  acceptDonationAsNgo: (donationId: string) => void;
  assignVolunteerToDonation: (donationId: string, volunteerId?: string) => void;
  advanceVolunteerProgress: (donationId: string) => void;
  verifyDonationInspection: (donationId: string, data: FoodVerificationData) => void;
  recordRedistribution: (donationId: string, record: RedistributionRecord) => void;
  toggleEmergencyRescue: (donationId: string) => void;
  submitBeneficiaryRequest: (req: Partial<BeneficiaryRequest>) => void;
  allocateDonationToBeneficiary: (requestId: string, donationId: string) => void;
  submitFraudReport: (report: Partial<FraudReport>) => void;
  resolveFraudReport: (reportId: string, actionTaken: string) => void;
  approveNgoVerification: (ngoId: string) => void;
  rejectNgoVerification: (ngoId: string) => void;
  sendChatMessage: (msg: { text: string; receiverId: string; receiverName: string; donationId?: string; conversationId?: string }) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'etendelen_app_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUserState] = useState<User>(() => {
    return users.find((u) => u.role === 'donor') || users[0];
  });

  const [donations, setDonations] = useState<FoodDonation[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_donations`);
    return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notifs`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_chats`);
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [beneficiaryRequests, setBeneficiaryRequests] = useState<BeneficiaryRequest[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_beneficiaries`);
    return saved ? JSON.parse(saved) : INITIAL_BENEFICIARY_REQUESTS;
  });

  const [fraudReports, setFraudReports] = useState<FraudReport[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_fraud`);
    return saved ? JSON.parse(saved) : INITIAL_FRAUD_REPORTS;
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_leaderboard`);
    return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD;
  });

  const [impactStats, setImpactStats] = useState<ImpactStatistics>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_impact`);
    return saved ? JSON.parse(saved) : INITIAL_IMPACT_STATS;
  });

  // Modal states
  const [selectedDonation, setSelectedDonation] = useState<FoodDonation | null>(null);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: 'donation' | 'donor' | 'ngo' | 'volunteer'; id: string; title: string } | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [certificateDonation, setCertificateDonation] = useState<FoodDonation | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatConversationId, setActiveChatConversationId] = useState<string | null>(null);

  // Authentication State
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    return localStorage.getItem(`${LOCAL_STORAGE_KEY}_remember_me`) !== 'false';
  });
  const [savedEmail, setSavedEmail] = useState<string>(() => {
    return localStorage.getItem(`${LOCAL_STORAGE_KEY}_saved_email`) || '';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const authFlag = localStorage.getItem(`${LOCAL_STORAGE_KEY}_auth`);
    const isRemembered = localStorage.getItem(`${LOCAL_STORAGE_KEY}_remember_me`) !== 'false';
    return authFlag === 'true' && isRemembered;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [authRoleTarget, setAuthRoleTarget] = useState<UserRole | undefined>(undefined);

  const openAuthModal = (tab: 'login' | 'register' = 'login', targetRole?: UserRole) => {
    setAuthModalTab(tab);
    setAuthRoleTarget(targetRole);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (
    email: string,
    password: string,
    remember: boolean = true
  ): { success: boolean; error?: string; user?: User } => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      return { success: false, error: 'No account found with this email address. Please register.' };
    }

    if (found.password && found.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    setCurrentUserState(found);
    setIsAuthenticated(true);
    setRememberMe(remember);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_auth`, 'true');
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_remember_me`, remember ? 'true' : 'false');
    if (remember) {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_saved_email`, cleanEmail);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_active_user_id`, found.id);
      setSavedEmail(cleanEmail);
    } else {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY}_saved_email`);
      setSavedEmail('');
    }
    closeAuthModal();
    return { success: true, user: found };
  };

  const register = (
    userData: Partial<User> & { password: string }
  ): { success: boolean; error?: string; user?: User } => {
    const cleanEmail = (userData.email || '').trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const newId = `${userData.role || 'user'}-${Date.now()}`;
    const newUser: User = {
      id: newId,
      name: userData.name || 'New User',
      email: cleanEmail,
      password: userData.password,
      role: userData.role || 'donor',
      organizationName: userData.organizationName,
      donorType: userData.donorType || 'restaurant',
      phone: userData.phone || '+91 98400 00000',
      address: userData.address || 'Chennai, India',
      location: userData.location || { lat: 13.0827, lng: 80.2707, city: 'Chennai' },
      verified: userData.role === 'admin' ? true : userData.role === 'ngo' ? false : true,
      verificationStatus: userData.role === 'ngo' ? 'pending' : 'verified',
      verificationDocs: userData.verificationDocs,
      points: 100,
      badges: ['First Step'],
      capacityKg: userData.capacityKg || 200,
      vehicleType: userData.vehicleType,
      dietaryPreference: userData.dietaryPreference,
      familyMembersCount: userData.familyMembersCount,
      fssaiNumber: userData.fssaiNumber,
      avatar:
        userData.avatar ||
        `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserState(newUser);
    setIsAuthenticated(true);
    setRememberMe(true);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_auth`, 'true');
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_remember_me`, 'true');
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_saved_email`, cleanEmail);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_active_user_id`, newUser.id);
    setSavedEmail(cleanEmail);
    closeAuthModal();

    // Welcome Notification
    const welcomeNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: newUser.id,
      title: `Welcome to EtenDelen, ${newUser.name}! 👋`,
      message: `Your account as a verified ${newUser.role.toUpperCase()} is active. Start sharing surplus and feeding communities.`,
      type: 'announcement',
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);

    return { success: true, user: newUser };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_auth`, 'false');
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_active_user_id`);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_donations`, JSON.stringify(donations));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_users`, JSON.stringify(users));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_notifs`, JSON.stringify(notifications));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_chats`, JSON.stringify(chatMessages));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_beneficiaries`, JSON.stringify(beneficiaryRequests));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_fraud`, JSON.stringify(fraudReports));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_impact`, JSON.stringify(impactStats));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_leaderboard`, JSON.stringify(leaderboard));
  }, [donations, users, notifications, chatMessages, beneficiaryRequests, fraudReports, impactStats, leaderboard]);

  const switchUserRole = (role: UserRole) => {
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUserState(targetUser);
    }
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
  };

  const createDonation = (data: Partial<FoodDonation>): FoodDonation => {
    const newId = `ED-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();

    const matches = computeSmartMatches(data, users);

    const newDonation: FoodDonation = {
      id: newId,
      title: data.title || 'Surplus Nutritious Food',
      category: data.category || 'Cooked Meals',
      description: data.description || '',
      imageUrl:
        data.imageUrl ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      quantity: data.quantity || 10,
      unit: data.unit || 'kg',
      prepTime: data.prepTime || nowIso,
      expiryTime: data.expiryTime || new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
      condition: data.condition || 'Freshly Prepared',
      storageRequirements: data.storageRequirements || 'Dry / Room Temperature',
      allergens: data.allergens || [],
      isVegetarian: data.isVegetarian ?? true,
      safetyNotes: data.safetyNotes || 'Prepared and sealed under clean food safety conditions.',
      donorId: currentUser.id,
      donorName: currentUser.name,
      donorType: currentUser.organizationName || 'Donor',
      donorPhone: currentUser.phone,
      pickupAddress: data.pickupAddress || currentUser.address,
      pickupLocation: data.pickupLocation || currentUser.location,
      pickupWindowStart: data.pickupWindowStart || nowIso,
      pickupWindowEnd: data.pickupWindowEnd || new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      status: 'matched',
      priority: data.isEmergencyRescue ? 'critical' : data.priority || 'medium',
      isEmergencyRescue: !!data.isEmergencyRescue,
      matchedNgoId: matches[0]?.ngoId,
      matchedNgoName: matches[0]?.ngoName,
      qrCodeData: `ETENDELEN-QR-${newId}-${currentUser.id}`,
      matchScores: matches,
      aiAnalysis: data.aiAnalysis,
      isScheduledRecurring: data.isScheduledRecurring,
      recurringSchedule: data.recurringSchedule,
      trackingTimeline: [
        {
          stage: 'created',
          title: 'Donation Created',
          timestamp: nowIso,
          completed: true,
          actor: currentUser.organizationName || currentUser.name,
        },
        {
          stage: 'matched',
          title: 'Smart AI Matched',
          timestamp: nowIso,
          completed: true,
          notes: matches[0] ? `Top matched to ${matches[0].ngoName} (${matches[0].score}% Match)` : 'Searching verified NGOs',
          actor: 'AI Engine',
        },
        { stage: 'accepted', title: 'Donation Accepted', timestamp: '', completed: false },
        { stage: 'pickup_scheduled', title: 'Pickup Scheduled', timestamp: '', completed: false },
        { stage: 'volunteer_assigned', title: 'Volunteer Assigned', timestamp: '', completed: false },
        { stage: 'collected', title: 'Food Collected', timestamp: '', completed: false },
        { stage: 'verified', title: 'Food Verified', timestamp: '', completed: false },
        { stage: 'in_transit', title: 'In Transit', timestamp: '', completed: false },
        { stage: 'delivered', title: 'Delivered to NGO', timestamp: '', completed: false },
        { stage: 'redistributed', title: 'Redistributed to Beneficiaries', timestamp: '', completed: false },
        { stage: 'completed', title: 'Donation Completed & Certified', timestamp: '', completed: false },
      ],
      createdAt: nowIso,
    };

    setDonations((prev) => [newDonation, ...prev]);

    // Add notification for matching NGO
    if (matches[0]) {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: matches[0].ngoId,
        title: 'New Matched Surplus Food Listing 🍲',
        message: `${newDonation.title} (${newDonation.quantity} ${newDonation.unit}) matched with ${matches[0].score}% score.`,
        type: 'match',
        read: false,
        link: newDonation.id,
        createdAt: nowIso,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    // Award donor points
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, points: u.points + 50 } : u))
    );

    return newDonation;
  };

  const updateDonation = (id: string, updates: Partial<FoodDonation>) => {
    setDonations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  };

  const cancelDonation = (id: string, reason?: string) => {
    const nowIso = new Date().toISOString();
    setDonations((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        return {
          ...d,
          status: 'cancelled',
          trackingTimeline: [
            ...d.trackingTimeline,
            {
              stage: 'cancelled',
              title: 'Donation Cancelled',
              timestamp: nowIso,
              completed: true,
              notes: reason || 'Cancelled by donor',
              actor: currentUser.name,
            },
          ],
        };
      })
    );
  };

  const acceptDonationAsNgo = (donationId: string) => {
    const nowIso = new Date().toISOString();
    setDonations((prev) =>
      prev.map((d) => {
        if (d.id !== donationId) return d;
        const updatedTimeline = d.trackingTimeline.map((step) => {
          if (step.stage === 'accepted') {
            return {
              ...step,
              completed: true,
              timestamp: nowIso,
              actor: currentUser.organizationName || currentUser.name,
              notes: `Accepted by ${currentUser.organizationName || currentUser.name}`,
            };
          }
          if (step.stage === 'pickup_scheduled') {
            return {
              ...step,
              completed: true,
              timestamp: nowIso,
              notes: 'Scheduled for immediate volunteer pickup',
              actor: currentUser.organizationName || currentUser.name,
            };
          }
          return step;
        });

        return {
          ...d,
          status: 'pickup_scheduled',
          matchedNgoId: currentUser.id,
          matchedNgoName: currentUser.organizationName || currentUser.name,
          trackingTimeline: updatedTimeline,
        };
      })
    );

    // Notify donor
    const target = donations.find((d) => d.id === donationId);
    if (target) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: target.donorId,
          title: 'Donation Accepted! ✅',
          message: `${currentUser.organizationName || currentUser.name} has accepted your donation "${target.title}". Volunteer dispatch scheduled.`,
          type: 'donation',
          read: false,
          link: target.id,
          createdAt: nowIso,
        },
        ...prev,
      ]);
    }
  };

  const assignVolunteerToDonation = (donationId: string, volunteerId?: string) => {
    const volId = volunteerId || currentUser.id;
    const vol = users.find((u) => u.id === volId) || currentUser;
    const nowIso = new Date().toISOString();

    setDonations((prev) =>
      prev.map((d) => {
        if (d.id !== donationId) return d;
        const updatedTimeline = d.trackingTimeline.map((step) => {
          if (step.stage === 'volunteer_assigned') {
            return {
              ...step,
              completed: true,
              timestamp: nowIso,
              actor: vol.name,
              notes: `Assigned to volunteer ${vol.name}`,
            };
          }
          return step;
        });

        return {
          ...d,
          status: 'volunteer_assigned',
          assignedVolunteerId: vol.id,
          assignedVolunteerName: vol.name,
          trackingTimeline: updatedTimeline,
        };
      })
    );

    // Notify volunteer
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: vol.id,
        title: 'New Food Pickup Task 🛵',
        message: `You are assigned to collect donation ${donationId}. Navigation route ready.`,
        type: 'pickup',
        read: false,
        link: donationId,
        createdAt: nowIso,
      },
      ...prev,
    ]);
  };

  const advanceVolunteerProgress = (donationId: string) => {
    const nowIso = new Date().toISOString();
    const d = donations.find((item) => item.id === donationId);
    if (!d) return;

    let nextStatus: DonationStatus = d.status;
    let stageToComplete: DonationStatus = d.status;
    let actorText = currentUser.name;
    let notesText = '';

    if (d.status === 'volunteer_assigned') {
      nextStatus = 'arriving';
      notesText = 'Volunteer is arriving at donor location';
    } else if (d.status === 'arriving') {
      nextStatus = 'collected';
      stageToComplete = 'collected';
      notesText = 'Surplus food collected from donor via QR check';
    } else if (d.status === 'collected') {
      nextStatus = 'in_transit';
      stageToComplete = 'in_transit';
      notesText = 'Volunteer is in transit to destination NGO';
    } else if (d.status === 'in_transit') {
      nextStatus = 'delivered';
      stageToComplete = 'delivered';
      notesText = 'Food delivered to NGO receiving facility';
    }

    setDonations((prev) =>
      prev.map((item) => {
        if (item.id !== donationId) return item;
        const updatedTimeline = item.trackingTimeline.map((step) => {
          if (step.stage === stageToComplete || step.stage === nextStatus) {
            return {
              ...step,
              completed: true,
              timestamp: nowIso,
              actor: actorText,
              notes: notesText || step.notes,
            };
          }
          return step;
        });

        return {
          ...item,
          status: nextStatus,
          trackingTimeline: updatedTimeline,
        };
      })
    );

    // Give points to volunteer
    if (nextStatus === 'delivered') {
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? { ...u, points: u.points + 80 } : u))
      );
    }
  };

  const verifyDonationInspection = (donationId: string, data: FoodVerificationData) => {
    const nowIso = new Date().toISOString();
    setDonations((prev) =>
      prev.map((d) => {
        if (d.id !== donationId) return d;
        const updatedTimeline = d.trackingTimeline.map((step) => {
          if (step.stage === 'verified') {
            return {
              ...step,
              completed: true,
              timestamp: nowIso,
              actor: data.verifiedBy,
              notes: `Safety verified: ${data.conditionScore} condition, ${data.temperatureCelsius ? data.temperatureCelsius + '°C, ' : ''}Approved: ${data.approved}`,
            };
          }
          return step;
        });

        return {
          ...d,
          status: 'verified',
          verificationData: data,
          trackingTimeline: updatedTimeline,
        };
      })
    );
  };

  const recordRedistribution = (donationId: string, record: RedistributionRecord) => {
    const nowIso = new Date().toISOString();
    const donation = donations.find((d) => d.id === donationId);

    setDonations((prev) =>
      prev.map((d) => {
        if (d.id !== donationId) return d;
        const updatedTimeline = d.trackingTimeline.map((step) => {
          if (step.stage === 'redistributed' || step.stage === 'completed') {
            return {
              ...step,
              completed: true,
              timestamp: nowIso,
              actor: record.distributedByNgo,
              notes: `Redistributed to ${record.beneficiariesCount} beneficiaries at ${record.targetCommunity}`,
            };
          }
          return step;
        });

        return {
          ...d,
          status: 'completed',
          redistributionData: record,
          trackingTimeline: updatedTimeline,
        };
      })
    );

    // Update global impact stats
    const qtyKg = donation?.quantity || 20;
    setImpactStats((prev) => ({
      ...prev,
      totalFoodRescuedKg: prev.totalFoodRescuedKg + qtyKg,
      totalFoodRedistributedKg: prev.totalFoodRedistributedKg + qtyKg,
      estimatedFoodWastePreventedKg: prev.estimatedFoodWastePreventedKg + qtyKg,
      estimatedCo2SavedKg: prev.estimatedCo2SavedKg + Math.round(qtyKg * 2.5),
      estimatedWaterSavedLiters: prev.estimatedWaterSavedLiters + Math.round(qtyKg * 500),
      beneficiariesSupported: prev.beneficiariesSupported + record.beneficiariesCount,
      successfulDonations: prev.successfulDonations + 1,
    }));

    // Notify donor that certificate is ready
    if (donation) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: donation.donorId,
          title: 'Official Food Rescue Certificate Issued! 📜',
          message: `Your donation ${donation.id} fed ${record.beneficiariesCount} people. View and download your certified sustainability achievement.`,
          type: 'announcement',
          read: false,
          link: donation.id,
          createdAt: nowIso,
        },
        ...prev,
      ]);
    }
  };

  const toggleEmergencyRescue = (donationId: string) => {
    setDonations((prev) =>
      prev.map((d) => {
        if (d.id !== donationId) return d;
        const newEmergencyState = !d.isEmergencyRescue;
        return {
          ...d,
          isEmergencyRescue: newEmergencyState,
          priority: newEmergencyState ? 'critical' : 'medium',
        };
      })
    );
  };

  const submitBeneficiaryRequest = (req: Partial<BeneficiaryRequest>) => {
    const newReq: BeneficiaryRequest = {
      id: `REQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      beneficiaryId: currentUser.id,
      beneficiaryName: currentUser.name,
      contactNumber: currentUser.phone,
      location: currentUser.address,
      familyMembersCount: req.familyMembersCount || 4,
      dietaryPreference: req.dietaryPreference || 'Any',
      urgentNeed: req.urgentNeed ?? false,
      requestedCategory: req.requestedCategory || 'Cooked Meals',
      notes: req.notes || 'Community food assistance request',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setBeneficiaryRequests((prev) => [newReq, ...prev]);
  };

  const allocateDonationToBeneficiary = (requestId: string, donationId: string) => {
    setBeneficiaryRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'allocated',
              allocatedDonationId: donationId,
              allocatedNgoName: currentUser.organizationName || currentUser.name,
            }
          : r
      )
    );
  };

  const submitFraudReport = (report: Partial<FraudReport>) => {
    const newReport: FraudReport = {
      id: `FR-${Math.floor(1000 + Math.random() * 9000)}`,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      targetType: report.targetType || 'donation',
      targetId: report.targetId || 'unknown',
      targetTitle: report.targetTitle || 'Reported Entity',
      reason: report.reason || 'Safety / Authenticity Issue',
      description: report.description || '',
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setFraudReports((prev) => [newReport, ...prev]);
  };

  const resolveFraudReport = (reportId: string, actionTaken: string) => {
    setFraudReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved', actionTaken } : r))
    );
  };

  const approveNgoVerification = (ngoId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === ngoId
          ? { ...u, verified: true, verificationStatus: 'verified', badges: [...u.badges, 'Verified NGO'] }
          : u
      )
    );
  };

  const rejectNgoVerification = (ngoId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === ngoId ? { ...u, verified: false, verificationStatus: 'rejected' } : u))
    );
  };

  const sendChatMessage = ({
    text,
    receiverId,
    receiverName,
    donationId,
    conversationId,
  }: {
    text: string;
    receiverId: string;
    receiverName: string;
    donationId?: string;
    conversationId?: string;
  }) => {
    const convId = conversationId || `chat-${donationId || receiverId}`;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: convId,
      senderId: currentUser.id,
      senderName: currentUser.organizationName || currentUser.name,
      senderRole: currentUser.role,
      receiverId,
      receiverName,
      message: text,
      donationId,
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const emergencyRescueCount = donations.filter(
    (d) => d.isEmergencyRescue && d.status !== 'completed' && d.status !== 'cancelled'
  ).length;

  const unreadNotificationsCount = notifications.filter(
    (n) => n.userId === currentUser.id && !n.read
  ).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        donations,
        notifications,
        chatMessages,
        beneficiaryRequests,
        fraudReports,
        leaderboard,
        impactStats,
        emergencyRescueCount,
        unreadNotificationsCount,
        selectedDonation,
        setSelectedDonation,
        isQrScannerOpen,
        setIsQrScannerOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        reportTarget,
        setReportTarget,
        isCertificateModalOpen,
        setIsCertificateModalOpen,
        certificateDonation,
        setCertificateDonation,
        isChatOpen,
        setIsChatOpen,
        activeChatConversationId,
        setActiveChatConversationId,
        isAuthenticated,
        rememberMe,
        setRememberMe,
        savedEmail,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        authRoleTarget,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        switchUserRole,
        setCurrentUser,
        createDonation,
        updateDonation,
        cancelDonation,
        acceptDonationAsNgo,
        assignVolunteerToDonation,
        advanceVolunteerProgress,
        verifyDonationInspection,
        recordRedistribution,
        toggleEmergencyRescue,
        submitBeneficiaryRequest,
        allocateDonationToBeneficiary,
        submitFraudReport,
        resolveFraudReport,
        approveNgoVerification,
        rejectNgoVerification,
        sendChatMessage,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
