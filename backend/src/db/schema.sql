-- =========================================================================
-- SIGAP UB — Salinan skema database untuk backend
-- File ini adalah duplikat singkat dari docs/erd.sql tanpa seed,
-- ditujukan untuk migration loader di sisi backend (di luar Docker compose).
-- Single source of truth tetap di docs/erd.sql.
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nim          VARCHAR(20) UNIQUE NOT NULL,
    nama         VARCHAR(120) NOT NULL,
    email        VARCHAR(160) UNIQUE NOT NULL,
    fakultas     VARCHAR(80),
    angkatan     INT,
    role         VARCHAR(20) NOT NULL CHECK (role IN ('mahasiswa', 'konselor', 'admin')),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS counselors (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama             VARCHAR(120) NOT NULL,
    email            VARCHAR(160) UNIQUE NOT NULL,
    spesialisasi     VARCHAR(120),
    available_slots  JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS assessments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        VARCHAR(10) NOT NULL CHECK (type IN ('gad7', 'phq9', 'srq20')),
    score       INT NOT NULL CHECK (score >= 0),
    risk_level  VARCHAR(10) NOT NULL CHECK (risk_level IN ('rendah', 'sedang', 'tinggi', 'kritis')),
    answers     JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS triage_results (
    id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id          UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    user_id                UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    risk_level             VARCHAR(10) NOT NULL CHECK (risk_level IN ('rendah', 'sedang', 'tinggi', 'kritis')),
    confidence_score       DECIMAL(4, 2) NOT NULL DEFAULT 1.00,
    contributing_factors   JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS counseling_bookings (
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

CREATE INDEX IF NOT EXISTS idx_users_created_at        ON users (created_at);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id     ON assessments (user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at  ON assessments (created_at);
CREATE INDEX IF NOT EXISTS idx_assessments_risk_level  ON assessments (risk_level);
CREATE INDEX IF NOT EXISTS idx_triage_user_id          ON triage_results (user_id);
CREATE INDEX IF NOT EXISTS idx_triage_created_at       ON triage_results (created_at);
CREATE INDEX IF NOT EXISTS idx_triage_risk_level       ON triage_results (risk_level);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id        ON counseling_bookings (user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at     ON counseling_bookings (created_at);
