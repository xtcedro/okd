import { Context } from "https://deno.land/x/oak/mod.ts";
import { walk } from "https://deno.land/std/fs/mod.ts";
import { join, basename, dirname } from "https://deno.land/std/path/mod.ts";

// Define the directory containing static pages (adjust if needed)
const PAGES_DIR = join(Deno.cwd(), "public/pages");

// Interface for search result objects
interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

/**
 * Controller function to handle GET /search requests.
 * Reads all .html files under PAGES_DIR, searches for the query text, and returns JSON results.
 */
export async function searchSite(ctx: Context) {
  try {
    const url = ctx.request.url;
    const query = url.searchParams.get("q") || "";  // get the 'q' query parameter4
    if (!query) {
      // No query provided; respond with bad request or an empty result set
      ctx.response.status = 400;
      ctx.response.body = { error: "Missing search query ?q=..." };
      return;
    }

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Walk through the pages directory to find all .html files5
    for await (const entry of walk(PAGES_DIR, { exts: [".html"], includeDirs: false })) {
      const filePath = entry.path;
      // (Optional) Skip the search page itself to avoid self-matching in results:
      if (filePath.endsWith("/search.html")) {
        continue;
      }

      let content: string;
      try {
        content = await Deno.readTextFile(filePath);  // read file content6
      } catch (err) {
        console.error(`Failed to read ${filePath}:`, err);
        continue;  // skip this file on read error
      }

      // Strip out <script> and <style> content, then remove all HTML tags to get pure text
      let text = content
        .replace(/<script[\s\S]*?<\/script>/gi, " ")   // remove script contents
        .replace(/<style[\s\S]*?<\/style>/gi, " ")     // remove style contents
        .replace(/<[^>]+>/g, " ");                    // remove all tags

      const lowerText = text.toLowerCase();
      const idx = lowerText.indexOf(lowerQuery);
      if (idx !== -1) {
        // Found a match in this page
        // Extract a snippet around the first occurrence
        const snippetRadius = 60;  // characters to include before and after the match
        const start = idx - snippetRadius > 0 ? idx - snippetRadius : 0;
        const end = idx + lowerQuery.length + snippetRadius < text.length 
                    ? idx + lowerQuery.length + snippetRadius 
                    : text.length;
        let snippet = text.slice(start, end).trim();
        if (start > 0) snippet = "..." + snippet;
        if (end < text.length) snippet += "...";
        
        // Get the page title from <title> tag, if available
        let title = "";
        const titleMatch = content.match(/<title>(.*?)<\/title>/i);
        if (titleMatch) {
          title = titleMatch[1].trim();
        }
        if (!title) {
          // Fallback to file name (without extension) or directory name
          title = basename(filePath, ".html");
        }

        // Construct the URL path for the page. Assuming pages/<name>/<name>.html served at "/<name>"
        // e.g., "pages/about/about.html" -> "/about"
        let urlPath = "";
        const dirName = basename(dirname(filePath));
        const fileNameNoExt = basename(filePath, ".html");
        if (dirName.toLowerCase() === fileNameNoExt.toLowerCase()) {
          urlPath = `/${fileNameNoExt}`;  // folder and file have same name
        } else if (fileNameNoExt.toLowerCase() === "index") {
          // If file is index.html, use the folder name as URL (e.g., pages/docs/index.html -> /docs)
          urlPath = `/${dirName}`;
        } else {
          // Otherwise, include both path segments (e.g., pages/guide/intro.html -> /guide/intro)
          urlPath = `/${dirName}/${fileNameNoExt}`;
        }

        results.push({ title, url: urlPath, snippet });
      }
    }

    // Respond with JSON array of results
    ctx.response.status = 200;
    ctx.response.type = "json";             // specify JSON response7
    ctx.response.body = results;            // Oak will serialize object/array to JSON
  } catch (err) {
    console.error("Search error:", err);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal Server Error" };
  }
}