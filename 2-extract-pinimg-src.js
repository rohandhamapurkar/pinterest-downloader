const fs = require("fs");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

const INPUT_FILE = "urls_out.txt";      // list of final pin urls (one per line)
const OUTPUT_FILE = "pinimg_out.txt";   // extracted image src per line
const CONCURRENCY = 5;

async function fetchHtml(url) {
  const res = await fetch.default(url, {
    redirect: "follow",
    headers: {
      // Helps Pinterest return more complete HTML
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9"
    }
  });

  const html = await res.text();
  return { finalUrl: res.url, html };
}

function extractPinImgSrc(html) {
  const $ = cheerio.load(html);

  // Most specific selector based on your example
  let src =
    $('img[elementtiming="StoryPinImageBlock-MainPinImage"]').attr("src") ||
    $('img[alt="Story pin image"]').attr("src");

  // Fallbacks if Pinterest changes attributes/classes
  if (!src) {
    // Any img with src pointing to i.pinimg.com
    src = $('img[src^="https://i.pinimg.com/"]').first().attr("src");
  }

  // normalize
  if (src && src.startsWith("//")) src = "https:" + src;

  // Only keep pinimg links if requested
  if (src && !src.startsWith("https://i.pinimg.com/")) return null;

  return src || null;
}

async function resolveOne(pinUrl) {
  try {
    const { finalUrl, html } = await fetchHtml(pinUrl);
    const src = extractPinImgSrc(html);
    return { pinUrl, finalUrl, src };
  } catch (e) {
    return { pinUrl, finalUrl: null, src: null, error: String(e.message || e) };
  }
}

(async () => {
  const urls = fs
    .readFileSync(INPUT_FILE, "utf-8")
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);

  const results = [];

  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(resolveOne));
    results.push(...batchResults);
  }

  // Write only the src URLs (or ERROR lines)
  const outLines = results.map((r) => {
    if (r.src) return r.src;
    if (r.error) return `ERROR: ${r.pinUrl} (${r.error})`;
    return `NOT_FOUND: ${r.pinUrl}`;
  });

  fs.writeFileSync(OUTPUT_FILE, outLines.join("\n"), "utf-8");
  console.log(`✅ Processed ${urls.length} pins → ${OUTPUT_FILE}`);
})();
