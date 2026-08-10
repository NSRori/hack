'use client';

import React, { useState } from 'react';
import { X, Plus, Image as ImageIcon, MapPin, Calendar, Clock, Users, FileText, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PRESET_IMAGES = [
  { label: 'Food & Meals Kitchen', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Teaching & Classroom Kids', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Tree Plantation & Nature', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Clothing & Relief Packets', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Elderly Care Companion', url: 'https://images.unsplash.com/photo-1581579438747-1dc8d1e292c7?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Medical & Blood Donation', url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80' },
];

export default function CreateCampaignModal({ isOpen, onClose, onSuccess }: CreateCampaignModalProps) {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [causeCategory, setCauseCategory] = useState('Hunger Relief');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [durationHours, setDurationHours] = useState('4');
  const [requiredVolunteers, setRequiredVolunteers] = useState('20');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [description, setDescription] = useState('');
  const [requirementText, setRequirementText] = useState('Comfortable clothing, Water bottle, Student ID');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !date || !description) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const reqList = requirementText.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ngo_id: currentUser.id,
          ngo_name: currentUser.name,
          title,
          cause_category: causeCategory,
          location,
          date,
          duration_hours: Number(durationHours),
          required_volunteers: Number(requiredVolunteers),
          image_url: imageUrl,
          description,
          requirements: reqList,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.error || 'Failed to create campaign');
      }
    } catch (err: any) {
      setError(err.message || 'Server error creating campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-warm-lg border border-slate-150 overflow-hidden animate-fade-in my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-terracotta-700 to-terracotta-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <h3 className="heading-serif text-xl font-bold">Publish New Volunteering Campaign</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Campaign Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekend Food Relief Drive for Primary School Kids"
              className="w-full px-3.5 py-2.5 bg-earth-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Cause Category *
              </label>
              <select
                value={causeCategory}
                onChange={(e) => setCauseCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-earth-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              >
                <option value="Hunger Relief">Hunger Relief</option>
                <option value="Education & Tech">Education & Tech</option>
                <option value="Environment">Environment</option>
                <option value="Elderly Care">Elderly Care</option>
                <option value="Blood & Health">Blood & Health</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location (Bengaluru Venue) *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. RR Nagar Kitchen Centre, Bengaluru"
                className="w-full px-3.5 py-2.5 bg-earth-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Campaign Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-earth-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Duration (Hours) *
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                className="w-full px-3 py-2.5 bg-earth-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Volunteers Needed *
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={requiredVolunteers}
                onChange={(e) => setRequiredVolunteers(e.target.value)}
                className="w-full px-3 py-2.5 bg-earth-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                required
              />
            </div>
          </div>

          {/* Preset Image Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Campaign Cover Image
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {PRESET_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(img.url)}
                  className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    imageUrl === img.url ? 'border-terracotta-600 ring-2 ring-terracotta-400 scale-95' : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white font-medium p-0.5 truncate text-center">
                    {img.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Detailed Campaign Description *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the campaign objectives, what volunteers will do, schedule details, and the community impact..."
              className="w-full p-3 bg-earth-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Volunteer Prerequisites (comma separated)
            </label>
            <input
              type="text"
              value={requirementText}
              onChange={(e) => setRequirementText(e.target.value)}
              placeholder="e.g. Comfortable footwear, Water bottle, Basic coding skills"
              className="w-full px-3.5 py-2.5 bg-earth-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-bold text-white bg-terracotta-600 hover:bg-terracotta-700 rounded-xl shadow-warm-sm transition-all hover:shadow-warm-md"
            >
              {loading ? 'Publishing to Database...' : 'Publish Campaign Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
