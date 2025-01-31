/** @type {import('jest').Config} **/
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"], // Emplacement des tests
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["**/*.test.ts"],
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coverageDirectory: "<rootDir>/coverage",
};