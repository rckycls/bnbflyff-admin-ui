import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    ...js.configs.recommended,
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  ...tseslint.configs.recommended,
  // ✅ Fix: Wrap pluginReact config in array
  {
    ...pluginReact.configs.flat.recommended,
  },
  // ✅ Add custom rules
  {
    rules: {
      "no-unused-vars": ["warn", { args: "none", ignoreRestSiblings: true }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "react/react-in-jsx-scope": "off", // Optional: for React 17+
    },
  },
]);
