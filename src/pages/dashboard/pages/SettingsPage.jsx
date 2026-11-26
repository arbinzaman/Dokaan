import ConnectedAccounts from "../../../components/dashBoard/home/settings/ConnectedAccounts";
import DangerZone from "../../../components/dashBoard/home/settings/DangerZone";
import LogoutZone from "../../../components/dashBoard/home/settings/LogoutZone";
import Notifications from "../../../components/dashBoard/home/settings/Notifications";
import Profile from "../../../components/dashBoard/home/settings/Profile";
import Security from "../../../components/dashBoard/home/settings/Security";
import DokaanProfile from "../../../components/dashBoard/home/settings/DokaanProfile";
import ThemeControlButton from "../../../components/dashBoard/home/settings/ThemeControlButton";
import InvoiceTypeSelector from "../../../components/dashBoard/home/settings/InvoiceTypeSelector";
import { useLanguage } from "../../../contexts/LanguageContext";

const SettingsPage = () => {
  const { pick } = useLanguage();

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-4xl mx-auto py-2 sm:py-6 px-1 sm:px-4 lg:px-8">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {pick("Settings & Preferences", "সেটিংস ও পছন্দসমূহ")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            {pick(
              "Customize language (English / বাংলা), Black Mode colors, shop profile, and security.",
              "ভাষা (ইংরেজি / বাংলা), ব্ল্যাক মোড কালার, দোকান প্রোফাইল ও নিরাপত্তা সেট করুন।"
            )}
          </p>
        </div>

        {/* Language & Black Mode Colors right near the top for easy access */}
        <ThemeControlButton />
        <Profile />
        <DokaanProfile />
        <InvoiceTypeSelector />
        <Security />
        <Notifications />
        <ConnectedAccounts />
        <LogoutZone />
        <DangerZone />
      </main>
    </div>
  );
};

export default SettingsPage;
