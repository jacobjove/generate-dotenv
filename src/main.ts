import * as core from "@actions/core";
import { restoreDotEnvFromCache, saveDotEnvToCache } from "./cache";
import { generateDotEnvFile } from "./generator";
import { readInputs } from "./inputs";
import { generateTemplate } from "./template";

async function run(): Promise<void> {
  const {
    cache: useCache,
    cacheKey,
    templatePaths,
    outputPath,
  } = await readInputs();
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
  const generated = await generateDotEnvFile({ template, outputPath });
  if (!generated) return;
  if (useCache) {
    core.info(`Saving ${outputPath} to cache...`);
    await saveDotEnvToCache({ cacheKey, outputPath });
    core.info(`Saved ${outputPath} to cache with key: ${cacheKey}`);
  }
}

run();
