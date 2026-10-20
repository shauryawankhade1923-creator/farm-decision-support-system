import React, { useState } from "react";
import { 
  User, Mail, Phone, MapPin, ShieldCheck, Download, Upload, 
  Trash2, LogOut, ArrowLeft, CheckCircle2, AlertTriangle, 
  HelpCircle, FileText, Lock, Globe2, Sparkles, RefreshCw
} from "lucide-react";
import { getCurrentUser, logout, deleteAccount } from "../services/authService";
import { exportDatabaseBackup, restoreDatabaseBackup } from "../services/backupService";

export default function ProfileScreen({
  onBack,
  onOpenAuth,
  onOpenOnboarding,
  onOpenPrivacy,
  onOpenTerms,
  showToast,
  language = "en"
}) {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInputText, setDeleteInputText] = useState("");
  const [restoring, setRestoring] = useState(false);

  const refreshUser = () => {
    setCurrentUser(getCurrentUser());
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    showToast("Logged out successfully.");
    onBack();
  };

  const handleExportBackup = () => {
    try {
      exportDatabaseBackup(currentUser?.id);
      showToast("Farm database backup exported to JSON successfully!");
    } catch (err) {
      showToast("Failed to export backup: " + err.message);
    }
  };

  const handleFileRestore = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoring(true);
    try {
      const res = await restoreDatabaseBackup(file, currentUser?.id);
      showToast(`Restored ${res.fieldsCount} fields and ${res.consultationsCount} consultations!`);
      refreshUser();
    } catch (err) {
      showToast("Restore failed: " + err.message);
    } finally {
      setRestoring(false);
      e.target.value = "";
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteInputText.trim().toUpperCase() !== "DELETE") {
      showToast("Please type DELETE to confirm.");
      return;
    }
    setIsDeleting(true);
    try {
      await deleteAccount();
      showToast("Your account and all associated farm data have been permanently deleted.");
      setShowDeleteConfirm(false);
      setCurrentUser(null);
      onBack();
    } catch (err) {
      showToast("Failed to delete account: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-24 font-sans text-slate-800 antialiased">
      {/* Top Header */}
      <div className="bg-[#0B4628] text-white pt-6 pb-16 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-200">
            Farmer Identity & Profile
          </span>
          <div className="w-9" />
        </div>

        {/* Profile Card Summary */}
        <div className="mt-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-emerald-400 overflow-hidden shadow-md bg-emerald-900 shrink-0">
            <img
              src="/user_avatar.jpg"
              alt="Farmer Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>

          <div className="space-y-0.5">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{currentUser?.name || "Guest Farmer"}</span>
              {currentUser?.isVerified ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                  <span>Verified</span>
                </span>
              ) : currentUser ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-black bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full border border-amber-400/30">
                  Unverified
                </span>
              ) : null}
            </h2>
            <p className="text-xs text-emerald-100/90 font-medium">
              {currentUser?.email || "No account linked. Sowing data stored locally."}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-8 space-y-5">
        {/* Verification Alert Banner if unverified */}
        {currentUser && !currentUser.isVerified && (
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-amber-900 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="text-xs">
                <span className="font-black block">Email Not Verified</span>
                <span className="text-amber-700">Verify to unlock cloud syncing and SMS alerts.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenAuth("verify")}
              className="py-1 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-black transition cursor-pointer shrink-0"
            >
              Verify Code
            </button>
          </div>
        )}

        {/* If guest, show Sign In / Register Prompt */}
        {!currentUser && (
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-md space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Sign In or Create Account</h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Save your farm fields across devices with Row Level Security
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => onOpenAuth("login")}
                className="py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black flex items-center justify-center transition cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth("register")}
                className="py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center transition cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* Account Details Card */}
        {currentUser && (
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Account Credentials
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-bold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Farmer Name</span>
                </span>
                <span className="font-black text-slate-800">{currentUser.name}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-bold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email</span>
                </span>
                <span className="font-black text-slate-800">{currentUser.email}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-bold flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Mobile</span>
                </span>
                <span className="font-black text-slate-800">+91 {currentUser.phone || "9823012345"}</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Home District</span>
                </span>
                <span className="font-black text-slate-800">{currentUser.district || "Pune"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Row Level Security (RLS) Status Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-300">
              Row Level Security (RLS) Active
            </h3>
          </div>
          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            All your farm plots, consultations, and soil inputs are cryptographically isolated to user ID <span className="font-mono text-emerald-400">{currentUser?.id || "guest"}</span>. Other accounts cannot query your plots.
          </p>
        </div>

        {/* Database Backup & Restore Management (Item 9) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Data Portability & Database Backups
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Download JSON snapshots or restore previous records
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={handleExportBackup}
              className="py-2.5 px-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>Export JSON Backup</span>
            </button>

            <label className="py-2.5 px-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>{restoring ? "Restoring..." : "Restore Backup"}</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileRestore}
                disabled={restoring}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Legal, Help & Documentation Links */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-1">
          <button
            type="button"
            onClick={onOpenOnboarding}
            className="w-full p-2.5 rounded-2xl hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-between transition cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>How Decision Support Works (Walkthrough)</span>
            </span>
            <span className="text-slate-400">→</span>
          </button>

          <button
            type="button"
            onClick={onOpenPrivacy}
            className="w-full p-2.5 rounded-2xl hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-between transition cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Privacy Policy & DPDP Rights</span>
            </span>
            <span className="text-slate-400">→</span>
          </button>

          <button
            type="button"
            onClick={onOpenTerms}
            className="w-full p-2.5 rounded-2xl hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-between transition cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Terms of Service & Advisory Disclaimers</span>
            </span>
            <span className="text-slate-400">→</span>
          </button>
        </div>

        {/* Account Actions: Logout & Delete Account */}
        <div className="space-y-2.5 pt-2">
          {currentUser && (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-3 rounded-2xl border border-slate-200 hover:bg-slate-100 text-xs font-black text-slate-700 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Farm Account</span>
            </button>
          )}

          {currentUser && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-2.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account & Purge Data</span>
            </button>
          )}
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">Permanently Delete Account?</h3>
              <p className="text-xs text-slate-500 font-medium">
                This will delete your credentials, all saved farm plots, and consultation history. This action cannot be undone.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">
                Type <strong>DELETE</strong> below to confirm:
              </label>
              <input
                type="text"
                value={deleteInputText}
                onChange={(e) => setDeleteInputText(e.target.value)}
                placeholder="DELETE"
                className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-center tracking-wider focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteInputText("");
                }}
                className="py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting || deleteInputText.trim().toUpperCase() !== "DELETE"}
                onClick={handleDeleteAccount}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-600/20 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
