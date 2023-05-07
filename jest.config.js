/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  randomize: true,
  coveragePathIgnorePatterns : [
    "<rootDir>/src/helpers/constants.ts",
    "<rootDir>/src/Tasker.ts",
    "<rootDir>/tests/",
  ],
  verbose: true,
};
