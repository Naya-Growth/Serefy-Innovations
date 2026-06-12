import { createReadStream, existsSync, rmSync } from "node:fs";
import { mkdtemp, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, basename, join, resolve } from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sshTarget = process.env.SEREFY_WEBDEV_SSH || "webdev";
const maxArchiveBytes = 650 * 1024 * 1024;
const isWindows = process.platform === "win32";

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

function requireFile(path, message) {
  if (!existsSync(path)) {
    console.error(message);
    process.exit(1);
  }
}

async function main() {
  requireFile(join(root, "package.json"), "Run this from the Serefy Innovations repo.");
  requireFile(join(root, "scripts", "verify-public-assets.mjs"), "This does not look like the Serefy repo.");

  run("npm", ["ci", "--prefer-offline", "--include=optional"]);
  run("npm", ["test"]);
  run("npm", ["run", "verify:assets"]);
  run("npm", ["run", "lint"]);
  run("npm", ["run", "build"]);

  requireFile(join(root, "dist", "index.html"), "Build failed: dist/index.html is missing.");
  requireFile(join(root, "dist", "favicon.ico"), "Build failed: dist/favicon.ico is missing.");

  const tempDir = await mkdtemp(join(tmpdir(), "serefy-webdev-"));
  const archivePath = join(tempDir, "serefy-dist.tar.gz");

  try {
    run("tar", ["-czf", archivePath, "-C", root, "dist"]);

    const archiveStat = await stat(archivePath);
    if (archiveStat.size > maxArchiveBytes) {
      console.error(`Archive is too large: ${Math.round(archiveStat.size / 1024 / 1024)} MB.`);
      process.exit(1);
    }

    console.log(`\n> ssh ${sshTarget} < ${basename(archivePath)}`);
    await new Promise((resolvePromise, rejectPromise) => {
      const ssh = spawn("ssh", [sshTarget], {
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

  console.log("\nDeploy completed. Smoke-test:");
  console.log("  https://serefyinnovations.com/");
  console.log("  https://www.serefyinnovations.com/");
  console.log("  https://serefy-innovations.preview.nayagrowth.com/");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
