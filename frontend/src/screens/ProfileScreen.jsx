import React, { useState } from "react";
import { 
  User, Mail, Phone, MapPin, ShieldCheck, Download, Upload, 
  Trash2, LogOut, ArrowLeft, CheckCircle2, AlertTriangle, 
  HelpCircle, FileText, Lock, Sparkles, Check, ChevronRight
} from "lucide-react";
import { getCurrentUser, logout, deleteAccount, loginDemoUser } from "../services/authService";
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

  const isMr = language === "mr";
  const isHi = language === "hi";

  const refreshUser = () => {
    setCurrentUser(getCurrentUser());
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    showToast(isMr ? "यशस्वीरीत्या लॉगआउट झाले." : isHi ? "सफलतापूर्वक लॉगआउट किया गया।" : "Logged out successfully.");
    onBack();
  };

  const handleQuickDemoLogin = () => {
    const demo = loginDemoUser();
    setCurrentUser(demo);
    showToast(isMr ? "⚡ रमेश पाटील (अकोला) म्हणून त्वरित लॉगिन झाले!" : isHi ? "⚡ रमेश पाटिल (अकोला) के रूप में तुरंत लॉगिन हुआ!" : "⚡ Quick demo logged in as Ramesh Patil (Akola)!");
  };

  const handleExportBackup = () => {
    try {
      exportDatabaseBackup(currentUser?.id);
      showToast(isMr ? "शेत माहितीचा बॅकअप JSON फाईलमध्ये सेव्ह झाला!" : isHi ? "खेत डेटा का बैकअप JSON में सफलतापूर्वक सेव हुआ!" : "Farm database backup exported to JSON successfully!");
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
      showToast(isMr ? `${res.fieldsCount} शेत नोंदी आणि ${res.consultationsCount} निर्णय पुनर्संचयित झाले!` : isHi ? `${res.fieldsCount} खेत रिकॉर्ड्स और ${res.consultationsCount} निर्णय पुनर्स्थापित हुए!` : `Restored ${res.fieldsCount} fields and ${res.consultationsCount} consultations!`);
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
      showToast(isMr ? "कृपया पुष्टी करण्यासाठी DELETE टाईप करा." : isHi ? "कृपया पुष्टि के लिए DELETE टाइप करें।" : "Please type DELETE to confirm.");
      return;
    }
    setIsDeleting(true);
    try {
      await deleteAccount();
      showToast(isMr ? "तुमचे खाते आणि शेताचा सर्व डेटा कायमचा हटवला गेला." : isHi ? "आपका खाता और खेती का सारा डेटा हमेशा के लिए हटा दिया गया।" : "Your account and all associated farm data have been permanently deleted.");
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
    <div className="w-full max-w-xl mx-auto pb-36 font-sans text-slate-800 antialiased">
      {/* 1. TOP HEADER (Clean padding, zero clipping) */}
      <div className="bg-[#0B4628] text-white pt-5 pb-6 px-5 rounded-b-3xl shadow-md relative">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
            title="Go Back"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <h1 className="text-xs font-black uppercase tracking-wider text-emerald-200">
            {isMr ? "शेतकरी ओळख व खाते" : isHi ? "किसान पहचान एवं प्रोफाइल" : "Farmer Identity & Profile"}
          </h1>
          <div className="w-9" />
        </div>

        {/* Profile Card Summary */}
        <div className="flex items-center gap-3.5 bg-white/10 rounded-2xl p-3.5 border border-white/15 backdrop-blur-xs">
          <div className="w-14 h-14 rounded-full border-2 border-emerald-400 overflow-hidden shadow-md bg-emerald-950 shrink-0">
            <img
              src="/farmer_avatar.svg"
              alt="Farmer Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-0.5 min-w-0 flex-1">
            <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
              <span className="truncate">
                {currentUser?.name || (isMr ? "पाहुणा शेतकरी (Guest)" : isHi ? "अतिथि किसान (Guest)" : "Guest Farmer")}
              </span>
              {currentUser?.isVerified ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                  <span>{isMr ? "सत्यापित" : isHi ? "सत्यापित" : "Verified"}</span>
                </span>
              ) : currentUser ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-black bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full border border-amber-400/30 shrink-0">
                  {isMr ? "असत्यापित" : isHi ? "असत्यापित" : "Unverified"}
                </span>
              ) : null}
            </h2>
            <p className="text-xs text-emerald-100/80 font-medium truncate">
              {currentUser?.email || (isMr ? "स्थानिक फोन मेमरी सक्रिय • खाते जोडलेले नाही" : isHi ? "स्थानीय फोन मेमोरी सक्रिय • खाता लिंक नहीं" : "No account linked. Sowing data stored on this device.")}
            </p>
          </div>
        </div>
      </div>

      {/* 2. BODY CONTENT (Positive spacing, clean cards, no negative margin clipping) */}
      <div className="px-4 pt-4 space-y-3.5">
        
        {/* Verification Alert Banner if unverified */}
        {currentUser && !currentUser.isVerified && (
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-amber-900 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="text-xs">
                <span className="font-black block">
                  {isMr ? "ईमेल सत्यापित नाही" : isHi ? "ईमेल सत्यापित नहीं है" : "Email Not Verified"}
                </span>
                <span className="text-amber-700">
                  {isMr ? "क्लाउड सिंकिंग आणि सुरक्षा सक्रिय करण्यासाठी कोड टाका." : isHi ? "क्लाउड सिंक और सुरक्षा के लिए कोड डालें।" : "Verify to unlock cloud syncing and secure backups."}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenAuth("verify")}
              className="py-1 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-black transition cursor-pointer shrink-0"
            >
              {isMr ? "सत्यापित करा" : isHi ? "सत्यापित करें" : "Verify Code"}
            </button>
          </div>
        )}

        {/* If guest, show Sign In / Register Prompt with 1-Click Demo Login */}
        {!currentUser && (
          <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  {isMr ? "साइन इन किंवा नवीन खाते" : isHi ? "साइन इन या नया खाता" : "Sign In or Create Account"}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium leading-snug">
                  {isMr ? "रो लेव्हल सुरक्षेसह (RLS) सर्व डिव्हाइसवर शेत माहिती सेव्ह करा" : isHi ? "रो लेवल सिक्योरिटी (RLS) के साथ सभी डिवाइस पर खेती का डेटा सेव करें" : "Save your farm fields across devices with Row Level Security"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => onOpenAuth("login")}
                className="py-2.5 rounded-xl bg-[#0B4628] hover:bg-emerald-900 text-white text-xs font-black flex items-center justify-center transition cursor-pointer"
              >
                {isMr ? "साइन इन" : isHi ? "साइन इन" : "Sign In"}
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth("register")}
                className="py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center transition cursor-pointer"
              >
                {isMr ? "नवीन खाते" : isHi ? "नया खाता" : "Create Account"}
              </button>
            </div>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100/90 border border-amber-200/90 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <span>⚡</span>
              <span>{isMr ? "१-क्लिक चाचणी लॉगिन (रमेश पाटील, अकोला)" : isHi ? "१-क्लिक डेमो लॉगिन (रमेश पाटिल, अकोला)" : "1-Click Quick Demo Login (Ramesh Patil, Akola)"}</span>
            </button>
          </div>
        )}

        {/* Account Details Card if logged in */}
        {currentUser && (
          <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {isMr ? "खात्याचे तपशील" : isHi ? "खाता विवरण" : "Account Credentials"}
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-bold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isMr ? "शेतकऱ्याचे नाव" : isHi ? "किसान का नाम" : "Farmer Name"}</span>
                </span>
                <span className="font-black text-slate-800">{currentUser.name}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-bold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isMr ? "ईमेल" : isHi ? "ईमेल" : "Email"}</span>
                </span>
                <span className="font-black text-slate-800">{currentUser.email}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-bold flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isMr ? "मोबाईल" : isHi ? "मोबाइल" : "Mobile"}</span>
                </span>
                <span className="font-black text-slate-800">+91 {currentUser.phone || "9823012345"}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isMr ? "जिल्हा" : isHi ? "ज़िला" : "Home District"}</span>
                </span>
                <span className="font-black text-slate-800">{currentUser.district || "Pune"}</span>
              </div>
            </div>
          </div>
        )}


        {/* Database Backup & Restore Management (Item 9) */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs space-y-3">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
              {isMr ? "डेटा बॅकअप व रिस्टोर" : isHi ? "डेटा बैकअप एवं रिस्टोर" : "Data Portability & Database Backups"}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {isMr ? "JSON फाईल डाऊनलोड करा किंवा मागील शेत नोंदी रिस्टोर करा" : isHi ? "JSON फाइल डाउनलोड करें या पिछले खेत रिकॉर्ड्स रिस्टोर करें" : "Download JSON snapshots or restore previous records"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-0.5">
            <button
              type="button"
              onClick={handleExportBackup}
              className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>{isMr ? "बॅकअप डाऊनलोड (.JSON)" : isHi ? "बैकअप डाउनलोड (.JSON)" : "Export JSON Backup"}</span>
            </button>

            <label className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span>{restoring ? (isMr ? "रिस्टोर होत आहे..." : isHi ? "रिस्टोर हो रहा..." : "Restoring...") : (isMr ? "बॅकअप रिस्टोर" : isHi ? "बैकअप रिस्टोर" : "Restore Backup")}</span>
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
        <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-xs divide-y divide-slate-100">
          <button
            type="button"
            onClick={onOpenOnboarding}
            className="w-full p-3 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-between transition cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{isMr ? "प्रणाली कशी कार्य करते (मार्गदर्शक फेरफटका)" : isHi ? "सिस्टम कैसे काम करता है (वॉकथ्रू)" : "How Decision Support Works (Walkthrough)"}</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={onOpenPrivacy}
            className="w-full p-3 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-between transition cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{isMr ? "गोपनीयता धोरण आणि DPDP अधिकार" : isHi ? "गोपनीयता नीति एवं DPDP अधिकार" : "Privacy Policy & DPDP Rights"}</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={onOpenTerms}
            className="w-full p-3 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-between transition cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{isMr ? "सेवा अटी व कृषी सल्ला अस्वीकरण" : isHi ? "सेवा शर्तें एवं कृषि परामर्श अस्वीकरण" : "Terms of Service & Advisory Disclaimers"}</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Account Actions: Logout & Delete Account */}
        <div className="space-y-2 pt-1">
          {currentUser && (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-black text-slate-700 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{isMr ? "शेतकरी खात्यातून बाहेर पडा (Logout)" : isHi ? "किसान खाते से बाहर निकलें (Logout)" : "Sign Out of Farm Account"}</span>
            </button>
          )}

          {currentUser && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-2.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isMr ? "खाते व सर्व शेत डेटा कायमचा हटवा" : isHi ? "खाता और सारा खेत डेटा हमेशा के लिए हटाएं" : "Delete Account & Purge Data"}</span>
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
              <h3 className="text-base font-black text-slate-900">
                {isMr ? "खाते कायमचे हटवायचे?" : isHi ? "खाता स्थायी रूप से हटाएं?" : "Permanently Delete Account?"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isMr 
                  ? "हे तुमचे खाते, सर्व सेव्ह केलेले शेत प्लॉट्स आणि निर्णय कायमचे हटवेल. ही क्रिया पूर्ववत केली जाऊ शकत नाही." 
                  : isHi 
                  ? "यह आपका खाता, सभी सहेजे गए खेत प्लॉट्स और निर्णय स्थायी रूप से हटा देगा। यह क्रिया पूर्ववत नहीं की जा सकती।" 
                  : "This will delete your credentials, all saved farm plots, and consultation history. This action cannot be undone."}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">
                {isMr ? "पुष्टी करण्यासाठी खाली DELETE टाईप करा:" : isHi ? "पुष्टि करने के लिए नीचे DELETE टाइप करें:" : "Type DELETE below to confirm:"}
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
                {isMr ? "रद्द करा" : isHi ? "रद्द करें" : "Cancel"}
              </button>

              <button
                type="button"
                disabled={isDeleting || deleteInputText.trim().toUpperCase() !== "DELETE"}
                onClick={handleDeleteAccount}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-600/20 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? "Deleting..." : (isMr ? "कायमचे हटवा" : isHi ? "स्थायी हटाएं" : "Permanently Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
