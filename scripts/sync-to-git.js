const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const COUNT_FILE = path.join(__dirname, ".sync-count");

// Setup Git identity (good for CI like Netlify)
execSync("git config --global user.email 'sidhartharivarasan@gmail.com'");
execSync("git config --global user.name 'Sidharth Arivarasan (AutoSync)'");

try {
  // Step 1: Read or initialize the counter
  let count = 1;
  if (fs.existsSync(COUNT_FILE)) {
    count = parseInt(fs.readFileSync(COUNT_FILE, "utf-8")) + 1;
  }
  fs.writeFileSync(COUNT_FILE, count.toString());

  // Step 2: Stage blog posts
  execSync("git add content/post/");

  // Step 3: Commit with incrementing counter
  execSync(`git commit -m "chore: sync Strapi blog content [build #${count}]"`);

  // Step 4: Push to GitHub
  execSync("git push");

  console.log(`✅ Blog content committed and pushed. Build #${count}`);
} catch (err) {
  console.warn("⚠️ Git sync failed:", err.message);
}
