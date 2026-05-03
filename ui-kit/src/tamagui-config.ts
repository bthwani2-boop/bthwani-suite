import { defaultConfig } from '@tamagui/config/v5';
import { createTamagui, type TamaguiInternalConfig } from 'tamagui';
import { tamaguiBridge } from './foundation';

export const tamaguiConfig = createTamagui({
	...defaultConfig,
	themes: {
		...defaultConfig.themes,
		light: {
			...defaultConfig.themes.light,
			...tamaguiBridge.themes.light
		},
		dark: {
			...defaultConfig.themes.dark,
			...tamaguiBridge.themes.dark
		},
		'high-contrast': {
			...defaultConfig.themes.dark,
			...tamaguiBridge.themes['high-contrast']
		}
	},
	tokens: {
		...defaultConfig.tokens,
		space: {
			...defaultConfig.tokens.space,
			...tamaguiBridge.tokens.spacing
		},
		size: {
			...defaultConfig.tokens.size,
			...tamaguiBridge.tokens.sizing
		},
		radius: {
			...defaultConfig.tokens.radius,
			...tamaguiBridge.tokens.radius
		},
		zIndex: {
			...defaultConfig.tokens.zIndex,
			...tamaguiBridge.tokens.zIndex
		}
	}
}) as TamaguiInternalConfig;

export default tamaguiConfig;
