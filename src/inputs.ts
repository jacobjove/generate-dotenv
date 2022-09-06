import * as core from "@actions/core";

export interface Inputs {
  templatePaths: string[];
  outputPath: string;
}

export function readInputs(): Inputs {
  core.info("Reading inputs...");
  const templatePaths = core.getInput("template-paths").split(" ");
  const outputPath = core.getInput("output-path");
  const inputs: Inputs = { templatePaths, outputPath };
  return inputs;
}
