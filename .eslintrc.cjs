module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint', 'react-hooks', 'import'],
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
  settings: { react: { version: 'detect' } },
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-restricted-imports': ['error', {
      'paths': [
        { 'name': '@/features/portfolio/components', 'message': 'Legacy components are banned. Use @/components/cardkit/*' },
        { 'name': '@/components/Section', 'message': 'Legacy Section is banned. Use CardPanel.' },
        { 'name': '@/features/ui/FieldGroup', 'message': 'Legacy FieldGroup is banned. Use CardKit FieldGroup.' }
      ],
      'patterns': [
        '@/features/portfolio/components/*',
        '**/features/portfolio/components/*',
        '**/components/Section*',
        '**/features/ui/FieldGroup*'
      ]
    }]
  },
  overrides: [
    {
      files: ['src/features/portfolio/**/*.{ts,tsx}'],
      rules: {
        'react/forbid-dom-props': ['warn', {
          forbid: [
            {
              propName: 'style',
              message: 'Inline styles are discouraged in Genesis components. Use CSS classes from genesis.css instead.'
            }
          ]
        }]
      }
    }
  ]
}
