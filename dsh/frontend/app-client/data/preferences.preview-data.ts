export type DshPreferenceCard = {
	id: string;
	title: string;
	description: string;
	value: string;
};

/**
 * UI_PREVIEW_ONLY: not runtime truth, not backend/API/binding source
 */
export const dshClientPreferencesPreviewDataContract = {
	dataKind: 'UI_PREVIEW_ONLY',
	runtimeTruth: false,
	backendSource: false,
	bindingSource: false,
	timezoneSemantics: 'not_applicable',
	moneySemantics: 'not_applicable',
} as const;

export const dshPreferenceCards: readonly DshPreferenceCard[] = [
	{
		id: 'delivery-instructions',
		title: 'تعليمات التسليم',
		description: 'ملاحظات مختصرة تساعد الكابتن عند الوصول إلى العنوان.',
		value: 'اتصل قبل الوصول بدقيقتين واترك الطلب عند الباب عند عدم الرد.',
	},
	{
		id: 'substitution-preference',
		title: 'تفضيلات الاستبدال',
		description: 'كيف يتصرف المتجر أو الكابتن عند غياب عنصر من السلة.',
		value: 'اسمح بالاستبدال ضمن نفس الفئة والسعر بعد تأكيد سريع في المحادثة.',
	},
	{
		id: 'order-notifications',
		title: 'إشعارات الطلب داخل DSH',
		description: 'التنبيهات الخاصة بتقدم الطلب والتأخير وحالة التتبع.',
		value: 'تنبيه عند قبول الطلب، وعند خروج الكابتن، وعند الوصول للعنوان.',
	},
	{
		id: 'captain-contact',
		title: 'طريقة التواصل مع الكابتن',
		description: 'قناة التواصل المفضلة خلال التنفيذ أو عند الحاجة للتوضيح.',
		value: 'ابدأ بالمحادثة داخل التطبيق ثم انتقل للمكالمة عند الحاجة.',
	},
	{
		id: 'location-handoff',
		title: 'تفضيلات تسليم العنوان والموقع',
		description: 'كيف يتم تمرير الموقع والتفاصيل الميدانية داخل DSH فقط.',
		value: 'استخدم الموقع الحالي تلقائيًا مع وصف يدوي مختصر للمدخل.',
	},
];
