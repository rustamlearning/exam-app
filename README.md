# Sistem Ujian Digital — SMAN 6 Pangkep
Aplikasi ujian online dengan sinkronisasi real-time via Firebase.

## Login Default
| Role  | Username | Password |
|-------|----------|----------|
| Admin | admin    | admin123 |
| Guru  | (nama lengkap) | (NIP) |
| Siswa | (nama lengkap) | (NISN) |

---

## LANGKAH 1 — Buat Project Firebase (GRATIS)

1. Buka https://console.firebase.google.com
2. Klik **"Create a project"** → beri nama (misal: `ujian-sman6pangkep`)
3. Nonaktifkan Google Analytics → klik **Create Project**
4. Setelah selesai, klik **"</> Web"** untuk tambah Web App
5. Beri nama app → klik **Register App**
6. **Salin konfigurasi** yang muncul (apiKey, authDomain, dll) — akan dipakai di langkah berikutnya

### Aktifkan Firestore Database
1. Di sidebar kiri Firebase → klik **Firestore Database**
2. Klik **Create Database**
3. Pilih **"Start in test mode"** → Next → pilih region terdekat → Done

---

## LANGKAH 2 — Setup Project Lokal

```bash
# Extract ZIP ini, masuk ke folder
cd exam-app

# Salin file env
cp .env.example .env

# Edit .env, isi dengan konfigurasi Firebase Anda
# (buka dengan Notepad atau VS Code)
```

Isi file `.env` dengan nilai dari Firebase tadi:
```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=nama-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nama-project
VITE_FIREBASE_STORAGE_BUCKET=nama-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## LANGKAH 3 — Deploy ke Vercel (GRATIS)

### Cara A — Via GitHub (Direkomendasikan)
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/USERNAME/exam-app.git
git push -u origin main
```
1. Buka https://vercel.com → Login dengan GitHub
2. Klik **Add New Project** → Import repo
3. Buka bagian **Environment Variables** → tambahkan semua variabel dari `.env`
4. Klik **Deploy** ✅

### Cara B — Via Netlify
```bash
npm install
npm run build
```
1. Buka https://netlify.com → drag & drop folder `dist/`
2. Setelah deploy, buka **Site settings → Environment variables**
3. Tambahkan semua variabel dari `.env`
4. Redeploy ✅

---

## Jalankan Lokal (Testing)
```bash
npm install
npm run dev
```
Buka http://localhost:5173

---

## ⚠️ Keamanan Firestore

Setelah testing, ubah Firestore Rules supaya tidak bisa diakses sembarangan:

Di Firebase Console → Firestore → **Rules**, ganti dengan:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /examapp/{document} {
      allow read, write: if true; // Untuk sementara - production perlu auth
    }
  }
}
```
