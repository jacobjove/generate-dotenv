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
    allowMissingVars,
  } = await readInputs();
  let restoredFromCache = false;
  if (useCache) {
    const restoredCacheKey = await restoreDotEnvFromCache({
      cacheKey,
      outputPath,
    });
    restoredFromCache = restoredCacheKey === cacheKey;
    if (restoredFromCache) {
      core.info(`Restored ${outputPath} from cache.`);
    } else if (restoredCacheKey) {
      core.info("No cached dotenv file found.");
    }
  }
  if (!restoredFromCache) {
    const template = await generateTemplate({ templatePaths });
    const generated = await generateDotEnvFile({
      template,
      outputPath,
      allowMissingVars,
    });
    if (generated && useCache) {
      core.info(`Saving ${outputPath} to cache...`);
      const cacheId = await saveDotEnvToCache({ cacheKey, outputPath });
      core.info(
        `Saved ${outputPath} to cache with key: ${cacheKey} (cache ID: ${cacheId}))`
      );
      // const restoredCacheKey = await restoreDotEnvFromCache({
      //   cacheKey,
      //   outputPath,
      // });
      // restoredFromCache = restoredCacheKey === cacheKey;
      // if (!restoredFromCache) {
      //   core.error(`Failed to cache ${outputPath} with key: ${cacheKey}`);
      // }
    }
  }
  core.setOutput("cache-key", useCache ? cacheKey : null);
}

run();
