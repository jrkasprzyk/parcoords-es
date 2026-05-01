import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import json from '@rollup/plugin-json';

export default {
    input: 'src/index.js',
    plugins: [
        json({ preferConst: true }),
        postcss({ extract: 'dist/parcoords.css' }),
        babel({ babelHelpers: 'bundled' }),
        resolve({ browser: true }),
        commonjs(),
        serve({
            open: true,
            verbose: true,
            contentBase: ['demo', 'dist'],
            historyApiFallback: false,
            host: 'localhost',
            port: 3004
        }),
        livereload({
            watch: ['demo', 'dist'],
            verbose: false
        })
    ],
    external: [],
    output: [
        {
            file: 'dist/parcoords.standalone.js',
            format: 'umd',
            name: 'ParCoords',
            sourcemap: true
        }
    ]
};
