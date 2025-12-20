const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const INPUT_FILE = "pinimg_out.txt";
const OUTPUT_DIR = "pin_images";
const CONCURRENCY = 5;

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

function getFileNameFromUrl(url) {
  try {
    const u = new URL(url);
    return path.basename(u.pathname);
  } catch {
    return null;
  }
}

async function downloadImage(url) {
  try {
    const res = await fetch.default(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const buffer = await res.arrayBuffer();
    const fileName = getFileNameFromUrl(url);

    if (!fileName) throw new Error("Invalid filename");

    const filePath = path.join(OUTPUT_DIR, fileName);
    fs.writeFileSync(filePath, Buffer.from(buffer));

    return `DOWNLOADED: ${fileName}`;
  } catch (err) {
    return `ERROR: ${url} (${err.message})`;
  }
}

(async () => {
  const urls = fs
    .readFileSync(INPUT_FILE, "utf-8")
    .split("\n")
    .map((u) => u.trim())
    .filter(
      (u) =>
        u &&
        u.startsWith("https://i.pinimg.com/")
    );

  const results = [];

  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(downloadImage));
    results.push(...batchResults);
    console.log(`Progress: ${Math.min(i + CONCURRENCY, urls.length)} / ${urls.length}`);
  }

  fs.writeFileSync(
    "download_log.txt",
    results.join("\n"),
    "utf-8"
  );

  console.log(`✅ Downloaded ${urls.length} images into ./${OUTPUT_DIR}`);
})();
