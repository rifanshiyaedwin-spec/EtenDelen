import React, { useState, useMemo } from 'react';
import { FoodCategory, FoodCondition, FoodDonation } from '../types';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { FoodCard } from '../components/food/FoodCard';
import {
  Search,
  Filter,
  Flame,
  Clock,
  Sparkles,
  MapPin,
  SlidersHorizontal,
  X,
  PlusCircle,
} from 'lucide-react';

interface BrowseFoodViewProps {
  onSelectDonation: (donation: FoodDonation) => void;
  onAcceptDonation: (donation: FoodDonation) => void;
  onRequestPickup: (donation: FoodDonation) => void;
  onNavigate: (view: string) => void;
  initialFilter?: string;
}

const CATEGORIES: (FoodCategory | 'All')[] = [
  'All',
  'Cooked Meals',
  'Rice',
  'Bread/Bakery',
  'Fruits',
  'Vegetables',
  'Dairy',
  'Packaged Food',
  'Beverages',
  'Groceries',
  'Other',
];

export const BrowseFoodView: React.FC<BrowseFoodViewProps> = ({
  onSelectDonation,
  onAcceptDonation,
  onRequestPickup,
  onNavigate,
  initialFilter,
}) => {
  const { donations, currentUser } = useApp();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialFilter || 'All');
  const [onlyVegetarian, setOnlyVegetarian] = useState(false);
  const [onlyEmergency, setOnlyEmergency] = useState(initialFilter === 'emergency');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(25);

  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      // Search filter
      const q = searchQuery.toLowerCase().trim();
      if (
        q &&
        !d.title.toLowerCase().includes(q) &&
        !d.description.toLowerCase().includes(q) &&
        !d.id.toLowerCase().includes(q) &&
        !d.donorType.toLowerCase().includes(q) &&
        !d.pickupAddress.toLowerCase().includes(q)
      ) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && d.category !== selectedCategory) {
        return false;
      }

      // Veg filter
      if (onlyVegetarian && !d.isVegetarian) {
        return false;
      }

      // Emergency filter
      if (onlyEmergency && !d.isEmergencyRescue) {
        return false;
      }

      // Status filter
      if (selectedStatus === 'available' && (d.status === 'completed' || d.status === 'cancelled')) {
        return false;
      }
      if (selectedStatus === 'completed' && d.status !== 'completed') {
        return false;
      }

      return true;
    });
  }, [donations, searchQuery, selectedCategory, onlyVegetarian, onlyEmergency, selectedStatus]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Surplus Food Redistribution Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time feed of safe, edible surplus food from certified hospitality and retail donors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('map_view')}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Map View</span>
            </button>
            <button
              onClick={() => onNavigate('create_donation')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ List Surplus Food</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food title, category, donor name, area or ID (e.g. ED-2026-9041)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Quick Switches */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setOnlyEmergency(!onlyEmergency)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  onlyEmergency
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Emergency Only</span>
              </button>

              <button
                onClick={() => setOnlyVegetarian(!onlyVegetarian)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  onlyVegetarian
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Pure Veg</span>
              </button>
            </div>
          </div>

          {/* Category Chips Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Food Listings Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 text-xs text-slate-500 font-medium">
          <span>
            Showing <strong>{filteredDonations.length}</strong> surplus food donations
          </span>
          <div className="flex items-center gap-2">
            <span>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent border-0 font-bold text-slate-700 cursor-pointer text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="available">Active / Available Only</option>
              <option value="completed">Completed / Redistributed</option>
            </select>
          </div>
        </div>

        {filteredDonations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <Filter className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No surplus donations match these filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query, distance filter, or category selection to view available listings.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setOnlyVegetarian(false);
                setOnlyEmergency(false);
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-emerald-700 transition"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonations.map((donation) => (
              <FoodCard
                key={donation.id}
                donation={donation}
                onViewDetails={onSelectDonation}
                onAccept={onAcceptDonation}
                onRequestPickup={onRequestPickup}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
