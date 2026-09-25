import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // legacy/ yalnızca referans içindir, lint kapsamı dışı.
    "legacy/**",
    // .scratch/ geçici debug/repro betikleri içindir, repoya girmez.
    ".scratch/**",
    // Playwright çıktı klasörleri.
    "test-results/**",
    "playwright-report/**",
  ]),
]);

export default eslintConfig;
