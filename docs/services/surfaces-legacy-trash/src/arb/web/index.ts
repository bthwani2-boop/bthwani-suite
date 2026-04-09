/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

// ARB Web Surface Components
// Next.js implementation for webapp, CONTROL PANEL
// §34 Universal Surface - Web Shell Implementation

import React from 'react';

// Re-export shared components (platform-agnostic, can be used in web with React.forwardRef compatibility)
export { default as ArbBookingsList } from '../shared/ArbBookingsList';
export { default as ArbBookingDetails } from '../shared/ArbBookingDetails';
export { default as ArbBookingForm } from '../shared/ArbBookingForm';
export { default as ArbOffersList } from '../shared/ArbOffersList';
export { default as ArbOfferDetails } from '../shared/ArbOfferDetails';
export { default as ArbChatInterface } from '../shared/ArbChatInterface';
export { default as ArbEscrowStatus } from '../shared/ArbEscrowStatus';
export { default as ArbPaymentForm } from '../shared/ArbPaymentForm';

// Web-specific page containers
export { ArbBookingsPage } from './pages/ArbBookingsPage';
export { ArbBookingDetailsPage } from './pages/ArbBookingDetailsPage';
export { ArbBookingsListPage } from './pages/ArbBookingsListPage';
export { ArbBookingCreatePage } from './pages/ArbBookingCreatePage';
export { ArbAdminConfigPage } from './pages/ArbAdminConfigPage';
export { ArbAdminKpisPage } from './pages/ArbAdminKpisPage';
export { ArbSupportDisputesPage } from './pages/ArbSupportDisputesPage';
export { ArbAdminKpisScreen } from './screens/ArbAdminKpisScreen';
export { ArbAdminConfigScreen } from './screens/ArbAdminConfigScreen';
export { ArbSupportDisputesScreen } from './screens/ArbSupportDisputesScreen';
export { ArbSupportBookingsScreen } from './screens/ArbSupportBookingsScreen';
export { ArbSupportResolutionsScreen } from './screens/ArbSupportResolutionsScreen';
export { ArbChatAuditScreen } from './screens/ArbChatAuditScreen';
export { ArbBookingsCreatePage } from './pages/ArbBookingsCreatePage';

// Web navigation helpers
export { ARB_WEB_ROUTES } from './navigation/routes';

// Theme and styling for web
export { arbWebTheme } from './theme/web-theme';

