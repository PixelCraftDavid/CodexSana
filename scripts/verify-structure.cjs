const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve('.');
function walk(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? walk(path.join(directory, entry.name))
        : [path.join(directory, entry.name)],
    );
}
const files = walk('src').filter((file) => /\.(tsx?|css)$/.test(file));
const graph = new Map();
let checked = 0;
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const imports = file.endsWith('.css')
    ? [...source.matchAll(/@import\s+['"]([^'"]+)['"]/g)].map((match) => ({
        reference: match[1],
        typeOnly: false,
      }))
    : ts
        .createSourceFile(file, source, ts.ScriptTarget.Latest, true)
        .statements.filter(ts.isImportDeclaration)
        .map((statement) => ({
          reference: statement.moduleSpecifier.text,
          typeOnly:
            statement.importClause?.isTypeOnly ||
            (statement.importClause?.namedBindings &&
              ts.isNamedImports(statement.importClause.namedBindings) &&
              !statement.importClause.name &&
              statement.importClause.namedBindings.elements.every((element) => element.isTypeOnly)),
        }));
  const edges = [];
  for (const { reference, typeOnly } of imports) {
    if (!reference.startsWith('.') && !reference.startsWith('@/')) continue;
    assert(
      !reference.startsWith('@/components/') && !reference.startsWith('@/lib/'),
      `${file}: obsolete flat import ${reference}`,
    );
    const base = reference.startsWith('@/')
      ? path.resolve('src', reference.slice(2))
      : path.resolve(path.dirname(file), reference);
    const target = [base, base + '.ts', base + '.tsx', base + '.css'].find((candidate) =>
      fs.existsSync(candidate),
    );
    assert(target, `${file}: missing import ${reference}`);
    if (file.includes(`${path.sep}model${path.sep}`) || file.startsWith('src/shared/lib/')) {
      assert(
        !target.includes(`${path.sep}data${path.sep}`),
        `${file}: model depends on demo fixtures`,
      );
    }
    checked++;
    if (!typeOnly && /\.tsx?$/.test(target)) edges.push(target);
  }
  graph.set(path.resolve(file), edges);
}
const visited = new Set();
function visit(file, chain = []) {
  assert(
    !chain.includes(file),
    `Runtime import cycle: ${[...chain, file].map((item) => path.relative(root, item)).join(' → ')}`,
  );
  if (visited.has(file)) return;
  for (const next of graph.get(file) ?? []) visit(next, [...chain, file]);
  visited.add(file);
}
for (const file of graph.keys()) visit(file);
console.log(
  `${files.length} source/style files and ${checked} internal imports checked; no missing modules or runtime import cycles.`,
);
