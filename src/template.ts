import * as core from "@actions/core";
import { Inputs } from "./inputs";
import { exec } from "child_process";
import { readFileSync } from "fs";

export async function generateTemplate({
  templatePaths,
}: Pick<Inputs, "templatePaths">): Promise<string> {
  core.info("Generating dotenv file ...");
  let template: string = "";
  if (templatePaths.length === 1) {
    template = readFileSync(templatePaths[0], "utf8");
  } else if (templatePaths.length > 1) {
    exec(`sort -u -t '=' -k 1,1 ${templatePaths.reverse().join(" ")}`, (error, stdout, stderr) => {
        core.info(stderr);
        if (error) core.setFailed(error.message);
        template = stdout;
    });
  } else {
    core.setFailed("No template paths provided");
  }
  return template;
}
