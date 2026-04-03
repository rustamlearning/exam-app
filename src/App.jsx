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

// ============= GRANULAR STORE =============
const COLS = ["meta","teachers","students","subjects","questions","exams","sessions","results"];

const store = {
  async getCol(col) {
    try {
      const snap = await getDoc(doc(db, "examapp2", col));
      return snap.exists() ? snap.data().value : null;
    } catch(e) { console.error("getCol", col, e); return null; }
  },
  async setCol(col, val) {
    if (val === undefined) return;
    try { await setDoc(doc(db, "examapp2", col), { value: val, ts: Date.now() }); }
    catch(e) { console.error("setCol", col, e); throw e; }
  },
  listenCol(col, cb) {
    return onSnapshot(
      doc(db, "examapp2", col),
      snap => { if (snap.exists()) cb(snap.data().value, snap.metadata); },
      err => console.error("listenCol", col, err)
    );
  }
};

const DEFAULT_DATA = {
  meta: { admin: { username: "admin", password: "admin123" } },
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
    bg: isDark ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)",
    card: isDark ? "rgba(30,41,59,0.9)" : "rgba(255,255,255,0.98)",
    cardBorder: isDark ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.25)",
    text: isDark ? "#f1f5f9" : "#0f172a",
    textSub: isDark ? "#94a3b8" : "#334155",
    textMuted: isDark ? "#64748b" : "#475569",
    sidebar: isDark ? "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)" : "linear-gradient(180deg, #1e3a5f 0%, #1e2d5a 100%)",
    input: isDark ? "rgba(15,23,42,0.8)" : "rgba(248,250,252,0.95)",
    inputBorder: isDark ? "rgba(59,130,246,0.25)" : "rgba(59,130,246,0.4)",
    inputText: isDark ? "#f1f5f9" : "#0f172a",
    rowAlt: isDark ? "rgba(15,23,42,0.4)" : "rgba(241,245,249,0.8)",
    itemHover: isDark ? "rgba(255,255,255,0.05)" : "rgba(59,130,246,0.06)",
    navActive: isDark ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.15)",
    navText: isDark ? "#60a5fa" : "#1d4ed8",
    badge: isDark ? "rgba(51,65,85,0.8)" : "rgba(226,232,240,0.9)",
  };
  const lastSaveRef = useRef(0);
  const isWritingRef = useRef(false);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const unsubsRef = useRef([]);
  const writeTimesRef = useRef({});

  useEffect(() => {
    (async () => {
      // 1. Instant cache load
      const cached = ls.get(CACHE_KEY);
      if (cached && (cached.teachers || cached.questions || cached.exams)) {
        setData({ ...DEFAULT_DATA, ...cached });
        setLoading(false);
      }

      // 2. Load all collections in parallel
      try {
        const vals = await Promise.all(COLS.map(col => store.getCol(col)));
        const d = {
          meta: vals[0] || DEFAULT_DATA.meta,
          teachers: vals[1] || [],
          students: vals[2] || [],
          subjects: vals[3]?.length ? vals[3] : MAPEL_K13,
          questions: vals[4] || [],
          exams: vals[5] || [],
          sessions: vals[6] || [],
          results: vals[7] || [],
        };
        setData(d);
        setLoading(false);
        ls.set(CACHE_KEY, d);
        ls.set(BACKUP_KEY, d);
        COLS.forEach((col, i) => {
          if (vals[i] === null) {
            const def = col === "subjects" ? MAPEL_K13 : col === "meta" ? DEFAULT_DATA.meta : [];
            store.setCol(col, def).catch(console.error);
          }
        });
      } catch(e) {
        console.error("Load error:", e);
        const backup = ls.get(BACKUP_KEY) || ls.get(CACHE_KEY);
        if (backup) setData({ ...DEFAULT_DATA, ...backup });
        setLoading(false);
      }

      // 3. Restore session
      const sess = ls.get(SESSION_KEY);
      if (sess?.user && sess?.view && sess.view !== "login") {
        setUser(sess.user); setView(sess.view);
      }

      // 4. Per-collection realtime listeners
      COLS.forEach(col => {
        const u = store.listenCol(col, (val, meta) => {
          if (val === null || val === undefined) return;
          if (meta.hasPendingWrites) return;
          if (Date.now() - (writeTimesRef.current[col] || 0) < 1500) return;
          setData(prev => {
            if (!prev) return prev;
            const next = { ...prev, [col]: val };
            ls.set(CACHE_KEY, next);
            return next;
          });
        });
        unsubsRef.current.push(u);
      });
    })();
    return () => { unsubsRef.current.forEach(u => u()); };
  }, []);

  const saveData = useCallback(async (newData, hints) => {
    if (!newData) return;
    setData(newData);
    ls.set(CACHE_KEY, newData);
    ls.set(BACKUP_KEY, newData);
    const toSave = hints || COLS.filter(col => {
      const prev = dataRef.current;
      return newData[col] !== undefined && (!prev || JSON.stringify(newData[col]) !== JSON.stringify(prev[col]));
    });
    await Promise.all(toSave.map(async col => {
      if (newData[col] === undefined) return;
      writeTimesRef.current[col] = Date.now();
      try { await store.setCol(col, newData[col]); }
      catch(e) {
        await new Promise(r => setTimeout(r, 1500));
        store.setCol(col, newData[col]).catch(console.error);
      }
    }));
  }, []);


  // Expose dataRef so ExamTaker can always access latest data
  const dataRef = useRef(null);
  useEffect(() => { dataRef.current = data; }, [data]);

  const handleLogin = useCallback((credentials) => {
    if (!data) return;
    const { role, username, password } = credentials;
    let loggedUser = null;
    let nextView = "login";

    if (role === "admin") {
      const adminCred = data.meta?.admin || { username: "admin", password: "admin123" };
      if (username === adminCred.username && password === adminCred.password) {
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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: isDark ? undefined : "linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #1e3a5f 100%)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={SCHOOL_LOGO} alt="Logo SMAN6" className="w-24 h-24 mx-auto mb-3 rounded-full object-cover shadow-2xl" style={{ border: "3px solid rgba(59,130,246,0.5)" }} />
          <h1 className="text-2xl font-bold mb-0.5" style={{ color: "#ffffff" }}>{SCHOOL_NAME}</h1>
          <p className="text-sm font-medium" style={{ color: "#93c5fd" }}>Sistem Ujian Sekolah Digital</p>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: "#bfdbfe" }}>{SCHOOL_ADDRESS}</p>
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
              <div className="text-sm font-semibold truncate" style={{ color: "#ffffff" }}>{user.name}</div>
              <div className="text-xs capitalize" style={{ color: "#93c5fd" }}>{user.role}</div>
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
      <main className="flex-1 min-h-screen overflow-y-auto" style={{ background: isDark ? "transparent" : "#f1f5f9" }}>
        <header className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3 lg:hidden" style={{ background: isDark ? "rgba(15,23,42,0.95)" : "rgba(30,58,95,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(59,130,246,0.15)" }}>
          <button onClick={() => setSideOpen(true)} className="" style={{ color: "inherit" }}><Menu size={24} /></button>
          <span className="text-white font-semibold">{tabs.find(t => t.id === activeTab)?.label}</span>
        </header>
        <div className="p-4 lg:p-6" style={{ color: T.text }}>{children}</div>
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
  const { T } = useTheme();
  return (
    <div>
      {label && <label className="text-sm font-medium mb-1 block" style={{ color: T.navText }}>{label}</label>}
      <input className="w-full py-2.5 px-3 rounded-xl outline-none text-sm" style={{ background: T.input, border: `1px solid ${T.inputBorder}`, color: T.inputText }} {...props} />
    </div>
  );
}
function Select({ label, children, ...props }) {
  const { T } = useTheme();
  return (
    <div>
      {label && <label className="text-sm font-medium mb-1 block" style={{ color: T.navText }}>{label}</label>}
      <select className="w-full py-2.5 px-3 rounded-xl outline-none text-sm" style={{ background: T.input, border: `1px solid ${T.inputBorder}`, color: T.inputText }} {...props}>{children}</select>
    </div>
  );
}
function StatCard({ icon, label, value, color = "#3b82f6" }) {
  const { T } = useTheme();
  return (
    <Card className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>{icon}</div>
      <div><div className="text-2xl font-bold" style={{ color: T.text }}>{value}</div><div className="text-sm" style={{ color: T.textSub }}>{label}</div></div>
    </Card>
  );
}
function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className={`rounded-2xl p-6 w-full ${wide ? "max-w-3xl" : "max-w-lg"} max-h-[90vh] overflow-y-auto`} style={{ background: "#1e293b", border: "1px solid rgba(59,130,246,0.2)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg" style={{ color: "inherit" }}>{title}</h3>
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
      <h2 className="text-2xl font-bold mb-6" style={{ color: "inherit" }}>Dashboard Admin</h2>
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
        <h3 className="font-bold mb-3" style={{ color: "inherit" }}>Ringkasan Mata Pelajaran</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {["Wajib","MIPA","IPS","Bahasa","Lintas Minat"].map(cat => {
            const count = (data.subjects || []).filter(s => s.category === cat).length;
            return count > 0 ? (
              <div key={cat} className="px-3 py-2 rounded-lg" style={{ background: "rgba(59,130,246,0.1)" }}>
                <div className="text-blue-300 text-xs">{cat}</div>
                <div className="font-bold" style={{ color: "inherit" }}>{count} mapel</div>
              </div>
            ) : null;
          })}
        </div>
      </Card>
    </div>
  );
}

// ============= IMPORT DATA MODAL (Excel/CSV/Word) =============
function ImportDataModal({ type, onImport, onClose, showToast }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("upload");

  const parseCSVLine = (line) => {
    const result = []; let cur = ""; let inQ = false;
    for (let c of line) {
      if (c === '"') { inQ = !inQ; }
      else if (c === "," && !inQ) { result.push(cur.trim()); cur = ""; }
      else cur += c;
    }
    result.push(cur.trim());
    return result;
  };

  const parseFile = async (file) => {
    setLoading(true);
    try {
      const ext = file.name.split(".").pop().toLowerCase();
      let text = "";
      if (ext === "csv" || ext === "txt") {
        text = await file.text();
      } else if (ext === "xlsx" || ext === "xls") {
        // Load SheetJS from CDN
        if (!window.XLSX) {
          await new Promise((res, rej) => {
            const s = document.createElement("script");
            s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
            s.onload = res; s.onerror = rej;
            document.head.appendChild(s);
          });
        }
        const ab = await file.arrayBuffer();
        const wb = window.XLSX.read(ab, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        text = window.XLSX.utils.sheet_to_csv(ws);
      } else if (ext === "docx") {
        if (!window.mammoth) {
          await new Promise((res, rej) => {
            const s = document.createElement("script");
            s.src = "https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js";
            s.onload = res; s.onerror = rej;
            document.head.appendChild(s);
          });
        }
        const ab = await file.arrayBuffer();
        const result = await window.mammoth.extractRawText({ arrayBuffer: ab });
        text = result.value;
      }

      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const parsed = [];

      if (type === "students") {
        for (const line of lines) {
          const cols = line.includes(",") ? parseCSVLine(line) : line.split(/	|;/).map(s => s.trim());
          if (cols.length >= 2) {
            const name = cols[0]?.replace(/^["']|["']$/g, "").trim();
            const nisn = cols[1]?.replace(/^["']|["']$/g, "").trim();
            const kelas = cols[2]?.replace(/^["']|["']$/g, "").trim() || "";
            const peminatan = cols[3]?.replace(/^["']|["']$/g, "").trim() || "MIPA";
            if (name && nisn && !/^(nama|name|siswa)/i.test(name)) {
              parsed.push({ name, nisn, kelas, peminatan });
            }
          }
        }
      } else if (type === "teachers") {
        for (const line of lines) {
          const cols = line.includes(",") ? parseCSVLine(line) : line.split(/	|;/).map(s => s.trim());
          if (cols.length >= 2) {
            const name = cols[0]?.replace(/^["']|["']$/g, "").trim();
            const nip = cols[1]?.replace(/^["']|["']$/g, "").trim();
            const email = cols[2]?.replace(/^["']|["']$/g, "").trim() || "";
            if (name && nip && !/^(nama|name|guru)/i.test(name)) {
              parsed.push({ name, nip, email, subjects: [], photo: "" });
            }
          }
        }
      }

      if (!parsed.length) return showToast("Tidak ada data valid ditemukan. Periksa format file.", "error");
      setRows(parsed);
      setStep("preview");
    } catch(e) {
      showToast("Gagal membaca file: " + e.message, "error");
    }
    setLoading(false);
  };

  const isStudent = type === "students";
  const title = isStudent ? "Import Data Siswa" : "Import Data Guru";
  const template = isStudent
    ? `Nama Lengkap,NISN,Kelas,Peminatan\nAhmad Fauzi,1234567890,XII-MIPA 1,MIPA\nSiti Rahayu,0987654321,XII-IPS 1,IPS`
    : `Nama Lengkap,NIP,Email\nBudi Santoso,199001012020011001,budi@sman6.sch.id`;

  const downloadTemplate = () => {
    const blob = new Blob([template], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (isStudent ? "template_siswa" : "template_guru") + ".csv";
    a.click();
  };

  return (
    <Modal title={title} onClose={onClose} wide>
      {step === "upload" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl" style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}>
            <p className="text-blue-300 text-sm font-medium mb-2">Format Kolom yang Dibutuhkan:</p>
            <div className="font-mono text-xs" style={{ color: "inherit", opacity: 0.8 }}>
              {isStudent ? "Kolom 1: Nama Lengkap | Kolom 2: NISN | Kolom 3: Kelas | Kolom 4: Peminatan" : "Kolom 1: Nama Lengkap | Kolom 2: NIP | Kolom 3: Email (opsional)"}
            </div>
            <button onClick={downloadTemplate} className="mt-2 text-xs text-blue-400 hover:underline flex items-center gap-1"><Download size={12} />Download Template CSV</button>
          </div>
          <label className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl cursor-pointer transition" style={{ border: "2px dashed rgba(59,130,246,0.4)", background: "rgba(15,23,42,0.3)" }}>
            <Upload size={32} className="text-blue-400" />
            <span className="text-sm font-medium text-blue-300">{loading ? "Membaca file..." : "Klik untuk pilih file"}</span>
            <span className="text-xs" style={{ color: "inherit", opacity: 0.5 }}>Format: .xlsx, .csv, .txt, .docx</span>
            <input type="file" accept=".xlsx,.xls,.csv,.txt,.docx" onChange={e => { if (e.target.files[0]) parseFile(e.target.files[0]); }} className="hidden" disabled={loading} />
          </label>
        </div>
      )}
      {step === "preview" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-green-400 font-semibold">{rows.length} data terdeteksi</span>
            <Btn variant="secondary" onClick={() => setStep("upload")}><ArrowLeft size={14} />Ganti File</Btn>
          </div>
          <div className="rounded-xl overflow-hidden mb-4" style={{ border: "1px solid rgba(59,130,246,0.2)" }}>
            <div className="grid text-xs font-bold px-3 py-2" style={{ gridTemplateColumns: isStudent ? "1fr 1fr 1fr 1fr" : "1fr 1fr 1fr", background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}>
              <div>Nama</div>
              <div>{isStudent ? "NISN" : "NIP"}</div>
              {isStudent ? <><div>Kelas</div><div>Peminatan</div></> : <div>Email</div>}
            </div>
            <div className="max-h-60 overflow-y-auto">
              {rows.map((r, i) => (
                <div key={i} className="grid text-xs px-3 py-2" style={{ gridTemplateColumns: isStudent ? "1fr 1fr 1fr 1fr" : "1fr 1fr 1fr", background: i%2===0 ? "rgba(15,23,42,0.3)" : "transparent", color: "inherit" }}>
                  <div>{r.name}</div>
                  <div>{isStudent ? r.nisn : r.nip}</div>
                  {isStudent ? <><div>{r.kelas}</div><div>{r.peminatan}</div></> : <div>{r.email}</div>}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Btn variant="secondary" onClick={onClose}>Batal</Btn>
            <Btn variant="success" onClick={() => onImport(rows)}><CheckCircle size={14} />Import {rows.length} Data</Btn>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ============= TEACHER MANAGER =============
function TeacherManager({ data, dataRef, saveData, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", nip: "", email: "", subjects: [], photo: "" });
  const [search, setSearch] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);

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
    saveData({ ...latest, teachers }, ["teachers"]);
    setShowModal(false);
    showToast(editId ? "Data guru diperbarui" : "Guru berhasil ditambahkan");
  };

  const handleDelete = (id) => {
    if (!confirm("Hapus guru ini?")) return;
    const latest = dataRef?.current || data;
    saveData({ ...latest, teachers: (latest.teachers || []).filter(t => t.id !== id) }, ["teachers"]);
    showToast("Guru dihapus");
  };

  const toggleSubject = (sid) => setForm(f => ({ ...f, subjects: f.subjects.includes(sid) ? f.subjects.filter(s => s !== sid) : [...f.subjects, sid] }));
  const filtered = data.teachers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.nip.includes(search));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-white text-2xl font-bold">Data Guru</h2>
        <div className="flex gap-2">
          <Btn variant="secondary" onClick={() => setShowImportModal(true)}><Upload size={16} />Import Excel/CSV</Btn>
          <Btn onClick={openAdd}><Plus size={16} />Tambah Guru</Btn>
        </div>
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
                    <div className="font-medium text-sm" style={{ color: "inherit" }}>{t.name}</div>
                    <div className="text-xs" style={{ color: "inherit", opacity: 0.65 }}>NIP: {t.nip}{t.email ? ` • ${t.email}` : ""} • {(t.subjects || []).length} mapel{t.password ? " • 🔑 Password custom" : ""}</div>
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
      {showImportModal && (
        <ImportDataModal type="teachers" onImport={(rows) => {
          const latest = dataRef?.current || data;
          const existing = latest.teachers || [];
          const newTeachers = rows.filter(r => !existing.find(t => t.nip === r.nip)).map(r => ({ id: genId(), ...r }));
          saveData({ ...latest, teachers: [...existing, ...newTeachers] }, ["teachers"]);
          setShowImportModal(false);
          showToast(newTeachers.length + " guru berhasil diimpor");
        }} onClose={() => setShowImportModal(false)} showToast={showToast} />
      )}
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
  const [showImportSiswa, setShowImportSiswa] = useState(false);

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
    saveData({ ...latest, students }, ["students"]);
    setShowModal(false);
    showToast(editId ? "Data siswa diperbarui" : "Siswa berhasil ditambahkan");
  };

  const handleDelete = (id) => {
    if (!confirm("Hapus siswa ini?")) return;
    const latest = dataRef?.current || data;
    saveData({ ...latest, students: (latest.students || []).filter(s => s.id !== id) }, ["students"]);
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
        <div className="flex gap-2">
          <Btn variant="secondary" onClick={() => setShowImportSiswa(true)}><Upload size={16} />Import Excel/CSV</Btn>
          <Btn onClick={openAdd}><Plus size={16} />Tambah Siswa</Btn>
        </div>
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
        <div className="text-xs mb-3" style={{ color: "inherit", opacity: 0.65 }}>Menampilkan {filtered.length} dari {data.students.length} siswa</div>
        {filtered.length === 0 ? <EmptyState icon={<GraduationCap size={40} className="mx-auto" />} text="Belum ada data siswa" /> : (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filtered.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition">
                <div className="flex items-center gap-3">
                  {s.photo ? <img src={s.photo} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}>{s.name[0]}</div>}
                  <div>
                    <div className="font-medium text-sm" style={{ color: "inherit" }}>{s.name}</div>
                    <div className="text-xs" style={{ color: "inherit", opacity: 0.65 }}>NISN: {s.nisn} • {s.kelas} • {s.peminatan || "-"}</div>
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
      {showImportSiswa && (
        <ImportDataModal type="students" onImport={(rows) => {
          const latest = dataRef?.current || data;
          const existing = latest.students || [];
          const newStudents = rows.filter(r => !existing.find(s => s.nisn === r.nisn)).map(r => ({ id: genId(), ...r }));
          saveData({ ...latest, students: [...existing, ...newStudents] }, ["students"]);
          setShowImportSiswa(false);
          showToast(newStudents.length + " siswa berhasil diimpor");
        }} onClose={() => setShowImportSiswa(false)} showToast={showToast} />
      )}
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
    saveData({ ...data, subjects }, ["subjects"]);
    setShowModal(false); setForm({ name: "", category: "Wajib" });
    showToast("Mata pelajaran ditambahkan");
  };

  const handleDelete = (id) => {
    if (!confirm("Hapus mata pelajaran ini?")) return;
    saveData({ ...data, subjects: (data.subjects || []).filter(s => s.id !== id) }, ["subjects"]);
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
            saveData({ ...data, subjects: [...(data.subjects || []), ...merdeka] }, ["subjects"]);
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
                <div className="flex items-center gap-2"><BookOpen size={14} className="text-blue-400" /><span className="text-sm" style={{ color: "inherit" }}>{s.name}</span></div>
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

// ============= AI GENERATE MODAL =============
function AIGenerateModal({ data, dataRef, saveData, showToast, userId, onClose }) {
  const [step, setStep] = useState("form"); // form | loading | preview
  const [aiForm, setAiForm] = useState({
    subjectId: (data.subjects || [])[0]?.id || "",
    topic: "",
    type: "pilgan",
    count: 5,
    difficulty: "sedang",
    extra: "",
  });
  const [generated, setGenerated] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loadingMsg, setLoadingMsg] = useState("");

  const geminiKey = data.meta?.geminiKey || "";

  const getSubjectName = (id) => (data.subjects || []).find(s => s.id === id)?.name || "-";

  const buildPrompt = () => {
    const subjectName = getSubjectName(aiForm.subjectId);
    const typeLabel = aiForm.type === "pilgan" ? "pilihan ganda (5 opsi A-E)" : aiForm.type === "benar_salah" ? "benar/salah" : "uraian singkat";
    const diffLabel = { mudah: "mudah (tingkat SMA kelas X)", sedang: "sedang (tingkat SMA kelas XI)", sulit: "sulit (tingkat SMA kelas XII / HOTS)" }[aiForm.difficulty];
    return `Kamu adalah guru SMA yang berpengalaman. Buat ${aiForm.count} soal ${typeLabel} mata pelajaran ${subjectName} materi "${aiForm.topic}" tingkat kesulitan ${diffLabel}.${aiForm.extra ? " Catatan tambahan: " + aiForm.extra : ""}

WAJIB kembalikan HANYA array JSON valid, tanpa teks lain, tanpa markdown, tanpa komentar.

Format JSON:
${aiForm.type === "pilgan" ? `[
  {
    "text": "Pertanyaan soal di sini?",
    "type": "pilgan",
    "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D", "Opsi E"],
    "correctAnswer": 0,
    "explanation": "Pembahasan lengkap mengapa jawaban A benar."
  }
]` : aiForm.type === "benar_salah" ? `[
  {
    "text": "Pernyataan yang harus dinilai benar atau salah.",
    "type": "benar_salah",
    "options": ["Benar", "Salah"],
    "correctAnswer": 0,
    "explanation": "Pembahasan mengapa pernyataan ini Benar."
  }
]` : `[
  {
    "text": "Pertanyaan uraian di sini?",
    "type": "uraian",
    "options": [],
    "correctAnswer": 0,
    "explanation": "Kunci jawaban dan pembahasan lengkap."
  }
]`}

Buat tepat ${aiForm.count} soal. Pastikan soal bervariasi, tidak berulang, dan sesuai kurikulum K-13/Merdeka.`;
  };

  const handleGenerate = async () => {
    if (!geminiKey) return showToast("API Key Gemini belum diatur. Minta admin untuk mengaturnya di menu Pengaturan.", "error");
    if (!aiForm.topic.trim()) return showToast("Isi topik/materi terlebih dahulu", "error");
    if (!aiForm.subjectId) return showToast("Pilih mata pelajaran", "error");

    setStep("loading");
    const msgs = [
      "Menghubungi Gemini AI...",
      "Menganalisis materi " + aiForm.topic + "...",
      "Menyusun soal dan kunci jawaban...",
      "Memvalidasi pembahasan...",
    ];
    let mi = 0;
    setLoadingMsg(msgs[0]);
    const interval = setInterval(() => { mi = (mi + 1) % msgs.length; setLoadingMsg(msgs[mi]); }, 2000);

    try {
      const prompt = buildPrompt();
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
          }),
        }
      );
      clearInterval(interval);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message || "Gagal menghubungi Gemini API");
      }
      const json = await res.json();
      const raw = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const start = cleaned.indexOf("[");
      const end = cleaned.lastIndexOf("]");
      if (start === -1 || end === -1) throw new Error("Format respons AI tidak valid");
      const parsed = JSON.parse(cleaned.slice(start, end + 1));
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Tidak ada soal yang dihasilkan");
      const withMeta = parsed.map((q, i) => ({
        ...q,
        subjectId: aiForm.subjectId,
        type: q.type || aiForm.type,
        options: q.options || [],
        correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
        explanation: q.explanation || "",
        _tempId: "ai_" + Date.now() + "_" + i,
      }));
      setGenerated(withMeta);
      setSelected(withMeta.map(q => q._tempId));
      setStep("preview");
    } catch (e) {
      clearInterval(interval);
      showToast("Gagal: " + e.message, "error");
      setStep("form");
    }
  };

  const handleSave = () => {
    const toSave = generated.filter(q => selected.includes(q._tempId));
    if (!toSave.length) return showToast("Pilih minimal 1 soal", "error");
    const latest = dataRef?.current || data;
    const clean = toSave.map(({ _tempId, ...q }) => ({ id: "q" + Date.now() + Math.random().toString(36).slice(2, 6), ...q, createdBy: userId || "admin" }));
    saveData({ ...latest, questions: [...(latest.questions || []), ...clean] }, ["questions"]);
    showToast(`${clean.length} soal berhasil ditambahkan ke bank soal! 🎉`);
    onClose();
  };

  const typeColors = { pilgan: { bg: "rgba(59,130,246,0.2)", color: "#60a5fa" }, benar_salah: { bg: "rgba(234,179,8,0.2)", color: "#fbbf24" }, uraian: { bg: "rgba(20,184,166,0.2)", color: "#2dd4bf" }, esai: { bg: "rgba(168,85,247,0.2)", color: "#c084fc" } };

  return (
    <Modal title="✨ Generate Soal dengan AI" onClose={onClose} wide>
      {!geminiKey && (
        <div className="mb-4 p-3 rounded-xl flex items-start gap-2" style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.3)" }}>
          <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />
          <p className="text-amber-300 text-sm">API Key Gemini belum diatur. Admin perlu menambahkan Gemini API Key di menu <strong>Pengaturan → Integrasi AI</strong>. Key gratis tersedia di <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="underline">aistudio.google.com</a></p>
        </div>
      )}

      {step === "form" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1" style={{ color: "inherit", opacity: 0.7 }}>Mata Pelajaran</label>
              <select value={aiForm.subjectId} onChange={e => setAiForm({ ...aiForm, subjectId: e.target.value })} className="w-full py-2.5 px-3 rounded-xl text-white text-sm outline-none" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.25)" }}>
                {(data.subjects || []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: "inherit", opacity: 0.7 }}>Tipe Soal</label>
              <select value={aiForm.type} onChange={e => setAiForm({ ...aiForm, type: e.target.value })} className="w-full py-2.5 px-3 rounded-xl text-white text-sm outline-none" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.25)" }}>
                <option value="pilgan">Pilihan Ganda</option>
                <option value="benar_salah">Benar / Salah</option>
                <option value="uraian">Uraian</option>
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: "inherit", opacity: 0.7 }}>Jumlah Soal</label>
              <select value={aiForm.count} onChange={e => setAiForm({ ...aiForm, count: Number(e.target.value) })} className="w-full py-2.5 px-3 rounded-xl text-white text-sm outline-none" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.25)" }}>
                {[3,5,10,15,20].map(n => <option key={n} value={n}>{n} soal</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: "inherit", opacity: 0.7 }}>Tingkat Kesulitan</label>
              <select value={aiForm.difficulty} onChange={e => setAiForm({ ...aiForm, difficulty: e.target.value })} className="w-full py-2.5 px-3 rounded-xl text-white text-sm outline-none" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.25)" }}>
                <option value="mudah">Mudah (C1-C2)</option>
                <option value="sedang">Sedang (C3-C4)</option>
                <option value="sulit">Sulit / HOTS (C5-C6)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: "inherit", opacity: 0.7 }}>Topik / Materi <span className="text-red-400">*</span></label>
            <input value={aiForm.topic} onChange={e => setAiForm({ ...aiForm, topic: e.target.value })} placeholder="Contoh: Sel dan Organel, Hukum Newton, Teks Narasi..." className="w-full py-2.5 px-3 rounded-xl text-white text-sm outline-none placeholder-slate-500" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.25)" }} />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: "inherit", opacity: 0.7 }}>Instruksi Tambahan (opsional)</label>
            <textarea value={aiForm.extra} onChange={e => setAiForm({ ...aiForm, extra: e.target.value })} rows={2} placeholder="Contoh: Fokus pada aspek aplikasi, sertakan konteks Indonesia, hindari soal menghafal..." className="w-full py-2.5 px-3 rounded-xl text-white text-sm outline-none resize-none placeholder-slate-500" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.25)" }} />
          </div>
          <div className="flex justify-end gap-2">
            <Btn variant="secondary" onClick={onClose}>Batal</Btn>
            <Btn onClick={handleGenerate} disabled={!geminiKey}>
              <span>✨</span> Generate {aiForm.count} Soal
            </Btn>
          </div>
        </div>
      )}

      {step === "loading" && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-blue-300 text-sm font-medium">{loadingMsg}</p>
          <p className="text-slate-500 text-xs">Gemini AI sedang menyusun soal berkualitas...</p>
        </div>
      )}

      {step === "preview" && (
        <div>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <p className="text-sm" style={{ color: "inherit", opacity: 0.8 }}><span className="text-green-400 font-bold">{generated.length} soal</span> berhasil digenerate. Pilih yang ingin disimpan:</p>
            <div className="flex gap-2">
              <button onClick={() => setSelected(generated.map(q => q._tempId))} className="text-xs text-blue-400 underline">Pilih Semua</button>
              <button onClick={() => setSelected([])} className="text-xs text-slate-400 underline">Batal Semua</button>
            </div>
          </div>
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 mb-4">
            {generated.map((q, i) => {
              const isSelected = selected.includes(q._tempId);
              const tc = typeColors[q.type] || typeColors.pilgan;
              return (
                <div key={q._tempId} onClick={() => setSelected(s => s.includes(q._tempId) ? s.filter(x => x !== q._tempId) : [...s, q._tempId])} className="p-3 rounded-xl cursor-pointer transition" style={{ background: isSelected ? "rgba(22,163,74,0.1)" : "rgba(15,23,42,0.5)", border: `1px solid ${isSelected ? "rgba(22,163,74,0.4)" : "rgba(59,130,246,0.15)"}` }}>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded shrink-0 mt-0.5 flex items-center justify-center" style={{ background: isSelected ? "#16a34a" : "rgba(51,65,85,0.6)" }}>
                      {isSelected && <CheckCircle size={14} className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-2 mb-1 flex-wrap">
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: tc.bg, color: tc.color }}>{q.type === "pilgan" ? "Pilihan Ganda" : q.type === "benar_salah" ? "Benar/Salah" : "Uraian"}</span>
                        <span className="text-xs text-slate-400">Soal {i + 1}</span>
                      </div>
                      <p className="text-sm mb-2" style={{ color: "inherit" }}>{q.text}</p>
                      {q.type === "pilgan" && q.options?.length > 0 && (
                        <div className="space-y-0.5 mb-2">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-1.5 text-xs" style={{ color: oi === q.correctAnswer ? "#4ade80" : "#94a3b8" }}>
                              <span className="font-bold">{String.fromCharCode(65 + oi)}.</span>
                              <span>{opt}</span>
                              {oi === q.correctAnswer && <CheckCircle size={10} />}
                            </div>
                          ))}
                        </div>
                      )}
                      {q.type === "benar_salah" && (
                        <p className="text-xs text-green-400 mb-1">✓ Jawaban: {q.options?.[q.correctAnswer] || "Benar"}</p>
                      )}
                      {q.explanation && (
                        <div className="p-2 rounded-lg mt-1" style={{ background: "rgba(59,130,246,0.08)" }}>
                          <p className="text-xs" style={{ color: "inherit", opacity: 0.75 }}><span className="text-blue-400 font-semibold">Pembahasan:</span> {q.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center gap-2 flex-wrap">
            <button onClick={() => { setStep("form"); setGenerated([]); setSelected([]); }} className="text-sm text-slate-400 underline">← Generate Ulang</button>
            <div className="flex gap-2">
              <Btn variant="secondary" onClick={onClose}>Batal</Btn>
              <Btn onClick={handleSave} disabled={selected.length === 0}>
                <Save size={14} /> Simpan {selected.length} Soal
              </Btn>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ============= QUESTION MANAGER =============
function QuestionManager({ data, dataRef, saveData, showToast, userId }) {
  const [showModal, setShowModal] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterSubject, setFilterSubject] = useState("all");
  const [form, setForm] = useState({ subjectId: "", type: "pilgan", text: "", image: "", options: ["", "", "", "", ""], correctAnswer: 0, explanation: "", rubrik: "" });
  const [filterType, setFilterType] = useState("all");

  const [showMineOnly, setShowMineOnly] = useState(false);
  // Show all questions (not just createdBy this user) - prevents visibility issues
  // from real-time sync delay. User can filter to "mine only".
  const allQ = data.questions || [];
  const baseQ = (userId && showMineOnly) ? allQ.filter(q => q.createdBy === userId) : allQ;
  const filtered = baseQ.filter(q => {
    if (filterSubject !== "all" && q.subjectId !== filterSubject) return false;
    if (filterType !== "all" && (q.type || "pilgan") !== filterType) return false;
    return true;
  });
  const myCount = userId ? allQ.filter(q => q.createdBy === userId).length : allQ.length;

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
    saveData({ ...latest, questions }, ["questions"]);
    setShowModal(false);
    showToast(editId ? "Soal diperbarui" : "Soal berhasil ditambahkan");
  };

  const handleDelete = (id) => {
    if (!confirm("Hapus soal ini?")) return;
    const latest = dataRef?.current || data;
    saveData({ ...latest, questions: (latest.questions || []).filter(q => q.id !== id) }, ["questions"]);
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
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "inherit" }}>Bank Soal</h2>
          {userId && <p className="text-xs mt-0.5" style={{ color: "inherit", opacity: 0.6 }}>Soal saya: {myCount} | Total: {allQ.length}</p>}
        </div>
        <div className="flex gap-2 flex-wrap">
          {userId && <button onClick={() => setShowMineOnly(v => !v)} className="px-3 py-2 rounded-xl text-xs font-medium transition" style={{ background: showMineOnly ? "rgba(59,130,246,0.25)" : "rgba(51,65,85,0.5)", color: showMineOnly ? "#60a5fa" : "#94a3b8", border: "1px solid rgba(59,130,246,0.2)" }}>{showMineOnly ? "✓ Soal Saya" : "Semua Soal"}</button>}
          <Btn variant="secondary" onClick={() => setShowImport(true)}><Upload size={16} />Import</Btn>
          <button onClick={() => setShowAI(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition" style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(59,130,246,0.3))", color: "#c084fc", border: "1px solid rgba(168,85,247,0.4)" }}>✨ Generate AI</button>
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
        <div className="text-xs mb-3" style={{ color: "inherit", opacity: 0.65 }}>{filtered.length} soal</div>
        {filtered.length === 0 ? <EmptyState icon={<FileText size={40} className="mx-auto" />} text="Belum ada soal" /> : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {filtered.map((q, i) => (
              <div key={q.id} className="p-3 rounded-xl" style={{ background: "rgba(15,23,42,0.5)" }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap"><span className="text-blue-400 text-xs">{getSubjectName(q.subjectId)}</span>{userId && q.createdBy !== userId && <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: "rgba(168,85,247,0.15)", color: "#c084fc" }}>dari guru lain</span>}<span className="px-1.5 py-0.5 rounded text-xs" style={{ background: q.type === "esai" ? "rgba(168,85,247,0.2)" : q.type === "uraian" ? "rgba(20,184,166,0.2)" : q.type === "benar_salah" ? "rgba(234,179,8,0.2)" : "rgba(59,130,246,0.2)", color: q.type === "esai" ? "#c084fc" : q.type === "uraian" ? "#2dd4bf" : q.type === "benar_salah" ? "#fbbf24" : "#60a5fa" }}>{q.type === "esai" ? "Esai" : q.type === "uraian" ? "Uraian" : q.type === "benar_salah" ? "Benar/Salah" : "Pilihan Ganda"}</span></div>
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

      {showAI && <AIGenerateModal data={data} dataRef={dataRef} saveData={saveData} showToast={showToast} userId={userId} onClose={() => setShowAI(false)} />}

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
    saveData({ ...latest, exams }, ["exams"]);
    setShowModal(false);
    showToast(editId ? "Ujian diperbarui" : "Ujian berhasil dibuat");
  };

  const toggleStatus = (examId, newStatus) => {
    const latest = dataRef?.current || data;
    const exams = latest.exams.map(e => e.id === examId ? { ...e, status: newStatus } : e);
    saveData({ ...latest, exams }, ["exams"]);
    showToast(`Ujian ${newStatus === "active" ? "diaktifkan" : newStatus === "ended" ? "diakhiri" : "di-draft-kan"}`);
  };

  const handleDelete = (id) => {
    if (!confirm("Hapus ujian ini?")) return;
    const latest = dataRef?.current || data;
    const exams = latest.exams.filter(e => e.id !== id);
    saveData({ ...latest, exams }, ["exams"]);
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
                      <h3 className="font-bold text-base" style={{ color: "inherit" }}>{ex.title}</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: statusColors[ex.status]?.bg, color: statusColors[ex.status]?.text }}>{statusLabels[ex.status]}</span>
                    </div>
                    <div className="text-sm space-y-0.5" style={{ color: "inherit", opacity: 0.7 }}>
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
                      <span className="" style={{ color: "inherit" }}>{i + 1}. {q.text.substring(0, 80)}{q.text.length > 80 ? "..." : ""}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-4">
              {[["shuffleQuestions", "Acak urutan soal"], ["shuffleOptions", "Acak pilihan jawaban"], ["showResult", "Tampilkan hasil ke siswa"], ["isTryout", "Jadikan sebagai Tryout/Latihan (siswa bisa akses kapan saja)"]].map(([k, label]) => (
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
    const examResults = (data.results || []).filter(r => r.examId === selectedExam);
    const targetStudents = data.students.filter(s => exam.targetKelas?.includes(s.kelas));
    const totalQ = exam.questionIds.length;
    const getStudentStatus = (st) => {
      const session = sessions.find(s => s.studentId === st.id);
      const result = examResults.find(r => r.studentId === st.id);
      if (result) return { status: "submitted", session, result };
      if (session) return { status: session.status, session, result: null };
      return { status: "belum", session: null, result: null };
    };
    const countActive = targetStudents.filter(s => getStudentStatus(s).status === "active").length;
    const countDone = targetStudents.filter(s => getStudentStatus(s).status === "submitted").length;
    const countPending = targetStudents.filter(s => getStudentStatus(s).status === "belum").length;

    return (
      <div>
        <button onClick={() => setSelectedExam(null)} className="flex items-center gap-2 text-blue-400 mb-4 hover:underline"><ArrowLeft size={16} />Kembali</button>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-white text-2xl font-bold">{exam.title}</h2>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: "rgba(22,163,74,0.15)" }}><div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: "pulse 1.5s infinite" }} /><span className="text-green-400 text-xs font-medium">LIVE</span></div>
        </div>
        <p className="text-sm mb-4" style={{ color: "inherit", opacity: 0.7 }}>Update otomatis setiap 2 detik</p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
          <StatCard icon={<Users size={20} className="text-blue-400" />} label="Total Peserta" value={targetStudents.length} />
          <StatCard icon={<Play size={20} className="text-green-400" />} label="Mengerjakan" value={countActive} color="#16a34a" />
          <StatCard icon={<CheckCircle size={20} className="text-amber-400" />} label="Selesai" value={countDone} color="#d97706" />
          <StatCard icon={<AlertTriangle size={20} className="text-red-400" />} label="Belum Mulai" value={countPending} color="#dc2626" />
        </div>
        <Card>
          <h3 className="font-bold mb-3" style={{ color: "inherit" }}>Status Peserta Real-time</h3>
          <div className="space-y-2 max-h-[55vh] overflow-y-auto">
            {[...targetStudents].sort((a, b) => {
              const order = { active: 0, submitted: 1, belum: 2 };
              return (order[getStudentStatus(a).status] ?? 2) - (order[getStudentStatus(b).status] ?? 2);
            }).map(st => {
              const { status, session, result } = getStudentStatus(st);
              const answered = result ? Object.keys(result.answers || {}).length : Object.keys(session?.answers || {}).length;
              let statusText = "Belum mulai", statusColor = "#64748b", bgColor = "rgba(15,23,42,0.3)";
              if (status === "active") { statusText = "Mengerjakan (" + answered + "/" + totalQ + ")"; statusColor = "#3b82f6"; bgColor = "rgba(59,130,246,0.07)"; }
              else if (status === "submitted") {
                const score = result?.score;
                statusText = (score !== null && score !== undefined) ? "Selesai — Nilai: " + score.toFixed(1) : "Selesai";
                statusColor = "#16a34a"; bgColor = "rgba(22,163,74,0.07)";
              }
              const violations = result?.violations || session?.violations || 0;
              const lastUpdate = session?.lastUpdate ? Math.round((Date.now() - session.lastUpdate) / 1000) : null;
              return (
                <div key={st.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: bgColor }}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: statusColor }} />
                    <div>
                      <div className="text-sm font-medium" style={{ color: "inherit" }}>{st.name}</div>
                      <div className="text-xs" style={{ color: "inherit", opacity: 0.65 }}>{st.kelas} • NISN: {st.nisn}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-right flex-wrap justify-end">
                    <div>
                      <div className="text-xs font-medium" style={{ color: statusColor }}>{statusText}</div>
                      {status === "active" && lastUpdate !== null && (
                        <div className="text-xs" style={{ opacity: 0.5 }}>{lastUpdate < 60 ? lastUpdate + "s lalu" : Math.round(lastUpdate/60) + "m lalu"}</div>
                      )}
                    </div>
                    {violations > 0 && <div className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg" style={{ background: "rgba(220,38,38,0.2)", color: "#f87171" }}><AlertTriangle size={12} />⚠️ {violations}x</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        {/* Progress bar */}
        <Card className="mt-4">
          <h3 className="font-bold mb-3" style={{ color: "inherit" }}>Progress Keseluruhan</h3>
          <div className="space-y-2">
            {[
              { label: "Selesai", count: countDone, color: "#16a34a", bg: "#16a34a" },
              { label: "Sedang mengerjakan", count: countActive, color: "#3b82f6", bg: "#3b82f6" },
              { label: "Belum mulai", count: countPending, color: "#64748b", bg: "#64748b" },
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
      <h2 className="text-2xl font-bold mb-5" style={{ color: "inherit" }}>Monitoring Real-time</h2>
      {activeExams.length === 0 ? <Card><EmptyState icon={<Monitor size={40} className="mx-auto" />} text="Tidak ada ujian aktif" /></Card> : (
        <div className="space-y-3">
          {activeExams.map(ex => {
            const sessions = (data.sessions || []).filter(s => s.examId === ex.id);
            const targetCount = data.students.filter(s => ex.targetKelas?.includes(s.kelas)).length;
            return (
              <Card key={ex.id} className="cursor-pointer hover:border-blue-500/40 transition" onClick={() => setSelectedExam(ex.id)}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold" style={{ color: "inherit" }}>{ex.title}</h3>
                    <div className="text-sm" style={{ color: "inherit", opacity: 0.7 }}>{(data.subjects || []).find(s => s.id === ex.subjectId)?.name} • {ex.questionIds.length} soal • {ex.duration} menit</div>
                    <div className="flex gap-4 mt-2">
                      <span className="text-green-400 text-xs font-medium">{sessions.filter(s => s.status === "active").length} mengerjakan</span>
                      <span className="text-amber-400 text-xs font-medium">{sessions.filter(s => s.status === "submitted").length} selesai</span>
                      <span className="text-xs" style={{ color: "inherit", opacity: 0.65 }}>{targetCount} total peserta</span>
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
  const [activeResultTab, setActiveResultTab] = useState("ranking");

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
    const targetStudents = data.students.filter(s => exam?.targetKelas?.includes(s.kelas));
    const submittedIds = new Set(results.map(r => r.studentId));
    const notSubmitted = targetStudents.filter(s => !submittedIds.has(s.id));
    const scoredResults = results.filter(r => r.score !== null && r.score !== undefined);
    const avg = scoredResults.length > 0 ? (scoredResults.reduce((a, r) => a + r.score, 0) / scoredResults.length).toFixed(1) : "-";
    const highest = scoredResults.length > 0 ? Math.max(...scoredResults.map(r => r.score)).toFixed(1) : "-";
    const lowest = scoredResults.length > 0 ? Math.min(...scoredResults.map(r => r.score)).toFixed(1) : "-";
    const rankedResults = [...results].sort((a, b) => (b.score||0) - (a.score||0));
    // Per-question analysis
    const questionAnalysis = exam?.questionIds?.map((qid, qi) => {
      const q = data.questions.find(x => x.id === qid);
      const answered = results.filter(r => r.answers && r.answers[qi] !== undefined && r.answers[qi] !== "");
      const correct = results.filter(r => r.answers && r.answers[qi] === q?.correctAnswer);
      const pct = answered.length > 0 ? Math.round(correct.length / answered.length * 100) : 0;
      return { qi, q, answered: answered.length, correct: correct.length, pct };
    }) || [];
    // Score distribution
    const dist = [0,0,0,0,0]; // 0-20,21-40,41-60,61-80,81-100
    scoredResults.forEach(r => {
      const idx = Math.min(4, Math.floor(r.score / 20));
      dist[idx]++;
    });
    const maxDist = Math.max(...dist, 1);

    return (
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <button onClick={() => { setSelectedExam(null); setActiveResultTab("ranking"); }} className="flex items-center gap-2 text-blue-400 hover:underline"><ArrowLeft size={16} />Kembali</button>
          <Btn variant="secondary" onClick={() => handlePrint(exam, results)}><Printer size={16} />Cetak Laporan PDF</Btn>
        </div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "inherit" }}>{exam?.title} — Hasil</h2>
        <p className="text-sm mb-4" style={{ color: "inherit", opacity: 0.7 }}>{(data.subjects || []).find(s => s.id === exam?.subjectId)?.name} • {results.length} peserta</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <StatCard icon={<Users size={20} className="text-blue-400" />} label="Total Peserta" value={targetStudents.length} />
          <StatCard icon={<Award size={20} className="text-green-400" />} label="Rata-rata" value={avg} color="#16a34a" />
          <StatCard icon={<BarChart3 size={20} className="text-purple-400" />} label="Tertinggi" value={highest} color="#9333ea" />
          <StatCard icon={<BarChart3 size={20} className="text-amber-400" />} label="Terendah" value={lowest} color="#d97706" />
        </div>
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
              {rankedResults.map((r, i) => {
                const student = data.students.find(s => s.id === r.studentId);
                const scoreNull = r.score === null || r.score === undefined;
                const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : String(i+1);
                return (
                  <div key={r.id} className="grid grid-cols-12 gap-2 px-3 py-2.5 rounded-lg items-center mb-0.5" style={{ background: i % 2 === 0 ? "rgba(15,23,42,0.3)" : "transparent" }}>
                    <div className="col-span-1 text-sm font-bold text-center">{medal}</div>
                    <div className="col-span-4 text-sm font-medium" style={{ color: "inherit" }}>{student?.name || "?"}</div>
                    <div className="col-span-2 text-sm text-center" style={{ color: "inherit", opacity: 0.65 }}>{student?.kelas || "-"}</div>
                    <div className="col-span-2 text-sm text-center" style={{ color: "inherit", opacity: 0.8 }}>{r.correct||0}/{totalQ}</div>
                    <div className="col-span-3 text-center">
                      {scoreNull ? (
                        <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: "rgba(168,85,247,0.2)", color: "#c084fc" }}>Dinilai</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: r.score >= 75 ? "rgba(22,163,74,0.2)" : r.score >= 50 ? "rgba(217,119,6,0.2)" : "rgba(220,38,38,0.2)", color: r.score >= 75 ? "#4ade80" : r.score >= 50 ? "#fbbf24" : "#f87171" }}>
                          {r.score.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="mt-3 pt-3 px-3 flex flex-wrap gap-4" style={{ borderTop: "1px solid rgba(59,130,246,0.15)" }}>
                <span className="text-xs" style={{ color: "inherit", opacity: 0.7 }}>Rata-rata: <strong>{avg}</strong></span>
                <span className="text-xs text-green-400">Tertinggi: <strong>{highest}</strong></span>
                <span className="text-xs text-red-400">Terendah: <strong>{lowest}</strong></span>
                <span className="text-xs text-blue-400">Mengumpulkan: <strong>{results.length}/{targetStudents.length}</strong></span>
              </div>
            </div>
          )}
        </Card>

        {notSubmitted.length > 0 && (
          <Card className="mt-4">
            <h3 className="font-bold mb-3" style={{ color: "inherit" }}>Belum Mengumpulkan ({notSubmitted.length} siswa)</h3>
            <div className="space-y-1">
              {notSubmitted.map(s => (
                <div key={s.id} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: "rgba(220,38,38,0.06)" }}>
                  <span className="text-sm" style={{ color: "inherit" }}>{s.name}</span>
                  <span className="text-xs" style={{ color: "inherit", opacity: 0.6 }}>{s.kelas} • NISN: {s.nisn}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
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
                    <h3 className="font-bold" style={{ color: "inherit" }}>{ex.title}</h3>
                    <div className="text-sm" style={{ color: "inherit", opacity: 0.7 }}>{(data.subjects || []).find(s => s.id === ex.subjectId)?.name}</div>
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

// ============= GEMINI KEY SETTING =============
function GeminiKeySetting({ data, dataRef, saveData, showToast }) {
  const [key, setKey] = useState(data.meta?.geminiKey || "");
  const [show, setShow] = useState(false);
  const handleSave = () => {
    const latest = dataRef?.current || data;
    const newMeta = { ...(latest.meta || {}), geminiKey: key.trim() };
    saveData({ ...latest, meta: newMeta }, ["meta"]);
    showToast("API Key Gemini berhasil disimpan ✓");
  };
  return (
    <div className="flex gap-2 items-end max-w-lg">
      <div className="flex-1">
        <label className="block text-xs mb-1" style={{ color: "inherit", opacity: 0.7 }}>Gemini API Key</label>
        <div className="relative">
          <input type={show ? "text" : "password"} value={key} onChange={e => setKey(e.target.value)} placeholder="AIzaSy..." className="w-full py-2.5 px-3 pr-10 rounded-xl text-white text-sm outline-none placeholder-slate-500" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.25)" }} />
          <button onClick={() => setShow(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
            <Eye size={15} />
          </button>
        </div>
      </div>
      <Btn onClick={handleSave}><Save size={14} />Simpan</Btn>
    </div>
  );
}

// ============= SETTINGS (ADMIN) =============
function SettingsView({ data, dataRef, saveData, showToast }) {
  const [pw, setPw] = useState({ old: "", new1: "", new2: "" });
  const handleChangePw = () => {
    const latest = dataRef?.current || data;
    const adminCred2 = latest.meta?.admin || latest.admin || {};
    if (pw.old !== adminCred2.password) return showToast("Password lama salah", "error");
    if (pw.new1.length < 4) return showToast("Password baru minimal 4 karakter", "error");
    if (pw.new1 !== pw.new2) return showToast("Konfirmasi password tidak cocok", "error");
    const newMeta2 = { ...(latest.meta || {}), admin: { ...adminCred2, password: pw.new1 } };
    saveData({ ...latest, meta: newMeta2 }, ["meta"]);
    setPw({ old: "", new1: "", new2: "" });
    showToast("Password admin berhasil diubah");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5" style={{ color: "inherit" }}>Pengaturan</h2>
      <Card className="mb-4">
        <h3 className="font-bold mb-4" style={{ color: "inherit" }}>Ubah Password Admin</h3>
        <div className="space-y-3 max-w-md">
          <Input label="Password Lama" type="password" value={pw.old} onChange={e => setPw({ ...pw, old: e.target.value })} />
          <Input label="Password Baru" type="password" value={pw.new1} onChange={e => setPw({ ...pw, new1: e.target.value })} />
          <Input label="Konfirmasi Password Baru" type="password" value={pw.new2} onChange={e => setPw({ ...pw, new2: e.target.value })} />
          <Btn onClick={handleChangePw}><Save size={14} />Simpan Password</Btn>
        </div>
      </Card>
      <Card className="mb-4">
        <h3 className="font-bold mb-1" style={{ color: "inherit" }}>🤖 Integrasi AI (Gemini)</h3>
        <p className="text-xs mb-3" style={{ color: "inherit", opacity: 0.6 }}>API Key Gemini gratis untuk fitur Generate Soal AI. Dapatkan key di <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-blue-400 underline">aistudio.google.com/apikey</a></p>
        <GeminiKeySetting data={data} dataRef={dataRef} saveData={saveData} showToast={showToast} />
      </Card>
      <Card className="mb-4">
        <div className="text-slate-300 text-sm space-y-1">
          <p>Sekolah: {SCHOOL_NAME}</p>
          <p>Kurikulum: K-13 & Merdeka Belajar</p>
          <p>Total Guru: {data.teachers.length} | Total Siswa: {data.students.length}</p>
          <p>Total Soal: {data.questions.length} | Total Ujian: {data.exams.length}</p>
        </div>
      </Card>
      <Card>
        <h3 className="text-red-400 font-bold mb-2">Zona Bahaya</h3>
        <p className="text-sm mb-3" style={{ color: "inherit", opacity: 0.7 }}>Reset seluruh data ke kondisi awal. Tidak dapat dibatalkan.</p>
        <Btn variant="danger" onClick={() => { if (!confirm("PERINGATAN: Ini akan menghapus SEMUA data!")) return; if (!confirm("Yakin benar-benar ingin reset?")) return; saveData(DEFAULT_DATA, COLS); showToast("Data telah direset"); }}><AlertTriangle size={14} />Reset Semua Data</Btn>
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
          <h2 className="text-2xl font-bold mb-6" style={{ color: "inherit" }}>Dashboard Guru</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard icon={<FileText size={24} className="text-blue-400" />} label="Soal Saya" value={data.questions.filter(q => q.createdBy === user.id).length} />
            <StatCard icon={<Layers size={24} className="text-purple-400" />} label="Ujian Saya" value={data.exams.filter(e => e.createdBy === user.id).length} color="#9333ea" />
            <StatCard icon={<BookOpen size={24} className="text-green-400" />} label="Mapel Diampu" value={(user.subjects || []).length} color="#16a34a" />
          </div>
          <Card>
            <h3 className="font-bold mb-3" style={{ color: "inherit" }}>Mata Pelajaran Anda</h3>
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
    saveData({ ...data, teachers }, ["teachers"]);
    const updatedUser = { ...user, password: pw.new1 };
    updateUserSession(updatedUser);
    setPw({ old: "", new1: "", new2: "" });
    showToast("Password berhasil diubah");
  };

  const handleSavePhoto = () => {
    const teachers = data.teachers.map(t => t.id === user.id ? { ...t, photo } : t);
    saveData({ ...data, teachers }, ["teachers"]);
    updateUserSession({ ...user, photo });
    showToast("Foto profil disimpan");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5" style={{ color: "inherit" }}>Profil & Keamanan</h2>
      <Card className="mb-4">
        <h3 className="font-bold mb-4" style={{ color: "inherit" }}>Foto Profil</h3>
        <div className="flex items-center gap-6">
          <PhotoUpload currentPhoto={photo} onPhoto={setPhoto} size={100} />
          <div>
            <p className="text-white font-semibold">{user.name}</p>
            <p className="text-sm" style={{ color: "inherit", opacity: 0.7 }}>NIP: {user.nip}</p>
            <p className="text-sm" style={{ color: "inherit", opacity: 0.7 }}>{(user.subjects || []).length} mata pelajaran</p>
            <Btn className="mt-3" onClick={handleSavePhoto}><Save size={14} />Simpan Foto</Btn>
          </div>
        </div>
      </Card>
      <Card>
        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Key size={18} />Ubah Password Login</h3>
        <p className="text-sm mb-4" style={{ color: "inherit", opacity: 0.7 }}>Password default adalah NIP Anda. Ubah untuk keamanan lebih baik.</p>
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
    { id: "tryout", label: "Tryout / Latihan", icon: <Play size={18} /> },
    { id: "results", label: "Hasil Saya", icon: <Award size={18} /> },
    { id: "profile", label: "Profil Saya", icon: <User size={18} /> },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout} tabs={tabs} activeTab={tab} setActiveTab={setTab}>
      {tab === "exams" && (
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "inherit" }}>Selamat Datang, {user.name}</h2>
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
                          <h4 className="font-bold" style={{ color: "inherit" }}>{exam.title}</h4>
                          <div className="text-sm" style={{ color: "inherit", opacity: 0.7 }}>{answered}/{exam.questionIds.length} soal dijawab</div>
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
                      <h4 className="font-bold" style={{ color: "inherit" }}>{ex.title}</h4>
                      <div className="text-sm" style={{ color: "inherit", opacity: 0.7 }}>{(data.subjects || []).find(s => s.id === ex.subjectId)?.name} • {ex.questionIds.length} soal • {ex.duration} menit</div>
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
          <h2 className="text-2xl font-bold mb-5" style={{ color: "inherit" }}>Riwayat Ujian Saya</h2>
          {myResults.length === 0 ? <Card><EmptyState icon={<Award size={40} className="mx-auto" />} text="Belum ada hasil ujian" /></Card> : (
            <div className="space-y-3">
              {myResults.sort((a, b) => b.submittedAt - a.submittedAt).map(r => {
                const exam = data.exams.find(e => e.id === r.examId);
                const subject = (data.subjects || []).find(s => s.id === exam?.subjectId);
                return (
                  <Card key={r.id}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold" style={{ color: "inherit" }}>{exam?.title || "Ujian"}</div>
                        <div className="text-sm" style={{ color: "inherit", opacity: 0.7 }}>{subject?.name} • {r.correct}/{exam?.questionIds?.length || 0} benar</div>
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

      {tab === "tryout" && <TryoutView data={data} user={user} showToast={showToast} />}
      {tab === "profile" && <StudentProfile data={data} saveData={saveData} user={user} showToast={showToast} updateUserSession={updateUserSession} />}
    </DashboardLayout>
  );
}

// ============= TRYOUT VIEW =============
function TryoutView({ data, user, showToast }) {
  const [activeExam, setActiveExam] = useState(null);
  const [tryoutResult, setTryoutResult] = useState(null);

  // All exams marked as tryout OR all ended exams available as practice
  const tryoutExams = data.exams.filter(e =>
    e.isTryout || e.status === "ended"
  );

  if (activeExam && !tryoutResult) {
    return <TryoutTaker data={data} user={user} exam={activeExam}
      onFinish={(res) => { setTryoutResult(res); }}
      showToast={showToast} />;
  }

  if (tryoutResult) {
    const exam = data.exams.find(e => e.id === activeExam?.id);
    return (
      <div>
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-3" style={{ background: tryoutResult.score >= 75 ? "rgba(22,163,74,0.2)" : "rgba(220,38,38,0.15)" }}>
            <Award size={36} style={{ color: tryoutResult.score >= 75 ? "#4ade80" : "#f87171" }} />
          </div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: "inherit" }}>Tryout Selesai!</h2>
          <p className="text-sm mb-4" style={{ color: "inherit", opacity: 0.7 }}>{exam?.title}</p>
          <div className="text-6xl font-bold mb-2" style={{ color: tryoutResult.score >= 75 ? "#4ade80" : "#f87171" }}>{tryoutResult.score.toFixed(1)}</div>
          <p className="text-sm mb-1" style={{ color: "inherit", opacity: 0.7 }}>Benar: {tryoutResult.correct} dari {tryoutResult.total} soal</p>
          <p className="text-xs" style={{ color: "inherit", opacity: 0.5 }}>Ini adalah latihan — tidak tercatat sebagai nilai resmi</p>
        </div>
        {/* Per-question review */}
        <Card className="mb-4">
          <h3 className="font-bold mb-3" style={{ color: "inherit" }}>Review Jawaban</h3>
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {tryoutResult.questions.map((q, i) => {
              const userAns = tryoutResult.answers[i];
              const isCorrect = userAns === q.correctAnswer;
              const qType = q.type || "pilgan";
              return (
                <div key={i} className="p-3 rounded-xl" style={{ background: isCorrect ? "rgba(22,163,74,0.08)" : "rgba(220,38,38,0.08)", border: "1px solid " + (isCorrect ? "rgba(22,163,74,0.2)" : "rgba(220,38,38,0.15)") }}>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-xs px-1.5 py-0.5 rounded font-bold shrink-0" style={{ background: isCorrect ? "rgba(22,163,74,0.2)" : "rgba(220,38,38,0.2)", color: isCorrect ? "#4ade80" : "#f87171" }}>{isCorrect ? "✓" : "✗"}</span>
                    <span className="text-sm" style={{ color: "inherit" }}><strong>#{i+1}</strong> {q.text?.substring(0,100)}</span>
                  </div>
                  {(qType === "pilgan" || qType === "benar_salah") && (
                    <div className="text-xs space-y-1 ml-6">
                      {userAns !== undefined && userAns !== q.correctAnswer && <div style={{ color: "#f87171" }}>Jawaban kamu: {qType === "benar_salah" ? (userAns === 0 ? "Benar" : "Salah") : (q.options?.[userAns] ? String.fromCharCode(65+userAns)+". "+q.options[userAns] : "-")}</div>}
                      <div style={{ color: "#4ade80" }}>Kunci: {qType === "benar_salah" ? (q.correctAnswer === 0 ? "Benar" : "Salah") : (q.options?.[q.correctAnswer] ? String.fromCharCode(65+q.correctAnswer)+". "+q.options[q.correctAnswer] : "-")}</div>
                      {q.explanation && <div className="text-blue-300 mt-1">💡 {q.explanation}</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
        <div className="flex gap-3 justify-center">
          <Btn variant="secondary" onClick={() => { setTryoutResult(null); setActiveExam(null); }}><ArrowLeft size={14} />Kembali</Btn>
          <Btn onClick={() => { setTryoutResult(null); }}><RefreshCw size={14} />Coba Lagi</Btn>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: "inherit" }}>Tryout & Latihan</h2>
      <p className="text-sm mb-6" style={{ color: "inherit", opacity: 0.6 }}>Latihan ujian tanpa batas waktu dan nilai tidak tercatat. Cocok untuk persiapan ujian resmi.</p>
      {tryoutExams.length === 0 ? (
        <Card><EmptyState icon={<Play size={40} className="mx-auto" />} text="Belum ada tryout tersedia" /></Card>
      ) : (
        <div className="space-y-3">
          {tryoutExams.map(ex => {
            const subj = data.subjects?.find(s => s.id === ex.subjectId);
            const qCount = ex.questionIds?.length || 0;
            return (
              <Card key={ex.id}>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold" style={{ color: "inherit" }}>{ex.title}</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(168,85,247,0.2)", color: "#c084fc" }}>Tryout</span>
                    </div>
                    <p className="text-sm" style={{ color: "inherit", opacity: 0.7 }}>{subj?.name} • {qCount} soal • Tidak ada batas waktu</p>
                  </div>
                  <Btn onClick={() => setActiveExam(ex)}><Play size={14} />Mulai Latihan</Btn>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============= TRYOUT TAKER =============
function TryoutTaker({ data, user, exam, onFinish, showToast }) {
  const questions = useMemo(() => {
    let qs = (exam.questionIds || []).map(id => data.questions.find(q => q.id === id)).filter(Boolean);
    if (exam.shuffleQuestions) {
      qs = [...qs];
      for (let i = qs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [qs[i], qs[j]] = [qs[j], qs[i]];
      }
    }
    return qs;
  }, [exam, data.questions]);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showNav, setShowNav] = useState(false);

  const handleSubmit = () => {
    if (!confirm("Selesaikan tryout ini?")) return;
    let correct = 0;
    questions.forEach((q, i) => {
      if (!q.type || q.type === "pilgan" || q.type === "benar_salah") {
        if (answers[i] === q.correctAnswer) correct++;
      }
    });
    const total = questions.filter(q => !q.type || q.type === "pilgan" || q.type === "benar_salah").length || questions.length;
    const score = total > 0 ? (correct / total) * 100 : 0;
    onFinish({ score, correct, total, answers, questions });
  };

  const q = questions[currentQ];
  if (!q) return null;
  const answeredCount = Object.values(answers).filter(v => v !== undefined && v !== "").length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 p-3 rounded-xl" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
        <div>
          <div className="text-sm font-bold" style={{ color: "#c084fc" }}>{exam.title} — Mode Latihan</div>
          <div className="text-xs" style={{ color: "inherit", opacity: 0.6 }}>Soal {currentQ+1}/{questions.length} • {answeredCount} dijawab</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowNav(!showNav)} className="p-2 rounded-lg" style={{ background: "rgba(51,65,85,0.5)", color: "inherit" }}><Hash size={16} /></button>
        </div>
      </div>

      {showNav && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowNav(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-64 p-4 overflow-y-auto" style={{ background: "#1e293b" }}>
            <div className="flex items-center justify-between mb-4"><h3 className="font-bold" style={{ color: "inherit" }}>Navigasi Soal</h3><button onClick={() => setShowNav(false)}><X size={18} /></button></div>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, i) => (
                <button key={i} onClick={() => { setCurrentQ(i); setShowNav(false); }} className="aspect-square rounded-lg text-sm font-bold" style={{ background: answers[i] !== undefined ? "rgba(22,163,74,0.4)" : i === currentQ ? "#3b82f6" : "rgba(51,65,85,0.5)", color: "white" }}>{i+1}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Card className="mb-4">
        <div className="text-xs mb-2 text-blue-400">Soal {currentQ+1} dari {questions.length}</div>
        <p className="text-base leading-relaxed mb-2" style={{ color: "inherit" }}>{q.text}</p>
        {q.image && <img src={q.image} alt="" className="max-w-full rounded-xl mb-2" style={{ maxHeight: 200 }} />}
      </Card>

      <div className="mb-6">
        {(!q.type || q.type === "pilgan") && q.options?.map((opt, i) => (
          <button key={i} onClick={() => setAnswers(a => ({ ...a, [currentQ]: i }))} className="w-full text-left flex items-center gap-3 p-3 rounded-xl mb-2 transition" style={{ background: answers[currentQ] === i ? "rgba(59,130,246,0.2)" : "rgba(30,41,59,0.6)", border: "2px solid " + (answers[currentQ] === i ? "#3b82f6" : "rgba(59,130,246,0.1)") }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: answers[currentQ] === i ? "#3b82f6" : "rgba(51,65,85,0.5)", color: "white" }}>{String.fromCharCode(65+i)}</div>
            <span className="text-sm" style={{ color: "inherit" }}>{opt}</span>
          </button>
        ))}
        {q.type === "benar_salah" && ["Benar","Salah"].map((opt, i) => (
          <button key={opt} onClick={() => setAnswers(a => ({ ...a, [currentQ]: i }))} className="flex-1 mr-2 py-3 rounded-xl font-bold transition" style={{ background: answers[currentQ] === i ? (i===0?"rgba(22,163,74,0.3)":"rgba(220,38,38,0.3)") : "rgba(30,41,59,0.6)", border: "2px solid " + (answers[currentQ] === i ? (i===0?"#16a34a":"#dc2626") : "rgba(59,130,246,0.1)"), color: "inherit", minWidth: 100 }}>{opt}</button>
        ))}
        {(q.type === "esai" || q.type === "uraian") && (
          <textarea value={answers[currentQ] || ""} onChange={e => setAnswers(a => ({ ...a, [currentQ]: e.target.value }))} rows={6} placeholder="Tulis jawaban kamu..." className="w-full p-3 rounded-xl text-sm outline-none resize-none" style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(59,130,246,0.3)", color: "inherit" }} />
        )}
      </div>

      <div className="flex items-center justify-between">
        <Btn variant="secondary" onClick={() => setCurrentQ(c => Math.max(0,c-1))} disabled={currentQ===0}><ArrowLeft size={14} />Sebelumnya</Btn>
        {currentQ === questions.length-1 ? (
          <Btn variant="success" onClick={handleSubmit}><CheckCircle size={14} />Selesai</Btn>
        ) : (
          <Btn onClick={() => setCurrentQ(c => Math.min(questions.length-1,c+1))}>Selanjutnya<ChevronRight size={14} /></Btn>
        )}
      </div>
      <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: "rgba(51,65,85,0.4)" }}>
        <div className="h-full rounded-full" style={{ width: (answeredCount/questions.length*100) + "%", background: "#8b5cf6" }} />
      </div>
    </div>
  );
}

// ============= STUDENT PROFILE =============
function StudentProfile({ data, saveData, user, showToast, updateUserSession }) {
  const [photo, setPhoto] = useState(user.photo || "");

  const handleSavePhoto = () => {
    const students = data.students.map(s => s.id === user.id ? { ...s, photo } : s);
    saveData({ ...data, students }, ["students"]);
    updateUserSession({ ...user, photo });
    showToast("Foto profil disimpan");
  };

  const myResults = (data.results || []).filter(r => r.studentId === user.id);
  const avg = myResults.length > 0 ? (myResults.reduce((a, r) => a + r.score, 0) / myResults.length).toFixed(1) : "-";
  const best = myResults.length > 0 ? Math.max(...myResults.map(r => r.score)).toFixed(1) : "-";

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5" style={{ color: "inherit" }}>Profil Saya</h2>
      <Card className="mb-4">
        <div className="flex items-center gap-6 flex-wrap">
          <PhotoUpload currentPhoto={photo} onPhoto={setPhoto} size={100} />
          <div className="flex-1">
            <p className="font-bold text-xl" style={{ color: "inherit" }}>{user.name}</p>
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

  // Comprehensive lockdown
  useEffect(() => {
    if (submitted) return;
    const prevent = e => e.preventDefault();
    const preventKeys = e => {
      // Block all common cheating shortcuts
      if ((e.ctrlKey || e.metaKey) && ["c","v","a","p","s","u","i","j","k","r","f","g","e","n","t","w"].includes(e.key.toLowerCase())) e.preventDefault();
      if (e.key === "F12" || e.key === "F5" || e.key === "F11") e.preventDefault();
      if ((e.ctrlKey && e.shiftKey) || (e.altKey && e.key === "Tab")) e.preventDefault();
      if (e.key === "PrintScreen") { e.preventDefault(); setViolations(v => v + 1); }
    };
    const preventDrag = e => e.preventDefault();
    const preventSelect = e => e.preventDefault();
    // Block devtools open via resize (heuristic)
    const devtoolsCheck = () => {
      const threshold = 160;
      if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
        setViolations(v => v + 1);
      }
    };
    const devInterval = setInterval(devtoolsCheck, 3000);
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("paste", prevent);
    document.addEventListener("keydown", preventKeys);
    document.addEventListener("dragstart", preventDrag);
    document.addEventListener("selectstart", preventSelect);
    // Block print
    window.addEventListener("beforeprint", prevent);
    return () => {
      clearInterval(devInterval);
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("paste", prevent);
      document.removeEventListener("keydown", preventKeys);
      document.removeEventListener("dragstart", preventDrag);
      document.removeEventListener("selectstart", preventSelect);
      window.removeEventListener("beforeprint", prevent);
    };
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
        saveData({ ...currentData, sessions }, ["sessions"]);
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
    saveData({ ...currentData, results, sessions }, ["results","sessions"]);
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
          <h2 className="text-2xl font-bold mb-1" style={{ color: "inherit" }}>Ujian Selesai!</h2>
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
              <h3 className="font-bold" style={{ color: "inherit" }}>Navigasi Soal</h3>
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
