import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Filter, ChevronDown } from "lucide-react";
import { consultationService, type Consultation } from "../services/consultationService";

type ConsultTab = "available" | "my" | "past";

export default function Consultations() {
  const [activeTab, setActiveTab] = useState<ConsultTab>("available");
  const [visitFilter, setVisitFilter] = useState("All Types");
  const [availableAppointments, setAvailableAppointments] = useState<Consultation[]>([]);
  const [myAppointments, setMyAppointments] = useState<Consultation[]>([]);
  const [pastConsultations, setPastConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "available" as ConsultTab, label: "Available Appointments" },
    { id: "my" as ConsultTab, label: "My Appointments" },
    { id: "past" as ConsultTab, label: "Past Consultations" },
  ];

  const visitFilters = ["All Types", "Physical Visit", "Virtual Visit"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [availableRes, myRes, pastRes] = await Promise.all([
          consultationService.getAvailable(),
          consultationService.getMy(),
          consultationService.getPast(),
        ]);
        if (availableRes.success) setAvailableAppointments(availableRes.data);
        if (myRes.success) setMyAppointments(myRes.data);
        if (pastRes.success) setPastConsultations(pastRes.data);
      } catch (error) {
        console.error("Error fetching consultations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const listToShow =
    activeTab === "available"
      ? availableAppointments.filter(
          (a) => visitFilter === "All Types" || a.type === visitFilter
        )
      : activeTab === "my"
      ? myAppointments
      : pastConsultations;

  const handleBook = async (id: string) => {
    try {
      const res = await consultationService.book(id);
      if (res.success) {
        setMyAppointments([...myAppointments, res.data]);
        setAvailableAppointments(
          availableAppointments.map((a) =>
            a._id === id ? { ...a, slots: (a.slots || 0) - 1 } : a
          ).filter((a) => (a.slots || 0) > 0)
        );
      }
    } catch (error) {
      console.error("Error booking consultation:", error);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const res = await consultationService.cancel(id);
      if (res.success) {
        setMyAppointments(myAppointments.filter((a) => a._id !== id));
        setPastConsultations([...pastConsultations, res.data]);
      }
    } catch (error) {
      console.error("Error canceling consultation:", error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Consultations</h1>
        <p className="text-gray-500 mt-1">Book and manage your doctor appointments.</p>
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

      {/* Filters (only on available) */}
      {activeTab === "available" && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {visitFilters.map((f) => (
              <button
                key={f}
                onClick={() => setVisitFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  visitFilter === f
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-1.5 rounded-lg bg-white hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Appointment Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading consultations...</p>
          </div>
        ) : listToShow.map((appt) => (
          <div
            key={appt._id}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <img
                src={appt.avatar}
                alt={appt.doctor}
                className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{appt.name}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${appt.typeColor}`}>
                        {appt.type}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mt-0.5">{appt.doctor}</p>
                    <p className="text-xs text-gray-400">{appt.specialty}</p>
                  </div>
                  {"slots" in appt && (
                    <p className="text-sm text-gray-500 flex-shrink-0">
                      <span className="font-semibold text-gray-700">{appt.slots}</span> Slots Left
                    </p>
                  )}
                  {"status" in appt && (
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${(appt as { statusColor: string }).statusColor}`}>
                      {(appt as { status: string }).status}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-6 mt-4 flex-wrap">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(appt.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {appt.time}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {appt.location}
                  </span>
                </div>
              </div>

              {activeTab === "available" && (
                <button 
                  onClick={() => handleBook(appt._id)}
                  className="flex-shrink-0 bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-800 transition-colors shadow-sm"
                >
                  Book Now
                </button>
              )}
              {activeTab === "my" && (
                <div className="flex gap-2 flex-shrink-0">
                  <button className="text-sm font-semibold px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600">
                    Reschedule
                  </button>
                  <button 
                    onClick={() => handleCancel(appt._id)}
                    className="text-sm font-semibold px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {listToShow.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl py-16 text-center shadow-sm">
            <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No appointments found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
