import * as core from "@actions/core";
import { Inputs } from "./inputs";
import { execSync } from "child_process";

export async function generateDotEnvFile({ templatePath, outputPath }: Inputs): Promise<void> {
  core.info("Generating dotenv file ...");
  execSync(`envsubst < ${templatePath} > ${outputPath}`, { env: process.env });
}
