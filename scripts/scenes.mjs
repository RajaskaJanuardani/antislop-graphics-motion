#!/usr/bin/env node
import { choosePair, makeScenePlan, parseMotionArgs, writeSceneOutputs } from './motion-planning.mjs';

try {
  const options = parseMotionArgs(process.argv.slice(2));
  options.duration ??= 12;
  const selection = choosePair(options);
  const plan = makeScenePlan(options, selection);
  const paths = writeSceneOutputs(options, selection, plan);
  console.log(`[scenes] Generated ${plan.scenes.length} scenes (${plan.selectedStoryboardId}, style #${plan.selectedStyleId}) in ${paths.storyboardPath}`);
} catch (error) {
  console.error(`[scenes] ${error.message}`);
  process.exitCode = 1;
}
