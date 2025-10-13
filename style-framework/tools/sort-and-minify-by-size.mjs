#!/usr/bin/env node
// tools/sort-and-minify-by-size.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

// ---- your transform logic ---------------------------------------------------
function transform(css) {
  // TODO: replace with your existing sort/minify implementation
  return css;
}

// ---- CLI entry --------------------------------------------------------------
async function main() {
  const argv  = process.argv.slice(2);
  const file  = argv[0];
  const write = argv.includes('--write') || argv.includes('--apply');
  const debug = argv.includes('--debug');

  if (!file) {
    console.error('Usage: node tools/sort-and-minify-by-size.mjs <file> [--write|--apply] [--debug]');
    process.exit(1);
  }

  const abs = path.resolve(file);

  if (debug) {
    console.error('[debug] argv =', process.argv);
    console.error('[debug] cwd  =', process.cwd());
    console.error('[debug] file =', file, '→', abs);
  }

  let css;
  try {
    css = await fs.readFile(abs, 'utf8');
  } catch (err) {
    console.error(`[error] Failed to read "${abs}": ${err.message}`);
    process.exit(1);
  }

  const out = transform(css);

  try {
    if (write) {
      await fs.writeFile(abs, out, 'utf8');
      console.error(`[ok] Wrote ${abs}`);
    } else {
      process.stdout.write(out);
    }
  }
