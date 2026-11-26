import PricingList from "./PricingList";
import { useLanguage } from "../../../contexts/LanguageContext";

const Pricing = () => {
  const { pick } = useLanguage();

  return (
    <section
      id="pricing"
      className="py-20 sm:py-28 border-b border-red-950/60 bg-gradient-to-b from-[#0a0607] via-[#12080a] to-[#0a0607]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-3">
            {pick("Simple & Transparent Pricing", "সহজ ও স্বচ্ছ মূল্য তালিকা")}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {pick("One simple plan, peace of mind all month", "পেমেন্ট একবার, নিশ্চিন্ত সারা মাস")}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400">
            {pick(
              "Start free for a full year with zero hidden fees. Upgrade whenever your store grows.",
              "কোনো গোপন চার্জ ছাড়াই পুরো ১ বছর ফ্রি ব্যবহার করুন। ব্যবসা বড় হলে সহজে আপগ্রেড করুন।"
            )}
          </p>
        </div>

        <PricingList />
      </div>
    </section>
  );
};

export default Pricing;
