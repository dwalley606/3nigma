// jest.config.js
module.exports = {
  projects: [
    {
      displayName: "client",
      testMatch: ["<rootDir>/client/src/**/*.test.{ts,tsx,js,jsx}"],
      testEnvironment: "jest-environment-jsdom",
      transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
        "^.+\\.(js|jsx)$": "babel-jest"
      },
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/client/src/$1"
      }
    },
    {
      displayName: "server",
      testMatch: ["<rootDir>/server/**/*.test.{ts,js}"],
      testEnvironment: "node",
      transform: {
        "^.+\\.ts$": "ts-jest"
      },
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/server/$1"
      }
    }
  ]
};
