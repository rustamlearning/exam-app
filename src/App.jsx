import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { BookOpen, Users, GraduationCap, Settings, LogOut, Plus, Trash2, Edit, Eye, Clock, AlertTriangle, CheckCircle, XCircle, Monitor, Upload, Image, ChevronRight, Menu, X, Search, FileText, BarChart3, Shield, Lock, Save, RefreshCw, ChevronDown, ArrowLeft, Home, User, Hash, Layers, Play, Square, Award, Bell, AlertCircle } from "lucide-react";
import mammoth from "mammoth";

// ============= CONSTANTS =============
const SCHOOL_NAME = "SMA Negeri 6 Pangkajene dan Kepulauan";
const SCHOOL_SHORT = "SMAN 6 PANGKEP";

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

const KELAS_OPTIONS = ["X-MIPA 1","X-MIPA 2","X-MIPA 3","X-IPS 1","X-IPS 2","X-IPS 3","XI-MIPA 1","XI-MIPA 2","XI-MIPA 3","XI-IPS 1","XI-IPS 2","XI-IPS 3","XII-MIPA 1","XII-MIPA 2","XII-MIPA 3","XII-IPS 1","XII-IPS 2","XII-IPS 3"];

const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

// ============= FIREBASE CONFIG =============
// Ganti nilai di bawah ini dengan konfigurasi Firebase project Anda
// Cara mendapatkannya: https://console.firebase.google.com → Project Settings → Web App
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

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

// ============= STORAGE HELPERS =============
const store = {
  async get(key) {
    try {
      const ref = doc(db, "examapp", key);
      const snap = await getDoc(ref);
      return snap.exists() ? snap.data().value : null;
    } catch (e) {
      console.error("Firebase get error:", e);
      return null;
    }
  },
  async set(key, val) {
    try {
      const ref = doc(db, "examapp", key);
      await setDoc(ref, { value: val });
    } catch (e) {
      console.error("Firebase set error:", e);
    }
  }
};

const DEFAULT_DATA = {
  admin: { username: "admin", password: "admin123" },
  teachers: [],
  students: [],
  subjects: MAPEL_K13,
  questions: [],
  exams: [],
  sessions: [],
  results: [],
};

// ============= MAIN APP =============
export default function ExamApp() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(() => {
    try { const s = localStorage.getItem("exam_user"); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(() => {
    try { return localStorage.getItem("exam_view") || "login"; } catch { return "login"; }
  });
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Real-time sync with onSnapshot
  useEffect(() => {
    const ref = doc(db, "examapp", "examapp_data");
    
    // Initial load
    (async () => {
      let snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, { value: DEFAULT_DATA });
        snap = await getDoc(ref);
      }
      let d = snap.data().value;
      if (!d.subjects || d.subjects.length === 0) d.subjects = MAPEL_K13;
      if (!d.sessions) d.sessions = [];
      if (!d.results) d.results = [];
      setData(d);
      setLoading(false);
    })();

    // Listen for real-time changes
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const d = snap.data().value;
        if (d) {
          if (!d.subjects || d.subjects.length === 0) d.subjects = MAPEL_K13;
          if (!d.sessions) d.sessions = [];
          if (!d.results) d.results = [];
          setData(d);
        }
      }
    }, (err) => console.error("Sync error:", err));
    return () => unsub();
  }, []);

  const saveData = useCallback(async (newData) => {
    setData(newData);
    await store.set("examapp_data", newData);
  }, []);

  const handleLogin = useCallback((credentials) => {
    if (!data) return;
    const { role, username, password } = credentials;
    if (role === "admin") {
      if (username === data.admin.username && password === data.admin.password) {
        const u = { role: "admin", name: "Administrator" };
        setUser(u); setView("admin");
        localStorage.setItem("exam_user", JSON.stringify(u));
        localStorage.setItem("exam_view", "admin");
        showToast("Login berhasil sebagai Admin");
      } else { showToast("Username atau password salah", "error"); }
    } else if (role === "guru") {
      const guru = data.teachers.find(t => t.name.toLowerCase() === username.toLowerCase() && (t.password || t.nip) === password);
      if (guru) {
        const u = { role: "guru", ...guru };
        setUser(u); setView("guru");
        localStorage.setItem("exam_user", JSON.stringify(u));
        localStorage.setItem("exam_view", "guru");
        showToast(`Selamat datang, ${guru.name}`);
      } else { showToast("Nama atau NIP salah", "error"); }
    } else if (role === "siswa") {
      const siswa = data.students.find(s => s.name.toLowerCase() === username.toLowerCase() && s.nisn === password);
      if (siswa) {
        const u = { role: "siswa", ...siswa };
        setUser(u); setView("siswa");
        localStorage.setItem("exam_user", JSON.stringify(u));
        localStorage.setItem("exam_view", "siswa");
        showToast(`Selamat datang, ${siswa.name}`);
      } else { showToast("Nama atau NISN salah", "error"); }
    }
  }, [data, showToast]);

  const handleLogout = useCallback(() => {
    setUser(null);
    setView("login");
    localStorage.removeItem("exam_user");
    localStorage.removeItem("exam_view");
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      {view === "login" && <LoginScreen onLogin={handleLogin} />}
      {view === "admin" && <AdminDashboard data={data} saveData={saveData} user={user} onLogout={handleLogout} showToast={showToast} />}
      {view === "guru" && <TeacherDashboard data={data} saveData={saveData} user={user} onLogout={handleLogout} showToast={showToast} />}
      {view === "siswa" && <StudentDashboard data={data} saveData={saveData} user={user} onLogout={handleLogout} showToast={showToast} />}
    </div>
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
    <div className="fixed top-4 right-4 z-[9999] px-5 py-3 rounded-xl shadow-2xl text-white font-medium flex items-center gap-2" style={{ background: type === "error" ? "#dc2626" : type === "warning" ? "#d97706" : "#16a34a", animation: "slideIn .3s ease" }}>
      {type === "error" ? <XCircle size={18} /> : type === "warning" ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
      {msg}
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}

// ============= LOGIN SCREEN =============
function LoginScreen({ onLogin }) {
  const [role, setRole] = useState("siswa");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const labels = { admin: { u: "Username", p: "Password" }, guru: { u: "Nama Lengkap", p: "NIP" }, siswa: { u: "Nama Lengkap", p: "NISN" } };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}>
            <GraduationCap size={40} color="white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Segoe UI', sans-serif" }}>{SCHOOL_SHORT}</h1>
          <p className="text-blue-300 text-sm">Sistem Ujian Sekolah Digital</p>
          <p className="text-blue-400 text-xs mt-1">{SCHOOL_NAME}</p>
        </div>

        <div className="rounded-2xl p-6 shadow-2xl" style={{ background: "rgba(30,41,59,0.95)", backdropFilter: "blur(20px)", border: "1px solid rgba(59,130,246,0.2)" }}>
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
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder={labels[role].u} className="w-full py-3 px-3 bg-transparent text-white outline-none placeholder-slate-500" />
              </div>
            </div>
            <div>
              <label className="text-blue-300 text-sm font-medium mb-1 block">{labels[role].p}</label>
              <div className="flex items-center rounded-xl px-3" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.3)" }}>
                <Lock size={18} className="text-blue-400" />
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder={labels[role].p} className="w-full py-3 px-3 bg-transparent text-white outline-none placeholder-slate-500" />
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
  const [sideOpen, setSideOpen] = useState(false);
  return (
    <div className="min-h-screen flex">
      {sideOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSideOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transition-transform lg:translate-x-0 ${sideOpen ? "translate-x-0" : "-translate-x-full"}`} style={{ background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)", borderRight: "1px solid rgba(59,130,246,0.15)" }}>
        <div className="p-4 border-b" style={{ borderColor: "rgba(59,130,246,0.15)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}>
              <GraduationCap size={22} color="white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">{SCHOOL_SHORT}</div>
              <div className="text-blue-400 text-xs">Ujian Digital</div>
            </div>
          </div>
        </div>
        <div className="p-3">
          <div className="px-3 py-2 rounded-lg mb-2" style={{ background: "rgba(59,130,246,0.1)" }}>
            <div className="text-white text-sm font-semibold truncate">{user.name}</div>
            <div className="text-blue-400 text-xs capitalize">{user.role}</div>
          </div>
        </div>
        <nav className="px-3 space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setActiveTab(t.id); setSideOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all" style={{ background: activeTab === t.id ? "rgba(59,130,246,0.2)" : "transparent", color: activeTab === t.id ? "#60a5fa" : "#94a3b8" }}>
              {t.icon}{t.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-4 left-3 right-3">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"><LogOut size={18} />Keluar</button>
        </div>
      </aside>
      <main className="flex-1 min-h-screen">
        <header className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3 lg:hidden" style={{ background: "rgba(15,23,42,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(59,130,246,0.15)" }}>
          <button onClick={() => setSideOpen(true)} className="text-white"><Menu size={24} /></button>
          <span className="text-white font-semibold">{tabs.find(t => t.id === activeTab)?.label}</span>
        </header>
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}

// ============= REUSABLE COMPONENTS =============
function Card({ children, className = "", ...props }) {
  return <div className={`rounded-2xl p-5 ${className}`} style={{ background: "rgba(30,41,59,0.9)", border: "1px solid rgba(59,130,246,0.15)", ...props.style }}>{children}</div>;
}

function Btn({ children, variant = "primary", className = "", ...props }) {
  const styles = { primary: "linear-gradient(135deg, #3b82f6, #1d4ed8)", danger: "linear-gradient(135deg, #dc2626, #991b1b)", success: "linear-gradient(135deg, #16a34a, #15803d)", secondary: "rgba(51,65,85,0.8)" };
  return <button className={`px-4 py-2 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 flex items-center gap-2 ${className}`} style={{ background: styles[variant] || styles.primary }} {...props}>{children}</button>;
}

function Input({ label, ...props }) {
  return (
    <div>
      {label && <label className="text-blue-300 text-sm font-medium mb-1 block">{label}</label>}
      <input className="w-full py-2.5 px-3 rounded-xl bg-transparent text-white outline-none placeholder-slate-500 text-sm" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.25)" }} {...props} />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div>
      {label && <label className="text-blue-300 text-sm font-medium mb-1 block">{label}</label>}
      <select className="w-full py-2.5 px-3 rounded-xl text-white outline-none text-sm" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.25)" }} {...props}>{children}</select>
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

// ============= ADMIN DASHBOARD =============
function AdminDashboard({ data, saveData, user, onLogout, showToast }) {
  const [tab, setTab] = useState("dashboard");
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { id: "teachers", label: "Data Guru", icon: <Users size={18} /> },
    { id: "students", label: "Data Siswa", icon: <GraduationCap size={18} /> },
    { id: "subjects", label: "Mata Pelajaran", icon: <BookOpen size={18} /> },
    { id: "exams", label: "Kelola Ujian", icon: <FileText size={18} /> },
    { id: "questions", label: "Bank Soal", icon: <FileText size={18} /> },
    { id: "import", label: "Import Soal", icon: <Upload size={18} /> },
    { id: "monitor", label: "Monitoring", icon: <Monitor size={18} /> },
    { id: "results", label: "Hasil Ujian", icon: <BarChart3 size={18} /> },
    { id: "settings", label: "Pengaturan", icon: <Settings size={18} /> },
  ];

  return (
    <DashboardLayout user={user} onLogout={onLogout} tabs={tabs} activeTab={tab} setActiveTab={setTab}>
      {tab === "dashboard" && <AdminHome data={data} />}
      {tab === "teachers" && <TeacherManager data={data} saveData={saveData} showToast={showToast} />}
      {tab === "students" && <StudentManager data={data} saveData={saveData} showToast={showToast} />}
      {tab === "subjects" && <SubjectManager data={data} saveData={saveData} showToast={showToast} />}
      {tab === "exams" && <ExamManager data={data} saveData={saveData} showToast={showToast} isAdmin />}
      {tab === "questions" && <QuestionManager data={data} saveData={saveData} showToast={showToast} />}
      {tab === "import" && <ImportSoal data={data} saveData={saveData} showToast={showToast} userId="admin" />}
      {tab === "monitor" && <MonitorView data={data} saveData={saveData} />}
      {tab === "results" && <ResultsView data={data} />}
      {tab === "settings" && <SettingsView data={data} saveData={saveData} showToast={showToast} />}
    </DashboardLayout>
  );
}

function AdminHome({ data }) {
  const activeExams = data.exams.filter(e => e.status === "active").length;
  const totalQ = data.questions.length;
  return (
    <div>
      <h2 className="text-white text-2xl font-bold mb-6">Dashboard Admin</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Users size={24} className="text-blue-400" />} label="Total Guru" value={data.teachers.length} />
        <StatCard icon={<GraduationCap size={24} className="text-green-400" />} label="Total Siswa" value={data.students.length} color="#16a34a" />
        <StatCard icon={<FileText size={24} className="text-purple-400" />} label="Bank Soal" value={totalQ} color="#9333ea" />
        <StatCard icon={<Play size={24} className="text-amber-400" />} label="Ujian Aktif" value={activeExams} color="#d97706" />
      </div>
      <Card>
        <h3 className="text-white font-bold mb-3">Ringkasan Mata Pelajaran</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {["Wajib","MIPA","IPS","Bahasa","Lintas Minat"].map(cat => {
            const count = data.subjects.filter(s => s.category === cat).length;
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
function TeacherManager({ data, saveData, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", nip: "", subjects: [] });
  const [search, setSearch] = useState("");

  const openAdd = () => { setEditId(null); setForm({ name: "", nip: "", subjects: [] }); setShowModal(true); };
  const openEdit = (t) => { setEditId(t.id); setForm({ name: t.name, nip: t.nip, subjects: t.subjects || [] }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name.trim() || !form.nip.trim()) return showToast("Nama dan NIP wajib diisi", "error");
    let teachers = [...data.teachers];
    if (editId) {
      teachers = teachers.map(t => t.id === editId ? { ...t, ...form } : t);
    } else {
      if (teachers.find(t => t.nip === form.nip)) return showToast("NIP sudah terdaftar", "error");
      teachers.push({ id: genId(), ...form });
    }
    saveData({ ...data, teachers });
    setShowModal(false);
    showToast(editId ? "Data guru diperbarui" : "Guru berhasil ditambahkan");
  };

  const handleDelete = (id) => {
    if (!confirm("Hapus guru ini?")) return;
    saveData({ ...data, teachers: data.teachers.filter(t => t.id !== id) });
    showToast("Guru dihapus");
  };

  const toggleSubject = (sid) => {
    setForm(f => ({ ...f, subjects: f.subjects.includes(sid) ? f.subjects.filter(s => s !== sid) : [...f.subjects, sid] }));
  };

  const filtered = data.teachers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.nip.includes(search));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-white text-2xl font-bold">Data Guru</h2>
        <Btn onClick={openAdd}><Plus size={16} />Tambah Guru</Btn>
      </div>
      <Card>
        <div className="mb-4">
          <div className="flex items-center rounded-xl px-3" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.2)" }}>
            <Search size={16} className="text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari guru..." className="w-full py-2 px-3 bg-transparent text-white text-sm outline-none placeholder-slate-500" />
          </div>
        </div>
        {filtered.length === 0 ? <EmptyState icon={<Users size={40} className="mx-auto" />} text="Belum ada data guru" /> : (
          <div className="space-y-2">
            {filtered.map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>{t.name[0]}</div>
                  <div>
                    <div className="text-white font-medium text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs">NIP: {t.nip} • {(t.subjects || []).length} mapel</div>
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
            <Input label="Nama Lengkap" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Masukkan nama guru" />
            <Input label="NIP" value={form.nip} onChange={e => setForm({ ...form, nip: e.target.value })} placeholder="Masukkan NIP" />
            <div>
              <label className="text-blue-300 text-sm font-medium mb-2 block">Mata Pelajaran yang Diampu</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-48 overflow-y-auto pr-1">
                {data.subjects.map(s => (
                  <button key={s.id} onClick={() => toggleSubject(s.id)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-xs transition" style={{ background: form.subjects.includes(s.id) ? "rgba(59,130,246,0.2)" : "rgba(15,23,42,0.5)", color: form.subjects.includes(s.id) ? "#60a5fa" : "#94a3b8" }}>
                    <div className="w-4 h-4 rounded border flex items-center justify-center" style={{ borderColor: form.subjects.includes(s.id) ? "#3b82f6" : "#475569", background: form.subjects.includes(s.id) ? "#3b82f6" : "transparent" }}>
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
function StudentManager({ data, saveData, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", nisn: "", kelas: KELAS_OPTIONS[0], peminatan: "MIPA" });
  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState("all");

  const openAdd = () => { setEditId(null); setForm({ name: "", nisn: "", kelas: KELAS_OPTIONS[0], peminatan: "MIPA" }); setShowModal(true); };
  const openEdit = (s) => { setEditId(s.id); setForm({ name: s.name, nisn: s.nisn, kelas: s.kelas, peminatan: s.peminatan || "MIPA" }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name.trim() || !form.nisn.trim()) return showToast("Nama dan NISN wajib diisi", "error");
    let students = [...data.students];
    if (editId) {
      students = students.map(s => s.id === editId ? { ...s, ...form } : s);
    } else {
      if (students.find(s => s.nisn === form.nisn)) return showToast("NISN sudah terdaftar", "error");
      students.push({ id: genId(), ...form });
    }
    saveData({ ...data, students });
    setShowModal(false);
    showToast(editId ? "Data siswa diperbarui" : "Siswa berhasil ditambahkan");
  };

  const handleDelete = (id) => {
    if (!confirm("Hapus siswa ini?")) return;
    saveData({ ...data, students: data.students.filter(s => s.id !== id) });
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
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}>{s.name[0]}</div>
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
    const subjects = [...data.subjects, { id: genId(), ...form }];
    saveData({ ...data, subjects });
    setShowModal(false);
    setForm({ name: "", category: "Wajib" });
    showToast("Mata pelajaran ditambahkan");
  };

  const handleDelete = (id) => {
    if (!confirm("Hapus mata pelajaran ini?")) return;
    saveData({ ...data, subjects: data.subjects.filter(s => s.id !== id) });
    showToast("Mata pelajaran dihapus");
  };

  const grouped = {};
  data.subjects.forEach(s => { if (!grouped[s.category]) grouped[s.category] = []; grouped[s.category].push(s); });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-white text-2xl font-bold">Mata Pelajaran K-13</h2>
        <Btn onClick={() => setShowModal(true)}><Plus size={16} />Tambah Mapel</Btn>
      </div>
      {Object.entries(grouped).map(([cat, subjects]) => (
        <Card key={cat} className="mb-4">
          <h3 className="text-blue-300 font-bold text-sm mb-3 uppercase tracking-wider">{cat}</h3>
          <div className="space-y-1">
            {subjects.map(s => (
              <div key={s.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5">
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-blue-400" />
                  <span className="text-white text-sm">{s.name}</span>
                </div>
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
function QuestionManager({ data, saveData, showToast, userId }) {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterSubject, setFilterSubject] = useState("all");
  const [form, setForm] = useState({ subjectId: "", text: "", image: "", options: ["", "", "", "", ""], correctAnswer: 0, explanation: "" });

  const myQuestions = data.questions.filter(q => !userId || q.createdBy === userId);
  const filtered = filterSubject === "all" ? myQuestions : myQuestions.filter(q => q.subjectId === filterSubject);

  const openAdd = () => { setEditId(null); setForm({ subjectId: data.subjects[0]?.id || "", text: "", image: "", options: ["", "", "", "", ""], correctAnswer: 0, explanation: "" }); setShowModal(true); };
  const openEdit = (q) => { setEditId(q.id); setForm({ subjectId: q.subjectId, text: q.text, image: q.image || "", options: [...q.options], correctAnswer: q.correctAnswer, explanation: q.explanation || "" }); setShowModal(true); };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/jpeg","image/png"].includes(file.type)) return showToast("Hanya file JPEG dan PNG yang diizinkan", "error");
    if (file.size > 5 * 1024 * 1024) return showToast("Ukuran file maksimal 5MB", "error");
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, image: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.subjectId || !form.text.trim()) return showToast("Mapel dan teks soal wajib diisi", "error");
    const validOpts = form.options.filter(o => o.trim());
    if (validOpts.length < 2) return showToast("Minimal 2 pilihan jawaban", "error");
    let questions = [...data.questions];
    const qData = { ...form, options: form.options.filter(o => o.trim()), createdBy: userId || "admin" };
    if (editId) {
      questions = questions.map(q => q.id === editId ? { ...q, ...qData } : q);
    } else {
      questions.push({ id: genId(), ...qData });
    }
    saveData({ ...data, questions });
    setShowModal(false);
    showToast(editId ? "Soal diperbarui" : "Soal berhasil ditambahkan");
  };

  const handleDelete = (id) => {
    if (!confirm("Hapus soal ini?")) return;
    saveData({ ...data, questions: data.questions.filter(q => q.id !== id) });
    showToast("Soal dihapus");
  };

  const getSubjectName = (sid) => data.subjects.find(s => s.id === sid)?.name || "-";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-white text-2xl font-bold">Bank Soal</h2>
        <Btn onClick={openAdd}><Plus size={16} />Tambah Soal</Btn>
      </div>
      <Card>
        <div className="mb-4">
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="py-2 px-3 rounded-xl text-white text-sm outline-none" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.2)" }}>
            <option value="all">Semua Mata Pelajaran</option>
            {data.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="text-slate-400 text-xs mb-3">{filtered.length} soal</div>
        {filtered.length === 0 ? <EmptyState icon={<FileText size={40} className="mx-auto" />} text="Belum ada soal" /> : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {filtered.map((q, i) => (
              <div key={q.id} className="p-3 rounded-xl" style={{ background: "rgba(15,23,42,0.5)" }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-blue-400 text-xs mb-1">{getSubjectName(q.subjectId)}</div>
                    <div className="text-white text-sm mb-2">{i + 1}. {q.text.substring(0, 150)}{q.text.length > 150 ? "..." : ""}</div>
                    {q.image && <div className="mb-2"><img src={q.image} alt="" className="max-h-24 rounded-lg" /></div>}
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
      {showModal && (
        <Modal title={editId ? "Edit Soal" : "Tambah Soal"} onClose={() => setShowModal(false)} wide>
          <div className="space-y-4">
            <Select label="Mata Pelajaran" value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })}>
              <option value="">-- Pilih Mapel --</option>
              {data.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
            <div>
              <label className="text-blue-300 text-sm font-medium mb-1 block">Teks Soal</label>
              <textarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} rows={4} placeholder="Masukkan teks soal..." className="w-full py-2.5 px-3 rounded-xl text-white text-sm outline-none resize-none placeholder-slate-500" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.25)" }} />
            </div>
            <div>
              <label className="text-blue-300 text-sm font-medium mb-1 block">Gambar Soal (Opsional - JPG/PNG, maks 5MB)</label>
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
            <div>
              <label className="text-blue-300 text-sm font-medium mb-1 block">Pembahasan (Opsional)</label>
              <textarea value={form.explanation} onChange={e => setForm({ ...form, explanation: e.target.value })} rows={2} placeholder="Tulis pembahasan..." className="w-full py-2.5 px-3 rounded-xl text-white text-sm outline-none resize-none placeholder-slate-500" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.25)" }} />
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

// ============= EXAM MANAGER =============
function ExamManager({ data, saveData, showToast, isAdmin, userId }) {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: "", subjectId: "", targetKelas: [], duration: 90, startTime: "", endTime: "", shuffleQuestions: true, shuffleOptions: false, showResult: true, questionIds: [] });

  const openAdd = () => {
    setEditId(null);
    const now = new Date();
    const later = new Date(now.getTime() + 2 * 60 * 60000);
    setForm({ title: "", subjectId: data.subjects[0]?.id || "", targetKelas: [], duration: 90, startTime: now.toISOString().slice(0, 16), endTime: later.toISOString().slice(0, 16), shuffleQuestions: true, shuffleOptions: false, showResult: true, questionIds: [] });
    setShowModal(true);
  };

  const openEdit = (ex) => { setEditId(ex.id); setForm({ ...ex }); setShowModal(true); };

  const availableQuestions = useMemo(() => {
    if (!form.subjectId) return [];
    return data.questions.filter(q => q.subjectId === form.subjectId);
  }, [form.subjectId, data.questions]);

  const toggleQuestion = (qid) => {
    setForm(f => ({ ...f, questionIds: f.questionIds.includes(qid) ? f.questionIds.filter(x => x !== qid) : [...f.questionIds, qid] }));
  };

  const toggleKelas = (k) => {
    setForm(f => ({ ...f, targetKelas: f.targetKelas.includes(k) ? f.targetKelas.filter(x => x !== k) : [...f.targetKelas, k] }));
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.subjectId) return showToast("Judul dan mapel wajib diisi", "error");
    if (form.questionIds.length === 0) return showToast("Pilih minimal 1 soal", "error");
    if (form.targetKelas.length === 0) return showToast("Pilih minimal 1 kelas", "error");
    let exams = [...data.exams];
    const examData = { ...form, status: "draft", createdBy: userId || "admin" };
    if (editId) {
      exams = exams.map(e => e.id === editId ? { ...e, ...examData } : e);
    } else {
      exams.push({ id: genId(), ...examData });
    }
    saveData({ ...data, exams });
    setShowModal(false);
    showToast(editId ? "Ujian diperbarui" : "Ujian berhasil dibuat");
  };

  const toggleStatus = (examId, newStatus) => {
    const exams = data.exams.map(e => e.id === examId ? { ...e, status: newStatus } : e);
    saveData({ ...data, exams });
    showToast(`Ujian ${newStatus === "active" ? "diaktifkan" : newStatus === "ended" ? "diakhiri" : "di-draft-kan"}`);
  };

  const handleDelete = (id) => {
    if (!confirm("Hapus ujian ini?")) return;
    saveData({ ...data, exams: data.exams.filter(e => e.id !== id) });
    showToast("Ujian dihapus");
  };

  const getSubjectName = (sid) => data.subjects.find(s => s.id === sid)?.name || "-";
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
          {myExams.map(ex => (
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
          ))}
        </div>
      )}
      {showModal && (
        <Modal title={editId ? "Edit Ujian" : "Buat Ujian Baru"} onClose={() => setShowModal(false)} wide>
          <div className="space-y-4">
            <Input label="Judul Ujian" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="cth: Ujian Akhir Semester Matematika" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Mata Pelajaran" value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value, questionIds: [] })}>
                {data.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
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
                <p className="text-slate-500 text-sm">Belum ada soal untuk mapel ini. Tambahkan soal terlebih dahulu.</p>
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
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.shuffleQuestions} onChange={e => setForm({ ...form, shuffleQuestions: e.target.checked })} className="w-4 h-4 rounded" />
                <span className="text-slate-300 text-sm">Acak urutan soal</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.shuffleOptions} onChange={e => setForm({ ...form, shuffleOptions: e.target.checked })} className="w-4 h-4 rounded" />
                <span className="text-slate-300 text-sm">Acak pilihan jawaban</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.showResult} onChange={e => setForm({ ...form, showResult: e.target.checked })} className="w-4 h-4 rounded" />
                <span className="text-slate-300 text-sm">Tampilkan hasil ke siswa</span>
              </label>
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
function MonitorView({ data, saveData }) {
  const [selectedExam, setSelectedExam] = useState(null);
  const [, forceUpdate] = useState(0);
  useEffect(() => { const iv = setInterval(() => forceUpdate(n => n + 1), 3000); return () => clearInterval(iv); }, []);

  const activeExams = data.exams.filter(e => e.status === "active");

  if (selectedExam) {
    const exam = data.exams.find(e => e.id === selectedExam);
    if (!exam) return null;
    const sessions = (data.sessions || []).filter(s => s.examId === selectedExam);
    const targetStudents = data.students.filter(s => exam.targetKelas?.includes(s.kelas));
    const totalQ = exam.questionIds.length;

    return (
      <div>
        <button onClick={() => setSelectedExam(null)} className="flex items-center gap-2 text-blue-400 mb-4 hover:underline"><ArrowLeft size={16} />Kembali</button>
        <h2 className="text-white text-2xl font-bold mb-2">{exam.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <StatCard icon={<Users size={20} className="text-blue-400" />} label="Total Peserta" value={targetStudents.length} />
          <StatCard icon={<Play size={20} className="text-green-400" />} label="Sedang Mengerjakan" value={sessions.filter(s => s.status === "active").length} color="#16a34a" />
          <StatCard icon={<CheckCircle size={20} className="text-amber-400" />} label="Selesai" value={sessions.filter(s => s.status === "submitted").length} color="#d97706" />
        </div>
        <Card>
          <h3 className="text-white font-bold mb-3">Status Peserta</h3>
          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            {targetStudents.map(st => {
              const session = sessions.find(s => s.studentId === st.id);
              let statusText = "Belum mulai", statusColor = "#64748b";
              if (session?.status === "active") { statusText = `Mengerjakan (${Object.keys(session.answers || {}).length}/${totalQ})`; statusColor = "#3b82f6"; }
              else if (session?.status === "submitted") { statusText = "Selesai"; statusColor = "#16a34a"; }
              const violations = session?.violations || 0;
              return (
                <div key={st.id} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: "rgba(15,23,42,0.5)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: statusColor }} />
                    <div>
                      <div className="text-white text-sm font-medium">{st.name}</div>
                      <div className="text-slate-400 text-xs">{st.kelas} • NISN: {st.nisn}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {violations > 0 && (
                      <div className="flex items-center gap-1 text-red-400 text-xs"><AlertTriangle size={12} />{violations}x pelanggaran</div>
                    )}
                    <span className="text-xs font-medium" style={{ color: statusColor }}>{statusText}</span>
                  </div>
                </div>
              );
            })}
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
            return (
              <Card key={ex.id} className="cursor-pointer hover:border-blue-500/40 transition" onClick={() => setSelectedExam(ex.id)}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold">{ex.title}</h3>
                    <div className="text-slate-400 text-sm">{data.subjects.find(s => s.id === ex.subjectId)?.name} • {ex.questionIds.length} soal • {ex.duration} menit</div>
                    <div className="text-blue-400 text-xs mt-1">{sessions.filter(s => s.status === "active").length} sedang mengerjakan • {sessions.filter(s => s.status === "submitted").length} selesai</div>
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

// ============= PRINT RESULTS PDF =============
function printResults(exam, results, data) {
  const subjectName = data.subjects.find(s => s.id === exam?.subjectId)?.name || "-";
  const avg = results.length > 0 ? (results.reduce((a, r) => a + r.score, 0) / results.length).toFixed(1) : "0";
  const highest = results.length > 0 ? Math.max(...results.map(r => r.score)).toFixed(1) : "0";
  const lowest = results.length > 0 ? Math.min(...results.map(r => r.score)).toFixed(1) : "0";
  const passed = results.filter(r => r.score >= 75).length;
  
  const rows = results.sort((a, b) => b.score - a.score).map((r, i) => {
    const st = data.students.find(s => s.id === r.studentId);
    return `<tr><td style="padding:6px 8px;border:1px solid #ddd;text-align:center">${i+1}</td><td style="padding:6px 8px;border:1px solid #ddd">${st?.name || "?"}</td><td style="padding:6px 8px;border:1px solid #ddd;text-align:center">${st?.kelas || "-"}</td><td style="padding:6px 8px;border:1px solid #ddd;text-align:center">${st?.nisn || "-"}</td><td style="padding:6px 8px;border:1px solid #ddd;text-align:center">${r.correct}/${exam?.questionIds.length||0}</td><td style="padding:6px 8px;border:1px solid #ddd;text-align:center;font-weight:bold;color:${r.score>=75?'#16a34a':r.score>=50?'#d97706':'#dc2626'}">${r.score.toFixed(1)}</td><td style="padding:6px 8px;border:1px solid #ddd;text-align:center">${r.score >= 75 ? 'Tuntas' : 'Belum Tuntas'}</td></tr>`;
  }).join("");

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Laporan Hasil Ujian</title><style>body{font-family:'Segoe UI',sans-serif;padding:24px;color:#1e293b}h1{font-size:18px;margin:0}h2{font-size:14px;font-weight:normal;color:#475569;margin:4px 0 0}table{width:100%;border-collapse:collapse;margin-top:16px;font-size:12px}th{background:#1e293b;color:white;padding:8px;text-align:center;border:1px solid #ddd}.stats{display:flex;gap:16px;margin:16px 0}.stat{flex:1;padding:12px;background:#f1f5f9;border-radius:8px;text-align:center}.stat .val{font-size:20px;font-weight:bold;color:#1e293b}.stat .lbl{font-size:10px;color:#64748b;margin-top:2px}.header{border-bottom:2px solid #1e293b;padding-bottom:12px;margin-bottom:8px}.footer{margin-top:32px;font-size:11px;color:#94a3b8;text-align:center}@media print{body{padding:12px}}</style></head><body>
  <div class="header"><h1>${SCHOOL_NAME}</h1><h2>Laporan Hasil ${exam?.title || "Ujian"}</h2><p style="font-size:12px;color:#64748b;margin-top:4px">Mata Pelajaran: ${subjectName} | Tanggal cetak: ${new Date().toLocaleDateString("id-ID", {weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p></div>
  <div class="stats"><div class="stat"><div class="val">${results.length}</div><div class="lbl">Total Peserta</div></div><div class="stat"><div class="val">${avg}</div><div class="lbl">Rata-rata</div></div><div class="stat"><div class="val">${highest}</div><div class="lbl">Nilai Tertinggi</div></div><div class="stat"><div class="val">${lowest}</div><div class="lbl">Nilai Terendah</div></div><div class="stat"><div class="val">${passed}/${results.length}</div><div class="lbl">Tuntas (≥75)</div></div></div>
  <table><thead><tr><th>No</th><th>Nama Siswa</th><th>Kelas</th><th>NISN</th><th>Benar</th><th>Nilai</th><th>Keterangan</th></tr></thead><tbody>${rows}</tbody></table>
  <div class="footer"><p>${SCHOOL_SHORT} — Sistem Ujian Digital | Dicetak oleh sistem</p></div>
  <script>setTimeout(()=>window.print(),500)<\/script></body></html>`;
  
  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
}

// ============= RESULTS VIEW =============
function ResultsView({ data }) {
  const [selectedExam, setSelectedExam] = useState(null);
  const endedExams = data.exams.filter(e => e.status === "ended" || e.status === "active" || (data.results || []).some(r => r.examId === e.id));

  if (selectedExam) {
    const exam = data.exams.find(e => e.id === selectedExam);
    const results = (data.results || []).filter(r => r.examId === selectedExam);
    const totalQ = exam?.questionIds.length || 0;

    return (
      <div>
        <button onClick={() => setSelectedExam(null)} className="flex items-center gap-2 text-blue-400 mb-4 hover:underline"><ArrowLeft size={16} />Kembali</button>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-2xl font-bold">{exam?.title} — Hasil</h2>
          <Btn onClick={() => printResults(exam, results, data)}><FileText size={14} />Cetak Laporan</Btn>
        </div>
        <Card>
          {results.length === 0 ? <EmptyState icon={<BarChart3 size={40} className="mx-auto" />} text="Belum ada hasil" /> : (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs text-slate-400 font-semibold uppercase">
                <div className="col-span-1">No</div><div className="col-span-4">Nama</div><div className="col-span-2">Kelas</div><div className="col-span-2">Benar</div><div className="col-span-3">Nilai</div>
              </div>
              {results.sort((a, b) => b.score - a.score).map((r, i) => {
                const student = data.students.find(s => s.id === r.studentId);
                return (
                  <div key={r.id} className="grid grid-cols-12 gap-2 px-3 py-2 rounded-lg items-center" style={{ background: "rgba(15,23,42,0.5)" }}>
                    <div className="col-span-1 text-slate-400 text-sm">{i + 1}</div>
                    <div className="col-span-4 text-white text-sm font-medium">{student?.name || "?"}</div>
                    <div className="col-span-2 text-slate-400 text-sm">{student?.kelas || "-"}</div>
                    <div className="col-span-2 text-slate-300 text-sm">{r.correct}/{totalQ}</div>
                    <div className="col-span-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: r.score >= 75 ? "rgba(22,163,74,0.2)" : r.score >= 50 ? "rgba(217,119,6,0.2)" : "rgba(220,38,38,0.2)", color: r.score >= 75 ? "#4ade80" : r.score >= 50 ? "#fbbf24" : "#f87171" }}>
                        {r.score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
              {results.length > 0 && (
                <div className="pt-3 mt-2" style={{ borderTop: "1px solid rgba(59,130,246,0.15)" }}>
                  <div className="text-slate-400 text-sm">Rata-rata: <span className="text-white font-bold">{(results.reduce((a, r) => a + r.score, 0) / results.length).toFixed(1)}</span> • Tertinggi: <span className="text-green-400 font-bold">{Math.max(...results.map(r => r.score)).toFixed(1)}</span> • Terendah: <span className="text-red-400 font-bold">{Math.min(...results.map(r => r.score)).toFixed(1)}</span></div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-white text-2xl font-bold mb-5">Hasil Ujian</h2>
      {endedExams.length === 0 ? <Card><EmptyState icon={<BarChart3 size={40} className="mx-auto" />} text="Belum ada hasil ujian" /></Card> : (
        <div className="space-y-3">
          {endedExams.map(ex => {
            const results = (data.results || []).filter(r => r.examId === ex.id);
            const avg = results.length > 0 ? (results.reduce((a, r) => a + r.score, 0) / results.length).toFixed(1) : "-";
            return (
              <Card key={ex.id} className="cursor-pointer hover:border-blue-500/40 transition" onClick={() => setSelectedExam(ex.id)}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold">{ex.title}</h3>
                    <div className="text-slate-400 text-sm">{data.subjects.find(s => s.id === ex.subjectId)?.name} • {results.length} peserta • Rata-rata: {avg}</div>
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

// ============= SETTINGS =============
function SettingsView({ data, saveData, showToast }) {
  const [pw, setPw] = useState({ old: "", new1: "", new2: "" });
  const handleChangePw = () => {
    if (pw.old !== data.admin.password) return showToast("Password lama salah", "error");
    if (pw.new1.length < 4) return showToast("Password baru minimal 4 karakter", "error");
    if (pw.new1 !== pw.new2) return showToast("Konfirmasi password tidak cocok", "error");
    saveData({ ...data, admin: { ...data.admin, password: pw.new1 } });
    setPw({ old: "", new1: "", new2: "" });
    showToast("Password admin berhasil diubah");
  };

  const handleReset = () => {
    if (!confirm("PERINGATAN: Ini akan menghapus SEMUA data! Lanjutkan?")) return;
    if (!confirm("Apakah Anda benar-benar yakin? Data tidak dapat dikembalikan.")) return;
    saveData(DEFAULT_DATA);
    showToast("Data telah direset");
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
        <h3 className="text-white font-bold mb-2">Informasi Sekolah</h3>
        <div className="text-slate-300 text-sm space-y-1">
          <p>Nama: {SCHOOL_NAME}</p>
          <p>Kurikulum: Kurikulum 2013 (K-13)</p>
          <p>Total Guru: {data.teachers.length}</p>
          <p>Total Siswa: {data.students.length}</p>
          <p>Total Soal: {data.questions.length}</p>
          <p>Total Ujian: {data.exams.length}</p>
        </div>
      </Card>
      <Card>
        <h3 className="text-red-400 font-bold mb-2">Zona Bahaya</h3>
        <p className="text-slate-400 text-sm mb-3">Reset seluruh data aplikasi ke kondisi awal. Tindakan ini tidak dapat dibatalkan.</p>
        <Btn variant="danger" onClick={handleReset}><AlertTriangle size={14} />Reset Semua Data</Btn>
      </Card>
    </div>
  );
}

// ============= IMPORT SOAL FROM DOCX =============
function ImportSoal({ data, saveData, showToast, userId }) {
  const [step, setStep] = useState(1);
  const [soalText, setSoalText] = useState("");
  const [kunciText, setKunciText] = useState("");
  const [soalFile, setSoalFile] = useState(null);
  const [kunciFile, setKunciFile] = useState(null);
  const [parsed, setParsed] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [importing, setImporting] = useState(false);
  const [reading, setReading] = useState(false);

  const readDocx = async (file) => {
    const ab = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: ab });
    return result.value;
  };

  const handleSoalUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSoalFile(file);
    setReading(true);
    try {
      const text = await readDocx(file);
      setSoalText(text);
      showToast("File soal berhasil dibaca");
    } catch (err) {
      showToast("Gagal membaca file: " + err.message, "error");
    }
    setReading(false);
  };

  const handleKunciUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setKunciFile(file);
    setReading(true);
    try {
      const text = await readDocx(file);
      setKunciText(text);
      showToast("File kunci jawaban berhasil dibaca");
    } catch (err) {
      showToast("Gagal membaca file: " + err.message, "error");
    }
    setReading(false);
  };

  const parseAnswerKey = (txt) => {
    const key = {};
    const re = /\b(\d{1,2})\s*[\.\)\|\:]*\s*\*{0,2}\s*([A-Ea-e])\b/g;
    let m;
    while ((m = re.exec(txt)) !== null) {
      const n = parseInt(m[1]);
      if (n >= 1 && n <= 100) key[n] = m[2].toUpperCase();
    }
    return key;
  };

  const parseQuestions = (txt, ansKey) => {
    const qs = [];
    const lines = txt.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
    const blocks = [];
    let current = null;

    for (const line of lines) {
      const qMatch = line.match(/^\s*\*{0,2}\s*(\d{1,2})\s*[\.\)]\s*\*{0,2}\s*(.*)/);
      if (qMatch) {
        const num = parseInt(qMatch[1]);
        if (num >= 1 && num <= 100) {
          const maybeOpt = line.match(/^\s*\d{1,2}\s*[\.\)]\s*[A-E]\s*[\.\)]/);
          if (!maybeOpt) {
            if (current) blocks.push(current);
            current = { num, lines: [qMatch[2]] };
            continue;
          }
        }
      }
      if (current) current.lines.push(line);
    }
    if (current) blocks.push(current);

    for (const block of blocks) {
      const opts = {};
      let qText = "";
      let curOpt = null;
      let foundOpt = false;

      for (const line of block.lines) {
        const optM = line.match(/^\s*([A-Ea-e])\s*[\.\)]\s*(.*)/);
        if (optM) {
          foundOpt = true;
          curOpt = optM[1].toUpperCase();
          opts[curOpt] = optM[2].trim();
        } else if (curOpt && foundOpt) {
          if (line.trim()) opts[curOpt] += " " + line.trim();
        } else if (!foundOpt) {
          qText += (qText ? "\n" : "") + line;
        }
      }

      qText = qText.trim().replace(/\*\*/g, "").replace(/\\"/g, '"').replace(/\\'/g, "'");
      const optKeys = ["A", "B", "C", "D", "E"].filter(k => opts[k]);

      if (qText && optKeys.length >= 2) {
        const correctLetter = ansKey[block.num] || null;
        const correctIdx = correctLetter ? optKeys.indexOf(correctLetter) : -1;
        qs.push({
          num: block.num,
          text: qText,
          options: optKeys.map(k => opts[k]),
          correctAnswer: correctIdx >= 0 ? correctIdx : 0,
          hasKey: correctIdx >= 0
        });
      }
    }

    qs.sort((a, b) => a.num - b.num);
    return qs;
  };

  const handleParse = () => {
    if (!soalText) return showToast("Upload file soal terlebih dahulu", "error");
    if (!subjectId) return showToast("Pilih mata pelajaran", "error");

    const ansKey = kunciText ? parseAnswerKey(kunciText) : {};
    const result = parseQuestions(soalText, ansKey);

    if (result.length === 0) {
      showToast("Tidak ditemukan soal. Pastikan format: 1. ... A. ... B. ... dst.", "error");
      return;
    }

    setParsed(result);
    setStep(2);
    showToast(`${result.length} soal berhasil diparse!`);
  };

  const handleImport = () => {
    if (parsed.length === 0) return;
    setImporting(true);

    const newQuestions = parsed.map(q => ({
      id: genId(),
      subjectId,
      text: q.text,
      image: "",
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: "",
      createdBy: userId || "admin"
    }));

    const updatedData = { ...data, questions: [...data.questions, ...newQuestions] };
    saveData(updatedData);
    setImporting(false);
    setStep(3);
    showToast(`${newQuestions.length} soal berhasil diimport ke Bank Soal!`);
  };

  const handleReset = () => {
    setStep(1);
    setSoalText("");
    setKunciText("");
    setSoalFile(null);
    setKunciFile(null);
    setParsed([]);
    setSubjectId("");
  };

  const withKey = parsed.filter(q => q.hasKey).length;

  return (
    <div>
      <h2 className="text-white text-2xl font-bold mb-5">Import Soal dari Word</h2>

      {step === 1 && (
        <Card>
          <div className="space-y-5">
            <div>
              <label className="text-blue-300 text-sm font-medium mb-2 block">📝 File Soal (.docx) *</label>
              <label className="cursor-pointer block p-6 rounded-xl text-center transition hover:border-blue-500" style={{ border: "2px dashed rgba(59,130,246,0.3)", background: "rgba(15,23,42,0.5)" }}>
                <Upload size={32} className="mx-auto mb-2 text-blue-400" />
                <div className="text-white text-sm font-medium">{soalFile ? soalFile.name : "Klik untuk upload file soal"}</div>
                <div className="text-slate-500 text-xs mt-1">Format: .docx (Word Document)</div>
                <input type="file" accept=".docx" onChange={handleSoalUpload} className="hidden" />
              </label>
            </div>

            <div>
              <label className="text-blue-300 text-sm font-medium mb-2 block">🔑 Kunci Jawaban (.docx) - Opsional</label>
              <label className="cursor-pointer block p-4 rounded-xl text-center transition hover:border-blue-500" style={{ border: "2px dashed rgba(59,130,246,0.2)", background: "rgba(15,23,42,0.3)" }}>
                <div className="text-white text-sm">{kunciFile ? kunciFile.name : "Klik untuk upload kunci jawaban"}</div>
                <div className="text-slate-500 text-xs mt-1">Jika tidak diupload, kunci bisa diatur manual nanti</div>
                <input type="file" accept=".docx" onChange={handleKunciUpload} className="hidden" />
              </label>
            </div>

            <div>
              <label className="text-blue-300 text-sm font-medium mb-1 block">Mata Pelajaran *</label>
              <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="w-full py-2.5 px-3 rounded-xl text-white text-sm outline-none" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.25)" }}>
                <option value="">-- Pilih Mapel --</option>
                {data.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <Btn onClick={handleParse} disabled={!soalText || !subjectId || reading}>
              {reading ? <><RefreshCw size={14} className="animate-spin" />Membaca file...</> : <><CheckCircle size={14} />Parse Soal Otomatis</>}
            </Btn>
          </div>
        </Card>
      )}

      {step === 2 && (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-4 rounded-xl text-center" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
              <div className="text-2xl font-bold text-blue-400">{parsed.length}</div>
              <div className="text-slate-400 text-xs">Total Soal</div>
            </div>
            <div className="p-4 rounded-xl text-center" style={{ background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.2)" }}>
              <div className="text-2xl font-bold text-green-400">{withKey}</div>
              <div className="text-slate-400 text-xs">Ada Kunci</div>
            </div>
            <div className="p-4 rounded-xl text-center" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
              <div className="text-2xl font-bold text-purple-400">{data.subjects.find(s => s.id === subjectId)?.name?.split(" ")[0] || "-"}</div>
              <div className="text-slate-400 text-xs">Mapel</div>
            </div>
          </div>

          {withKey > 0 && (
            <Card>
              <div className="text-slate-400 text-xs font-medium mb-2">Kunci Jawaban:</div>
              <div className="grid grid-cols-10 gap-1">
                {parsed.map(q => (
                  <div key={q.num} className="p-1 rounded text-center text-xs" style={{ background: "rgba(15,23,42,0.5)" }}>
                    <div className="text-slate-500">{q.num}</div>
                    <div className="font-bold" style={{ color: q.hasKey ? "#4ade80" : "#64748b" }}>{q.hasKey ? String.fromCharCode(65 + q.correctAnswer) : "-"}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <div className="text-slate-400 text-xs mb-3">Preview Soal:</div>
            <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2">
              {parsed.map(q => (
                <div key={q.num} className="p-3 rounded-xl" style={{ background: "rgba(15,23,42,0.5)", borderLeft: "3px solid #3b82f6" }}>
                  <div className="text-blue-400 text-xs font-bold mb-1">Soal {q.num}</div>
                  <div className="text-white text-sm mb-2 whitespace-pre-wrap">{q.text.substring(0, 200)}{q.text.length > 200 ? "..." : ""}</div>
                  <div className="flex flex-wrap gap-1">
                    {q.options.map((o, oi) => (
                      <span key={oi} className="px-2 py-0.5 rounded text-xs" style={{ background: oi === q.correctAnswer && q.hasKey ? "rgba(22,163,74,0.2)" : "rgba(51,65,85,0.5)", color: oi === q.correctAnswer && q.hasKey ? "#4ade80" : "#94a3b8" }}>
                        {String.fromCharCode(65 + oi)}. {o.substring(0, 40)}{o.length > 40 ? "..." : ""} {oi === q.correctAnswer && q.hasKey ? "✓" : ""}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex gap-3 mt-4">
            <button onClick={handleReset} className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400" style={{ border: "1px solid rgba(51,65,85,0.5)" }}>↩ Ulang</button>
            <Btn onClick={handleImport} disabled={importing}>
              {importing ? <><RefreshCw size={14} className="animate-spin" />Mengimport...</> : <><Plus size={14} />Import {parsed.length} Soal ke Bank Soal</>}
            </Btn>
          </div>
        </div>
      )}

      {step === 3 && (
        <Card>
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-white text-xl font-bold mb-2">Import Berhasil!</h3>
            <p className="text-slate-400 text-sm mb-6">{parsed.length} soal berhasil ditambahkan ke Bank Soal {data.subjects.find(s => s.id === subjectId)?.name}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleReset} className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400" style={{ border: "1px solid rgba(51,65,85,0.5)" }}>Import Soal Lagi</button>
              <Btn onClick={() => showToast("Silakan buka tab Bank Soal untuk melihat soal yang diimport")}>Lihat Bank Soal</Btn>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ============= TEACHER DASHBOARD =============
function TeacherDashboard({ data, saveData, user, onLogout, showToast }) {
  const [tab, setTab] = useState("dashboard");
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { id: "import", label: "Import Soal", icon: <Upload size={18} /> },
    { id: "questions", label: "Bank Soal", icon: <FileText size={18} /> },
    { id: "exams", label: "Kelola Ujian", icon: <Layers size={18} /> },
    { id: "monitor", label: "Monitoring", icon: <Monitor size={18} /> },
    { id: "results", label: "Hasil Ujian", icon: <BarChart3 size={18} /> },
    { id: "profile", label: "Profil & Sandi", icon: <Settings size={18} /> },
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
            <h3 className="text-white font-bold mb-2">Mata Pelajaran Anda</h3>
            <div className="flex flex-wrap gap-2">
              {(user.subjects || []).map(sid => {
                const subj = data.subjects.find(s => s.id === sid);
                return subj ? <span key={sid} className="px-3 py-1 rounded-lg text-sm" style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}>{subj.name}</span> : null;
              })}
              {(user.subjects || []).length === 0 && <p className="text-slate-500 text-sm">Belum ada mapel yang ditetapkan. Hubungi admin.</p>}
            </div>
          </Card>
        </div>
      )}
      {tab === "questions" && <QuestionManager data={data} saveData={saveData} showToast={showToast} userId={user.id} />}
      {tab === "import" && <ImportSoal data={data} saveData={saveData} showToast={showToast} userId={user.id} />}
      {tab === "exams" && <ExamManager data={data} saveData={saveData} showToast={showToast} userId={user.id} />}
      {tab === "monitor" && <MonitorView data={data} saveData={saveData} />}
      {tab === "results" && <ResultsView data={data} />}
      {tab === "profile" && <TeacherProfile data={data} saveData={saveData} user={user} showToast={showToast} />}
    </DashboardLayout>
  );
}

// ============= TEACHER PROFILE & PASSWORD =============
function TeacherProfile({ data, saveData, user, showToast }) {
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [photo, setPhoto] = useState(user.photo || "");
  const [bio, setBio] = useState(user.bio || "");

  const handleChangePassword = () => {
    if (!oldPw || !newPw || !newPw2) return showToast("Semua field harus diisi", "error");
    if (newPw !== newPw2) return showToast("Password baru tidak cocok", "error");
    if (newPw.length < 6) return showToast("Password minimal 6 karakter", "error");
    
    const teacher = data.teachers.find(t => t.id === user.id);
    if (!teacher) return showToast("Guru tidak ditemukan", "error");
    
    const currentPw = teacher.password || teacher.nip;
    if (oldPw !== currentPw) return showToast("Password lama salah", "error");
    
    const teachers = data.teachers.map(t => t.id === user.id ? { ...t, password: newPw } : t);
    saveData({ ...data, teachers });
    setOldPw(""); setNewPw(""); setNewPw2("");
    showToast("Password berhasil diubah! Gunakan password baru saat login berikutnya.");
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return showToast("Ukuran foto maksimal 2MB", "error");
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    const teachers = data.teachers.map(t => t.id === user.id ? { ...t, photo, bio } : t);
    saveData({ ...data, teachers });
    showToast("Profil berhasil disimpan");
  };

  return (
    <div>
      <h2 className="text-white text-2xl font-bold mb-5">Profil & Keamanan</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-white font-bold mb-4">Foto & Bio</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center" style={{ background: "rgba(59,130,246,0.2)" }}>
              {photo ? <img src={photo} alt="" className="w-full h-full object-cover" /> : <User size={32} className="text-blue-400" />}
            </div>
            <label className="cursor-pointer px-4 py-2 rounded-xl text-sm font-medium text-blue-400 hover:bg-blue-500/10 transition" style={{ border: "1px dashed rgba(59,130,246,0.4)" }}>
              <Upload size={14} className="inline mr-2" />Ganti Foto
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
          <div className="space-y-3">
            <Input label="Nama" value={user.name} disabled />
            <Input label="NIP" value={user.nip} disabled />
            <div>
              <label className="text-blue-300 text-sm font-medium mb-1 block">Bio / Catatan</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Tuliskan bio singkat..." className="w-full py-2.5 px-3 rounded-xl text-white text-sm outline-none resize-none placeholder-slate-500" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(59,130,246,0.25)" }} />
            </div>
            <Btn onClick={handleSaveProfile}><Save size={14} />Simpan Profil</Btn>
          </div>
        </Card>
        <Card>
          <h3 className="text-white font-bold mb-4">Ganti Password</h3>
          <p className="text-slate-400 text-sm mb-4">Password default adalah NIP Anda. Ganti untuk keamanan yang lebih baik.</p>
          <div className="space-y-3">
            <Input label="Password Lama (NIP atau password saat ini)" type="password" value={oldPw} onChange={e => setOldPw(e.target.value)} placeholder="Masukkan password lama" />
            <Input label="Password Baru" type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Minimal 6 karakter" />
            <Input label="Konfirmasi Password Baru" type="password" value={newPw2} onChange={e => setNewPw2(e.target.value)} placeholder="Ulangi password baru" />
            <Btn onClick={handleChangePassword}><Lock size={14} />Ubah Password</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============= STUDENT DASHBOARD =============
function StudentDashboard({ data, saveData, user, onLogout, showToast }) {
  const [activeExam, setActiveExam] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  // Check for active sessions to resume on mount
  useEffect(() => {
    const activeSession = (data.sessions || []).find(s => s.studentId === user.id && s.status === "active");
    if (activeSession) {
      const exam = data.exams.find(e => e.id === activeSession.examId);
      if (exam && exam.status === "active") {
        const end = new Date(exam.endTime);
        if (new Date() < end) {
          setResumeData({ exam, answers: activeSession.answers || {}, violations: activeSession.violations || 0 });
        }
      }
    }
  }, []);

  if (activeExam) {
    return <ExamTaker data={data} saveData={saveData} user={user} exam={activeExam.exam || activeExam} onFinish={() => { setActiveExam(null); setResumeData(null); }} showToast={showToast} savedAnswers={activeExam.answers} savedViolations={activeExam.violations} />;
  }

  const now = new Date();
  const availableExams = data.exams.filter(e => {
    if (e.status !== "active") return false;
    if (!e.targetKelas?.includes(user.kelas)) return false;
    const end = new Date(e.endTime);
    if (now > end) return false;
    const alreadySubmitted = (data.results || []).find(r => r.examId === e.id && r.studentId === user.id);
    return !alreadySubmitted;
  });

  const myResults = (data.results || []).filter(r => r.studentId === user.id);

  return (
    <DashboardLayout user={user} onLogout={onLogout} tabs={[
      { id: "exams", label: "Ujian Tersedia", icon: <FileText size={18} /> },
      { id: "results", label: "Hasil Saya", icon: <Award size={18} /> },
      { id: "profile", label: "Profil", icon: <User size={18} /> },
    ]} activeTab={activeExam ? "" : "exams"} setActiveTab={() => {}}>
      <div>
        <h2 className="text-white text-2xl font-bold mb-2">Selamat Datang, {user.name}</h2>
        <p className="text-slate-400 mb-6">Kelas {user.kelas} • NISN: {user.nisn}</p>

        {resumeData && (
          <Card className="mb-4" style={{ borderLeft: "3px solid #f59e0b" }}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1"><AlertTriangle size={16} className="text-amber-400" /><span className="text-amber-400 font-bold text-sm">Ujian Belum Selesai</span></div>
                <h4 className="text-white font-bold">{resumeData.exam.title}</h4>
                <div className="text-slate-400 text-xs">{Object.keys(resumeData.answers).length}/{resumeData.exam.questionIds.length} soal sudah dijawab</div>
              </div>
              <Btn onClick={() => setActiveExam({ exam: resumeData.exam, answers: resumeData.answers, violations: resumeData.violations })} variant="success"><Play size={14} />Lanjutkan Ujian</Btn>
            </div>
          </Card>
        )}

        <h3 className="text-white font-bold text-lg mb-3">Ujian Tersedia</h3>
        {availableExams.length === 0 ? <Card className="mb-6"><EmptyState icon={<FileText size={40} className="mx-auto" />} text="Tidak ada ujian tersedia saat ini" /></Card> : (
          <div className="space-y-3 mb-6">
            {availableExams.map(ex => {
              const hasSession = (data.sessions || []).find(s => s.studentId === user.id && s.examId === ex.id && s.status === "active");
              return (
              <Card key={ex.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-white font-bold">{ex.title}</h4>
                    <div className="text-slate-400 text-sm">{data.subjects.find(s => s.id === ex.subjectId)?.name} • {ex.questionIds.length} soal • {ex.duration} menit</div>
                    <div className="text-blue-400 text-xs mt-1">Berakhir: {new Date(ex.endTime).toLocaleString("id-ID")}</div>
                  </div>
                  <Btn onClick={() => {
                    if (hasSession) {
                      setActiveExam({ exam: ex, answers: hasSession.answers || {}, violations: hasSession.violations || 0 });
                    } else if (confirm(`Mulai ujian "${ex.title}"?\n\nDurasi: ${ex.duration} menit\nJumlah soal: ${ex.questionIds.length}\n\nSetelah dimulai, Anda tidak dapat keluar.`)) {
                      setActiveExam({ exam: ex });
                    }
                  }}>{hasSession ? <><Play size={14} />Lanjutkan</> : <><Play size={14} />Mulai Ujian</>}</Btn>
                </div>
              </Card>
            )})}
          </div>
        )}

        <h3 className="text-white font-bold text-lg mb-3">Riwayat Ujian</h3>
        {myResults.length === 0 ? <Card><EmptyState icon={<Award size={40} className="mx-auto" />} text="Belum ada hasil ujian" /></Card> : (
          <div className="space-y-2">
            {myResults.map(r => {
              const exam = data.exams.find(e => e.id === r.examId);
              return (
                <Card key={r.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium text-sm">{exam?.title || "Ujian"}</div>
                      <div className="text-slate-400 text-xs">{data.subjects.find(s => s.id === exam?.subjectId)?.name} • {r.correct}/{exam?.questionIds.length || 0} benar</div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ background: r.score >= 75 ? "rgba(22,163,74,0.2)" : r.score >= 50 ? "rgba(217,119,6,0.2)" : "rgba(220,38,38,0.2)", color: r.score >= 75 ? "#4ade80" : r.score >= 50 ? "#fbbf24" : "#f87171" }}>
                      {r.score.toFixed(1)}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ============= EXAM TAKER (STUDENT) =============
function ExamTaker({ data, saveData, user, exam, onFinish, showToast, savedAnswers, savedViolations }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(savedAnswers || {});
  const [timeLeft, setTimeLeft] = useState(() => {
    // If resuming, calculate remaining time from session
    const session = (data.sessions || []).find(s => s.examId === exam.id && s.studentId === user.id && s.status === "active");
    if (session && session.startedAt) {
      const elapsed = Math.floor((Date.now() - session.startedAt) / 1000);
      return Math.max(0, exam.duration * 60 - elapsed);
    }
    return exam.duration * 60;
  });
  const [violations, setViolations] = useState(savedViolations || 0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [showNav, setShowNav] = useState(false);
  const sessionRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  const questions = useMemo(() => {
    let qs = exam.questionIds.map(id => data.questions.find(q => q.id === id)).filter(Boolean);
    if (exam.shuffleQuestions) {
      // Seeded shuffle so resume shows same order
      const seed = (user.id + exam.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      const seededRandom = (s) => { let x = Math.sin(s) * 10000; return x - Math.floor(x); };
      const shuffled = [...qs];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(seed + i) * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      qs = shuffled;
    }
    return qs;
  }, [exam, data.questions, user.id]);

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

  // Anti-cheat: visibility change
  useEffect(() => {
    if (submitted) return;
    const handler = () => {
      if (document.hidden) {
        setViolations(v => {
          const newV = v + 1;
          showToast(`Pelanggaran terdeteksi! (${newV}x) — Jangan berpindah tab/aplikasi`, "warning");
          return newV;
        });
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [submitted, showToast]);

  // Fullscreen
  useEffect(() => {
    if (submitted) return;
    try {
      document.documentElement.requestFullscreen?.();
    } catch {}
    const handler = () => {
      if (!document.fullscreenElement && !submitted) {
        setViolations(v => v + 1);
        showToast("Anda keluar dari mode fullscreen! Kembali ke fullscreen.", "warning");
        try { document.documentElement.requestFullscreen?.(); } catch {}
      }
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [submitted, showToast]);

  // Context menu & copy prevention
  useEffect(() => {
    if (submitted) return;
    const prevent = (e) => e.preventDefault();
    const preventKeys = (e) => {
      if ((e.ctrlKey || e.metaKey) && ["c","v","a","p","s","u"].includes(e.key.toLowerCase())) e.preventDefault();
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && ["i","j"].includes(e.key.toLowerCase()))) e.preventDefault();
    };
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("copy", prevent);
    document.addEventListener("keydown", preventKeys);
    return () => { document.removeEventListener("contextmenu", prevent); document.removeEventListener("copy", prevent); document.removeEventListener("keydown", preventKeys); };
  }, [submitted]);

  // Save session periodically
  useEffect(() => {
    if (submitted) return;
    const saveSession = () => {
      const sessions = [...(data.sessions || [])];
      const idx = sessions.findIndex(s => s.examId === exam.id && s.studentId === user.id);
      const sessionData = { examId: exam.id, studentId: user.id, answers, status: "active", violations, lastUpdate: Date.now(), startedAt: startTimeRef.current };
      if (idx >= 0) { sessions[idx] = { ...sessions[idx], ...sessionData, startedAt: sessions[idx].startedAt || startTimeRef.current }; }
      else sessions.push({ id: genId(), ...sessionData });
      saveData({ ...data, sessions });
    };
    saveSession();
    const iv = setInterval(saveSession, 3000);
    return () => clearInterval(iv);
  }, [answers, violations, submitted]);

  const handleSubmit = useCallback((auto = false) => {
    if (submitted) return;
    if (!auto && !confirm("Yakin ingin mengumpulkan jawaban? Anda tidak dapat mengubah jawaban setelah ini.")) return;
    setSubmitted(true);
    try { document.exitFullscreen?.(); } catch {}

    let correct = 0;
    questions.forEach((q, i) => { if (answers[i] === q.correctAnswer) correct++; });
    const score = questions.length > 0 ? (correct / questions.length) * 100 : 0;
    const resultData = { id: genId(), examId: exam.id, studentId: user.id, answers: { ...answers }, correct, score, violations, submittedAt: Date.now() };
    setResult(resultData);

    const results = [...(data.results || []), resultData];
    const sessions = (data.sessions || []).map(s => s.examId === exam.id && s.studentId === user.id ? { ...s, status: "submitted" } : s);
    saveData({ ...data, results, sessions });
    showToast(auto ? "Waktu habis! Jawaban dikumpulkan otomatis." : "Jawaban berhasil dikumpulkan!");
  }, [submitted, answers, questions, exam, user, data, saveData, showToast, violations]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

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
              <div className="text-5xl font-bold" style={{ color: result.score >= 75 ? "#4ade80" : result.score >= 50 ? "#fbbf24" : "#f87171" }}>{result.score.toFixed(1)}</div>
              <div className="text-slate-300">Benar: {result.correct} dari {questions.length} soal</div>
              {violations > 0 && <div className="text-red-400 text-sm flex items-center justify-center gap-1"><AlertTriangle size={14} />Pelanggaran: {violations}x</div>}
            </div>
          ) : (
            <div className="mb-6"><p className="text-slate-300">Jawaban Anda telah dikumpulkan. Nilai akan diumumkan oleh guru.</p></div>
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
            <div className="text-white text-xs font-bold">{exam.title}</div>
            <div className="text-slate-400 text-[10px]">Soal {currentQ + 1}/{questions.length}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-mono font-bold ${timeLeft <= 300 ? "text-red-400" : timeLeft <= 600 ? "text-amber-400" : "text-green-400"}`} style={{ background: timeLeft <= 300 ? "rgba(220,38,38,0.15)" : timeLeft <= 600 ? "rgba(217,119,6,0.15)" : "rgba(22,163,74,0.15)" }}>
            <Clock size={14} />{formatTime(timeLeft)}
          </div>
          <button onClick={() => setShowNav(!showNav)} className="p-2 rounded-lg text-slate-400 hover:text-white" style={{ background: "rgba(51,65,85,0.5)" }}>
            <Hash size={16} />
          </button>
        </div>
      </div>

      {/* Question Navigation Drawer */}
      {showNav && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowNav(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 p-4 overflow-y-auto" style={{ background: "#1e293b" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Navigasi Soal</h3>
              <button onClick={() => setShowNav(false)} className="text-slate-400"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-5 gap-2 mb-6">
              {questions.map((_, i) => (
                <button key={i} onClick={() => { setCurrentQ(i); setShowNav(false); }} className="w-full aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition" style={{ background: answers[i] !== undefined ? (i === currentQ ? "#2563eb" : "rgba(22,163,74,0.3)") : (i === currentQ ? "#2563eb" : "rgba(51,65,85,0.5)"), color: "white" }}>
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="space-y-2 text-xs text-slate-400 mb-6">
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{ background: "rgba(22,163,74,0.3)" }} />Sudah dijawab ({Object.keys(answers).length})</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{ background: "rgba(51,65,85,0.5)" }} />Belum dijawab ({questions.length - Object.keys(answers).length})</div>
            </div>
            <Btn variant="success" className="w-full justify-center" onClick={() => { setShowNav(false); handleSubmit(); }}><CheckCircle size={14} />Kumpulkan Jawaban</Btn>
          </div>
        </div>
      )}

      {/* Question Content */}
      <div className="max-w-3xl mx-auto p-4">
        <Card className="mb-4">
          <div className="text-blue-400 text-xs font-medium mb-2">Soal {currentQ + 1} dari {questions.length}</div>
          <div className="text-white text-base leading-relaxed mb-3" style={{ whiteSpace: "pre-wrap" }}>{q.text}</div>
          {q.image && <img src={q.image} alt="Gambar soal" className="max-w-full rounded-xl mb-3" style={{ maxHeight: "300px" }} />}
        </Card>

        <div className="space-y-2 mb-6">
          {q.options.map((opt, i) => (
            <button key={i} onClick={() => setAnswers(a => ({ ...a, [currentQ]: i }))} className="w-full text-left flex items-start gap-3 p-4 rounded-xl transition" style={{ background: answers[currentQ] === i ? "rgba(59,130,246,0.2)" : "rgba(30,41,59,0.8)", border: `2px solid ${answers[currentQ] === i ? "#3b82f6" : "rgba(59,130,246,0.1)"}` }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: answers[currentQ] === i ? "#3b82f6" : "rgba(51,65,85,0.5)", color: "white" }}>
                {String.fromCharCode(65 + i)}
              </div>
              <span className="text-white text-sm pt-1">{opt}</span>
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3">
          <Btn variant="secondary" onClick={() => setCurrentQ(c => Math.max(0, c - 1))} disabled={currentQ === 0}>
            <ArrowLeft size={14} />Sebelumnya
          </Btn>
          {currentQ === questions.length - 1 ? (
            <Btn variant="success" onClick={() => handleSubmit()}>
              <CheckCircle size={14} />Kumpulkan
            </Btn>
          ) : (
            <Btn onClick={() => setCurrentQ(c => Math.min(questions.length - 1, c + 1))}>
              Selanjutnya<ChevronRight size={14} />
            </Btn>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4 rounded-full h-2 overflow-hidden" style={{ background: "rgba(51,65,85,0.5)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%`, background: "linear-gradient(90deg, #3b82f6, #16a34a)" }} />
        </div>
        <div className="text-center text-slate-400 text-xs mt-1">{Object.keys(answers).length}/{questions.length} soal dijawab</div>
      </div>

      {violations > 0 && (
        <div className="fixed bottom-4 left-4 flex items-center gap-2 px-3 py-2 rounded-xl text-xs" style={{ background: "rgba(220,38,38,0.2)", color: "#f87171" }}>
          <AlertTriangle size={14} />Pelanggaran: {violations}x
        </div>
      )}
    </div>
  );
}
