export default {
  input: '',
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