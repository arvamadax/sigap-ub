<div align="center">

# SIGAP UB
### Sistem Informasi Asesmen dan Pemantauan Psikologis
**TEKRA 2026 — Software Development Challenge · Universitas Brawijaya**

![Tema](https://img.shields.io/badge/Tema-Smart%20Campus-0D9488?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-React%2019%20%2B%20Express%20%2B%20Postgres-1E293B?style=flat-square)
![Container](https://img.shields.io/badge/Container-Docker%20Compose-2496ED?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-22C55E?style=flat-square)

</div>

---

## 1. Tentang Solusi

Layanan psikologi Universitas Brawijaya saat ini menghadapi **bottleneck struktural**:
rasio konselor sekitar **1 : 15.000** terhadap populasi mahasiswa, dengan
waktu tunggu pemesanan sesi konseling rata-rata mencapai **±4 bulan**.
Akibatnya, mahasiswa yang membutuhkan intervensi cepat sering tidak
terjangkau, dan beban administratif konselor menghambat fokus klinis.

**SIGAP UB hadir sebagai *capacity multiplier*** — bukan menggantikan konselor,
melainkan **mengoptimalkan kapasitas 5 konselor agar mampu menjangkau
± 75.000 mahasiswa** melalui:

1. **Triase mandiri 5-menit** dengan tiga instrumen klinis tervalidasi:
   **PHQ-9** (Depresi), **GAD-7** (Kecemasan), dan **SRQ-20** (Skrining Umum).
2. **Klasifikasi berbasis skor klinis tervalidasi WHO** — sistem
   menggunakan *threshold cut-off* deterministik, **bukan machine learning**.
   Setiap output dapat diaudit ulang oleh tim psikolog.
3. **Pemesanan konseling prioritas** — slot pertama dialokasikan untuk
   mahasiswa kategori Tinggi/Kritis sehingga konselor fokus pada kasus
   yang paling membutuhkan.

> **Catatan transparansi:** SIGAP UB tidak menggunakan AI generatif maupun
> model machine learning. Semua keputusan triase mengikuti aturan skor
> klinis yang diterbitkan oleh komunitas riset internasional dan WHO.

---

## 2. Arsitektur Sistem

```mermaid
graph TD
    A[Browser / Client] --> B[React Frontend :3000]
    B --> C[Express API Gateway :3001]
    C --> D[Auth Service]
    C --> E[Assessment Service]
    C --> F[Triage Service]
    C --> G[Scheduling Service]
    D --> H[(PostgreSQL :5432)]
    E --> H
    F --> H
    F --> I[(Redis Cache :6379)]
    G --> H
```

### Tabel Komponen

| Service | Port | Teknologi | Fungsi |
|---|---|---|---|
| Frontend | 3000 | React 19 + Vite | UI mahasiswa & konselor |
| API Gateway | 3001 | Node.js + Express | Routing & autentikasi |
| Auth Service | - | JWT + OAuth 2.0 sim. | Login SSO UB |
| Assessment Service | - | Express Router | Simpan & hitung skor |
| Triage Service | - | Express + logika skor | Klasifikasi risiko klinis |
| Scheduling Service | - | Express Router | Pemesanan konseling |
| Database | 5432 | PostgreSQL 15 | Penyimpanan utama |
| Cache | 6379 | Redis 7 | Session & rate limit |

Detail tambahan, termasuk sequence diagram submit asesmen, ada di
[`docs/architecture.md`](docs/architecture.md).
Spesifikasi API lengkap tersedia di [`docs/api-spec.yaml`](docs/api-spec.yaml).

---

## 3. ERD / Skema Database

```mermaid
erDiagram
    USERS ||--o{ ASSESSMENTS : "memiliki"
    USERS ||--o{ TRIAGE_RESULTS : "menghasilkan"
    USERS ||--o{ COUNSELING_BOOKINGS : "memesan"
    COUNSELORS ||--o{ COUNSELING_BOOKINGS : "menangani"
    ASSESSMENTS ||--o{ TRIAGE_RESULTS : "dasar untuk"

    USERS {
        UUID id PK
        VARCHAR nim UK
        VARCHAR nama
        VARCHAR email UK
        VARCHAR fakultas
        INT angkatan
        VARCHAR role
        TIMESTAMPTZ created_at
    }
    ASSESSMENTS {
        UUID id PK
        UUID user_id FK
        VARCHAR type
        INT score
        VARCHAR risk_level
        JSONB answers
        TIMESTAMPTZ created_at
    }
    TRIAGE_RESULTS {
        UUID id PK
        UUID assessment_id FK
        UUID user_id FK
        VARCHAR risk_level
        DECIMAL confidence_score
        JSONB contributing_factors
        TIMESTAMPTZ created_at
    }
    COUNSELING_BOOKINGS {
        UUID id PK
        UUID user_id FK
        UUID counselor_id FK
        TIMESTAMPTZ scheduled_at
        VARCHAR status
        VARCHAR category
        TEXT notes
        TIMESTAMPTZ created_at
    }
    COUNSELORS {
        UUID id PK
        VARCHAR nama
        VARCHAR email UK
        VARCHAR spesialisasi
        JSONB available_slots
    }
```

DDL lengkap + indeks + seed contoh ada di [`docs/erd.sql`](docs/erd.sql).

---

## 4. Setup & Menjalankan Lokal (Docker)

```bash
# 1. Clone repo
git clone https://github.com/[username]/sigap-ub.git
cd sigap-ub

# 2. Salin environment variables
cp .env.example .env

# 3. Jalankan semua service
docker-compose up --build

# Akses aplikasi:
# Frontend  → http://localhost:3000
# Backend   → http://localhost:3001
# API Docs  → http://localhost:3001/api-docs
```

### Tanpa Docker

```bash
# Frontend
npm install
npm run dev

# Backend (terminal terpisah)
cd backend
npm install
npm run dev
```

### Kredensial Demo (mock)

| NIM | Password | Peran |
|-----|----------|-------|
| `215150300111053` | `sigap123` | Mahasiswa |
| `215150301111027` | `sigap123` | Mahasiswa |

---

## 5. Logika Klasifikasi Risiko

### Cut-off Skor PHQ-9 (Depresi)
| Skor | Interpretasi | Risk Level |
|---|---|---|
| 0–4 | Minimal | Rendah |
| 5–9 | Ringan | Rendah |
| 10–14 | Sedang | Sedang |
| 15–19 | Sedang-Berat | Tinggi |
| 20–27 | Berat | Kritis |

### Cut-off Skor GAD-7 (Kecemasan)
| Skor | Interpretasi | Risk Level |
|---|---|---|
| 0–4 | Minimal | Rendah |
| 5–9 | Ringan | Rendah |
| 10–14 | Sedang | Sedang |
| 15–21 | Berat | Tinggi |

### Cut-off Skor SRQ-20 (Skrining Umum)
| Skor | Interpretasi | Risk Level |
|---|---|---|
| 0–5 | Sehat | Rendah |
| 6–7 | Ringan | Rendah |
| 8–12 | Sedang | Sedang |
| 13+ | Berat | Tinggi |

**Logika kombinasi:** ambil **level tertinggi** dari ketiga instrumen
(urutan: Rendah < Sedang < Tinggi < Kritis).

```text
function classifyRisk(phq9Score, gad7Score, srq20Score):
  levels = [getPhq9Level(phq9Score),
            getGad7Level(gad7Score),
            getSrq20Level(srq20Score)]
  finalLevel = max(levels) berdasarkan urutan: Rendah < Sedang < Tinggi < Kritis
  factors = instrumen yang berkontribusi ke level tertinggi
  return { level: finalLevel, factors: factors }
```

> **Catatan:** Sistem ini menggunakan klasifikasi berbasis threshold skor
> klinis tervalidasi WHO — bukan model machine learning generatif.

Pembahasan lengkap (3 skenario kasus, flowchart, referensi ilmiah) ada di
[`notebooks/triage_logic.md`](notebooks/triage_logic.md).

---

## 6. Tech Stack

| Komponen | Teknologi | Versi | Justifikasi |
|---|---|---|---|
| Frontend | React + TypeScript + Vite | 19 / 5.8 / 6.2 | Ekosistem mature, TypeScript safety |
| Styling | Tailwind CSS | v4 | Utility-first, konsisten |
| Backend | Node.js + Express | 20 / 4.x | Event-driven, cocok real-time notif |
| Database | PostgreSQL | 15 | ACID compliant, JSONB untuk data asesmen |
| Cache | Redis | 7 | Session management & rate limiting |
| Container | Docker + Compose | latest | Reproducible environment |
| Auth | JWT + OAuth 2.0 sim. | - | Kompatibel arsitektur SSO UB |
| API Docs | Swagger / OpenAPI | 3.0 | Dokumentasi interaktif |

---

## 7. Struktur Direktori

```
sigap-ub/
├── README.md                          ← dokumen ini
├── docker-compose.yml                 ← orkestrasi semua service
├── Dockerfile                         ← multi-stage frontend
├── nginx.conf                         ← konfigurasi SPA nginx
├── .env.example                       ← template environment variables
├── index.html                         ← entry HTML frontend
├── package.json                       ← dependency frontend
├── vite.config.ts
├── tsconfig.json
├── docs/
│   ├── architecture.md                ← arsitektur + sequence diagram
│   ├── api-spec.yaml                  ← OpenAPI 3.0 spec
│   └── erd.sql                        ← DDL + seed PostgreSQL
├── src/                               ← frontend React (TIDAK DIUBAH)
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── types.ts
│   ├── data/
│   └── components/
│       ├── LandingView.tsx
│       ├── DashboardView.tsx
│       ├── AssessmentView.tsx
│       ├── Icons.tsx
│       ├── Toast.tsx
│       └── ConfirmModal.tsx
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app.js                     ← Express entry point
│       ├── middleware/
│       │   └── auth.js                ← JWT verification
│       ├── routes/
│       │   ├── auth.js
│       │   ├── assessments.js
│       │   ├── triage.js
│       │   └── counseling.js
│       └── db/
│           └── schema.sql
└── notebooks/
    └── triage_logic.md                ← penjelasan algoritma triase
```

---

## 8. Tim Pengembang

| Nama | NIM | Role |
|---|---|---|
| Arva Mada Jayastu | 255150300111053 | Ketua Tim / Lead Developer |
| Farrel Arzaqia Mecca | 255150301111027 | Backend Developer |
| Fristian Boas Nathaniel | 25515030111106 | Front End Developer |

**Fakultas Ilmu Komputer, Universitas Brawijaya — 2026**

---

<div align="center">
<sub>Dikembangkan untuk TEKRA 2026 — Software Development Challenge.<br/>
Tema: Smart Campus · Fokus: Kesehatan Mental Mahasiswa</sub>
</div>
