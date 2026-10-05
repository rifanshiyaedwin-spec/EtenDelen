export type UserRole = 'donor' | 'ngo' | 'volunteer' | 'beneficiary' | 'admin';

export type FoodCategory =
  | 'Cooked Meals'
  | 'Rice'
  | 'Bread/Bakery'
  | 'Fruits'
  | 'Vegetables'
  | 'Dairy'
  | 'Packaged Food'
  | 'Beverages'
  | 'Groceries'
  | 'Other';

export type FoodCondition =
  | 'Freshly Prepared'
  | 'Good Condition'
  | 'Refrigerated/Chilled'
  | 'Frozen'
  | 'Packaged/Sealed'
  | 'Requires Immediate Pickup';

export type StorageRequirement =
  | 'Dry / Room Temperature'
  | 'Refrigerated (0°C - 4°C)'
  | 'Frozen (-18°C)'
  | 'Insulated Warm (> 60°C)'
  | 'No Specific Storage';

export type ExpiryStatus = 'fresh' | 'available' | 'expiring_soon' | 'urgent' | 'expired';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export type DonationStatus =
  | 'created'
  | 'matched'
  | 'accepted'
  | 'pickup_scheduled'
  | 'volunteer_assigned'
  | 'arriving'
  | 'collected'
  | 'verified'
  | 'in_transit'
  | 'delivered'
  | 'redistributed'
  | 'completed'
  | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  organizationName?: string;
  phone: string;
  address: string;
  location: {
    lat: number;
    lng: number;
    city: string;
  };
  verified: boolean;
  verificationStatus?: 'unsubmitted' | 'pending' | 'verified' | 'rejected';
  verificationDocs?: {
    docType: string;
    docNumber: string;
    docUrl: string;
    submittedAt: string;
  };
  points: number;
  badges: string[];
  capacityKg?: number;
  bio?: string;
  donorType?: 'restaurant' | 'hotel' | 'supermarket' | 'household' | 'caterer' | 'event_organizer' | 'food_supplier';
  password?: string;
  vehicleType?: string;
  dietaryPreference?: string;
  familyMembersCount?: number;
  fssaiNumber?: string;
  createdAt: string;
}

export interface TrackingStage {
  stage: DonationStatus;
  title: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
  notes?: string;
  actor?: string;
}

export interface FoodVerificationData {
  actualQuantity: number;
  unit: string;
  conditionScore: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  packagingIntact: boolean;
  temperatureCelsius?: number;
  observations: string;
  photoUrl?: string;
  verifiedAt: string;
  verifiedBy: string;
  approved: boolean;
}

export interface RedistributionRecord {
  beneficiariesCount: number;
  targetCommunity: string;
  distributedAt: string;
  notes: string;
  distributedByNgo: string;
  locationName: string;
}

export interface AiFoodAnalysis {
  foodType: string;
  category: FoodCategory;
  confidence: number;
  estimatedShelfLifeHours: number;
  expiryRiskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  safeStorageRecommendation: string;
  dietaryClassification: string;
  carbonOffsetEstimateKg: number;
}

export interface FoodDonation {
  id: string; // e.g. "ED-2026-8942"
  title: string;
  category: FoodCategory;
  description: string;
  imageUrl: string;
  quantity: number;
  unit: 'kg' | 'servings' | 'boxes' | 'liters' | 'packets';
  prepTime: string;
  expiryTime: string;
  condition: FoodCondition;
  storageRequirements: StorageRequirement;
  allergens: string[];
  isVegetarian: boolean;
  safetyNotes: string;
  donorId: string;
  donorName: string;
  donorType: string;
  donorPhone?: string;
  pickupAddress: string;
  pickupLocation: {
    lat: number;
    lng: number;
    city: string;
  };
  pickupWindowStart: string;
  pickupWindowEnd: string;
  status: DonationStatus;
  priority: PriorityLevel;
  isEmergencyRescue: boolean;
  matchedNgoId?: string;
  matchedNgoName?: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  trackingTimeline: TrackingStage[];
  verificationData?: FoodVerificationData;
  redistributionData?: RedistributionRecord;
  qrCodeData: string;
  matchScores?: {
    ngoId: string;
    ngoName: string;
    score: number;
    reasons: string[];
  }[];
  aiAnalysis?: AiFoodAnalysis;
  isScheduledRecurring?: boolean;
  recurringSchedule?: {
    frequency: 'daily' | 'weekly' | 'custom';
    days?: string[];
    time: string;
  };
  createdAt: string;
}

export interface BeneficiaryRequest {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  contactNumber: string;
  location: string;
  familyMembersCount: number;
  dietaryPreference: 'Any' | 'Vegetarian' | 'Non-Vegetarian';
  urgentNeed: boolean;
  requestedCategory: FoodCategory;
  notes: string;
  status: 'pending' | 'allocated' | 'fulfilled' | 'cancelled';
  allocatedDonationId?: string;
  allocatedNgoName?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'donation' | 'match' | 'pickup' | 'verification' | 'alert' | 'urgent' | 'announcement';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  receiverName: string;
  message: string;
  donationId?: string;
  timestamp: string;
}

export interface FraudReport {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'donation' | 'donor' | 'ngo' | 'volunteer';
  targetId: string;
  targetTitle: string;
  reason: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  actionTaken?: string;
  createdAt: string;
}

export interface LeaderboardUser {
  rank: number;
  userId: string;
  name: string;
  role: UserRole;
  avatar: string;
  organization?: string;
  points: number;
  donationsOrPickupsCount: number;
  totalKg: number;
  badges: string[];
}

export interface ImpactStatistics {
  totalFoodDonatedKg: number;
  totalFoodRescuedKg: number;
  totalFoodRedistributedKg: number;
  estimatedFoodWastePreventedKg: number;
  estimatedCo2SavedKg: number;
  estimatedWaterSavedLiters: number;
  beneficiariesSupported: number;
  activeDonors: number;
  verifiedNgos: number;
  activeVolunteers: number;
  successfulDonations: number;
}
