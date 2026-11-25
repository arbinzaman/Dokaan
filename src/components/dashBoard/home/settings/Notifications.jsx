import { useState } from "react";
import SettingSection from "./SettingSection";
import { Bell } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";

const STORAGE_KEY = "dokaan_notification_prefs";

const Notifications = () => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { push: true, email: false, sms: true };
    } catch {
      return { push: true, email: false, sms: true };
    }
  });

  const toggle = (key) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <SettingSection icon={Bell} title="Notifications">
      <ToggleSwitch
        label="Push Notifications"
        isOn={notifications.push}
        onToggle={() => toggle("push")}
      />
      <ToggleSwitch
        label="Email Notifications"
        isOn={notifications.email}
        onToggle={() => toggle("email")}
      />
      <ToggleSwitch
        label="SMS Notifications"
        isOn={notifications.sms}
        onToggle={() => toggle("sms")}
      />
    </SettingSection>
  );
};

export default Notifications;
