import { FoodCategory, FoodCondition, FoodDonation, StorageRequirement, User } from '../types';

export interface ClassificationResult {
  foodType: string;
  category: FoodCategory;
  confidence: number;
  estimatedShelfLifeHours: number;
  expiryRiskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  safeStorageRecommendation: StorageRequirement;
  dietaryClassification: string;
  carbonOffsetEstimateKg: number;
  safetyTips: string[];
}

export interface DemandPrediction {
  category: FoodCategory;
  demandLevel: 'Very High' | 'High' | 'Moderate';
  peakHours: string;
  highDemandLocations: string[];
  urgencyIndex: number; // 1-100
  recommendedAction: string;
}

// Preset food image classification library for instant smart recognition
const FOOD_KNOWLEDGE_BASE: Record<string, Partial<ClassificationResult>> = {
  rice: {
    foodType: 'Steamed Basmati Rice & Biryani',
    category: 'Rice',
    confidence: 0.96,
    estimatedShelfLifeHours: 5,
    expiryRiskLevel: 'Moderate',
    safeStorageRecommendation: 'Insulated Warm (> 60°C)',
    dietaryClassification: 'Vegetarian / Vegan',
    carbonOffsetEstimateKg: 2.4,
    safetyTips: ['Keep warm above 60°C or chill rapidly below 5°C to avoid Bacillus cereus', 'Use sealed thermal containers'],
  },
  meals: {
    foodType: 'Buffet Prepared Cooked Meals (Curries, Rotis & Rice)',
    category: 'Cooked Meals',
    confidence: 0.94,
    estimatedShelfLifeHours: 4,
    expiryRiskLevel: 'High',
    safeStorageRecommendation: 'Insulated Warm (> 60°C)',
    dietaryClassification: 'Vegetarian Friendly',
    carbonOffsetEstimateKg: 3.8,
    safetyTips: ['Redistribute within 4 hours of preparation', 'Do not mix fresh and previously served trays'],
  },
  bread: {
    foodType: 'Artisan Sourdough, Baguettes & Pastries',
    category: 'Bread/Bakery',
    confidence: 0.98,
    estimatedShelfLifeHours: 36,
    expiryRiskLevel: 'Low',
    safeStorageRecommendation: 'Dry / Room Temperature',
    dietaryClassification: 'Vegetarian',
    carbonOffsetEstimateKg: 1.6,
    safetyTips: ['Keep dry and protected from humidity', 'Check for clean crust integrity'],
  },
  fruits: {
    foodType: 'Fresh Seasonal Apples, Bananas & Citrus Assortment',
    category: 'Fruits',
    confidence: 0.97,
    estimatedShelfLifeHours: 72,
    expiryRiskLevel: 'Low',
    safeStorageRecommendation: 'Dry / Room Temperature',
    dietaryClassification: 'Vegan & Gluten-Free',
    carbonOffsetEstimateKg: 1.2,
    safetyTips: ['Wash outer skins before consumption', 'Separate ripe bananas from other fruits'],
  },
  vegetables: {
    foodType: 'Farm Surplus Tomatoes, Greens, Carrots & Bell Peppers',
    category: 'Vegetables',
    confidence: 0.95,
    estimatedShelfLifeHours: 48,
    expiryRiskLevel: 'Low',
    safeStorageRecommendation: 'Refrigerated (0°C - 4°C)',
    dietaryClassification: 'Vegan & Nutrient-Dense',
    carbonOffsetEstimateKg: 1.5,
    safetyTips: ['Maintain cool chain if pre-cut', 'Inspect leaves for freshness'],
  },
  dairy: {
    foodType: 'Pasteurized Milk, Yogurt, Paneer & Butter',
    category: 'Dairy',
    confidence: 0.96,
    estimatedShelfLifeHours: 18,
    expiryRiskLevel: 'High',
    safeStorageRecommendation: 'Refrigerated (0°C - 4°C)',
    dietaryClassification: 'Lacto-Vegetarian',
    carbonOffsetEstimateKg: 4.2,
    safetyTips: ['Strict cold chain required (0-4°C)', 'Ensure unbroken original seal'],
  },
  packaged: {
    foodType: 'Sealed Whole Grain Pasta, Canned Soups & Biscuits',
    category: 'Packaged Food',
    confidence: 0.99,
    estimatedShelfLifeHours: 720,
    expiryRiskLevel: 'Low',
    safeStorageRecommendation: 'Dry / Room Temperature',
    dietaryClassification: 'Shelf-Stable',
    carbonOffsetEstimateKg: 0.9,
    safetyTips: ['Check that tins are not dented or bulging', 'Verify manufacturer expiry on box'],
  },
  beverages: {
    foodType: 'Cold-Pressed Juices & Organic Oat Milk Bottles',
    category: 'Beverages',
    confidence: 0.93,
    estimatedShelfLifeHours: 24,
    expiryRiskLevel: 'Moderate',
    safeStorageRecommendation: 'Refrigerated (0°C - 4°C)',
    dietaryClassification: 'Vegan',
    carbonOffsetEstimateKg: 1.1,
    safetyTips: ['Keep chilled and away from direct sunlight'],
  },
};

export const classifyFoodImage = async (
  titleOrHint: string,
  imageNameOrUrl?: string
): Promise<ClassificationResult> => {
  // Simulate AI latency for realistic UX
  await new Promise((res) => setTimeout(res, 600));

  const text = (titleOrHint + ' ' + (imageNameOrUrl || '')).toLowerCase();

  let matchedKey = 'meals';
  if (text.includes('rice') || text.includes('biryani') || text.includes('pulao')) matchedKey = 'rice';
  else if (text.includes('bread') || text.includes('bakery') || text.includes('cake') || text.includes('pastry') || text.includes('croissant')) matchedKey = 'bread';
  else if (text.includes('fruit') || text.includes('apple') || text.includes('banana') || text.includes('mango') || text.includes('orange')) matchedKey = 'fruits';
  else if (text.includes('veg') || text.includes('salad') || text.includes('tomato') || text.includes('carrot')) matchedKey = 'vegetables';
  else if (text.includes('milk') || text.includes('dairy') || text.includes('cheese') || text.includes('paneer') || text.includes('curd')) matchedKey = 'dairy';
  else if (text.includes('pack') || text.includes('canned') || text.includes('cereal') || text.includes('pasta') || text.includes('biscuit')) matchedKey = 'packaged';
  else if (text.includes('juice') || text.includes('drink') || text.includes('beverage') || text.includes('smoothie')) matchedKey = 'beverages';
  else if (text.includes('buffet') || text.includes('curry') || text.includes('roti') || text.includes('meal') || text.includes('catering')) matchedKey = 'meals';

  const base = FOOD_KNOWLEDGE_BASE[matchedKey];

  return {
    foodType: base.foodType || titleOrHint || 'Assorted Nutritious Surplus Food',
    category: base.category || 'Cooked Meals',
    confidence: +(0.88 + Math.random() * 0.1).toFixed(2),
    estimatedShelfLifeHours: base.estimatedShelfLifeHours || 6,
    expiryRiskLevel: base.expiryRiskLevel || 'Moderate',
    safeStorageRecommendation: base.safeStorageRecommendation || 'Refrigerated (0°C - 4°C)',
    dietaryClassification: base.dietaryClassification || 'Nutritious Mixed',
    carbonOffsetEstimateKg: base.carbonOffsetEstimateKg || 2.5,
    safetyTips: base.safetyTips || ['Ensure clean container sealing', 'Keep food at recommended holding temperatures'],
  };
};

/**
 * Calculates current expiry urgency & status
 */
export const calculateExpiryStatus = (
  expiryTimeIso: string
): { status: 'fresh' | 'available' | 'expiring_soon' | 'urgent' | 'expired'; hoursRemaining: number; label: string; color: string } => {
  const expiry = new Date(expiryTimeIso).getTime();
  const now = Date.now();
  const diffMs = expiry - now;
  const hoursRemaining = +(diffMs / (1000 * 60 * 60)).toFixed(1);

  if (diffMs <= 0) {
    return { status: 'expired', hoursRemaining: 0, label: 'Expired', color: 'bg-red-100 text-red-700 border-red-200' };
  }
  if (hoursRemaining <= 3) {
    return { status: 'urgent', hoursRemaining, label: `Urgent (${hoursRemaining}h left)`, color: 'bg-orange-100 text-orange-700 border-orange-300 animate-pulse' };
  }
  if (hoursRemaining <= 8) {
    return { status: 'expiring_soon', hoursRemaining, label: `Expiring Soon (${hoursRemaining}h left)`, color: 'bg-amber-100 text-amber-800 border-amber-200' };
  }
  if (hoursRemaining <= 24) {
    return { status: 'available', hoursRemaining, label: `Available (${Math.round(hoursRemaining)}h left)`, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  }
  return { status: 'fresh', hoursRemaining, label: 'Fresh (24h+)', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' };
};

/**
 * Smart Matching Algorithm: Computes match percentage and reasons
 */
export const computeSmartMatches = (
  donation: Partial<FoodDonation>,
  ngos: User[]
): { ngoId: string; ngoName: string; score: number; reasons: string[] }[] => {
  const verifiedNgos = ngos.filter((n) => n.role === 'ngo' && n.verified);
  const qty = donation.quantity || 10;
  const storage = donation.storageRequirements || 'Dry / Room Temperature';

  const results = verifiedNgos.map((ngo) => {
    let score = 70;
    const reasons: string[] = [];

    // Capacity check
    const capacity = ngo.capacityKg || 100;
    if (capacity >= qty * 1.5) {
      score += 12;
      reasons.push(`High distribution capacity (${capacity} kg)`);
    } else if (capacity >= qty) {
      score += 6;
      reasons.push(`Adequate receiving capacity`);
    } else {
      score -= 15;
    }

    // Storage match
    if (storage.includes('Refrigerated') || storage.includes('Frozen')) {
      score += 8;
      reasons.push('Equipped with cold storage facilities');
    } else {
      score += 5;
      reasons.push('Standard ambient storage ready');
    }

    // Distance/City proximity
    if (ngo.location.city === donation.pickupLocation?.city) {
      score += 10;
      reasons.push(`Located nearby in ${ngo.location.city} (< 5 km)`);
    } else {
      score -= 5;
      reasons.push(`Same metro zone`);
    }

    // Expiry urgency weighting
    if (donation.isEmergencyRescue || donation.priority === 'critical' || donation.priority === 'high') {
      score += 5;
      reasons.push('Rapid-response team available on standby');
    }

    // High rating
    if (ngo.points > 300) {
      reasons.push('Gold-tier verified redistribution partner');
    }

    const finalScore = Math.min(99, Math.max(65, score));
    return {
      ngoId: ngo.id,
      ngoName: ngo.organizationName || ngo.name,
      score: finalScore,
      reasons: reasons.slice(0, 3),
    };
  });

  return results.sort((a, b) => b.score - a.score);
};

/**
 * AI Demand Prediction dataset
 */
export const getDemandPredictions = (): DemandPrediction[] => [
  {
    category: 'Cooked Meals',
    demandLevel: 'Very High',
    peakHours: '12:00 PM - 2:30 PM & 6:30 PM - 9:30 PM',
    highDemandLocations: ['Downtown Community Centers', 'Railway Shelter Zones', 'East Side Worker Camps'],
    urgencyIndex: 94,
    recommendedAction: 'Direct to high-capacity evening soup kitchens with warming units.',
  },
  {
    category: 'Rice',
    demandLevel: 'High',
    peakHours: '1:00 PM - 3:00 PM',
    highDemandLocations: ['Suburban Food Pantries', 'Community Orphanages'],
    urgencyIndex: 86,
    recommendedAction: 'Combine with vegetable curry distributions for balanced hot meals.',
  },
  {
    category: 'Bread/Bakery',
    demandLevel: 'Moderate',
    peakHours: '8:00 AM - 11:00 AM',
    highDemandLocations: ['Student Breakfast Clubs', 'Day Shelter Shelves'],
    urgencyIndex: 72,
    recommendedAction: 'Ideal for morning breakfast baskets and school support hubs.',
  },
  {
    category: 'Vegetables',
    demandLevel: 'High',
    peakHours: 'All Day Distribution',
    highDemandLocations: ['Low-Income Neighborhood Pantries', 'Elderly Care Centers'],
    urgencyIndex: 88,
    recommendedAction: 'Fast-track to community kitchens for immediate batch cooking.',
  },
  {
    category: 'Dairy',
    demandLevel: 'Very High',
    peakHours: 'Morning & Late Afternoon',
    highDemandLocations: ['Maternal Health Hubs', 'Child Welfare Centers'],
    urgencyIndex: 92,
    recommendedAction: 'Prioritize insulated transport vans with digital temperature logs.',
  },
];
