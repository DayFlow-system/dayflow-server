#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const envPath = join(rootDir, '.env');
const envExamplePath = join(rootDir, '.env.example');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(command, args) {
  console.log(`\n> ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: false,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function ensureEnvFile() {
  if (existsSync(envPath)) {
    console.log('✓ .env already exists');
    return;
  }

  copyFileSync(envExamplePath, envPath);
  console.log('✓ Created .env from .env.example');
}

function ensurePrismaDirectory() {
  mkdirSync(join(rootDir, 'prisma'), { recursive: true });
}

console.log('Dayflow local setup');
ensurePrismaDirectory();
ensureEnvFile();

run(npmCommand, ['install']);
run(npmCommand, ['run', 'prisma:generate']);
run(npmCommand, ['run', 'prisma:migrate', '--', '--name', 'init']);

console.log('\n✅ Setup complete. Start the API with: npm run dev');
console.log('✅ Health check: http://localhost:3000/health');
