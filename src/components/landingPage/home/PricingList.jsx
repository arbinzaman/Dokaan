import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const PLANS = [
  {
    id: "trial",
    title: "Starter Trial",
    bnTitle: "ফ্রি ট্রায়াল",
    description: "১ বছরের জন্য সম্পূর্ণ ফ্রি অ্যাক্সেস ও প্রশিক্ষণ।",
    price: "0",
    period: "/ first year",
    popular: false,
    cta: "Start Free Trial",
    features: [
      "১ বছরের জন্য সম্পূর্ণ অ্যাক্সেস বিনামূল্যে",
      "কোনো আলাদা সফটওয়্যার ইনস্টলেশন নয়",
      "ফ্রি অনবোর্ডিং প্রশিক্ষণ অন্তর্ভুক্ত",
      "POS রিসিপ্ট ও A4 ইনভয়েস প্রিন্টিং",
    ],
  },
  {
    id: "monthly",
    title: "Monthly Pro",
    bnTitle: "মাসিক সাবস্ক্রিপশন",
    description: "মাসিক সাপোর্টসহ দোকানের সব আধুনিক সুবিধা।",
    price: "99",
    period: "/ month",
    popular: true,
    cta: "Get Started",
    features: [
      "সব বৈশিষ্ট্যসহ আনলিমিটেড অ্যাক্সেস",
      "মাল্টি-শপ ও কর্মচারী রোল ম্যানেজমেন্ট",
      "লাইভ আয়-ব্যয় ও প্রফিট অ্যানালিটিক্স",
      "২৪/৭ কাস্টমার সাপোর্ট ও ব্যাকআপ",
    ],
  },
  {
    id: "annual",
    title: "Annual Business",
    bnTitle: "বার্ষিক সাবস্ক্রিপশন",
    description: "বার্ষিক প্ল্যানে ১৬% সাশ্রয় ও প্রায়োরিটি সেবা।",
    price: "1,000",
    period: "/ year",
    popular: false,
    badge: "Save 16%",
    cta: "Choose Annual",
    features: [
      "১ বছরের সম্পূর্ণ প্রো অ্যাক্সেস",
      "আনলিমিটেড প্রোডাক্ট, সেলস ও ইনভয়েস",
      "ফ্রি টিম ট্রেনিং ও ডেটা মাইগ্রেশন",
      "২৪/৭ প্রায়োরিটি কাস্টমার সাপোর্ট",
    ],
  },
];

const PricingList = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
      {PLANS.map((plan) => (
        <div
          key={plan.id}
          className={`relative rounded-3xl p-7 flex flex-col border transition-all ${
            plan.popular
              ? "border-indigo-500/80 bg-zinc-900 shadow-2xl shadow-indigo-950/30"
              : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
          }`}
        >
          {plan.popular && (
            <span className="absolute -top-3 left-7 px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-semibold uppercase tracking-wider">
              Most Popular
            </span>
          )}
          {plan.badge && !plan.popular && (
            <span className="absolute top-6 right-6 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold">
              {plan.badge}
            </span>
          )}

          <div>
            <h3 className="text-lg font-semibold text-white">{plan.title}</h3>
            <p className="text-xs text-zinc-400 mt-0.5">{plan.bnTitle}</p>
            <p className="mt-3 text-sm text-zinc-400 min-h-[2.5rem]">
              {plan.description}
            </p>
          </div>

          <div className="my-6 flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-zinc-300">৳</span>
            <span className="text-4xl font-bold tracking-tight text-white tabular-nums">
              {plan.price}
            </span>
            <span className="text-sm text-zinc-400 ml-1">{plan.period}</span>
          </div>

          <Link
            to="/signup"
            className={`w-full text-center py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors mb-6 ${
              plan.popular
                ? "bg-white text-zinc-950 hover:bg-zinc-200"
                : "bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
          >
            {plan.cta}
          </Link>

          <ul className="space-y-3 pt-5 border-t border-zinc-800 flex-grow">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 text-sm text-zinc-300"
              >
                <Check
                  size={16}
                  className="text-emerald-400 flex-shrink-0 mt-0.5"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PricingList;
