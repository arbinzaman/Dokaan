import { useState } from "react";
import SettingSection from "./SettingSection";
import { Link2, Plus } from "lucide-react";
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa";
import toast from "react-hot-toast";

const STORAGE_KEY = "dokaan_connected_accounts";

const INITIAL_ACCOUNTS = [
  { id: 1, name: "Google", connected: true },
  { id: 2, name: "Facebook", connected: false },
  { id: 3, name: "X (Twitter)", connected: false },
];

const iconMap = {
  Google: <FaGoogle className="w-4 h-4 text-rose-500" />,
  Facebook: <FaFacebook className="w-4 h-4 text-blue-600" />,
  "X (Twitter)": <FaTwitter className="w-4 h-4 text-sky-500" />,
};

const ConnectedAccounts = () => {
  const [connectedAccounts, setConnectedAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  const toggleConnection = (id) => {
    setConnectedAccounts((prev) => {
      const next = prev.map((acc) =>
        acc.id === id ? { ...acc, connected: !acc.connected } : acc
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      const changed = next.find((a) => a.id === id);
      if (changed) {
        toast.success(
          changed.connected
            ? `${changed.name} connected.`
            : `${changed.name} disconnected.`
        );
      }
      return next;
    });
  };

  return (
    <SettingSection icon={Link2} title="Connected Accounts">
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {connectedAccounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between py-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {iconMap[account.name] || <Link2 className="w-4 h-4" />}
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {account.name}
              </span>
            </div>
            <button
              type="button"
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                account.connected
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/60"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => toggleConnection(account.id)}
            >
              {account.connected ? "Connected" : "Connect"}
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => toast("More OAuth integrations coming soon.")}
        className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        <Plus size={16} className="mr-1.5" /> Add Account
      </button>
    </SettingSection>
  );
};

export default ConnectedAccounts;
