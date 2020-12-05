import { ErrorMapper } from "utils/ErrorMapper";
import {
  State,
  ActionType,
  EventType,
  state,
  transition,
  harvest,
  transfer,
  upgrade,
  isEmpty,
  isFull
} from "./state";

const getCreepState = (creep: Creep): State =>
  creep.memory.states[creep.memory.currentStateId];

const setCreepState = (creep: Creep, stateId: number) => {
  creep.memory.currentStateId = stateId;
};

const runBuild = (creep: Creep) => {
  const target = Game.getObjectById(
    getCreepState(creep).action.targetId as Id<ConstructionSite>
  )!;
  if (creep.build(target) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: "#ffaa00" } });
  }
};

const runHarvest = (creep: Creep) => {
  const target = Game.getObjectById(
    getCreepState(creep).action.targetId as Id<Source>
  )!;
  if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: "#ffaa00" } });
  }
};

const runTransfer = (creep: Creep) => {
  const target = Game.getObjectById(
    getCreepState(creep).action.targetId as Id<Structure>
  )!;
  if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {
      visualizePathStyle: { stroke: "#ffffff" }
    });
  }
};

const runUpgrade = (creep: Creep) => {
  const target = Game.getObjectById(
    getCreepState(creep).action.targetId as Id<StructureController>
  )!;
  if (creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {
      visualizePathStyle: { stroke: "#ffffff" }
    });
  }
};

type ActionRunner = typeof runHarvest | typeof runTransfer | typeof runUpgrade;

const actionRunners: Record<ActionType, ActionRunner> = {
  build: runBuild,
  harvest: runHarvest,
  transfer: runTransfer,
  upgrade: runUpgrade
};

const runAction = (creep: Creep) => {
  const action = getCreepState(creep).action;
  actionRunners[action.type](creep);
};

type EventChecker = (creep: Creep) => boolean;

const checkIsEmpty = (creep: Creep) => creep.store[RESOURCE_ENERGY] === 0;

const checkIsFull = (creep: Creep) =>
  creep.store.getFreeCapacity("energy") === 0;

const eventCheckers: Record<EventType, EventChecker> = {
  isEmpty: checkIsEmpty,
  isFull: checkIsFull
};

const checkEvents = (creep: Creep) => {
  const eventRan = getCreepState(creep).transitions.find(transition =>
    eventCheckers[transition.event.type](creep)
  );
  return eventRan && eventRan.stateId;
};

const runCreep = (creep: Creep) => {
  runAction(creep);
  const newStateId = checkEvents(creep);
  if (newStateId !== undefined) {
    setCreepState(creep, newStateId);
  }
};

interface CreepData {
  name: string;
  body: BodyPartConstant[];
  memory: {
    currentStateId: number;
    states: State[];
  };
}

interface Config {
  creeps: CreepData[];
}

const config: Config = {
  creeps: [
    {
      name: "upgrader-1",
      body: [WORK, CARRY, MOVE],
      memory: {
        currentStateId: 0,
        states: [
          state(harvest("5bbcafb59099fc012e63b0cb"), [transition(1, isFull())]),
          state(upgrade("5bbcafb59099fc012e63b0cc"), [transition(0, isEmpty())])
        ]
      }
    },
    {
      name: "upgrader-2",
      body: [WORK, CARRY, MOVE],
      memory: {
        currentStateId: 0,
        states: [
          state(harvest("5bbcafb59099fc012e63b0cb"), [transition(1, isFull())]),
          state(upgrade("5bbcafb59099fc012e63b0cc"), [transition(0, isEmpty())])
        ]
      }
    },
    {
      name: "upgrader-3",
      body: [WORK, CARRY, MOVE],
      memory: {
        currentStateId: 0,
        states: [
          state(harvest("5bbcafb59099fc012e63b0cb"), [transition(1, isFull())]),
          state(upgrade("5bbcafb59099fc012e63b0cc"), [transition(0, isEmpty())])
        ]
      }
    },
    {
      name: "upgrader-4",
      body: [WORK, CARRY, MOVE],
      memory: {
        currentStateId: 0,
        states: [
          state(harvest("5bbcafb59099fc012e63b0cb"), [transition(1, isFull())]),
          state(upgrade("5bbcafb59099fc012e63b0cc"), [transition(0, isEmpty())])
        ]
      }
    },
    {
      name: "upgrader-5",
      body: [WORK, CARRY, MOVE],
      memory: {
        currentStateId: 0,
        states: [
          state(harvest("5bbcafb59099fc012e63b0cb"), [transition(1, isFull())]),
          state(upgrade("5bbcafb59099fc012e63b0cc"), [transition(0, isEmpty())])
        ]
      }
    },
    {
      name: "harvester-1",
      body: [WORK, CARRY, MOVE],
      memory: {
        currentStateId: 0,
        states: [
          state(harvest("5bbcafb59099fc012e63b0cd"), [transition(1, isFull())]),
          state(transfer("5fcafdd6b3e4dc245e7b5064"), [
            transition(0, isEmpty())
          ])
        ]
      }
    },
    {
      name: "harvester-2",
      body: [WORK, CARRY, MOVE],
      memory: {
        currentStateId: 0,
        states: [
          state(harvest("5bbcafb59099fc012e63b0cd"), [transition(1, isFull())]),
          state(transfer("5fcafdd6b3e4dc245e7b5064"), [
            transition(0, isEmpty())
          ])
        ]
      }
    }
  ]
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
  Object.values(config.creeps).forEach(({ name, body, memory }) => {
    if (!(name in Game.creeps)) {
      Game.spawns["Spawn1"].spawnCreep(body, name, { memory });
    }
  });

  Object.values(Game.creeps).forEach(runCreep);
});
