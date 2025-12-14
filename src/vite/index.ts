'use strict'

/**
 * Vite configuration system with optimized presets for React, TypeScript, and vanilla projects.
 */

import { buildViteConfig } from './builders/buildViteConfig'
import { reactPreset } from './presets/reactPreset'
import { typescriptPreset } from './presets/typescriptPreset'
import { vanillaPreset } from './presets/vanillaPreset'

export { reactPreset, vanillaPreset, typescriptPreset, buildViteConfig }
export type { ViteBuildOptions, ViteBuildPaths, UserConfig, ReactPluginOptions } from './types/config'
