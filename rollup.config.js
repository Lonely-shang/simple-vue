import typescript from "@rollup/plugin-typescript";

export default {
  input: 'src/runtime-core/index.ts',
  plugins: [
    typescript()
  ],
  output: [
    {
      format: "cjs",
      file: 'dist/simple-vue.cjs.js',
      sourcemap: true,
    },
    {
      name: "vue",
      format: "es",
      file: 'dist/simple-vue.esm.js',
      sourcemap: true,
    },
  ],
}