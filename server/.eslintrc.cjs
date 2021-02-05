const rules = require('common/eslint.cjs')

module.exports = {
  env: {
    es6: true,
    node: true,
    'jest/globals': true
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ["jest"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules,
}
