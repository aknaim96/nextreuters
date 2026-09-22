import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | Khan Chronicle',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 w-full">
      <Link href="/" className="inline-flex items-center text-xs font-mono text-zinc-500 hover:text-red-600 mb-8 transition-colors">
        <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Return to Wire Index
      </Link>

      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-8">
        <div className="border-b-2 border-black pb-4 mb-6">
          <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 font-bold">Legal</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight">Privacy Policy</h1>
          <p className="text-xs font-mono text-zinc-500 mt-2">Last updated: September 2026</p>
        </div>

        <div className="prose prose-sm max-w-none font-serif text-zinc-800 space-y-6">
          <p>
            ChronicleKhan.ca ("we," "us," or "our") is committed to protecting your personal
            information in accordance with Canada's federal privacy law, the Personal Information
            Protection and Electronic Documents Act ("PIPEDA"). This Privacy Policy explains what
            information we collect, how we use it, and your rights regarding that information.
          </p>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-black">1. Information We Collect</h2>
            <p>When you create an account or use the Site, we may collect:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Contact information you provide, such as your name, email address, phone number, and country or state/province.</li>
              <li>Account and subscription details, including your subscription tier and role.</li>
              <li>Transaction history related to subscriptions or voluntary contributions.</li>
              <li>Basic usage information necessary to operate and secure the Site.</li>
            </ul>
          </section>

          <section className="space-y-2 border-t border-zinc-200 pt-6">
            <h2 className="font-serif text-xl font-bold text-black">2. Payment Processing</h2>
            <p>
              We do not store or directly process your credit card or financial details on our
              servers. All payments are securely handled by our third-party payment processor,
              Stripe. Stripe's use of your personal information is governed by their own Privacy
              Policy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-black">3. Why We Collect It</h2>
            <p>
              When you subscribe or support us financially, we collect your email address and
              transaction history to manage your account, prevent fraudulent transactions, and comply
              with Canadian tax record-keeping requirements. We do not sell, rent, or trade your
              personal information to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-black">4. Third-Party Services</h2>
            <p>
              We rely on trusted third-party providers to operate the Site, including Supabase for
              authentication and database hosting, and Stripe for payment processing. These providers
              only receive the information necessary to perform their function.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-black">5. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account remains active or as
              needed to comply with legal, tax, and accounting obligations.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-black">6. Your Rights</h2>
            <p>
              Under PIPEDA, you have the right to access, correct, or request deletion of your
              personal information. You can update most account details directly from your profile
              page, or contact us via the Direct Inquiry form for further requests.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-black">7. Security</h2>
            <p>
              We use industry-standard measures to protect your personal information, including
              encrypted authentication and secure third-party infrastructure. No method of
              transmission or storage is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-black">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Continued use of the Site after
              changes are posted constitutes acceptance of the revised policy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-bold text-black">9. Contact</h2>
            <p>
              Questions about this Privacy Policy or requests regarding your personal information can
              be sent via the Direct Inquiry form in the site footer.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}