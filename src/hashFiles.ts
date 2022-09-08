import * as core from "@actions/core";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import * as stream from "stream";
import * as util from "util";

export async function hashFiles(paths: string[]): Promise<string> {
  const result = crypto.createHash("sha256");
  for (const filepath of paths) {
    if (!filepath.startsWith(`${process.env.GITHUB_WORKSPACE}${path.sep}`)) {
      core.warning(
        `Ignoring ${filepath} because it is not within the workspace.`
      );
      continue;
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
