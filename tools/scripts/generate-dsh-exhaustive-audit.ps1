param(
  [string]$DonorRoot = 'c:/Users/b/Documents/GitHub/bthfinal',
  [string]$TargetRoot = 'c:/Users/b/Documents/GitHub/bthwani-suite'
)

$docsRoot = Join-Path $TargetRoot 'docs/services/dsh'

function Get-RelPath {
  param([string]$FullPath, [string]$Root)
  $relative = [System.IO.Path]::GetRelativePath($Root, $FullPath)
  return ($relative -replace '\\', '/')
}

function New-OpMap {
  param(
    [string]$Family,
    [string]$Status,
    [string]$Candidates,
    [string]$Canonical,
    [string]$Confidence,
    [string]$Notes
  )

  [pscustomobject]@{
    target_family       = $Family
    target_status       = $Status
    candidate_ids       = $Candidates
    canonical_targets   = $Canonical
    mapping_confidence  = $Confidence
    mapping_notes       = $Notes
  }
}

function Map-Operation {
  param([string]$OperationId)

  switch -Regex ($OperationId) {
    '^dsh_delivery_position_update$' {
      return New-OpMap 'orphan_delivery_position' 'orphan_dossier' '' '' 'high' 'This dossier exists in donor operations but is not present in the donor inventory catalog.'
    }
    '^dsh_(delivery_attempts_list|delivery_close|delivery_get)$' {
      return New-OpMap 'dsh_customer_order_tracking' 'support_folded' 'dsh_client_active_order_tracking' 'dsh_client_active_order_tracking' 'medium' 'Derived delivery-view screen folded into current tracking truth.'
    }
    '^dsh_(delivery_reassign|delivery_position_update)$' {
      return New-OpMap 'dsh_ops_governance_controls' 'internal_or_support' 'dsh_ops_order_detail_exception_workspace|dsh_ops_orders_board' 'dsh_ops_order_detail_exception_workspace' 'medium' 'Derived delivery-control screen sits in exception or oversight space.'
    }
    '^dsh_order_cancel$' {
      return New-OpMap 'dsh_customer_order_tracking' 'support_folded' 'dsh_client_active_order_tracking' 'dsh_client_active_order_tracking' 'high' 'Cancellation is reflected through tracking rather than a separate clean screen family.'
    }
    '^dsh_search$' {
      return New-OpMap 'dsh_store_discovery' 'support_folded' 'dsh_client_entry_discovery_home|dsh_client_category_or_store_detail' 'dsh_client_entry_discovery_home|dsh_client_category_or_store_detail' 'medium' 'Search support is folded into discovery.'
    }
    '^dsh_(awnak_order_create|gas_refill_order_create)$' {
      return New-OpMap 'legacy_non_current_order_vertical' 'move_to_legacy' 'legacy_or_future_scope' '' 'high' 'This donor vertical is outside current DSH first-service truth.'
    }
    '^dsh_(captain_profile_get|partner_profile_get)$' {
      return New-OpMap 'legacy_actor_profile_support' 'move_to_legacy' 'legacy_or_future_scope' '' 'high' 'Actor profile support is outside the current DSH operational screen truth.'
    }
    '^dsh_partner_(listing_status_update|auction_status_update)$' {
      return New-OpMap 'dsh_ops_governance_controls' 'internal_or_support' 'dsh_ops_orders_board|dsh_ops_order_detail_exception_workspace|dsh_ops_peak_mode_control' 'dsh_ops_orders_board|dsh_ops_order_detail_exception_workspace|dsh_ops_peak_mode_control' 'medium' 'Partner-facing status admin is treated as governance spillover, not a canonical partner screen family.'
    }
    '^dsh_partner_commission_by_mode_get$' {
      return New-OpMap 'legacy_ops_store_admin' 'move_to_legacy' 'dsh_ops_store_items_and_zone_admin_cluster' '' 'high' 'Commission-by-mode is admin or finance spillover outside current truth.'
    }
    '^dsh_partner_hours_update$' {
      return New-OpMap 'dsh_partner_store_maintenance' 'covered' 'dsh_partner_store_maintenance_workspace' 'dsh_partner_store_maintenance_workspace' 'high' 'Partner hours remain part of store-readiness maintenance.'
    }
    '^dsh_(proxy_request_.*|external_order_create)$' {
      return New-OpMap 'dsh_proxy_request_flow' 'covered' 'dsh_client_proxy_request_entry|dsh_client_proxy_request_tracking|dsh_proxy_requests_list|dsh_proxy_request_review_workspace|dsh_proxy_schedule_companion' 'dsh_client_proxy_request_entry|dsh_client_proxy_request_tracking|dsh_proxy_requests_list|dsh_proxy_request_review_workspace' 'high' 'Proxy exception family with customer entry and internal review.'
    }
    '^dsh_field_store_(activation_request|geo_pin|visit_log)$' {
      return New-OpMap 'dsh_field_activation_support' 'covered' 'dsh_field_activation_workspace|dsh_field_geo_pin_companion|dsh_field_visit_log_companion' 'dsh_field_activation_workspace' 'high' 'Field support branch remains optional.'
    }
    '^dsh_captain_orders_offers_get$' {
      return New-OpMap 'dsh_captain_offer_and_acceptance' 'covered' 'dsh_captain_offers_list' 'dsh_captain_offers_list' 'high' 'Captain offer entry family.'
    }
    '^dsh_captain_job_reject$' {
      return New-OpMap 'dsh_captain_offer_and_acceptance' 'converted_companion' 'dsh_captain_reject_action' 'dsh_captain_execution_workspace' 'high' 'Reject action is subordinate to captain execution.'
    }
    '^dsh_captain_proof_upload$' {
      return New-OpMap 'dsh_delivery_proof_and_verification' 'covered' 'dsh_captain_proof_capture' 'dsh_captain_proof_capture' 'high' 'Proof capture is an explicit completion gate.'
    }
    '^dsh_captain_chat_(send|read_ack)$' {
      return New-OpMap 'dsh_customer_order_chat' 'converted_companion' 'dsh_captain_chat_companion' 'dsh_captain_execution_workspace' 'high' 'Captain chat is kept as a companion interaction.'
    }
    '^dsh_captain_(cod_balance|tier_.*)$' {
      return New-OpMap 'legacy_captain_finance_tier' 'move_to_legacy' 'dsh_captain_finance_and_tier_cluster' '' 'high' 'Finance and tier material sits outside current first-service truth.'
    }
    '^dsh_partner_chat_(send|read_ack)$' {
      return New-OpMap 'dsh_customer_order_chat' 'converted_companion' 'dsh_partner_chat_companion' 'dsh_partner_order_workspace' 'high' 'Partner chat is kept as a companion interaction.'
    }
    '^dsh_partner_quick_reply_.*$' {
      return New-OpMap 'dsh_customer_order_chat' 'converted_companion' 'dsh_partner_chat_companion' 'dsh_partner_order_workspace' 'medium' 'Quick replies stay subordinate to partner workspace communication.'
    }
    '^dsh_partner_order_(handoff|out_for_delivery|store_delivered)$' {
      return New-OpMap 'dsh_partner_order_handling' 'covered' 'dsh_partner_order_workspace|dsh_partner_handoff_action' 'dsh_partner_order_workspace' 'high' 'Partner execution stays inside one workspace.'
    }
    '^dsh_partner_(store_(create|get|update|service_modes_update|status_update)|delivery_zones_update|inventory_adjust|inventory_update|items_upsert)$' {
      return New-OpMap 'dsh_partner_store_maintenance' 'covered' 'dsh_partner_store_maintenance_workspace' 'dsh_partner_store_maintenance_workspace' 'high' 'Partner store readiness and configuration family.'
    }
    '^dsh_partner_(identity_submit|intake_start|manager_invite|doc_upload)$' {
      return New-OpMap 'legacy_partner_identity_staff' 'move_to_legacy' 'dsh_partner_identity_staff_cluster' '' 'high' 'Partner onboarding and admin extras remain outside current operational truth.'
    }
    '^dsh_partner_subscription_.*$' {
      return New-OpMap 'legacy_partner_subscription_analytics' 'move_to_legacy' 'dsh_partner_subscription_analytics_cluster' '' 'high' 'Partner subscription and analytics extras remain outside current truth.'
    }
    '^dsh_(chat_send|chat_read_ack)$' {
      return New-OpMap 'dsh_customer_order_chat' 'converted_companion' 'dsh_client_order_chat_companion' 'dsh_client_active_order_tracking' 'high' 'Customer chat is subordinate to active tracking.'
    }
    '^dsh_(checkout_gate|pricing_preview|cart_init|cart_get|cart_item_add|cart_item_update|cart_item_remove)$' {
      return New-OpMap 'dsh_cart_checkout_gate' 'covered' 'dsh_client_cart_review|dsh_client_checkout_confirm|dsh_client_checkout_block_state' 'dsh_client_cart_review|dsh_client_checkout_confirm' 'high' 'Cart and checkout gating family.'
    }
    '^dsh_(order_create|booking_create|estimate_create|estimate_get|order_accept)$' {
      return New-OpMap 'dsh_order_submit' 'covered_or_folded' 'dsh_client_checkout_confirm' 'dsh_client_checkout_confirm' 'medium' 'Submission-side operation supporting the confirmed order handoff.'
    }
    '^dsh_(orders_list|order_status_update|delivery_track_get)$' {
      return New-OpMap 'dsh_customer_order_tracking' 'covered' 'dsh_client_active_order_tracking' 'dsh_client_active_order_tracking' 'high' 'Customer-visible order tracking family.'
    }
    '^dsh_(order_proof_code_generate|order_proof_verify|delivery_attempt_create|delivery_eta_get|order_complete)$' {
      return New-OpMap 'dsh_customer_order_tracking' 'support_folded' 'dsh_client_active_order_tracking|dsh_captain_proof_capture' 'dsh_client_active_order_tracking|dsh_captain_proof_capture' 'low' 'Support operation that affects completion or visibility without a standalone current-screen identity.'
    }
    '^dsh_(order_issue_flag|delivery_reassign_request|operations_peak_mode_put|listing_status_update|auction_status_update)$' {
      return New-OpMap 'dsh_ops_governance_controls' 'internal_or_support' 'dsh_ops_orders_board|dsh_ops_order_detail_exception_workspace|dsh_ops_peak_mode_control' 'dsh_ops_orders_board|dsh_ops_order_detail_exception_workspace|dsh_ops_peak_mode_control' 'medium' 'Internal oversight or exception handling family.'
    }
    '^dsh_(review_create|order_rate|order_receipt_get)$' {
      return New-OpMap 'legacy_client_receipt_rating' 'move_to_legacy' 'dsh_client_receipt_rating_cluster' '' 'high' 'Post-completion rating and receipt cluster is currently deferred.'
    }
    '^dsh_(order_escrow_hold|order_escrow_release)$' {
      return New-OpMap 'legacy_finance_leakage' 'move_to_legacy' 'finance_or_wlt_deferred' '' 'high' 'Escrow actions are finance-adjacent and remain outside current DSH first-service truth.'
    }
    '^dsh_(loyalty_points_.*|subscription_.*|promo_apply)$' {
      return New-OpMap 'legacy_client_loyalty_subscription_marketing' 'move_to_legacy' 'dsh_client_loyalty_subscription_marketing_cluster' '' 'high' 'Loyalty, promo, and subscription extras are outside current first-service truth.'
    }
    '^dsh_store_products$' {
      return New-OpMap 'dsh_store_discovery' 'covered' 'dsh_client_category_or_store_detail' 'dsh_client_category_or_store_detail' 'high' 'Store detail and item selection family.'
    }
    '^dsh_(service_modes_resolve|entitlements_get|pricing_snapshot_get)$' {
      return New-OpMap 'dsh_store_discovery' 'support_folded' 'dsh_client_entry_discovery_home|dsh_client_category_or_store_detail' 'dsh_client_entry_discovery_home|dsh_client_category_or_store_detail' 'medium' 'Discovery and detail-support operation family.'
    }
    '^dsh_(store_commission_set|store_fulfillment_profile_update|store_modes_set|store_service_modes_get|store_zones_set|zone_set)$' {
      return New-OpMap 'legacy_ops_store_admin' 'move_to_legacy_or_partner_maintenance' 'dsh_partner_store_maintenance_workspace|dsh_ops_store_items_and_zone_admin_cluster' 'dsh_partner_store_maintenance_workspace' 'medium' 'Donor mixes partner and MCPW/admin ownership here; clean target model narrows or defers it.'
    }
    default {
      return New-OpMap 'UNMAPPED' 'needs_review' '' '' 'low' 'No current deterministic clean mapping rule found.'
    }
  }
}

function Derive-OperationFromPath {
  param([string]$RelativePath)

  if ($RelativePath -match '^services/dsh/governance/operations/(dsh_[^/]+)/') {
    return $Matches[1]
  }

  if ($RelativePath -match 'auto_(dsh_[^./]+)\.') {
    return $Matches[1]
  }

  if ($RelativePath -match '/operations/dsh/zone-set/page\.tsx$') {
    return 'dsh_zone_set'
  }

  if ($RelativePath -match '/operations/dsh/sheinproxy/\[id\]/schedule/page\.tsx$') {
    return 'dsh_proxy_request_schedule'
  }

  if ($RelativePath -match '/operations/dsh/sheinproxy/\[id\]/offer/page\.tsx$') {
    return 'dsh_proxy_request_offer'
  }

  if ($RelativePath -match '/operations/dsh/sheinproxy/\[id\]/page\.tsx$') {
    return 'dsh_proxy_request_review_cluster'
  }

  if ($RelativePath -match '/support/dsh-chat/page\.tsx$') {
    return 'dsh_chat_support_cluster'
  }

  if ($RelativePath -match '/service-catalog/services/dsh/page\.tsx$') {
    return 'dsh_service_catalog_entry'
  }

  return ''
}

function Get-FileRole {
  param([string]$RelativePath)

  switch -Regex ($RelativePath) {
    '/dist/' { return 'generated_artifact' }
    '\.d\.ts(\.map)?$' { return 'generated_artifact' }
    '\.js(\.map)?$' { return 'generated_artifact' }
    '^services/dsh/governance/operations/[^/]+/OP_SPEC\.yaml$' { return 'operation_spec' }
    '^services/dsh/governance/operations/[^/]+/OP_SCREENS_MAP\.csv$' { return 'operation_screens_map' }
    '^services/dsh/governance/operations/[^/]+/OP_RUNTIME_VARS\.csv$' { return 'operation_runtime_vars' }
    '^services/dsh/governance/operations/[^/]+/OP_RBAC_ABAC\.csv$' { return 'operation_rbac_abac' }
    '^services/dsh/governance/operations/[^/]+/OP_MCPW_MAP\.csv$' { return 'operation_mcpw_map' }
    '^services/dsh/governance/operations/[^/]+/OP_GAPS\.md$' { return 'operation_gaps' }
    '^services/dsh/governance/operations/[^/]+/OP_EVIDENCE_INDEX\.json$' { return 'operation_evidence_index' }
    '^services/dsh/governance/operations/[^/]+/OP_API_MAP\.csv$' { return 'operation_api_map' }
    '^services/dsh/governance/operations/[^/]+/OP_ACTIONS_CATALOG\.csv$' { return 'operation_actions_catalog' }
    '^services/dsh/governance/operations/[^/]+/OP_ACCEPTANCE\.md$' { return 'operation_acceptance' }
    '^services/dsh/governance/(service-level/)?DSH_SERVICE_SCOPE\.md$' { return 'service_scope' }
    '^services/dsh/governance/(service-level/)?DSH_(SEAL_STATUS|SERVICE_SEAL_STATUS)\.ya?ml$' { return 'service_seal_status' }
    '^services/dsh/governance/(service-level/)?DSH_RUNTIME_VARS\.csv$' { return 'service_runtime_vars' }
    '^services/dsh/governance/(service-level/)?DSH_RBAC_MATRIX\.csv$' { return 'service_rbac_matrix' }
    '^services/dsh/governance/(service-level/)?DSH_OPERATION_CATALOG\.csv$' { return 'service_operation_catalog' }
    '^services/dsh/governance/(service-level/)?DSH_MCPW_SECTION_MAP\.csv$' { return 'service_mcpw_section_map' }
    '^services/dsh/governance/(service-level/)?DSH_COVERAGE_MATRIX\.csv$' { return 'service_coverage_matrix' }
    '^services/dsh/governance/DSH_TRACEABILITY(\.csv|_MATRIX\.csv)$' { return 'service_traceability' }
    '^services/dsh/governance/DSH_UNIFIED_OPERATIONS_REFERENCE\.csv$' { return 'service_unified_operations_reference' }
    '^services/dsh/governance/scripts/' { return 'governance_script' }
    '^services/dsh/src/controllers/' { return 'backend_controller' }
    '^services/dsh/src/entities/' { return 'backend_entity' }
    '^services/dsh/src/.*test' { return 'backend_test' }
    '^services/dsh/src/' { return 'backend_source' }
    '^services/dsh/(index\.js|package\.json|project\.json|jest\.config\.js|tsconfig.*)$' { return 'service_package_or_config' }
    '^packages/surfaces/src/dsh/.+\.(tsx|ts)$' { return 'surface_component' }
    '^packages/surfaces/src/web/mcpw/.+\.(tsx|ts)$' { return 'mcpw_surface_component' }
    '^packages/domain-types/src/dsh.*' { return 'domain_type' }
    '^apps/web/mcpw/app/.+/page\.tsx$' { return 'app_route_page' }
    '^apps/backend/api-host/src/local-prod/dsh-.+' { return 'local_prod_dsh_helper' }
    '^contracts/' { return 'contract_reference' }
    default { return 'other' }
  }
}

function Convert-DecisionToStatus {
  param([string]$Decision)

  switch ($Decision) {
    'Keep' { return 'candidate_keep' }
    'Merge' { return 'candidate_merge' }
    'Convert' { return 'candidate_convert' }
    'Internal' { return 'internal_only' }
    'Move to Legacy' { return 'move_to_legacy' }
    default { return '' }
  }
}

function Get-SurfaceGuess {
  param([string]$RelativePath)

  switch -Regex ($RelativePath) {
    '/app-user/' { return 'app-client' }
    '/app-partner/' { return 'app-partner' }
    '/app-captain/' { return 'app-captain' }
    '/app-field/' { return 'app-field' }
    '/mcpw/' { return 'control-panel' }
    '/service-catalog/services/dsh/' { return 'control-panel' }
    '/support/dsh-chat/' { return 'control-panel' }
    default { return '' }
  }
}

$candidateCatalog = Import-Csv (Join-Path $docsRoot '09_SCREEN_CATALOG.csv')
$candidateFileIndex = @{}
foreach ($candidate in $candidateCatalog) {
  $matches = [regex]::Matches([string]$candidate.source_trace, '[A-Za-z0-9_\-\[\]]+\.(?:tsx|ts|jsx|js)')
  foreach ($match in $matches) {
    $key = $match.Value
    if (-not $candidateFileIndex.ContainsKey($key)) {
      $candidateFileIndex[$key] = New-Object System.Collections.Generic.List[object]
    }
    $candidateFileIndex[$key].Add($candidate)
  }
}

$inventory = Import-Csv (Join-Path $DonorRoot 'services/dsh/governance/DSH_OPERATION_CATALOG.csv')
$traceability = Import-Csv (Join-Path $DonorRoot 'services/dsh/governance/DSH_TRACEABILITY.csv')
$traceIndex = @{}
foreach ($row in $traceability) {
  $traceIndex[$row.operation_id] = $row
}

$sourceRoots = @(
  (Join-Path $DonorRoot 'services'),
  (Join-Path $DonorRoot 'packages'),
  (Join-Path $DonorRoot 'apps'),
  (Join-Path $DonorRoot 'contracts')
)

$directFiles = Get-ChildItem -Path $sourceRoots -File -Recurse |
  Where-Object { $_.FullName -notmatch '\\node_modules\\' } |
  Where-Object {
    $rel = Get-RelPath -FullPath $_.FullName -Root $DonorRoot
    $rel -match '^(services/dsh/|packages/.*/src/dsh/|packages/surfaces/src/web/mcpw/.*/dsh/|apps/.*/dsh/|.*?/dsh/|.*Dsh|.*shein-proxy|.*proxy-request)'
  } |
  Sort-Object FullName

$fileCensus = foreach ($file in $directFiles) {
  $relativePath = Get-RelPath -FullPath $file.FullName -Root $DonorRoot
  $operationId = Derive-OperationFromPath -RelativePath $relativePath
  $mapping = if ($operationId -like 'dsh_*') { Map-Operation -OperationId $operationId } else { New-OpMap '' 'support_only' '' '' 'n/a' 'Supporting or cluster-level file without a single operation identity.' }
  $basename = Split-Path $relativePath -Leaf
  $fileRole = Get-FileRole -RelativePath $relativePath
  $candidateMatches = @()
  if ($candidateFileIndex.ContainsKey($basename)) {
    $candidateMatches = $candidateFileIndex[$basename]
  }

  $candidateIds = if ($candidateMatches.Count -gt 0) { (($candidateMatches | ForEach-Object { $_.candidate_id } | Sort-Object -Unique) -join '|') } else { $mapping.candidate_ids }
  $canonicalTargets = if ($candidateMatches.Count -gt 0) { (($candidateMatches | ForEach-Object { $_.canonical_target } | Sort-Object -Unique) -join '|') } else { $mapping.canonical_targets }
  $candidateDecisions = if ($candidateMatches.Count -gt 0) { (($candidateMatches | ForEach-Object { $_.decision } | Sort-Object -Unique) -join '|') } else { '' }
  $effectiveStatus = $mapping.target_status
  if ($fileRole -eq 'generated_artifact') {
    $effectiveStatus = 'generated_copy'
  }
  elseif ($candidateMatches.Count -gt 0 -and $mapping.target_status -eq 'needs_review') {
    $decisionStatus = (($candidateMatches | ForEach-Object { Convert-DecisionToStatus -Decision $_.decision } | Where-Object { $_ } | Sort-Object -Unique) -join '|')
    if (-not [string]::IsNullOrWhiteSpace($decisionStatus)) {
      $effectiveStatus = $decisionStatus
    }
  }
  elseif ($operationId -eq 'dsh_service_catalog_entry' -or $operationId -eq 'dsh_chat_support_cluster') {
    $effectiveStatus = 'support_only'
  }

  [pscustomobject]@{
    donor_path            = $relativePath
    top_bucket            = ($relativePath -split '/')[0]
    file_role             = $fileRole
    derived_operation_id  = $operationId
    surface_guess         = Get-SurfaceGuess -RelativePath $relativePath
    extension             = $file.Extension
    target_family_guess   = $mapping.target_family
    target_status         = $effectiveStatus
    matched_candidate_ids = $candidateIds
    canonical_targets     = $canonicalTargets
    candidate_decisions   = $candidateDecisions
    mapping_confidence    = $mapping.mapping_confidence
    notes                 = $mapping.mapping_notes
  }
}

$fileCensus | Export-Csv -Path (Join-Path $docsRoot '19_DONOR_REPO_DSH_FILE_CENSUS.csv') -NoTypeInformation -Encoding UTF8

$expectedDossierFiles = @(
  'OP_SPEC.yaml',
  'OP_SCREENS_MAP.csv',
  'OP_RUNTIME_VARS.csv',
  'OP_RBAC_ABAC.csv',
  'OP_MCPW_MAP.csv',
  'OP_GAPS.md',
  'OP_EVIDENCE_INDEX.json',
  'OP_API_MAP.csv',
  'OP_ACTIONS_CATALOG.csv',
  'OP_ACCEPTANCE.md'
)

$operationAudit = foreach ($op in $inventory) {
  $operationId = $op.operationId
  $dossierDir = Join-Path $DonorRoot ("services/dsh/governance/operations/$operationId")
  $presentFiles = if (Test-Path $dossierDir) { Get-ChildItem -Path $dossierDir -File | Select-Object -ExpandProperty Name } else { @() }
  $screenMapPath = Join-Path $dossierDir 'OP_SCREENS_MAP.csv'
  $screenMap = if (Test-Path $screenMapPath) { Import-Csv $screenMapPath } else { @() }
  $trace = if ($traceIndex.ContainsKey($operationId)) { $traceIndex[$operationId] } else { $null }
  $mapping = Map-Operation -OperationId $operationId

  [pscustomobject]@{
    operation_id               = $operationId
    category                   = $op.category
    donor_status               = $op.status
    donor_catalog_implemented  = $op.implemented
    donor_mobile_surfaces      = $op.surfaces_mobile
    donor_web_mcpw_surfaces    = $op.surfaces_web_mcpw
    dossier_exists             = [bool](Test-Path $dossierDir)
    dossier_file_count         = $presentFiles.Count
    dossier_complete           = (($expectedDossierFiles | Where-Object { $_ -in $presentFiles }).Count -eq $expectedDossierFiles.Count)
    has_spec                   = ('OP_SPEC.yaml' -in $presentFiles)
    has_screens_map            = ('OP_SCREENS_MAP.csv' -in $presentFiles)
    has_runtime_vars           = ('OP_RUNTIME_VARS.csv' -in $presentFiles)
    has_rbac_abac              = ('OP_RBAC_ABAC.csv' -in $presentFiles)
    has_mcpw_map               = ('OP_MCPW_MAP.csv' -in $presentFiles)
    has_gaps                   = ('OP_GAPS.md' -in $presentFiles)
    has_evidence_index         = ('OP_EVIDENCE_INDEX.json' -in $presentFiles)
    has_api_map                = ('OP_API_MAP.csv' -in $presentFiles)
    has_actions_catalog        = ('OP_ACTIONS_CATALOG.csv' -in $presentFiles)
    has_acceptance             = ('OP_ACCEPTANCE.md' -in $presentFiles)
    donor_screen_ids           = (($screenMap | ForEach-Object { $_.screen_id } | Sort-Object -Unique) -join '|')
    donor_routes               = (($screenMap | ForEach-Object { $_.route } | Sort-Object -Unique) -join '|')
    donor_route_surfaces       = (($screenMap | ForEach-Object { $_.surface } | Sort-Object -Unique) -join '|')
    trace_seal_status          = if ($trace) { $trace.seal_status } else { '' }
    trace_backend_path         = if ($trace) { $trace.backend_path } else { '' }
    trace_screen_path          = if ($trace) { $trace.screen_path } else { '' }
    trace_mcpw_path            = if ($trace) { $trace.mcpw_path } else { '' }
    target_family_guess        = $mapping.target_family
    target_status              = $mapping.target_status
    target_candidate_ids       = $mapping.candidate_ids
    target_canonical_targets   = $mapping.canonical_targets
    mapping_confidence         = $mapping.mapping_confidence
    mapping_notes              = $mapping.mapping_notes
  }
}

$operationAudit | Export-Csv -Path (Join-Path $docsRoot '20_DONOR_OPERATION_ROW_AUDIT.csv') -NoTypeInformation -Encoding UTF8

$routeRows = foreach ($op in $inventory) {
  $operationId = $op.operationId
  $dossierDir = Join-Path $DonorRoot ("services/dsh/governance/operations/$operationId")
  $screenMapPath = Join-Path $dossierDir 'OP_SCREENS_MAP.csv'
  if (Test-Path $screenMapPath) {
    $mapping = Map-Operation -OperationId $operationId
    foreach ($route in (Import-Csv $screenMapPath)) {
      [pscustomobject]@{
        operation_id            = $operationId
        donor_surface           = $route.surface
        donor_screen_id         = $route.screen_id
        donor_route             = $route.route
        operation_bindings      = $route.operation_bindings
        guards_applied          = $route.guards_applied
        rbac_required           = $route.rbac_required
        step_up_required        = $route.step_up_required
        target_family_guess     = $mapping.target_family
        target_status           = $mapping.target_status
        target_candidate_ids    = $mapping.candidate_ids
        target_canonical        = $mapping.canonical_targets
        mapping_confidence      = $mapping.mapping_confidence
        mapping_notes           = $mapping.mapping_notes
      }
    }
  }
}

$routeRows | Export-Csv -Path (Join-Path $docsRoot '21_DONOR_ROUTE_BINDING_CENSUS.csv') -NoTypeInformation -Encoding UTF8

$uiRoles = @('surface_component', 'mcpw_surface_component', 'app_route_page', 'local_prod_dsh_helper', 'domain_type')
$uiMatrix = foreach ($row in $fileCensus | Where-Object { $_.file_role -in $uiRoles }) {
  [pscustomobject]@{
    donor_path              = $row.donor_path
    donor_role              = $row.file_role
    surface_guess           = $row.surface_guess
    derived_operation_id    = $row.derived_operation_id
    target_family_guess     = $row.target_family_guess
    target_status           = $row.target_status
    matched_candidate_ids   = $row.matched_candidate_ids
    canonical_targets       = $row.canonical_targets
    candidate_decisions     = $row.candidate_decisions
    mapping_confidence      = $row.mapping_confidence
    notes                   = $row.notes
  }
}

$uiMatrix | Export-Csv -Path (Join-Path $docsRoot '22_DONOR_UI_FILE_TO_TARGET_MAPPING.csv') -NoTypeInformation -Encoding UTF8

$inventoryIds = $inventory.operationId
$dossierDirs = Get-ChildItem -Path (Join-Path $DonorRoot 'services/dsh/governance/operations') -Directory | Select-Object -ExpandProperty Name
$orphanDossiers = $dossierDirs | Where-Object { $_ -notin $inventoryIds } | Sort-Object
$missingDossiers = $inventoryIds | Where-Object { $_ -notin $dossierDirs } | Sort-Object

$unmappedRows = $fileCensus |
  Where-Object {
    $_.target_status -eq 'needs_review' -or
    ($_.file_role -in $uiRoles -and [string]::IsNullOrWhiteSpace($_.matched_candidate_ids) -and $_.target_status -notin @('move_to_legacy', 'move_to_legacy_or_partner_maintenance', 'support_only', 'generated_copy', 'candidate_keep', 'candidate_merge', 'candidate_convert', 'internal_only'))
  }

$unmappedPath = Join-Path $docsRoot '24_UNMAPPED_OR_REVIEW_REQUIRED_ITEMS.csv'
if ($unmappedRows.Count -gt 0) {
  $unmappedRows | Export-Csv -Path $unmappedPath -NoTypeInformation -Encoding UTF8
}
else {
  'donor_path,top_bucket,file_role,derived_operation_id,surface_guess,extension,target_family_guess,target_status,matched_candidate_ids,canonical_targets,candidate_decisions,mapping_confidence,notes' | Set-Content -Path $unmappedPath -Encoding UTF8
}

$bucketCounts = $fileCensus | Group-Object top_bucket | Sort-Object Name
$roleCounts = $fileCensus | Group-Object file_role | Sort-Object Name
$dossierCompleteCount = ($operationAudit | Where-Object { $_.dossier_complete -eq $true }).Count
$verifiedOps = ($operationAudit | Where-Object { $_.trace_seal_status -eq 'VERIFIED' }).Count
$plannedOps = ($operationAudit | Where-Object { $_.trace_seal_status -eq 'PLANNED_ONLY' }).Count
$uiMapped = ($uiMatrix | Where-Object { -not [string]::IsNullOrWhiteSpace($_.matched_candidate_ids) -or $_.target_status -in @('move_to_legacy', 'move_to_legacy_or_partner_maintenance', 'covered', 'covered_or_folded', 'converted_companion', 'internal_or_support', 'support_folded', 'candidate_keep', 'candidate_merge', 'candidate_convert', 'internal_only', 'orphan_dossier') }).Count
$sourceLikeFiles = ($fileCensus | Where-Object { $_.file_role -ne 'generated_artifact' }).Count
$partialDossiers = $operationAudit | Where-Object { $_.dossier_exists -eq $true -and $_.dossier_complete -eq $false }
$inventoryNeedsReview = $operationAudit | Where-Object { $_.target_status -eq 'needs_review' }

$report = @()
$report += '# 23_DONOR_OMISSION_CONTROL_REPORT'
$report += ''
$report += '## Mandatory Header'
$report += ''
$report += '- WorkMode: `SOURCE-TO-TARGET MODE`'
$report += '- CurrentPhase: `Phase 13 complete; Phase 14 next`'
$report += '- TargetService: `dsh`'
$report += '- RequestType: `source_to_target_pack`'
$report += '- PrimaryRepo: `bthwani-suite`'
$report += '- LegacyRepo: `bthfinal`'
$report += '- PackStatus: `exhaustive donor census and row audit generated`'
$report += '- BlockingGaps: `Current target repo still remains pre-Phase-14 compression and later phases remain unopened`'
$report += '- NextAllowed: `Use these generated artifacts to review omissions before Phase 14`'
$report += ''
$report += '## Executive Verdict'
$report += ''
$report += 'This report does not claim a false perfect donor truth.'
$report += 'It does claim that the donor DSH census here was generated systematically from the filesystem plus DSH operation dossiers plus current target comparison tables, so omission risk is materially reduced and explicitly reviewable.'
$report += ''
$report += '## Exhaustive Census Counts'
$report += ''
$report += ('- direct donor DSH-related files captured by explicit path or lexical evidence: `{0}`' -f $fileCensus.Count)
$report += ('- source-like donor files after excluding generated artifacts: `{0}`' -f $sourceLikeFiles)
$report += ('- donor operations in service inventory: `{0}`' -f $operationAudit.Count)
$report += ('- donor dossier directories physically present: `{0}`' -f $dossierDirs.Count)
$report += ('- donor orphan dossier directories not present in inventory: `{0}`' -f $orphanDossiers.Count)
$report += ('- donor inventory operations missing dossier directories: `{0}`' -f $missingDossiers.Count)
$report += ('- donor operation dossiers marked complete by expected `10` file set: `{0}`' -f $dossierCompleteCount)
$report += ('- donor operation dossiers present but partial: `{0}`' -f $partialDossiers.Count)
$report += ('- donor route-binding rows from `OP_SCREENS_MAP.csv`: `{0}`' -f $routeRows.Count)
$report += ('- donor UI file rows compared to current target candidate or canonical model: `{0}`' -f $uiMatrix.Count)
$report += ('- donor UI rows with target mapping or explicit defer/legacy classification: `{0}`' -f $uiMapped)
$report += ('- donor items still requiring explicit review after automated mapping: `{0}`' -f $unmappedRows.Count)
$report += ''
$report += '## Bucket Counts'
$report += ''
foreach ($group in $bucketCounts) {
  $report += ('- `{0}`: `{1}`' -f $group.Name, $group.Count)
}
$report += ''
$report += '## Role Counts'
$report += ''
foreach ($group in $roleCounts) {
  $report += ('- `{0}`: `{1}`' -f $group.Name, $group.Count)
}
$report += ''
$report += '## Operation Row Audit'
$report += ''
$report += ('- traceability rows marked `VERIFIED`: `{0}`' -f $verifiedOps)
$report += ('- traceability rows marked `PLANNED_ONLY`: `{0}`' -f $plannedOps)
$report += '- donor global contradiction remains active: service scope and seal documents claim `92` operations, but the current catalog contains `98`, traceability contains `94`, and dossier directories contain `96`'
$report += '- donor global contradiction also remains active: service seal says `8` implemented while traceability marks `10` verified operations'
$report += ''
$report += '## Explicit Contradiction Lists'
$report += ''
$report += ('- orphan dossier directories: `{0}`' -f (($orphanDossiers -join '`, `')))
$report += ('- inventory operations missing dossiers: `{0}`' -f (($missingDossiers -join '`, `')))
if ($partialDossiers.Count -gt 0) {
  $report += ('- partial dossier operations: `{0}`' -f ((($partialDossiers | ForEach-Object { $_.operation_id }) -join '`, `')))
}
if ($inventoryNeedsReview.Count -gt 0) {
  $report += ('- inventory operations still requiring explicit review mapping: `{0}`' -f ((($inventoryNeedsReview | ForEach-Object { $_.operation_id }) -join '`, `')))
}
$report += ''
$report += '## Scope Rule Used To Avoid Silent Omission'
$report += ''
$report += '- included every file under `services/dsh/`'
$report += '- included donor package, app, and contract files with direct `dsh`, `Dsh`, `shein-proxy`, or `proxy-request` evidence'
$report += '- included every operation dossier row via `OP_SCREENS_MAP.csv` and every inventory row via `DSH_OPERATION_CATALOG.csv`'
$report += '- compared donor UI material against current `43` candidate screens and `20` canonical screens'
$report += '- produced an explicit unmatched or review-needed file for anything not cleanly mapped'
$report += ''
$report += '## Generated Artifacts'
$report += ''
$report += '- `19_DONOR_REPO_DSH_FILE_CENSUS.csv`'
$report += '- `20_DONOR_OPERATION_ROW_AUDIT.csv`'
$report += '- `21_DONOR_ROUTE_BINDING_CENSUS.csv`'
$report += '- `22_DONOR_UI_FILE_TO_TARGET_MAPPING.csv`'
$report += '- `24_UNMAPPED_OR_REVIEW_REQUIRED_ITEMS.csv`'
$report += ''
$report += '## Remaining Truth Boundary'
$report += ''
$report += 'The generated audit is exhaustive with respect to the inclusion rules above.'
$report += 'It is still honest about ambiguity where donor files themselves are contradictory, duplicated, planned-only, or structurally noisy.'

$report | Set-Content -Path (Join-Path $docsRoot '23_DONOR_OMISSION_CONTROL_REPORT.md') -Encoding UTF8