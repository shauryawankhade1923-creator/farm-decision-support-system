import React, { useState } from "react";
import { 
  X, LogIn, UserPlus, KeyRound, Mail, Lock, User, Phone, 
  CheckCircle2, AlertCircle, Loader2, ShieldCheck, ArrowRight,
  RefreshCw, Sparkles
} from "lucide-react";
import { 
  login, 
  register, 
  verifyEmail, 
  resendVerificationCode, 
  requestPasswordReset, 
  resetPassword 
} from "../services/authService";

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login", // "login" | "register" | "forgot" | "verify"
  onAuthSuccess,
  language = "en"
}) {
  if (!isOpen) return null;

  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("Pune");
  const [verificationCode, setVerificationCode] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Field validation errors
  const [errors, setErrors] = useState({});

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setErrors({});
  };

  const switchMode = (newMode) => {
    clearMessages();
    setMode(newMode);
  };

  // Demo 1-Click Login for reviewers & judges
  const handleDemoLogin = async () => {
    clearMessages();
    setLoading(true);
    try {
      const user = await login("ramesh.patil@farmdecision.in", "Demo@1234");
      setSuccessMessage("Logged in as Ramesh Patil (Verified Farmer)");
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(user);
        onClose();
      }, 600);
    } catch (err) {
      setErrorMessage(err.message || "Failed to log in with demo account.");
    } finally {
      setLoading(false);
    }
  };

  // 1. Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    const newErrors = {};
    if (!email || !email.includes("@")) newErrors.email = "Please enter a valid email address.";
    if (!password || password.length < 4) newErrors.password = "Password must be at least 4 characters.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      setSuccessMessage("Login successful! Welcome back.");
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(user);
        onClose();
      }, 600);
    } catch (err) {
      setErrorMessage(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    const newErrors = {};
    if (!name || name.trim().length < 2) newErrors.name = "Full name is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) newErrors.email = "Enter a valid email address.";
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) newErrors.phone = "Enter a 10-digit mobile number.";
    if (!password || password.length < 8) newErrors.password = "Password must be at least 8 characters.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const { user, verificationCode: code } = await register({
        name,
        email,
        phone,
        password,
        district
      });
      setSuccessMessage(`Account created! A 6-digit verification code (${code}) was issued.`);
      // Move to verification tab
      setTimeout(() => {
        setMode("verify");
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Submit Email Verification
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!verificationCode || verificationCode.trim().length !== 6) {
      setErrors({ verificationCode: "Please enter the 6-digit verification code." });
      return;
    }

    setLoading(true);
    try {
      const user = await verifyEmail(verificationCode);
      setSuccessMessage("Email verified successfully! Your account is active.");
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(user);
        onClose();
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    clearMessages();
    setLoading(true);
    try {
      const code = await resendVerificationCode();
      setSuccessMessage(`New code sent: ${code}`);
    } catch (err) {
      setErrorMessage(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Submit Forgot Password Request
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!email || !email.includes("@")) {
      setErrors({ email: "Please enter your registered email address." });
      return;
    }

    setLoading(true);
    try {
      const res = await requestPasswordReset(email);
      setSuccessMessage(res.resetCode 
        ? `Reset code generated: ${res.resetCode}. Enter it below.`
        : "Reset instructions dispatched to your email."
      );
      setMode("reset_password");
    } catch (err) {
      setErrorMessage(err.message || "Failed to request password reset.");
    } finally {
      setLoading(false);
    }
  };

  // 5. Submit Password Reset
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    const newErrors = {};
    if (!resetCode || resetCode.trim().length < 4) newErrors.resetCode = "Enter the reset code sent to your email.";
    if (!newPassword || newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email, resetCode, newPassword });
      setSuccessMessage("Password reset successfully! Please sign in.");
      setTimeout(() => {
        setMode("login");
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="bg-[#0B4628] text-white p-5 sm:p-6 relative">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>Farmer Identity & Auth</span>
              </span>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-1">
                {mode === "login" && "Sign In to Your Farm"}
                {mode === "register" && "Create Farmer Account"}
                {mode === "forgot" && "Reset Your Password"}
                {mode === "reset_password" && "Enter New Password"}
                {mode === "verify" && "Verify Email Address"}
              </h2>
              <p className="text-xs text-emerald-100/90 font-medium">
                {mode === "login" && "Access your isolated farm plots & advisory history"}
                {mode === "register" && "Join thousands of farmers making low-risk sowing decisions"}
                {mode === "forgot" && "We'll send a secure 6-digit reset code to your email"}
                {mode === "reset_password" && "Set a strong password for your farm profile"}
                {mode === "verify" && "Enter the 6-digit confirmation code"}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Alert Messages */}
        <div className="px-6 pt-4">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">

          {/* 1. SIGN IN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh.patil@farmdecision.in"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition ${
                      errors.email ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-rose-600 font-bold mt-1">{errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    className="text-[11px] text-emerald-700 hover:underline font-bold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition ${
                      errors.password ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.password && <p className="text-[11px] text-rose-600 font-bold mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                <span>{loading ? "Signing In..." : "Sign In to Farm"}</span>
              </button>

              {/* 1-Click Judge Demo Login */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>1-Click Test Demo: Ramesh Patil (Akola)</span>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500 font-medium">
                  Don't have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    className="text-emerald-700 font-black hover:underline cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* 2. REGISTER FORM */}
          {mode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Suresh Shinde"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition ${
                      errors.name ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.name && <p className="text-[11px] text-rose-600 font-bold mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="suresh@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition ${
                      errors.email ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-rose-600 font-bold mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mobile (10 Digits)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition ${
                        errors.phone ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Home District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                  >
                    <option value="Pune">Pune</option>
                    <option value="Akola">Akola</option>
                    <option value="Nashik">Nashik</option>
                    <option value="Nagpur">Nagpur</option>
                    <option value="Amravati">Amravati</option>
                    <option value="Baramati">Baramati</option>
                    <option value="Solapur">Solapur</option>
                    <option value="Chhatrapati Sambhajinagar">Chh. Sambhajinagar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Password (Min. 8 characters)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition ${
                      errors.password ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.password && <p className="text-[11px] text-rose-600 font-bold mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                <span>{loading ? "Registering..." : "Create Farmer Account"}</span>
              </button>

              <div className="pt-2 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500 font-medium">
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="text-emerald-700 font-black hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* 3. EMAIL VERIFICATION FORM */}
          {mode === "verify" && (
            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  We've generated a 6-digit confirmation code. Please enter it below to verify your account.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 text-center">6-Digit Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full py-3 px-4 text-center tracking-[0.5em] text-lg font-black rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                />
                {errors.verificationCode && (
                  <p className="text-[11px] text-rose-600 font-bold text-center mt-1">{errors.verificationCode}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{loading ? "Verifying..." : "Verify & Activate Account"}</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-slate-500 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* 4. FORGOT PASSWORD FORM */}
          {mode === "forgot" && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh.patil@farmdecision.in"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition ${
                      errors.email ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-rose-600 font-bold mt-1">{errors.email}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                <span>{loading ? "Requesting..." : "Send Reset Code"}</span>
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Remembered your password? Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* 5. ENTER NEW PASSWORD FORM */}
          {mode === "reset_password" && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Reset Code</label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="Enter code"
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition ${
                    errors.resetCode ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                  }`}
                />
                {errors.resetCode && <p className="text-[11px] text-rose-600 font-bold mt-1">{errors.resetCode}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">New Password (Min 8 Chars)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition ${
                      errors.newPassword ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                    }`}
                  />
                </div>
                {errors.newPassword && <p className="text-[11px] text-rose-600 font-bold mt-1">{errors.newPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{loading ? "Updating..." : "Set New Password & Sign In"}</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
