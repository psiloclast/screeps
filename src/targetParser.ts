import {
  FindFilter,
  FindOpts,
  ObjectTarget,
  TargetDescription,
  ValueEqual,
  WithinBounds,
} from "state/targets";
import { Predicate, composePredicates } from "utils/utils";
import { flushCreepCachedTarget, getCreepCachedTarget } from "memory";

const parseValueEqualFilter = (filter: ValueEqual) => {
  switch (filter.property) {
    case "structureType":
      return (s: StructureContainer) => s[filter.property] === filter.value;
  }
};

const parseWithinBoundsFilter = (filter: WithinBounds) => {
  const { min, max, isPercent } = filter.opts;
  switch (filter.property) {
    case "amount":
      return (s: { amount: number }) => {
        if (isPercent) {
          throw new Error("can not use percent when filtering on amount");
        }
        const value = s.amount;
        return min <= value && value <= max;
      };
    case "energy":
      return (s: { store: StoreDefinition }) => {
        const value = isPercent
          ? s.store[RESOURCE_ENERGY] / s.store.getCapacity(RESOURCE_ENERGY)
          : s.store[RESOURCE_ENERGY];
        return min <= value && value <= max;
      };
    case "hits":
      return (s: { hits: number; hitsMax: number }) => {
        const value = isPercent ? s.hits / s.hitsMax : s.hits;
        return min <= value && value <= max;
      };
  }
};

const parseFindFilter = (filter: FindFilter): Predicate<any> => {
  switch (filter.type) {
    case "valueEqual":
      return parseValueEqualFilter(filter);
    case "withinBounds":
      return parseWithinBoundsFilter(filter);
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

export function getTarget<F extends FindConstant = FindConstant>(
  target: ObjectTarget<F>,
  creep: Creep,
): FindTypes[F] | null;

export function getTarget<F extends FindConstant = FindConstant>(
  target: TargetDescription<F>,
  creep: Creep,
): RoomPosition | null;

export function getTarget<F extends FindConstant = FindConstant>(
  target: TargetDescription<F>,
  creep: Creep,
): FindTypes[F] | RoomPosition | null {
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
