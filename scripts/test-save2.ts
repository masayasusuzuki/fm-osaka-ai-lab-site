import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createArticle } from "../src/lib/microcms";

async function test(published: any) {
  try {
    const res = await createArticle({
      title: "テスト記事",
      slug: `test-${Date.now().toString(36)}`,
      excerpt: "",
      body: "<p>テスト本文</p>",
      thumbnail: "",
      episodeSlug: "ep01",
      published,
    });
    console.log("OK:", published === undefined ? "undefined" : JSON.stringify(published), res.id);
  } catch (err: any) {
    console.log("NG:", published === undefined ? "undefined" : JSON.stringify(published), err.message);
  }
}

async function main() {
  await test(undefined);
  await test("");
  await test(null);
  await test(new Date().toISOString());
}

main().catch(console.error);
