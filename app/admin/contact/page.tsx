'use client';

import { useEffect, useState } from 'react';
import { useNotification } from '@/components/Notification';
import SocialIcon from '@/components/SocialIcon';

interface SocialLink {
  platform: string;
  url: string;
  label?: string;
  order: number;
}

interface ContactData {
  phone: string;
  whatsapp: string;
  address: string;
  contactEmail: string;
  socialLinks: SocialLink[];
}

const PLATFORMS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'x', label: 'X.com' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'other', label: 'Other' },
];

const platformLabel = (value: string) => PLATFORMS.find(p => p.value === value)?.label || value;

export default function AdminContactPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ContactData>({
    phone: '',
    whatsapp: '',
    address: '',
    contactEmail: '',
    socialLinks: [],
  });

  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (data.success && data.data) {
        const rawLinks = data.data.socialLinks || [];
        const links: SocialLink[] = Array.isArray(rawLinks)
          ? rawLinks.map((link: SocialLink, idx: number) => ({ ...link, order: link.order ?? idx }))
          : [];
        setFormData({
          phone: data.data.phone || '',
          whatsapp: data.data.whatsapp || '',
          address: data.data.address || '',
          contactEmail: data.data.contactEmail || '',
          socialLinks: links,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const sorted = [...formData.socialLinks].sort((a, b) => a.order - b.order);
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, socialLinks: sorted }),
      });
      const data = await res.json();

      if (data.success) {
        showNotification('Contact info updated successfully!', 'success');
        fetchProfile();
      } else {
        showNotification(data.error || 'Failed to update contact info', 'error');
      }
    } catch (error) {
      showNotification('Failed to update contact info', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof ContactData, value: string | SocialLink[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSocialLink = () => {
    if (!newPlatform || !newUrl) return;
    if (newPlatform === 'other' && !newLabel) return;

    const link: SocialLink = {
      platform: newPlatform,
      url: newUrl,
      label: newPlatform === 'other' ? newLabel : undefined,
      order: formData.socialLinks.length,
    };

    setFormData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, link],
    }));
    setNewPlatform('');
    setNewUrl('');
    setNewLabel('');
  };

  const removeSocialLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index).map((link, i) => ({ ...link, order: i })),
    }));
  };

  const moveSocialLink = (index: number, direction: 'up' | 'down') => {
    const links = [...formData.socialLinks];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= links.length) return;
    [links[index], links[target]] = [links[target], links[index]];
    setFormData((prev) => ({
      ...prev,
      socialLinks: links.map((link, i) => ({ ...link, order: i })),
    }));
  };

  const availablePlatforms = PLATFORMS.filter(
    (p) => p.value === 'other' || !formData.socialLinks.some((l) => l.platform === p.value)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--theme-text)]">Contact Info</h1>
        <p className="text-[var(--theme-text-secondary)] mt-2">
          Manage the contact information and social media links displayed on your website
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-[var(--theme-card)] rounded-xl p-6 border border-[var(--theme-border)]">
            <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-6">Contact Details</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  placeholder="info@sharmcloudtours.com"
                  className="w-full px-4 py-3 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)] text-[var(--theme-text)] placeholder-[var(--theme-text-secondary)] focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-xs text-[var(--theme-text-secondary)] mt-1">
                  Separate from your login email — this is shown publicly
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+20 123 456 789"
                  className="w-full px-4 py-3 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)] text-[var(--theme-text)] placeholder-[var(--theme-text-secondary)] focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-xs text-[var(--theme-text-secondary)] mt-1">
                  This will be displayed in the footer and contact page
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  placeholder="201234567890"
                  className="w-full px-4 py-3 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)] text-[var(--theme-text)] placeholder-[var(--theme-text-secondary)] focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-xs text-[var(--theme-text-secondary)] mt-1">
                  Enter number without + (e.g., 201234567890 for +20 123 456 7890)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--theme-text)] mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Sharm El-Sheikh, Sinai, Egypt"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)] text-[var(--theme-text)] placeholder-[var(--theme-text-secondary)] focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          <div className="bg-[var(--theme-card)] rounded-xl p-6 border border-[var(--theme-border)]">
            <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-6">
              Social Media Links
            </h2>
            <p className="text-sm text-[var(--theme-text-secondary)] mb-4">
              Add links to your social media profiles. These will appear in the &quot;Follow Us&quot; section of the footer and the contact page.
            </p>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--theme-text-secondary)] mb-1">
                    Platform
                  </label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)] text-[var(--theme-text)] focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  >
                    <option value="">Select platform</option>
                    {availablePlatforms.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--theme-text-secondary)] mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://"
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)] text-[var(--theme-text)] placeholder-[var(--theme-text-secondary)] focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>
              </div>

              {newPlatform === 'other' && (
                <div>
                  <label className="block text-xs font-medium text-[var(--theme-text-secondary)] mb-1">
                    Display Label
                  </label>
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="e.g., YouTube, LinkedIn"
                    className="w-full px-3 py-2.5 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)] text-[var(--theme-text)] placeholder-[var(--theme-text-secondary)] focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={addSocialLink}
                disabled={!newPlatform || !newUrl || (newPlatform === 'other' && !newLabel)}
                className="w-full py-2.5 px-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium rounded-lg hover:bg-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                + Add Link
              </button>
            </div>

            {formData.socialLinks.length === 0 ? (
              <p className="text-sm text-[var(--theme-text-secondary)] text-center py-6">
                No social media links added yet.
              </p>
            ) : (
              <div className="space-y-2">
                {formData.socialLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-300 flex-shrink-0">
                      <SocialIcon platform={link.platform} className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--theme-text)] truncate">
                        {link.label || platformLabel(link.platform)}
                      </p>
                      <p className="text-xs text-[var(--theme-text-secondary)] truncate">
                        {link.url}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => moveSocialLink(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded-md text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Move up"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSocialLink(index, 'down')}
                        disabled={index === formData.socialLinks.length - 1}
                        className="p-1.5 rounded-md text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)] hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Move down"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSocialLink(index)}
                        className="p-1.5 rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        aria-label="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-[var(--theme-card)] rounded-xl p-6 border border-[var(--theme-border)]">
          <h2 className="text-xl font-semibold text-[var(--theme-text)] mb-6">Preview</h2>
          <p className="text-[var(--theme-text-secondary)] mb-4">
            How your contact info will appear on the website:
          </p>

          <div className="bg-[var(--theme-bg)] rounded-lg p-6 space-y-4">
            {formData.contactEmail && (
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-[var(--theme-text)]">{formData.contactEmail}</span>
              </div>
            )}

            {formData.phone && (
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-[var(--theme-text)]">{formData.phone}</span>
              </div>
            )}

            {formData.whatsapp && (
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.974 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c 0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <a
                  href={`https://wa.me/${formData.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:underline"
                >
                  Chat on WhatsApp
                </a>
              </div>
            )}

            {formData.address && (
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-[var(--theme-text)]">{formData.address}</span>
              </div>
            )}

            {formData.socialLinks.length > 0 && (
              <div className="pt-4 border-t border-[var(--theme-border)]">
                <p className="text-sm font-medium text-[var(--theme-text)] mb-3">Follow Us</p>
                <div className="flex gap-3">
                  {[...formData.socialLinks]
                    .sort((a, b) => a.order - b.order)
                    .map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-slate-300 hover:bg-amber-500/20 hover:text-amber-400 transition-all"
                        aria-label={link.label || platformLabel(link.platform)}
                      >
                        <SocialIcon platform={link.platform} className="w-4 h-4" />
                      </a>
                    ))}
                </div>
              </div>
            )}

            {!formData.contactEmail && !formData.phone && !formData.whatsapp && !formData.address && formData.socialLinks.length === 0 && (
              <p className="text-[var(--theme-text-secondary)] text-sm">
                No contact info set. Add your details above.
              </p>
            )}
          </div>

          <div className="mt-6 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <p className="text-sm text-amber-400">
              <strong>Tip:</strong> This contact info will be displayed in the website footer and contact page. Make sure to fill in at least one field.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
