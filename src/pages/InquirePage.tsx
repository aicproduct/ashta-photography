/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ContactInquirySection } from '../components/ContactInquirySection';
import { Mail, Clock, ShieldCheck, MapPin } from 'lucide-react';

interface InquirePageProps {
  initialNotes?: string;
}

export const InquirePage: React.FC<InquirePageProps> = ({ initialNotes = '' }) => {
  return (
    <div className="py-12 sm:py-16 bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Page Header */}
        <div className="border-b border-neutral-800 pb-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
            <Mail className="w-3.5 h-3.5 text-neutral-400" />
            <span>Studio Gupta Liaison</span>
            <span aria-hidden="true">·</span>
            <span>Commissions &amp; Acquisitions</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-neutral-100 tracking-tight">
            Curatorial Inquiries &amp; Dispatches
          </h1>

          <p className="text-sm text-neutral-400 max-w-2xl font-light leading-relaxed">
            Direct communication portal for institutional curators, private collectors, architectural practices, and monograph publishers. Inquiries are reviewed directly by Ashta Gupta’s studio team.
          </p>
        </div>

        {/* Inquiry form section */}
        <ContactInquirySection initialNotes={initialNotes} />

        {/* Studio Guidelines Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-neutral-800">
          <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-neutral-300 font-serif text-base">
              <Clock className="w-4 h-4 text-neutral-400" />
              <span>Response Timeline</span>
            </div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Curatorial loan requests and print acquisition dispatches receive detailed formal replies with condition reports within two business days.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-neutral-300 font-serif text-base">
              <ShieldCheck className="w-4 h-4 text-neutral-400" />
              <span>Certificate Registry</span>
            </div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Every acquired edition is recorded in the Studio Gupta Archive Registry with an embossed seal, provenance deed, and owner record.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-neutral-300 font-serif text-base">
              <MapPin className="w-4 h-4 text-neutral-400" />
              <span>Studio Viewings</span>
            </div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Private print viewings at Hauz Khas Village (Delhi) or Bloomsbury (London) are available strictly by advance curatorial appointment.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
