import * as core from "@actions/core";
import { AES } from "crypto-js";
import { hashFiles } from "./hashFiles";

// https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#input-parameters-for-the-cache-action
const CACHE_KEY_MAX_LENGTH = 512;

export interface Inputs {
  templatePaths: string[];
  outputPath: string;
  cache: boolean;
  cacheKey: string;
  allowMissingVars: boolean;
}

export async function readInputs(): Promise<Inputs> {
  // core.info("Reading inputs...");
  const templatePaths = core
    .getInput("template-paths")
    .trim()
    .split(/[\s\n]+/);
  core.info(`Template paths: ${templatePaths}`);
  const outputPath = core.getInput("output-path");
  const cache = core.getBooleanInput("cache", { required: false }); // default: true (specified in action.yml)
  const allowMissingVars = core.getBooleanInput("allow-missing-vars", {
    required: false,
  }); // default: false (specified in action.yml)
  const cacheKey = cache
    ? core.getInput("cache-key", { required: false }) ||
      (await createCacheKey(templatePaths))
    : "";
  return { templatePaths, outputPath, cache, cacheKey, allowMissingVars };
}

async function createCacheKey(templatePaths: string[]): Promise<string> {
  if (!process.env.GITHUB_SHA) throw new Error("GITHUB_SHA is not set.");
  // TODO: Technically, the dotenv file could still differ if the same template paths
  // are specified in a different order... but that's a pretty unlikely scenario.
  const templatePathsHash = await hashFiles(templatePaths);
  // Create the cache key by encrypting the template paths hash with the SHA.
  // This is to prevent GitHub Actions from flagging the cache key as a secret
  // (for containing the SHA), which would prevent the cache key from being set
  // as an output. Reference: https://github.com/orgs/community/discussions/26636
  let combinedKey = AES.encrypt(
    templatePathsHash,
    process.env.GITHUB_SHA
  ).toString();
  if (combinedKey.length > CACHE_KEY_MAX_LENGTH) {
    combinedKey = combinedKey.slice(0, CACHE_KEY_MAX_LENGTH);
  }
  return `dotenv-${combinedKey}`;
}
