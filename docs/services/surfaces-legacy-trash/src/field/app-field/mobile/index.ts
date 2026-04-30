/**
 * Field App Mobile Screens - Local Exports
 * Only screens with corresponding OpenAPI operations are exported.
 * Removed: field_tasks_* (9 screens) and field_partner_leads_list, field_partner_lead_get, field_partner_lead_create (3 screens)
 * as they don't exist in Master_OpenAPI.yaml
 * 
 * Export default exports as named exports (uppercase for React components)
 */
export { default as AutoFieldPartnerDraftCreate } from './auto_field_partner_draft_create';
export { default as AutoFieldPartnerDraftGet } from './auto_field_partner_draft_get';
export { default as AutoFieldPartnerDraftUpdate } from './auto_field_partner_draft_update';
export { default as AutoFieldPartnerDraftSubmit } from './auto_field_partner_draft_submit';
export { default as AutoFieldPartnerDraftEvidenceAdd } from './auto_field_partner_draft_evidence_add';
export { default as AutoFieldPartnerDraftLinkUploads } from './auto_field_partner_draft_link_uploads';
export { default as AutoFieldPartnerDraftPinGeo } from './auto_field_partner_draft_pin_geo';
export { default as AutoFieldPartnerDraftSetHours } from './auto_field_partner_draft_set_hours';
export { default as AutoFieldPartnerServiceAttach } from './auto_field_partner_service_attach';
export { default as AutoFieldPartnerProductsList } from './auto_field_partner_products_list';
export { default as AutoFieldPartnerProductUpdate } from './auto_field_partner_product_update';
export { default as AutoFieldPartnerProductRemove } from './auto_field_partner_product_remove';
export { default as AutoFieldPartnerLeadUpdate } from './auto_field_partner_lead_update';
export { default as AutoFieldPartnerDraftReject } from './auto_field_partner_draft_reject';
export { default as AutoFieldPartnerActivate } from './auto_field_partner_activate';
export { default as AutoFieldPartnerSuspend } from './auto_field_partner_suspend';
