// @ts-check
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import localResolve from 'rollup-plugin-local-resolve'
import esbuild from 'rollup-plugin-esbuild'
import fs from 'fs-extra'
import pkg from '../package.json'
import path from 'path'
import css from 'rollup-plugin-postcss'
const root = path.join(__dirname, '../')
const componentsPath = path.join(root, 'components')
const distPath = path.join(root, 'dist')
const esmPath = path.join(root, 'esm')

const extensions = ['.js', '.jsx', '.ts', '.tsx']

const plugins = [
  esbuild({
    include: /\.[jt]sx?$/,
    exclude: /node_modules/,
    sourceMap: false,
    minify: process.env.NODE_ENV === 'production',
    target: 'es2017',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    tsconfig: './tsconfig.json',
    loaders: {
      '.json': 'json',
      '.js': 'jsx',
    },
  }),
  localResolve(),
  nodeResolve({
    browser: true,
    extensions,
  }),
  commonjs(),
  css(),
]

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

const cjsOutput = {
  format: 'cjs',
  exports: 'named',
  entryFileNames: '[name]/index.js',
  dir: distPath,

  chunkFileNames: '[name].js',

  sourcemap: false,
}

const esmOutput = {
  format: 'es',
  entryFileNames: '[name]/index.js',
  dir: esmPath,

  chunkFileNames: '[name].js',
}

export default (async () => {
  await fs.remove(distPath)
  await fs.remove(esmPath)
  const files = await fs.readdir(componentsPath)

  const components = await Promise.all(
    files.map(async name => {
      const unitPath = path.join(componentsPath, name)
      const entry = path.join(unitPath, 'index.ts')

      const stat = await fs.stat(unitPath)
      if (!stat.isDirectory()) return null

      const hasFile = await fs.pathExists(entry)
      if (!hasFile) return null

      return { name, url: entry }
    }),
  )
  console.log(
    `\n${Object.keys(components).length} components in total have been collected.`,
  )

  return [
    // Bundle each component separately
    ...components
      .filter(r => !!r)
      .map(({ name, url }) => ({
        input: { [name]: url },
        // output: [esmOutput, cjsOutput],
        output: [cjsOutput],
        external,
        plugins,
      })),
    // Bundle for packages containing all components.
    {
      input: { index: path.join(componentsPath, 'index.ts') },
      output: [
        {
          ...esmOutput,
          entryFileNames: 'index.esm.js',
        },
        {
          ...cjsOutput,
          entryFileNames: 'index.js',
        },
      ],
      external,
      plugins,
    },
  ]
})()
