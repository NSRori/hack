'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Award, Bookmark, CheckCircle2, User, Building2, GraduationCap, XCircle, FileText, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Registration, Campaign } from '@/lib/db';
import CertificateModal from '@/components/CertificateModal';
import CampaignCard from '@/components/CampaignCard';

export default function StudentDashboardPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'saved'>('upcoming');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [bookmarks, setBookmarks] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertReg, setSelectedCertReg] = useState<Registration | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch registrations
      const regRes = await fetch(`/api/registrations?student_id=${currentUser.id}`);
      const regData = await regRes.json();
      if (regData.success) {
        setRegistrations(regData.registrations);
      }

      // Fetch bookmarks
      const bmRes = await fetch(`/api/bookmarks?student_id=${currentUser.id}`);
      const bmData = await bmRes.json();
      if (bmData.success) {
        setBookmarks(bmData.bookmarks);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser.id]);

  const handleCancel = async (campaignId: string) => {
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: currentUser.id,
          campaign_id: campaignId,
          action: 'cancel',
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to cancel registration:', err);
    }
  };

  const upcomingRegistrations = registrations.filter((r) => r.status === 'REGISTERED' || r.status === 'CONFIRMED');
  const pastRegistrations = registrations.filter((r) => r.status === 'ATTENDED');

  const totalCompletedHours = pastRegistrations.reduce((acc, r) => acc + (r.campaign_duration || 4), 0);
  const studentSkills: string[] = currentUser.skills ? JSON.parse(currentUser.skills) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Student Profile Overview Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-warm-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'}
            alt={currentUser.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-terracotta-400 shadow-sm"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-terracotta-100 text-terracotta-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-terracotta-200">
                Verified Student Volunteer
              </span>
            </div>
            <h1 className="heading-serif text-2xl sm:text-3xl font-bold text-slate-900">
              {currentUser.name}
            </h1>
            <p className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-terracotta-600" />
              <span>{currentUser.college_name || 'RNSIT (R.N.S. Institute of Technology)'}</span>
            </p>
            {studentSkills.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {studentSkills.map((sk, idx) => (
                  <span key={idx} className="bg-earth-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                    {sk}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center gap-4 bg-earth-50 p-4 rounded-2xl border border-earth-200 w-full md:w-auto justify-around">
          <div className="text-center px-3">
            <p className="heading-serif text-2xl font-extrabold text-terracotta-700">{upcomingRegistrations.length}</p>
            <p className="text-[11px] text-slate-500 font-semibold">Upcoming</p>
          </div>
          <div className="h-8 w-px bg-slate-300" />
          <div className="text-center px-3">
            <p className="heading-serif text-2xl font-extrabold text-emerald-700">{totalCompletedHours}</p>
            <p className="text-[11px] text-slate-500 font-semibold">Verified Hours</p>
          </div>
          <div className="h-8 w-px bg-slate-300" />
          <div className="text-center px-3">
            <p className="heading-serif text-2xl font-extrabold text-amber-700">{bookmarks.length}</p>
            <p className="text-[11px] text-slate-500 font-semibold">Saved</p>
          </div>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="border-b border-slate-200 flex items-center gap-8">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 ${
            activeTab === 'upcoming'
              ? 'text-terracotta-600 border-b-2 border-terracotta-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Upcoming Campaigns ({upcomingRegistrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 ${
            activeTab === 'history'
              ? 'text-terracotta-600 border-b-2 border-terracotta-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Past History & Certificates ({pastRegistrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 text-sm font-bold transition-all relative flex items-center gap-2 ${
            activeTab === 'saved'
              ? 'text-terracotta-600 border-b-2 border-terracotta-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved / Bookmarked ({bookmarks.length})</span>
        </button>
      </div>

      {/* Tab 1: Upcoming Campaigns */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingRegistrations.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 max-w-md mx-auto space-y-3">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="heading-serif text-lg font-bold text-slate-900">No Upcoming Registered Campaigns</h3>
              <p className="text-xs text-slate-500">Explore available NGO campaigns and sign up for weekend volunteer shifts.</p>
              <Link
                href="/campaigns"
                className="inline-block px-5 py-2.5 bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                Browse Campaigns
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingRegistrations.map((reg) => (
                <div key={reg.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-warm-sm flex flex-col justify-between space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-terracotta-700 uppercase tracking-wider">
                        {reg.campaign_ngo_name}
                      </span>
                      <h4 className="heading-serif font-bold text-slate-900 text-base leading-snug">
                        {reg.campaign_title}
                      </h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      reg.status === 'CONFIRMED'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {reg.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 bg-earth-50 p-3 rounded-xl border border-earth-200">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-terracotta-600" />
                      <span>{reg.campaign_location}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{reg.campaign_date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{reg.campaign_duration} Hours</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <Link href={`/campaigns/${reg.campaign_id}`} className="font-bold text-slate-700 hover:text-terracotta-600">
                      View Details →
                    </Link>
                    <button
                      onClick={() => handleCancel(reg.campaign_id)}
                      className="text-rose-600 font-semibold hover:underline"
                    >
                      Cancel Registration
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Past History & Certificates */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {pastRegistrations.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 max-w-md mx-auto space-y-3">
              <Award className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="heading-serif text-lg font-bold text-slate-900">No Attended History Yet</h3>
              <p className="text-xs text-slate-500">Once an NGO verifies your attendance after a shift, your completed certificates will appear here!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastRegistrations.map((reg) => (
                <div key={reg.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-warm-sm flex flex-col justify-between space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed & Verified
                      </span>
                      <h4 className="heading-serif font-bold text-slate-900 text-base leading-snug">
                        {reg.campaign_title}
                      </h4>
                      <p className="text-xs text-slate-500">{reg.campaign_ngo_name}</p>
                    </div>
                  </div>

                  <div className="bg-earth-50 p-3 rounded-xl border border-earth-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Hours Logged</p>
                      <p className="font-bold text-terracotta-700">{reg.campaign_duration || 4} Verified Hours</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Date</p>
                      <p className="font-bold text-slate-800">{reg.campaign_date}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCertReg(reg)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Award className="w-4 h-4 text-terracotta-400" />
                    <span>View & Print Official Certificate</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved / Bookmarked */}
      {activeTab === 'saved' && (
        <div>
          {bookmarks.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 max-w-md mx-auto space-y-3">
              <Bookmark className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="heading-serif text-lg font-bold text-slate-900">No Saved Campaigns</h3>
              <p className="text-xs text-slate-500">Bookmark interesting campaigns while browsing to access them quickly later.</p>
              <Link href="/campaigns" className="inline-block px-5 py-2.5 bg-terracotta-600 text-white font-bold text-xs rounded-xl">
                Explore Campaigns
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bookmarks.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onBookmarkToggle={fetchData}
                  onRegisterToggle={fetchData}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={Boolean(selectedCertReg)}
        onClose={() => setSelectedCertReg(null)}
        registration={selectedCertReg}
      />
    </div>
  );
}
