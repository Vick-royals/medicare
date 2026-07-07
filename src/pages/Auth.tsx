import { useState } from "react";
import {
  Heart,
  Lock,
  Mail,
  Eye,
  EyeOff,
  User,
  Phone,
  Bell,
  Calendar,
  TrendingUp,
  Shield,
} from "lucide-react";

type AuthView = "signin" | "signup";

interface AuthProps {
  onAuth: () => void;
}

const features = [
  {
    icon: Bell,
    label: "Medication Reminders",
    desc: "Never miss a dose",
  },
  {
    icon: Calendar,
    label: "Consultations",
    desc: "Book physical or virtual appointments",
  },
  {
    icon: TrendingUp,
    label: "Health Tracking",
    desc: "Track your progress and stay healthy",
  },
];

function LeftPanel({ view }: { view: AuthView }) {
  return (
    <div className="relative w-[420px] flex-shrink-0 bg-blue-700 flex flex-col overflow-hidden rounded-l-3xl">
      {/* Decorative circles */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600 rounded-full opacity-40" />
      <div className="absolute -bottom-10 left-10 w-40 h-40 bg-blue-500 rounded-full opacity-30" />

      <div className="relative z-10 flex flex-col h-full px-10 py-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 text-blue-700" fill="currentColor" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">HealthCare</p>
            <p className="text-blue-200 text-xs">Your Health, Our Priority</p>
          </div>
        </div>

        {/* Headline */}
        <div className="mb-8">
          {view === "signin" ? (
            <>
              <h1 className="text-white text-5xl font-extrabold leading-tight mb-4">
                Welcome<br />Back!
              </h1>
              <p className="text-blue-100 text-sm leading-relaxed max-w-xs">
                Sign in to continue managing your medications, appointments and health records.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-white text-5xl font-extrabold leading-tight mb-4">
                Create Your<br />Account
              </h1>
              <p className="text-blue-100 text-sm leading-relaxed max-w-xs">
                Join us to manage your medications, track your health and book consultations easily.
              </p>
            </>
          )}
        </div>

        {/* Illustration placeholder */}
        <div className="flex-1 flex items-center justify-center mb-8">
          <div className="relative">
            {/* Shield */}
            <div className="w-36 h-36 bg-blue-500 rounded-full flex items-center justify-center shadow-2xl">
              <Shield className="w-20 h-20 text-blue-200" fill="currentColor" />
            </div>
            {/* Cross badge */}
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-blue-700 font-black text-xl leading-none">+</span>
            </div>
            {/* Floating clipboard card */}
            <div className="absolute -right-16 top-4 bg-white/20 backdrop-blur-sm rounded-2xl p-3 flex flex-col gap-1 w-20">
              <div className="w-full h-1.5 bg-white/60 rounded-full" />
              <div className="w-4/5 h-1.5 bg-white/40 rounded-full" />
              <div className="w-3/5 h-1.5 bg-white/40 rounded-full" />
            </div>
          </div>
        </div>

        {/* Feature list */}
        <div className="space-y-5 mb-10">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4.5 h-4.5 text-white w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{label}</p>
                <p className="text-blue-200 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quote (signin only) */}
        {view === "signin" && (
          <div className="border-t border-white/20 pt-6">
            <div className="flex items-start gap-2">
              <span className="text-blue-300 text-3xl font-serif leading-none mt-1">"</span>
              <p className="text-blue-100 text-sm leading-relaxed italic">
                Small steps today for<br />a healthier tomorrow.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="h-px flex-1 bg-white/20" />
              <Heart className="w-4 h-4 text-blue-300" />
              <div className="h-px flex-1 bg-white/20" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SignInForm({ onSwitch, onAuth }: { onSwitch: () => void; onAuth: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-12 py-10 bg-white rounded-r-3xl overflow-y-auto">
      {/* Icon */}
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-5">
        <Lock className="w-7 h-7 text-blue-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h2>
      <p className="text-gray-400 text-sm mb-8">Sign in to your account</p>

      <div className="w-full max-w-sm space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Forgot */}
        <div className="flex justify-end">
          <button className="text-sm text-blue-600 font-medium hover:underline">Forgot Password?</button>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRemember((v) => !v)}
            className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
              remember ? "bg-blue-600 border-blue-600" : "border-gray-300"
            }`}
          >
            {remember && (
              <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <span className="text-sm text-gray-600">Remember me</span>
        </div>

        {/* Sign In button */}
        <button
          onClick={onAuth}
          className="w-full py-3.5 bg-blue-700 text-white font-bold text-sm rounded-xl hover:bg-blue-800 active:scale-[0.98] transition-all shadow-md shadow-blue-200"
        >
          Sign In
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google */}
        <button className="w-full py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Apple */}
        <button className="w-full py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          <AppleIcon />
          Continue with Apple
        </button>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <button onClick={onSwitch} className="text-blue-600 font-semibold hover:underline">
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
}

function SignUpForm({ onSwitch, onAuth }: { onSwitch: () => void; onAuth: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="flex-1 flex flex-col items-center justify-start px-12 py-10 bg-white rounded-r-3xl overflow-y-auto">
      {/* Icon */}
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-5 flex-shrink-0">
        <User className="w-7 h-7 text-blue-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
      <p className="text-gray-400 text-sm mb-8">Fill in the details below to get started</p>

      <div className="w-full max-w-sm space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={form.name}
              onChange={set("name")}
              placeholder="Enter your full name"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="Enter your email address"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Phone Number (Optional)</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={form.phone}
              onChange={set("phone")}
              placeholder="Enter your phone number"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={set("password")}
              placeholder="Create a password"
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Password must be at least 8 characters
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showConfirm ? "text" : "password"}
              value={form.confirm}
              onChange={set("confirm")}
              placeholder="Confirm your password"
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2.5">
          <button
            onClick={() => setAgreed((v) => !v)}
            className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center border-2 transition-colors ${
              agreed ? "bg-blue-600 border-blue-600" : "border-gray-300"
            }`}
          >
            {agreed && (
              <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <p className="text-sm text-gray-500">
            I agree to the{" "}
            <button className="text-blue-600 font-medium hover:underline">Terms of Service</button>
            {" "}and{" "}
            <button className="text-blue-600 font-medium hover:underline">Privacy Policy</button>
          </p>
        </div>

        {/* Create Account button */}
        <button
          onClick={onAuth}
          className="w-full py-3.5 bg-blue-700 text-white font-bold text-sm rounded-xl hover:bg-blue-800 active:scale-[0.98] transition-all shadow-md shadow-blue-200"
        >
          Create Account
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google */}
        <button className="w-full py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          <GoogleIcon />
          Sign up with Google
        </button>

        {/* Apple */}
        <button className="w-full py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          <AppleIcon />
          Sign up with Apple
        </button>

        <p className="text-center text-sm text-gray-500 pb-2">
          Already have an account?{" "}
          <button onClick={onSwitch} className="text-blue-600 font-semibold hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

export default function Auth({ onAuth }: AuthProps) {
  const [view, setView] = useState<AuthView>("signin");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <div className="flex w-full max-w-4xl shadow-2xl rounded-3xl overflow-hidden min-h-[620px]">
        <LeftPanel view={view} />
        <div className="flex-1 flex overflow-hidden">
          {view === "signin" ? (
            <SignInForm onSwitch={() => setView("signup")} onAuth={onAuth} />
          ) : (
            <SignUpForm onSwitch={() => setView("signin")} onAuth={onAuth} />
          )}
        </div>
      </div>
    </div>
  );
}
