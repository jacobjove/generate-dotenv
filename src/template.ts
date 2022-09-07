import * as core from "@actions/core";
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { Inputs } from "./inputs";

export async function generateTemplate({
  templatePaths,
}: Pick<Inputs, "templatePaths">): Promise<string> {
  let template = "";
  if (templatePaths.length === 1) {
    template = readFileSync(templatePaths[0], "utf8");
  } else if (templatePaths.length > 1) {
    try {
      execSync(`sort -u -t '=' -k 1,1 ${templatePaths.reverse().join(" ")}`, {
        shell: "/bin/bash",
        stdio: "inherit",
      });
    } catch (err) {
      core.setFailed(err instanceof Error ? err.message : `${err}`);
    }
  } else {
    core.setFailed("No template paths provided");
  }
  return template;
}
