import { useState, useEffect } from "react";
import { Search, Filter, Plus, MoreVertical, Pill, Clock } from "lucide-react";
import { medicationService, type Medication } from "../services/medicationService";

type Tab = "all" | "active" | "low" | "inactive";

export default function Medications() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const res = await medicationService.getMedications();
        if (res.success) {
          setMedications(res.data);
        }
      } catch (error) {
        console.error("Error fetching medications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedications();
  }, []);

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "all", label: "All Medications", count: medications.length },
    { id: "active", label: "Active", count: medications.filter((m) => m.status !== "inactive").length },
    { id: "low", label: "Low Stock", count: medications.filter((m) => m.status === "low").length },
    { id: "inactive", label: "Inactive", count: medications.filter((m) => m.status === "inactive").length },
  ];

  const filtered = medications.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && m.status !== "inactive";
    if (activeTab === "low") return matchesSearch && m.status === "low";
    if (activeTab === "inactive") return matchesSearch && m.status === "inactive";
    return matchesSearch;
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medications</h1>
          <p className="text-gray-500 mt-1">Manage your medications and stay on track.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-800 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Add Medication
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-medium flex items-center gap-2 transition-colors border-b-2 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                activeTab === tab.id ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search medication..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Medication List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading medications...</p>
          </div>
        ) : filtered.map((med, i) => (
          <div
            key={med._id}
            className={`flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition-colors ${
              i < filtered.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <div className={`w-12 h-12 ${med.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Pill className={`w-6 h-6 ${med.pillColor}`} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{med.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {med.dose} &bull; {med.instruction}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium">
                {med.frequency}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium">
                {med.route}
              </span>
            </div>

            <div className="text-right min-w-[80px]">
              <p className={`text-lg font-bold ${med.remaining <= 5 ? "text-red-500" : "text-green-600"}`}>
                {med.remaining}
              </p>
              <p className="text-xs text-gray-400">Remaining</p>
            </div>

            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-100 transition-colors">
              Edit
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Clock className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No medications found.</p>
          </div>
        )}
      </div>

      {/* Low stock banner */}
      {medications.some((m) => m.status === "low") && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">i</span>
            </div>
            <div>
              <p className="text-blue-700 font-semibold text-sm">Low stock medications</p>
              <p className="text-blue-500 text-xs mt-0.5">
                {medications.filter((m) => m.status === "low").length} medications are running low. Please reorder to avoid interruptions.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("low")}
            className="text-sm text-blue-700 font-semibold border border-blue-300 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
          >
            View Low Stock
          </button>
        </div>
      )}
    </div>
  );
}
