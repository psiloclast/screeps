import { LinkAction, transferEnergy } from "state/linkActions";
import { State, state } from "state";
import { StateId, atTarget, isEmpty, isFull, transition } from "state/events";
import { TargetDescription, closest, object } from "state/targets";
import { andFilter, orFilter, valueIs } from "state/findFilters";
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

interface LinkDefinition {
  action: LinkAction;
}

interface Config {
  constants: {
    targets: Record<string, TargetDescription<FindConstant, StructureConstant>>;
  };
  creeps: Record<string, CreepDefinition>;
  towers: Record<string, TowerDefinition>;
  links: Record<string, LinkDefinition>;
}

const duplicate = (times: number, data: CreepDefinition): CreepDefinition[] =>
  Array.from({ length: times }).map(() => data);

const statesToMap = (states: State[]): Record<StateId, State> =>
  mapByKey(states, s => s.action.type);

const defineCreeps = (definitions: CreepDefinition[]): Config["creeps"] => {
  return mapByKey(definitions, d => d.role);
};

const config: Config = {
  constants: {
    targets: {
      spawn: closest(FIND_MY_SPAWNS),
      source: closest(FIND_SOURCES),
      "low-energy-structure": closest(FIND_STRUCTURES, {
        filter: andFilter(
          orFilter(
            valueIs("EQ", "structureType", STRUCTURE_SPAWN),
            valueIs("EQ", "structureType", STRUCTURE_TOWER),
          ),
          valueIs("LT", "energy", 1),
        ),
      }),
      "low-hits-structure": closest(FIND_STRUCTURES, {
        filter: andFilter(
          valueIs("LT", "hits", 0.98),
          valueIs("LT", "hits", 1000000, { isPercent: false }),
        ),
      }),
      "low-energy-extension": closest(FIND_STRUCTURES, {
        filter: andFilter(
          valueIs("EQ", "structureType", STRUCTURE_EXTENSION),
          valueIs("LT", "energy", 1),
        ),
      }),
      "high-energy-storage": closest(FIND_STRUCTURES, {
        filter: andFilter(
          orFilter(
            valueIs("EQ", "structureType", STRUCTURE_CONTAINER),
            valueIs("EQ", "structureType", STRUCTURE_STORAGE),
          ),
          valueIs("GT", "energy", 0.1),
        ),
      }),
      "low-energy-storage": closest(FIND_STRUCTURES, {
        filter: andFilter(
          orFilter(
            valueIs("EQ", "structureType", STRUCTURE_CONTAINER),
            valueIs("EQ", "structureType", STRUCTURE_STORAGE),
          ),
          valueIs("LT", "energy", 1),
        ),
      }),
      "dropped-resources": closest(FIND_DROPPED_RESOURCES, {
        filter: valueIs("GT", "amount", 200, { isPercent: false }),
      }),
      "left-container": object("ab8ec675212956a" as Id<StructureContainer>),
      "right-container": object("0c3b694f6836a37" as Id<StructureContainer>),
      "left-link": object("b959be440749e57" as Id<StructureLink>),
      "right-link": object("642dbecf6803b3f" as Id<StructureLink>),
      "central-link": object("bf88be51487a7be" as Id<StructureLink>),
      "upgrader-container": object("db6e69a321d4c0b" as Id<StructureContainer>),
    },
  },
  creeps: defineCreeps([
    // {
    //   role: "builder",
    //   body: [WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
    //   states: statesToMap([
    //     state(build(closest(FIND_CONSTRUCTION_SITES)), [
    //       transition("withdraw-0", isEmpty()),
    //     ]),
    //     state(withdraw("high-energy-storage"), [
    //       transition("build-0", isFull()),
    //     ]),
    //   ]),
    //   memory: {
    //     currentStateId: "build-0",
    //   },
    // },
    {
      role: "drop-harvester",
      body: [WORK, WORK, WORK, WORK, WORK, MOVE],
      states: statesToMap([
        state(moveTo("left-container"), [
          transition("harvest-0", atTarget("left-container")),
        ]),
        state(harvest("source")),
      ]),
      memory: {
        currentStateId: "moveTo-0",
      },
    },
    {
      role: "drop-harvester",
      body: [WORK, WORK, WORK, WORK, WORK, MOVE],
      states: statesToMap([
        state(moveTo("right-container"), [
          transition("harvest-0", atTarget("right-container")),
        ]),
        state(harvest("source")),
      ]),
      memory: {
        currentStateId: "moveTo-0",
      },
    },
    {
      role: "courier",
      body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
      states: statesToMap([
        state(transfer("left-link"), [transition("withdraw-0", isEmpty())]),
        state(withdraw("left-container"), [transition("transfer-0", isFull())]),
      ]),
      memory: {
        currentStateId: "transfer-0",
      },
    },
    {
      role: "courier",
      body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
      states: statesToMap([
        state(transfer("right-link"), [transition("withdraw-0", isEmpty())]),
        state(withdraw("right-container"), [
          transition("transfer-0", isFull()),
        ]),
      ]),
      memory: {
        currentStateId: "transfer-0",
      },
    },
    {
      role: "courier",
      body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
      states: statesToMap([
        state(transfer("low-energy-storage"), [
          transition("withdraw-0", isEmpty()),
        ]),
        state(withdraw("central-link"), [transition("transfer-0", isFull())]),
      ]),
      memory: {
        currentStateId: "transfer-0",
      },
    },
    {
      role: "courier",
      body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
      states: statesToMap([
        state(transfer("low-energy-structure"), [
          transition("withdraw-0", isEmpty()),
        ]),
        state(withdraw("high-energy-storage"), [
          transition("transfer-0", isFull()),
        ]),
      ]),
      memory: {
        currentStateId: "transfer-0",
      },
    },
    {
      role: "courier",
      body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
      states: statesToMap([
        state(transfer("upgrader-container"), [
          transition("withdraw-0", isEmpty()),
        ]),
        state(withdraw("high-energy-storage"), [
          transition("transfer-0", isFull()),
        ]),
      ]),
      memory: {
        currentStateId: "transfer-0",
      },
    },
    {
      role: "upgrader",
      body: [
        WORK,
        WORK,
        WORK,
        WORK,
        WORK,

        WORK,
        WORK,
        WORK,
        WORK,
        WORK,

        WORK,
        WORK,
        WORK,
        WORK,
        WORK,

        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,

        MOVE,
      ],
      states: statesToMap([
        state(upgrade(), [transition("withdraw-0", isEmpty())]),
        state(withdraw("upgrader-container"), [
          transition("upgrade-0", isFull()),
        ]),
      ]),
      memory: {
        currentStateId: "upgrade-0",
      },
    },
    {
      role: "extension-filler",
      body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
      states: statesToMap([
        state(transfer("low-energy-extension"), [
          transition("withdraw-0", isEmpty()),
        ]),
        state(withdraw("spawn"), [transition("transfer-0", isFull())]),
      ]),
      memory: {
        currentStateId: "transfer-0",
      },
    },
    {
      role: "repairer",
      body: [WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
      states: statesToMap([
        state(repair("low-hits-structure"), [
          transition("withdraw-0", isEmpty()),
        ]),
        state(withdraw("high-energy-storage"), [
          transition("repair-0", isFull()),
        ]),
      ]),
      memory: {
        currentStateId: "repair-0",
      },
    },
  ]),
  towers: {
    e5896bc078be90f: {
      action: "attack",
    },
  },
  links: {
    b959be440749e57: {
      action: transferEnergy("central-link"),
    },
    "642dbecf6803b3f": {
      action: transferEnergy("central-link"),
    },
  },
};

export default config;
