import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | Chronicle Khan',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 w-full">
      <Link href="/" className="inline-flex items-center text-xs font-mono text-zinc-500 hover:text-red-600 mb-8 transition-colors">
        <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Return to Wire Index
      </Link>

      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-8">
        <div className="border-b-2 border-black pb-4 mb-6">
          <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 font-bold">Legal</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight">Terms of Service</h1>
          <p className="text-xs font-mono text-zinc-500 mt-2">Last updated: September 2026</p>
        </div>

        <div className="prose prose-sm max-w-none font-serif text-zinc-800 space-y-6">
          <p>
            These Terms of Service ("Terms") govern your access to and use of ChronicleKhan.ca
            (operating publicly as "Chronicle Khan," the "Site," "we," "us," or "our"). By creating
            an account, subscribing to a paid tier, or making a voluntary contribution through the
            Site, you agree to be bound by these Terms. If you do not agree, please do not use the
            Site.
          </p>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-black">1. Accounts</h2>
            <p>
              You must provide accurate information when creating an account and are responsible for
              maintaining the confidentiality of your login credentials. You are responsible for all
              activity that occurs under your account.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-black">2. Content & Intellectual Property</h2>
            <p>
              All articles, graphics, and editorial content published on the Site are the property of
              ChronicleKhan.ca or its contributing authors and are protected by copyright. You may not
              republish, redistribute, or commercially reproduce content from the Site without prior
              written permission.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-black">3. Subscription Tiers</h2>
            <p>
              Paid subscription tiers (Silver, Gold) grant access to designated premium content for as
              long as the subscription remains active. Subscriptions are billed on a recurring monthly
              basis and may be cancelled at any time through your account dashboard; cancellation takes
              effect at the end of the current billing period.
            </p>
          </section>

          <section className="space-y-2 border-t border-zinc-200 pt-6">
            <h2 className="font-serif text-xl font-bold text-black">4. Digital Tip Jar & Voluntary Support</h2>
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <span className="font-bold">Nature of Payments.</span> Financial contributions made via
                our "Tip Jar" or "Support" links are entirely voluntary. These payments are processed
                as commercial revenue to support independent journalism and do not grant the user any
                ownership, voting rights, editorial control, or special privileges regarding the
                content published on ChronicleKhan.ca.
              </li>
              <li>
                <span className="font-bold">No Tax Deduction.</span> ChronicleKhan.ca is operated as a
                for-profit commercial entity in Ontario, Canada, and is not a registered charity or
                non-profit. Payments are not tax-deductible and no charitable tax receipts will be
                issued.
              </li>
              <li>
                <span className="font-bold">Refund Policy.</span> All one-time tips and recurring
                support payments are final and non-refundable. If you wish to cancel a recurring
                monthly support plan, you must do so prior to your next billing cycle via your user
                account or by contacting us. Past charges will not be prorated or refunded.
              </li>
              <li>
                <span className="font-bold">No Service Guarantees.</span> Your contribution is a
                support payment for existing and ongoing operations. It does not guarantee that the
                website will remain active, ad-free, or uninterrupted.
              </li>
            </ol>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-black">5. Prohibited Conduct</h2>
            <p>
              You agree not to misuse the Site, including attempting to access restricted content
              without authorization, interfering with the Site's operation, or using the Site for any
              unlawful purpose.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-black">6. Disclaimers & Limitation of Liability</h2>
            <p>
              The Site and its content are provided "as is" without warranties of any kind. To the
              fullest extent permitted by law, ChronicleKhan.ca is not liable for any indirect,
              incidental, or consequential damages arising from your use of the Site.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-black">7. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the Province of Ontario and the federal laws of
              Canada applicable therein, without regard to conflict-of-law principles.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-black">8. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the Site after changes are
              posted constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-black">9. Contact</h2>
            <p>
              Questions about these Terms can be sent via the Direct Inquiry form in the site footer.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}