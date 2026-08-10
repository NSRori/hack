'use client';

import React from 'react';
import { X, Award, CheckCircle2, Printer, ShieldCheck, Heart } from 'lucide-react';
import { Registration } from '@/lib/db';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: Registration | null;
}

export default function CertificateModal({ isOpen, onClose, registration }: CertificateModalProps) {
  if (!isOpen || !registration) return null;

  const certId = `CERT-IS-${registration.id.toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-warm-lg border border-terracotta-200 overflow-hidden animate-fade-in my-8">
        {/* Header bar */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-terracotta-400">
            <Award className="w-4 h-4" />
            <span>Official Volunteering Certificate Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-terracotta-600 hover:bg-terracotta-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div className="p-8 sm:p-12 bg-[#FFFDF9] border-[12px] border-double border-terracotta-800/30 m-4 rounded-xl text-center space-y-6 relative overflow-hidden">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-terracotta-600" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-terracotta-600" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-terracotta-600" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-terracotta-600" />

          {/* Watermark Seal */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Heart className="w-72 h-72 text-terracotta-700" />
          </div>

          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-terracotta-600 flex items-center justify-center text-white shadow-warm-sm">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <span className="heading-serif text-2xl font-bold text-slate-900 tracking-tight">
              Impact<span className="text-terracotta-600">Setu</span>
            </span>
          </div>

          <h2 className="heading-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-wide uppercase">
            Certificate of Social Impact
          </h2>

          <p className="text-xs uppercase tracking-widest text-terracotta-700 font-bold">
            PROUDLY PRESENTED TO
          </p>

          <div className="py-2 border-b-2 border-terracotta-500 max-w-md mx-auto">
            <h3 className="heading-serif text-2xl sm:text-3xl font-bold text-slate-900">
              {registration.student_name}
            </h3>
            <p className="text-xs text-slate-600 font-semibold mt-1">
              {registration.student_college}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
            In recognition of outstanding community service and dedicated volunteer effort contributed towards the NGO campaign{' '}
            <strong className="text-terracotta-800 font-bold">"{registration.campaign_title}"</strong> organized by{' '}
            <strong className="text-slate-900">{registration.campaign_ngo_name}</strong>.
          </p>

          {/* Stats Box */}
          <div className="inline-flex items-center gap-8 bg-earth-50 border border-earth-200 px-6 py-3 rounded-2xl mx-auto">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Hours Contributed</p>
              <p className="text-lg font-bold text-terracotta-700">{registration.campaign_duration || 4} Verified Hours</p>
            </div>
            <div className="h-8 w-px bg-slate-300" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Date Completed</p>
              <p className="text-sm font-bold text-slate-800">{registration.campaign_date}</p>
            </div>
          </div>

          {/* Signatures & Verification */}
          <div className="pt-8 grid grid-cols-2 gap-8 max-w-lg mx-auto text-center border-t border-slate-200/80">
            <div>
              <div className="h-10 flex items-center justify-center">
                <span className="heading-serif font-bold text-terracotta-700 text-lg italic">
                  Akshaya Patra / NGO Board
                </span>
              </div>
              <p className="text-xs font-bold text-slate-800 border-t border-slate-400 pt-1">
                Authorized NGO Signatory
              </p>
            </div>

            <div>
              <div className="h-10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-xs font-bold text-slate-800 border-t border-slate-400 pt-1">
                ImpactSetu Verification Team
              </p>
              <p className="text-[9px] text-slate-400 font-mono mt-0.5">{certId}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
