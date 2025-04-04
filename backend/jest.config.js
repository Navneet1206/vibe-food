module.exports = {
    testEnvironment: "node",
    verbose: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov"],
    testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
    setupFilesAfterEnv: ["./jest.setup.js"],
    testTimeout: 10000,
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
}; 