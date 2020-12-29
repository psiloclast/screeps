import {
  AndFilter,
  Equality,
  FindFilter,
  FindOpts,
  NotFilter,
  ObjectTarget,
  OrFilter,
  TargetDescription,
  ValueIs,
} from "state/targets";
import { Predicate, liftAnd, liftNot, liftOr } from "utils/utils";
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

const parseNotFilter = (filter: NotFilter): Predicate<any> =>
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  liftNot(parseFindFilter(filter.filter));

const parseOrFilter = (filter: OrFilter): Predicate<any> =>
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  filter.filters.map(parseFindFilter).reduce(liftOr, () => false);

const parseAndFilter = (filter: AndFilter): Predicate<any> =>
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  filter.filters.map(parseFindFilter).reduce(liftAnd, () => true);

const parseFindFilter = (filter: FindFilter): Predicate<any> => {
  switch (filter.type) {
    case "valueIs":
      return parseValueIsFilter(filter);
    case "not":
      return parseNotFilter(filter);
    case "or":
      return parseOrFilter(filter);
    case "and":
      return parseAndFilter(filter);
  }
};

interface ScreepsFindOpts {
  filter: Predicate<any>;
}

const parseFindOpts = (findOpts: FindOpts): ScreepsFindOpts => ({
  filter: findOpts.filter ? parseFindFilter(findOpts.filter) : () => true,
});

export const getConstantTarget = <
  F extends FindConstant = FindConstant,
  S extends StructureConstant = StructureConstant
>(
  targetName: string,
): TargetDescription<F, S> => {
  const target = config.constants.targets[targetName] as TargetDescription<
    F,
    S
  >;
  if (target === undefined) {
    throw new Error(`there is no constant target called ${targetName}`);
  }
  return target;
};

export function getTarget<F extends FindConstant = FindConstant>(
  target: ObjectTarget<F> | string,
  object: RoomObject,
): FindTypes[F] | null;

export function getTarget<S extends StructureConstant = StructureConstant>(
  target: ObjectTarget<never, S> | string,
  object: RoomObject,
): StructureTypes[S] | null;

export function getTarget<
  F extends FindConstant = FindConstant,
  S extends StructureConstant = StructureConstant
>(
  target: TargetDescription<F, S> | string,
  object: RoomObject,
): RoomPosition | null;

export function getTarget<
  F extends FindConstant = FindConstant,
  S extends StructureConstant = StructureConstant
>(
  target: TargetDescription<F, S> | string,
  object: RoomObject,
): FindTypes[F] | StructureTypes[S] | RoomPosition | null {
  target = typeof target === "string" ? getConstantTarget(target) : target;
  switch (target.type) {
    case "closest": {
      const screepFindOpts = parseFindOpts(target.opts);
      if (object instanceof Creep) {
        const creep = object;
        const [cachedTarget] = getCreepCachedTarget<F, S>(creep);
        if (cachedTarget) {
          if (screepFindOpts.filter(cachedTarget)) {
            return cachedTarget;
          } else {
            flushCreepCachedTarget(creep);
          }
        }
      }
      return object.pos.findClosestByPath(target.find, screepFindOpts);
    }
    case "object":
      return Game.getObjectById(target.id);
    case "position": {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return object.room!.getPositionAt(target.position.x, target.position.y);
    }
    case "room": {
      if (!(object instanceof Creep)) {
        throw new Error(`can not use 'room' target on non-creep`);
      }
      const creep = object;
      const [cachedTarget, { roomName }] = getCreepCachedTarget<F, S>(creep);
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
