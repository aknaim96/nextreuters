import { createClient } from '@/utils/supabase/server'
import { InquiryForm } from '@/components/InquiryForm'
import { FAQAccordion } from '@/components/FAQAccordion'
import { MessageCircleQuestion } from 'lucide-react'

export const metadata = {
  title: 'Contact & FAQs | Khan Chronicle',
}

const FAQ_ITEMS = [
  {
    question: 'What is Khan Chronicle?',
    answer:
      'Khan Chronicle is an independent financial news publication covering markets, opinion, book club picks, and long-form projects, published on a subscription and donation-supported model.',
  },
  {
    question: 'How do subscription tiers work?',
    answer:
      'Silver ($1/mo) and Gold ($2/mo) unlock premium articles gated to each tier. You can switch tiers at any time from your profile page or the Pricing page.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes. You can change or cancel your tier at any time from your account dashboard — there is no lock-in period.',
  },
  {
    question: 'Are donations or subscription payments tax-deductible?',
    answer:
      'No. ChronicleKhan.ca is a commercial business entity in Ontario, Canada, and is not a registered charity or non-profit, so payments are not tax-deductible and no charitable tax receipts are issued.',
  },
  {
    question: 'Is my payment information secure?',
    answer:
      "We don't store your card details on our servers. Payments are intended to be processed by a third-party payment processor (Stripe) rather than handled directly by Khan Chronicle.",
  },
  {
    question: 'How do I become a contributor?',
    answer:
      'Reach out using the contact form below. Authors submit drafts for editorial review, and an editor or admin publishes approved articles.',
  },
  {
    question: 'I found an error in an article — how do I report it?',
    answer: 'Use the contact form below with a link to the article and a description of the issue, and our editorial team will review it.',
  },
]

export default async function ContactPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userName: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()
    userName = profile?.full_name ?? null
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 w-full space-y-8">
      <div className="text-center border-b-2 border-black pb-6">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-200">
          <MessageCircleQuestion className="w-5 h-5" />
        </span>
        <span className="block text-xs font-mono uppercase tracking-widest text-red-600 font-bold mt-3">Support</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight">Contact & FAQs</h1>
        <p className="font-serif text-zinc-600 mt-2 max-w-lg mx-auto">
          Answers to common questions, and a direct line to our editorial team for anything else.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-zinc-900">Frequently Asked Questions</h2>
        <FAQAccordion items={FAQ_ITEMS} />
      </div>

      <div className="bg-zinc-50 border border-zinc-300 p-5 sm:p-8 space-y-4 shadow-sm">
        <div className="border-b border-zinc-200 pb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 font-bold block">Secure Channel</span>
          <h2 className="font-serif font-bold text-lg">Direct Inquiry</h2>
        </div>
        <p className="text-xs font-serif text-zinc-600">
          Still have a question, tip, or press inquiry? Send it directly to our newsroom desk.
        </p>
        <InquiryForm userEmail={user?.email ?? null} userName={userName} />
      </div>
    </div>
  )
}