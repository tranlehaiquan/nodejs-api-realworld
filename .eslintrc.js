module.exports = {
  env: {
    jest: true
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jest',
  ],
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
  },
  extends: [
    'airbnb-typescript/base',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'plugin:jest/recommended',
  ],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
}
