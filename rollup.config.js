import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {terser} from 'rollup-plugin-terser';

export default {
  input: 'src/do_the_five.js',
  output: [
    {
      file: 'js/do_the_five.min.js',
      format: 'iife',
      name: 'do_the_five',
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    terser()
  ]
}
