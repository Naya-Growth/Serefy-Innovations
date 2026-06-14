import { createReadStream, existsSync, readFileSync, rmSync } from "node:fs";
import { mkdtemp, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, basename, join, resolve } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sshTarget = process.env.SEREFY_WEBDEV_SSH || "webdev";
const deployCommand = process.env.SEREFY_WEBDEV_COMMAND || "serefy";
const maxArchiveBytes = 650 * 1024 * 1024;
const isWindows = process.platform === "win32";
const assetsFile = join(root, "serefy-release-assets.txt");
const publicUrls = [
  "https://serefyinnovations.com",
  "https://www.serefyinnovations.com",
  "https://serefy-innovations.preview.nayagrowth.com",
];

function run(command, args, options = {}) {
  console.log(`\n> ${[command, ...args].join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: isWindows,
    ...options,
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function output(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    shell: isWindows,
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      `${[command, ...args].join(" ")} failed:\n${result.stderr || result.stdout}`,
    );
  }

  return result.stdout.trim();
}

function requireFile(path, message) {
  if (!existsSync(path)) {
    console.error(message);
    process.exit(1);
  }
}

function requireCleanMain() {
  const branch = output("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
  if (branch !== "main") {
    console.error(`Refusing to deploy from branch ${branch}. Switch to main first.`);
    process.exit(1);
  }

  const status = output("git", ["status", "--porcelain=v1", "--untracked-files=all"]);
  if (status) {
    console.error("Refusing to deploy from a dirty working tree.");
    console.error("Commit and push your changes first, or stop and ask the CTO.");
    console.error(status);
    process.exit(1);
  }

  run("git", ["fetch", "origin", "main", "--prune"]);
  const localSha = output("git", ["rev-parse", "HEAD"]);
  const originSha = output("git", ["rev-parse", "origin/main"]);
  if (localSha !== originSha) {
    console.error("Refusing to deploy because local main is not identical to origin/main.");
    console.error(`local main:  ${localSha}`);
    console.error(`origin/main: ${originSha}`);
    console.error("Run git pull --ff-only, or push/merge the approved commit first.");
    process.exit(1);
  }
}

function readDeployMarker() {
  const markerPath = join(root, "dist", "serefy-deploy.json");
  requireFile(markerPath, "Build failed: dist/serefy-deploy.json is missing.");
  return JSON.parse(readFileSync(markerPath, "utf8"));
}

function readReleaseAssets() {
  requireFile(assetsFile, "Build failed: serefy-release-assets.txt is missing.");
  return readFileSync(assetsFile, "utf8")
    .split(/\r?\n/)
    .map((asset) => asset.trim())
    .filter(Boolean);
}

async function fetchWithRetry(url, options = {}) {
  let lastError;

  for (let attempt = 1; attempt <= 8; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: {
          "cache-control": "no-cache",
          ...(options.headers || {}),
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt < 8) {
        await new Promise((resolvePromise) => setTimeout(resolvePromise, 3000));
      }
    }
  }

  throw new Error(`${url} failed after retries: ${lastError?.message || lastError}`);
}

async function verifyPublicRelease(marker, assets) {
  for (const url of publicUrls) {
    const htmlResponse = await fetchWithRetry(`${url}/`);
    const html = await htmlResponse.text();

    if (!html.includes("src_serefy_live_20260605")) {
      throw new Error(`${url} is missing the Naya lead connector marker.`);
    }

    for (const asset of assets) {
      if (!html.includes(asset)) {
        throw new Error(`${url} is not serving deployed asset ${asset}.`);
      }
      await fetchWithRetry(`${url}/${asset}`, { method: "HEAD" });
    }

    const markerResponse = await fetchWithRetry(`${url}/serefy-deploy.json`);
    const liveMarker = await markerResponse.json();
    if (liveMarker.sha !== marker.sha) {
      throw new Error(
        `${url} is serving sha ${liveMarker.sha || "unknown"}, expected ${marker.sha}.`,
      );
    }

    console.log(`${url} serves ${marker.shortSha || marker.sha}`);
  }
}

async function main() {
  requireFile(join(root, "package.json"), "Run this from the Serefy Innovations repo.");
  requireFile(join(root, "scripts", "verify-public-assets.mjs"), "This does not look like the Serefy repo.");

  requireCleanMain();

  run("npm", ["ci", "--prefer-offline", "--include=optional"]);
  run("npm", ["test"]);
  run("npm", ["run", "verify:assets"]);
  run("npm", ["run", "lint"]);
  run("npm", ["run", "build"]);
  run("npm", ["run", "prepare:deploy-artifacts"], {
    env: {
      ...process.env,
      SEREFY_DEPLOY_SOURCE: "webdev-direct",
    },
  });

  requireFile(join(root, "dist", "index.html"), "Build failed: dist/index.html is missing.");
  requireFile(join(root, "dist", "favicon.ico"), "Build failed: dist/favicon.ico is missing.");
  const deployMarker = readDeployMarker();
  const releaseAssets = readReleaseAssets();

  const tempDir = await mkdtemp(join(tmpdir(), "serefy-webdev-"));
  const archivePath = join(tempDir, "serefy-dist.tar.gz");

  try {
    run("tar", ["-czf", archivePath, "-C", root, "dist"]);

    const archiveStat = await stat(archivePath);
    if (archiveStat.size > maxArchiveBytes) {
      console.error(`Archive is too large: ${Math.round(archiveStat.size / 1024 / 1024)} MB.`);
      process.exit(1);
    }

    console.log(`\n> ssh ${sshTarget} ${deployCommand} < ${basename(archivePath)}`);
    await new Promise((resolvePromise, rejectPromise) => {
      const ssh = spawn("ssh", [sshTarget, deployCommand], {
        cwd: root,
        stdio: ["pipe", "inherit", "inherit"],
        shell: false,
      });

      createReadStream(archivePath).pipe(ssh.stdin);
      ssh.on("error", rejectPromise);
      ssh.on("close", (code) => {
        if (code === 0) {
          resolvePromise();
        } else {
          rejectPromise(new Error(`ssh deploy failed with exit code ${code}`));
        }
      });
    });
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }

  console.log("\nVerifying public release marker and built assets...");
  await verifyPublicRelease(deployMarker, releaseAssets);
  console.log("\nDeploy completed.");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
