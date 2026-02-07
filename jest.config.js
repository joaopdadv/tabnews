const dotenv = require("dotenv");
dotenv.config({ path: ".env.development" });

const nextJest = require("next/jest");

const createJestConfig = nextJest({
    dir: "./",
});
const jestConfig = createJestConfig({
    moduleDirectories: ["node_modules", "<rootDir>"],
    testEnvironment: "jest-environment-node",
});

module.exports = jestConfig;
