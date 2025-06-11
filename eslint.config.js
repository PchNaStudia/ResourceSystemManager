import eslintConfigPrettier from "eslint-config-prettier";
import pluginReact from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "default",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "variable",
          format: ["camelCase"],
        },
        {
          selector: "variable",
          types: ["function"],
          format: ["PascalCase", "camelCase"],
        },
        {
          selector: "variable",
          types: ["boolean"],
          format: ["PascalCase"],
          prefix: ["is", "should", "has", "can", "did", "will"],
        },
        {
          selector: "function",
          format: ["PascalCase", "camelCase"],
          trailingUnderscore: "allow",
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
          suffix: ["Props", "Type"],
        },
        {
          selector: "import",
          format: ["PascalCase", "camelCase"],
        },
        {
          selector: "objectLiteralProperty",
          format: ["camelCase", "snake_case", "UPPER_CASE"],
        },
        {
          selector: "objectLiteralProperty",
          format: null,
          filter: {
            regex: "^Content-Type|Accept|Authorization|Content-Length$",
            match: true,
          },
        },
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "variable",
          modifiers: ["destructured"],
          format: ["camelCase", "snake_case"],
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  eslintConfigPrettier,
);
