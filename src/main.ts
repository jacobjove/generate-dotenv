import { readInputs } from "./inputs";
import { generateDotEnvFile } from "./generator";

async function run(): Promise<void> {
  const { templatePath, outputPath } = readInputs();
  return generateDotEnvFile({ templatePath, outputPath });
}

run();
