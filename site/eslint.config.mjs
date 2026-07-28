import next from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/** Next 16 dropped `next lint`, so ESLint runs directly — see the `lint` script. */
const config = [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
  ...next,
  ...nextTypescript,
];

export default config;
