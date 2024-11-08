import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import prettier from 'eslint-plugin-prettier'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import filenameRules from 'eslint-plugin-filename-rules'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  ...fixupConfigRules(compat.extends('eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended', "next/core-web-vitals", "next/typescript")),
  {
    plugins: {
      'react': fixupPluginRules(react),
      'react-hooks': fixupPluginRules(reactHooks),
      prettier,
      'filename-rules': fixupPluginRules(filenameRules),
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      ecmaVersion: 12,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      'prettier/prettier': 'error',
      'semi': ['warn', 'always'],


      //? components with components are an antipattern since they lose state when their parent is re-rendered
      "react/no-unstable-nested-components": ["error", { "allowAsProps": true }],

      //? max nesting depth of 5
      "react/jsx-max-depth": ["error", { "max": 5 }],

      //? one component per file
      "react/no-multi-comp": ["warn"],

      //? Requires the type declaration for buttons, to avoid type submit on buttons outside of forms
      'react/button-has-type': 'error',

      // 'filename-rules/match': [2, { '.ts': 'camelcase', '.js': 'camelcase', '.tsx': 'pascalcase', '.jsx': 'pascalcase' }],

      //? Specifies naming conventions inside react components
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'variable',
          // Specify PascalCase for React components
          format: ['PascalCase', 'camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'property',
          format: null,
          leadingUnderscore: 'allow',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],
    },
  },
]
