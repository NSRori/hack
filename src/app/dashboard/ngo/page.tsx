'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Users, Calendar, MapPin, CheckCircle2, Clock, Building2, Phone, Mail, GraduationCap, Edit3, Trash2, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Campaign, Registration } from '@/lib/db';
import CreateCampaignModal from '@/components/CreateCampaignModal';

interface CampaignApplicantGroup {
  campaign: Campaign;
  applicants: Registration[];
}

export default function NgoAdminDashboardPage() {
  const { currentUser } = useAuth();
  const [campaignGroups, setCampaignGroups] = useState<CampaignApplicantGroup[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchNgoData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/registrations?ngo_id=${currentUser.id}`);
      const data = await res.json();
      if (data.success) {
        setCampaignGroups(data.campaignApplicants);
        if (data.campaignApplicants.length > 0 && !selectedCampaignId) {
          setSelectedCampaignId(data.campaignApplicants[0].campaign.id);
        }
      }
    } catch (err) {
      console.error('Failed to load NGO dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNgoData();
  }, [currentUser.id]);

  const handleStatusUpdate = async (registrationId: string, newStatus: 'REGISTERED' | 'CONFIRMED' | 'ATTENDED' | 'CANCELLED') => {
    setUpdatingId(registrationId);
    try {
      const res = await fetch('/api/registrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_id: registrationId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchNgoData();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const selectedGroup = campaignGroups.find((g) => g.campaign.id === selectedCampaignId) || campaignGroups[0];

  const totalCampaigns = campaignGroups.length;
  const totalApplicants = campaignGroups.reduce((acc, g) => acc + g.applicants.length, 0);
  const totalConfirmed = campaignGroups.reduce(
    (acc, g) => acc + g.applicants.filter((a) => a.status === 'CONFIRMED' || a.status === 'ATTENDED').length,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-warm-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-terracotta-600 flex items-center justify-center text-white font-bold text-2xl shadow-sm">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                Audited NGO Partner
              </span>
            </div>
            <h1 className="heading-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              {currentUser.name}
            </h1>
            <p className="text-xs text-slate-300">Campaign Management & Volunteer Roster</p>
          </div>
        </div>

        {/* Create Campaign Action CTA */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-terracotta-600 hover:bg-terracotta-500 text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl shadow-warm-md hover:shadow-warm-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Publish New Campaign</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-warm-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center font-bold text-xl">
            {totalCampaigns}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Campaigns</p>
            <p className="text-lg font-bold text-slate-900">Published</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-warm-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
            {totalApplicants}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Registered</p>
            <p className="text-lg font-bold text-slate-900">Student Volunteers</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-warm-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
            {totalConfirmed}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Confirmed & Attended</p>
            <p className="text-lg font-bold text-slate-900">Ready for Action</p>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Left Campaign List, Right Volunteer Roster */}
      {loading ? (
        <div className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
      ) : campaignGroups.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="heading-serif text-xl font-bold text-slate-900">No Campaigns Published Yet</h3>
          <p className="text-xs text-slate-500">Create your NGO's first volunteering initiative to start accepting student applicants.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-terracotta-600 text-white font-bold text-xs rounded-xl"
          >
            Create First Campaign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Campaigns Selector */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Campaign to Manage Volunteers
            </h3>
            {campaignGroups.map(({ campaign, applicants }) => {
              const isSelected = selectedCampaignId === campaign.id;
              return (
                <div
                  key={campaign.id}
                  onClick={() => setSelectedCampaignId(campaign.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-terracotta-50 border-terracotta-400 shadow-warm-sm ring-1 ring-terracotta-400'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-earth-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-terracotta-700 uppercase tracking-wider">
                        {campaign.cause_category}
                      </span>
                      <h4 className="heading-serif font-bold text-slate-900 text-sm leading-snug">
                        {campaign.title}
                      </h4>
                    </div>
                    <ChevronRight className={`w-4 h-4 mt-1 transition-transform ${isSelected ? 'text-terracotta-600 translate-x-1' : 'text-slate-400'}`} />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {campaign.date}
                    </span>
                    <span className="font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {applicants.length} / {campaign.required_volunteers} Volunteers
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Campaign's Volunteer Management View */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-warm-sm space-y-6">
            {selectedGroup && (
              <>
                <div className="border-b border-slate-100 pb-4">
                  <span className="bg-terracotta-100 text-terracotta-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {selectedGroup.campaign.cause_category}
                  </span>
                  <h2 className="heading-serif text-2xl font-bold text-slate-900 mt-2">
                    {selectedGroup.campaign.title}
                  </h2>
                  <p className="text-xs text-slate-500 flex items-center gap-4 mt-1">
                    <span>📍 {selectedGroup.campaign.location}</span>
                    <span>📅 {selectedGroup.campaign.date}</span>
                    <span>⏰ {selectedGroup.campaign.duration_hours} Hours</span>
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="heading-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-terracotta-600" />
                      Applicant Roster ({selectedGroup.applicants.length})
                    </h3>
                  </div>

                  {selectedGroup.applicants.length === 0 ? (
                    <div className="bg-earth-50 p-8 rounded-2xl border border-earth-200 text-center space-y-2">
                      <Users className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">No Student Applicants Yet</p>
                      <p className="text-[11px] text-slate-500">Students browsing the platform can sign up anytime.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedGroup.applicants.map((app) => {
                        const skillsList: string[] = app.student_skills ? JSON.parse(app.student_skills) : [];
                        return (
                          <div key={app.id} className="bg-earth-50 rounded-2xl p-4 border border-earth-200 space-y-3">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={app.student_avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'}
                                  alt={app.student_name}
                                  className="w-10 h-10 rounded-full object-cover border border-terracotta-300"
                                />
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900">{app.student_name}</h4>
                                  <p className="text-[11px] text-terracotta-700 font-semibold flex items-center gap-1">
                                    <GraduationCap className="w-3 h-3" />
                                    <span>{app.student_college || 'RNSIT'}</span>
                                  </p>
                                </div>
                              </div>

                              {/* Interactive Attendance Status Control */}
                              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                                <span className="text-[10px] font-bold text-slate-400 px-2 uppercase">Status:</span>
                                {(['REGISTERED', 'CONFIRMED', 'ATTENDED', 'CANCELLED'] as const).map((st) => (
                                  <button
                                    key={st}
                                    disabled={updatingId === app.id}
                                    onClick={() => handleStatusUpdate(app.id, st)}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                      app.status === st
                                        ? st === 'ATTENDED'
                                          ? 'bg-emerald-600 text-white shadow-sm'
                                          : st === 'CONFIRMED'
                                          ? 'bg-blue-600 text-white shadow-sm'
                                          : st === 'REGISTERED'
                                          ? 'bg-amber-500 text-white shadow-sm'
                                          : 'bg-rose-600 text-white shadow-sm'
                                        : 'text-slate-500 hover:bg-slate-100'
                                    }`}
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Contact Details & Skills */}
                            <div className="pt-2 border-t border-earth-300/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  {app.student_email}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  {app.student_contact || '+91 98450 12345'}
                                </span>
                              </div>

                              {skillsList.length > 0 && (
                                <div className="flex items-center gap-1">
                                  {skillsList.slice(0, 2).map((sk, idx) => (
                                    <span key={idx} className="bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium">
                                      {sk}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchNgoData}
      />
    </div>
  );
}
