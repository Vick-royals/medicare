import { useState } from "react";
import { Bell, Mail, Clock, Moon, ChevronRight, Edit2, User, Lock, Sliders, Shield, Eye, Info } from "lucide-react";

type SettingsTab = "profile" | "account" | "notifications" | "security" | "reminders" | "privacy" | "about";

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
        enabled ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState<SettingsTab>("profile");
  const [prefs, setPrefs] = useState({
    pushNotifications: true,
    emailNotifications: true,
    medicationReminders: true,
    darkMode: false,
  });

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  const sideNav: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "account", label: "Account", icon: <Sliders className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Lock className="w-4 h-4" /> },
    { id: "reminders", label: "Reminders", icon: <Clock className="w-4 h-4" /> },
    { id: "privacy", label: "Privacy", icon: <Eye className="w-4 h-4" /> },
    { id: "about", label: "About", icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences.</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Side Nav */}
        <div className="col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {sideNav.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-left transition-colors border-b border-gray-50 last:border-0 ${
                  activeSection === id
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="col-span-3 space-y-4">
          {activeSection === "profile" && (
            <>
              {/* Profile Information */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-gray-900">Profile Information</h2>
                  <button className="flex items-center gap-1.5 text-sm text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=96&h=96&dpr=1"
                    alt="Victoria Johnson"
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Victoria Johnson</p>
                    <p className="text-sm text-gray-500">victoria.johnson@email.com</p>
                    <p className="text-sm text-gray-500">+234 801 234 5678</p>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-5">Preferences</h2>
                <div className="space-y-5">
                  {[
                    {
                      icon: <Bell className="w-4 h-4 text-blue-600" />,
                      bg: "bg-blue-100",
                      label: "Push Notifications",
                      desc: "Receive notifications on your device",
                      key: "pushNotifications" as const,
                    },
                    {
                      icon: <Mail className="w-4 h-4 text-blue-600" />,
                      bg: "bg-blue-100",
                      label: "Email Notifications",
                      desc: "Receive updates and alerts via email",
                      key: "emailNotifications" as const,
                    },
                    {
                      icon: <Clock className="w-4 h-4 text-blue-600" />,
                      bg: "bg-blue-100",
                      label: "Medication Reminders",
                      desc: "Get reminded about your medications",
                      key: "medicationReminders" as const,
                    },
                    {
                      icon: <Moon className="w-4 h-4 text-gray-600" />,
                      bg: "bg-gray-100",
                      label: "Dark Mode",
                      desc: "Switch to dark theme",
                      key: "darkMode" as const,
                    },
                  ].map(({ icon, bg, label, desc, key }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                          {icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{label}</p>
                          <p className="text-xs text-gray-400">{desc}</p>
                        </div>
                      </div>
                      <Toggle enabled={prefs[key]} onToggle={() => togglePref(key)} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Change Password */}
              <button className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                <div>
                  <p className="font-semibold text-gray-900 text-sm text-left">Change Password</p>
                  <p className="text-xs text-gray-400 mt-0.5">Update your password regularly to keep your account secure.</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
            </>
          )}

          {activeSection !== "profile" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <Shield className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm capitalize">{activeSection} settings coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
