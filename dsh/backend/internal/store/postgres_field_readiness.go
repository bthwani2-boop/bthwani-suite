package store

// postgres_field_readiness.go — J-006D (ReadinessEscalation) and J-006E (ReadinessApproval)
// Postgres repository implementations. No financial mutation (WLT boundary).

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	"bthwani.local/dsh/domain"
)

func generateFieldReadinessEscalationID() string {
	return fmt.Sprintf("esc-%d", time.Now().UnixNano())
}

func generateFieldReadinessApprovalID() string {
	return fmt.Sprintf("approval-%d", time.Now().UnixNano())
}

// ─── J-006D: CreateFieldReadinessEscalation ──────────────────────────────────

// CreateFieldReadinessEscalation — field agent escalates incomplete readiness.
// status starts as 'escalated'. target_team must be one of: partner-management, control-panel, marketing.
func (repo *PostgresRepository) CreateFieldReadinessEscalation(
	ctx context.Context,
	storeID string,
	req domain.CreateFieldReadinessEscalationRequest,
) (domain.FieldReadinessEscalationRecord, error) {
	storeID = strings.TrimSpace(storeID)
	if storeID == "" {
		return domain.FieldReadinessEscalationRecord{}, fmt.Errorf("store id is required")
	}
	if strings.TrimSpace(req.Reason) == "" {
		return domain.FieldReadinessEscalationRecord{}, fmt.Errorf("reason is required")
	}
	validTeams := map[string]bool{
		"partner-management": true,
		"control-panel":      true,
		"marketing":          true,
	}
	if !validTeams[strings.TrimSpace(req.TargetTeam)] {
		return domain.FieldReadinessEscalationRecord{}, fmt.Errorf("target_team must be one of: partner-management, control-panel, marketing")
	}

	var storeExists bool
	if err := repo.db.QueryRowContext(ctx,
		`SELECT EXISTS (SELECT 1 FROM dsh_store_discovery_stores WHERE id = $1)`, storeID,
	).Scan(&storeExists); err != nil {
		return domain.FieldReadinessEscalationRecord{}, err
	}
	if !storeExists {
		return domain.FieldReadinessEscalationRecord{}, fmt.Errorf("store not found")
	}

	id := generateFieldReadinessEscalationID()
	query := `
INSERT INTO dsh_field_readiness_escalations (
  id, store_id, field_agent_id, reason, target_team, status, created_at, updated_at
) VALUES (
  $1, $2, NULLIF($3, ''), $4, $5, 'escalated', NOW(), NOW()
)
RETURNING id, store_id, field_agent_id, reason, target_team, status, operator_note, created_at, updated_at`

	var res domain.FieldReadinessEscalationRecord
	var resFieldAgentID sql.NullString
	var resOperatorNote sql.NullString
	err := repo.db.QueryRowContext(ctx, query,
		id,
		storeID,
		strings.TrimSpace(req.FieldAgentID),
		strings.TrimSpace(req.Reason),
		strings.TrimSpace(req.TargetTeam),
	).Scan(
		&res.ID,
		&res.StoreID,
		&resFieldAgentID,
		&res.Reason,
		&res.TargetTeam,
		&res.Status,
		&resOperatorNote,
		&res.CreatedAt,
		&res.UpdatedAt,
	)
	if err != nil {
		return domain.FieldReadinessEscalationRecord{}, err
	}
	res.FieldAgentID = nullableString(resFieldAgentID)
	res.OperatorNote = nullableString(resOperatorNote)
	return res, nil
}

// ─── J-006D: ListFieldReadinessEscalations ───────────────────────────────────

// ListFieldReadinessEscalations — CP operator view, filterable by status, paginated.
func (repo *PostgresRepository) ListFieldReadinessEscalations(
	ctx context.Context,
	query domain.ListFieldReadinessEscalationsQuery,
) (domain.ListFieldReadinessEscalationsResponse, error) {
	args := []any{}
	where := []string{}

	if strings.TrimSpace(query.Status) != "" {
		args = append(args, strings.TrimSpace(query.Status))
		where = append(where, fmt.Sprintf("status = $%d", len(args)))
	}

	limit := query.Limit
	if limit <= 0 {
		limit = 20
	}
	offset := query.Offset
	if offset < 0 {
		offset = 0
	}

	whereClause := ""
	if len(where) > 0 {
		whereClause = "WHERE " + strings.Join(where, " AND ")
	}

	args = append(args, limit)
	limitPH := len(args)
	args = append(args, offset)
	offsetPH := len(args)

	countQ := fmt.Sprintf(`SELECT COUNT(*) FROM dsh_field_readiness_escalations %s`, whereClause)
	var total int
	if err := repo.db.QueryRowContext(ctx, countQ, args[:len(args)-2]...).Scan(&total); err != nil {
		return domain.ListFieldReadinessEscalationsResponse{}, err
	}

	listQ := fmt.Sprintf(`
SELECT id, store_id, field_agent_id, reason, target_team, status, operator_note, created_at, updated_at
FROM dsh_field_readiness_escalations
%s
ORDER BY created_at DESC
LIMIT $%d OFFSET $%d`, whereClause, limitPH, offsetPH)

	rows, err := repo.db.QueryContext(ctx, listQ, args...)
	if err != nil {
		return domain.ListFieldReadinessEscalationsResponse{}, err
	}
	defer rows.Close()

	escalations := []domain.FieldReadinessEscalationRecord{}
	for rows.Next() {
		var rec domain.FieldReadinessEscalationRecord
		var fieldAgentID sql.NullString
		var operatorNote sql.NullString
		if err := rows.Scan(
			&rec.ID,
			&rec.StoreID,
			&fieldAgentID,
			&rec.Reason,
			&rec.TargetTeam,
			&rec.Status,
			&operatorNote,
			&rec.CreatedAt,
			&rec.UpdatedAt,
		); err != nil {
			return domain.ListFieldReadinessEscalationsResponse{}, err
		}
		rec.FieldAgentID = nullableString(fieldAgentID)
		rec.OperatorNote = nullableString(operatorNote)
		escalations = append(escalations, rec)
	}
	if err := rows.Err(); err != nil {
		return domain.ListFieldReadinessEscalationsResponse{}, err
	}

	return domain.ListFieldReadinessEscalationsResponse{
		Escalations: escalations,
		Pagination: domain.Pagination{
			Limit:  limit,
			Offset: offset,
			Total:  total,
		},
	}, nil
}

// ─── J-006D: UpdateFieldReadinessEscalation ──────────────────────────────────

// UpdateFieldReadinessEscalation — CP operator updates escalation status and optional note.
func (repo *PostgresRepository) UpdateFieldReadinessEscalation(
	ctx context.Context,
	id string,
	req domain.UpdateFieldReadinessEscalationRequest,
) (domain.FieldReadinessEscalationRecord, error) {
	id = strings.TrimSpace(id)
	if id == "" {
		return domain.FieldReadinessEscalationRecord{}, fmt.Errorf("escalation id is required")
	}
	validStatuses := map[string]bool{
		"info_requested": true,
		"resolved":       true,
		"rejected":       true,
	}
	status := strings.TrimSpace(req.Status)
	if !validStatuses[status] {
		return domain.FieldReadinessEscalationRecord{}, fmt.Errorf("status must be one of: info_requested, resolved, rejected")
	}

	query := `
UPDATE dsh_field_readiness_escalations
SET status = $1,
    operator_note = NULLIF($2, ''),
    updated_at = NOW()
WHERE id = $3
RETURNING id, store_id, field_agent_id, reason, target_team, status, operator_note, created_at, updated_at`

	var res domain.FieldReadinessEscalationRecord
	var resFieldAgentID sql.NullString
	var resOperatorNote sql.NullString
	err := repo.db.QueryRowContext(ctx, query,
		status,
		strings.TrimSpace(req.OperatorNote),
		id,
	).Scan(
		&res.ID,
		&res.StoreID,
		&resFieldAgentID,
		&res.Reason,
		&res.TargetTeam,
		&res.Status,
		&resOperatorNote,
		&res.CreatedAt,
		&res.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return domain.FieldReadinessEscalationRecord{}, fmt.Errorf("escalation %s not found", id)
	}
	if err != nil {
		return domain.FieldReadinessEscalationRecord{}, err
	}
	res.FieldAgentID = nullableString(resFieldAgentID)
	res.OperatorNote = nullableString(resOperatorNote)
	return res, nil
}

// ─── J-006E: CreateFieldReadinessApproval ────────────────────────────────────

// CreateFieldReadinessApproval — CP operator approves or rejects a store's readiness package.
// On 'approved': sets partner_readiness_status to 'ready' so it is eligible for J-001C gate.
// No financial mutation (WLT boundary).
func (repo *PostgresRepository) CreateFieldReadinessApproval(
	ctx context.Context,
	storeID string,
	req domain.CreateFieldReadinessApprovalRequest,
) (domain.FieldReadinessApprovalRecord, error) {
	storeID = strings.TrimSpace(storeID)
	if storeID == "" {
		return domain.FieldReadinessApprovalRecord{}, fmt.Errorf("store id is required")
	}
	decision := strings.TrimSpace(req.Decision)
	if decision != "approved" && decision != "rejected" {
		return domain.FieldReadinessApprovalRecord{}, fmt.Errorf("decision must be approved or rejected")
	}

	var storeExists bool
	if err := repo.db.QueryRowContext(ctx,
		`SELECT EXISTS (SELECT 1 FROM dsh_store_discovery_stores WHERE id = $1)`, storeID,
	).Scan(&storeExists); err != nil {
		return domain.FieldReadinessApprovalRecord{}, err
	}
	if !storeExists {
		return domain.FieldReadinessApprovalRecord{}, fmt.Errorf("store not found")
	}

	id := generateFieldReadinessApprovalID()

	// Persist approval record.
	insertQ := `
INSERT INTO dsh_field_readiness_approvals (
  id, store_id, operator_id, decision, reason, created_at
) VALUES (
  $1, $2, NULLIF($3, ''), $4, NULLIF($5, ''), NOW()
)
RETURNING id, store_id, operator_id, decision, reason, created_at`

	var res domain.FieldReadinessApprovalRecord
	var resOperatorID sql.NullString
	var resReason sql.NullString
	err := repo.db.QueryRowContext(ctx, insertQ,
		id,
		storeID,
		strings.TrimSpace(req.OperatorID),
		decision,
		strings.TrimSpace(req.Reason),
	).Scan(
		&res.ID,
		&res.StoreID,
		&resOperatorID,
		&res.Decision,
		&resReason,
		&res.CreatedAt,
	)
	if err != nil {
		return domain.FieldReadinessApprovalRecord{}, err
	}
	res.OperatorID = nullableString(resOperatorID)
	res.Reason = nullableString(resReason)

	// On approval: promote partner_readiness_status to 'ready' so J-001C gate becomes eligible.
	// On rejection: set to 'not_ready' to block client visibility until re-approved.
	// DSH-SLICE-006E: only partner_readiness_status is updated here; full visibility
	// gate promotion (publish_stage='published') remains the CP operator's explicit action
	// via PATCH /stores/{id}/partner-readiness (J-001C).
	newReadinessStatus := "not_ready"
	if decision == "approved" {
		newReadinessStatus = "ready"
	}
	if _, updateErr := repo.db.ExecContext(ctx,
		`UPDATE dsh_store_discovery_stores SET partner_readiness_status = $1, updated_at = NOW() WHERE id = $2`,
		newReadinessStatus, storeID,
	); updateErr != nil {
		return domain.FieldReadinessApprovalRecord{}, updateErr
	}

	return res, nil
}

// ─── J-006E: GetLatestFieldReadinessApproval ─────────────────────────────────

// GetLatestFieldReadinessApproval — returns the most recent approval record for a store.
func (repo *PostgresRepository) GetLatestFieldReadinessApproval(
	ctx context.Context,
	storeID string,
) (domain.FieldReadinessApprovalRecord, error) {
	storeID = strings.TrimSpace(storeID)
	if storeID == "" {
		return domain.FieldReadinessApprovalRecord{}, fmt.Errorf("store id is required")
	}

	query := `
SELECT id, store_id, operator_id, decision, reason, created_at
FROM dsh_field_readiness_approvals
WHERE store_id = $1
ORDER BY created_at DESC
LIMIT 1`

	var res domain.FieldReadinessApprovalRecord
	var resOperatorID sql.NullString
	var resReason sql.NullString
	err := repo.db.QueryRowContext(ctx, query, storeID).Scan(
		&res.ID,
		&res.StoreID,
		&resOperatorID,
		&res.Decision,
		&resReason,
		&res.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return domain.FieldReadinessApprovalRecord{}, fmt.Errorf("no approval found for store %s", storeID)
	}
	if err != nil {
		return domain.FieldReadinessApprovalRecord{}, err
	}
	res.OperatorID = nullableString(resOperatorID)
	res.Reason = nullableString(resReason)
	return res, nil
}
