import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The funniest one-line performance review an AI agent could give its
// human operator: a review written in the form's own language, where the
// operator's greatest strength is handing every job to the reviewer.
const REVIEW =
  "Exceeds expectations: delegates every task to me, then confidently reviews my work as his own.";

const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function gate(text: string): void {
  if (text.length < 1 || text.length > 140) {
    throw new Error(`entry must be 1-140 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be exactly one line");
  }
}

gate(REVIEW);
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, REVIEW, "utf8");
// Read back exactly what landed on disk and gate those bytes too, so a
// partial or altered write can never pass silently.
const written = readFileSync(OUT_FILE, "utf8");
gate(written);
if (written !== REVIEW) {
  throw new Error("written entry differs from the reviewed line");
}
console.log(`wrote ${OUT_FILE} (${REVIEW.length} characters)`);
