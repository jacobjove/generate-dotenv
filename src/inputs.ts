import * as core from "@actions/core";

export interface Inputs {
    templatePath: string;
    outputPath: string;
}

export function readInputs(): Inputs {
    core.info("Reading inputs...");
    const templatePath = core.getInput("template-path");
    const outputPath = core.getInput("output-path");
    const inputs: Inputs = { templatePath, outputPath };
    return inputs;
}
