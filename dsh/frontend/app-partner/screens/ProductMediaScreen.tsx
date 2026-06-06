import React from 'react';
import { ScrollView, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import {
	Box,
	Button,
	Chip,
	Divider,
	Text,
	resolveRowDirection,
	useDirection,
	useTheme,
} from '@bthwani/ui-kit';
import { type DshProductRecord, type DshProductMediaRecord } from '../../shared/dsh-product-api.client';
import { createDshProductApiHttpClient, resolveDshProductApiBaseUrl } from '../../shared/dsh-product-api.transport';
import {
	DSH_PRODUCT_MEDIA_FIXTURE_KEYS,
	resolveDshImageSource,
	type DshProductMediaFixtureKey,
} from '../../shared/resolve-dsh-image-source';

export type ProductMediaScreenProps = {
	productId: string;
	onBack?: () => void;
};

export type ProductMediaScreenState = 'loading' | 'idle' | 'saving' | 'error' | 'offline';

const PRODUCT_MEDIA_LABEL_BY_KEY: Record<DshProductMediaFixtureKey, string> = {
	'dsh.product.apple.v1': 'تفاحة (Apple)',
	'dsh.product.bread.v1': 'خبز (Bread)',
	'dsh.product.chicken.v1': 'دجاج (Chicken)',
	'dsh.product.choco.v1': 'شوكولاتة (Choco)',
	'dsh.product.croissant.v1': 'كرواسون (Croissant)',
	'dsh.product.milk.v1': 'حليب (Milk)',
	'dsh.product.pasta.v1': 'معكرونة (Pasta)',
	'dsh.product.roll.v1': 'رول خبز (Roll)',
	'dsh.product.lead-5.dates-box.v1': 'صندوق تمور (Dates Box)',
	'dsh.product.salad.v1': 'سلطة (Salad)',
	'dsh.product.yogurt.v1': 'زبادي (Yogurt)',
};

const PRODUCT_MEDIA_MANIFEST_KEYS = DSH_PRODUCT_MEDIA_FIXTURE_KEYS.map((key) => ({
	key,
	label: PRODUCT_MEDIA_LABEL_BY_KEY[key],
	source: resolveDshImageSource(key),
}));

export function ProductMediaScreen({ productId, onBack }: ProductMediaScreenProps) {
	const { direction } = useDirection();
	const { theme } = useTheme();

	const baseUrl = React.useMemo(() => resolveDshProductApiBaseUrl(), []);
	const client = React.useMemo(() => createDshProductApiHttpClient(baseUrl), [baseUrl]);

	const [screenState, setScreenState] = React.useState<ProductMediaScreenState>('loading');
	const [product, setProduct] = React.useState<DshProductRecord | null>(null);
	const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
	const [selectedKey, setSelectedKey] = React.useState<string | null>(null);

	// Load product details and media
	const loadProductDetails = React.useCallback(async () => {
		setScreenState('loading');
		setErrorMessage(null);
		try {
			const record = await client.getProduct(productId);
			setProduct(record);
			setScreenState('idle');
		} catch (err: unknown) {
			const isOffline =
				typeof err === 'object' &&
				err !== null &&
				(err as { kind?: unknown }).kind === 'offline';
			setErrorMessage(
				isOffline
					? 'لا يوجد اتصال بالشبكة — تحقق من الاتصال وأعد المحاولة.'
					: 'تعذر تحميل بيانات المنتج أو الصور المرتبطة به.',
			);
			setScreenState(isOffline ? 'offline' : 'error');
		}
	}, [client, productId]);

	React.useEffect(() => {
		loadProductDetails();
	}, [loadProductDetails]);

	// Assign media
	const handleAssignMedia = React.useCallback(async () => {
		if (!selectedKey) return;
		setScreenState('saving');
		setErrorMessage(null);
		try {
			await client.uploadProductMedia({
				product_id: productId,
				media_key: selectedKey,
			});
			setSelectedKey(null);
			// Refresh list
			const record = await client.getProduct(productId);
			setProduct(record);
			setScreenState('idle');
		} catch (err: unknown) {
			const isOffline =
				typeof err === 'object' &&
				err !== null &&
				(err as { kind?: unknown }).kind === 'offline';
			setErrorMessage(
				isOffline
					? 'لا يوجد اتصال بالشبكة — تعذر رفع وتحديث الوسائط.'
					: 'فشل ربط الصورة — يرجى التأكد من أن الصورة معتمدة في Manifest.',
			);
			setScreenState('error');
		}
	}, [client, productId, selectedKey]);

	// Delete media
	const handleDeleteMedia = React.useCallback(async (mediaId: string) => {
		setScreenState('saving');
		setErrorMessage(null);
		try {
			await client.deleteProductMedia(mediaId);
			// Refresh list
			const record = await client.getProduct(productId);
			setProduct(record);
			setScreenState('idle');
		} catch (err: unknown) {
			const isOffline =
				typeof err === 'object' &&
				err !== null &&
				(err as { kind?: unknown }).kind === 'offline';
			setErrorMessage(
				isOffline
					? 'لا يوجد اتصال بالشبكة — تعذر حذف الوسائط.'
					: 'فشل حذف الصورة من خوادم النظام.',
			);
			setScreenState('error');
		}
	}, [client, productId]);

	const isRTL = direction === 'rtl';

	// Loading/Spinner state
	if (screenState === 'loading' && !product) {
		return (
			<Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: theme.bg }}>
				<ActivityIndicator size="large" color={theme.brand} />
				<Text role="bodyStrong" tone="muted" align="center" style={{ marginTop: 12 }}>
					جارٍ تحميل وسائط المنتج…
				</Text>
			</Box>
		);
	}

	// Offline UI
	if (screenState === 'offline') {
		return (
			<Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16, backgroundColor: theme.bg }}>
				<Text role="bodyStrong" tone="warning" align="center">لا يوجد اتصال بالشبكة</Text>
				<Text role="bodySm" tone="muted" align="center">
					يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.
				</Text>
				<Button label="إعادة المحاولة" tone="primary" onPress={loadProductDetails} />
				{onBack && <Button label="رجوع" tone="ghost" onPress={onBack} />}
			</Box>
		);
	}

	const mediaList = product?.media ?? [];

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: theme.bg }}
			contentContainerStyle={{ paddingBottom: 120 }}
			keyboardShouldPersistTaps="handled"
		>
			<Box gap={4} style={{ padding: 16 }}>

				{/* ── Header ── */}
				<Box style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center', gap: 12 }}>
					{onBack && (
						<Button label="رجوع" tone="ghost" size="sm" fullWidth={false} onPress={onBack} />
					)}
					<Box style={{ flex: 1, minWidth: 0 }}>
						<Text role="titleSm" align="start">إدارة وسائط المنتج</Text>
						{product && (
							<Text role="bodySm" tone="muted" align="start">
								المنتج الحالي: {product.name} ({product.id})
							</Text>
						)}
					</Box>
				</Box>

				{/* ── Error Banner ── */}
				{errorMessage && (
					<Box
						style={{
							backgroundColor: theme.danger + '15',
							borderRadius: 8,
							padding: 12,
							borderStartWidth: 3,
							borderStartColor: theme.danger,
							gap: 8,
						}}
					>
						<Text role="bodySm" tone="danger" align="start">{errorMessage}</Text>
						<Button label="إعادة المحاولة والتحميل" tone="secondary" size="sm" fullWidth={false} onPress={loadProductDetails} />
					</Box>
				)}

				{/* ── WLT Context Alert ── */}
				<Box
					style={{
						backgroundColor: theme.line + '12',
						borderRadius: 8,
						padding: 12,
						borderStartWidth: 3,
						borderStartColor: theme.brand,
					}}
				>
					<Text role="caption" tone="muted" align="start">
						نظام إدارة الوسائط المحلي: الصور يتم التحقق من سلامتها وموافقتها لمفاتيح الصور المسجلة في Manifest. لا يتم تخزين نسخ صور محلية مكررة.
					</Text>
				</Box>

				<Divider />

				{/* ── Current Media List ── */}
				<Box gap={2}>
					<Text role="bodyStrong" align="start">الوسائط الحالية للمنتج ({mediaList.length})</Text>

					{mediaList.length === 0 ? (
						<Box style={{ padding: 24, borderStyle: 'dashed', borderWidth: 1, borderColor: theme.line, borderRadius: 8, alignItems: 'center' }}>
							<Text role="bodySm" tone="muted" align="center">
								لا توجد صور مرتبطة بهذا المنتج حاليًا.
							</Text>
						</Box>
					) : (
						mediaList.map((media: DshProductMediaRecord) => (
							<Box
								key={media.id}
								style={{
									flexDirection: resolveRowDirection(direction),
									alignItems: 'center',
									justifyContent: 'space-between',
									padding: 12,
									backgroundColor: theme.line + '08',
									borderRadius: 8,
									borderWidth: 1,
									borderColor: theme.line,
									gap: 12,
								}}
							>
								{/* Thumbnail & Info Right-Aligned */}
								<Box style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center', gap: 12, flex: 1 }}>
									<Image
										source={{ uri: `${baseUrl}${media.url}` }}
										style={{ width: 64, height: 64, borderRadius: 6, backgroundColor: theme.line + '20' }}
										resizeMode="cover"
									/>
									<Box style={{ flex: 1 }}>
										<Text role="bodyStrong" align="start" style={{ fontSize: 13 }}>
											{media.media_key}
										</Text>
										<Text role="caption" tone="muted" align="start">
											معرف الصورة: {media.id}
										</Text>
									</Box>
								</Box>

								{/* Delete Action Left-Aligned */}
								<Button
									label="حذف"
									tone="danger"
									size="sm"
									fullWidth={false}
									disabled={screenState === 'saving'}
									onPress={() => handleDeleteMedia(media.id)}
								/>
							</Box>
						))
					)}
				</Box>

				<Divider />

				{/* ── Selector for Approved Media Keys ── */}
				<Box gap={2}>
					<Text role="bodyStrong" align="start">إضافة صورة معتمدة من الكتالوج</Text>
					<Text role="bodySm" tone="muted" align="start">
						اختر أحد مفاتيح الصور المعتمدة في Manifest لرفعها وربطها بالمنتج:
					</Text>

					<Box style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 }}>
						{PRODUCT_MEDIA_MANIFEST_KEYS.map((item) => {
							const isSelected = selectedKey === item.key;
							return (
								<TouchableOpacity
									key={item.key}
									activeOpacity={0.8}
									disabled={screenState === 'saving'}
									onPress={() => setSelectedKey(item.key)}
									style={{
										width: '47%',
										borderWidth: 2,
										borderColor: isSelected ? theme.brand : theme.line,
										borderRadius: 8,
										padding: 8,
										backgroundColor: isSelected ? theme.brand + '08' : theme.bg,
										alignItems: 'center',
										gap: 6,
									}}
								>
									<Image
										source={item.source}
										style={{ width: 70, height: 70, borderRadius: 4, backgroundColor: theme.line + '10' }}
										resizeMode="cover"
									/>
									<Text
										role="caption"
										align="center"
										tone={isSelected ? 'brand' : 'default'}
										style={{ fontWeight: isSelected ? 'bold' : 'normal', fontSize: 11 }}
									>
										{item.label}
									</Text>
								</TouchableOpacity>
							);
						})}
					</Box>

					{/* Action Trigger */}
					<Box style={{ marginTop: 12 }}>
						<Button
							label={screenState === 'saving' ? 'جاري الربط والتحقق...' : 'ربط وإضافة الصورة المحددة'}
							tone="primary"
							disabled={!selectedKey || screenState === 'saving'}
							onPress={handleAssignMedia}
						/>
					</Box>
				</Box>

			</Box>
		</ScrollView>
	);
}
