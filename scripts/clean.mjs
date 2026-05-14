#!/usr/bin/env node
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));

const profiles = {
  build: {
    description: 'compiled/cache files only; keeps dependencies, .env, and local databases',
    paths: ['dist', 'coverage', '.turbo', '.cache', 'tsconfig.tsbuildinfo'],
  },
  full: {
    description:
      'everything reproducible; keeps source code but removes dependencies, generated output, .env, and local databases',
    paths: [
      'dist',
      'coverage',
      '.turbo',
      '.cache',
      'tsconfig.tsbuildinfo',
      'node_modules',
      '.env',
      'dev.db',
      'dev.db-journal',
      'prisma/dev.db',
      'prisma/dev.db-journal',
      'prisma/test.db',
      'prisma/test.db-journal',
    ],
  },
};

const profileName = process.argv[2] ?? 'build';
const profile = profiles[profileName];

if (!profile) {
  console.error(`Unknown clean profile: ${profileName}`);
  console.error(`Available profiles: ${Object.keys(profiles).join(', ')}`);
  process.exit(1);
}

console.log(`Cleaning profile: ${profileName}`);
console.log(profile.description);

for (const relativePath of profile.paths) {
  const absolutePath = join(rootDir, relativePath);
  if (!existsSync(absolutePath)) {
    console.log(`- skip ${relativePath}`);
    continue;
  }

  rmSync(absolutePath, { recursive: true, force: true });
  console.log(`- removed ${relativePath}`);
}

console.log('Clean complete.');
