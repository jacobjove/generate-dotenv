import { readInputs } from "./inputs";
import { generateDotEnvFile } from "./generator";
import { prepareEnv } from "./env";
import { generateTemplate } from "./template";

async function run(): Promise<void> {
  const { templatePaths, outputPath } = readInputs();
  const template = await generateTemplate({ templatePaths });
  await prepareEnv({ template });
  return generateDotEnvFile({ template, outputPath });
}

run();
