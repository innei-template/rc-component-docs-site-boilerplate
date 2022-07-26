import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import localResolve from 'rollup-plugin-local-resolve'
import esbuild from 'rollup-plugin-esbuild'
import fs from 'fs-extra'
import { merge } from 'lodash'
import path from 'path'
import pkg from '../package.json'
const root = './'
const distPath = path.join(root, 'dist')

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
  dir: distPath,

  chunkFileNames: '[name].js',
}

export default async config => {
  await fs.remove(distPath)

  return merge(
    {
      input: { index: 'index.ts' },
      output: [
        {
          ...cjsOutput,
          entryFileNames: 'index.cjs.js',
        },
        {
          ...esmOutput,
          entryFileNames: 'index.esm.js',
        },
      ],
      external,
      plugins,
    },
    config,
  )
}
