import {
  LayoutDashboard,
  Pill,
  Calendar,
  Clock,
  Bell,
  Settings,
  LogOut,
  Heart,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/medications', label: 'Medications', icon: Pill },
  { path: '/consultations', label: 'Consultations', icon: Calendar },
  { path: '/history', label: 'History', icon: Clock },
  { path: '/notifications', label: 'Notifications', icon: Bell, badge: 3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-blue-800 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-blue-700" fill="currentColor" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">MediCare</p>
            <p className="text-blue-200 text-xs">Your Health, Our Priority</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2">
        {navItems.map(({ path, label, icon: Icon, badge }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-150 text-left ${
                isActive
                  ? 'bg-white text-blue-700 font-semibold shadow-md'
                  : 'text-blue-100 hover:bg-blue-700'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm flex-1">{label}</span>
              {badge && (
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Help Card */}
      <div className="mx-4 mb-4 bg-blue-700 rounded-2xl p-4 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-white font-semibold text-sm mb-1">Need help?</p>
          <p className="text-blue-200 text-xs mb-3 leading-relaxed">
            Book a consultation with our specialists.
          </p>
          <button
            onClick={() => navigate('/consultations')}
            className="bg-white text-blue-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Book Now
          </button>
        </div>
        <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-blue-600 rounded-full opacity-50" />
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-600 rounded-full opacity-30" />
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-7 py-5 text-blue-200 hover:text-white transition-colors text-sm border-t border-blue-700"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </aside>
  );
}
