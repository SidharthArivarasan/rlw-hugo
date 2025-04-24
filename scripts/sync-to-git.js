const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const COUNT_FILE = path.join(__dirname, ".sync-count");

// Setup Git identity
execSync("git config --global user.email 'sidhartharivarasan@gmail.com'");
execSync("git config --global user.name 'Sidharth Arivarasan (AutoSync)'");

try {
  // Step 1: Load or initialize commit counter
  let count = 1;
  if (fs.existsSync(COUNT_FILE)) {
    count = parseInt(fs.readFileSync(COUNT_FILE, "utf-8")) + 1;
  }
  fs.writeFileSync(COUNT_FILE, count.toString());

  // Step 2: Stage Markdown content
  execSync("git add content/post/");

  // Step 3: Commit the changes
  execSync(`git commit -m "chore: sync Strapi blog content [build #${count}]"`);

  // Step 4: Push to your GitHub repo with token auth
  const repoURL = "https://SidharthArivarasan:" + process.env.GH_TOKEN + "@github.com/SidharthArivarasan/rlw-hugo.git";
  execSync(`git push ${repoURL}`);

  console.log(`✅ Blog content committed and pushed to GitHub. Build #${count}`);
} catch (err) {
  console.warn("⚠️ Git sync failed:", err.message);
}
