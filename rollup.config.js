import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import copy from 'rollup-plugin-cpy'
import visualizer from 'rollup-plugin-visualizer'
import filesize from 'rollup-plugin-filesize'
import { main, module, unpkg, name } from './package.json'

process.env.BABEL_ENV = 'build'

const capitalize = str => {
  const [head, ...rest] = str.split('')
  return [head.toUpperCase(), ...rest].join('')
}

const input = 'src/index.js'
const external = ['react']
const globals = {
  react: 'React',
}

const cjsOutput = { file: main, format: 'cjs', globals }
const esOutput = { file: module, format: 'es', globals }
const umdOutput = {
  file: unpkg,
  format: 'umd',
  name: capitalize(name),
  globals,
}

const basePlugins = [
  babel({
    exclude: 'node_modules/**',
    babelrc: true,
  }),
  commonjs(),
  nodeResolve({
    jsnext: true,
  }),
]

export default [
  {
    input,
    external,
    output: [cjsOutput, esOutput],
    plugins: basePlugins,
  },
  {
    input,
    external,
    output: umdOutput,
    plugins: [
      ...basePlugins,
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      uglify(),
      copy([
        { files: 'typedef/*', dest: 'dist' },
        { files: 'typedef/*', dest: 'dist/cjs' },
        { files: 'typedef/*', dest: 'dist/es' },
      ]),
      visualizer({
        filename: './.build-stats/index.html',
        title: 'zenform',
      }),
      filesize(),
    ],
  },
]
