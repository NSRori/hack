import React from 'react';
import Link from 'next/link';
import { Compass, Heart, Users, ShieldCheck, Award, ArrowRight, BookOpen, Utensils, Trees, Smile, Activity, Sparkles, CheckCircle2 } from 'lucide-react';
import { getCampaigns } from '@/lib/db';
import CampaignCard from '@/components/CampaignCard';

export const revalidate = 0; // Dynamic server rendering

export default async function HomePage() {
  const allCampaigns = await getCampaigns();
  const featuredCampaigns = allCampaigns.slice(0, 3);

  const CAUSES = [
    {
      title: 'Hunger & Nutrition',
      category: 'Hunger Relief',
      icon: Utensils,
      color: 'from-amber-500 to-terracotta-600',
      description: 'Sort and dispatch hot nutritious meals to primary schools and emergency relief centers.',
      stat: '15,000+ Meals Mobilized',
    },
    {
      title: 'Digital & Tech Literacy',
      category: 'Education & Tech',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      description: 'Engineering students teach coding, Scratch, and PC skills to government school children.',
      stat: '1,200+ Students Taught',
    },
    {
      title: 'Tree & Lake Afforestation',
      category: 'Environment',
      icon: Trees,
      color: 'from-emerald-500 to-teal-700',
      description: 'Plant native Miyawaki forests and clean urban lake wetlands across Bengaluru.',
      stat: '3,500+ Saplings Planted',
    },
    {
      title: 'Senior Companion & Care',
      category: 'Elderly Care',
      icon: Smile,
      color: 'from-purple-500 to-pink-600',
      description: 'Help senior citizens with smartphone literacy, storytelling, and health checkup logistics.',
      stat: '450+ Seniors Supported',
    },
    {
      title: 'Blood & Health Camps',
      category: 'Blood & Health',
      icon: Activity,
      color: 'from-rose-500 to-red-700',
      description: 'Manage queue logistics, donor registration desks, and health awareness drives.',
      stat: '850+ Donors Assisted',
    },
  ];

  const STORIES = [
    {
      quote: "Volunteering with Akshaya Patra through ImpactSetu gave me a profound perspective outside my engineering classroom. Seeing 5,000 kids get hot meals on a Saturday morning was unforgettable.",
      name: "Arun Kumar",
      college: "RNSIT (R.N.S. Institute of Technology)",
      branch: "Computer Science & Engineering",
      hours: "24 Verified Hours",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
    },
    {
      quote: "Teaching Python basics at Govt High School Jayanagar was the highlight of my semester. The kids were so eager to learn, and the NGO provided all course slides in advance!",
      name: "Ananya Sharma",
      college: "RV College of Engineering (RVCE)",
      branch: "Electronics & Communication",
      hours: "18 Verified Hours",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    },
    {
      quote: "The Miyawaki forest planting drive at Kengeri Lake was flawlessly organized. As engineering students, being able to earn verified certificates while helping the environment is amazing.",
      name: "Vikramaditya Gowda",
      college: "BMS College of Engineering (BMSCE)",
      branch: "Mechanical Engineering",
      hours: "32 Verified Hours",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-earth-100 via-earth-50 to-brand-warm pt-12 pb-20 border-b border-terracotta-100">
        {/* Background Subtle Accent Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-terracotta-200/40 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-earth-300/30 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-terracotta-100 border border-terracotta-200 text-terracotta-800 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
                <span>Verified NGO Volunteering for Engineering Students</span>
              </div>

              <h1 className="heading-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.15] tracking-tight">
                Empowering Students, <br />
                <span className="text-terracotta-600 underline decoration-terracotta-300 decoration-wavy underline-offset-8">
                  Nourishing Communities.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                ImpactSetu directly connects passionate student volunteers from colleges like RNSIT, RVCE & BMSCE with audited NGO campaigns — from Akshaya Patra meal sorting to digital teaching drives.
              </p>

              {/* Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/campaigns"
                  className="w-full sm:w-auto bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-warm-md hover:shadow-warm-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  <Compass className="w-5 h-5" />
                  <span>Explore Campaigns</span>
                </Link>

                <Link
                  href="/dashboard/ngo"
                  className="w-full sm:w-auto bg-white hover:bg-earth-50 text-slate-800 font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl border border-slate-300 shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>Post NGO Campaign</span>
                  <ArrowRight className="w-4 h-4 text-terracotta-600" />
                </Link>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Free for Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Hour Certificates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Real Database Persistence</span>
                </div>
              </div>
            </div>

            {/* Hero Image Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-warm-lg border-4 border-white bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"
                    alt="Volunteers sorting meals for children"
                    className="w-full h-[380px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="bg-terracotta-600 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md mb-2 inline-block">
                      Featured Initiative
                    </span>
                    <h3 className="heading-serif text-xl font-bold leading-tight">
                      Akshaya Patra Weekend Kitchen Drive
                    </h3>
                    <p className="text-xs text-slate-200 mt-1">
                      Over 25 RNSIT student volunteers dispatched 5,000 meals this weekend.
                    </p>
                  </div>
                </div>

                {/* Floating Metric Card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-warm-lg border border-slate-150 flex items-center gap-4 animate-bounce-slow">
                  <div className="w-12 h-12 rounded-xl bg-terracotta-500 flex items-center justify-center text-white font-bold text-xl">
                    <Heart className="w-6 h-6 fill-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900">15,000+</p>
                    <p className="text-xs text-slate-500 font-semibold">Meals Served to Children</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-warm-lg grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div className="pt-4 md:pt-0">
            <p className="heading-serif text-3xl sm:text-4xl font-extrabold text-terracotta-400">1,200+</p>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Student Volunteers Registered</p>
          </div>
          <div className="pt-4 md:pt-0">
            <p className="heading-serif text-3xl sm:text-4xl font-extrabold text-terracotta-400">45+</p>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Audited NGO Partners</p>
          </div>
          <div className="pt-4 md:pt-0">
            <p className="heading-serif text-3xl sm:text-4xl font-extrabold text-terracotta-400">8,500+</p>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Volunteering Hours Logged</p>
          </div>
          <div className="pt-4 md:pt-0">
            <p className="heading-serif text-3xl sm:text-4xl font-extrabold text-terracotta-400">100%</p>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Real Database Persistence</p>
          </div>
        </div>
      </section>

      {/* Causes We Support */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600 bg-terracotta-50 px-3 py-1 rounded-full border border-terracotta-200">
            Impact Areas
          </span>
          <h2 className="heading-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-3">
            Causes We Support Across Bengaluru
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Explore verified campaigns categorized by real community needs on the ground.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CAUSES.map((cause, idx) => {
            const IconComp = cause.icon;
            return (
              <Link
                key={idx}
                href={`/campaigns?cause=${encodeURIComponent(cause.category)}`}
                className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-warm-sm hover:shadow-warm-md transition-all hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cause.color} flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="heading-serif font-bold text-slate-900 text-base mb-1 group-hover:text-terracotta-600 transition-colors">
                    {cause.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {cause.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-terracotta-700">
                  <span>{cause.stat}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Active Campaigns */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600 bg-terracotta-50 px-3 py-1 rounded-full border border-terracotta-200">
              Live Opportunities
            </span>
            <h2 className="heading-serif text-3xl font-bold text-slate-900 mt-2">
              Featured Upcoming NGO Campaigns
            </h2>
          </div>
          <Link
            href="/campaigns"
            className="text-xs font-bold text-terracotta-700 hover:text-terracotta-800 flex items-center gap-1 bg-terracotta-50 px-4 py-2 rounded-xl border border-terracotta-200 hover:bg-terracotta-100 transition-colors"
          >
            <span>View All Campaigns</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCampaigns.map((cmp) => (
            <CampaignCard key={cmp.id} campaign={cmp} />
          ))}
        </div>
      </section>

      {/* How Volunteering Works */}
      <section id="how-it-works" className="bg-earth-100 py-16 border-y border-earth-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600 bg-white px-3 py-1 rounded-full border border-earth-300">
              Simple 4-Step Process
            </span>
            <h2 className="heading-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-3">
              How Volunteering Works on ImpactSetu
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Designed specifically for engineering students looking for meaningful weekend social work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-earth-200 shadow-warm-sm relative">
              <div className="w-8 h-8 rounded-full bg-terracotta-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="heading-serif font-bold text-slate-900 text-base mb-2">Explore Campaigns</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter initiatives by Cause (Hunger, Tech Teaching, Environment), Location (RR Nagar, Jayanagar), or Date.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-earth-200 shadow-warm-sm relative">
              <div className="w-8 h-8 rounded-full bg-terracotta-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="heading-serif font-bold text-slate-900 text-base mb-2">1-Click Registration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click "Volunteer" with your college profile (e.g. RNSIT). Your registration instantly writes to our SQLite database.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-earth-200 shadow-warm-sm relative">
              <div className="w-8 h-8 rounded-full bg-terracotta-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="heading-serif font-bold text-slate-900 text-base mb-2">Volunteer On-Ground</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Show up at the campaign venue, collaborate with fellow students & NGO leaders to make an impactful difference.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-earth-200 shadow-warm-sm relative">
              <div className="w-8 h-8 rounded-full bg-terracotta-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                4
              </div>
              <h3 className="heading-serif font-bold text-slate-900 text-base mb-2">Verified Certificates</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                After the NGO marks your attendance, log into your Student Dashboard to view and print your verified impact certificate!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Impact Stories */}
      <section id="impact-stories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-terracotta-600 bg-terracotta-50 px-3 py-1 rounded-full border border-terracotta-200">
            Real Student Voices
          </span>
          <h2 className="heading-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-3">
            Volunteer Impact Stories
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Hear from engineering students across Bengaluru who are actively volunteering through ImpactSetu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STORIES.map((story, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-warm-sm flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-6">
                "{story.quote}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-10 h-10 rounded-full object-cover border border-terracotta-300"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{story.name}</h4>
                  <p className="text-[11px] text-terracotta-700 font-semibold">{story.college}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{story.branch} • {story.hours}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-terracotta-700 via-terracotta-600 to-earth-800 rounded-3xl p-8 sm:p-12 text-white shadow-warm-lg text-center space-y-6">
          <h2 className="heading-serif text-3xl sm:text-4xl font-bold max-w-2xl mx-auto leading-tight">
            Ready to Make a Real Impact This Weekend?
          </h2>
          <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto">
            Join hundreds of engineering students from RNSIT, RVCE & BMSCE volunteering with top verified NGOs.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/campaigns"
              className="bg-white text-terracotta-800 hover:bg-earth-100 font-bold text-sm px-8 py-3.5 rounded-xl shadow-md transition-all hover:scale-105"
            >
              Browse All Campaigns Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
