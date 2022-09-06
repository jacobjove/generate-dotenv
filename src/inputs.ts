import * as core from "@actions/core";

export interface Inputs {
  templatePaths: string[];
  outputPath: string;
  cache: boolean;
  cacheKey: string;
}

export function readInputs(): Inputs {
  // core.info("Reading inputs...");
  const templatePaths = core
    .getInput("template-paths")
    .trim()
    .split(/[\s\n]+/);
  const outputPath = core.getInput("output-path");
  const cache = core.getBooleanInput("cache", { required: false }); // default: true (specified in action.yml)
  const cacheKey =
    core.getInput("cache-key", { required: false }) ||
    `dotenv-${process.env.GITHUB_SHA}-${templatePaths.join("-")}`;
  return { templatePaths, outputPath, cache, cacheKey };
}
