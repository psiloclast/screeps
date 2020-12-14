import {
  State,
  atTarget,
  build,
  closestTarget,
  harvest,
  isEmpty,
  isFull,
  moveTo,
  noTargetAvailable,
  positionTarget,
  repair,
  specificTarget,
  state,
  targetAvailable,
  transfer,
  transition,
  upgrade,
  withdraw,
} from "state";

type CreepRole =
  | "builder"
  | "courier"
  | "extension-filler"
  | "harvester"
  | "drop-harvester"
  | "repairer"
  | "upgrader";

interface CreepDefinition {
  role: CreepRole;
  body: BodyPartConstant[];
  states: State[];
  memory: CreepMemory;
}

interface Config {
  creeps: {
    [name: string]: CreepDefinition;
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
    role: "builder",
    body: [WORK, CARRY, MOVE],
    states: [
      state(build(closestTarget(FIND_CONSTRUCTION_SITES)), [
        transition(2, noTargetAvailable(FIND_CONSTRUCTION_SITES)),
        transition(1, isEmpty()),
      ]),
      state(
        withdraw(
          closestTarget(FIND_STRUCTURES, {
            structureType: STRUCTURE_CONTAINER,
            filter: "hasEnergy",
          }),
          RESOURCE_ENERGY,
        ),
        [transition(0, isFull())],
      ),
      state(moveTo(positionTarget(37, 40)), [
        transition(0, targetAvailable(FIND_CONSTRUCTION_SITES)),
      ]),
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
        moveTo(
          specificTarget("5fd4f1221908a302197a6000" as Id<StructureContainer>),
        ),
        [transition(1, atTarget())],
      ),
      state(harvest(closestTarget(FIND_SOURCES))),
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
        moveTo(
          specificTarget("5fd52c2de985fa737e8d34bb" as Id<StructureContainer>),
        ),
        [transition(1, atTarget())],
      ),
      state(harvest(closestTarget(FIND_SOURCES))),
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
          specificTarget("5fd4ccce3e2158930bcbc0d7" as Id<StructureSpawn>),
        ),
        [transition(1, isEmpty())],
      ),
      state(
        withdraw(
          closestTarget(FIND_STRUCTURES, {
            structureType: STRUCTURE_CONTAINER,
            filter: "hasEnergy",
          }),
          RESOURCE_ENERGY,
        ),
        [transition(0, isFull())],
      ),
    ],
    memory: {
      currentStateId: 0,
    },
  },
  ...duplicate(4, {
    role: "upgrader",
    body: [WORK, CARRY, MOVE],
    states: [
      state(upgrade(), [transition(1, isEmpty())]),
      state(
        withdraw(
          closestTarget(FIND_STRUCTURES, {
            structureType: STRUCTURE_CONTAINER,
            filter: "hasEnergy",
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
    body: [WORK, CARRY, MOVE],
    states: [
      state(
        transfer(
          closestTarget(FIND_MY_STRUCTURES, {
            filter: "lowEnergy",
            structureType: STRUCTURE_EXTENSION,
          }),
        ),
        [
          transition(
            2,
            noTargetAvailable(FIND_MY_STRUCTURES, {
              filter: "lowEnergy",
              structureType: STRUCTURE_EXTENSION,
            }),
          ),
          transition(1, isEmpty()),
        ],
      ),
      state(
        withdraw(
          specificTarget("5fd4ccce3e2158930bcbc0d7" as Id<StructureSpawn>),
          RESOURCE_ENERGY,
        ),
        [transition(0, isFull())],
      ),
      state(moveTo(positionTarget(37, 36)), [
        transition(
          0,
          targetAvailable(FIND_MY_STRUCTURES, {
            filter: "lowEnergy",
            structureType: STRUCTURE_EXTENSION,
          }),
        ),
      ]),
    ],
    memory: {
      currentStateId: 0,
    },
  },
  ...duplicate(2, {
    role: "repairer",
    body: [WORK, CARRY, MOVE],
    states: [
      state(repair(closestTarget(FIND_STRUCTURES, { filter: "lowHits" })), [
        transition(
          2,
          noTargetAvailable(FIND_STRUCTURES, { filter: "lowHits" }),
        ),
        transition(1, isEmpty()),
      ]),
      state(
        withdraw(
          closestTarget(FIND_STRUCTURES, {
            structureType: STRUCTURE_CONTAINER,
            filter: "hasEnergy",
          }),
          RESOURCE_ENERGY,
        ),
        [transition(0, isFull())],
      ),
      state(moveTo(positionTarget(40, 35)), [
        transition(0, targetAvailable(FIND_STRUCTURES, { filter: "lowHits" })),
      ]),
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
};

export default config;
