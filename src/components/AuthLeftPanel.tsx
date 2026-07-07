import { Heart, Bell, Calendar, TrendingUp, Shield } from 'lucide-react';

const features = [
  { icon: Bell, label: 'Medication Reminders', desc: 'Never miss a dose' },
  { icon: Calendar, label: 'Consultations', desc: 'Book physical or virtual appointments' },
  { icon: TrendingUp, label: 'Health Tracking', desc: 'Track your progress and stay healthy' },
];

interface AuthLeftPanelProps {
  heading: string;
  subheading: string;
}

export default function AuthLeftPanel({ heading, subheading }: AuthLeftPanelProps) {
  return (
    <div className="relative w-[400px] flex-shrink-0 bg-blue-700 flex flex-col overflow-hidden rounded-l-3xl">
      {/* Background circles */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600 rounded-full opacity-40 pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-40 h-40 bg-blue-500 rounded-full opacity-30 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full px-10 py-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 text-blue-700" fill="currentColor" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">MediCare</p>
            <p className="text-blue-200 text-xs">Your Health, Your Priority</p>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-white text-4xl font-extrabold leading-tight mb-4">{heading}</h1>
        <p className="text-blue-100 text-sm leading-relaxed mb-8 max-w-xs">{subheading}</p>

        {/* Illustration */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center shadow-2xl">
              <Shield className="w-18 h-18 text-blue-200 w-20 h-20" fill="currentColor" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-blue-700 font-black text-xl leading-none">+</span>
            </div>
            <div className="absolute -right-14 top-4 bg-white/20 backdrop-blur-sm rounded-2xl p-3 flex flex-col gap-1 w-16">
              <div className="w-full h-1.5 bg-white/60 rounded-full" />
              <div className="w-4/5 h-1.5 bg-white/40 rounded-full" />
              <div className="w-3/5 h-1.5 bg-white/40 rounded-full" />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-5 flex-1">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{label}</p>
                <p className="text-blue-200 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-blue-200 text-xs mt-8 text-center">
          "Manage medications, schedule consultations, receive reminders and monitor your health from one secure platform."
        </p>
      </div>
    </div>
  );
}
