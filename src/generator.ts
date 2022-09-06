import * as core from "@actions/core";
import { execSync } from "child_process";
import * as fs from "fs";
import { prepareEnv } from "./env";
import { Inputs } from "./inputs";

const POSTPROCESSING_REPLACEMENT_PATTERNS: [RegExp, string, string][] = [
  // Wrap values containing dollar signs in single quotes to prevent
  // unintended substitutions when the dotenv file is read by a shell.
  [
    /(^[A-Z_]+?=)([^\n\"\']+?[\$][^\n\"\']+)/g,
    "$1'$2'",
    "Wrap values containing dollar signs in single quotes",
  ],
  // Wrap values containing spaces and/or parentheses in double quotes
  // if they are not already wrapped in double/single quotes.
  [
    /(^[A-Z_]+?=)([^\n\"\']+?[\ \(\)][^\n\"]+)/g,
    '$1"$2"',
    "Wrap values containing spaces and/or parentheses in double quotes",
  ],
  // Wrap JSON-like values (beginning with an opening curly bracket and
  // ending with a closing curly bracket) in single quotes because we
  // assume them to contain both spaces and double quotes.
  [
    /(^[A-Z_]+?=)([\{][\"\ ]+?[^.]+[\}])/g,
    "$1'$2'",
    "Wrap JSON-like values in single quotes",
  ],
];

export async function generateDotEnvFile({
  template,
  outputPath,
}: { template: string } & Pick<Inputs, "outputPath">): Promise<void> {
  await prepareEnv({ template });
  core.info("Generating dotenv file ...");
  execSync(`echo "${template}" | envsubst > ${outputPath}`, {
    env: process.env,
  });
  // Post-process the file to ensure that values with spaces are wrapped in quotes, etc.
  // so that the file can be sourced without errors.
  fs.readFile(outputPath, "utf8", (err, data) => {
    if (err) core.setFailed(err.message);
    let processedFileContents = data;
    POSTPROCESSING_REPLACEMENT_PATTERNS.forEach(
      ([pattern, replacement, description]) => {
        core.info(`Running post-processing replacement: "${description}"`);
        for (const match of processedFileContents.matchAll(pattern)) {
          core.warning(
            `${match[0].replace(match[2], "*****")}\n` +
              `-->\n` +
              `${match[0].replace(
                match[2],
                replacement[0] + "*****" + replacement[replacement.length - 1]
              )}`
          );
        }
        processedFileContents = processedFileContents.replace(
          pattern,
          replacement
        );
      }
    );
    fs.writeFile(outputPath, processedFileContents, "utf8", function (err) {
      if (err) core.setFailed(err.message);
    });
  });
  // grep -P -q '^[A-Z_]+?=$' .env && echo "Found empty var name: $(grep -P '^[A-Z_]+?=$' .env)" && exit 1
}
