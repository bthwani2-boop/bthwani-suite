'use client';

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from 'react';
import { Platform } from 'react-native';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from './tamagui-config';
import {
	directionConfig,
	getUiText,
	lightTheme,
	resolveDirectionFromLanguage,
	resolveSemanticTheme,
	type Language,
	type BthLanguage,
	type Direction,
	type SemanticTheme,
	type ThemeMode,
} from './foundation';

export type RootConfig = {
	language?: Language;
	themeMode?: ThemeMode;
};

export type BthRootConfig = RootConfig;

export const ROOT_DEFAULTS: Required<Pick<RootConfig, 'language' | 'themeMode'>> = {
	language: directionConfig.defaultLanguage,
	themeMode: 'light',
};

export const BTH_ROOT_DEFAULTS = ROOT_DEFAULTS;

type DirectionContextValue = {
	direction: Direction;
	language: Language;
	isRtl: boolean;
	usesLogicalStartEnd: boolean;
	setLanguage: (language: Language) => void;
};

const DirectionContext = createContext<DirectionContextValue>({
	direction: directionConfig.defaultDirection,
	language: directionConfig.defaultLanguage,
	isRtl: directionConfig.defaultDirection === 'rtl',
	usesLogicalStartEnd: directionConfig.useLogicalStartEnd,
	setLanguage: () => undefined,
});

type ThemeContextValue = {
	mode: ThemeMode;
	theme: SemanticTheme;
};

const ThemeContext = createContext<ThemeContextValue>({
	mode: 'light',
	theme: lightTheme,
});

type PortalFactory = (children: ReactNode, container: Element) => ReactNode;

type PortalContextValue = {
	hostElement: Element | null;
	isWeb: boolean;
};

const PortalContext = createContext<PortalContextValue>({
	hostElement: null,
	isWeb: Platform.OS === 'web',
});

let cachedPortalFactory: PortalFactory | null | undefined;

function readStoredLanguage() {
	if (typeof window === 'undefined') {
		return null;
	}

	try {
		const storedLanguage = window.localStorage.getItem(directionConfig.languageStorageKey);
		return storedLanguage === 'ar' || storedLanguage === 'en' ? storedLanguage : null;
	} catch {
		return null;
	}
}

function syncDocumentLanguage(language: Language, direction: Direction) {
	if (typeof document === 'undefined') {
		return;
	}

	document.documentElement.lang = language;
	document.documentElement.dir = direction;

	try {
		window.localStorage.setItem(directionConfig.languageStorageKey, language);
	} catch {
		// Ignore storage failures and keep the in-memory language active.
	}

	try {
		document.cookie = `${directionConfig.languageStorageKey}=${language}; path=/; max-age=31536000; SameSite=Lax`;
	} catch {
		// Ignore cookie failures in non-standard runtimes.
	}
}

function resolvePortalFactory() {
	if (cachedPortalFactory !== undefined) {
		return cachedPortalFactory;
	}

	try {
		const reactDomModule = new Function('return import("react-dom")')() as Promise<{ createPortal?: PortalFactory }>;
		cachedPortalFactory = null;
		void reactDomModule.then((module) => {
			cachedPortalFactory = module.createPortal ?? null;
		});
	} catch {
		cachedPortalFactory = null;
	}

	return cachedPortalFactory;
}

export type ThemeProviderProps = {
	mode?: ThemeMode;
	children: ReactNode;
};

export function ThemeProvider({ mode = 'light', children }: ThemeProviderProps) {
	const value = useMemo<ThemeContextValue>(() => ({ mode, theme: resolveSemanticTheme(mode) }), [mode]);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
	return useContext(ThemeContext);
}

export function useTheme() {
	return useThemeContext();
}

export type DirectionProviderProps = {
	language?: Language;
	children: ReactNode;
};

export function DirectionProvider({ language = directionConfig.defaultLanguage, children }: DirectionProviderProps) {
	const [activeLanguage, setActiveLanguage] = useState<Language>(() => readStoredLanguage() ?? language);

	useEffect(() => {
		const storedLanguage = readStoredLanguage();

		if (storedLanguage) {
			setActiveLanguage((currentLanguage) => (currentLanguage === storedLanguage ? currentLanguage : storedLanguage));
			return;
		}

		setActiveLanguage((currentLanguage) => (currentLanguage === language ? currentLanguage : language));
	}, [language]);

	const resolvedDirection = resolveDirectionFromLanguage(activeLanguage);

	useEffect(() => {
		syncDocumentLanguage(activeLanguage, resolvedDirection);
	}, [activeLanguage, resolvedDirection]);

	const setLanguage = useCallback((nextLanguage: Language) => {
		setActiveLanguage(nextLanguage);
	}, []);

	const value = useMemo<DirectionContextValue>(
		() => ({
			direction: resolvedDirection,
			language: activeLanguage,
			isRtl: resolvedDirection === 'rtl',
			usesLogicalStartEnd: directionConfig.useLogicalStartEnd,
			setLanguage,
		}),
		[activeLanguage, resolvedDirection, setLanguage]
	);

	return <DirectionContext.Provider value={value}>{children}</DirectionContext.Provider>;
}

export function useDirectionContext() {
	return useContext(DirectionContext);
}

export function useDirection() {
	return useDirectionContext();
}

export function useUiLanguage() {
	const { language, setLanguage } = useDirection();
	const isEnglish = language === 'en';

	const toggleLanguage = useCallback(() => {
		setLanguage(isEnglish ? 'ar' : 'en');
	}, [isEnglish, setLanguage]);

	return {
		language,
		isEnglish,
		toggleLanguage,
	};
}

export function useUiText() {
	const { language } = useDirection();
	return getUiText(language === 'en' ? 'en' : 'ar');
}

type UiTextVars = Record<string, string | number | boolean | null | undefined>;

function getValueByDot(obj: unknown, key: string): unknown {
	if (!key) return undefined;

	const parts = key.split('.');
	let current: unknown = obj;

	for (const part of parts) {
		if (current && typeof current === 'object' && part in current) {
			current = (current as Record<string, unknown>)[part];
		} else {
			return undefined;
		}
	}

	return current;
}

export function useI18n() {
	const uiText = useUiText();
	const { direction, language } = useDirection();

	const t = useCallback((key: string, vars?: UiTextVars) => {
		const value = getValueByDot(uiText, key);

		if (typeof value === 'string') {
			if (!vars) return value;

			return value.replace(/\{(\w+)\}/g, (_match, name: string) => {
				const resolved = vars[name];
				if (resolved === undefined || resolved === null) return '';
				return String(resolved);
			});
		}

		return String(value ?? key);
	}, [uiText]);

	const isRTL = direction === 'rtl';

	return { t, isRTL, language, direction, uiText };
}

export type UiKitProviderProps = {
	language?: Language;
	themeMode?: ThemeMode;
	children: ReactNode;
};

export function PortalHost({ children }: { children?: ReactNode }) {
	const [hostElement, setHostElement] = useState<Element | null>(null);
	const hostId = useMemo(() => `bth-portal-host-${Math.random().toString(36).slice(2, 10)}`, []);
	const isWeb = Platform.OS === 'web';

	const contextValue = useMemo<PortalContextValue>(() => ({ hostElement, isWeb }), [hostElement, isWeb]);

	return (
		<PortalContext.Provider value={contextValue}>
			{children}
			{isWeb
				? React.createElement('div', {
						id: hostId,
						ref: (node: Element | null) => setHostElement(node),
						'data-bth-portal-host': 'true',
						style: {
							position: 'fixed',
							inset: 0,
							zIndex: 2147483000,
							pointerEvents: 'none',
							display: 'flex',
							flexDirection: 'column',
						},
					})
				: null}
		</PortalContext.Provider>
	);
}

export const BthPortalHost = PortalHost;

export type PortalLayerProps = {
	active?: boolean;
	children: ReactNode;
	fallback?: ReactNode;
};

export type BthPortalLayerProps = PortalLayerProps;

export function PortalLayer({ active = true, children, fallback = null }: PortalLayerProps) {
	const { hostElement, isWeb } = useContext(PortalContext);

	if (!active) {
		return null;
	}

	if (!isWeb) {
		return <>{fallback}</>;
	}

	const portalFactory = resolvePortalFactory();

	if (portalFactory && hostElement) {
		return <>{portalFactory(children, hostElement)}</>;
	}

	return <>{children}</>;
}

export const BthPortalLayer = PortalLayer;

export function UiKitProvider({ language = 'ar', themeMode = 'light', children }: UiKitProviderProps) {
	return (
		<TamaguiProvider config={tamaguiConfig} defaultTheme={themeMode === 'dark' || themeMode === 'high-contrast' ? 'dark' : 'light'}>
			<ThemeProvider mode={themeMode}>
				<DirectionProvider language={language}>
					<PortalHost>{children}</PortalHost>
				</DirectionProvider>
			</ThemeProvider>
		</TamaguiProvider>
	);
}

export type RootProvidersProps = RootConfig & {
	children: ReactNode;
};

export type BthRootProvidersProps = RootProvidersProps;

export function RootProviders({ children, language, themeMode }: RootProvidersProps) {
	return (
		<UiKitProvider
			language={language ?? ROOT_DEFAULTS.language}
			themeMode={themeMode ?? ROOT_DEFAULTS.themeMode}
		>
			{children}
		</UiKitProvider>
	);
}

export const BthRootProviders = RootProviders;

export type { Language, BthLanguage, Direction, SemanticTheme, ThemeMode } from './foundation';


