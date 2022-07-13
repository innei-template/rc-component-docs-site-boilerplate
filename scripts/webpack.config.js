const fs = require('fs-extra')
const path = require('path')
const @geist-ui/corePath = path.join(__dirname, '../@geist-ui/core')

module.exports = async () => {
  const files = await fs.readdir(@geist-ui/corePath)

  const @geist-ui/core = await Promise.all(
    files.map(async name => {
      const comPath = path.join(@geist-ui/corePath, name)
      const entry = path.join(comPath, 'index.ts')

      const stat = await fs.stat(comPath)
      if (!stat.isDirectory()) return null

      const hasFile = await fs.pathExists(entry)
      if (!hasFile) return null

      return { name, url: entry }
    }),
  )

  const @geist-ui/coreEntries = @geist-ui/core
    .filter(r => r)
    .reduce((pre, current) => {
      return Object.assign({}, pre, { [current.name]: current.url })
    }, {})

  console.log(
    `\n${Object.keys(@geist-ui/coreEntries).length} @geist-ui/core in total have been collected.`,
  )
  console.log('Bundle now...')

  const configs = {
    mode: 'none',

    entry: @geist-ui/coreEntries,

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '../dist'),
      libraryTarget: 'commonjs',
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        @geist-ui/core: @geist-ui/corePath,
      },
    },

    externals: [
      {
        react: {
          root: 'React',
          commonjs2: 'react',
          commonjs: 'react',
          amd: 'react',
        },
        'react-dom': {
          root: 'ReactDOM',
          commonjs2: 'react-dom',
          commonjs: 'react-dom',
          amd: 'react-dom',
        },
        // '/styled-jsx/': {
        //   root: '_JSXStyle',
        //   commonjs2: 'styled-jsx',
        //   commonjs: 'styled-jsx',
        //   amd: 'styled-jsx',
        // },
      },
      function (context, request, done) {
        if (/^styled-jsx/.test(request)) {
          return done(null, 'commonjs ' + request)
        }
        done()
      },
    ],

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /(node_modules)/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/react', '@babel/typescript'],
            plugins: ['styled-jsx/babel'],
          },
        },
      ],
    },
  }

  return [
    configs,
    {
      ...configs,

      entry: {
        index: path.join(@geist-ui/corePath, 'index.ts'),
      },
    },
    {
      ...configs,

      mode: 'production',

      entry: {
        'index.min': path.join(@geist-ui/corePath, 'index.ts'),
      },

      output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist'),
        library: 'GeistUI',
        libraryTarget: 'umd',
        globalObject: 'this',
      },
    },
  ]
}
