import { State, state } from "state";
import {
  atTarget,
  inRoom,
  isEmpty,
  isFull,
  noTargetAvailable,
  targetAvailable,
  transition,
} from "state/events";
import {
  build,
  harvest,
  idle,
  moveTo,
  pickup,
  repair,
  transfer,
  upgrade,
  withdraw,
} from "state/actions";
import {
  closest,
  object,
  position,
  room,
  valueEqual,
  withinBounds,
} from "state/targets";

import { TowerAction } from "state/towerActions";

type CreepRole =
  | "builder"
  | "courier"
  | "extension-filler"
  | "harvester"
  | "healer"
  | "drop-harvester"
  | "janitor"
  | "repairer"
  | "soldier"
  | "upgrader";

interface CreepDefinition {
  role: CreepRole;
  body: BodyPartConstant[];
  states: State[];
  memory: CreepMemory;
}

interface TowerDefinition {
  action: TowerAction;
}

interface Config {
  creeps: {
    [name: string]: CreepDefinition;
  };
  towers: {
    [id: string]: TowerDefinition;
  };
}

const duplicate = (times: number, data: CreepDefinition): CreepDefinition[] =>
  Array.from({ length: times }).map(() => data);

const defineCreeps = (
  definitions: CreepDefinition[],
): [Config["creeps"], Record<string, number>] => {
  // eslint-disable-next-line no-shadow
  const numOfEachRole: Record<string, number> = {};
  const increaseNumber = (role: CreepRole): number =>
    numOfEachRole[role] ? ++numOfEachRole[role] : (numOfEachRole[role] = 1);
  return [
    definitions.reduce(
      (acc, definition) => ({
        ...acc,
        [`${definition.role}-${increaseNumber(definition.role)}`]: definition,
      }),
      {},
    ),
    numOfEachRole,
  ];
};

const [creeps, numOfEachRole] = defineCreeps([
  {
    role: "drop-harvester",
    body: [WORK, WORK, WORK, WORK, WORK, MOVE],
    states: [
      state(
        moveTo(object("5fd4f1221908a302197a6000" as Id<StructureContainer>)),
        [transition(1, atTarget())],
      ),
      state(harvest(closest(FIND_SOURCES))),
    ],
    memory: {
      currentStateId: 0,
    },
  },
  {
    role: "drop-harvester",
    body: [WORK, WORK, WORK, WORK, WORK, MOVE],
    states: [
      state(
        moveTo(object("5fd52c2de985fa737e8d34bb" as Id<StructureContainer>)),
        [transition(1, atTarget())],
      ),
      state(harvest(closest(FIND_SOURCES))),
    ],
    memory: {
      currentStateId: 0,
    },
  },
  {
    role: "courier",
    body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
    states: [
      state(
        transfer(
          object("5fd4ccce3e2158930bcbc0d7" as Id<StructureSpawn>),
          RESOURCE_ENERGY,
        ),
        [transition(1, isEmpty())],
      ),
      state(
        withdraw(
          object("5fd836db31977180cbf79bb4" as Id<StructureStorage>),
          RESOURCE_ENERGY,
        ),
        [transition(0, isFull())],
      ),
    ],
    memory: {
      currentStateId: 0,
    },
  },
  {
    role: "courier",
    body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
    states: [
      state(
        transfer(
          closest(FIND_STRUCTURES, {
            filters: [
              valueEqual("structureType", STRUCTURE_TOWER),
              withinBounds("energy", { max: 0.99 }),
            ],
          }),
          RESOURCE_ENERGY,
        ),
        [transition(1, isEmpty())],
      ),
      state(
        withdraw(
          object("5fd836db31977180cbf79bb4" as Id<StructureStorage>),
          RESOURCE_ENERGY,
        ),
        [transition(0, isFull())],
      ),
    ],
    memory: {
      currentStateId: 0,
    },
  },
  ...duplicate(2, {
    role: "upgrader",
    body: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],
    states: [
      state(upgrade(), [transition(1, isEmpty())]),
      state(
        withdraw(
          closest(FIND_STRUCTURES, {
            filters: [valueEqual("structureType", STRUCTURE_CONTAINER)],
          }),
          RESOURCE_ENERGY,
        ),
        [transition(0, isFull())],
      ),
    ],
    memory: {
      currentStateId: 0,
    },
  }),
  {
    role: "extension-filler",
    body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
    states: [
      state(
        transfer(
          closest(FIND_MY_STRUCTURES, {
            filters: [
              valueEqual("structureType", STRUCTURE_EXTENSION),
              withinBounds("energy", { max: 0.99 }),
            ],
          }),
          RESOURCE_ENERGY,
        ),
        [
          transition(
            2,
            noTargetAvailable(FIND_MY_STRUCTURES, {
              filters: [
                valueEqual("structureType", STRUCTURE_EXTENSION),
                withinBounds("energy", { max: 0.99 }),
              ],
            }),
          ),
          transition(1, isEmpty()),
        ],
      ),
      state(
        withdraw(
          object("5fd836db31977180cbf79bb4" as Id<StructureStorage>),
          RESOURCE_ENERGY,
        ),
        [transition(0, isFull())],
      ),
      state(moveTo(position(37, 36)), [
        transition(
          0,
          targetAvailable(FIND_MY_STRUCTURES, {
            filters: [
              valueEqual("structureType", STRUCTURE_EXTENSION),
              withinBounds("energy", { max: 0.99 }),
            ],
          }),
        ),
      ]),
    ],
    memory: {
      currentStateId: 0,
    },
  },
  ...duplicate(5, {
    role: "repairer",
    body: [WORK, CARRY, MOVE],
    states: [
      state(
        repair(
          closest(FIND_STRUCTURES, {
            filters: [
              withinBounds("hits", { max: 10000000, isPercent: false }),
              withinBounds("hits", { max: 0.99 }),
            ],
          }),
        ),
        [
          transition(
            2,
            noTargetAvailable(FIND_STRUCTURES, {
              filters: [
                withinBounds("hits", { max: 10000000, isPercent: false }),
                withinBounds("hits", { max: 0.99 }),
              ],
            }),
          ),
          transition(1, isEmpty()),
        ],
      ),
      state(
        withdraw(
          object("5fd836db31977180cbf79bb4" as Id<StructureStorage>),
          RESOURCE_ENERGY,
        ),
        [transition(0, isFull())],
      ),
      state(moveTo(position(31, 38)), [
        transition(
          0,
          targetAvailable(FIND_STRUCTURES, {
            filters: [
              withinBounds("hits", { max: 10000000, isPercent: false }),
              withinBounds("hits", { max: 0.99 }),
            ],
          }),
        ),
      ]),
    ],
    memory: {
      currentStateId: 0,
    },
  }),
  {
    role: "builder",
    body: [WORK, CARRY, MOVE],
    states: [
      state(build(closest(FIND_CONSTRUCTION_SITES)), [
        transition(2, noTargetAvailable(FIND_CONSTRUCTION_SITES)),
        transition(1, isEmpty()),
      ]),
      state(
        withdraw(
          object("5fd836db31977180cbf79bb4" as Id<StructureStorage>),
          RESOURCE_ENERGY,
        ),
        [transition(0, isFull())],
      ),
      state(moveTo(position(37, 40)), [
        transition(0, targetAvailable(FIND_CONSTRUCTION_SITES)),
      ]),
    ],
    memory: {
      currentStateId: 0,
    },
  },
  {
    role: "janitor",
    body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
    states: [
      state(
        transfer(
          object("5fd836db31977180cbf79bb4" as Id<StructureStorage>),
          RESOURCE_ENERGY,
        ),
        [transition(1, isEmpty())],
      ),
      state(
        pickup(
          closest(FIND_DROPPED_RESOURCES, {
            filters: [
              withinBounds("amount", {
                min: 200,
                max: 99999999999999,
                isPercent: false,
              }),
            ],
          }),
        ),
        [
          transition(2, noTargetAvailable(FIND_DROPPED_RESOURCES)),
          transition(0, isFull()),
        ],
      ),
      state(moveTo(position(37, 40)), [
        transition(1, targetAvailable(FIND_DROPPED_RESOURCES)),
      ]),
    ],
    memory: {
      currentStateId: 0,
    },
  },
  ...duplicate(100, {
    role: "soldier",
    body: [TOUGH, MOVE],
    states: [
      state(moveTo(room("W5N59")), [transition(1, inRoom("W5N59"))]),
      state(moveTo(object("5fd53eb56727cc173042dc30" as Id<StructureSpawn>))),
    ],
    memory: {
      currentStateId: 0,
    },
  }),
]);

console.log("====== CONFIG ======");
console.log("Number of each role:");
Object.entries(numOfEachRole).forEach(([role, amount]) => {
  console.log(`  ${role}: ${amount}`);
});
console.log("====================");

const config: Config = {
  creeps,
  towers: {
    "5fd7e5e384a8d49a62d7dd1f": {
      action: "attack",
    },
    "5fdc0872411cff7423070c57": {
      action: "attack",
    },
  },
};

export default config;
