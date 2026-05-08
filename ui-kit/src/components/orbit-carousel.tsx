"use client";
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Modal, Pressable, ScrollView, StyleSheet, TouchableWithoutFeedback, View, useWindowDimensions } from 'react-native';
import { Text } from '../primitives';

export type OrbitCarouselItem = {
	id: string;
	key: string;
	title: string;
	shortLabel?: string;
	subtitle?: string;
	iconUrl: string | null;
	emojiFallback?: string;
};

export type OrbitCarouselProps = {
	visible: boolean;
	items: OrbitCarouselItem[];
	onClose: () => void;
	onSelect: (item: OrbitCarouselItem) => void;
};

/**
 * LIGHT BENTO HUB (Pure & Comfortable)
 * A minimalist, airy category selector focused on clarity and ease of use.
 */
function BentoCategoryTile({
	item,
	index,
	onPress,
}: {
	item: OrbitCarouselItem;
	index: number;
	onPress: () => void;
}) {
	const scaleAnim = useRef(new Animated.Value(0.95)).current;
	const opacityAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(opacityAnim, {
				toValue: 1,
				duration: 350,
				delay: index * 30,
				useNativeDriver: true,
			}),
			Animated.spring(scaleAnim, {
				toValue: 1,
				friction: 9,
				tension: 40,
				delay: index * 30,
				useNativeDriver: true,
			}),
		]).start();
	}, []);

	return (
		<Animated.View style={[styles.tileSlot, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
			<Pressable onPress={onPress} style={styles.tilePressable}>
				<View style={styles.tileCard}>
					<View style={styles.tileIconBox}>
						{item.iconUrl ? (
							<Image source={{ uri: item.iconUrl }} style={styles.tileIcon} resizeMode="contain" />
						) : (
							<Text style={styles.tileEmoji}>{item.emojiFallback || '📦'}</Text>
						)}
					</View>

					<View style={styles.tileTextContent}>
						<Text numberOfLines={1} style={styles.tileTitle}>{item.title}</Text>
					</View>
				</View>
			</Pressable>
		</Animated.View>
	);
}

function OrbitCarouselBase({
	visible,
	items,
	onClose,
	onSelect,
}: OrbitCarouselProps) {
	const { height: screenHeight } = useWindowDimensions();
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const contentY = useRef(new Animated.Value(40)).current;

	useEffect(() => {
		if (visible) {
			Animated.parallel([
				Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
				Animated.spring(contentY, { toValue: 0, friction: 10, tension: 40, useNativeDriver: true }),
			]).start();
		} else {
			Animated.parallel([
				Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
				Animated.timing(contentY, { toValue: 40, duration: 250, useNativeDriver: true }),
			]).start();
		}
	}, [visible]);

	if (!visible) return null;

	return (
		<Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
			<View style={styles.root}>
				<TouchableWithoutFeedback onPress={onClose}>
					<Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
				</TouchableWithoutFeedback>

				<Animated.View
					style={[
						styles.hubContainer,
						{
							opacity: fadeAnim,
							transform: [{ translateY: contentY }],
							maxHeight: screenHeight * 0.8,
						}
					]}
				>
					<View style={styles.hubHeader}>
						<View style={styles.headerLine} />
						<Text style={styles.hubHeaderTitle}>كل التصنيفات</Text>
						<Text style={styles.hubHeaderSubtitle}>تصفح الفئات المتاحة لخدمتك</Text>
					</View>

					<ScrollView
						contentContainerStyle={styles.gridContent}
						showsVerticalScrollIndicator={false}
						bounces={true}
					>
						<View style={styles.bentoGrid}>
							{items.map((item, index) => (
								<BentoCategoryTile
									key={item.id}
									item={item}
									index={index}
									onPress={() => {
										onSelect(item);
										onClose();
									}}
								/>
							))}
						</View>
					</ScrollView>

					<View style={styles.hubFooter}>
						<Pressable style={styles.closeBtn} onPress={onClose}>
							<Text style={styles.closeBtnText}>إغلاق</Text>
						</Pressable>
					</View>
				</Animated.View>
			</View>
		</Modal>
	);
}

export function OrbitCarousel(props: OrbitCarouselProps) { return <OrbitCarouselBase {...props} />; }
export function CategoryOrbitCarousel(props: Omit<OrbitCarouselProps, 'placement'>) { return <OrbitCarouselBase {...props} />; }
export function ServiceOrbitCarousel(props: Omit<OrbitCarouselProps, 'placement'>) { return <OrbitCarouselBase {...props} />; }

const styles = StyleSheet.create({
	root: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
	backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.4)' },
	hubContainer: {
		width: '94%',
		backgroundColor: '#FFFFFF',
		borderTopLeftRadius: 36,
		borderTopRightRadius: 36,
		borderBottomLeftRadius: 36,
		borderBottomRightRadius: 36,
		overflow: 'hidden',
		marginBottom: 20,
		paddingBottom: 8,
		shadowColor: '#000',
		shadowOpacity: 0.12,
		shadowRadius: 20,
		elevation: 15,
	},
	hubHeader: { paddingVertical: 20, paddingHorizontal: 24, alignItems: 'center' },
	headerLine: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#F0F0F0', marginBottom: 12 },
	hubHeaderTitle: { color: '#1A1A1A', fontSize: 20, fontWeight: '800' },
	hubHeaderSubtitle: { color: '#888888', fontSize: 13, marginTop: 4, fontWeight: '500' },
	gridContent: { paddingHorizontal: 16, paddingBottom: 20 },
	bentoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
	tileSlot: { width: '31.5%', aspectRatio: 0.9, marginBottom: 10 },
	tilePressable: { flex: 1 },
	tileCard: {
		flex: 1,
		borderRadius: 20,
		backgroundColor: '#F8F9FA',
		padding: 12,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#F0F0F0',
	},
	tileIconBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
	tileIcon: { width: 44, height: 44 },
	tileEmoji: { fontSize: 32 },
	tileTextContent: { alignItems: 'center', marginTop: 6 },
	tileTitle: { color: '#333333', fontSize: 12, fontWeight: '700', textAlign: 'center' },
	hubFooter: { paddingHorizontal: 20, paddingVertical: 12 },
	closeBtn: {
		height: 50,
		borderRadius: 16,
		backgroundColor: '#F5F5F5',
		alignItems: 'center',
		justifyContent: 'center',
	},
	closeBtnText: { color: '#666666', fontSize: 15, fontWeight: '600' },
});
