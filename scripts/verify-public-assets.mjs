import fs from "node:fs";
import path from "node:path";

const projectRoot = path.join(import.meta.dirname, "..");

function assertFile(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`${relativePath} is missing`);
  }
}

assertFile("index.html");
assertFile("src/App.tsx");
assertFile("src/components/WizardModal.tsx");
assertFile("src/components/ThankYouModal.tsx");
assertFile("src/components/GallerySection.tsx");
assertFile("src/lib/naya-lead.ts");
assertFile("public/favicon.svg");
assertFile("public/site.webmanifest");
assertFile("public/robots.txt");
assertFile("public/sitemap.xml");
assertFile("public/llms.txt");
assertFile("public/media/og-cover.jpg");

const indexHtml = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
if (!indexHtml.includes("Serefy Innovations | Smart Egg Incubators for Farmers")) {
  throw new Error("index.html title has drifted");
}

if (!indexHtml.includes("og:image")) {
  throw new Error("index.html is missing the open graph image metadata");
}

if (!indexHtml.includes("https://serefyinnovations.com/")) {
  throw new Error("index.html is missing the live canonical URL metadata");
}

if (!indexHtml.includes('data-naya-connector="src_serefy_live_20260605"')) {
  throw new Error("index.html is missing the Naya Growth lead connector script");
}

console.log("serefy innovations public asset checks passed");
