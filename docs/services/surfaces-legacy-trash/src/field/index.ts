/**
 * Field Surfaces - Central Export
 * §87 SSoT in packages/surfaces - All field screens exported here
 * 
 * Note: Only screens with corresponding OpenAPI operations are exported.
 * Removed: field_tasks_* (9 screens) and field_partner_leads_list, field_partner_lead_get, field_partner_lead_create (3 screens)
 * as they don't exist in Master_OpenAPI.yaml
 */
// Re-export from app-field/mobile index
export {
  AutoFieldPartnerDraftCreate,
  AutoFieldPartnerDraftGet,
  AutoFieldPartnerDraftUpdate,
  AutoFieldPartnerDraftSubmit,
  AutoFieldPartnerDraftEvidenceAdd,
  AutoFieldPartnerDraftLinkUploads,
  AutoFieldPartnerDraftPinGeo,
  AutoFieldPartnerDraftSetHours,
  AutoFieldPartnerServiceAttach,
  AutoFieldPartnerProductsList,
  AutoFieldPartnerProductUpdate,
  AutoFieldPartnerProductRemove,
  AutoFieldPartnerLeadUpdate,
  AutoFieldPartnerDraftReject,
  AutoFieldPartnerActivate,
  AutoFieldPartnerSuspend,
} from './app-field/mobile';
