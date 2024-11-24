import babel from "@rollup/plugin-babel";

const config =  {
  input: "build/es6/passken.js",
  output: {
    name: "passken",
    file: "build/passken.mjs",
    format: "es"
  },
  external: [
    "@types/bcrypt",
    "@dwtechs/checkard",
    "bcrypt",
    "generate-password"
  ],
  plugins: [
    babel({
      // exclude: "node_modules/**" // only transpile our source code
    }),
  ]
};

export default config;
