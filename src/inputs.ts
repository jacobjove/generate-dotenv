import * as core from "@actions/core";
import { hashFiles } from "./hashFiles";

export interface Inputs {
  templatePaths: string[];
  outputPath: string;
  cache: boolean;
  cacheKey: string;
}

export async function readInputs(): Promise<Inputs> {
  // core.info("Reading inputs...");
  const templatePaths = core
    .getInput("template-paths")
    .trim()
    .split(/[\s\n]+/);
  core.info(`Template paths: ${templatePaths}`);
  const templatePathsHashPromise = hashFiles(templatePaths);
  const outputPath = core.getInput("output-path");
  const cache = core.getBooleanInput("cache", { required: false }); // default: true (specified in action.yml)
  const templatePathsHash = await templatePathsHashPromise;
  // TODO: Technically, the dotenv file could still differ if the same template paths
  // are specified in a different order... but that's a pretty unlikely scenario.
  const cacheKey =
    core.getInput("cache-key", { required: false }) ||
    `dotenv-${process.env.GITHUB_SHA}-${templatePathsHash}`;
  return { templatePaths, outputPath, cache, cacheKey };
}
