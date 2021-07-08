module.exports = {
  roots: ['<rootDir>'],
  preset: 'ts-jest',
  testMatch: [ "**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)" ],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleFileExtensions: ['ts', 'js'],
};
