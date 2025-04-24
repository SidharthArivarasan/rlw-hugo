const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const COUNT_FILE = path.join(__dirname, ".sync-count");

try {
  // Setup Git identity
  execSync("git config --global user.email 'sidhartharivarasan@gmail.com'");
  execSync("git config --global user.name 'Sidharth Arivarasan (AutoSync)'");

  // Load or init sync counter
  let count = 1;
  if (fs.existsSync(COUNT_FILE)) {
    count = parseInt(fs.readFileSync(COUNT_FILE, "utf-8")) + 1;
  }
  fs.writeFileSync(COUNT_FILE, count.toString());

  // Check if there are any changes in content/post
  const hasChanges = execSync("git status --porcelain content/post")
    .toString()
    .trim().length > 0;

  if (hasChanges) {
    execSync("git add content/post/");
    execSync(`git commit -m "chore: sync Strapi blog content [build #${count}]"`);

    // Push using GH_TOKEN
    const repoURL = "https://SidharthArivarasan:" + process.env.GH_TOKEN + "@github.com/SidharthArivarasan/rlw-hugo.git";
    execSync(`git push ${repoURL}`);

    console.log(`✅ Markdown files pushed to GitHub (build #${count})`);
  } else {
    console.log("ℹ️ No new blog content to sync.");
  }

} catch (err) {
  console.warn("⚠️ Git sync failed:", err.message);
}
