import { readJSONSync } from 'fs-extra'
import createConfig from '../../scripts/rollup.monorepo.config'
const pkg = readJSONSync('./package.json')

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'react',
  'react-dom',
]

export default createConfig({
  external,
})
