import {
  Pill,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Activity,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const todayMeds = [
  { name: "Paracetamol 500mg", time: "8:00 AM", status: "taken", color: "bg-blue-100", pill: "text-blue-600" },
  { name: "Vitamin C 500mg", time: "12:05 PM", status: "taken", color: "bg-green-100", pill: "text-green-600" },
  { name: "Metformin 500mg", time: "6:00 PM", status: "upcoming", color: "bg-orange-100", pill: "text-orange-500" },
  { name: "Atorvastatin 20mg", time: "9:00 PM", status: "upcoming", color: "bg-purple-100", pill: "text-purple-600" },
];

const upcomingConsults = [
  {
    name: "Dr. Sarah Johnson",
    specialty: "General Physician",
    date: "June 10, 2026",
    time: "10:00 AM",
    type: "Physical Visit",
    typeColor: "bg-blue-100 text-blue-700",
  },
  {
    name: "Dr. Michael Lee",
    specialty: "Cardiologist",
    date: "June 12, 2026",
    time: "3:00 PM",
    type: "Virtual Visit",
    typeColor: "bg-teal-100 text-teal-700",
  },
];

// Kept for backward compatibility during transition
interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export default function Dashboard(_props: DashboardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Good morning, {firstName}!</h1>
        <p className="text-gray-500 mt-1">Here's an overview of your health today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-700 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <Pill className="w-6 h-6 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Today</span>
          </div>
          <p className="text-3xl font-bold">2/4</p>
          <p className="text-blue-100 text-sm mt-1">Medications Taken</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">90%</p>
          <p className="text-gray-500 text-sm mt-1">Adherence Rate</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">2</p>
          <p className="text-gray-500 text-sm mt-1">Upcoming Appointments</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">2</p>
          <p className="text-gray-500 text-sm mt-1">Low Stock Alerts</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Today's Medications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <h2 className="font-semibold text-gray-900 text-lg">Today's Medications</h2>
              <p className="text-gray-400 text-sm">June 17, 2026</p>
            </div>
            <button
              onClick={() => navigate("/medications")}
              className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="px-6 pb-6 space-y-3">
            {todayMeds.map((med) => (
              <div key={med.name} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className={`w-10 h-10 ${med.color} rounded-xl flex items-center justify-center`}>
                  <Pill className={`w-5 h-5 ${med.pill}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{med.name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {med.time}
                  </p>
                </div>
                {med.status === "taken" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <span className="text-xs bg-orange-100 text-orange-600 font-medium px-2 py-0.5 rounded-full">
                    Upcoming
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Consultations */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <h2 className="font-semibold text-gray-900 text-lg">Upcoming Consultations</h2>
              <p className="text-gray-400 text-sm">Scheduled appointments</p>
            </div>
            <button
              onClick={() => navigate("/consultations")}
              className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="px-6 pb-6 space-y-3">
            {upcomingConsults.map((c) => (
              <div key={c.name} className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.specialty}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.typeColor}`}>
                    {c.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {c.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {c.time}
                  </span>
                </div>
              </div>
            ))}
            <button
              onClick={() => navigate("/consultations")}
              className="w-full py-3 text-blue-600 text-sm font-medium border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
            >
              + Book New Appointment
            </button>
          </div>
        </div>

        {/* Health Summary Banner */}
        <div className="col-span-2 bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">You're doing great!</p>
              <p className="text-blue-100 text-sm">90% medication adherence this month. Keep it up!</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/history")}
              className="bg-white text-blue-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
