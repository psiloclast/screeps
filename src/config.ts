import { State, state } from "state";
import {
  StateId,
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
import { mapByKey } from "utils/utils";

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
  states: Record<StateId, State>;
  memory: CreepMemory;
}

interface TowerDefinition {
  action: TowerAction;
}

interface Config {
  creeps: Record<string, CreepDefinition>;
  towers: Record<string, TowerDefinition>;
}

const duplicate = (times: number, data: CreepDefinition): CreepDefinition[] =>
  Array.from({ length: times }).map(() => data);

const statesToMap = (states: State[]): Record<StateId, State> =>
  mapByKey(states, s => s.action.type);

const defineCreeps = (definitions: CreepDefinition[]): Config["creeps"] => {
  return mapByKey(definitions, d => d.role);
};

const config: Config = {
  creeps: defineCreeps([
    {
      role: "drop-harvester",
      body: [WORK, WORK, WORK, WORK, WORK, MOVE],
      states: statesToMap([
        state(
          moveTo(object("5fd4f1221908a302197a6000" as Id<StructureContainer>)),
          [transition("harvest-0", atTarget())],
        ),
        state(harvest(closest(FIND_SOURCES))),
      ]),
      memory: {
        currentStateId: "moveTo-0",
      },
    },
    {
      role: "drop-harvester",
      body: [WORK, WORK, WORK, WORK, WORK, MOVE],
      states: statesToMap([
        state(
          moveTo(object("5fd52c2de985fa737e8d34bb" as Id<StructureContainer>)),
          [transition("harvest-0", atTarget())],
        ),
        state(harvest(closest(FIND_SOURCES))),
      ]),
      memory: {
        currentStateId: "moveTo-0",
      },
    },
    {
      role: "courier",
      body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
      states: statesToMap([
        state(
          transfer(
            object("5fd4ccce3e2158930bcbc0d7" as Id<StructureSpawn>),
            RESOURCE_ENERGY,
          ),
          [transition("withdraw-0", isEmpty())],
        ),
        state(
          withdraw(
            object("5fd836db31977180cbf79bb4" as Id<StructureStorage>),
            RESOURCE_ENERGY,
          ),
          [transition("transfer-0", isFull())],
        ),
      ]),
      memory: {
        currentStateId: "transfer-0",
      },
    },
    {
      role: "courier",
      body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
      states: statesToMap([
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
          [transition("withdraw-0", isEmpty())],
        ),
        state(
          withdraw(
            object("5fd836db31977180cbf79bb4" as Id<StructureStorage>),
            RESOURCE_ENERGY,
          ),
          [transition("transfer-0", isFull())],
        ),
      ]),
      memory: {
        currentStateId: "transfer-0",
      },
    },
    ...duplicate(2, {
      role: "upgrader",
      body: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],
      states: statesToMap([
        state(upgrade(), [transition("withdraw-0", isEmpty())]),
        state(
          withdraw(
            closest(FIND_STRUCTURES, {
              filters: [valueEqual("structureType", STRUCTURE_CONTAINER)],
            }),
            RESOURCE_ENERGY,
          ),
          [transition("upgrade-0", isFull())],
        ),
      ]),
      memory: {
        currentStateId: "upgrade-0",
      },
    }),
    {
      role: "extension-filler",
      body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
      states: statesToMap([
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
              "moveTo-0",
              noTargetAvailable(FIND_MY_STRUCTURES, {
                filters: [
                  valueEqual("structureType", STRUCTURE_EXTENSION),
                  withinBounds("energy", { max: 0.99 }),
                ],
              }),
            ),
            transition("withdraw-0", isEmpty()),
          ],
        ),
        state(
          withdraw(
            object("5fd836db31977180cbf79bb4" as Id<StructureStorage>),
            RESOURCE_ENERGY,
          ),
          [transition("transfer-0", isFull())],
        ),
        state(moveTo(position(36, 36)), [
          transition(
            "transfer-0",
            targetAvailable(FIND_MY_STRUCTURES, {
              filters: [
                valueEqual("structureType", STRUCTURE_EXTENSION),
                withinBounds("energy", { max: 0.99 }),
              ],
            }),
          ),
        ]),
      ]),
      memory: {
        currentStateId: "transfer-0",
      },
    },
    ...duplicate(5, {
      role: "repairer",
      body: [WORK, CARRY, MOVE],
      states: statesToMap([
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
              "moveTo-0",
              noTargetAvailable(FIND_STRUCTURES, {
                filters: [
                  withinBounds("hits", { max: 10000000, isPercent: false }),
                  withinBounds("hits", { max: 0.99 }),
                ],
              }),
            ),
            transition("withdraw-0", isEmpty()),
          ],
        ),
        state(
          withdraw(
            object("5fd836db31977180cbf79bb4" as Id<StructureStorage>),
            RESOURCE_ENERGY,
          ),
          [transition("repair-0", isFull())],
        ),
        state(moveTo(position(31, 38)), [
          transition(
            "repair-0",
            targetAvailable(FIND_STRUCTURES, {
              filters: [
                withinBounds("hits", { max: 10000000, isPercent: false }),
                withinBounds("hits", { max: 0.99 }),
              ],
            }),
          ),
        ]),
      ]),
      memory: {
        currentStateId: "repair-0",
      },
    }),
    {
      role: "builder",
      body: [WORK, CARRY, MOVE],
      states: statesToMap([
        state(build(closest(FIND_CONSTRUCTION_SITES)), [
          transition("moveTo-0", noTargetAvailable(FIND_CONSTRUCTION_SITES)),
          transition("withdraw-0", isEmpty()),
        ]),
        state(
          withdraw(
            object("5fd836db31977180cbf79bb4" as Id<StructureStorage>),
            RESOURCE_ENERGY,
          ),
          [transition("build-0", isFull())],
        ),
        state(moveTo(position(37, 40)), [
          transition("build-0", targetAvailable(FIND_CONSTRUCTION_SITES)),
        ]),
      ]),
      memory: {
        currentStateId: "build-0",
      },
    },
    {
      role: "janitor",
      body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
      states: statesToMap([
        state(
          transfer(
            object("5fd836db31977180cbf79bb4" as Id<StructureStorage>),
            RESOURCE_ENERGY,
          ),
          [transition("pickup-0", isEmpty())],
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
            transition(
              "moveTo-0",
              noTargetAvailable(FIND_DROPPED_RESOURCES, {
                filters: [
                  withinBounds("amount", {
                    min: 200,
                    max: 99999999999999,
                    isPercent: false,
                  }),
                ],
              }),
            ),
            transition("transfer-0", isFull()),
          ],
        ),
        state(moveTo(position(37, 32)), [
          transition(
            "pickup-0",
            targetAvailable(FIND_DROPPED_RESOURCES, {
              filters: [
                withinBounds("amount", {
                  min: 200,
                  max: 99999999999999,
                  isPercent: false,
                }),
              ],
            }),
          ),
        ]),
      ]),
      memory: {
        currentStateId: "transfer-0",
      },
    },
    ...duplicate(20, {
      role: "soldier",
      body: [TOUGH, MOVE],
      states: statesToMap([
        state(moveTo(room("W5N59")), [transition("moveTo-1", inRoom("W5N59"))]),
        state(moveTo(object("5fd53eb56727cc173042dc30" as Id<StructureSpawn>))),
      ]),
      memory: {
        currentStateId: "moveTo-0",
      },
    }),
  ]),
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
