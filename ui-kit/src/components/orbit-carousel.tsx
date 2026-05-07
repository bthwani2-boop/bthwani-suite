"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, Modal, PanResponder, Pressable, StyleSheet, TouchableWithoutFeedback, View, useWindowDimensions } from 'react-native';
import { useTheme } from '../providers';
import { Text } from '../primitives';

export type OrbitAnchorLayout = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export type OrbitCarouselItem = {
	id: string;
	key: string;
	title: string;
	iconUrl: string | null;
	emojiFallback?: string;
};

export type OrbitCarouselPlacement = 'center' | 'upper';

export type OrbitCarouselProps = {
	visible: boolean;
	items: OrbitCarouselItem[];
	anchorLayout?: OrbitAnchorLayout | null;
	onClose: () => void;
	onSelect: (item: OrbitCarouselItem) => void;
	placement?: OrbitCarouselPlacement;
	autoRotate?: boolean;
	autoRotateDurationMs?: number;
};

const SCREEN_WIDTH_FRACTION = 0.92;
const CENTER_SCREEN_HEIGHT_FRACTION = 0.58;
const UPPER_SCREEN_HEIGHT_FRACTION = 0.50;

function nearestSnapAngle(rotation: number, step: number) {
	return Math.round(rotation / step) * step;
}

function indexFromRotation(rotation: number, step: number, count: number) {
	if (!count) {
		return -1;
	}

	const raw = -Math.round(rotation / step);
	return ((raw % count) + count) % count;
}

function OrbitItemCard({ item, isActive }: { item: OrbitCarouselItem; isActive: boolean }) {
	const { theme } = useTheme();
	const [imgFailed, setImgFailed] = useState(false);
	const showImage = Boolean(item.iconUrl) && !imgFailed;

	return (
		<View
			style={[
				styles.itemCard,
				{
					backgroundColor: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.94)',
					borderColor: isActive ? '#FF500D' : 'rgba(10, 47, 92, 0.1)',
					borderWidth: isActive ? 3 : 1,
					transform: [{ scale: isActive ? 1.14 : 1.0 }],
					opacity: isActive ? 1 : 0.92,
					shadowColor: isActive ? '#FF500D' : '#000',
					shadowOpacity: isActive ? 0.2 : 0.05,
				},
			]}
		>
			<View style={[styles.iconContainer, isActive && { backgroundColor: 'rgba(255, 80, 13, 0.05)' }]}>
				{showImage ? (
					<Image
						source={{ uri: item.iconUrl ?? undefined }}
						style={styles.iconSolo}
						resizeMode="contain"
						onError={() => setImgFailed(true)}
					/>
				) : (
					<View style={styles.emojiFrame}>
						<Text role="titleLg" style={styles.iconEmoji}>
							{item.emojiFallback ?? '📦'}
						</Text>
					</View>
				)}
			</View>
			<View
				style={[
					styles.itemTitleContainer,
					{ backgroundColor: isActive ? '#FF500D' : '#0A2F5C' },
					isActive ? styles.itemTitleContainerActive : null,
				]}
			>
				<Text numberOfLines={1} role="bodySm" tone="inverse" style={[styles.itemTitle, isActive && styles.itemTitleActive]}>
					{item.title}
				</Text>
			</View>
		</View>
	);
}


function OrbitCarouselBase({
	visible,
	items,
	anchorLayout,
	onClose,
	onSelect,
	placement = 'center',
	autoRotate = false,
	autoRotateDurationMs = 32000,
}: OrbitCarouselProps) {
	const { width: screenWidth, height: screenHeight } = useWindowDimensions();
	const { theme } = useTheme();
	const itemCount = items.length;
	const angleStep = 360 / Math.max(itemCount, 1);
	const stageSize = Math.min(screenWidth * SCREEN_WIDTH_FRACTION, screenHeight * (placement === 'upper' ? UPPER_SCREEN_HEIGHT_FRACTION : CENTER_SCREEN_HEIGHT_FRACTION));
	const stageRadius = stageSize / 2;
	const orbitRadius = stageSize * (placement === 'upper' ? 0.36 : 0.4);
	const itemSize = placement === 'upper' ? 78 : 84;
	const itemHalf = itemSize / 2;

	const dialScale = useRef(new Animated.Value(0.88)).current;
	const dialOpacity = useRef(new Animated.Value(0)).current;
	const dialTranslateX = useRef(new Animated.Value(0)).current;
	const dialTranslateY = useRef(new Animated.Value(0)).current;
	const rotationAnim = useRef(new Animated.Value(0)).current;
	const dragStartRotationRef = useRef(0);
	const currentRotationRef = useRef(0);
	const userInteractingRef = useRef(false);
	const autoSpinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [activeIndex, setActiveIndex] = useState(0);

	const finalX = (screenWidth - stageSize) / 2;
	const finalY = placement === 'upper' ? Math.max(34, screenHeight * 0.11) : Math.max(58, (screenHeight - stageSize) / 2 - 20);

	const anchorCenter = useMemo(() => {
		if (!anchorLayout) {
			return {
				x: screenWidth / 2,
				y: placement === 'upper' ? 130 : screenHeight - 120,
			};
		}

		return {
			x: anchorLayout.x + anchorLayout.width / 2,
			y: anchorLayout.y + anchorLayout.height / 2,
		};
	}, [anchorLayout, placement, screenHeight, screenWidth]);

	const initialX = anchorCenter.x - stageRadius;
	const initialY = anchorCenter.y - stageRadius;

	useEffect(() => {
		const id = rotationAnim.addListener(({ value }) => {
			currentRotationRef.current = value;
		});

		return () => {
			rotationAnim.removeListener(id);
		};
	}, [rotationAnim]);

	const clearAutoSpinTimer = () => {
		if (autoSpinTimeoutRef.current) {
			clearTimeout(autoSpinTimeoutRef.current);
			autoSpinTimeoutRef.current = null;
		}
	};

	const startAutoSpin = () => {
		if (!autoRotate) {
			return;
		}

		clearAutoSpinTimer();

		if (!visible || userInteractingRef.current) {
			return;
		}

		rotationAnim.stopAnimation((value) => {
			rotationAnim.setValue(value);
			const toValue = value + 360;

			Animated.timing(rotationAnim, {
				toValue,
				duration: autoRotateDurationMs,
				easing: Easing.linear,
				useNativeDriver: true,
			}).start(({ finished }) => {
				if (!finished || !visible || userInteractingRef.current) {
					return;
				}

				startAutoSpin();
			});
		});
	};

	const scheduleAutoSpinResume = (delayMs = 2200) => {
		if (!autoRotate) {
			return;
		}

		clearAutoSpinTimer();
		autoSpinTimeoutRef.current = setTimeout(() => {
			autoSpinTimeoutRef.current = null;

			if (!visible || userInteractingRef.current) {
				return;
			}

			startAutoSpin();
		}, delayMs);
	};

	useEffect(() => {
		if (!visible) {
			dialScale.setValue(0.88);
			dialOpacity.setValue(0);
			dialTranslateX.setValue(initialX);
			dialTranslateY.setValue(initialY);
			rotationAnim.setValue(0);
			currentRotationRef.current = 0;
			setActiveIndex(0);
			userInteractingRef.current = false;
			clearAutoSpinTimer();
			rotationAnim.stopAnimation();
			return;
		}

		dialTranslateX.setValue(initialX);
		dialTranslateY.setValue(initialY);
		dialScale.setValue(0.88);
		dialOpacity.setValue(0);
		rotationAnim.setValue(0);
		currentRotationRef.current = 0;
		setActiveIndex(0);
		userInteractingRef.current = false;
		clearAutoSpinTimer();

		Animated.parallel([
			Animated.timing(dialOpacity, {
				toValue: 1,
				duration: 180,
				easing: Easing.out(Easing.quad),
				useNativeDriver: true,
			}),
			Animated.timing(dialScale, {
				toValue: 1,
				duration: 220,
				easing: Easing.out(Easing.cubic),
				useNativeDriver: true,
			}),
			Animated.timing(dialTranslateX, {
				toValue: finalX,
				duration: 220,
				easing: Easing.out(Easing.cubic),
				useNativeDriver: true,
			}),
			Animated.timing(dialTranslateY, {
				toValue: finalY,
				duration: 220,
				easing: Easing.out(Easing.cubic),
				useNativeDriver: true,
			}),
		]).start(() => {
			startAutoSpin();
		});
	}, [autoRotate, autoRotateDurationMs, clearAutoSpinTimer, dialOpacity, dialScale, dialTranslateX, dialTranslateY, finalX, finalY, initialX, initialY, rotationAnim, visible]);

	const rotationToDeg = useMemo(
		() => rotationAnim.interpolate({ inputRange: [-3600, 3600], outputRange: ['-3600deg', '3600deg'], extrapolate: 'extend' }),
		[rotationAnim],
	);
	const rotationToDegInverse = useMemo(
		() => rotationAnim.interpolate({ inputRange: [-3600, 3600], outputRange: ['3600deg', '-3600deg'], extrapolate: 'extend' }),
		[rotationAnim],
	);

	const panResponder = useMemo(
		() =>
			PanResponder.create({
				onStartShouldSetPanResponder: () => true,
				onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 2 || Math.abs(gesture.dy) > 2,
				onMoveShouldSetPanResponderCapture: (_, gesture) => Math.abs(gesture.dx) > 2 || Math.abs(gesture.dy) > 2,
				onPanResponderGrant: () => {
					userInteractingRef.current = true;
					clearAutoSpinTimer();
					rotationAnim.stopAnimation((value) => {
						dragStartRotationRef.current = value;
						currentRotationRef.current = value;
						rotationAnim.setValue(value);
					});
				},
				onPanResponderMove: (_, gesture) => {
					const dragRotation = dragStartRotationRef.current + gesture.dx * 0.75 - gesture.dy * 0.15;
					rotationAnim.setValue(dragRotation);
					setActiveIndex(indexFromRotation(dragRotation, angleStep, itemCount));
				},
				onPanResponderRelease: (_, gesture) => {
					const dragRotation = dragStartRotationRef.current + gesture.dx * 0.75 - gesture.dy * 0.15;
					const snappedRotation = nearestSnapAngle(dragRotation, angleStep);
					const snappedIndex = indexFromRotation(snappedRotation, angleStep, itemCount);
					currentRotationRef.current = snappedRotation;
					setActiveIndex(snappedIndex);

					Animated.spring(rotationAnim, {
						toValue: snappedRotation,
						useNativeDriver: true,
						bounciness: 2,
						speed: 18,
					}).start(() => {
						userInteractingRef.current = false;
						scheduleAutoSpinResume(placement === 'upper' ? 2600 : 2200);
					});
				},
				onPanResponderTerminate: () => {
					const snappedRotation = nearestSnapAngle(currentRotationRef.current, angleStep);
					const snappedIndex = indexFromRotation(snappedRotation, angleStep, itemCount);
					currentRotationRef.current = snappedRotation;
					setActiveIndex(snappedIndex);
					rotationAnim.setValue(snappedRotation);
					userInteractingRef.current = false;
					scheduleAutoSpinResume(placement === 'upper' ? 2600 : 2200);
				},
			}),
		[angleStep, itemCount, placement, rotationAnim],
	);

	const handleSelect = (index: number) => {
		if (!items[index]) {
			return;
		}

		onSelect(items[index]);
		onClose();
	};

	if (!visible || itemCount === 0) {
		return null;
	}

	return (
		<Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
			<View style={styles.root}>
				<TouchableWithoutFeedback onPress={onClose}>
					<View style={[styles.overlayTouch, { backgroundColor: theme.overlay }]} />
				</TouchableWithoutFeedback>

				<Animated.View
					{...panResponder.panHandlers}
					style={[
						styles.dialWrap,
						{
							width: stageSize,
							height: stageSize,
							opacity: dialOpacity,
							transform: [
								{ translateX: dialTranslateX },
								{ translateY: dialTranslateY },
								{ scale: dialScale },
							],
						},
					]}
				>
					<View style={[styles.pointer, placement === 'upper' ? styles.pointerUpper : null, { start: stageRadius - 10 }]} />

					<Animated.View style={[styles.orbit, { transform: [{ rotate: rotationToDeg }] }]}>
						{items.map((item, index) => {
							const isActive = index === activeIndex;

							return (
								<Pressable
									key={item.id}
									style={[
										styles.itemPress,
										{
											width: itemSize,
											height: itemSize,
											start: stageRadius - itemHalf,
											top: stageRadius - itemHalf,
											transform: [{ rotate: `${index * angleStep}deg` }, { translateY: -orbitRadius }],
										},
									]}
									onPress={() => handleSelect(index)}
								>
									<Animated.View style={{ transform: [{ rotate: `${-index * angleStep}deg` }, { rotate: rotationToDegInverse }] }}>
										<OrbitItemCard item={item} isActive={isActive} />
									</Animated.View>
								</Pressable>
							);
						})}
					</Animated.View>
				</Animated.View>
			</View>
		</Modal>
	);
}

export function OrbitCarousel(props: OrbitCarouselProps) {
	return <OrbitCarouselBase {...props} />;
}

export function CategoryOrbitCarousel(props: Omit<OrbitCarouselProps, 'placement'>) {
	return <OrbitCarouselBase {...props} placement="center" autoRotate={props.autoRotate ?? false} />;
}

export function ServiceOrbitCarousel(props: Omit<OrbitCarouselProps, 'placement'>) {
	return <OrbitCarouselBase {...props} placement="upper" autoRotate={props.autoRotate ?? false} />;
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
	overlayTouch: {
		...StyleSheet.absoluteFillObject,
	},
	dialWrap: {
		position: 'absolute',
	},
	orbit: {
		...StyleSheet.absoluteFillObject,
	},
	pointer: {
		position: 'absolute',
		top: 14,
		width: 20,
		height: 16,
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
		borderBottomLeftRadius: 6,
		borderBottomRightRadius: 6,
		backgroundColor: '#ff6a00',
		shadowColor: '#ff6a00',
		shadowOpacity: 0.25,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 4 },
		elevation: 5,
	},
	pointerUpper: {
		top: 10,
	},
	itemPress: {
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
	},
	itemCard: {
		width: '100%',
		height: '100%',
		borderRadius: 24,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 2,
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 4 },
		elevation: 3,
	},
	iconContainer: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 20,
	},
	iconSolo: {
		width: 48,
		height: 48,
	},
	emojiFrame: {
		width: 50,
		height: 50,
		borderRadius: 16,
		backgroundColor: 'rgba(10, 47, 92, 0.04)',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: 'rgba(10, 47, 92, 0.08)',
	},
	iconEmoji: {
		fontSize: 28,
	},
	itemTitleContainer: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
		marginBottom: 4,
		minWidth: 64,
		maxWidth: '92%',
	},
	itemTitleContainerActive: {
		shadowColor: '#FF500D',
		shadowOpacity: 0.25,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 2 },
		elevation: 4,
	},
	itemTitle: {
		fontSize: 10,
		lineHeight: 12,
		fontWeight: '800',
		color: '#FFFFFF',
		textAlign: 'center',
	},
	itemTitleActive: {
		color: '#FFFFFF',
		fontSize: 11,
	},
});
