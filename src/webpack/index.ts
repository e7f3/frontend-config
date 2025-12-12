'use strict'

import { buildWebpackConfig } from './builders/buildWebpackConfig'
import { reactPreset } from './presets/reactPreset'
import { typescriptPreset } from './presets/typescriptPreset'
import { vanillaPreset } from './presets/vanillaPreset'

export { reactPreset, vanillaPreset, typescriptPreset, buildWebpackConfig }
