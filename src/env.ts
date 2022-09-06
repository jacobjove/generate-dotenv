import * as core from "@actions/core";
import * as dotenv from "dotenv";
import { generateTemplate } from "./template";

export async function prepareEnv({
  template,
}: {
  template: Awaited<ReturnType<typeof generateTemplate>>;
}): Promise<void> {
  core.info("Preparing environment ...");
  const envObject = dotenv.parse(template);
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
}
