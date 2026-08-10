import React from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, Award, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-terracotta-900/30">
      {/* Top Value Banner */}
      <div className="border-b border-slate-800 bg-slate-850 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-terracotta-500/10 border border-terracotta-500/20 flex items-center justify-center text-terracotta-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">100% Verified NGOs</h4>
              <p className="text-xs text-slate-400">Every campaign is audited for real community impact.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-terracotta-500/10 border border-terracotta-500/20 flex items-center justify-center text-terracotta-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Verified Volunteer Certificates</h4>
              <p className="text-xs text-slate-400">Earn official certificates for your college portfolio.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-terracotta-500/10 border border-terracotta-500/20 flex items-center justify-center text-terracotta-400">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Direct Community Connection</h4>
              <p className="text-xs text-slate-400">Zero middleman fees, direct impact on the ground.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-terracotta-600 flex items-center justify-center text-white">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <span className="heading-serif text-xl font-bold text-white tracking-tight">
              Impact<span className="text-terracotta-400">Setu</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bridging the energy of student volunteers with verified NGO initiatives across Bengaluru to create lasting social impact.
          </p>
          <div className="pt-2 text-xs text-slate-400 space-y-1">
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-terracotta-400" />
              <span>Bengaluru Innovation Hub, RR Nagar, KA</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-terracotta-400" />
              <span>contact@impactsetu.org</span>
            </p>
          </div>
        </div>

        <div>
          <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-terracotta-500/30 pb-1 inline-block">
            Popular Causes
          </h5>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link href="/campaigns?cause=Hunger+Relief" className="hover:text-terracotta-400 transition-colors">Hunger & Meal Distribution</Link></li>
            <li><Link href="/campaigns?cause=Education+%26+Tech" className="hover:text-terracotta-400 transition-colors">Digital Literacy for Kids</Link></li>
            <li><Link href="/campaigns?cause=Environment" className="hover:text-terracotta-400 transition-colors">Lake & Plantation Drives</Link></li>
            <li><Link href="/campaigns?cause=Elderly+Care" className="hover:text-terracotta-400 transition-colors">Senior Care & Assistance</Link></li>
            <li><Link href="/campaigns?cause=Blood+%26+Health" className="hover:text-terracotta-400 transition-colors">Blood Donation Camps</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-terracotta-500/30 pb-1 inline-block">
            Partner Engineering Colleges
          </h5>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><span className="font-semibold text-slate-200">RNSIT</span> (R.N.S. Institute of Technology)</li>
            <li><span className="font-semibold text-slate-200">RVCE</span> (RV College of Engineering)</li>
            <li><span className="font-semibold text-slate-200">BMSCE</span> (BMS College of Engineering)</li>
            <li><span className="font-semibold text-slate-200">PES University</span></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-terracotta-500/30 pb-1 inline-block">
            For NGOs & Institutions
          </h5>
          <p className="text-xs text-slate-400 mb-3">
            Are you an NGO looking for energetic student volunteers for your next campaign?
          </p>
          <Link
            href="/dashboard/ngo"
            className="inline-block bg-terracotta-600 hover:bg-terracotta-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Post a Campaign Now →
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>© 2026 ImpactSetu Foundation. Designed with warmth for social impact.</p>
      </div>
    </footer>
  );
}
