import type { Config } from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    clearMocks: true,
    moduleFileExtensions: ["ts", "js"],
    testMatch: ["**/*.test.ts"],
    transform: {
      "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.tests.json" }],
    },
    cache: false,
    projects: [
      {
        displayName: "generate-dotenv",
        testMatch: ["<rootDir>/**/*.test.ts"],
        transform: {
          "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.tests.json" }],
        },
      },
    ],
  };
};
