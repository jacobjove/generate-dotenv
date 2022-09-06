import * as core from "@actions/core";
import { Inputs } from "./inputs";
import { readFileSync } from "fs";
import * as dotenv from "dotenv";

export async function prepareEnv({
  templatePath,
}: Pick<Inputs, "templatePath">): Promise<void> {
  core.info("Reading template file ...");
  const templateFileContents = readFileSync(templatePath, "utf8");
  core.info(templateFileContents);
  core.info("Preparing environment ...");
  const envObject = dotenv.parse(templateFileContents);
  const missingKeys: string[] = [];
  Object.entries(envObject).forEach(([key, value]) => {
    const valueIsUndefined =
      value === undefined ||
      (typeof value === "string" && value.startsWith("$"));
    if (valueIsUndefined && !process.env[key]) {
      core.warning(`Environment variable ${key} is not set`);
      missingKeys.push(key);
    }
  });
  if (missingKeys.length) {
    core.setFailed(`Missing environment variables: ${missingKeys.join(", ")}`);
  }
  core.warning;
}
