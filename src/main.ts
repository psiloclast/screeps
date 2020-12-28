import "core-js/features/array/flat-map";

import {
  cleanMemoryOfDeadCreeps,
  flushCreepCachedTarget,
  getCreepCachedTarget,
  getCreepState,
  setCreepCachedTarget,
  setCreepState,
} from "memory";

import { ErrorMapper } from "utils/ErrorMapper";
import { StateId } from "state/events";
import { checkEvents } from "eventCheckers";
import config from "config";
import { runAction } from "actionRunners";
import { runTowerAction } from "towerRunner";

const newState = (newStateId?: StateId): newStateId is StateId =>
  newStateId !== undefined;

const runCreep = (creep: Creep) => {
  if (!(creep.name in config.creeps)) {
    console.log(`killing ${creep.name} as they are not in config`);
    creep.suicide();
    return;
  }
  const transitions = getCreepState(creep).transitions;
  const newStateId = checkEvents(transitions, creep);
  if (newState(newStateId)) {
    setCreepState(creep, newStateId);
    flushCreepCachedTarget(creep);
  }
  const action = getCreepState(creep).action;
  const { target } = runAction(action)(creep);
  const [cachedTarget] = getCreepCachedTarget(creep);
  if (
    target !== null &&
    cachedTarget === undefined &&
    !(target instanceof Flag)
  ) {
    setCreepCachedTarget(creep, target);
  }
};

// Reversed because last creep definition is spawned
const configCreeps = Object.entries(config.creeps).reverse();

const replaceDeadCreeps = () =>
  configCreeps.forEach(([name, { body, memory }]) => {
    if (!(name in Game.creeps)) {
      Game.spawns.Spawn1.spawnCreep(body, name, { memory });
    }
  });

const runTower = (tower: StructureTower) => {
  const towerAction = config.towers[tower.id]?.action;
  if (!towerAction) {
    return;
  }
  runTowerAction(towerAction)(tower);
};

const getRoomTowers = (room: Room): StructureTower[] =>
  room.find(FIND_STRUCTURES, {
    filter: structure => structure.structureType === STRUCTURE_TOWER,
  }) as StructureTower[];

export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);
  cleanMemoryOfDeadCreeps();
  replaceDeadCreeps();
  Object.values(Game.creeps).forEach(runCreep);
  Object.values(Game.rooms)
    .filter(room => room.controller?.my)
    .flatMap(getRoomTowers)
    .forEach(runTower);
});
