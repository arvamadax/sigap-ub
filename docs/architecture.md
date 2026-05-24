# Arsitektur Sistem SIGAP UB

Dokumen ini menyajikan ringkasan arsitektur teknis SIGAP UB
(Sistem Informasi Asesmen dan Pemantauan Psikologis) untuk
TEKRA 2026 — Software Development Challenge.

## Diagram Layer Tinggi

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

## Tabel Komponen

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

## Sequence — Submit Asesmen

```mermaid
sequenceDiagram
    autonumber
    actor Mhs as Mahasiswa
    participant FE as React Frontend
    participant API as API Gateway
    participant ASS as Assessment Svc
    participant TRI as Triage Svc
    participant DB as PostgreSQL

    Mhs->>FE: Jawab kuesioner PHQ-9
    FE->>API: POST /api/assessments/submit (Bearer JWT)
    API->>ASS: forward payload
    ASS->>ASS: hitung sum(answers)
    ASS->>ASS: classifyPhq9(score)
    ASS->>DB: INSERT INTO assessments
    ASS-->>API: { assessmentId, riskLevel, ... }
    API->>TRI: classifyRisk(phq9, gad7, srq20)
    TRI-->>API: { riskLevel, contributingFactors }
    API-->>FE: 201 Created + payload
    FE-->>Mhs: tampilkan hasil + rekomendasi
```

## Catatan Desain

- **Stateless API Gateway** — semua otentikasi melalui JWT bearer.
  Redis dipakai untuk rate-limit (mitigasi spam asesmen).
- **JSONB untuk jawaban kuesioner** — memungkinkan penambahan
  instrumen baru tanpa migrasi tabel.
- **Klasifikasi risiko bersifat deterministik** (threshold cut-off
  klinis tervalidasi WHO) — bukan model machine learning, sehingga
  dapat diaudit ulang dan transparan bagi tim psikolog.
- **Pemisahan Service Logic** — masing-masing domain (auth,
  assessment, triage, scheduling) memiliki router Express terpisah
  agar mudah di-extract menjadi microservice di masa mendatang.

## Panduan Demo & Screenshot

Untuk presentasi TEKRA 2026, alur demo yang disarankan:

1. **Buka Landing Page** (`http://localhost:3000`)
   - Tunjukkan hero section + 3 instrumen klinis tervalidasi.
   - Highlight badge "Sistem Skrining Terstandar WHO".

2. **Login dengan akun demo**
   - NIM: `215150300111053` / password: `sigap123`.
   - Jelaskan bahwa pada produksi akan terintegrasi dengan SSO SIAM UB.

3. **Jalankan Asesmen PHQ-9**
   - Tunjukkan UI radio button yang fully accessible (keyboard navigable).
   - Selesaikan 9 pertanyaan → tampilkan hasil klasifikasi.

4. **Eksplorasi API Documentation** (`http://localhost:3001/api-docs`)
   - Demo Swagger UI live untuk transparansi kontrak API.
   - Tunjukkan response schema yang terstandar.

5. **Tunjukkan Klasifikasi Triase**
   - Buka `notebooks/triage_logic.md`.
   - Walkthrough 3 skenario kasus dengan hasil deterministik.

## Color Palette & Brand Tokens

Token warna yang konsisten dipakai di seluruh aplikasi:

| Token | Hex | Penggunaan |
|---|---|---|
| primary-teal | `#0D9488` | CTA, highlight, badge utama |
| dark-teal | `#006565` | Hover state, accent depth |
| bg-cream | `#FDFBF7` | Background utama, soft surface |
| border-light | `#F0EBE2` | Border subtle, divider |
| navy | `#081b3a` | Header modal, footer |
| text-dark | `#1E293B` | Body text utama |
| rose-600 | `#E11D48` | Error state, urgent alert |

Pemilihan warna mengikuti prinsip *calming aesthetic* untuk konteks
kesehatan mental — palette dominan hijau-teal dan krem yang
terbukti menurunkan kecemasan visual saat user berinteraksi dengan
form sensitif.
