import * as core from "@actions/core";
import { Inputs } from "./inputs";
import { execSync } from "child_process";

export async function generateDotEnvFile({
  template,
  outputPath,
}: { template: string } & Pick<Inputs, "outputPath">): Promise<void> {
  core.info("Generating dotenv file ...");
  execSync(`echo "${template}" | envsubst > ${outputPath}`, { env: process.env });
}
