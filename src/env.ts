import * as core from "@actions/core";
import * as dotenv from "dotenv";
import { generateTemplate } from "./template";

interface Result {
  ok: boolean;
}

export async function prepareEnv({
  template,
  allowMissingVars = false,
}: {
  template: Awaited<ReturnType<typeof generateTemplate>>;
  allowMissingVars: boolean;
}): Promise<Result> {
  core.info("Preparing environment ...");
  const envObject = dotenv.parse(template);
  const missingKeys: string[] = [];
  for (const [, value] of Object.entries(envObject)) {
    if (typeof value === "string" && value.includes("${")) {
      const envKey = value.match(/\${?([^\}\n\s]+?)[\}\n\s$]/)?.[1];
      if (!envKey) {
        core.warning(`Failed to parse environment variable: ${value}`);
        continue;
      }
      if (!process.env[envKey] && !missingKeys.includes(envKey)) {
        core.warning(`Environment variable ${envKey} is not set`);
        missingKeys.push(envKey);
      }
    }
  }
  if (missingKeys.length && !allowMissingVars) {
    core.setFailed(`Missing environment variables: ${missingKeys.join(", ")}`);
    return { ok: false };
  }
  return { ok: true };
}
