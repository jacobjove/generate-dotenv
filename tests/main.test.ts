import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { generateDotEnvFile } from "../src/generator";
import { generateTemplate } from "../src/template";

const DOTENV_TEMPLATE_LINES = [
  "VAR_C=${VAR_C}",
  "VAR_B=${VAR_B}",
  "VAR_A=${VAR_A}",
];

const DOTENV_LINES = ["VAR_C=c", "VAR_B=b", "VAR_A=a"];

const TEMPLATE_PATH = path.join(__dirname, ".env.template.tmp");
const OUTPUT_PATH = path.join(__dirname, ".env.tmp");

test("test if output value from action is same file as expected", async () => {
  process.env.VAR_A = "a";
  process.env.VAR_B = "b";
  process.env.VAR_C = "c";
  const templateFileContent = DOTENV_TEMPLATE_LINES.join("\n");
  fs.writeFileSync(TEMPLATE_PATH, templateFileContent);
  const template = await generateTemplate({ templatePaths: [TEMPLATE_PATH] });
  await generateDotEnvFile({
    template,
    outputPath: OUTPUT_PATH,
  });
  const dotEnvLines = fs.readFileSync(OUTPUT_PATH, "utf-8").split("\n");
  for (const [line, index] of dotEnvLines.entries()) {
    expect(line).toEqual(DOTENV_LINES[index]);
  }
  execSync(`find ${__dirname} -name "*.tmp" -type f -delete`);
});
