import {
  State,
  build,
  harvest,
  idle,
  isEmpty,
  isFull,
  noTargetAvailable,
  repair,
  state,
  targetAvailable,
  transfer,
  transition,
  upgrade,
} from "state";
import { closestTarget, specificTarget } from "targets";

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

export default config;
