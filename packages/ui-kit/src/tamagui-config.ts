import { defaultConfig } from '@tamagui/config/v5';
import { createTamagui, type TamaguiInternalConfig } from 'tamagui';

export const tamaguiConfig = createTamagui({
	...defaultConfig,
}) as TamaguiInternalConfig;

export default tamaguiConfig;