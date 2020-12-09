import { ErrorMapper } from "utils/ErrorMapper";
import { State } from "state";
import { checkEvents } from "eventCheckers";
import config from "config";
import { runAction } from "actionRunners";

const getCreepState = (creep: Creep): State =>
  config.creeps[creep.name].states[creep.memory.currentStateId];

const setCreepState = (creep: Creep, stateId: number) => {
  creep.memory.currentStateId = stateId;
};

const runCreep = (creep: Creep) => {
  const transitions = getCreepState(creep).transitions;
  const newStateId = checkEvents(transitions, creep);
  if (newStateId !== undefined) {
    setCreepState(creep, newStateId);
  }
  const action = getCreepState(creep).action;
  runAction(action)(creep);
};

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  // Replace missing creeps
  Object.entries(config.creeps).forEach(([name, { body, memory }]) => {
    if (!(name in Game.creeps)) {
      Game.spawns.Spawn1.spawnCreep(body, name, { memory });
    }
  });

  Object.values(Game.creeps).forEach(runCreep);
});
