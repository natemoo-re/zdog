import { terser } from "rollup-plugin-terser";
import license from "rollup-plugin-license";
import pkg from "./package.json";

const LICENSE_COMMENT = `Zdog v<%= pkg.version %>
Round, flat, designer-friendly pseudo-3D engine
Licensed <%= pkg.license %>
<%= pkg.homepage %>
Copyright 2019 Metafizzy`;

export default [
  // browser-friendly UMD build this is minified and the one served by the unpkg registry
  {
    input: "js/index.js",
    output: {
      name: "Zdog",
      file: pkg.browser,
      format: "umd"
    },
    plugins: [
      terser(),
      license({
        banner: LICENSE_COMMENT
      })
    ]
  },
  // browser-friendly UMD build
  {
    input: "js/index.js",
    output: {
      name: "Zdog",
      file: "dist/zdog.umd.js",
      format: "umd"
    },
    plugins: [
      license({
        banner: LICENSE_COMMENT
      })
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build
  {
    input: "js/index.js",
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ],
    plugins: [
      license({
        banner: LICENSE_COMMENT
      })
    ]
  }
];
