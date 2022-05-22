import packageJson from './package.json';
import typescript from "@rollup/plugin-typescript";

export default {
  input: 'src/runtime-core/index.ts',
  plugins: [
    typescript()
  ],
  output: [
    {
      format: "cjs",
      file: packageJson.module,
      sourcemap: true,
    },
    {
      format: "es",
      file: packageJson.main,
      sourcemap: true,
    },
  ],
}