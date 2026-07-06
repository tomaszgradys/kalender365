// Test-only module resolution hook: lets Node's native TS runner resolve the
// project's extensionless relative imports (e.g. `./bundeslaender`) by trying a
// `.ts` extension. Keeps the source using Next/bundler-idiomatic extensionless
// imports while still being runnable under `node --test`.
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

export async function resolve(specifier, context, next) {
  if ((specifier.startsWith("./") || specifier.startsWith("../")) && !path.extname(specifier)) {
    const parent = context.parentURL ? fileURLToPath(context.parentURL) : process.cwd();
    const candidate = path.resolve(path.dirname(parent), specifier + ".ts");
    if (existsSync(candidate)) {
      return next(pathToFileURL(candidate).href, context);
    }
  }
  return next(specifier, context);
}
