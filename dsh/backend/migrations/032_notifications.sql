-- J-013: Notifications / Signal Layer
-- dsh_notifications stores per-actor signal events for the DSH bell screen.
-- DSH creates notification records on order state transitions; it never mutates WLT money.

CREATE TABLE IF NOT EXISTS dsh_notifications (
    id              TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::text,
    recipient_id    TEXT        NOT NULL,
    recipient_role  TEXT        NOT NULL CHECK (recipient_role IN ('client', 'partner', 'captain', 'field', 'operator')),
    kind            TEXT        NOT NULL,
    title           TEXT        NOT NULL,
    subtitle        TEXT,
    entity_id       TEXT,
    entity_type     TEXT,
    priority        TEXT        NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'important', 'urgent')),
    is_read         BOOLEAN     NOT NULL DEFAULT false,
    action_route    TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dsh_notifications_recipient    ON dsh_notifications (recipient_id, recipient_role);
CREATE INDEX IF NOT EXISTS idx_dsh_notifications_is_read      ON dsh_notifications (recipient_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_dsh_notifications_created_at   ON dsh_notifications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dsh_notifications_entity       ON dsh_notifications (entity_id) WHERE entity_id IS NOT NULL;
