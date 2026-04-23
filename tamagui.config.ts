import { defaultConfig } from '@tamagui/config/v5'
import { createTamagui } from 'tamagui'

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
})

type BthTamaguiConfig = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends BthTamaguiConfig {}
}

export default tamaguiConfig
