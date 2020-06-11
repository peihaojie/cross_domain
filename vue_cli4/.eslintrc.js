/*
 * @Date         : 2020-06-10 11:42:00
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-11 13:35:11
 * @FilePath     : \vue_cli4\.eslintrc.js
 */ 
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  "globals": {
    "$axios": true
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'quotes': 'off',
    'space-before-function-paren': 'off',
    'no-extra-semi': 'off',
    'semi': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  }
}
