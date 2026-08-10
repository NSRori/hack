'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, AlertCircle } from 'lucide-react';
import { Campaign } from '@/lib/db';
import { useAuth } from '@/lib/auth-context';
import CampaignCard from '@/components/CampaignCard';
import CampaignFilters from '@/components/CampaignFilters';

export default function BrowseCampaignsPage() {
  const { currentUser } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedCause, setSelectedCause] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedDuration, setSelectedDuration] = useState('ALL');

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedCause !== 'ALL') params.set('cause', selectedCause);
      if (selectedLocation !== 'ALL') params.set('location', selectedLocation);
      if (selectedDuration !== 'ALL') params.set('duration', selectedDuration);
      if (currentUser?.id) params.set('student_id', currentUser.id);

      const res = await fetch(`/api/campaigns?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.campaigns);
      }
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [search, selectedCause, selectedLocation, selectedDuration, currentUser.id]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCause('ALL');
    setSelectedLocation('ALL');
    setSelectedDuration('ALL');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-earth-100 via-earth-50 to-brand-warm rounded-3xl p-8 border border-terracotta-100 relative overflow-hidden shadow-warm-sm">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-terracotta-100 text-terracotta-800 px-3 py-1 rounded-full text-xs font-bold border border-terracotta-200">
            <Compass className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Audited Opportunities</span>
          </div>
          <h1 className="heading-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Browse NGO Campaigns
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Discover verified volunteer initiatives matching your skills and schedule across Bengaluru. Every campaign is backed by an official NGO partner.
          </p>
        </div>
      </div>

      {/* Filter Control Bar */}
      <CampaignFilters
        search={search}
        setSearch={setSearch}
        selectedCause={selectedCause}
        setSelectedCause={setSelectedCause}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
        onReset={handleResetFilters}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Showing {campaigns.length} Campaign{campaigns.length !== 1 ? 's' : ''}
        </h2>
        {currentUser.role === 'STUDENT' && (
          <span className="text-xs text-terracotta-700 font-semibold bg-terracotta-50 px-2.5 py-1 rounded-lg border border-terracotta-200">
            Logged in as {currentUser.name} ({currentUser.college_name?.split(' ')[0]})
          </span>
        )}
      </div>

      {/* Campaigns Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-slate-200/60 rounded-2xl" />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="heading-serif text-xl font-bold text-slate-900">No campaigns match your filters</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search keywords, clearing location filters, or resetting cause categories.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onBookmarkToggle={fetchCampaigns}
              onRegisterToggle={fetchCampaigns}
            />
          ))}
        </div>
      )}
    </div>
  );
}
