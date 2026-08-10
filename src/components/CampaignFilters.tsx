'use client';

import React from 'react';
import { Search, Filter, RotateCcw, MapPin, Clock } from 'lucide-react';

interface CampaignFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  selectedCause: string;
  setSelectedCause: (val: string) => void;
  selectedLocation: string;
  setSelectedLocation: (val: string) => void;
  selectedDuration: string;
  setSelectedDuration: (val: string) => void;
  onReset: () => void;
}

const CAUSES = [
  { id: 'ALL', label: 'All Causes' },
  { id: 'Hunger Relief', label: 'Hunger Relief' },
  { id: 'Education & Tech', label: 'Education & Tech' },
  { id: 'Environment', label: 'Environment' },
  { id: 'Elderly Care', label: 'Elderly Care' },
  { id: 'Blood & Health', label: 'Blood & Health' },
];

const LOCATIONS = [
  { id: 'ALL', label: 'All Locations (Bengaluru)' },
  { id: 'Raja Rajeshwari Nagar', label: 'RR Nagar' },
  { id: 'Jayanagar', label: 'Jayanagar' },
  { id: 'Kengeri', label: 'Kengeri' },
  { id: 'Koramangala', label: 'Koramangala' },
  { id: 'Banashankari', label: 'Banashankari' },
];

const DURATIONS = [
  { id: 'ALL', label: 'Any Duration' },
  { id: 'SHORT', label: 'Short (≤ 3 Hours)' },
  { id: 'MEDIUM', label: 'Medium (4 - 5 Hours)' },
  { id: 'LONG', label: 'Full Day (6+ Hours)' },
];

export default function CampaignFilters({
  search,
  setSearch,
  selectedCause,
  setSelectedCause,
  selectedLocation,
  setSelectedLocation,
  selectedDuration,
  setSelectedDuration,
  onReset,
}: CampaignFiltersProps) {
  const isFiltered = search !== '' || selectedCause !== 'ALL' || selectedLocation !== 'ALL' || selectedDuration !== 'ALL';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-warm-sm space-y-4 mb-8">
      {/* Top Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-grow w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns by title, NGO name, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-earth-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:bg-white transition-all"
          />
        </div>

        {/* Location Dropdown */}
        <div className="relative w-full md:w-56">
          <MapPin className="w-4 h-4 text-terracotta-600 absolute left-3 top-3 pointer-events-none" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-earth-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-terracotta-500 cursor-pointer"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.label}
              </option>
            ))}
          </select>
        </div>

        {/* Duration Dropdown */}
        <div className="relative w-full md:w-52">
          <Clock className="w-4 h-4 text-terracotta-600 absolute left-3 top-3 pointer-events-none" />
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-earth-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-terracotta-500 cursor-pointer"
          >
            {DURATIONS.map((dur) => (
              <option key={dur.id} value={dur.id}>
                {dur.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        {isFiltered && (
          <button
            onClick={onReset}
            className="w-full md:w-auto px-4 py-2.5 text-xs font-semibold text-terracotta-700 bg-terracotta-50 hover:bg-terracotta-100 border border-terracotta-200 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Cause Category Pills */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-2 flex-shrink-0">
          <Filter className="w-3 h-3 text-slate-400" />
          Causes:
        </span>
        {CAUSES.map((cause) => {
          const isActive = selectedCause === cause.id;
          return (
            <button
              key={cause.id}
              onClick={() => setSelectedCause(cause.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                isActive
                  ? 'bg-terracotta-600 text-white shadow-sm scale-105'
                  : 'bg-earth-50 text-slate-600 hover:bg-earth-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cause.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
