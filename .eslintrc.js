module.exports = {
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es6: true,
    jest: true
  },
  extends: ['standard'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    BigInt: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {}
}
