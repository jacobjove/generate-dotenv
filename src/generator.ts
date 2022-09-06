import * as core from "@actions/core";
import { execSync } from "child_process";
import * as fs from "fs";
import { Inputs } from "./inputs";

export async function generateDotEnvFile({
  template,
  outputPath,
}: { template: string } & Pick<Inputs, "outputPath">): Promise<void> {
  core.info("Generating dotenv file ...");
  execSync(`echo "${template}" | envsubst > ${outputPath}`, {
    env: process.env,
  });
  // Post-process the file to ensure that values with spaces are wrapped in quotes, etc.
  // so that the file can be sourced without errors.
  fs.readFile(outputPath, "utf8", (err, data) => {
    if (err) core.setFailed(err.message);
    const processedContent = data
      // Wrap values containing dollar signs in single quotes to prevent
      // unintended substitutions when the dotenv file is read by a shell.
      .replace(/(^[A-Z_]+?=)([^\n\"\']+?[\$][^\n\"\']+)/g, "$1'$2'")
      // Wrap values containing spaces and/or parentheses in double quotes
      // if they are not already wrapped in double/single quotes.
      .replace(/(^[A-Z_]+?=)([^\n\"\']+?[\ \(\)][^\n\"]+)/g, '$1"$2"')
      // Wrap JSON-like values (beginning with an opening curly bracket and
      // ending with a closing curly bracket) in single quotes because we
      // assume them to contain both spaces and double quotes.
      .replace(/(^[A-Z_]+?=)([\{][\"\ ]+?[^.]+[\}])/g, "$1'$2'");
    fs.writeFile(outputPath, processedContent, "utf8", function (err) {
      if (err) core.setFailed(err.message);
    });
  });
  // grep -P -q '^[A-Z_]+?=$' .env && echo "Found empty var name: $(grep -P '^[A-Z_]+?=$' .env)" && exit 1
}
