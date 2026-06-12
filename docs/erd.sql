-- =========================================================================
-- SIGAP UB — Skema database PostgreSQL
-- Dijalankan otomatis saat container db pertama kali boot (volume
-- /docker-entrypoint-initdb.d). Berisi DDL lengkap + seed minimal demo.
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- untuk gen_random_uuid()

-- -------------------------------------------------------------------------
-- Tabel users
-- Berisi seluruh akun terdaftar (mahasiswa SIAM, konselor, admin).
-- -------------------------------------------------------------------------
CREATE TABLE users (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nim          VARCHAR(20) UNIQUE NOT NULL,
    nama         VARCHAR(120) NOT NULL,
    email        VARCHAR(160) UNIQUE NOT NULL,
    fakultas     VARCHAR(80),
    angkatan     INT,
    role         VARCHAR(20) NOT NULL
                 CHECK (role IN ('mahasiswa', 'konselor', 'admin')),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_created_at ON users (created_at);

-- -------------------------------------------------------------------------
-- Tabel counselors
-- Direktori konselor profesional + slot ketersediaan dalam bentuk JSONB.
-- -------------------------------------------------------------------------
CREATE TABLE counselors (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama             VARCHAR(120) NOT NULL,
    email            VARCHAR(160) UNIQUE NOT NULL,
    spesialisasi     VARCHAR(120),
    available_slots  JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- -------------------------------------------------------------------------
-- Tabel assessments
-- Menyimpan setiap submisi kuesioner. Jawaban mentah disimpan JSONB
-- agar fleksibel saat instrumen ditambah, sementara score numerik dan
-- risk_level menjadi sumber kebenaran agregat.
-- -------------------------------------------------------------------------
CREATE TABLE assessments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        VARCHAR(10) NOT NULL
                CHECK (type IN ('gad7', 'phq9', 'srq20')),
    score       INT NOT NULL CHECK (score >= 0),
    risk_level  VARCHAR(10) NOT NULL
                CHECK (risk_level IN ('rendah', 'sedang', 'tinggi', 'kritis')),
    answers     JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assessments_user_id    ON assessments (user_id);
CREATE INDEX idx_assessments_created_at ON assessments (created_at);
CREATE INDEX idx_assessments_risk_level ON assessments (risk_level);

-- -------------------------------------------------------------------------
-- Tabel triage_results
-- Output algoritma classifyRisk() — gabungan keputusan dari 1-3 asesmen.
-- contributing_factors menyimpan instrumen yang menyebabkan level tertinggi.
-- -------------------------------------------------------------------------
CREATE TABLE triage_results (
    id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id          UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    user_id                UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    risk_level             VARCHAR(10) NOT NULL
                           CHECK (risk_level IN ('rendah', 'sedang', 'tinggi', 'kritis')),
    confidence_score       DECIMAL(4, 2) NOT NULL DEFAULT 1.00
                           CHECK (confidence_score >= 0 AND confidence_score <= 1),
    contributing_factors   JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_triage_user_id    ON triage_results (user_id);
CREATE INDEX idx_triage_created_at ON triage_results (created_at);
CREATE INDEX idx_triage_risk_level ON triage_results (risk_level);

-- -------------------------------------------------------------------------
-- Tabel counseling_bookings
-- Pemesanan sesi konseling. status mengikuti siklus pending → confirmed
-- → completed (atau cancelled jika dibatalkan).
-- -------------------------------------------------------------------------
CREATE TABLE counseling_bookings (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    counselor_id  UUID NOT NULL REFERENCES counselors(id) ON DELETE RESTRICT,
    scheduled_at  TIMESTAMPTZ NOT NULL,
    status        VARCHAR(20) NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    category      VARCHAR(80) NOT NULL,
    notes         TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_user_id    ON counseling_bookings (user_id);
CREATE INDEX idx_bookings_created_at ON counseling_bookings (created_at);

-- =========================================================================
-- SEED DATA — minimal demo (3 mahasiswa, 1 konselor, 1 asesmen contoh)
-- Semua nilai bersifat dummy / synthetic — bukan data mahasiswa nyata.
-- =========================================================================

-- Mahasiswa 1
INSERT INTO users (id, nim, nama, email, fakultas, angkatan, role)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    '255150300111053',
    'Arva Mada Jayastu',
    'arva@student.ub.ac.id',
    'FILKOM',
    2025,
    'mahasiswa'
);

-- Mahasiswa 2
INSERT INTO users (id, nim, nama, email, fakultas, angkatan, role)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    '255150301111027',
    'Farrel Arzaqia Mecca',
    'farrel@student.ub.ac.id',
    'FILKOM',
    2025,
    'mahasiswa'
);

-- Mahasiswa 3
INSERT INTO users (id, nim, nama, email, fakultas, angkatan, role)
VALUES (
    '55555555-5555-5555-5555-555555555555',
    '25515030111106',
    'Fristian Boas Nathaniel',
    'fristian@student.ub.ac.id',
    'FILKOM',
    2025,
    'mahasiswa'
);

-- Konselor dummy
INSERT INTO counselors (id, nama, email, spesialisasi, available_slots)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    'Dr. Maya Pramudita, M.Psi.',
    'maya.konselor@ub.ac.id',
    'Psikologi Klinis Dewasa',
    '[{"date":"2026-05-25","time":"09:00-10:30"},{"date":"2026-05-25","time":"11:00-12:30"}]'::jsonb
);

-- Asesmen contoh: PHQ-9 skor 12 (Sedang)
INSERT INTO assessments (id, user_id, type, score, risk_level, answers)
VALUES (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'phq9',
    12,
    'sedang',
    '[1,2,2,1,1,2,1,1,1]'::jsonb
);

-- Triage hasil dari asesmen di atas
INSERT INTO triage_results (assessment_id, user_id, risk_level, confidence_score, contributing_factors)
VALUES (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'sedang',
    1.00,
    '[{"instrument":"phq9","level":"sedang","score":12}]'::jsonb
);
