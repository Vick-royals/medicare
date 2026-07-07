import { useState, useEffect } from "react";
import { Bell, CheckCircle2, AlertTriangle, Calendar, Info, BookOpen } from "lucide-react";
import { notificationService, type Notification as ServiceNotification } from "../services/notificationService";

type NotifTab = "all" | "reminders" | "alerts" | "updates";

interface Notification extends ServiceNotification {
  time: string;
}

const iconMap: Record<Notification["type"], React.ReactNode> = {
  reminder: <Bell className="w-5 h-5 text-blue-600" />,
  taken: <CheckCircle2 className="w-5 h-5 text-green-500" />,
  lowstock: <AlertTriangle className="w-5 h-5 text-orange-500" />,
  appointment: <Calendar className="w-5 h-5 text-purple-500" />,
  tip: <Info className="w-5 h-5 text-blue-400" />,
};

const bgMap: Record<Notification["type"], string> = {
  reminder: "bg-blue-100",
  taken: "bg-green-100",
  lowstock: "bg-orange-100",
  appointment: "bg-purple-100",
  tip: "bg-blue-50",
};

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<NotifTab>("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "all" as NotifTab, label: "All" },
    { id: "reminders" as NotifTab, label: "Reminders" },
    { id: "alerts" as NotifTab, label: "Alerts" },
    { id: "updates" as NotifTab, label: "Updates" },
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationService.getNotifications();
        if (res.success) {
          const mapped = res.data.map((n) => ({
            ...n,
            time: new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          }));
          setNotifications(mapped);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const filtered = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "reminders") return n.type === "reminder" || n.type === "taken";
    if (activeTab === "alerts") return n.type === "lowstock";
    if (activeTab === "updates") return n.type === "appointment" || n.type === "tip";
    return true;
  });

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-500 mt-1">Stay updated with your reminders and alerts.</p>
      </div>

      {/* Tabs + Mark all read */}
      <div className="flex items-center justify-between border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm text-blue-600 font-medium hover:underline pb-3"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading notifications...</p>
          </div>
        ) : filtered.map((n, i) => (
          <div
            key={n._id}
            className={`flex items-start gap-4 px-6 py-5 hover:bg-gray-50 transition-colors ${
              i < filtered.length - 1 ? "border-b border-gray-100" : ""
            } ${!n.read ? "bg-blue-50/30" : ""}`}
          >
            <div className={`w-10 h-10 ${bgMap[n.type]} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
              {iconMap[n.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${!n.read ? "text-gray-900" : "text-gray-700"}`}>
                {n.title}
              </p>
              <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-400 whitespace-nowrap">{n.time}</span>
              {!n.read && <span className="w-2 h-2 bg-blue-600 rounded-full" />}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No notifications in this category.</p>
          </div>
        )}
      </div>

      {/* View All */}
      <button className="w-full py-3.5 border border-gray-200 rounded-2xl text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors">
        View All Notifications
      </button>
    </div>
  );
}
