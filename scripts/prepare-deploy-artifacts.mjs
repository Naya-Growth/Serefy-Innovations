import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");
const distIndex = join(distDir, "index.html");
const assetsFile = process.env.SEREFY_RELEASE_ASSETS_FILE
  ? resolve(root, process.env.SEREFY_RELEASE_ASSETS_FILE)
  : join(root, "serefy-release-assets.txt");

function git(args) {
  try {
    return execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function shortShaFor(sha) {
  if (!sha || sha === "unknown") {
    return "unknown";
  }

  return git(["rev-parse", "--short=12", sha]) || sha.slice(0, 12);
}

if (!fs.existsSync(distIndex)) {
  throw new Error("dist/index.html is missing. Run npm run build first.");
}

const html = fs.readFileSync(distIndex, "utf8");
const builtAssets = [
  ...html.matchAll(/(?:src|href)="\/?(assets\/[^"]+)"/g),
]
  .map((match) => match[1])
  .filter((asset) => /\/index-[^/]+\.(js|css)$/.test(asset));
const uniqueAssets = [...new Set(builtAssets)];

if (!uniqueAssets.some((asset) => asset.endsWith(".js"))) {
  throw new Error("No built JavaScript asset found in dist/index.html.");
}

if (!uniqueAssets.some((asset) => asset.endsWith(".css"))) {
  throw new Error("No built CSS asset found in dist/index.html.");
}

const sha =
  process.env.DEPLOY_SHA ||
  process.env.GITHUB_SHA ||
  git(["rev-parse", "HEAD"]) ||
  "unknown";
const shortSha =
  process.env.DEPLOY_SHORT_SHA ||
  process.env.GITHUB_SHA?.slice(0, 12) ||
  shortShaFor(sha);
const branch =
  process.env.GITHUB_REF_NAME ||
  git(["rev-parse", "--abbrev-ref", "HEAD"]) ||
  "unknown";
const source =
  process.env.SEREFY_DEPLOY_SOURCE ||
  (process.env.GITHUB_ACTIONS ? "github-actions" : "webdev-direct");
const repository =
  process.env.GITHUB_REPOSITORY ||
  git(["config", "--get", "remote.origin.url"]) ||
  "unknown";

const marker = {
  source,
  repository,
  branch,
  sha,
  shortSha,
  runId: process.env.GITHUB_RUN_ID || null,
  runAttempt: process.env.GITHUB_RUN_ATTEMPT || null,
  createdAt: new Date().toISOString(),
};

fs.writeFileSync(join(distDir, "serefy-deploy.json"), `${JSON.stringify(marker)}\n`);
fs.writeFileSync(assetsFile, `${uniqueAssets.join("\n")}\n`);

console.log(`Prepared Serefy deploy marker for ${shortSha} (${source}).`);
console.log(`Release assets:\n${uniqueAssets.join("\n")}`);
