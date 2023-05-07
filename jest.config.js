/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageThreshold:{
    branches: 100,
    functions: 100,
    lines: 100,
    statements: 100
  },
  randomize: true,
  coveragePathIgnorePatterns : [
    "<rootDir>/src/helpers/constants.ts",
    "<rootDir>/src/Tasker.ts",
    "<rootDir>/tests/",
  ],
  verbose: true,

};
