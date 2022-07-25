// @ts-check
import { existsSync, mkdirSync, symlink, writeFileSync } from 'fs'
import inquirer from 'inquirer'
import { resolve } from 'path'
import { chdir } from 'process'
import { URL } from 'url'
import { $ } from 'zx'
const componentDir = new URL('../components', import.meta.url).pathname
inquirer
  .prompt([
    {
      message: 'What is the new component name?',
      name: 'component',
    },
  ])
  .then(async res => {
    const { component } = res

    const isExist = existsSync(resolve(componentDir, component))
    if (isExist) {
      throw new Error(`${component} already exists`)
    }
    mkdirSync(resolve(componentDir, component))

    // write package.json
    writeFileSync(
      resolve(componentDir, component, 'package.json'),
      JSON.stringify(
        {
          name: '@reactify-components/' + component,
          main: 'dist/index.cjs',
          module: 'dist/index.esm.js',
          types: 'types/index.d.ts',
          files: ['types', 'dist'],
          scripts: {
            build: 'rollup -c && npm run type',
            type: 'tsc -p tsconfig.types.json 2>/dev/null',
          },
          dependencies: {},
          devDependencies: {},
        },
        null,
        2,
      ),
    )
    // create symbol link
    chdir(resolve(componentDir, component))
    symlink(
      '../../scripts/tsconfig.types.json',
      './tsconfig.types.json',
      'file',
      () => {},
    )
    symlink('../../scripts/rollup.config.js', './rollup.config.js', 'file', () => {})

    // create entry file
    writeFileSync(resolve(componentDir, component, 'index.ts'), 'export {}')

    // run pnpm install
    await $`pnpm install -r`
  })
