import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default eslint(
  {
    typescript: {
      plugins: ["style"],
      tsconfigPath: "tsconfig.json",
      overrides: {
        "node/prefer-global/process": "off",
        "no-unused-vars": "off",
        "style/multiline-ternary": "off",
        "ts/restrict-template-expressions": "off",
      },
    },
    ignores: [
      ".next",
      ".out",
      "main",
      "tailwind.shadcnui.config.js",
      "node_modules",
      "public",
      "*.d.ts",
      "**stories**",
      "pnpm-lock.yaml",
    ],
  },
  {
    // Without `files`, they are general rules for all files
    rules: {
      "no-unused-vars": "off",
      "node/prefer-global/process": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "import/no-duplicates": "error",
      "ts/no-require-imports": "off",
      "import/no-mutable-exports": "off",
      "unused-imports/no-unused-vars": "off",
      "ts/no-unsafe-call": "off",
      "ts/no-use-before-define": "off",
      "ts/strict-boolean-expressions": "off",
      "ts/no-redeclare": "off",
      "ts/no-unsafe-member-access": "off",
      "ts/no-misused-promises": "off",
      "ts/no-unsafe-return": "off",
      "ts/no-unsafe-assignment": "off",
      "ts/no-unsafe-argument": "off",
      "style/multiline-ternary": "off",
    },
  }
);
