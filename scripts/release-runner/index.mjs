#!/usr/bin/env node

const args = process.argv.slice(2);

if (args.length === 0) {
  const { startServer } = await import('./server/http.mjs');
  await startServer();
} else {
  const { runCli } = await import('./cli.mjs');
  const code = await runCli(args);
  process.exitCode = code;
}
