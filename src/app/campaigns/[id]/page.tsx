'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { MapPin, Calendar, Clock, Users, Bookmark, CheckCircle2, ShieldCheck, ArrowLeft, Building2, Heart, Award, AlertCircle } from 'lucide-react';
import { Campaign } from '@/lib/db';
import { useAuth } from '@/lib/auth-context';

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');

  const fetchCampaignDetails = async () => {
    try {
      const studentIdParam = currentUser?.id ? `?student_id=${currentUser.id}` : '';
      const res = await fetch(`/api/campaigns/${id}${studentIdParam}`);
      const data = await res.json();
      if (data.success) {
        setCampaign(data.campaign);
      } else {
        setError(data.error || 'Campaign not found');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading campaign');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignDetails();
  }, [id, currentUser.id]);

  const handleRegisterToggle = async () => {
    if (!campaign || currentUser.role !== 'STUDENT') return;
    setRegistering(true);

    try {
      const action = campaign.is_registered ? 'cancel' : 'register';
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: currentUser.id,
          campaign_id: campaign.id,
          action,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (action === 'register') {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#C85A32', '#E07A5F', '#2A9D8F', '#F4F1DE'],
          });
        }
        await fetchCampaignDetails();
      }
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setRegistering(false);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!campaign || currentUser.role !== 'STUDENT') return;

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: currentUser.id,
          campaign_id: campaign.id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCampaign((prev) => (prev ? { ...prev, is_bookmarked: data.is_bookmarked } : prev));
      }
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-64 bg-slate-200 rounded-3xl" />
        <div className="h-10 bg-slate-200 rounded-xl w-3/4" />
        <div className="h-32 bg-slate-200 rounded-xl" />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="heading-serif text-2xl font-bold text-slate-900">Campaign Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'This opportunity may have been removed or updated.'}</p>
        <Link href="/campaigns" className="inline-block px-5 py-2.5 bg-terracotta-600 text-white font-bold text-xs rounded-xl">
          Back to Browse Campaigns
        </Link>
      </div>
    );
  }

  const registeredCount = campaign.registered_count || 0;
  const spotsLeft = Math.max(0, campaign.required_volunteers - registeredCount);
  const requirementsList: string[] = campaign.requirements
    ? typeof campaign.requirements === 'string'
      ? JSON.parse(campaign.requirements)
      : campaign.requirements
    : ['Comfortable clothing', 'Student ID card', 'Punctuality'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <Link
        href="/campaigns"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-terracotta-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Browse Campaigns</span>
      </Link>

      {/* Hero Cover Banner */}
      <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-warm-lg border border-slate-200 bg-slate-900">
        <img src={campaign.image_url} alt={campaign.title} className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

        {/* Cause Badge */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <span className="bg-terracotta-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-md">
            {campaign.cause_category}
          </span>
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
            {spotsLeft} Spots Available
          </span>
        </div>

        {/* Hero Title & NGO Info */}
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <div className="flex items-center gap-2 text-terracotta-300 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>{campaign.ngo_name}</span>
          </div>
          <h1 className="heading-serif text-2xl sm:text-4xl font-bold leading-tight max-w-3xl">
            {campaign.title}
          </h1>
        </div>
      </div>

      {/* Main Grid: Details + Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Key Quick Info Bar */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-warm-sm grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-terracotta-600" /> Location
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-900">{campaign.location}</p>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-terracotta-600" /> Date
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-900">
                {new Date(campaign.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-terracotta-600" /> Duration
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-900">{campaign.duration_hours} Hours</p>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-warm-sm space-y-4">
            <h3 className="heading-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              About This Volunteer Campaign
            </h3>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {campaign.description}
            </div>
          </div>

          {/* Prerequisites & Volunteer Requirements */}
          <div className="bg-earth-50 rounded-2xl p-6 border border-earth-200 space-y-4">
            <h4 className="heading-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-terracotta-600" />
              What You Should Bring / Prerequisites
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {requirementsList.map((req, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-terracotta-500 flex-shrink-0" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Certification Guarantee */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 flex items-center gap-4 shadow-warm-md">
            <div className="w-12 h-12 rounded-xl bg-terracotta-500/20 border border-terracotta-400/30 flex items-center justify-center text-terracotta-400 flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Verified Portfolio Certificate Included</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Upon completing your shift, the NGO will verify your attendance, granting you an official downloadable certificate for your college portfolio.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Action Card */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-terracotta-200 shadow-warm-md space-y-6">
            <div className="space-y-2 text-center pb-4 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta-600 bg-terracotta-50 px-2.5 py-1 rounded-full">
                Registration Status
              </span>
              <p className="text-2xl font-bold text-slate-900">
                {registeredCount} / {campaign.required_volunteers}
              </p>
              <p className="text-xs text-slate-500 font-medium">Volunteers currently signed up</p>
            </div>

            {currentUser.role === 'STUDENT' ? (
              <div className="space-y-3">
                {campaign.is_registered ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-emerald-800">You Are Registered for this Campaign!</p>
                    <p className="text-[11px] text-emerald-700">
                      View details anytime on your Student Dashboard.
                    </p>
                    <button
                      onClick={handleRegisterToggle}
                      disabled={registering}
                      className="text-xs text-rose-600 font-semibold hover:underline pt-2 block mx-auto"
                    >
                      {registering ? 'Updating...' : 'Cancel Registration'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleRegisterToggle}
                    disabled={registering || spotsLeft === 0}
                    className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-warm-md hover:shadow-warm-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{registering ? 'Processing Registration...' : 'Volunteer for this Campaign'}</span>
                  </button>
                )}

                {/* Bookmark Toggle */}
                <button
                  onClick={handleBookmarkToggle}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-colors ${
                    campaign.is_bookmarked
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-earth-50'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${campaign.is_bookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
                  <span>{campaign.is_bookmarked ? 'Saved to Bookmarks' : 'Bookmark Campaign'}</span>
                </button>
              </div>
            ) : (
              <div className="bg-earth-50 p-4 rounded-2xl border border-earth-200 text-center space-y-2">
                <p className="text-xs font-bold text-slate-800">Logged in as NGO Partner</p>
                <p className="text-[11px] text-slate-600">
                  Switch active role to Student using the top banner to test registering for campaigns.
                </p>
              </div>
            )}

            {/* NGO Contact Info */}
            <div className="pt-4 border-t border-slate-100 text-xs space-y-2 text-slate-600">
              <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Campaign Organizer</p>
              <p className="font-semibold text-slate-900">{campaign.ngo_name}</p>
              <p className="text-slate-500">Verified Non-Profit Partner</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
