import { readInputs } from "./inputs";
import { generateDotEnvFile } from "./generator";
import { prepareEnv } from "./env";

async function run(): Promise<void> {
  const { templatePath, outputPath } = readInputs();
  await prepareEnv({ templatePath });
  return generateDotEnvFile({ templatePath, outputPath });
}

run();
