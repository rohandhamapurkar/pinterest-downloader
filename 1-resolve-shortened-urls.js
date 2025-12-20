const fs = require("fs");
const fetch = require("node-fetch");

const INPUT_FILE = "urls.txt";
const OUTPUT_FILE = "urls_out.txt";
const CONCURRENCY = 5;

async function resolveUrl(url) {
  try {
    const res = await fetch.default(url.trim(), {
      redirect: "follow"
    });
    return res.url;
  } catch (err) {
    return `ERROR: ${url}`;
  }
}

(async () => {
  const urls = fs
    .readFileSync(INPUT_FILE, "utf-8")
    .split("\n")
    .map(u => u.trim())
    .filter(Boolean);

  const out = [];

  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(resolveUrl));
    out.push(...results);
  }

  fs.writeFileSync(OUTPUT_FILE, out.join("\n"), "utf-8");
  console.log(`✅ Resolved ${out.length} URLs → ${OUTPUT_FILE}`);
})();
