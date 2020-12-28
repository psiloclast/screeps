import {
  Equality,
  FindFilter,
  FindOpts,
  ObjectTarget,
  TargetDescription,
  ValueIs,
} from "state/targets";
import { Predicate, composePredicates } from "utils/utils";
import { flushCreepCachedTarget, getCreepCachedTarget } from "memory";

import config from "config";

const valueIsOperators: Record<Equality, (a: any, b: any) => boolean> = {
  EQ: (a, b) => a === b,
  NEQ: (a, b) => a !== b,
  LT: (a, b) => a < b,
  LTE: (a, b) => a <= b,
  GT: (a, b) => a > b,
  GTE: (a, b) => a >= b,
};

const parseValueIsFilter = (filter: ValueIs): Predicate<any> => {
  const { isPercent } = filter.opts;
  switch (filter.property) {
    case "structureType":
      return ({ structureType }: { structureType: StructureConstant }) => {
        if (isPercent) {
          throw new Error(
            "can not use percent when filtering on structureType",
          );
        }
        return valueIsOperators[filter.operator](structureType, filter.value);
      };
    case "amount":
      return ({ amount }: { amount: number }) => {
        if (isPercent) {
          throw new Error("can not use percent when filtering on amount");
        }
        return valueIsOperators[filter.operator](amount, filter.value);
      };
    case "energy":
      return ({ store }: { store: StoreDefinition }) => {
        const value = isPercent
          ? store[RESOURCE_ENERGY] / store.getCapacity(RESOURCE_ENERGY)
          : store[RESOURCE_ENERGY];
        return valueIsOperators[filter.operator](value, filter.value);
      };
    case "hits":
      return ({ hits, hitsMax }: { hits: number; hitsMax: number }) => {
        const value = isPercent ? hits / hitsMax : hits;
        return valueIsOperators[filter.operator](value, filter.value);
      };
  }
};

const parseFindFilter = (filter: FindFilter): Predicate<any> => {
  switch (filter.type) {
    case "valueIs":
      return parseValueIsFilter(filter);
  }
};

interface ScreepsFindOpts {
  filter: Predicate<any>;
}

const parseFindOpts = (findOpts: FindOpts): ScreepsFindOpts => ({
  filter: findOpts.filters
    .map(parseFindFilter)
    .reduce(composePredicates, () => true),
});

const getConstantTarget = (
  targetName: string,
): TargetDescription<FindConstant> => {
  const target = config.constants.targets[targetName];
  if (target === undefined) {
    throw new Error(`there is no constant target called ${targetName}`);
  }
  return target;
};

export function getTarget<F extends FindConstant = FindConstant>(
  target: ObjectTarget<F> | string,
  creep: Creep,
): FindTypes[F] | null;

export function getTarget<F extends FindConstant = FindConstant>(
  target: TargetDescription<F> | string,
  creep: Creep,
): RoomPosition | null;

export function getTarget<F extends FindConstant = FindConstant>(
  target: TargetDescription<F> | string,
  creep: Creep,
): FindTypes[F] | RoomPosition | null {
  target =
    typeof target === "string"
      ? (getConstantTarget(target) as TargetDescription<F>)
      : target;
  switch (target.type) {
    case "closest": {
      const [cachedTarget] = getCreepCachedTarget<F>(creep);
      const screepFindOpts = parseFindOpts(target.opts);
      if (cachedTarget) {
        if (screepFindOpts.filter(cachedTarget)) {
          return cachedTarget;
        } else {
          flushCreepCachedTarget(creep);
        }
      }
      return creep.pos.findClosestByPath(target.find, screepFindOpts);
    }
    case "object":
      return Game.getObjectById(target.id);
    case "position": {
      return creep.room.getPositionAt(target.position.x, target.position.y);
    }
    case "room": {
      const [cachedTarget, { roomName }] = getCreepCachedTarget<F>(creep);
      if (cachedTarget) {
        if (creep.room.name === roomName) {
          return cachedTarget;
        } else {
          flushCreepCachedTarget(creep);
        }
      }
      const findExitConstant = creep.room.findExitTo(target.room.name);
      if (
        findExitConstant === ERR_NO_PATH ||
        findExitConstant === ERR_INVALID_ARGS
      ) {
        throw Error(
          `${creep.name} is trying to move to an impossible room: ${target.room.name}`,
        );
      }
      return creep.pos.findClosestByPath(findExitConstant);
    }
  }
}
