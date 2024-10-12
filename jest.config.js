// jest.config.js
module.exports = {
  projects: [
    {
      displayName: "client",
      testMatch: ["<rootDir>/client/src/tests/**/*.test.js"], // Ensure this path matches your client test files
      testEnvironment: "jest-environment-jsdom",
    },
    {
      displayName: "server",
      testMatch: ["<rootDir>/server/tests/**/*.test.js"], // Ensure this path matches your server test files
      testEnvironment: "node",
    },
  ],
};
