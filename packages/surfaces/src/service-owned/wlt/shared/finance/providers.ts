export type FinanceProvider = {
  id: string;
  labelKey: string;
  fallback?: string;
  icon?: string; // relative dev media path or URL
  controlPanelId?: string; // id used in control-panel for admin mapping
};

export const financeProviders: FinanceProvider[] = [
  { id: 'card', labelKey: 'wlt.app-user.mobile.auto_wlt_topup.methodCreditCard', fallback: 'بطاقة ائتمانية', icon: 'wlt/icon_card.png', controlPanelId: 'card' },
  { id: 'mastercard', labelKey: 'wlt.app-user.mobile.auto_wlt_topup.methodMastercard', fallback: 'ماستر كارد', icon: 'wlt/icon_mastercard.png', controlPanelId: 'mastercard' },
  { id: 'jawal', labelKey: 'wlt.app-user.mobile.auto_wlt_topup.methodJawali', fallback: 'خدمة جوالي', icon: 'wlt/icon_jawal.png', controlPanelId: 'jawal' },
  { id: 'jeeb', labelKey: 'wlt.app-user.mobile.auto_wlt_topup.methodJeeb', fallback: 'محفظة جيب', icon: 'wlt/icon_jeeb.png', controlPanelId: 'jeeb' },
  { id: 'karimi', labelKey: 'wlt.app-user.mobile.auto_wlt_topup.methodKuraimi', fallback: 'خدمة بنك الكريمي', icon: 'wlt/icon_karimi.png', controlPanelId: 'karimi' },
  { id: 'one_cash', labelKey: 'wlt.app-user.mobile.auto_wlt_topup.methodOneCash', fallback: 'ONE كاش', icon: 'wlt/icon_onecash.png', controlPanelId: 'one_cash' },
  { id: 'cash', labelKey: 'wlt.app-user.mobile.auto_wlt_topup.methodCash', fallback: 'نقد', icon: 'wlt/icon_cash.png', controlPanelId: 'cash' },
  { id: 'pace', labelKey: 'wlt.app-user.mobile.auto_wlt_topup.methodPay', fallback: 'خدمة الدفع', icon: 'wlt/icon_pace.png', controlPanelId: 'pace' },
  { id: 'eazy', labelKey: 'wlt.app-user.mobile.auto_wlt_topup.methodEasyWallet', fallback: 'محفظة ايزي', icon: 'wlt/icon_eazy.png', controlPanelId: 'eazy' },
  { id: 'saba', labelKey: 'wlt.app-user.mobile.auto_wlt_topup.methodSabacash', fallback: 'سباكاش', icon: 'wlt/icon_saba.png', controlPanelId: 'saba' },
  { id: 'shamel', labelKey: 'wlt.app-user.mobile.auto_wlt_topup.methodShamelMoney', fallback: 'محفظة شامل موني', icon: 'wlt/icon_shamel.png', controlPanelId: 'shamel' },
  { id: 'mobile_money', labelKey: 'wlt.app-user.mobile.auto_wlt_topup.methodMobileMoney', fallback: 'موبايبل', icon: 'wlt/icon_mobile_money.png', controlPanelId: 'mobile_money' },
  { id: 'tadamon', labelKey: 'wlt.app-user.mobile.auto_wlt_topup.methodMyBank', fallback: 'محفظتي بنك التضامن', icon: 'wlt/icon_tadamon.png', controlPanelId: 'tadamon' },
];

export default financeProviders;
