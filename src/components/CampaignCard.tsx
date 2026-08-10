'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Clock, Users, Bookmark, CheckCircle2, ArrowRight } from 'lucide-react';
import { Campaign } from '@/lib/db';
import { useAuth } from '@/lib/auth-context';

interface CampaignCardProps {
  campaign: Campaign;
  onBookmarkToggle?: (campaignId: string) => void;
  onRegisterToggle?: (campaignId: string) => void;
}

export default function CampaignCard({ campaign, onBookmarkToggle, onRegisterToggle }: CampaignCardProps) {
  const { currentUser } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(campaign.is_bookmarked || false);
  const [isRegistered, setIsRegistered] = useState(campaign.is_registered || false);
  const [loading, setLoading] = useState(false);

  const registeredCount = campaign.registered_count || 0;
  const spotsLeft = Math.max(0, campaign.required_volunteers - registeredCount);
  const progressPercent = Math.min(100, Math.round((registeredCount / campaign.required_volunteers) * 100));

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentUser.role !== 'STUDENT') return;

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: currentUser.id, campaign_id: campaign.id }),
      });
      const data = await res.json();
      if (data.success) {
        setIsBookmarked(data.is_bookmarked);
        if (onBookmarkToggle) onBookmarkToggle(campaign.id);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleQuickRegister = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentUser.role !== 'STUDENT') return;
    setLoading(true);

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: currentUser.id,
          campaign_id: campaign.id,
          action: isRegistered ? 'cancel' : 'register',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsRegistered(!isRegistered);
        if (onRegisterToggle) onRegisterToggle(campaign.id);
      }
    } catch (err) {
      console.error('Failed to register:', err);
    } finally {
      setLoading(false);
    }
  };

  const causeColors: Record<string, string> = {
    'Hunger Relief': 'bg-amber-100 text-amber-800 border-amber-200',
    'Education & Tech': 'bg-blue-100 text-blue-800 border-blue-200',
    'Environment': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Elderly Care': 'bg-purple-100 text-purple-800 border-purple-200',
    'Blood & Health': 'bg-rose-100 text-rose-800 border-rose-200',
  };

  const badgeColorClass = causeColors[campaign.cause_category] || 'bg-terracotta-100 text-terracotta-800 border-terracotta-200';

  return (
    <div className="group bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-warm-sm hover:shadow-warm-lg transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={campaign.image_url}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

        {/* Cause Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${badgeColorClass}`}>
            {campaign.cause_category}
          </span>
        </div>

        {/* Bookmark Button */}
        {currentUser.role === 'STUDENT' && (
          <button
            onClick={handleBookmark}
            title={isBookmarked ? 'Remove Bookmark' : 'Save Campaign'}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-terracotta-600 shadow-sm transition-transform active:scale-95"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-terracotta-600 text-terracotta-600' : ''}`} />
          </button>
        )}

        {/* Spots Badge */}
        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1">
          <Users className="w-3 h-3 text-terracotta-400" />
          <span>{spotsLeft} spots left</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* NGO Name */}
          <p className="text-xs font-semibold text-terracotta-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 inline-block" />
            {campaign.ngo_name}
          </p>

          {/* Title */}
          <Link href={`/campaigns/${campaign.id}`} className="block group-hover:text-terracotta-600 transition-colors">
            <h3 className="heading-serif text-lg font-bold text-slate-900 leading-snug line-clamp-2 mb-2">
              {campaign.title}
            </h3>
          </Link>

          {/* Location & Schedule */}
          <div className="space-y-1.5 my-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-terracotta-600 flex-shrink-0" />
              <span className="truncate font-medium">{campaign.location}</span>
            </div>

            <div className="flex items-center gap-4 text-slate-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{new Date(campaign.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{campaign.duration_hours} Hours</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* Volunteer Quota Bar */}
          <div className="my-3">
            <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
              <span>Volunteers Enrolled</span>
              <span className="font-semibold text-slate-700">{registeredCount} / {campaign.required_volunteers}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-terracotta-500 to-terracotta-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <Link
              href={`/campaigns/${campaign.id}`}
              className="text-xs font-bold text-slate-700 hover:text-terracotta-600 flex items-center gap-1 transition-colors"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {currentUser.role === 'STUDENT' && (
              <button
                onClick={handleQuickRegister}
                disabled={loading}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm ${
                  isRegistered
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-terracotta-600 text-white hover:bg-terracotta-700 active:scale-95'
                }`}
              >
                {isRegistered ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Registered</span>
                  </>
                ) : (
                  <span>Volunteer</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
