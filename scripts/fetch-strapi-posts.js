const axios = require("axios");
const fs = require("fs");
const path = require("path");

const STRAPI_API = "https://strapi-skrlw.onrender.com/api/blogs?filters[publication_state][$eq]=published";
const OUTPUT_DIR = path.resolve(__dirname, "../content/post");

function richTextToPlainText(richBody) {
  if (!Array.isArray(richBody)) return "";

  return richBody
    .map((block) => {
      if (!block.children || !Array.isArray(block.children)) return "";
      return block.children.map((child) => child.text || "").join(" ");
    })
    .filter(Boolean)
    .join("\n\n");
}

async function fetchBlogs() {
  try {
    const response = await axios.get(STRAPI_API);
    const blogs = response.data.data;

    if (!Array.isArray(blogs) || blogs.length === 0) {
      console.log("⚠️ No published blogs found.");
      return;
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    blogs.forEach((blog) => {
      const {
        title,
        slug,
        body,
        published_date,
        createdAt,
      } = blog;

      const frontmatter = `---
title: "${title}"
slug: "${slug}"
date: "${published_date || createdAt}"
draft: false
---
`;

      const content = `${frontmatter}
${richTextToPlainText(body)}
`;

      const filename = `${slug}.md`;
      const filepath = path.join(OUTPUT_DIR, filename);
      fs.writeFileSync(filepath, content, "utf-8");
      console.log(`✅ Saved: ${filename}`);
    });

    console.log("✅ All published blogs synced to Hugo.");
  } catch (err) {
    console.error("❌ Error fetching blogs:", err.message);
  }
}

fetchBlogs();
