-- Migration 027: Auth Service Tables (Users, Sessions, Devices)
-- Real DB-backed authentication and session tracking.

CREATE TABLE IF NOT EXISTS auth_users (
  id                  TEXT PRIMARY KEY,
  username            TEXT NOT NULL UNIQUE,
  password_hash       TEXT NOT NULL,
  roles               TEXT NOT NULL,            -- Comma-separated roles, e.g. "client" or "operator"
  verified_identifier TEXT,                     -- Phone number or email
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auth_sessions (
  id                  TEXT PRIMARY KEY,         -- The session/refresh token itself
  subject             TEXT NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  device_fingerprint  TEXT,                     -- Hash or identifier of the device
  ip_address          TEXT,
  is_revoked          BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at          TIMESTAMPTZ NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_subject ON auth_sessions(subject);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires ON auth_sessions(expires_at);

-- Seed default dev users
INSERT INTO auth_users (id, username, password_hash, roles, verified_identifier)
VALUES
  ('client-dev-001', 'client_001', '$2a$10$7vj6L9sV/R2rJ3C3dGf.e.9tN2O9g8Wl8c7U7gB7rX7f7f7f7f7f7', 'client', '+9671234567'),
  ('client-dev-002', 'client_002', '$2a$10$7vj6L9sV/R2rJ3C3dGf.e.9tN2O9g8Wl8c7U7gB7rX7f7f7f7f7f7', 'client', '+9671112223'),
  ('captain-dev-001', 'captain_001', '$2a$10$7vj6L9sV/R2rJ3C3dGf.e.9tN2O9g8Wl8c7U7gB7rX7f7f7f7f7f7', 'captain', '+9677777777'),
  ('partner-dev-001', 'partner_001', '$2a$10$7vj6L9sV/R2rJ3C3dGf.e.9tN2O9g8Wl8c7U7gB7rX7f7f7f7f7f7', 'partner', '+9678888888'),
  ('field-dev-001', 'field_001', '$2a$10$7vj6L9sV/R2rJ3C3dGf.e.9tN2O9g8Wl8c7U7gB7rX7f7f7f7f7f7', 'field', '+9679999999'),
  ('operator-dev-001', 'operator_001', '$2a$10$7vj6L9sV/R2rJ3C3dGf.e.9tN2O9g8Wl8c7U7gB7rX7f7f7f7f7f7', 'operator', '+9670000000')
ON CONFLICT (id) DO NOTHING;

-- Seed default dev sessions (valid for 10 years)
INSERT INTO auth_sessions (id, subject, device_fingerprint, ip_address, is_revoked, expires_at)
VALUES
  ('dev-client-token-001', 'client-dev-001', 'dev-device-client-1', '127.0.0.1', FALSE, NOW() + INTERVAL '10 years'),
  ('dev-client-token-002', 'client-dev-002', 'dev-device-client-2', '127.0.0.1', FALSE, NOW() + INTERVAL '10 years'),
  ('dev-captain-token-001', 'captain-dev-001', 'dev-device-captain-1', '127.0.0.1', FALSE, NOW() + INTERVAL '10 years'),
  ('dev-partner-token-001', 'partner-dev-001', 'dev-device-partner-1', '127.0.0.1', FALSE, NOW() + INTERVAL '10 years'),
  ('dev-field-token-001', 'field-dev-001', 'dev-device-field-1', '127.0.0.1', FALSE, NOW() + INTERVAL '10 years'),
  ('dev-operator-token-001', 'operator-dev-001', 'dev-device-operator-1', '127.0.0.1', FALSE, NOW() + INTERVAL '10 years')
ON CONFLICT (id) DO NOTHING;
