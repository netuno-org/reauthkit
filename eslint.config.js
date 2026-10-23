import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  {
    ignores: [
      "node_modules/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/coverage/**",
      "User/**",
      "extensions/**",
      "CachedProfilesData/**",
      "logs/**",
      "storage/**",
      "public/**",
      "docs/**"
    ]
  },
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },
  {
    files: ["*.js", "config/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs
      }
    },
    rules: {
      "no-undef": "error"
    }
  },
  {
    files: ["server/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin
      }
    },
    rules: {
      "no-undef": "error",
      quotes: ["error", "double"]
    }
  },
  {
    files: ["server/__tests__/**/*.js"],
    languageOptions: {
      globals: {
        global: "readonly"
      }
    }
  },
  {
    files: ["website/**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.nodeBuiltin
      }
    },
    rules: {
      "no-undef": "error",
      quotes: ["error", "double"]
    }
  },
  {
    files: ["ui/**/*.{js,jsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh
    },
    settings: {
      react: {
        version: "19.2"
      }
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jquery,
        netuno: "readonly"
      }
    },
    rules: {
      ...react.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true }
      ],
      "no-undef": "error"
    }
  }
];
