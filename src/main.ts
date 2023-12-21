import { DefaultArtifactClient } from "@actions/artifact";
import * as core from "@actions/core";
import { restoreDotEnvFromCache, saveDotEnvToCache } from "./cache";
import { generateDotEnvFile } from "./generator";
import { readInputs } from "./inputs";
import { generateTemplate } from "./template";

async function run(): Promise<void> {
  const { cache, upload, key, templatePaths, outputPath, allowMissingVars } =
    await readInputs();
  let restored = false;
  if (cache) {
    const restoredCacheKey = await restoreDotEnvFromCache({
      key,
      outputPath,
    });
    restored = restoredCacheKey === key;
    if (restored) {
      core.info(`Restored ${outputPath} from cache.`);
    } else if (restoredCacheKey) {
      core.info("No cached dotenv file found.");
    }
  }
  if (!restored) {
    const template = await generateTemplate({ templatePaths });
    const generated = await generateDotEnvFile({
      template,
      outputPath,
      allowMissingVars,
    });
    if (generated) {
      if (cache) {
        core.info(`Saving ${outputPath} to cache...`);
        const cacheId = await saveDotEnvToCache({ key, outputPath });
        core.info(
          `Saved ${outputPath} to cache with key: ${key} (cache ID: ${cacheId}))`,
        );
        // const restoredCacheKey = await restoreDotEnvFromCache({
        //   key,
        //   outputPath,
        // });
        // restoredFromCache = restoredCacheKey === key;
        // if (!restoredFromCache) {
        //   core.error(`Failed to cache ${outputPath} with key: ${key}`);
        // }
      }
      if (upload) {
        const artifactClient = new DefaultArtifactClient();
        core.info(`Uploading ${outputPath} as an artifact...`);
        const { size, id } = await artifactClient.uploadArtifact(
          key,
          [outputPath],
          ".", // root directory
          { retentionDays: 1 },
        );
        core.info(`Uploaded ${outputPath} as artifact ${id} (${size}).`);
      }
    }
  }
  core.setOutput("key", key);
}

run();
