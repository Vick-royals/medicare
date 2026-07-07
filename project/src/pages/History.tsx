import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { adherenceService, type AdherenceHistory } from "../services/adherenceService";

type HistTab = "calendar" | "summary" | "medHistory";
type DoseStatus = "taken" | "missed" | "snoozed" | "nodata" | "today";

interface DayData {
  day: number;
  statuses: DoseStatus[];
}

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function DayCell({ data }: { data: DayData | null }) {
  if (!data) return <div />;

  const s = data.statuses[0];
  const isToday = s === "today";

  const dotClass: Record<DoseStatus, string> = {
    taken: "bg-green-500",
    missed: "bg-red-500",
    snoozed: "bg-yellow-400",
    nodata: "bg-gray-200",
    today: "bg-blue-700",
  };

  const numClass = isToday
    ? "bg-blue-700 text-white"
    : "text-gray-700";

  return (
    <div className="flex flex-col items-center gap-1.5 py-2">
      <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${numClass}`}>
        {data.day}
      </span>
      <span className={`w-5 h-5 rounded-full flex items-center justify-center ${dotClass[s]}`}>
        {s === "taken" && <span className="text-white text-[10px]">✓</span>}
        {s === "missed" && <span className="text-white text-[10px]">✗</span>}
        {s === "today" && <span className="text-white text-[10px]">✓</span>}
        {s === "nodata" && null}
        {s === "snoozed" && <span className="text-white text-[10px]">~</span>}
      </span>
    </div>
  );
}

export default function History() {
  const [activeTab, setActiveTab] = useState<HistTab>("calendar");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [adherenceHistory, setAdherenceHistory] = useState<AdherenceHistory[]>([]);
  const [adherenceSummary, setAdherenceSummary] = useState({
    adherenceRate: 0,
    taken: 0,
    missed: 0,
    snoozed: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  // Generate calendar days for current month/year
  const generateCalendarData = (): (DayData | null)[] => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); // 0 = Sunday

    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    const todayDate = today.getDate();

    // Create a map of day -> status
    const statusMap: Record<number, DoseStatus> = {};
    adherenceHistory.forEach((h) => {
      const d = new Date(h.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        statusMap[d.getDate()] = h.status as DoseStatus;
      }
    });

    const days: (DayData | null)[] = [];
    // Add leading nulls for days before first day of month (adjust to start Monday)
    const adjustedStart = (startDay + 6) % 7; // Make Monday = 0
    for (let i = 0; i < adjustedStart; i++) {
      days.push(null);
    }
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      let status: DoseStatus = "nodata";
      if (isCurrentMonth && day === todayDate) {
        status = "today";
      } else if (statusMap[day]) {
        status = statusMap[day];
      }
      days.push({ day, statuses: [status] });
    }
    return days;
  };

  const paddedData = generateCalendarData();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [historyRes, summaryRes] = await Promise.all([
          adherenceService.getHistory(),
          adherenceService.getSummary(currentMonth, currentYear),
        ]);
        if (historyRes.success) setAdherenceHistory(historyRes.data);
        if (summaryRes.success) setAdherenceSummary(summaryRes.data);
      } catch (error) {
        console.error("Error fetching history data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentMonth, currentYear]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    setCurrentMonth(new Date().getMonth());
    setCurrentYear(new Date().getFullYear());
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const tabs = [
    { id: "calendar" as HistTab, label: "Adherence Calendar" },
    { id: "summary" as HistTab, label: "Adherence Summary" },
    { id: "medHistory" as HistTab, label: "Medication History" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
        <p className="text-gray-500 mt-1">View your medication adherence and health history.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
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

      {activeTab === "calendar" && (
        <div className="grid grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button 
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-500" />
                </button>
                <h3 className="font-semibold text-gray-900">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                <button 
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <button 
                onClick={handleToday}
                className="text-sm text-blue-600 font-medium border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Today
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading history...</p>
              </div>
            ) : (
              <>
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-2">
                  {weekDays.map((d) => (
                    <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7">
                  {paddedData.map((day, i) => (
                    <DayCell key={i} data={day} />
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-5 mt-4 pt-4 border-t border-gray-100">
                  {[
                    { color: "bg-green-500", label: "Taken" },
                    { color: "bg-yellow-400", label: "Snoozed" },
                    { color: "bg-red-500", label: "Missed" },
                    { color: "bg-gray-200", label: "No Data" },
                  ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className={`w-3 h-3 rounded-full ${color}`} />
                      {label}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Monthly Overview */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm text-gray-500 font-medium">Monthly Overview</p>
              <p className="text-xs text-gray-400 mt-0.5 mb-4">
                {monthNames[currentMonth]} {currentYear}
              </p>

              <p className="text-4xl font-bold text-gray-900">
                {adherenceSummary.adherenceRate}%
              </p>
              <p className="text-sm text-gray-500 mb-3">Adherence Rate</p>

              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-5">
                <div 
                  className="h-full bg-blue-600 rounded-full" 
                  style={{ width: `${adherenceSummary.adherenceRate}%` }} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{adherenceSummary.taken}</p>
                  <p className="text-xs text-gray-400">Doses Taken</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-500">{adherenceSummary.missed}</p>
                  <p className="text-xs text-gray-400">Doses Missed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-500">{adherenceSummary.snoozed}</p>
                  <p className="text-xs text-gray-400">Doses Snoozed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{adherenceSummary.total}</p>
                  <p className="text-xs text-gray-400">Total Doses</p>
                </div>
              </div>
            </div>

            {/* Achievement Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
              <Star className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <p className="text-sm text-blue-700 font-medium">
                Great job! You are on track to achieve your health goals.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "summary" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-400 text-sm">Adherence summary data coming soon.</p>
        </div>
      )}

      {activeTab === "medHistory" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-400 text-sm">Medication history data coming soon.</p>
        </div>
      )}
    </div>
  );
}
