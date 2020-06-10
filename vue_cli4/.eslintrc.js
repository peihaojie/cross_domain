/*
 * @Date         : 2020-06-10 11:42:00
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-10 15:49:14
 * @FilePath     : \.eslintrc.js
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
    'quotes': 0,
    'space-before-function-paren': 0,
  }
}
