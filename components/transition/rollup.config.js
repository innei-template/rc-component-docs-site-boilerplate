import createConfig from '../../scripts/rollup.monorepo.config'
import pkg from './package.json'
const external = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)]

export default createConfig({
  external,
})
