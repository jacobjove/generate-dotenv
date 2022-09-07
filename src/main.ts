import * as core from "@actions/core";
import { restoreDotEnvFromCache, saveDotEnvToCache } from "./cache";
import { generateDotEnvFile } from "./generator";
import { readInputs } from "./inputs";
import { generateTemplate } from "./template";

async function run(): Promise<void> {
  const { cache: useCache, cacheKey, templatePaths, outputPath } = readInputs();
  if (useCache) {
    const restoredCacheKey = await restoreDotEnvFromCache({
      cacheKey,
      outputPath,
    });
    if (typeof restoredCacheKey === "undefined") {
      core.info("No cached dotenv file found.");
    } else if (restoredCacheKey) {
      core.info(`Restored ${outputPath} from cache.`);
      return;
    }
  }
  const template = await generateTemplate({ templatePaths });
  await generateDotEnvFile({ template, outputPath });
  if (useCache) {
    saveDotEnvToCache({ cacheKey, outputPath });
  }
}

run();
