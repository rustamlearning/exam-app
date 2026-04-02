import { useState, useEffect, useCallback, useRef, useMemo, createContext, useContext } from "react";
import { BookOpen, Users, GraduationCap, Settings, LogOut, Plus, Trash2, Edit, Eye, Clock, AlertTriangle, CheckCircle, XCircle, Monitor, Upload, ChevronRight, Menu, X, Search, FileText, BarChart3, Shield, Lock, Save, RefreshCw, ChevronDown, ArrowLeft, Home, User, Hash, Layers, Play, Square, Award, Bell, AlertCircle, Printer, Camera, Key, Download } from "lucide-react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

// ============= CONSTANTS =============
const SCHOOL_NAME = "SMA Negeri 6 Pangkajene dan Kepulauan";
const SCHOOL_SHORT = "SMAN 6 PANGKEP";
const SCHOOL_ADDRESS = "Jl. Pendidikan No. 2 Pulau Sapuka, Kab. Pangkajene dan Kepulauan, Prov. Sulawesi Selatan 90673";
const SCHOOL_LOGO = "data:image/png;base64,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";
const THEME_KEY = "sman6_theme";
const SESSION_KEY = "sman6_user_session";
const BACKUP_KEY = "sman6_data_backup";
const CACHE_KEY = "sman6_data_cache";

// Safe deep-merge: never overwrites non-empty arrays with empty ones
function safeMerge(base, remote) {
  if (!remote || typeof remote !== "object") return base;
  const result = { ...base };
  for (const key of Object.keys(remote)) {
    const rv = remote[key];
    const bv = base[key];
    // Never replace non-empty array with empty array (data loss protection)
    if (Array.isArray(bv) && Array.isArray(rv) && bv.length > 0 && rv.length === 0) {
      result[key] = bv;
    } else if (rv !== undefined && rv !== null) {
      result[key] = rv;
    }
  }
  return result;
}

// LocalStorage helpers with error handling
const ls = {
  get(key) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } },
  set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch { return false; } },
  remove(key) { try { localStorage.removeItem(key); } catch {} },
};

const MAPEL_K13 = [
  { id: "pai", name: "Pendidikan Agama Islam dan Budi Pekerti", category: "Wajib" },
  { id: "pkn", name: "Pendidikan Pancasila dan Kewarganegaraan", category: "Wajib" },
  { id: "bindo", name: "Bahasa Indonesia", category: "Wajib" },
  { id: "mtk", name: "Matematika (Wajib)", category: "Wajib" },
  { id: "sindo", name: "Sejarah Indonesia", category: "Wajib" },
  { id: "bing", name: "Bahasa Inggris", category: "Wajib" },
  { id: "senbud", name: "Seni Budaya", category: "Wajib" },
  { id: "pjok", name: "Pendidikan Jasmani, Olahraga dan Kesehatan", category: "Wajib" },
  { id: "pkwu", name: "Prakarya dan Kewirausahaan", category: "Wajib" },
  { id: "mtk_p", name: "Matematika (Peminatan)", category: "MIPA" },
  { id: "fisika", name: "Fisika", category: "MIPA" },
  { id: "kimia", name: "Kimia", category: "MIPA" },
  { id: "biologi", name: "Biologi", category: "MIPA" },
  { id: "geo", name: "Geografi", category: "IPS" },
  { id: "sej_p", name: "Sejarah (Peminatan)", category: "IPS" },
  { id: "sos", name: "Sosiologi", category: "IPS" },
  { id: "eko", name: "Ekonomi", category: "IPS" },
  { id: "sastra_id", name: "Bahasa dan Sastra Indonesia", category: "Bahasa" },
  { id: "sastra_en", name: "Bahasa dan Sastra Inggris", category: "Bahasa" },
  { id: "antro", name: "Antropologi", category: "Bahasa" },
  { id: "b_asing", name: "Bahasa Asing Lain", category: "Bahasa" },
  { id: "info", name: "Informatika", category: "Lintas Minat" },
];

const MAPEL_MERDEKA = [
  { id: "pai_m", name: "Pendidikan Agama Islam dan Budi Pekerti", category: "Umum" },
  { id: "ppkn_m", name: "Pendidikan Pancasila", category: "Umum" },
  { id: "bindo_m", name: "Bahasa Indonesia", category: "Umum" },
  { id: "mtk_m", name: "Matematika", category: "Umum" },
  { id: "bing_m", name: "Bahasa Inggris", category: "Umum" },
  { id: "pjok_m", name: "Pendidikan Jasmani, Olahraga dan Kesehatan", category: "Umum" },
  { id: "seni_m", name: "Seni dan Prakarya", category: "Umum" },
  { id: "sejind_m", name: "Sejarah", category: "Umum" },
  { id: "bio_m", name: "Biologi", category: "MIPA" },
  { id: "fisika_m", name: "Fisika", category: "MIPA" },
  { id: "kimia_m", name: "Kimia", category: "MIPA" },
  { id: "mtk_lnj", name: "Matematika Lanjutan", category: "MIPA" },
  { id: "eko_m", name: "Ekonomi", category: "IPS" },
  { id: "geo_m", name: "Geografi", category: "IPS" },
  { id: "sos_m", name: "Sosiologi", category: "IPS" },
  { id: "sejdun_m", name: "Sejarah Dunia", category: "IPS" },
  { id: "sastra_m", name: "Bahasa dan Sastra Indonesia", category: "Bahasa" },
  { id: "sastraen_m", name: "Bahasa dan Sastra Inggris", category: "Bahasa" },
  { id: "barabu_m", name: "Bahasa Arab", category: "Bahasa" },
  { id: "info_m", name: "Informatika", category: "Informatika" },
  { id: "projek_m", name: "Projek Penguatan Profil Pelajar Pancasila (P5)", category: "Projek" },
];

const KELAS_OPTIONS = ["X-MIPA 1","X-MIPA 2","X-MIPA 3","X-IPS 1","X-IPS 2","X-IPS 3","XI-MIPA 1","XI-MIPA 2","XI-MIPA 3","XI-IPS 1","XI-IPS 2","XI-IPS 3","XII-MIPA 1","XII-MIPA 2","XII-MIPA 3","XII-IPS 1","XII-IPS 2","XII-IPS 3"];
const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

// ============= FIREBASE =============
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const store = {
  async get(key) {
    try {
      const snap = await getDoc(doc(db, "examapp", key));
      return snap.exists() ? snap.data().value : null;
    } catch (e) { console.error("get error:", e); return null; }
  },
  async set(key, val) {
    // Validate: never write null/undefined or empty critical arrays
    if (val === null || val === undefined) { console.warn("store.set: blocked null write for", key); return; }
    try { await setDoc(doc(db, "examapp", key), { value: val }); }
    catch (e) { console.error("set error:", e); }
  },
  listen(key, callback) {
    return onSnapshot(doc(db, "examapp", key), (snap) => {
      if (snap.exists()) callback(snap.data().value, snap.metadata);
    }, (err) => { console.error("snapshot error:", err); });
  }
};

const DEFAULT_DATA = {
  admin: { username: "admin", password: "admin123" },
  teachers: [], students: [], subjects: MAPEL_K13,
  questions: [], exams: [], sessions: [], results: [],
};

// ============= MAIN APP =============
// ============= THEME CONTEXT =============
const ThemeCtx = createContext("dark");
const useTheme = () => useContext(ThemeCtx);

export default function ExamApp() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("login");
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState(() => ls.get(THEME_KEY) || "dark");
  const toggleTheme = useCallback(() => {
    setTheme(t => { const next = t === "dark" ? "light" : "dark"; ls.set(THEME_KEY, next); return next; });
  }, []);
  const isDark = theme === "dark";
  const T = {
    bg: isDark ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" : "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)",
    card: isDark ? "rgba(30,41,59,0.9)" : "rgba(255,255,255,0.95)",
    cardBorder: isDark ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.2)",
    text: isDark ? "#ffffff" : "#0f172a",
    textMuted: isDark ? "#94a3b8" : "#475569",
    sidebar: isDark ? "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)" : "linear-gradient(180deg, #1e3a5f 0%, #1e2d5a 100%)",
    input: isDark ? "rgba(15,23,42,0.8)" : "rgba(241,245,249,0.9)",
    inputBorder: isDark ? "rgba(59,130,246,0.25)" : "rgba(59,130,246,0.35)",
    rowAlt: isDark ? "rgba(15,23,42,0.4)" : "rgba(241,245,249,0.6)",
    itemHover: isDark ? "rgba(255,255,255,0.05)" : "rgba(59,130,246,0.05)",
  };
  const lastSaveRef = useRef(0);
  const isWritingRef = useRef(false);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Load data + real-time listener
  useEffect(() => {
    let unsub = null;
    (async () => {
      // 1. Load cached data immediately (instant UI)
      const cached = ls.get(CACHE_KEY);
      if (cached && Object.keys(cached).length > 4) {
        const safe = safeMerge(DEFAULT_DATA, cached);
        setData(safe);
        setLoading(false);
      }

      // 2. Load from Firebase
      let d = null;
      try { d = await store.get("examapp_data"); } catch (e) { console.error("Firebase load failed:", e); }

      if (d && typeof d === "object" && Object.keys(d).length > 0) {
        // Merge with cache to prevent data loss: keep the richer version per field
        const localCache = ls.get(CACHE_KEY) || {};
        const merged = safeMerge(safeMerge(DEFAULT_DATA, d), {});
        // For critical arrays, keep whichever has more data
        for (const key of ["teachers","students","questions","exams","sessions","results"]) {
          const remote = d[key] || [];
          const local = localCache[key] || [];
          merged[key] = remote.length >= local.length ? remote : local;
        }
        if (!merged.subjects?.length) merged.subjects = MAPEL_K13;
        setData(merged);
        ls.set(CACHE_KEY, merged);
        ls.set(BACKUP_KEY, merged); // secondary backup
      } else {
        // Firebase returned null/empty — use cache, don't overwrite with DEFAULT_DATA
        const cache = ls.get(CACHE_KEY) || ls.get(BACKUP_KEY);
        if (cache && Object.keys(cache).length > 4) {
          const safe = safeMerge(DEFAULT_DATA, cache);
          setData(safe);
          // Restore to Firebase from cache
          await store.set("examapp_data", safe);
        } else {
          // Truly first run
          await store.set("examapp_data", DEFAULT_DATA);
          setData(DEFAULT_DATA);
        }
      }
      setLoading(false);

      // 3. Restore user session from localStorage
      const savedSession = ls.get(SESSION_KEY);
      if (savedSession?.user && savedSession?.view && savedSession.view !== "login") {
        setUser(savedSession.user);
        setView(savedSession.view);
      }

      // 4. Real-time sync listener — with data-loss protection
      unsub = store.listen("examapp_data", (remoteData, meta) => {
        if (!remoteData || typeof remoteData !== "object") return;
        if (meta.hasPendingWrites) return;
        if (Date.now() - lastSaveRef.current < 3000) return;
        setData(prev => {
          if (!prev) return prev;
          // Merge: never replace longer arrays with shorter ones
          const merged = { ...prev };
          for (const key of Object.keys(remoteData)) {
            const rv = remoteData[key];
            const pv = prev[key];
            if (Array.isArray(pv) && Array.isArray(rv) && pv.length > 0 && rv.length === 0) {
              // Keep local — remote is empty but local has data
              continue;
            }
            merged[key] = rv;
          }
          if (!merged.subjects?.length) merged.subjects = MAPEL_K13;
          ls.set(CACHE_KEY, merged);
          return merged;
        });
      });
    })();
    return () => { if (unsub) unsub(); };
  }, []);

  const saveQueue = useRef([]);
  const isSaving = useRef(false);

  const flushSave = useCallback(async () => {
    if (isSaving.current || saveQueue.current.length === 0) return;
    isSaving.current = true;
    const latest = saveQueue.current[saveQueue.current.length - 1];
    saveQueue.current = [];
    try {
      lastSaveRef.current = Date.now();
      ls.set(CACHE_KEY, latest);
      ls.set(BACKUP_KEY, latest);
      await store.set("examapp_data", latest);
    } catch (e) {
      console.error("save failed, retrying:", e);
      // Re-queue on failure
      saveQueue.current.unshift(latest);
      setTimeout(flushSave, 2000);
    }
    isSaving.current = false;
    // Flush again if more items queued while we were saving
    if (saveQueue.current.length > 0) flushSave();
  }, []);

  const saveData = useCallback(async (newData) => {
    if (!newData || typeof newData !== "object") { console.error("saveData: invalid data"); return; }
    // Optimistic UI update
    setData(newData);
    // Queue the save (deduplicates rapid calls)
    saveQueue.current.push(newData);
    flushSave();
  }, [flushSave]);

  // Expose dataRef so ExamTaker can always access latest data
  const dataRef = useRef(null);
  useEffect(() => { dataRef.current = data; }, [data]);

  const handleLogin = useCallback((credentials) => {
    if (!data) return;
    const { role, username, password } = credentials;
    let loggedUser = null;
    let nextView = "login";

    if (role === "admin") {
      if (username === data.admin.username && password === data.admin.password) {
        loggedUser = { role: "admin", name: "Administrator" };
        nextView = "admin";
        showToast("Login berhasil sebagai Admin");
      } else { showToast("Username atau password salah", "error"); return; }
    } else if (role === "guru") {
      const guru = data.teachers.find(t => t.name.toLowerCase() === username.toLowerCase() && (t.password ? t.password === password : t.nip === password));
      if (guru) {
        loggedUser = { role: "guru", ...guru };
        nextView = "guru";
        showToast(`Selamat datang, ${guru.name}`);
      } else { showToast("Nama atau NIP/Password salah", "error"); return; }
    } else if (role === "siswa") {
      const siswa = data.students.find(s => s.name.toLowerCase() === username.toLowerCase() && s.nisn === password);
      if (siswa) {
        loggedUser = { role: "siswa", ...siswa };
        nextView = "siswa";
        showToast(`Selamat datang, ${siswa.name}`);
      } else { showToast("Nama atau NISN salah", "error"); return; }
    }

    if (loggedUser) {
      setUser(loggedUser);
      setView(nextView);
      try { localStorage.setItem(SESSION_KEY, JSON.stringify({ user: loggedUser, view: nextView })); } catch {}
    }
  }, [data, showToast]);

  const handleLogout = useCallback(() => {
    setUser(null);
    setView("login");
    ls.remove(SESSION_KEY);
  }, []);

  // Sync updated user data (e.g. after profile photo change)
  const updateUserSession = useCallback((updatedUser) => {
    setUser(updatedUser);
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        localStorage.setItem(SESSION_KEY, JSON.stringify({ ...parsed, user: updatedUser }));
      }
    } catch {}
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <ThemeCtx.Provider value={{ theme, toggleTheme, isDark, T }}>
    <div className="min-h-screen" style={{ background: T.bg }}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      {view === "login" && <LoginScreen onLogin={handleLogin} />}
      {view === "admin" && <AdminDashboard data={data} dataRef={dataRef} saveData={saveData} user={user} onLogout={handleLogout} showToast={showToast} />}
      {view === "guru" && <TeacherDashboard data={data} dataRef={dataRef} saveData={saveData} user={user} onLogout={handleLogout} showToast={showToast} updateUserSession={updateUserSession} />}
      {view === "siswa" && <StudentDashboard data={data} dataRef={dataRef} saveData={saveData} user={user} onLogout={handleLogout} showToast={showToast} updateUserSession={updateUserSession} />}
    </div>
    </ThemeCtx.Provider>
  );
}

// ============= LOADING =============
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4" style={{ animation: "spin 1s linear infinite" }} />
        <p className="text-blue-200 text-lg">Memuat Aplikasi Ujian...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

// ============= TOAST =============
function Toast({ msg, type }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] px-5 py-3 rounded-xl shadow-2xl text-white font-medium flex items-center gap-2 max-w-sm" style={{ background: type === "error" ? "#dc2626" : type === "warning" ? "#d97706" : "#16a34a", animation: "slideIn .3s ease" }}>
      {type === "error" ? <XCircle size={18} /> : type === "warning" ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
      {msg}
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}

// ============= LOGIN SCREEN =============
function LoginScreen({ onLogin }) {
  const { isDark, toggleTheme } = useTheme();
  const [role, setRole] = useState("siswa");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const labels = { admin: { u: "Username", p: "Password" }, guru: { u: "Nama Lengkap", p: "NIP / Password" }, siswa: { u: "Nama Lengkap", p: "NISN" } };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={SCHOOL_LOGO} alt="Logo SMAN6" className="w-24 h-24 mx-auto mb-3 rounded-full object-cover shadow-2xl" style={{ border: "3px solid rgba(59,130,246,0.5)" }} />
          <h1 className="text-2xl font-bold text-white mb-0.5">{SCHOOL_NAME}</h1>
          <p className="text-blue-300 text-sm font-medium">Sistem Ujian Sekolah Digital</p>
          <p className="text-blue-400 text-xs mt-1 leading-relaxed">{SCHOOL_ADDRESS}</p>
        </div>
        <div className="rounded-2xl p-6 shadow-2xl" style={{ background: "rgba(30,41,59,0.95)", backdropFilter: "blur(20px)", border: "1px solid rgba(59,130,246,0.2)" }}>
          {/* Theme toggle */}
          <div className="flex justify-end mb-2"><button onClick={toggleTheme} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10 transition">{isDark ? "☀️ Mode Terang" : "🌙 Mode Gelap"}</button></div>
          <div className="flex rounded-xl overflow-hidden mb-6" style={{ background: "rgba(15,23,42,0.8)" }}>
            {["siswa", "guru", "admin"].map(r => (
              <button key={r} onClick={() => { setRole(r); setUsername(""); setPassword(""); }} className="flex-1 py-2.5 text-sm font-semibold transition-all" style={{ background: role === r ? "#3b82f6" : "transparent", color: role === r ? "white" : "#94a3b8" }}>
                {r === "siswa" ? "Siswa" : r === "guru" ? "Guru" : "Admin"}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-blue-300 text-sm font-medium mb-1 block">{labels[role].u}</label>
              <div className="flex items-center rounded-xl px-3" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.3)" }}>
                <User size={18} className="text-blue-400" />
                <input value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === "Enter" && onLogin({ role, username, password })} placeholder={labels[role].u} className="w-full py-3 px-3 bg-transparent text-white outline-none placeholder-slate-500" />
              </div>
            </div>
            <div>
              <label className="text-blue-300 text-sm font-medium mb-1 block">{labels[role].p}</label>
              <div className="flex items-center rounded-xl px-3" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.3)" }}>
                <Lock size={18} className="text-blue-400" />
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && onLogin({ role, username, password })} placeholder={labels[role].p} className="w-full py-3 px-3 bg-transparent text-white outline-none placeholder-slate-500" />
                <button onClick={() => setShowPw(!showPw)} className="text-blue-400 hover:text-blue-300"><Eye size={18} /></button>
              </div>
            </div>
            <button onClick={() => onLogin({ role, username, password })} className="w-full py-3 rounded-xl text-white font-bold text-base transition-all hover:shadow-lg" style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}>
              Masuk
            </button>
          </div>
        </div>
        <p className="text-center text-slate-500 text-xs mt-6">© 2026 {SCHOOL_SHORT} — Sistem Ujian Digital</p>
      </div>
    </div>
  );
}

// ============= SIDEBAR LAYOUT =============
function DashboardLayout({ user, onLogout, tabs, activeTab, setActiveTab, children }) {
  const { isDark, toggleTheme, T } = useTheme();
  const [sideOpen, setSideOpen] = useState(false);
  return (
    <div className="min-h-screen flex">
      {sideOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSideOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform lg:translate-x-0 ${sideOpen ? "translate-x-0" : "-translate-x-full"}`} style={{ background: T.sidebar, borderRight: "1px solid rgba(59,130,246,0.15)" }}>
        <div className="p-4 border-b" style={{ borderColor: "rgba(59,130,246,0.15)" }}>
          <div className="flex items-center gap-3">
            <img src={SCHOOL_LOGO} alt="Logo" className="w-10 h-10 rounded-full object-cover shrink-0" />
            <div className="overflow-hidden">
              <div className="text-white font-bold text-sm truncate">{SCHOOL_SHORT}</div>
              <div className="text-blue-400 text-xs truncate">Ujian Digital</div>
            </div>
          </div>
        </div>
        <div className="p-3">
          <div className="px-3 py-2 rounded-lg mb-2 flex items-center gap-3" style={{ background: "rgba(59,130,246,0.1)" }}>
            {user.photo ? (
              <img src={user.photo} alt="" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>{user.name?.[0] || "?"}</div>
            )}
            <div className="overflow-hidden">
              <div className="text-white text-sm font-semibold truncate">{user.name}</div>
              <div className="text-blue-400 text-xs capitalize">{user.role}</div>
            </div>
          </div>
        </div>
        <nav className="px-3 space-y-1 flex-1 overflow-y-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setActiveTab(t.id); setSideOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all" style={{ background: activeTab === t.id ? "rgba(59,130,246,0.2)" : "transparent", color: activeTab === t.id ? "#60a5fa" : "#94a3b8" }}>
              {t.icon}{t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 mt-auto space-y-1">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-all">{isDark ? "☀️" : "🌙"} {isDark ? "Mode Terang" : "Mode Gelap"}</button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"><LogOut size={18} />Keluar</button>
        </div>
      </aside>
      <main className="flex-1 min-h-screen overflow-y-auto">
        <header className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3 lg:hidden" style={{ background: isDark ? "rgba(15,23,42,0.95)" : "rgba(30,58,95,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(59,130,246,0.15)" }}>
          <button onClick={() => setSideOpen(true)} className="text-white"><Menu size={24} /></button>
          <span className="text-white font-semibold">{tabs.find(t => t.id === activeTab)?.label}</span>
        </header>
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}

// ============= REUSABLE COMPONENTS =============
function Card({ children, className = "", style: extraStyle, ...props }) {
  const { T } = useTheme();
  return <div className={`rounded-2xl p-5 ${className}`} style={{ background: T.card, border: `1px solid ${T.cardBorder}`, ...extraStyle }} {...props}>{children}</div>;
}
function Btn({ children, variant = "primary", className = "", ...props }) {
  const styles = { primary: "linear-gradient(135deg, #3b82f6, #1d4ed8)", danger: "linear-gradient(135deg, #dc2626, #991b1b)", success: "linear-gradient(135deg, #16a34a, #15803d)", secondary: "rgba(51,65,85,0.8)", warning: "linear-gradient(135deg, #d97706, #b45309)" };
  return <button className={`px-4 py-2 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 flex items-center gap-2 disabled:opacity-50 ${className}`} style={{ background: styles[variant] || styles.primary }} {...props}>{children}</button>;
}
function Input({ label, ...props }) {
  const { T, isDark } = useTheme();
  return (
    <div>
      {label && <label className="text-blue-400 text-sm font-medium mb-1 block">{label}</label>}
      <input className="w-full py-2.5 px-3 rounded-xl outline-none text-sm" style={{ background: T.input, border: `1px solid ${T.inputBorder}`, color: T.text }} {...props} />
    </div>
  );
}
function Select({ label, children, ...props }) {
  const { T } = useTheme();
  return (
    <div>
      {label && <label className="text-blue-400 text-sm font-medium mb-1 block">{label}</label>}
      <select className="w-full py-2.5 px-3 rounded-xl outline-none text-sm" style={{ background: T.input, border: `1px solid ${T.inputBorder}`, color: T.text }} {...props}>{children}</select>
    </div>
  );
}
function StatCard({ icon, label, value, color = "#3b82f6" }) {
  return (
    <Card className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>{icon}</div>
      <div><div className="text-2xl font-bold text-white">{value}</div><div className="text-slate-400 text-sm">{label}</div></div>
    </Card>
  );
}
function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className={`rounded-2xl p-6 w-full ${wide ? "max-w-3xl" : "max-w-lg"} max-h-[90vh] overflow-y-auto`} style={{ background: "#1e293b", border: "1px solid rgba(59,130,246,0.2)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
function EmptyState({ icon, text }) {
  return <div className="text-center py-12"><div className="text-slate-500 mb-2">{icon}</div><p className="text-slate-400">{text}</p></div>;
}

// ============= PHOTO UPLOAD HELPER =============
function PhotoUpload({ currentPhoto, onPhoto, size = 80 }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Ukuran foto maksimal 2MB"); return; }
    const reader = new FileReader();
    reader.onload = ev => onPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <label className="cursor-pointer relative inline-block" style={{ width: size, height: size }}>
      {currentPhoto ? (
        <img src={currentPhoto} alt="" className="rounded-full object-cover w-full h-full" />
      ) : (
        <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: "rgba(59,130,246,0.1)", border: "2px dashed rgba(59,130,246,0.3)" }}>
          <Camera size={size * 0.3} className="text-blue-400" />
        </div>
      )}
      <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#3b82f6" }}>
        <Camera size={12} color="white" />
      </div>
      <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </label>
  );
}

// ============= ADMIN DASHBOARD =============
function AdminDashboard({ data, dataRef, saveData, user, onLogout, showToast }) {
  const [tab, setTab] = useState("dashboard");
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { id: "teachers", label: "Data Guru", icon: <Users size={18} /> },
    { id: "students", label: "Data Siswa", icon: <GraduationCap size={18} /> },
    { id: "subjects", label: "Mata Pelajaran", icon: <BookOpen size={18} /> },
    { id: "banksoal", label: "Bank Soal", icon: <FileText size={18} /> },
    { id: "exams", label: "Kelola Ujian", icon: <Layers size={18} /> },
    { id: "monitor", label: "Monitoring", icon: <Monitor size={18} /> },
    { id: "results", label: "Hasil Ujian", icon: <BarChart3 size={18} /> },
    { id: "settings", label: "Pengaturan", icon: <Settings size={18} /> },
  ];
  return (
    <DashboardLayout user={user} onLogout={onLogout} tabs={tabs} activeTab={tab} setActiveTab={setTab}>
      {tab === "dashboard" && <AdminHome data={data} />}
      {tab === "teachers" && <TeacherManager data={data} dataRef={dataRef} saveData={saveData} showToast={showToast} />}
      {tab === "students" && <StudentManager data={data} dataRef={dataRef} saveData={saveData} showToast={showToast} />}
      {tab === "subjects" && <SubjectManager data={data} saveData={saveData} showToast={showToast} />}
      {tab === "banksoal" && <QuestionManager data={data} dataRef={dataRef} saveData={saveData} showToast={showToast} />}
      {tab === "exams" && <ExamManager data={data} dataRef={dataRef} saveData={saveData} showToast={showToast} isAdmin />}
      {tab === "monitor" && <MonitorView data={data} />}
      {tab === "results" && <ResultsView data={data} />}
      {tab === "settings" && <SettingsView data={data} dataRef={dataRef} saveData={saveData} showToast={showToast} />}
    </DashboardLayout>
  );
}

function AdminHome({ data }) {
  const activeExams = data.exams.filter(e => e.status === "active").length;
  const activeSessions = (data.sessions || []).filter(s => s.status === "active").length;
  return (
    <div>
      <h2 className="text-white text-2xl font-bold mb-6">Dashboard Admin</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Users size={24} className="text-blue-400" />} label="Total Guru" value={data.teachers.length} />
        <StatCard icon={<GraduationCap size={24} className="text-green-400" />} label="Total Siswa" value={data.students.length} color="#16a34a" />
        <StatCard icon={<FileText size={24} className="text-purple-400" />} label="Bank Soal" value={data.questions.length} color="#9333ea" />
        <StatCard icon={<Play size={24} className="text-amber-400" />} label="Ujian Aktif" value={activeExams} color="#d97706" />
      </div>
      {activeSessions > 0 && (
        <Card className="mb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-400" style={{ animation: "pulse 1.5s infinite" }} />
            <span className="text-green-400 font-semibold">{activeSessions} siswa sedang mengerjakan ujian</span>
          </div>
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        </Card>
      )}
      <Card>
        <h3 className="text-white font-bold mb-3">Ringkasan Mata Pelajaran</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {["Wajib","MIPA","IPS","Bahasa","Lintas Minat"].map(cat => {
            const count = (data.subjects || []).filter(s => s.category === cat).length;
            return count > 0 ? (
              <div key={cat} className="px-3 py-2 rounded-lg" style={{ background: "rgba(59,130,246,0.1)" }}>
                <div className="text-blue-300 text-xs">{cat}</div>
                <div className="text-white font-bold">{count} mapel</div>
              </div>
            ) : null;
          })}
        </div>
      </Card>
    </div>
  );
}

// ============= TEACHER MANAGER =============
function TeacherManager({ data, dataRef, saveData, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", nip: "", email: "", subjects: [], photo: "" });
  const [search, setSearch] = useState("");

  const openAdd = () => { setEditId(null); setForm({ name: "", nip: "", email: "", subjects: [], photo: "" }); setShowModal(true); };
  const openEdit = (t) => { setEditId(t.id); setForm({ name: t.name, nip: t.nip, email: t.email || "", subjects: t.subjects || [], photo: t.photo || "" }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name.trim() || !form.nip.trim()) return showToast("Nama dan NIP wajib diisi", "error");
    const latest = dataRef?.current || data;
    let teachers = [...(latest.teachers || [])];
    if (editId) {
      teachers = teachers.map(t => t.id === editId ? { ...t, ...form } : t);
    } else {
      if (teachers.find(t => t.nip === form.nip)) return showToast("NIP sudah terdaftar", "error");
      teachers.push({ id: genId(), ...form });
    }
    saveData({ ...latest, teachers });
    setShowModal(false);
    showToast(editId ? "Data guru diperbarui" : "Guru berhasil ditambahkan");
  };

  const handleDelete = (id) => {
    if (!confirm("Hapus guru ini?")) return;
    const latest = dataRef?.current || data;
    saveData({ ...latest, teachers: (latest.teachers || []).filter(t => t.id !== id) });
    showToast("Guru dihapus");
  };

  const toggleSubject = (sid) => setForm(f => ({ ...f, subjects: f.subjects.includes(sid) ? f.subjects.filter(s => s !== sid) : [...f.subjects, sid] }));
  const filtered = data.teachers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.nip.includes(search));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-white text-2xl font-bold">Data Guru</h2>
        <Btn onClick={openAdd}><Plus size={16} />Tambah Guru</Btn>
      </div>
      <Card>
        <div className="mb-4 flex items-center rounded-xl px-3" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.2)" }}>
          <Search size={16} className="text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari guru..." className="w-full py-2 px-3 bg-transparent text-white text-sm outline-none placeholder-slate-500" />
        </div>
        {filtered.length === 0 ? <EmptyState icon={<Users size={40} className="mx-auto" />} text="Belum ada data guru" /> : (
          <div className="space-y-2">
            {filtered.map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition">
                <div className="flex items-center gap-3">
                  {t.photo ? <img src={t.photo} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>{t.name[0]}</div>}
                  <div>
                    <div className="text-white font-medium text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs">NIP: {t.nip}{t.email ? ` • ${t.email}` : ""} • {(t.subjects || []).length} mapel{t.password ? " • 🔑 Password custom" : ""}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(t)} className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/10"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(t.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      {showModal && (
        <Modal title={editId ? "Edit Guru" : "Tambah Guru"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div className="flex justify-center">
              <PhotoUpload currentPhoto={form.photo} onPhoto={p => setForm(f => ({ ...f, photo: p }))} size={90} />
            </div>
            <Input label="Nama Lengkap" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Masukkan nama guru" />
            <Input label="NIP" value={form.nip} onChange={e => setForm({ ...form, nip: e.target.value })} placeholder="Masukkan NIP" />
            <Input label="Email (Opsional)" type="email" value={form.email || ""} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="contoh@guru.sch.id" />
            <div>
              <label className="text-blue-300 text-sm font-medium mb-2 block">Mata Pelajaran yang Diampu</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-48 overflow-y-auto pr-1">
                {(data.subjects || []).map(s => (
                  <button key={s.id} onClick={() => toggleSubject(s.id)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-xs transition" style={{ background: form.subjects.includes(s.id) ? "rgba(59,130,246,0.2)" : "rgba(15,23,42,0.5)", color: form.subjects.includes(s.id) ? "#60a5fa" : "#94a3b8" }}>
                    <div className="w-4 h-4 rounded border flex items-center justify-center shrink-0" style={{ borderColor: form.subjects.includes(s.id) ? "#3b82f6" : "#475569", background: form.subjects.includes(s.id) ? "#3b82f6" : "transparent" }}>
                      {form.subjects.includes(s.id) && <CheckCircle size={10} color="white" />}
                    </div>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Btn variant="secondary" onClick={() => setShowModal(false)}>Batal</Btn>
              <Btn onClick={handleSave}><Save size={14} />{editId ? "Perbarui" : "Simpan"}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============= STUDENT MANAGER =============
function StudentManager({ data, dataRef, saveData, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", nisn: "", kelas: KELAS_OPTIONS[0], peminatan: "MIPA", photo: "" });
  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState("all");

  const openAdd = () => { setEditId(null); setForm({ name: "", nisn: "", kelas: KELAS_OPTIONS[0], peminatan: "MIPA", photo: "" }); setShowModal(true); };
  const openEdit = (s) => { setEditId(s.id); setForm({ name: s.name, nisn: s.nisn, kelas: s.kelas, peminatan: s.peminatan || "MIPA", photo: s.photo || "" }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name.trim() || !form.nisn.trim()) return showToast("Nama dan NISN wajib diisi", "error");
    const latest = dataRef?.current || data;
    let students = [...(latest.students || [])];
    if (editId) {
      students = students.map(s => s.id === editId ? { ...s, ...form } : s);
    } else {
      if (students.find(s => s.nisn === form.nisn)) return showToast("NISN sudah terdaftar", "error");
      students.push({ id: genId(), ...form });
    }
    saveData({ ...latest, students });
    setShowModal(false);
    showToast(editId ? "Data siswa diperbarui" : "Siswa berhasil ditambahkan");
  };

  const handleDelete = (id) => {
    if (!confirm("Hapus siswa ini?")) return;
    const latest = dataRef?.current || data;
    saveData({ ...latest, students: (latest.students || []).filter(s => s.id !== id) });
    showToast("Siswa dihapus");
  };

  const filtered = data.students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.nisn.includes(search);
    const matchKelas = filterKelas === "all" || s.kelas === filterKelas;
    return matchSearch && matchKelas;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-white text-2xl font-bold">Data Siswa</h2>
        <Btn onClick={openAdd}><Plus size={16} />Tambah Siswa</Btn>
      </div>
      <Card>
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex-1 min-w-[200px] flex items-center rounded-xl px-3" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.2)" }}>
            <Search size={16} className="text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari siswa..." className="w-full py-2 px-3 bg-transparent text-white text-sm outline-none placeholder-slate-500" />
          </div>
          <select value={filterKelas} onChange={e => setFilterKelas(e.target.value)} className="py-2 px-3 rounded-xl text-white text-sm outline-none" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.2)" }}>
            <option value="all">Semua Kelas</option>
            {KELAS_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div className="text-slate-400 text-xs mb-3">Menampilkan {filtered.length} dari {data.students.length} siswa</div>
        {filtered.length === 0 ? <EmptyState icon={<GraduationCap size={40} className="mx-auto" />} text="Belum ada data siswa" /> : (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filtered.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition">
                <div className="flex items-center gap-3">
                  {s.photo ? <img src={s.photo} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}>{s.name[0]}</div>}
                  <div>
                    <div className="text-white font-medium text-sm">{s.name}</div>
                    <div className="text-slate-400 text-xs">NISN: {s.nisn} • {s.kelas} • {s.peminatan || "-"}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(s)} className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/10"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      {showModal && (
        <Modal title={editId ? "Edit Siswa" : "Tambah Siswa"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div className="flex justify-center">
              <PhotoUpload currentPhoto={form.photo} onPhoto={p => setForm(f => ({ ...f, photo: p }))} size={90} />
            </div>
            <Input label="Nama Lengkap" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Masukkan nama siswa" />
            <Input label="NISN" value={form.nisn} onChange={e => setForm({ ...form, nisn: e.target.value })} placeholder="Masukkan NISN" />
            <Select label="Kelas" value={form.kelas} onChange={e => setForm({ ...form, kelas: e.target.value })}>
              {KELAS_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
            </Select>
            <Select label="Peminatan" value={form.peminatan} onChange={e => setForm({ ...form, peminatan: e.target.value })}>
              <option value="MIPA">MIPA</option>
              <option value="IPS">IPS</option>
              <option value="Bahasa">Bahasa</option>
            </Select>
            <div className="flex justify-end gap-2 pt-2">
              <Btn variant="secondary" onClick={() => setShowModal(false)}>Batal</Btn>
              <Btn onClick={handleSave}><Save size={14} />{editId ? "Perbarui" : "Simpan"}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============= SUBJECT MANAGER =============
function SubjectManager({ data, saveData, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Wajib" });

  const handleAdd = () => {
    if (!form.name.trim()) return showToast("Nama mapel wajib diisi", "error");
    const subjects = [...(data.subjects || []), { id: genId(), ...form }];
    saveData({ ...data, subjects });
    setShowModal(false); setForm({ name: "", category: "Wajib" });
    showToast("Mata pelajaran ditambahkan");
  };

  const handleDelete = (id) => {
    if (!confirm("Hapus mata pelajaran ini?")) return;
    saveData({ ...data, subjects: (data.subjects || []).filter(s => s.id !== id) });
    showToast("Mata pelajaran dihapus");
  };

  const grouped = {};
  (data.subjects || []).forEach(s => { if (!grouped[s.category]) grouped[s.category] = []; grouped[s.category].push(s); });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-white text-2xl font-bold">Mata Pelajaran</h2>
        <div className="flex gap-2">
          <Btn variant="secondary" onClick={() => {
            const merdeka = MAPEL_MERDEKA.filter(m => !(data.subjects || []).find(s => s.id === m.id));
            if (!merdeka.length) return showToast("Semua mapel Merdeka sudah ada", "warning");
            if (!confirm("Tambahkan " + merdeka.length + " mata pelajaran Kurikulum Merdeka?")) return;
            saveData({ ...data, subjects: [...(data.subjects || []), ...merdeka] });
            showToast(merdeka.length + " mapel Kurikulum Merdeka ditambahkan");
          }}><BookOpen size={16} />+ Kurikulum Merdeka</Btn>
          <Btn onClick={() => setShowModal(true)}><Plus size={16} />Tambah Mapel</Btn>
        </div>
      </div>
      {Object.entries(grouped).map(([cat, subjects]) => (
        <Card key={cat} className="mb-4">
          <h3 className="text-blue-300 font-bold text-sm mb-3 uppercase tracking-wider">{cat}</h3>
          <div className="space-y-1">
            {subjects.map(s => (
              <div key={s.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5">
                <div className="flex items-center gap-2"><BookOpen size={14} className="text-blue-400" /><span className="text-white text-sm">{s.name}</span></div>
                <button onClick={() => handleDelete(s.id)} className="p-1 rounded text-red-400 hover:bg-red-500/10"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </Card>
      ))}
      {showModal && (
        <Modal title="Tambah Mata Pelajaran" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <Input label="Nama Mata Pelajaran" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Masukkan nama mapel" />
            <Select label="Kategori" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {["Wajib","MIPA","IPS","Bahasa","Lintas Minat"].map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
            <div className="flex justify-end gap-2 pt-2">
              <Btn variant="secondary" onClick={() => setShowModal(false)}>Batal</Btn>
              <Btn onClick={handleAdd}><Save size={14} />Simpan</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============= QUESTION MANAGER =============
function QuestionManager({ data, dataRef, saveData, showToast, userId }) {
  const [showModal, setShowModal] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterSubject, setFilterSubject] = useState("all");
  const [form, setForm] = useState({ subjectId: "", type: "pilgan", text: "", image: "", options: ["", "", "", "", ""], correctAnswer: 0, explanation: "", rubrik: "" });
  const [filterType, setFilterType] = useState("all");

  const myQuestions = userId ? data.questions.filter(q => q.createdBy === userId) : data.questions;
  const filtered = myQuestions.filter(q => {
    if (filterSubject !== "all" && q.subjectId !== filterSubject) return false;
    if (filterType !== "all" && (q.type || "pilgan") !== filterType) return false;
    return true;
  });

  const openAdd = () => { setEditId(null); setForm({ subjectId: (data.subjects || [])[0]?.id || "", type: "pilgan", text: "", image: "", options: ["", "", "", "", ""], correctAnswer: 0, explanation: "", rubrik: "" }); setShowModal(true); };
  const openEdit = (q) => { setEditId(q.id); setForm({ subjectId: q.subjectId, type: q.type || "pilgan", text: q.text, image: q.image || "", options: q.options?.length ? [...q.options, "", "", ""].slice(0, 5) : ["", "", "", "", ""], correctAnswer: q.correctAnswer || 0, explanation: q.explanation || "", rubrik: q.rubrik || "" }); setShowModal(true); };

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 5 * 1024 * 1024) return showToast("Ukuran file maksimal 5MB", "error");
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, image: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.subjectId || !form.text.trim()) return showToast("Mapel dan teks soal wajib diisi", "error");
    if (form.type === "pilgan") {
      const validOpts = form.options.filter(o => o.trim());
      if (validOpts.length < 2) return showToast("Minimal 2 pilihan jawaban", "error");
    }
    const latest = dataRef?.current || data;
    let questions = [...(latest.questions || [])];
    const qData = {
      ...form,
      options: form.type === "pilgan" ? form.options.filter(o => o.trim()) : [],
      createdBy: userId || "admin",
      type: form.type || "pilgan"
    };
    if (editId) questions = questions.map(q => q.id === editId ? { ...q, ...qData } : q);
    else questions.push({ id: genId(), ...qData });
    saveData({ ...latest, questions });
    setShowModal(false);
    showToast(editId ? "Soal diperbarui" : "Soal berhasil ditambahkan");
  };

  const handleDelete = (id) => {
    if (!confirm("Hapus soal ini?")) return;
    const latest = dataRef?.current || data;
    saveData({ ...latest, questions: (latest.questions || []).filter(q => q.id !== id) });
    showToast("Soal dihapus");
  };

  const handleBulkImport = (importedQuestions) => {
    const latest = dataRef?.current || data;
    const questions = [...(latest.questions || []), ...importedQuestions.map(q => ({ id: genId(), ...q, type: q.type || "pilgan", createdBy: userId || "admin" }))];
    saveData({ ...latest, questions });
    setShowImport(false);
    showToast(`${importedQuestions.length} soal berhasil diimpor`);
  };

  const getSubjectName = (sid) => (data.subjects || []).find(s => s.id === sid)?.name || "-";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-white text-2xl font-bold">Bank Soal</h2>
        <div className="flex gap-2">
          <Btn variant="secondary" onClick={() => setShowImport(true)}><Upload size={16} />Import Word/PDF</Btn>
          <Btn onClick={openAdd}><Plus size={16} />Tambah Soal</Btn>
        </div>
      </div>
      <Card>
        <div className="mb-4 flex flex-wrap gap-2">
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="py-2 px-3 rounded-xl text-white text-sm outline-none" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.2)" }}>
            <option value="all">Semua Mata Pelajaran</option>
            {(data.subjects || []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="py-2 px-3 rounded-xl text-white text-sm outline-none" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.2)" }}>
            <option value="all">Semua Tipe</option>
            <option value="pilgan">Pilihan Ganda</option>
            <option value="esai">Esai</option>
            <option value="uraian">Uraian</option>
            <option value="benar_salah">Benar/Salah</option>
          </select>
        </div>
        <div className="text-slate-400 text-xs mb-3">{filtered.length} soal</div>
        {filtered.length === 0 ? <EmptyState icon={<FileText size={40} className="mx-auto" />} text="Belum ada soal" /> : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {filtered.map((q, i) => (
              <div key={q.id} className="p-3 rounded-xl" style={{ background: "rgba(15,23,42,0.5)" }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1"><span className="text-blue-400 text-xs">{getSubjectName(q.subjectId)}</span><span className="px-1.5 py-0.5 rounded text-xs" style={{ background: q.type === "esai" ? "rgba(168,85,247,0.2)" : q.type === "uraian" ? "rgba(20,184,166,0.2)" : q.type === "benar_salah" ? "rgba(234,179,8,0.2)" : "rgba(59,130,246,0.2)", color: q.type === "esai" ? "#c084fc" : q.type === "uraian" ? "#2dd4bf" : q.type === "benar_salah" ? "#fbbf24" : "#60a5fa" }}>{q.type === "esai" ? "Esai" : q.type === "uraian" ? "Uraian" : q.type === "benar_salah" ? "Benar/Salah" : "Pilihan Ganda"}</span></div>
                    <div className="text-white text-sm mb-2">{i + 1}. {q.text.substring(0, 150)}{q.text.length > 150 ? "..." : ""}</div>
                    {q.image && <img src={q.image} alt="" className="max-h-24 rounded-lg mb-2" />}
                    <div className="flex flex-wrap gap-1">
                      {q.options.map((o, oi) => (
                        <span key={oi} className="px-2 py-0.5 rounded text-xs" style={{ background: oi === q.correctAnswer ? "rgba(22,163,74,0.2)" : "rgba(51,65,85,0.5)", color: oi === q.correctAnswer ? "#4ade80" : "#94a3b8" }}>
                          {String.fromCharCode(65 + oi)}. {o.substring(0, 30)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(q)} className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(q.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {showImport && <ImportSoalModal data={data} onImport={handleBulkImport} onClose={() => setShowImport(false)} showToast={showToast} />}

      {showModal && (
        <Modal title={editId ? "Edit Soal" : "Tambah Soal"} onClose={() => setShowModal(false)} wide>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Mata Pelajaran" value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })}>
                <option value="">-- Pilih Mapel --</option>
                {(data.subjects || []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
              <Select label="Tipe Soal" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="pilgan">Pilihan Ganda</option>
                <option value="esai">Esai</option>
                <option value="uraian">Uraian</option>
                <option value="benar_salah">Benar / Salah</option>
              </Select>
            </div>
            <div>
              <label className="text-blue-300 text-sm font-medium mb-1 block">Teks Soal</label>
              <textarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} rows={4} placeholder="Masukkan teks soal..." className="w-full py-2.5 px-3 rounded-xl text-white text-sm outline-none resize-none placeholder-slate-500" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.25)" }} />
            </div>
            <div>
              <label className="text-blue-300 text-sm font-medium mb-1 block">Gambar Soal (Opsional)</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 text-blue-400 hover:bg-blue-500/10 transition" style={{ border: "1px dashed rgba(59,130,246,0.4)" }}>
                  <Upload size={16} />Pilih Gambar
                  <input type="file" accept="image/jpeg,image/png" onChange={handleImageUpload} className="hidden" />
                </label>
                {form.image && (
                  <div className="relative">
                    <img src={form.image} alt="" className="h-16 rounded-lg" />
                    <button onClick={() => setForm(f => ({ ...f, image: "" }))} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"><X size={10} color="white" /></button>
                  </div>
                )}
              </div>
            </div>
            {(form.type === "pilgan") && (
              <div>
                <label className="text-blue-300 text-sm font-medium mb-2 block">Pilihan Jawaban</label>
                {form.options.map((o, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <button onClick={() => setForm(f => ({ ...f, correctAnswer: i }))} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition" style={{ background: form.correctAnswer === i ? "#16a34a" : "rgba(51,65,85,0.5)", color: "white" }}>
                      {String.fromCharCode(65 + i)}
                    </button>
                    <input value={o} onChange={e => { const opts = [...form.options]; opts[i] = e.target.value; setForm({ ...form, options: opts }); }} placeholder={`Pilihan ${String.fromCharCode(65 + i)}`} className="flex-1 py-2 px-3 rounded-xl text-white text-sm outline-none placeholder-slate-500" style={{ background: "rgba(15,23,42,0.8)", border: `1px solid ${form.correctAnswer === i ? "rgba(22,163,74,0.5)" : "rgba(59,130,246,0.25)"}` }} />
                  </div>
                ))}
                <p className="text-slate-500 text-xs mt-1">Klik huruf untuk menandai jawaban benar (hijau)</p>
              </div>
            )}
            {form.type === "benar_salah" && (
              <div>
                <label className="text-blue-300 text-sm font-medium mb-2 block">Jawaban Benar</label>
                <div className="flex gap-3">
                  {["Benar", "Salah"].map((opt, i) => (
                    <button key={opt} onClick={() => setForm(f => ({ ...f, correctAnswer: i, options: ["Benar", "Salah"] }))} className="px-6 py-2 rounded-xl text-sm font-bold transition" style={{ background: form.correctAnswer === i ? "#16a34a" : "rgba(51,65,85,0.5)", color: "white" }}>{opt}</button>
                  ))}
                </div>
              </div>
            )}
            {(form.type === "esai" || form.type === "uraian") && (
              <div>
                <label className="text-blue-300 text-sm font-medium mb-1 block">Kunci Jawaban / Model Jawaban</label>
                <textarea value={form.explanation} onChange={e => setForm({ ...form, explanation: e.target.value })} rows={4} placeholder="Tulis kunci jawaban atau model jawaban yang diharapkan..." className="w-full py-2.5 px-3 rounded-xl text-white text-sm outline-none resize-none placeholder-slate-500" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.25)" }} />
                <div className="mt-3">
                  <label className="text-blue-300 text-sm font-medium mb-1 block">Rubrik Penilaian (Opsional)</label>
                  <textarea value={form.rubrik || ""} onChange={e => setForm({ ...form, rubrik: e.target.value })} rows={3} placeholder="Contoh: Skor 4: jawaban lengkap dan benar, Skor 3: benar tapi kurang lengkap..." className="w-full py-2.5 px-3 rounded-xl text-white text-sm outline-none resize-none placeholder-slate-500" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.25)" }} />
                </div>
              </div>
            )}
            {form.type === "pilgan" && (
              <div>
                <label className="text-blue-300 text-sm font-medium mb-1 block">Pembahasan (Opsional)</label>
                <textarea value={form.explanation} onChange={e => setForm({ ...form, explanation: e.target.value })} rows={2} placeholder="Tulis pembahasan..." className="w-full py-2.5 px-3 rounded-xl text-white text-sm outline-none resize-none placeholder-slate-500" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.25)" }} />
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Btn variant="secondary" onClick={() => setShowModal(false)}>Batal</Btn>
              <Btn onClick={handleSave}><Save size={14} />{editId ? "Perbarui" : "Simpan"}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============= IMPORT SOAL MODAL (Word/PDF) =============
function ImportSoalModal({ data, onImport, onClose, showToast }) {
  const [step, setStep] = useState("upload"); // upload | preview | done
  const [subjectId, setSubjectId] = useState((data.subjects || [])[0]?.id || "");
  const [rawText, setRawText] = useState("");
  const [parsed, setParsed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answerText, setAnswerText] = useState("");

  const loadMammoth = async () => {
    if (window.mammoth) return window.mammoth;
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js";
      s.onload = () => resolve(window.mammoth);
      s.onerror = () => reject(new Error("Gagal memuat mammoth.js"));
      document.head.appendChild(s);
    });
  };

  const handleFile = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setLoading(true);
    try {
      if (file.name.endsWith(".docx")) {
        const mammoth = await loadMammoth();
        const ab = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: ab });
        setRawText(result.value);
      } else if (file.name.endsWith(".txt")) {
        const text = await file.text();
        setRawText(text);
      } else {
        showToast("Format tidak didukung. Gunakan .docx atau .txt", "error");
      }
    } catch (err) {
      showToast("Gagal membaca file: " + err.message, "error");
    }
    setLoading(false);
  };

  const parseQuestions = () => {
    if (!rawText.trim()) return showToast("Tidak ada teks untuk diparse", "error");
    const lines = rawText.split("\n").map(l => l.trim()).filter(Boolean);
    const questions = [];
    let current = null;

    // Parse answer key from answerText
    const answerMap = {};
    if (answerText.trim()) {
      const ansLines = answerText.split("\n").map(l => l.trim()).filter(Boolean);
      ansLines.forEach(l => {
        const m = l.match(/(\d+)\s*[.)\-:\s]\s*([A-Ea-e])/);
        if (m) answerMap[parseInt(m[1])] = m[2].toUpperCase().charCodeAt(0) - 65;
      });
    }

    let qNum = 0;
    lines.forEach(line => {
      // Detect question: starts with number. or number)
      const qMatch = line.match(/^(\d+)[.)]\s+(.+)/);
      if (qMatch) {
        if (current && current.options.length >= 2) questions.push(current);
        qNum = parseInt(qMatch[1]);
        current = { subjectId, text: qMatch[2], options: [], correctAnswer: answerMap[qNum] ?? 0, explanation: "" };
        return;
      }
      // Detect option: A. or A) or (A)
      const optMatch = line.match(/^[(\s]*([A-Ea-e])[.)]\s+(.+)/);
      if (optMatch && current) {
        current.options.push(optMatch[2]);
        return;
      }
      // Continue question text
      if (current && current.options.length === 0) {
        current.text += " " + line;
      }
    });
    if (current && current.options.length >= 2) questions.push(current);

    if (questions.length === 0) return showToast("Tidak ada soal yang terdeteksi. Pastikan format: '1. Pertanyaan' dan 'A. Pilihan'", "error");
    setParsed(questions);
    setStep("preview");
  };

  return (
    <Modal title="Import Soal dari Dokumen" onClose={onClose} wide>
      {step === "upload" && (
        <div className="space-y-4">
          <Select label="Mata Pelajaran" value={subjectId} onChange={e => setSubjectId(e.target.value)}>
            {(data.subjects || []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <div>
            <label className="text-blue-300 text-sm font-medium mb-1 block">File Soal (.docx atau .txt)</label>
            <label className="cursor-pointer flex flex-col items-center justify-center gap-2 p-8 rounded-xl transition" style={{ border: "2px dashed rgba(59,130,246,0.4)", background: "rgba(15,23,42,0.5)" }}>
              <Upload size={32} className="text-blue-400" />
              <span className="text-blue-300 font-medium">{loading ? "Membaca file..." : "Klik untuk pilih file"}</span>
              <span className="text-slate-500 text-xs">Format: .docx, .txt</span>
              <input type="file" accept=".docx,.txt" onChange={handleFile} className="hidden" disabled={loading} />
            </label>
          </div>
          {rawText && (
            <div>
              <label className="text-blue-300 text-sm font-medium mb-1 block">Preview teks ({rawText.length} karakter)</label>
              <div className="p-3 rounded-xl text-slate-300 text-xs overflow-y-auto max-h-32" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.2)", whiteSpace: "pre-wrap" }}>
                {rawText.substring(0, 500)}...
              </div>
            </div>
          )}
          <div>
            <label className="text-blue-300 text-sm font-medium mb-1 block">Kunci Jawaban (opsional, format: "1. A", "2. B", ...)</label>
            <textarea value={answerText} onChange={e => setAnswerText(e.target.value)} rows={4} placeholder={"1. A\n2. C\n3. B\n4. E\n..."} className="w-full py-2.5 px-3 rounded-xl text-white text-sm outline-none resize-none placeholder-slate-500" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.25)" }} />
          </div>
          <div className="flex justify-end gap-2">
            <Btn variant="secondary" onClick={onClose}>Batal</Btn>
            <Btn onClick={parseQuestions} disabled={!rawText || loading}><CheckCircle size={14} />Parse Soal Otomatis</Btn>
          </div>
        </div>
      )}

      {step === "preview" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-green-400 font-semibold">{parsed.length} soal terdeteksi</div>
            <Btn variant="secondary" onClick={() => setStep("upload")}><ArrowLeft size={14} />Kembali</Btn>
          </div>
          <div className="space-y-3 max-h-[50vh] overflow-y-auto mb-4">
            {parsed.map((q, i) => (
              <div key={i} className="p-3 rounded-xl" style={{ background: "rgba(15,23,42,0.5)" }}>
                <div className="text-white text-sm font-medium mb-1">{i+1}. {q.text.substring(0, 100)}</div>
                <div className="flex flex-wrap gap-1">
                  {q.options.map((o, oi) => (
                    <span key={oi} className="px-2 py-0.5 rounded text-xs" style={{ background: oi === q.correctAnswer ? "rgba(22,163,74,0.2)" : "rgba(51,65,85,0.5)", color: oi === q.correctAnswer ? "#4ade80" : "#94a3b8" }}>
                      {String.fromCharCode(65+oi)}. {o.substring(0,30)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Btn variant="secondary" onClick={() => setStep("upload")}><ArrowLeft size={14} />Edit</Btn>
            <Btn variant="success" onClick={() => onImport(parsed)}><Download size={14} />Import {parsed.length} Soal</Btn>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ============= EXAM MANAGER =============
function ExamManager({ data, dataRef, saveData, showToast, isAdmin, userId }) {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: "", subjectId: "", targetKelas: [], duration: 90, startTime: "", endTime: "", shuffleQuestions: true, shuffleOptions: false, showResult: true, questionIds: [] });

  const openAdd = () => {
    setEditId(null);
    const now = new Date(); const later = new Date(now.getTime() + 2 * 3600000);
    setForm({ title: "", subjectId: (data.subjects || [])[0]?.id || "", targetKelas: [], duration: 90, startTime: now.toISOString().slice(0, 16), endTime: later.toISOString().slice(0, 16), shuffleQuestions: true, shuffleOptions: false, showResult: true, questionIds: [] });
    setShowModal(true);
  };
  const openEdit = (ex) => { setEditId(ex.id); setForm({ ...ex }); setShowModal(true); };

  const availableQuestions = useMemo(() => {
    if (!form.subjectId) return [];
    return data.questions.filter(q => q.subjectId === form.subjectId);
  }, [form.subjectId, data.questions]);

  const toggleQuestion = (qid) => setForm(f => ({ ...f, questionIds: f.questionIds.includes(qid) ? f.questionIds.filter(x => x !== qid) : [...f.questionIds, qid] }));
  const toggleKelas = (k) => setForm(f => ({ ...f, targetKelas: f.targetKelas.includes(k) ? f.targetKelas.filter(x => x !== k) : [...f.targetKelas, k] }));

  const handleSave = () => {
    if (!form.title.trim() || !form.subjectId) return showToast("Judul dan mapel wajib diisi", "error");
    if (form.questionIds.length === 0) return showToast("Pilih minimal 1 soal", "error");
    if (form.targetKelas.length === 0) return showToast("Pilih minimal 1 kelas", "error");
    const latest = dataRef?.current || data;
    let exams = [...(latest.exams || [])];
    const examData = { ...form, status: editId ? (exams.find(e => e.id === editId)?.status || "draft") : "draft", createdBy: userId || "admin" };
    if (editId) exams = exams.map(e => e.id === editId ? { ...e, ...examData } : e);
    else exams.push({ id: genId(), ...examData });
    saveData({ ...latest, exams });
    setShowModal(false);
    showToast(editId ? "Ujian diperbarui" : "Ujian berhasil dibuat");
  };

  const toggleStatus = (examId, newStatus) => {
    const latest = dataRef?.current || data;
    const exams = latest.exams.map(e => e.id === examId ? { ...e, status: newStatus } : e);
    saveData({ ...latest, exams });
    showToast(`Ujian ${newStatus === "active" ? "diaktifkan" : newStatus === "ended" ? "diakhiri" : "di-draft-kan"}`);
  };

  const handleDelete = (id) => {
    if (!confirm("Hapus ujian ini?")) return;
    const latest = dataRef?.current || data;
    const exams = latest.exams.filter(e => e.id !== id);
    saveData({ ...latest, exams });
    showToast("Ujian dihapus");
  };

  const getSubjectName = (sid) => (data.subjects || []).find(s => s.id === sid)?.name || "-";
  const myExams = isAdmin ? data.exams : data.exams.filter(e => e.createdBy === userId);
  const statusColors = { draft: { bg: "rgba(100,116,139,0.2)", text: "#94a3b8" }, active: { bg: "rgba(22,163,74,0.2)", text: "#4ade80" }, ended: { bg: "rgba(220,38,38,0.2)", text: "#f87171" } };
  const statusLabels = { draft: "Draft", active: "Aktif", ended: "Selesai" };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-white text-2xl font-bold">Kelola Ujian</h2>
        <Btn onClick={openAdd}><Plus size={16} />Buat Ujian</Btn>
      </div>
      {myExams.length === 0 ? <Card><EmptyState icon={<FileText size={40} className="mx-auto" />} text="Belum ada ujian" /></Card> : (
        <div className="space-y-3">
          {myExams.map(ex => {
            const sessions = (data.sessions || []).filter(s => s.examId === ex.id);
            const active = sessions.filter(s => s.status === "active").length;
            const done = sessions.filter(s => s.status === "submitted").length;
            return (
              <Card key={ex.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-white font-bold text-base">{ex.title}</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: statusColors[ex.status]?.bg, color: statusColors[ex.status]?.text }}>{statusLabels[ex.status]}</span>
                    </div>
                    <div className="text-slate-400 text-sm space-y-0.5">
                      <div>{getSubjectName(ex.subjectId)} • {ex.questionIds.length} soal • {ex.duration} menit</div>
                      <div>Kelas: {ex.targetKelas?.join(", ") || "-"}</div>
                      <div>Mulai: {new Date(ex.startTime).toLocaleString("id-ID")} — Selesai: {new Date(ex.endTime).toLocaleString("id-ID")}</div>
                      {ex.status === "active" && <div className="text-blue-400 text-xs">{active} mengerjakan • {done} selesai</div>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {ex.status === "draft" && <Btn variant="success" onClick={() => toggleStatus(ex.id, "active")}><Play size={14} />Aktifkan</Btn>}
                    {ex.status === "active" && <Btn variant="danger" onClick={() => toggleStatus(ex.id, "ended")}><Square size={14} />Akhiri</Btn>}
                    {ex.status === "ended" && <Btn variant="secondary" onClick={() => toggleStatus(ex.id, "draft")}><RefreshCw size={14} />Draft</Btn>}
                    <button onClick={() => openEdit(ex)} className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/10"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(ex.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10"><Trash2 size={16} /></button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      {showModal && (
        <Modal title={editId ? "Edit Ujian" : "Buat Ujian Baru"} onClose={() => setShowModal(false)} wide>
          <div className="space-y-4">
            <Input label="Judul Ujian" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="cth: Ujian Akhir Semester Matematika" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Mata Pelajaran" value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value, questionIds: [] })}>
                {(data.subjects || []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
              <Input label="Durasi (menit)" type="number" value={form.duration} onChange={e => setForm({ ...form, duration: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Waktu Mulai" type="datetime-local" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} />
              <Input label="Waktu Selesai" type="datetime-local" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} />
            </div>
            <div>
              <label className="text-blue-300 text-sm font-medium mb-2 block">Kelas Peserta</label>
              <div className="flex flex-wrap gap-1">
                {KELAS_OPTIONS.map(k => (
                  <button key={k} onClick={() => toggleKelas(k)} className="px-3 py-1 rounded-lg text-xs font-medium transition" style={{ background: form.targetKelas.includes(k) ? "rgba(59,130,246,0.3)" : "rgba(51,65,85,0.3)", color: form.targetKelas.includes(k) ? "#60a5fa" : "#94a3b8", border: `1px solid ${form.targetKelas.includes(k) ? "rgba(59,130,246,0.4)" : "transparent"}` }}>
                    {k}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-blue-300 text-sm font-medium mb-2 block">Pilih Soal ({form.questionIds.length} dipilih dari {availableQuestions.length} tersedia)</label>
              {availableQuestions.length === 0 ? (
                <p className="text-slate-500 text-sm">Belum ada soal untuk mapel ini.</p>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <button onClick={() => setForm(f => ({ ...f, questionIds: f.questionIds.length === availableQuestions.length ? [] : availableQuestions.map(q => q.id) }))} className="text-blue-400 text-xs hover:underline mb-1">
                    {form.questionIds.length === availableQuestions.length ? "Batalkan Semua" : "Pilih Semua"}
                  </button>
                  {availableQuestions.map((q, i) => (
                    <button key={q.id} onClick={() => toggleQuestion(q.id)} className="w-full text-left flex items-start gap-2 px-3 py-2 rounded-lg transition text-sm" style={{ background: form.questionIds.includes(q.id) ? "rgba(59,130,246,0.15)" : "rgba(15,23,42,0.4)" }}>
                      <div className="w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5" style={{ borderColor: form.questionIds.includes(q.id) ? "#3b82f6" : "#475569", background: form.questionIds.includes(q.id) ? "#3b82f6" : "transparent" }}>
                        {form.questionIds.includes(q.id) && <CheckCircle size={12} color="white" />}
                      </div>
                      <span className="text-white">{i + 1}. {q.text.substring(0, 80)}{q.text.length > 80 ? "..." : ""}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-4">
              {[["shuffleQuestions", "Acak urutan soal"], ["shuffleOptions", "Acak pilihan jawaban"], ["showResult", "Tampilkan hasil ke siswa"]].map(([k, label]) => (
                <label key={k} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form[k]} onChange={e => setForm({ ...form, [k]: e.target.checked })} className="w-4 h-4 rounded" />
                  <span className="text-slate-300 text-sm">{label}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Btn variant="secondary" onClick={() => setShowModal(false)}>Batal</Btn>
              <Btn onClick={handleSave}><Save size={14} />{editId ? "Perbarui" : "Buat Ujian"}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============= MONITOR VIEW =============
function MonitorView({ data }) {
  const [selectedExam, setSelectedExam] = useState(null);
  const [, forceUpdate] = useState(0);
  useEffect(() => { const iv = setInterval(() => forceUpdate(n => n + 1), 2000); return () => clearInterval(iv); }, []);

  const activeExams = useMemo(() => data.exams.filter(e => e.status === "active"), [data.exams]);

  if (selectedExam) {
    const exam = data.exams.find(e => e.id === selectedExam);
    if (!exam) return null;
    const sessions = (data.sessions || []).filter(s => s.examId === selectedExam);
    const targetStudents = data.students.filter(s => exam.targetKelas?.includes(s.kelas));
    const totalQ = exam.questionIds.length;

    return (
      <div>
        <button onClick={() => setSelectedExam(null)} className="flex items-center gap-2 text-blue-400 mb-4 hover:underline"><ArrowLeft size={16} />Kembali</button>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-white text-2xl font-bold">{exam.title}</h2>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: "rgba(22,163,74,0.15)" }}><div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: "pulse 1.5s infinite" }} /><span className="text-green-400 text-xs font-medium">LIVE</span></div>
        </div>
        <p className="text-slate-400 text-sm mb-4">Update otomatis setiap 2 detik</p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
          <StatCard icon={<Users size={20} className="text-blue-400" />} label="Total Peserta" value={targetStudents.length} />
          <StatCard icon={<Play size={20} className="text-green-400" />} label="Sedang Mengerjakan" value={sessions.filter(s => s.status === "active").length} color="#16a34a" />
          <StatCard icon={<CheckCircle size={20} className="text-amber-400" />} label="Selesai" value={sessions.filter(s => s.status === "submitted").length} color="#d97706" />
          <StatCard icon={<AlertTriangle size={20} className="text-red-400" />} label="Belum Mulai" value={Math.max(0, targetStudents.length - sessions.length)} color="#dc2626" />
        </div>
        <Card>
          <h3 className="text-white font-bold mb-3">Status Peserta Real-time</h3>
          <div className="space-y-2 max-h-[55vh] overflow-y-auto">
            {targetStudents.sort((a, b) => {
              const sa = sessions.find(s => s.studentId === a.id);
              const sb = sessions.find(s => s.studentId === b.id);
              const order = { active: 0, submitted: 1, undefined: 2 };
              return (order[sa?.status] ?? 2) - (order[sb?.status] ?? 2);
            }).map(st => {
              const session = sessions.find(s => s.studentId === st.id);
              const answered = Object.keys(session?.answers || {}).length;
              let statusText = "Belum mulai", statusColor = "#64748b", bgColor = "rgba(15,23,42,0.4)";
              if (session?.status === "active") { statusText = `Mengerjakan (${answered}/${totalQ})`; statusColor = "#3b82f6"; bgColor = "rgba(59,130,246,0.05)"; }
              else if (session?.status === "submitted") { statusText = "Selesai"; statusColor = "#16a34a"; bgColor = "rgba(22,163,74,0.05)"; }
              const violations = session?.violations || 0;
              const lastUpdate = session?.lastUpdate ? Math.round((Date.now() - session.lastUpdate) / 1000) : null;
              return (
                <div key={st.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: bgColor }}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: statusColor }} />
                    <div>
                      <div className="text-white text-sm font-medium">{st.name}</div>
                      <div className="text-slate-400 text-xs">{st.kelas} • NISN: {st.nisn}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <div className="text-xs font-medium" style={{ color: statusColor }}>{statusText}</div>
                      {session?.status === "active" && lastUpdate !== null && (
                        <div className="text-slate-500 text-xs">{lastUpdate}s lalu</div>
                      )}
                    </div>
                    {violations > 0 && <div className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg" style={{ background: "rgba(220,38,38,0.2)", color: "#f87171" }}><AlertTriangle size={12} />⚠️ {violations}x pelanggaran</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        {/* Progress bar */}
        <Card className="mt-4">
          <h3 className="text-white font-bold mb-3">Progress Keseluruhan</h3>
          <div className="space-y-2">
            {[
              { label: "Selesai", count: sessions.filter(s => s.status === "submitted").length, color: "#16a34a", bg: "#16a34a" },
              { label: "Sedang mengerjakan", count: sessions.filter(s => s.status === "active").length, color: "#3b82f6", bg: "#3b82f6" },
              { label: "Belum mulai", count: targetStudents.length - sessions.length, color: "#64748b", bg: "#64748b" },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{item.label}</span><span>{item.count} siswa ({targetStudents.length > 0 ? Math.round(item.count/targetStudents.length*100) : 0}%)</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(51,65,85,0.5)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${targetStudents.length > 0 ? (item.count/targetStudents.length*100) : 0}%`, background: item.bg }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-white text-2xl font-bold mb-5">Monitoring Real-time</h2>
      {activeExams.length === 0 ? <Card><EmptyState icon={<Monitor size={40} className="mx-auto" />} text="Tidak ada ujian aktif" /></Card> : (
        <div className="space-y-3">
          {activeExams.map(ex => {
            const sessions = (data.sessions || []).filter(s => s.examId === ex.id);
            const targetCount = data.students.filter(s => ex.targetKelas?.includes(s.kelas)).length;
            return (
              <Card key={ex.id} className="cursor-pointer hover:border-blue-500/40 transition" onClick={() => setSelectedExam(ex.id)}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold">{ex.title}</h3>
                    <div className="text-slate-400 text-sm">{(data.subjects || []).find(s => s.id === ex.subjectId)?.name} • {ex.questionIds.length} soal • {ex.duration} menit</div>
                    <div className="flex gap-4 mt-2">
                      <span className="text-green-400 text-xs font-medium">{sessions.filter(s => s.status === "active").length} mengerjakan</span>
                      <span className="text-amber-400 text-xs font-medium">{sessions.filter(s => s.status === "submitted").length} selesai</span>
                      <span className="text-slate-400 text-xs">{targetCount} total peserta</span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-400" />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============= RESULTS VIEW =============
function ResultsView({ data }) {
  const [selectedExam, setSelectedExam] = useState(null);
  const [printing, setPrinting] = useState(false);

  // Show ALL exams that have at least 1 result, regardless of status
  const examsWithData = data.exams.filter(e =>
    (data.results || []).some(r => r.examId === e.id) || e.status === "ended"
  ).sort((a, b) => {
    const ra = (data.results || []).filter(r => r.examId === a.id).length;
    const rb = (data.results || []).filter(r => r.examId === b.id).length;
    return rb - ra;
  });

  const handlePrint = (exam, results) => {
    const subjectName = (data.subjects || []).find(s => s.id === exam?.subjectId)?.name || "";
    const totalQ = exam?.questionIds?.length || 0;
    const avg = results.length > 0 ? (results.reduce((a, r) => a + r.score, 0) / results.length).toFixed(1) : 0;

    const printContent = `
      <!DOCTYPE html><html><head>
      <title>Laporan Hasil Ujian - ${exam?.title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #000; }
        h1 { text-align: center; font-size: 16px; margin-bottom: 2px; }
        h2 { text-align: center; font-size: 14px; color: #333; margin-bottom: 16px; }
        .info { margin-bottom: 16px; font-size: 12px; }
        .info table { border-collapse: collapse; width: 100%; max-width: 400px; }
        .info td { padding: 3px 8px; }
        .info td:first-child { font-weight: bold; width: 160px; }
        table.results { width: 100%; border-collapse: collapse; font-size: 12px; }
        table.results th { background: #1e3a5f; color: white; padding: 6px 8px; text-align: left; }
        table.results td { padding: 5px 8px; border-bottom: 1px solid #ddd; }
        table.results tr:nth-child(even) { background: #f5f5f5; }
        .pass { color: green; font-weight: bold; }
        .fail { color: red; font-weight: bold; }
        .summary { margin-top: 16px; font-size: 12px; border-top: 2px solid #333; padding-top: 8px; }
        @media print { body { margin: 10px; } }
      </style></head><body>
      <h1>${SCHOOL_NAME}</h1>
      <h2>Laporan Hasil Ujian</h2>
      <div class="info"><table>
        <tr><td>Mata Ujian</td><td>: ${exam?.title}</td></tr>
        <tr><td>Mata Pelajaran</td><td>: ${subjectName}</td></tr>
        <tr><td>Jumlah Soal</td><td>: ${totalQ} soal</td></tr>
        <tr><td>Jumlah Peserta</td><td>: ${results.length} siswa</td></tr>
        <tr><td>Tanggal Cetak</td><td>: ${new Date().toLocaleDateString("id-ID", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}</td></tr>
      </table></div>
      <table class="results">
        <thead><tr><th>No</th><th>Nama Siswa</th><th>Kelas</th><th>Benar</th><th>Nilai</th><th>Ket.</th></tr></thead>
        <tbody>
          ${results.sort((a, b) => b.score - a.score).map((r, i) => {
            const student = data.students.find(s => s.id === r.studentId);
            return `<tr>
              <td>${i+1}</td>
              <td>${student?.name || "?"}</td>
              <td>${student?.kelas || "-"}</td>
              <td>${r.correct}/${totalQ}</td>
              <td><strong>${r.score.toFixed(1)}</strong></td>
              <td>${r.score === null ? 'Perlu Dinilai' : r.score.toFixed(1)}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
      <div class="summary">
        <strong>Rata-rata: ${avg}</strong> &nbsp;|&nbsp;
        Tertinggi: ${results.length > 0 ? Math.max(...results.map(r => r.score)).toFixed(1) : "-"} &nbsp;|&nbsp;
        Terendah: ${results.length > 0 ? Math.min(...results.map(r => r.score)).toFixed(1) : "-"} &nbsp;|&nbsp;
        ≥75: ${results.filter(r => r.score !== null && r.score >= 75).length} siswa &nbsp;|&nbsp;
        &lt;75: ${results.filter(r => r.score !== null && r.score < 75).length} siswa
      </div>
      </body></html>`;

    const w = window.open("", "_blank");
    w.document.write(printContent);
    w.document.close();
    w.onload = () => { w.print(); };
  };

  if (selectedExam) {
    const exam = data.exams.find(e => e.id === selectedExam);
    const results = (data.results || []).filter(r => r.examId === selectedExam);
    const totalQ = exam?.questionIds?.length || 0;
    const avg = results.length > 0 ? (results.reduce((a, r) => a + r.score, 0) / results.length).toFixed(1) : "-";

    return (
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <button onClick={() => setSelectedExam(null)} className="flex items-center gap-2 text-blue-400 hover:underline"><ArrowLeft size={16} />Kembali</button>
          <Btn variant="secondary" onClick={() => handlePrint(exam, results)}><Printer size={16} />Cetak Laporan PDF</Btn>
        </div>
        <h2 className="text-white text-2xl font-bold mb-1">{exam?.title} — Hasil</h2>
        <p className="text-slate-400 text-sm mb-4">{(data.subjects || []).find(s => s.id === exam?.subjectId)?.name} • {results.length} peserta</p>
        {results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <StatCard icon={<Users size={20} className="text-blue-400" />} label="Peserta" value={results.length} />
            <StatCard icon={<Award size={20} className="text-green-400" />} label="Rata-rata" value={avg} color="#16a34a" />
            <StatCard icon={<CheckCircle size={20} className="text-amber-400" />} label="Di Atas 75" value={results.filter(r => r.score !== null && r.score >= 75).length} color="#d97706" />
            <StatCard icon={<XCircle size={20} className="text-red-400" />} label="Di Bawah 75" value={results.filter(r => r.score !== null && r.score < 75).length} color="#dc2626" />
          </div>
        )}
        <Card>
          {results.length === 0 ? <EmptyState icon={<BarChart3 size={40} className="mx-auto" />} text="Belum ada hasil" /> : (
            <div>
              <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs text-slate-400 font-semibold uppercase">
                <div className="col-span-1">No</div>
                <div className="col-span-4">Nama</div>
                <div className="col-span-2">Kelas</div>
                <div className="col-span-2">Benar</div>
                <div className="col-span-3">Nilai</div>
              </div>
              {results.sort((a, b) => (b.score || 0) - (a.score || 0)).map((r, i) => {
                const student = data.students.find(s => s.id === r.studentId);
                const scoreNull = r.score === null || r.score === undefined;
                return (
                  <div key={r.id} className="grid grid-cols-12 gap-2 px-3 py-2 rounded-lg items-center hover:bg-white/5" style={{ background: i % 2 === 0 ? "rgba(15,23,42,0.4)" : "transparent" }}>
                    <div className="col-span-1 text-slate-400 text-sm">{i + 1}</div>
                    <div className="col-span-4 text-white text-sm font-medium">{student?.name || "?"}</div>
                    <div className="col-span-2 text-slate-400 text-sm">{student?.kelas || "-"}</div>
                    <div className="col-span-2 text-slate-300 text-sm">{r.correct||0}/{totalQ}{r.hasEssay ? "+" : ""}</div>
                    <div className="col-span-3">
                      {scoreNull ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(168,85,247,0.2)", color: "#c084fc" }}>Perlu Dinilai</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: r.score >= 75 ? "rgba(22,163,74,0.2)" : r.score >= 50 ? "rgba(217,119,6,0.2)" : "rgba(220,38,38,0.2)", color: r.score >= 75 ? "#4ade80" : r.score >= 50 ? "#fbbf24" : "#f87171" }}>
                          {r.score.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="pt-3 mt-2 px-3" style={{ borderTop: "1px solid rgba(59,130,246,0.15)" }}>
                <div className="text-slate-400 text-sm">
                  Rata-rata: <span className="text-white font-bold">{avg}</span> &nbsp;|&nbsp;
                  Tertinggi: <span className="text-green-400 font-bold">{Math.max(...results.map(r => r.score)).toFixed(1)}</span> &nbsp;|&nbsp;
                  Terendah: <span className="text-red-400 font-bold">{Math.min(...results.map(r => r.score)).toFixed(1)}</span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  const handleDownloadAllPDF = () => {
    const allRows = examsWithData.map(ex => {
      const results = (data.results || []).filter(r => r.examId === ex.id);
      const avg = results.length > 0 ? (results.reduce((a, r) => a + (r.score || 0), 0) / results.length).toFixed(1) : "-";
      return { ex, results, avg };
    });
    const printContent = `<!DOCTYPE html><html><head><title>Rekap Semua Hasil Ujian</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; color: #000; font-size: 12px; }
      h1 { text-align: center; font-size: 16px; } h2 { font-size: 13px; margin-top: 20px; border-bottom: 2px solid #333; padding-bottom: 4px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px; }
      th { background: #1e3a5f; color: white; padding: 5px 6px; text-align: left; }
      td { padding: 4px 6px; border-bottom: 1px solid #ddd; }
      tr:nth-child(even) { background: #f5f5f5; }
      .pass { color: green; font-weight: bold; } .fail { color: red; font-weight: bold; }
      @media print { body { margin: 8px; } }
    </style></head><body>
    <h1>${SCHOOL_NAME}</h1>
    <p style="text-align:center;margin-bottom:16px">Rekap Hasil Ujian — Dicetak: ${new Date().toLocaleDateString("id-ID",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
    ${allRows.map(({ ex, results, avg }) => {
      const subj = (data.subjects || []).find(s => s.id === ex.subjectId)?.name || "";
      const totalQ = ex.questionIds?.length || 0;
      return `<h2>${ex.title} <span style="font-weight:normal;font-size:11px;color:#666">(${subj} • ${results.length} peserta • Rata-rata: ${avg})</span></h2>
      <table><thead><tr><th>No</th><th>Nama Siswa</th><th>Kelas</th><th>Benar</th><th>Nilai</th><th>Ket.</th></tr></thead><tbody>
      ${results.sort((a, b) => (b.score || 0) - (a.score || 0)).map((r, i) => {
        const st = data.students.find(s => s.id === r.studentId);
        const scoreDisplay = r.score === null ? "Belum dinilai" : r.score.toFixed(1);
        const ket = r.score === null ? "Perlu Dinilai" : `${r.score.toFixed(1)}`;
        const cls = "";
        return `<tr><td>${i+1}</td><td>${st?.name||"?"}</td><td>${st?.kelas||"-"}</td><td>${r.correct||0}/${totalQ}</td><td><strong>${scoreDisplay}</strong></td><td class="${cls}">${ket}</td></tr>`;
      }).join("")}
      </tbody></table>`;
    }).join("")}
    </body></html>`;
    const w = window.open("", "_blank");
    w.document.write(printContent);
    w.document.close();
    w.onload = () => w.print();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-white text-2xl font-bold">Hasil Ujian</h2>
        {examsWithData.length > 0 && <Btn variant="secondary" onClick={handleDownloadAllPDF}><Download size={16} />Download Semua PDF</Btn>}
      </div>
      {examsWithData.length === 0 ? <Card><EmptyState icon={<BarChart3 size={40} className="mx-auto" />} text="Belum ada hasil ujian" /></Card> : (
        <div className="space-y-3">
          {examsWithData.map(ex => {
            const results = (data.results || []).filter(r => r.examId === ex.id);
            const avg = results.length > 0 ? (results.reduce((a, r) => a + r.score, 0) / results.length).toFixed(1) : "-";
            const passCount = results.filter(r => r.score >= 75).length;
            return (
              <Card key={ex.id} className="cursor-pointer hover:border-blue-500/40 transition" onClick={() => setSelectedExam(ex.id)}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold">{ex.title}</h3>
                    <div className="text-slate-400 text-sm">{(data.subjects || []).find(s => s.id === ex.subjectId)?.name}</div>
                    <div className="flex gap-4 mt-1">
                      <span className="text-blue-400 text-xs">{results.length} peserta</span>
                      <span className="text-white text-xs">Rata-rata: <strong>{avg}</strong></span>
                      {results.length > 0 && <span className="text-blue-400 text-xs">≥75: {passCount}/{results.length}</span>}
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-400" />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============= SETTINGS (ADMIN) =============
function SettingsView({ data, dataRef, saveData, showToast }) {
  const [pw, setPw] = useState({ old: "", new1: "", new2: "" });
  const handleChangePw = () => {
    const latest = dataRef?.current || data;
    if (pw.old !== latest.admin.password) return showToast("Password lama salah", "error");
    if (pw.new1.length < 4) return showToast("Password baru minimal 4 karakter", "error");
    if (pw.new1 !== pw.new2) return showToast("Konfirmasi password tidak cocok", "error");
    // Only update admin field — preserve ALL other data
    saveData({ ...latest, admin: { ...latest.admin, password: pw.new1 } });
    setPw({ old: "", new1: "", new2: "" });
    showToast("Password admin berhasil diubah");
  };

  return (
    <div>
      <h2 className="text-white text-2xl font-bold mb-5">Pengaturan</h2>
      <Card className="mb-4">
        <h3 className="text-white font-bold mb-4">Ubah Password Admin</h3>
        <div className="space-y-3 max-w-md">
          <Input label="Password Lama" type="password" value={pw.old} onChange={e => setPw({ ...pw, old: e.target.value })} />
          <Input label="Password Baru" type="password" value={pw.new1} onChange={e => setPw({ ...pw, new1: e.target.value })} />
          <Input label="Konfirmasi Password Baru" type="password" value={pw.new2} onChange={e => setPw({ ...pw, new2: e.target.value })} />
          <Btn onClick={handleChangePw}><Save size={14} />Simpan Password</Btn>
        </div>
      </Card>
      <Card className="mb-4">
        <h3 className="text-white font-bold mb-2">Informasi Sistem</h3>
        <div className="text-slate-300 text-sm space-y-1">
          <p>Sekolah: {SCHOOL_NAME}</p>
          <p>Kurikulum: K-13 & Merdeka Belajar</p>
          <p>Total Guru: {data.teachers.length} | Total Siswa: {data.students.length}</p>
          <p>Total Soal: {data.questions.length} | Total Ujian: {data.exams.length}</p>
        </div>
      </Card>
      <Card>
        <h3 className="text-red-400 font-bold mb-2">Zona Bahaya</h3>
        <p className="text-slate-400 text-sm mb-3">Reset seluruh data ke kondisi awal. Tidak dapat dibatalkan.</p>
        <Btn variant="danger" onClick={() => { if (!confirm("PERINGATAN: Ini akan menghapus SEMUA data!")) return; if (!confirm("Yakin benar-benar ingin reset?")) return; saveData(DEFAULT_DATA); showToast("Data telah direset"); }}><AlertTriangle size={14} />Reset Semua Data</Btn>
      </Card>
    </div>
  );
}

// ============= TEACHER DASHBOARD =============
function TeacherDashboard({ data, dataRef, saveData, user, onLogout, showToast, updateUserSession }) {
  const [tab, setTab] = useState("dashboard");
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { id: "questions", label: "Bank Soal", icon: <FileText size={18} /> },
    { id: "exams", label: "Kelola Ujian", icon: <Layers size={18} /> },
    { id: "monitor", label: "Monitoring", icon: <Monitor size={18} /> },
    { id: "results", label: "Hasil Ujian", icon: <BarChart3 size={18} /> },
    { id: "profile", label: "Profil & Sandi", icon: <User size={18} /> },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout} tabs={tabs} activeTab={tab} setActiveTab={setTab}>
      {tab === "dashboard" && (
        <div>
          <h2 className="text-white text-2xl font-bold mb-6">Dashboard Guru</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard icon={<FileText size={24} className="text-blue-400" />} label="Soal Saya" value={data.questions.filter(q => q.createdBy === user.id).length} />
            <StatCard icon={<Layers size={24} className="text-purple-400" />} label="Ujian Saya" value={data.exams.filter(e => e.createdBy === user.id).length} color="#9333ea" />
            <StatCard icon={<BookOpen size={24} className="text-green-400" />} label="Mapel Diampu" value={(user.subjects || []).length} color="#16a34a" />
          </div>
          <Card>
            <h3 className="text-white font-bold mb-3">Mata Pelajaran Anda</h3>
            <div className="flex flex-wrap gap-2">
              {(user.subjects || []).map(sid => {
                const subj = (data.subjects || []).find(s => s.id === sid);
                return subj ? <span key={sid} className="px-3 py-1 rounded-lg text-sm" style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}>{subj.name}</span> : null;
              })}
              {(user.subjects || []).length === 0 && <p className="text-slate-500 text-sm">Belum ada mapel yang ditetapkan. Hubungi admin.</p>}
            </div>
          </Card>
        </div>
      )}
      {tab === "questions" && <QuestionManager data={data} dataRef={dataRef} saveData={saveData} showToast={showToast} userId={user.id} />}
      {tab === "exams" && <ExamManager data={data} dataRef={dataRef} saveData={saveData} showToast={showToast} userId={user.id} />}
      {tab === "monitor" && <MonitorView data={data} />}
      {tab === "results" && <ResultsView data={data} />}
      {tab === "profile" && <TeacherProfile data={data} saveData={saveData} user={user} showToast={showToast} updateUserSession={updateUserSession} />}
    </DashboardLayout>
  );
}

// ============= TEACHER PROFILE =============
function TeacherProfile({ data, saveData, user, showToast, updateUserSession }) {
  const [pw, setPw] = useState({ old: "", new1: "", new2: "" });
  const [photo, setPhoto] = useState(user.photo || "");

  const currentPassword = user.password || user.nip;

  const handleChangePw = () => {
    if (pw.old !== currentPassword) return showToast("Password/NIP lama salah", "error");
    if (pw.new1.length < 4) return showToast("Password baru minimal 4 karakter", "error");
    if (pw.new1 !== pw.new2) return showToast("Konfirmasi tidak cocok", "error");
    const teachers = data.teachers.map(t => t.id === user.id ? { ...t, password: pw.new1 } : t);
    saveData({ ...data, teachers });
    const updatedUser = { ...user, password: pw.new1 };
    updateUserSession(updatedUser);
    setPw({ old: "", new1: "", new2: "" });
    showToast("Password berhasil diubah");
  };

  const handleSavePhoto = () => {
    const teachers = data.teachers.map(t => t.id === user.id ? { ...t, photo } : t);
    saveData({ ...data, teachers });
    updateUserSession({ ...user, photo });
    showToast("Foto profil disimpan");
  };

  return (
    <div>
      <h2 className="text-white text-2xl font-bold mb-5">Profil & Keamanan</h2>
      <Card className="mb-4">
        <h3 className="text-white font-bold mb-4">Foto Profil</h3>
        <div className="flex items-center gap-6">
          <PhotoUpload currentPhoto={photo} onPhoto={setPhoto} size={100} />
          <div>
            <p className="text-white font-semibold">{user.name}</p>
            <p className="text-slate-400 text-sm">NIP: {user.nip}</p>
            <p className="text-slate-400 text-sm">{(user.subjects || []).length} mata pelajaran</p>
            <Btn className="mt-3" onClick={handleSavePhoto}><Save size={14} />Simpan Foto</Btn>
          </div>
        </div>
      </Card>
      <Card>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Key size={18} />Ubah Password Login</h3>
        <p className="text-slate-400 text-sm mb-4">Password default adalah NIP Anda. Ubah untuk keamanan lebih baik.</p>
        <div className="space-y-3 max-w-md">
          <Input label="Password / NIP Lama" type="password" value={pw.old} onChange={e => setPw({ ...pw, old: e.target.value })} placeholder="Masukkan password atau NIP lama" />
          <Input label="Password Baru" type="password" value={pw.new1} onChange={e => setPw({ ...pw, new1: e.target.value })} placeholder="Minimal 4 karakter" />
          <Input label="Konfirmasi Password Baru" type="password" value={pw.new2} onChange={e => setPw({ ...pw, new2: e.target.value })} placeholder="Ulangi password baru" />
          <Btn onClick={handleChangePw}><Save size={14} />Simpan Password</Btn>
        </div>
      </Card>
    </div>
  );
}

// ============= STUDENT DASHBOARD =============
function StudentDashboard({ data, dataRef, saveData, user, onLogout, showToast, updateUserSession }) {
  const [activeExam, setActiveExam] = useState(null);
  const [tab, setTab] = useState("exams");

  if (activeExam) {
    return <ExamTaker data={data} dataRef={dataRef} saveData={saveData} user={user} exam={activeExam} onFinish={() => { setActiveExam(null); setTab("results"); }} showToast={showToast} />;
  }

  const now = new Date();
  const availableExams = data.exams.filter(e => {
    if (e.status !== "active") return false;
    if (!e.targetKelas?.includes(user.kelas)) return false;
    if (now > new Date(e.endTime)) return false;
    return !(data.results || []).find(r => r.examId === e.id && r.studentId === user.id);
  });

  const myResults = (data.results || []).filter(r => r.studentId === user.id);
  const resumableSessions = (data.sessions || []).filter(s => s.studentId === user.id && s.status === "active" && data.exams.find(e => e.id === s.examId && e.status === "active"));

  const tabs = [
    { id: "exams", label: "Ujian Tersedia", icon: <FileText size={18} /> },
    { id: "results", label: "Hasil Saya", icon: <Award size={18} /> },
    { id: "profile", label: "Profil Saya", icon: <User size={18} /> },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout} tabs={tabs} activeTab={tab} setActiveTab={setTab}>
      {tab === "exams" && (
        <div>
          <h2 className="text-white text-2xl font-bold mb-2">Selamat Datang, {user.name}</h2>
          <p className="text-slate-400 mb-6">Kelas {user.kelas} • NISN: {user.nisn}</p>

          {/* Resume section */}
          {resumableSessions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-amber-400 font-bold text-lg mb-3 flex items-center gap-2"><AlertTriangle size={18} />Ujian Belum Selesai</h3>
              <div className="space-y-3">
                {resumableSessions.map(session => {
                  const exam = data.exams.find(e => e.id === session.examId);
                  if (!exam) return null;
                  const answered = Object.keys(session.answers || {}).length;
                  return (
                    <Card key={session.id} style={{ border: "1px solid rgba(217,119,6,0.3)", background: "rgba(30,41,59,0.9)" }}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h4 className="text-white font-bold">{exam.title}</h4>
                          <div className="text-slate-400 text-sm">{answered}/{exam.questionIds.length} soal dijawab</div>
                          <div className="text-amber-400 text-xs mt-1">Ujian masih aktif — lanjutkan sekarang!</div>
                        </div>
                        <Btn variant="warning" onClick={() => setActiveExam(exam)}><Play size={14} />Lanjutkan Ujian</Btn>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          <h3 className="text-white font-bold text-lg mb-3">Ujian Tersedia</h3>
          {availableExams.length === 0 ? <Card className="mb-6"><EmptyState icon={<FileText size={40} className="mx-auto" />} text="Tidak ada ujian tersedia saat ini" /></Card> : (
            <div className="space-y-3 mb-6">
              {availableExams.map(ex => (
                <Card key={ex.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-white font-bold">{ex.title}</h4>
                      <div className="text-slate-400 text-sm">{(data.subjects || []).find(s => s.id === ex.subjectId)?.name} • {ex.questionIds.length} soal • {ex.duration} menit</div>
                      <div className="text-blue-400 text-xs mt-1">Berakhir: {new Date(ex.endTime).toLocaleString("id-ID")}</div>
                    </div>
                    <Btn onClick={() => {
                      if (confirm(`Mulai ujian "${ex.title}"?\n\nDurasi: ${ex.duration} menit\nJumlah soal: ${ex.questionIds.length}\n\nSetelah dimulai, Anda tidak dapat keluar dari ujian.`)) {
                        setActiveExam(ex);
                      }
                    }}><Play size={14} />Mulai Ujian</Btn>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "results" && (
        <div>
          <h2 className="text-white text-2xl font-bold mb-5">Riwayat Ujian Saya</h2>
          {myResults.length === 0 ? <Card><EmptyState icon={<Award size={40} className="mx-auto" />} text="Belum ada hasil ujian" /></Card> : (
            <div className="space-y-3">
              {myResults.sort((a, b) => b.submittedAt - a.submittedAt).map(r => {
                const exam = data.exams.find(e => e.id === r.examId);
                const subject = (data.subjects || []).find(s => s.id === exam?.subjectId);
                return (
                  <Card key={r.id}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold">{exam?.title || "Ujian"}</div>
                        <div className="text-slate-400 text-sm">{subject?.name} • {r.correct}/{exam?.questionIds?.length || 0} benar</div>
                        {r.submittedAt && <div className="text-slate-500 text-xs mt-0.5">{new Date(r.submittedAt).toLocaleString("id-ID")}</div>}
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full text-lg font-bold" style={{ background: r.score >= 75 ? "rgba(22,163,74,0.2)" : r.score >= 50 ? "rgba(217,119,6,0.2)" : "rgba(220,38,38,0.2)", color: r.score >= 75 ? "#4ade80" : r.score >= 50 ? "#fbbf24" : "#f87171" }}>
                          {r.score.toFixed(1)}
                        </span>

                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "profile" && <StudentProfile data={data} saveData={saveData} user={user} showToast={showToast} updateUserSession={updateUserSession} />}
    </DashboardLayout>
  );
}

// ============= STUDENT PROFILE =============
function StudentProfile({ data, saveData, user, showToast, updateUserSession }) {
  const [photo, setPhoto] = useState(user.photo || "");

  const handleSavePhoto = () => {
    const students = data.students.map(s => s.id === user.id ? { ...s, photo } : s);
    saveData({ ...data, students });
    updateUserSession({ ...user, photo });
    showToast("Foto profil disimpan");
  };

  const myResults = (data.results || []).filter(r => r.studentId === user.id);
  const avg = myResults.length > 0 ? (myResults.reduce((a, r) => a + r.score, 0) / myResults.length).toFixed(1) : "-";
  const best = myResults.length > 0 ? Math.max(...myResults.map(r => r.score)).toFixed(1) : "-";

  return (
    <div>
      <h2 className="text-white text-2xl font-bold mb-5">Profil Saya</h2>
      <Card className="mb-4">
        <div className="flex items-center gap-6 flex-wrap">
          <PhotoUpload currentPhoto={photo} onPhoto={setPhoto} size={100} />
          <div className="flex-1">
            <p className="text-white font-bold text-xl">{user.name}</p>
            <p className="text-slate-400">NISN: {user.nisn}</p>
            <p className="text-slate-400">{user.kelas} — {user.peminatan}</p>
            <Btn className="mt-3" onClick={handleSavePhoto}><Save size={14} />Simpan Foto</Btn>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Award size={24} className="text-blue-400" />} label="Ujian Dikerjakan" value={myResults.length} />
        <StatCard icon={<BarChart3 size={24} className="text-green-400" />} label="Nilai Rata-rata" value={avg} color="#16a34a" />
        <StatCard icon={<CheckCircle size={24} className="text-amber-400" />} label="Nilai Terbaik" value={best} color="#d97706" />
      </div>
    </div>
  );
}

// ============= EXAM TAKER (STUDENT) =============
function ExamTaker({ data, dataRef, saveData, user, exam, onFinish, showToast }) {
  // Check for existing session to resume
  const existingSession = useMemo(() => (data.sessions || []).find(s => s.examId === exam.id && s.studentId === user.id && s.status === "active"), []);

  const questions = useMemo(() => {
    let qs = exam.questionIds.map(id => data.questions.find(q => q.id === id)).filter(Boolean);
    if (exam.shuffleQuestions && !existingSession) {
      const shuffled = [...qs];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      qs = shuffled;
    }
    return qs;
  }, [exam, existingSession]);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(existingSession?.answers || {});
  const [timeLeft, setTimeLeft] = useState(() => {
    if (existingSession?.timeLeft) return existingSession.timeLeft;
    return exam.duration * 60;
  });
  const [violations, setViolations] = useState(existingSession?.violations || 0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [showNav, setShowNav] = useState(false);

  // Timer
  useEffect(() => {
    if (submitted) return;
    const iv = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(iv); handleSubmit(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [submitted]);

  // Anti-cheat: tab visibility
  useEffect(() => {
    if (submitted) return;
    const handler = () => {
      if (document.hidden) setViolations(v => { const nv = v + 1; showToast(`Pelanggaran! (${nv}x) — Jangan berpindah tab`, "warning"); return nv; });
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [submitted, showToast]);

  // Fullscreen
  useEffect(() => {
    if (submitted) return;
    try { document.documentElement.requestFullscreen?.(); } catch {}
    const handler = () => {
      if (!document.fullscreenElement && !submitted) {
        setViolations(v => v + 1);
        showToast("Keluar dari fullscreen terdeteksi!", "warning");
        try { document.documentElement.requestFullscreen?.(); } catch {}
      }
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [submitted, showToast]);

  // Prevent copy/paste
  useEffect(() => {
    if (submitted) return;
    const prevent = e => e.preventDefault();
    const preventKeys = e => {
      if ((e.ctrlKey || e.metaKey) && ["c","v","a","p","s","u"].includes(e.key.toLowerCase())) e.preventDefault();
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey)) e.preventDefault();
    };
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("copy", prevent);
    document.addEventListener("keydown", preventKeys);
    return () => { document.removeEventListener("contextmenu", prevent); document.removeEventListener("copy", prevent); document.removeEventListener("keydown", preventKeys); };
  }, [submitted]);

  // Use refs for latest values to avoid stale closure in interval
  const answersRef = useRef(answers);
  const violationsRef = useRef(violations);
  const timeLeftRef = useRef(timeLeft);
  const submittedRef = useRef(submitted);
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { violationsRef.current = violations; }, [violations]);
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);
  useEffect(() => { submittedRef.current = submitted; }, [submitted]);

  // Save session every 3 seconds — uses refs so always has fresh data
  useEffect(() => {
    if (submitted) return;

    const saveSession = async () => {
      if (submittedRef.current) return;
      // CRITICAL: always read from dataRef (latest global data) not stale closure
      const currentData = dataRef?.current || data;
      if (!currentData) return;
      const sessions = [...(currentData.sessions || [])];
      const idx = sessions.findIndex(s => s.examId === exam.id && s.studentId === user.id);
      const sessionData = {
        examId: exam.id, studentId: user.id,
        answers: { ...answersRef.current },
        status: "active",
        violations: violationsRef.current,
        timeLeft: timeLeftRef.current,
        lastUpdate: Date.now()
      };
      if (idx >= 0) sessions[idx] = { ...sessions[idx], ...sessionData };
      else sessions.push({ id: genId(), ...sessionData });

      // Write sessions directly to avoid overwriting other data with stale state
      const nextData = { ...currentData, sessions };
      saveData(nextData);
    };

    saveSession(); // immediate on mount/answer change
    const iv = setInterval(saveSession, 3000);
    return () => clearInterval(iv);
  }, [submitted]); // only re-register when submitted changes

  // Also save immediately when answer changes (separate effect, uses ref)
  useEffect(() => {
    answersRef.current = answers;
    // Debounced save on answer change
    const t = setTimeout(() => {
      if (!submittedRef.current) {
        const currentData = dataRef?.current || data;
        if (!currentData) return;
        const sessions = [...(currentData.sessions || [])];
        const idx = sessions.findIndex(s => s.examId === exam.id && s.studentId === user.id);
        const sessionData = {
          examId: exam.id, studentId: user.id,
          answers: { ...answers },
          status: "active",
          violations: violationsRef.current,
          timeLeft: timeLeftRef.current,
          lastUpdate: Date.now()
        };
        if (idx >= 0) sessions[idx] = { ...sessions[idx], ...sessionData };
        else sessions.push({ id: genId(), ...sessionData });
        saveData({ ...currentData, sessions });
      }
    }, 800);
    return () => clearTimeout(t);
  }, [answers]);

  const handleSubmit = useCallback((auto = false) => {
    if (submittedRef.current) return;
    if (!auto && !confirm("Yakin ingin mengumpulkan jawaban? Tidak dapat diubah setelah ini.")) return;
    submittedRef.current = true;
    setSubmitted(true);
    try { document.exitFullscreen?.(); } catch {}

    // Use refs to get latest values (avoid stale closure)
    const finalAnswers = answersRef.current;
    const finalViolations = violationsRef.current;

    let correct = 0;
    let pilganCount = 0;
    questions.forEach((q, i) => {
      const type = q.type || "pilgan";
      if (type === "pilgan" || type === "benar_salah") {
        pilganCount++;
        if (finalAnswers[i] === q.correctAnswer) correct++;
      }
      // essay/uraian: marked as "answered" if non-empty, scored by teacher later
    });
    const hasEssay = questions.some(q => q.type === "esai" || q.type === "uraian");
    const score = pilganCount > 0 ? (correct / pilganCount) * 100 : (hasEssay ? null : 0);
    const resultData = { id: genId(), examId: exam.id, studentId: user.id, answers: { ...finalAnswers }, correct, pilganCount, score, hasEssay, needsGrading: hasEssay, violations: finalViolations, submittedAt: Date.now() };
    setResult(resultData);

    // Use dataRef to get the absolute latest data
    const currentData = dataRef?.current || data;
    const results = [...(currentData.results || []).filter(r => !(r.examId === exam.id && r.studentId === user.id)), resultData];
    const sessions = (currentData.sessions || []).map(s => s.examId === exam.id && s.studentId === user.id ? { ...s, status: "submitted" } : s);
    saveData({ ...currentData, results, sessions });
    showToast(auto ? "Waktu habis! Jawaban dikumpulkan otomatis." : "Jawaban berhasil dikumpulkan!");
  }, [questions, exam, user, data, saveData, showToast]);

  const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (submitted && result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
        <Card className="w-full max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: result.score >= 75 ? "rgba(22,163,74,0.2)" : result.score >= 50 ? "rgba(217,119,6,0.2)" : "rgba(220,38,38,0.2)" }}>
            <Award size={40} style={{ color: result.score >= 75 ? "#4ade80" : result.score >= 50 ? "#fbbf24" : "#f87171" }} />
          </div>
          <h2 className="text-white text-2xl font-bold mb-1">Ujian Selesai!</h2>
          <p className="text-slate-400 mb-4">{exam.title}</p>
          {exam.showResult ? (
            <div className="space-y-3 mb-6">
              <div className="text-6xl font-bold" style={{ color: result.score >= 75 ? "#4ade80" : result.score >= 50 ? "#fbbf24" : "#f87171" }}>{result.score.toFixed(1)}</div>
              <div className="text-slate-300">Benar: {result.correct} dari {questions.length} soal</div>

              {violations > 0 && <div className="text-red-400 text-sm flex items-center justify-center gap-1"><AlertTriangle size={14} />Pelanggaran: {violations}x</div>}
            </div>
          ) : (
            <div className="mb-6"><p className="text-slate-300">Jawaban telah dikumpulkan. Nilai akan diumumkan oleh guru.</p></div>
          )}
          <Btn className="mx-auto" onClick={onFinish}><Home size={14} />Kembali ke Dashboard</Btn>
        </Card>
      </div>
    );
  }

  const q = questions[currentQ];
  if (!q) return null;

  return (
    <div className="min-h-screen select-none" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", userSelect: "none" }}>
      {/* Header */}
      <div className="sticky top-0 z-50 px-4 py-2 flex items-center justify-between" style={{ background: "rgba(15,23,42,0.98)", borderBottom: "1px solid rgba(59,130,246,0.2)" }}>
        <div className="flex items-center gap-3">
          <Shield size={18} className="text-blue-400" />
          <div>
            <div className="text-white text-xs font-bold truncate max-w-[180px]">{exam.title}</div>
            <div className="text-slate-400 text-[10px]">Soal {currentQ + 1}/{questions.length} • {user.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-mono font-bold ${timeLeft <= 300 ? "text-red-400" : timeLeft <= 600 ? "text-amber-400" : "text-green-400"}`} style={{ background: timeLeft <= 300 ? "rgba(220,38,38,0.15)" : timeLeft <= 600 ? "rgba(217,119,6,0.15)" : "rgba(22,163,74,0.15)" }}>
            <Clock size={14} />{formatTime(timeLeft)}
          </div>
          <button onClick={() => setShowNav(!showNav)} className="p-2 rounded-lg text-slate-400 hover:text-white" style={{ background: "rgba(51,65,85,0.5)" }}>
            <Hash size={16} />
          </button>
        </div>
      </div>

      {/* Navigation Drawer */}
      {showNav && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowNav(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 p-4 overflow-y-auto" style={{ background: "#1e293b" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Navigasi Soal</h3>
              <button onClick={() => setShowNav(false)} className="text-slate-400"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {questions.map((_, i) => (
                <button key={i} onClick={() => { setCurrentQ(i); setShowNav(false); }} className="w-full aspect-square rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: answers[i] !== undefined ? (i === currentQ ? "#2563eb" : "rgba(22,163,74,0.4)") : (i === currentQ ? "#2563eb" : "rgba(51,65,85,0.5)"), color: "white" }}>
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="space-y-1 text-xs text-slate-400 mb-4">
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{ background: "rgba(22,163,74,0.4)" }} />Dijawab ({Object.values(answers).filter(v => v !== undefined && v !== "").length})</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{ background: "rgba(51,65,85,0.5)" }} />Belum ({questions.length - Object.values(answers).filter(v => v !== undefined && v !== "").length})</div>
            </div>
            <Btn variant="success" className="w-full justify-center" onClick={() => { setShowNav(false); handleSubmit(); }}><CheckCircle size={14} />Kumpulkan Jawaban</Btn>
          </div>
        </div>
      )}

      {/* Question Content */}
      <div className="max-w-3xl mx-auto p-4">
        {existingSession && <div className="mb-3 px-3 py-2 rounded-lg text-amber-400 text-xs flex items-center gap-2" style={{ background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.2)" }}><RefreshCw size={12} />Melanjutkan ujian yang tersimpan</div>}
        <Card className="mb-4">
          <div className="text-blue-400 text-xs font-medium mb-2">Soal {currentQ + 1} dari {questions.length}</div>
          <div className="text-white text-base leading-relaxed mb-3" style={{ whiteSpace: "pre-wrap" }}>{q.text}</div>
          {q.image && <img src={q.image} alt="Gambar soal" className="max-w-full rounded-xl mb-3" style={{ maxHeight: "300px" }} />}
        </Card>
        {/* Answer input based on question type */}
        <div className="mb-6">
          {(!q.type || q.type === "pilgan") && (
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => setAnswers(a => ({ ...a, [currentQ]: i }))} className="w-full text-left flex items-start gap-3 p-4 rounded-xl transition-all" style={{ background: answers[currentQ] === i ? "rgba(59,130,246,0.2)" : "rgba(30,41,59,0.8)", border: `2px solid ${answers[currentQ] === i ? "#3b82f6" : "rgba(59,130,246,0.1)"}` }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: answers[currentQ] === i ? "#3b82f6" : "rgba(51,65,85,0.5)", color: "white" }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="text-white text-sm pt-1">{opt}</span>
                </button>
              ))}
            </div>
          )}
          {q.type === "benar_salah" && (
            <div className="flex gap-3">
              {["Benar", "Salah"].map((opt, i) => (
                <button key={opt} onClick={() => setAnswers(a => ({ ...a, [currentQ]: i }))} className="flex-1 py-4 rounded-xl text-base font-bold transition-all" style={{ background: answers[currentQ] === i ? (i === 0 ? "rgba(22,163,74,0.3)" : "rgba(220,38,38,0.3)") : "rgba(30,41,59,0.8)", border: `2px solid ${answers[currentQ] === i ? (i === 0 ? "#16a34a" : "#dc2626") : "rgba(59,130,246,0.1)"}`, color: answers[currentQ] === i ? (i === 0 ? "#4ade80" : "#f87171") : "white" }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
          {(q.type === "esai" || q.type === "uraian") && (
            <div>
              <label className="text-blue-300 text-sm mb-2 block">{q.type === "esai" ? "Tulis esai kamu di bawah ini:" : "Tulis uraian jawaban kamu:"}</label>
              <textarea
                value={answers[currentQ] || ""}
                onChange={e => setAnswers(a => ({ ...a, [currentQ]: e.target.value }))}
                rows={8}
                placeholder="Ketik jawaban kamu di sini..."
                className="w-full py-3 px-4 rounded-xl text-white text-sm outline-none resize-none placeholder-slate-500"
                style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.3)", lineHeight: "1.6" }}
              />
              <div className="text-slate-500 text-xs mt-1 text-right">{(answers[currentQ] || "").length} karakter</div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-3">
          <Btn variant="secondary" onClick={() => setCurrentQ(c => Math.max(0, c - 1))} disabled={currentQ === 0}><ArrowLeft size={14} />Sebelumnya</Btn>
          {currentQ === questions.length - 1 ? (
            <Btn variant="success" onClick={() => handleSubmit()}><CheckCircle size={14} />Kumpulkan</Btn>
          ) : (
            <Btn onClick={() => setCurrentQ(c => Math.min(questions.length - 1, c + 1))}>Selanjutnya<ChevronRight size={14} /></Btn>
          )}
        </div>
        <div className="mt-4 rounded-full h-2 overflow-hidden" style={{ background: "rgba(51,65,85,0.5)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%`, background: "linear-gradient(90deg, #3b82f6, #16a34a)" }} />
        </div>
        <div className="text-center text-slate-400 text-xs mt-1">{Object.values(answers).filter(v => v !== undefined && v !== "").length}/{questions.length} soal dijawab</div>
      </div>
      {violations > 0 && (
        <div className="fixed bottom-4 left-4 flex items-center gap-2 px-3 py-2 rounded-xl text-xs" style={{ background: "rgba(220,38,38,0.2)", color: "#f87171", border: "1px solid rgba(220,38,38,0.3)" }}>
          <AlertTriangle size={14} />Pelanggaran terdeteksi: {violations}x
        </div>
      )}
    </div>
  );
}
