// Test-only module resolution hook: lets Node's native TS runner resolve the
// project's extensionless relative imports (e.g. `./bundeslaender`) by trying a
// `.ts` extension. Keeps the source using Next/bundler-idiomatic extensionless
// imports while still being runnable under `node --test`.
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const HAS_JS_EXT = /\.(ts|tsx|js|jsx|mjs|cjs|json)$/;

export async function resolve(specifier, context, next) {
  // Relative import without an explicit JS/TS extension (note: a dotted name like
  // "./schulferien.data" has extname ".data" but still needs ".ts" appended).
  if ((specifier.startsWith("./") || specifier.startsWith("../")) && !HAS_JS_EXT.test(specifier)) {
    const parent = context.parentURL ? fileURLToPath(context.parentURL) : process.cwd();
    const candidate = path.resolve(path.dirname(parent), specifier + ".ts");
    if (existsSync(candidate)) {
      return next(pathToFileURL(candidate).href, context);
    }
  }
  return next(specifier, context);
}
