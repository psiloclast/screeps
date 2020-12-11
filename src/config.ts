import {
  State,
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
  withdraw,
} from "state";

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
        state(idle({ x: 19, y: 5 }), [
          transition(2, targetAvailable(FIND_CONSTRUCTION_SITES)),
        ]),
        state(
          harvest(specificTarget("5bbcafb59099fc012e63b0cd" as Id<Source>)),
          [transition(2, isFull())],
        ),
        state(build(closestTarget(FIND_CONSTRUCTION_SITES)), [
          transition(0, noTargetAvailable(FIND_CONSTRUCTION_SITES)),
          transition(1, isEmpty()),
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
        state(
          withdraw(
            specificTarget(
              "5fce79649be5248b2912b1d5" as Id<StructureExtension>,
            ),
            RESOURCE_ENERGY,
          ),
          [transition(2, isFull())],
        ),
        state(build(closestTarget(FIND_CONSTRUCTION_SITES)), [
          transition(0, noTargetAvailable(FIND_CONSTRUCTION_SITES)),
          transition(1, isEmpty()),
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
          transition(
            2,
            targetAvailable(FIND_STRUCTURES, { filter: "lowHits" }),
          ),
        ]),
        state(
          harvest(specificTarget("5bbcafb59099fc012e63b0cd" as Id<Source>)),
          [transition(2, isFull())],
        ),
        state(repair(closestTarget(FIND_STRUCTURES, { filter: "lowHits" })), [
          transition(
            0,
            noTargetAvailable(FIND_STRUCTURES, { filter: "lowHits" }),
          ),
          transition(1, isEmpty()),
        ]),
      ],
      memory: {
        currentStateId: 0,
      },
    },
    "upgrader-1": {
      body: [WORK, CARRY, MOVE],
      states: [
        state(
          harvest(specificTarget("5bbcafb59099fc012e63b0cb" as Id<Source>)),
          [transition(1, isFull())],
        ),
        state(
          upgrade(
            specificTarget(
              "5bbcafb59099fc012e63b0cc" as Id<StructureController>,
            ),
          ),
          [transition(0, isEmpty())],
        ),
      ],
      memory: {
        currentStateId: 0,
      },
    },
    "upgrader-2": {
      body: [WORK, CARRY, MOVE],
      states: [
        state(
          harvest(specificTarget("5bbcafb59099fc012e63b0cb" as Id<Source>)),
          [transition(1, isFull())],
        ),
        state(
          upgrade(
            specificTarget(
              "5bbcafb59099fc012e63b0cc" as Id<StructureController>,
            ),
          ),
          [transition(0, isEmpty())],
        ),
      ],
      memory: {
        currentStateId: 0,
      },
    },
    "upgrader-3": {
      body: [WORK, CARRY, MOVE],
      states: [
        state(
          harvest(specificTarget("5bbcafb59099fc012e63b0cb" as Id<Source>)),
          [transition(1, isFull())],
        ),
        state(
          upgrade(
            specificTarget(
              "5bbcafb59099fc012e63b0cc" as Id<StructureController>,
            ),
          ),
          [transition(0, isEmpty())],
        ),
      ],
      memory: {
        currentStateId: 0,
      },
    },
    "upgrader-4": {
      body: [WORK, CARRY, MOVE],
      states: [
        state(
          harvest(specificTarget("5bbcafb59099fc012e63b0cb" as Id<Source>)),
          [transition(1, isFull())],
        ),
        state(
          upgrade(
            specificTarget(
              "5bbcafb59099fc012e63b0cc" as Id<StructureController>,
            ),
          ),
          [transition(0, isEmpty())],
        ),
      ],
      memory: {
        currentStateId: 0,
      },
    },
    "upgrader-5": {
      body: [WORK, CARRY, MOVE],
      states: [
        state(
          harvest(specificTarget("5bbcafb59099fc012e63b0cb" as Id<Source>)),
          [transition(1, isFull())],
        ),
        state(
          upgrade(
            specificTarget(
              "5bbcafb59099fc012e63b0cc" as Id<StructureController>,
            ),
          ),
          [transition(0, isEmpty())],
        ),
      ],
      memory: {
        currentStateId: 0,
      },
    },
    "extension-filler-1": {
      body: [WORK, CARRY, MOVE],
      states: [
        state(idle({ x: 21, y: 1 }), [
          transition(
            2,
            targetAvailable(FIND_MY_STRUCTURES, {
              filter: "lowEnergy",
              structureType: STRUCTURE_EXTENSION,
            }),
          ),
        ]),
        state(
          withdraw(
            specificTarget("5fcafdd6b3e4dc245e7b5064" as Id<StructureSpawn>),
            RESOURCE_ENERGY,
          ),
          [transition(2, isFull())],
        ),
        state(
          transfer(
            closestTarget(FIND_MY_STRUCTURES, {
              filter: "lowEnergy",
              structureType: STRUCTURE_EXTENSION,
            }),
          ),
          [
            transition(
              0,
              noTargetAvailable(FIND_MY_STRUCTURES, {
                filter: "lowEnergy",
                structureType: STRUCTURE_EXTENSION,
              }),
            ),
            transition(1, isEmpty()),
          ],
        ),
      ],
      memory: {
        currentStateId: 0,
      },
    },
    "harvester-1": {
      body: [WORK, CARRY, MOVE],
      states: [
        state(
          harvest(specificTarget("5bbcafb59099fc012e63b0cd" as Id<Source>)),
          [transition(1, isFull())],
        ),
        state(
          transfer(
            specificTarget("5fcafdd6b3e4dc245e7b5064" as Id<StructureSpawn>),
          ),
          [transition(0, isEmpty())],
        ),
      ],
      memory: {
        currentStateId: 0,
      },
    },
    "harvester-2": {
      body: [WORK, CARRY, MOVE],
      states: [
        state(
          harvest(specificTarget("5bbcafb59099fc012e63b0cd" as Id<Source>)),
          [transition(1, isFull())],
        ),
        state(
          transfer(
            specificTarget("5fcafdd6b3e4dc245e7b5064" as Id<StructureSpawn>),
          ),
          [transition(0, isEmpty())],
        ),
      ],
      memory: {
        currentStateId: 0,
      },
    },
  },
};

export default config;
