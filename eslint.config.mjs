import tseslint from 'typescript-eslint'
import ddgConfig from '@duckduckgo/eslint-config'
import globals from 'globals'

// @ts-check
export default tseslint.config(
    ...ddgConfig,
    ...tseslint.configs.recommended,

    {
        ignores: ['**/build/', '**/swift-package/', 'shared/data/constants.js', 'schema/__generated__', 'schema/__fixtures__'],
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.webextensions,
                ...globals.node,
                it: true,
                Proxy: true,
            },
        },

        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/triple-slash-reference': 'off',

            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'none',
                    caughtErrors: 'none',
                    ignoreRestSiblings: true,
                    vars: 'all',
                },
            ],
        },
    }
)
