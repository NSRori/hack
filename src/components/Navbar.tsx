'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Heart, Compass, LayoutDashboard, UserCheck, Building2, GraduationCap, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, switchUser, demoUsers } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-terracotta-100 shadow-warm-sm transition-all">
      {/* Top Banner: Quick Role Switcher for instant evaluator testing */}
      <div className="bg-gradient-to-r from-terracotta-700 via-terracotta-600 to-earth-700 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] tracking-wide uppercase font-bold">
              Demo Switcher
            </span>
            <span>Current Role: <strong>{currentUser.role === 'STUDENT' ? `Student (${currentUser.name} - ${currentUser.college_name?.split(' ')[0]})` : `NGO (${currentUser.name})`}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white/80 text-[11px] hidden md:inline">Switch Active Account:</span>
            <div className="flex items-center gap-1.5 bg-black/20 p-0.5 rounded-lg border border-white/20">
              {demoUsers.map((user) => {
                const isActive = user.id === currentUser.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => switchUser(user.id)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
                      isActive
                        ? 'bg-white text-terracotta-700 shadow-sm font-semibold'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    {user.role === 'STUDENT' ? <GraduationCap className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                    <span>{user.name.split(' ')[0]} ({user.role})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta-500 to-terracotta-700 flex items-center justify-center text-white shadow-warm-sm group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="heading-serif text-2xl font-bold text-slate-900 tracking-tight block leading-tight">
                Impact<span className="text-terracotta-600">Setu</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest block -mt-1">
                NGO Volunteer Platform
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-terracotta-600 ${
                pathname === '/' ? 'text-terracotta-600 font-semibold' : 'text-slate-700'
              }`}
            >
              Home
            </Link>
            <Link
              href="/campaigns"
              className={`text-sm font-medium transition-colors hover:text-terracotta-600 flex items-center gap-1.5 ${
                pathname.startsWith('/campaigns') ? 'text-terracotta-600 font-semibold' : 'text-slate-700'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore Campaigns
            </Link>
            <a
              href="/#how-it-works"
              className="text-sm font-medium text-slate-700 hover:text-terracotta-600 transition-colors"
            >
              How It Works
            </a>
            <a
              href="/#impact-stories"
              className="text-sm font-medium text-slate-700 hover:text-terracotta-600 transition-colors"
            >
              Impact Stories
            </a>
          </nav>

          {/* User Account / Dashboard Quick Link */}
          <div className="flex items-center gap-4">
            <Link
              href={currentUser.role === 'STUDENT' ? '/dashboard/student' : '/dashboard/ngo'}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-warm-sm flex items-center gap-2 transition-all hover:shadow-warm-md hover:-translate-y-0.5"
            >
              <LayoutDashboard className="w-4 h-4 text-terracotta-400" />
              <span>
                {currentUser.role === 'STUDENT' ? 'Student Dashboard' : 'NGO Admin Dashboard'}
              </span>
            </Link>

            {/* Profile Avatar Indicator */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-terracotta-200 hover:border-terracotta-400 transition-colors bg-earth-50"
              >
                <img
                  src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-600 mr-1" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-warm-lg border border-slate-100 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-500 font-medium">Logged in as</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-xs text-terracotta-600 font-semibold">{currentUser.role === 'STUDENT' ? currentUser.college_name : 'Verified NGO Partner'}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href={currentUser.role === 'STUDENT' ? '/dashboard/student' : '/dashboard/ngo'}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-earth-50 font-medium flex items-center gap-2"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-terracotta-600" />
                      View Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
