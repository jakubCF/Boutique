import { defineConfig } from "eslint/config";
import globals from "globals";
import ts from "@eslint/ts";

export default defineConfig([
  { files: ["**/*.ts"], languageOptions: { globals: globals.browser } },
  { files: ["**/*.ts"], plugins: { ts }, extends: ["js/recommended"] },
]);
