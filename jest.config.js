module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx)",
    "**/?(*.)+(spec|test).+(ts|tsx)",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  setupFilesAfterEnv: [
    './src/App.test.tsx',
  ],
};