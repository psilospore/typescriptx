import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
const pkg = require('./package.json');

export default {
  entry: `compiled/${pkg.name}.js`,
  targets: [
    { dest: pkg.main, moduleName: pkg.name, format: 'umd' },
    { dest: pkg.module, format: 'es' }
  ],
  sourceMap: true,
  plugins: [
    commonjs(),
    sourceMaps()
  ]
}
