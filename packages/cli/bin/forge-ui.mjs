#!/usr/bin/env node
import { run } from '../src/index.mjs';

run(process.argv.slice(2)).catch((err) => {
  console.error(`\x1b[31m✖\x1b[0m ${err?.message || err}`);
  process.exit(1);
});
