import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

type PackageMetadata = {
  version: string;
  license?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};
type Lockfile = { packages: Record<string, { version?: string }> };
type PrerenderManifest = { routes: Record<string, unknown> };

const root = resolve('.');
const evidence = join(root, 'docs/evidence/phase0');
const normalized = (file: string) => relative(root, file).replaceAll('\\', '/');
const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');
const readJSON = <T>(file: string): T => JSON.parse(readFileSync(file, 'utf8')) as T;

function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

function licenses() {
  const metadata = readJSON<PackageMetadata>(join(root, 'package.json'));
  const lock = readJSON<Lockfile>(join(root, 'package-lock.json'));
  return Object.entries({ ...metadata.dependencies, ...metadata.devDependencies }).map(
    ([name, requested]) => {
      const directory = join(root, 'node_modules', name);
      const installed = readJSON<PackageMetadata>(join(directory, 'package.json'));
      assert.equal(lock.packages[`node_modules/${name}`]?.version, installed.version);
      assert(installed.license, `Missing license metadata: ${name}`);
      const files = readdirSync(directory).filter((file) =>
        /^(license|licence|copying|notice)/i.test(file),
      );
      assert(files.length > 0, `Missing license file: ${name}`);
      return {
        name,
        requested,
        installed: installed.version,
        license: installed.license,
        scope: metadata.dependencies?.[name] ? 'production' : 'development',
        files: files.map((file) => ({
          file: normalized(join(directory, file)),
          sha256: sha256(readFileSync(join(directory, file), 'utf8')),
        })),
      };
    },
  );
}

function buildInventory() {
  const output = join(root, '.next-production');
  assert(existsSync(join(output, 'BUILD_ID')), 'Run npm run build successfully first');
  const routes = readJSON<Record<string, string>>(join(output, 'app-path-routes-manifest.json'));
  const prerender = readJSON<PrerenderManifest>(join(output, 'prerender-manifest.json'));
  const pages = Object.values(routes).filter((route) => route !== '/_not-found');
  const dynamic = pages.filter((route) => !(route in prerender.routes));
  return {
    buildId: readFileSync(join(output, 'BUILD_ID'), 'utf8').trim(),
    staticRoutes: pages.filter((route) => route in prerender.routes),
    dynamicRoutes: dynamic,
    nextDynamicRouteCount: dynamic.length,
    vercelFunctionCount: null,
    vercelEvidenceAvailable: existsSync(join(root, '.vercel/output/config.json')),
    note: 'Next route count is not a Vercel function count. No Vercel adapter artifact verified.',
  };
}

function sourceInventory() {
  const files = walk(join(root, 'src'));
  const sources = files.map((file) => ({
    file: normalized(file),
    source: readFileSync(file, 'utf8'),
  }));
  const routeHandlers = sources.filter(({ file }) => /\/route\.(ts|tsx)$/.test(file));
  const actions = sources.filter(({ source }) => /['"]use server['"]/.test(source));
  const paymentFiles = sources.filter(({ source }) =>
    /stripe|paypal|mercadopago|checkout\.sessions/i.test(source),
  );
  assert.equal(paymentFiles.length, 0, 'Review payment integration before continuing');
  assert(existsSync(join(root, 'src/app/ficha/[id]/[concept]')), 'Unexpected route folders');
  return {
    routeHandlers: routeHandlers.map(({ file }) => file),
    serverActionFiles: actions.map(({ file }) => file),
    paymentIntegrationFiles: paymentFiles.map(({ file }) => file),
    patientPhotoFiles: sources
      .filter(({ source }) => /\bphoto\b|PhotoUpload|photo-upload/.test(source))
      .map(({ file }) => file),
    modules: ['dashboard', 'patients', 'cards', 'qr', 'designs', 'emergency'].map((name) => ({
      name,
      files: files
        .filter((file) => normalized(file).startsWith(`src/features/${name}/`))
        .map(normalized),
    })),
    filesOver300Lines: sources
      .filter(({ source }) => source.split(/\r?\n/).length > 300)
      .map(({ file, source }) => ({ file, lines: source.split(/\r?\n/).length })),
  };
}

mkdirSync(evidence, { recursive: true });
const report = {
  generatedAt: new Date().toISOString(),
  runtime: { node: process.version, platform: process.platform, architecture: process.arch },
  packageLockSHA256: sha256(readFileSync(join(root, 'package-lock.json'), 'utf8')),
  gitRepositoryPresent: existsSync(join(root, '.git')),
  build: buildInventory(),
  source: sourceInventory(),
  dependencies: licenses(),
};
writeFileSync(join(evidence, 'inventory.json'), JSON.stringify(report, null, 2) + '\n');
process.stdout.write(
  `Phase 0 inventory written: ${report.build.nextDynamicRouteCount} dynamic Next routes; Vercel count unverified.\n`,
);
