import {
  Action,
  BuildAction,
  Event,
  HarvestAction,
  IdleAction,
  NoTargetAvailable,
  RepairAction,
  State,
  TargetAvailable,
  TargetDescription,
  TransferAction,
  UpgradeAction,
  build,
  closestTarget,
  harvest,
  idle,
  isEmpty,
  isFull,
  noTargetAvailable,
  repair,
  specificTarget,
  state,
  targetAvailable,
  transfer,
  transition,
  upgrade,
} from "./state";

import { ErrorMapper } from "utils/ErrorMapper";

const getCreepState = (creep: Creep): State =>
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  config.creeps[creep.name].states[creep.memory.currentStateId];

const setCreepState = (creep: Creep, stateId: number) => {
  creep.memory.currentStateId = stateId;
};

const getTarget = (target: TargetDescription, creep: Creep) => {
  switch (target.type) {
    case "closest": {
      let opts;
      if (target.filter === "lowHits") {
        opts = { filter: (t: Structure) => t.hits / t.hitsMax < 1.0 };
      }
      return creep.pos.findClosestByPath(target.find, opts);
    }
    case "specific":
      return Game.getObjectById(target.targetId);
  }
};

const runBuild = (action: BuildAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep) as ConstructionSite;
  if (creep.build(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
    return;
  }
};

const runHarvest = (action: HarvestAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep) as Source;
  if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: "#ffaa00" } });
  }
};

const runIdle = (action: IdleAction) => (creep: Creep) => {
  creep.moveTo(action.position.x, action.position.y, {
    visualizePathStyle: { stroke: "#ffffff" },
  });
};

const runRepair = (action: RepairAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep) as Structure;
  if (creep.repair(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
  }
};

const runTransfer = (action: TransferAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep) as Structure;
  if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {
      visualizePathStyle: { stroke: "#ffffff" },
    });
  }
};

const runUpgrade = (action: UpgradeAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep) as StructureController;
  if (creep.upgradeController(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {
      visualizePathStyle: { stroke: "#ffffff" },
    });
  }
};

type ActionRunner = (creep: Creep) => void;

const runAction = (action: Action): ActionRunner => {
  switch (action.type) {
    case "build":
      return runBuild(action);
    case "harvest":
      return runHarvest(action);
    case "idle":
      return runIdle(action);
    case "repair":
      return runRepair(action);
    case "transfer":
      return runTransfer(action);
    case "upgrade":
      return runUpgrade(action);
  }
};

const checkIsEmpty = (creep: Creep): boolean =>
  creep.store[RESOURCE_ENERGY] === 0;

const checkIsFull = (creep: Creep): boolean =>
  creep.store.getFreeCapacity("energy") === 0;

const checkTargetAvailable = (event: TargetAvailable) => (
  creep: Creep,
): boolean => {
  const target = closestTarget(event.find, event.filter);
  return getTarget(target, creep) !== null;
};

const checkNoTargetAvailable = (event: NoTargetAvailable) => (
  creep: Creep,
): boolean => {
  const target = closestTarget(event.find, event.filter);
  return getTarget(target, creep) === null;
};

type EventChecker = (creep: Creep) => boolean;

const checkEvent = (event: Event): EventChecker => {
  switch (event.type) {
    case "isEmpty":
      return checkIsEmpty;
    case "isFull":
      return checkIsFull;
    case "targetAvailable": {
      return checkTargetAvailable(event);
    }
    case "noTargetAvailable":
      return checkNoTargetAvailable(event);
  }
};

const checkEvents = (creep: Creep) => {
  const eventRan = getCreepState(creep).transitions.find(t =>
    checkEvent(t.event)(creep),
  );
  return eventRan && eventRan.stateId;
};

const runCreep = (creep: Creep) => {
  const newStateId = checkEvents(creep);
  if (newStateId !== undefined) {
    setCreepState(creep, newStateId);
  }
  const action = getCreepState(creep).action;
  runAction(action)(creep);
};

interface CreepData {
  body: BodyPartConstant[];
  states: State[];
  memory: {
    currentStateId: number;
  };
}

interface Config {
  creeps: {
    [name: string]: CreepData;
  };
}

const config: Config = {
  creeps: {
    "builder-1": {
      body: [WORK, CARRY, MOVE],
      states: [
        state(idle({ x: 19, y: 4 }), [
          transition(2, targetAvailable(FIND_CONSTRUCTION_SITES)),
        ]),
        state(harvest(specificTarget("5bbcafb59099fc012e63b0cd")), [
          transition(2, isFull()),
        ]),
        state(build(closestTarget(FIND_CONSTRUCTION_SITES)), [
          transition(1, isEmpty()),
          transition(0, noTargetAvailable(FIND_CONSTRUCTION_SITES)),
        ]),
      ],
      memory: {
        currentStateId: 0,
      },
    },
    "builder-2": {
      body: [WORK, CARRY, MOVE],
      states: [
        state(idle({ x: 19, y: 3 }), [
          transition(2, targetAvailable(FIND_CONSTRUCTION_SITES)),
        ]),
        state(harvest(specificTarget("5bbcafb59099fc012e63b0cd")), [
          transition(2, isFull()),
        ]),
        state(build(closestTarget(FIND_CONSTRUCTION_SITES)), [
          transition(1, isEmpty()),
          transition(0, noTargetAvailable(FIND_CONSTRUCTION_SITES)),
        ]),
      ],
      memory: {
        currentStateId: 0,
      },
    },
    "repairer-1": {
      body: [WORK, CARRY, MOVE],
      states: [
        state(idle({ x: 20, y: 2 }), [
          transition(2, targetAvailable(FIND_STRUCTURES, "lowHits")),
        ]),
        state(harvest(specificTarget("5bbcafb59099fc012e63b0cd")), [
          transition(2, isFull()),
        ]),
        state(repair(closestTarget(FIND_STRUCTURES, "lowHits")), [
          transition(1, isEmpty()),
          transition(0, noTargetAvailable(FIND_STRUCTURES, "lowHits")),
        ]),
      ],
      memory: {
        currentStateId: 0,
      },
    },
    "upgrader-1": {
      body: [WORK, CARRY, MOVE],
      states: [
        state(harvest(specificTarget("5bbcafb59099fc012e63b0cb")), [
          transition(1, isFull()),
        ]),
        state(upgrade(specificTarget("5bbcafb59099fc012e63b0cc")), [
          transition(0, isEmpty()),
        ]),
      ],
      memory: {
        currentStateId: 0,
      },
    },
    "upgrader-2": {
      body: [WORK, CARRY, MOVE],
      states: [
        state(harvest(specificTarget("5bbcafb59099fc012e63b0cb")), [
          transition(1, isFull()),
        ]),
        state(upgrade(specificTarget("5bbcafb59099fc012e63b0cc")), [
          transition(0, isEmpty()),
        ]),
      ],
      memory: {
        currentStateId: 0,
      },
    },
    "upgrader-3": {
      body: [WORK, CARRY, MOVE],
      states: [
        state(harvest(specificTarget("5bbcafb59099fc012e63b0cb")), [
          transition(1, isFull()),
        ]),
        state(upgrade(specificTarget("5bbcafb59099fc012e63b0cc")), [
          transition(0, isEmpty()),
        ]),
      ],
      memory: {
        currentStateId: 0,
      },
    },
    "upgrader-4": {
      body: [WORK, CARRY, MOVE],
      states: [
        state(harvest(specificTarget("5bbcafb59099fc012e63b0cb")), [
          transition(1, isFull()),
        ]),
        state(upgrade(specificTarget("5bbcafb59099fc012e63b0cc")), [
          transition(0, isEmpty()),
        ]),
      ],
      memory: {
        currentStateId: 0,
      },
    },
    "upgrader-5": {
      body: [WORK, CARRY, MOVE],
      states: [
        state(harvest(specificTarget("5bbcafb59099fc012e63b0cb")), [
          transition(1, isFull()),
        ]),
        state(upgrade(specificTarget("5bbcafb59099fc012e63b0cc")), [
          transition(0, isEmpty()),
        ]),
      ],
      memory: {
        currentStateId: 0,
      },
    },
    "harvester-1": {
      body: [WORK, CARRY, MOVE],
      states: [
        state(harvest(specificTarget("5bbcafb59099fc012e63b0cd")), [
          transition(1, isFull()),
        ]),
        state(transfer(specificTarget("5fcafdd6b3e4dc245e7b5064")), [
          transition(0, isEmpty()),
        ]),
      ],
      memory: {
        currentStateId: 0,
      },
    },
    "harvester-2": {
      body: [WORK, CARRY, MOVE],
      states: [
        state(harvest(specificTarget("5bbcafb59099fc012e63b0cd")), [
          transition(1, isFull()),
        ]),
        state(transfer(specificTarget("5fcafdd6b3e4dc245e7b5064")), [
          transition(0, isEmpty()),
        ]),
      ],
      memory: {
        currentStateId: 0,
      },
    },
  },
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
