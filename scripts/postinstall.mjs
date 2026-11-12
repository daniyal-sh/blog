import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Some Windows machines block the native Rust binaries that Astro 7 uses for
// its compiler and Markdown pipeline. Both packages ship WebAssembly fallbacks;
// installing them lets the site build and run in those environments.
if (process.platform !== 'win32') {
  process.exit(0);
}

function readVersion(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8')).version;
}

function isInstalled(name) {
  try {
    require.resolve(name);
    return true;
  } catch {
    return false;
  }
}

const packages = [
  {
    name: '@astrojs/compiler-binding-wasm32-wasi',
    version: readVersion('../node_modules/@astrojs/compiler-binding/package.json'),
  },
  {
    name: '@bruits/satteri-wasm32-wasi',
    version: readVersion('../node_modules/satteri/package.json'),
  },
];

const missing = packages.filter((pkg) => !isInstalled(pkg.name));
if (missing.length === 0) {
  process.exit(0);
}

const specs = missing.map((pkg) => `${pkg.name}@${pkg.version}`);

console.log(`Installing WebAssembly fallbacks: ${specs.join(', ')}`);
execSync(
  `npm install --no-save --force --ignore-scripts ${specs.join(' ')}`,
  { stdio: 'inherit' },
);
