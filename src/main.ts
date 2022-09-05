import { readInputs } from "./inputs";
import { execSync } from "child_process";

async function run(): Promise<void> {
    const inputs = readInputs();
    execSync(`envsubst < ${inputs.templatePath} > ${inputs.outputPath}`);
    // core.setOutput("env-file", envFullPath);
}

run();
