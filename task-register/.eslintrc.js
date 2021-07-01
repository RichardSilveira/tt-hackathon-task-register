module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ['./tsconfig.eslint.json'], // Specify it only for TypeScript files
  },
  plugins: ["@typescript-eslint", 'import'],
  extends: ['airbnb-typescript/base'],
  rules: {
    'max-len': 'off',
    'no-console': 'off',
    semi: [2, 'always', {omitLastInOneLineBlock: true}],
    'function-paren-newline': ['error', 'never'],
    'import/prefer-default-export': 0,
    'no-plusplus': ['error', {allowForLoopAfterthoughts: true}],
    'operator-assignment': 1,
    'no-unused-vars': 'off',
    'prefer-destructuring': 'off',
    'linebreak-style': 'off',
  }
}
