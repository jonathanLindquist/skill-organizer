#!/usr/bin/env node

import { runCli } from "../src/cli.js";

try {
  const exitCode = await runCli(process.argv.slice(2), {
    commandName: "agent-sync",
    env: process.env,
    stdout: process.stdout,
    stderr: process.stderr,
  });

  process.exitCode = exitCode;
} catch (error) {
  process.stderr.write(`agent-sync: ${error.message}\n`);
  process.exitCode = 1;
}
