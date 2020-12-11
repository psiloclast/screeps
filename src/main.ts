import {
  deleteMissingCreeps,
  flushCreepCachedTarget,
  getCreepState,
  setCreepCachedTarget,
  setCreepState,
} from "memory";

import { ErrorMapper } from "utils/ErrorMapper";
import { checkEvents } from "eventCheckers";
import config from "config";
import { runAction } from "actionRunners";

const newState = (newStateId?: number): newStateId is number =>
  newStateId !== undefined;

const runCreep = (creep: Creep) => {
  const transitions = getCreepState(creep).transitions;
  const newStateId = checkEvents(transitions, creep);
  if (newState(newStateId)) {
    setCreepState(creep, newStateId);
    flushCreepCachedTarget(creep);
  }
  const action = getCreepState(creep).action;
  const result = runAction(action)(creep);
  if (newState(newStateId) && result?.target) {
    setCreepCachedTarget(creep, result.target);
  }
};

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  deleteMissingCreeps();

  // Replace missing creeps
  Object.entries(config.creeps).forEach(([name, { body, memory }]) => {
    if (!(name in Game.creeps)) {
      Game.spawns.Spawn1.spawnCreep(body, name, { memory });
    }
  });

  Object.values(Game.creeps).forEach(runCreep);
});
