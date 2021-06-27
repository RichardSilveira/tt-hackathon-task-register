module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'max-len': 'off',
    'no-console': 'off',
    semi: [2, 'always', { omitLastInOneLineBlock: true }],
    'function-paren-newline': ['error', 'never'],
    'import/prefer-default-export': 0,
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'operator-assignment': 1,
    'no-unused-vars': 'off',
    'prefer-destructuring': 'off',
    'linebreak-style': 'off',
  },
};
