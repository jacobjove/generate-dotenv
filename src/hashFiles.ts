import * as core from "@actions/core";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import * as stream from "stream";
import * as util from "util";

export async function hashFiles(paths: string[]): Promise<string> {
  if (!process.env.GITHUB_WORKSPACE)
    throw new Error("GITHUB_WORKSPACE not set");
  const result = crypto.createHash("sha256");
  for (const filepath of paths) {
    const absolutePath = filepath.startsWith(process.env.GITHUB_WORKSPACE)
      ? path.resolve(process.env.GITHUB_WORKSPACE, filepath)
      : filepath;
    if (!fs.existsSync(absolutePath)) {
      core.setFailed(
        `${absolutePath} does not exist. Please confirm that each specified template path is within the workspace.`
      );
      process.exit(1);
    }
    if (fs.statSync(filepath).isDirectory()) {
      core.warning(`Skipping directory '${filepath}'`);
      continue;
    }
    const hash = crypto.createHash("sha256");
    const pipeline = util.promisify(stream.pipeline);
    await pipeline(fs.createReadStream(filepath), hash);
    result.write(hash.digest());
  }
  result.end();
  return result.digest("hex");
}
