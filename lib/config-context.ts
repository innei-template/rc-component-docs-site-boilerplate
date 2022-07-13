import React from 'react'
import type { DeepPartial } from 'node_modules/@geist-ui/core/esm/utils/types'
import { GeistUIThemes } from '@geist-ui/core'

export interface Configs {
  onThemeChange?: (themes: DeepPartial<GeistUIThemes>) => void
  isChinese?: boolean
  updateChineseState: (state: boolean) => void
  sidebarScrollHeight: number
  updateSidebarScrollHeight: (height: number) => void

  customTheme: DeepPartial<GeistUIThemes>
  updateCustomTheme: (theme: DeepPartial<GeistUIThemes>) => void
  switchTheme: (type: string) => void
}

export const defaultConfigs: Configs = {
  sidebarScrollHeight: 0,
  updateSidebarScrollHeight: () => {},
  updateChineseState: () => {},

  customTheme: {},
  updateCustomTheme: () => {},
  onThemeChange: () => {},
  switchTheme: () => {},
}

export const ConfigContext = React.createContext<Configs>(defaultConfigs)

export const useConfigs = (): Configs => React.useContext(ConfigContext)
