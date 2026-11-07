#!/usr/bin/env node
import { choosePair, parseMotionArgs, writeStyleOutputs } from './motion-planning.mjs';

try {
  const options = parseMotionArgs(process.argv.slice(2));
  const selection = choosePair(options);
  console.log(JSON.stringify(writeStyleOutputs(options, selection), null, 2));
} catch (error) {
  console.error(`[draw-style] ${error.message}`);
  process.exitCode = 1;
}
