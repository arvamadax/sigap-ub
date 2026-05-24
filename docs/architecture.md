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
