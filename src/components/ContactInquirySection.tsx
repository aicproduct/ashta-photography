/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Send, Check, Sparkles, Building2, MapPin } from 'lucide-react';

interface ContactInquirySectionProps {
  initialSubject?: string;
  initialNotes?: string;
}

export const ContactInquirySection: React.FC<ContactInquirySectionProps> = ({
  initialSubject = 'Print Acquisition & Curatorial Inquiry',
  initialNotes = '',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('Print Acquisition');
  const [organization, setOrganization] = useState('');
  const [message, setMessage] = useState(initialNotes);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="inquire" className="py-24 bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Studio Contacts & Curatorial Instructions */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>Studio Gupta Representation</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-light text-neutral-100 tracking-tight">
                Curatorial inquiries &amp; commissions.
              </h2>
            </div>

            <p className="text-sm text-neutral-400 font-light leading-relaxed">
              Ashta Gupta accepts museum exhibition loan requests, heritage conservation commissions, and fine art monograph collaborations worldwide.
            </p>

            <div className="space-y-4 pt-4 border-t border-neutral-800 text-xs font-mono text-neutral-400">
              <div className="space-y-1">
                <div className="text-neutral-500 uppercase tracking-widest text-[11px]">Primary Studio Contact</div>
                <div className="text-neutral-200">studio@ashtagupta-photography.com</div>
              </div>

              <div className="space-y-1">
                <div className="text-neutral-500 uppercase tracking-widest text-[11px]">Gallery Representation (South Asia &amp; Europe)</div>
                <div className="text-neutral-200">Veda Fine Art, New Delhi &amp; Bloomsbury Curatorial, London</div>
              </div>

              <div className="space-y-1">
                <div className="text-neutral-500 uppercase tracking-widest text-[11px]">Print Edition Registrars</div>
                <div className="text-neutral-200">editions@ashtagupta-photography.com</div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7 bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-700/60 flex items-center justify-center mx-auto text-emerald-400">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif text-white">Inquiry Transmitted</h3>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto font-light leading-relaxed">
                  Thank you, <span className="text-neutral-200 font-medium">{name}</span>. Studio Gupta has received your dispatch regarding <span className="text-neutral-200">{inquiryType}</span>. You will receive a response within two business days.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="mt-4 px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-md transition-colors"
                >
                  Submit Another Dispatch
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 border-b border-neutral-800/80 pb-3">
                  Direct Curatorial Dispatch
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Marianne Weber"
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-900/90 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none focus:border-neutral-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="curator@museum.org"
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-900/90 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none focus:border-neutral-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Nature of Inquiry
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-900/90 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none focus:border-neutral-600"
                    >
                      <option value="Print Acquisition">Fine Art Print Edition Acquisition</option>
                      <option value="Gallery Representation">Gallery Representation &amp; Exhibition</option>
                      <option value="Architectural Commission">Architectural Commission</option>
                      <option value="Monograph Rights">Monograph &amp; Editorial Licensing</option>
                      <option value="Curatorial Research">Curatorial / Academic Research</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Institution / Gallery (Optional)
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Basel Architecture Institute"
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-900/90 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none focus:border-neutral-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Inquiry Details &amp; Specific Plates of Interest
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Specify project parameters, desired print dimensions, or exhibition dates..."
                    className="w-full px-3.5 py-2.5 text-xs bg-neutral-900/90 text-neutral-200 border border-neutral-800 rounded-md focus:outline-none focus:border-neutral-600 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-5 bg-neutral-100 hover:bg-white text-neutral-950 font-semibold text-xs uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Inquiry to Studio Gupta</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
