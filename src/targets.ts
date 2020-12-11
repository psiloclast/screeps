import { FindOpts, Target, TargetDescription } from "state";
import { Predicate, composePredicates } from "utils/utils";

import { getCreepCachedTarget } from "memory";

export const optsToFilter = (opts: FindOpts): Predicate<any> => {
  let filter: Predicate<any> = () => true;
  if (opts.filter === "lowHits") {
    filter = composePredicates(
      (s: Structure) => s.hits / s.hitsMax < 1.0,
      filter,
    );
  }
  if (opts.filter === "lowEnergy") {
    filter = composePredicates(
      (s: StructureContainer) => s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
      filter,
    );
  }
  if (opts.structureType) {
    filter = composePredicates(
      (s: Structure) => s.structureType === opts.structureType,
      filter,
    );
  }
  return filter;
};

export const getTarget = (
  target: TargetDescription,
  creep: Creep,
): Target | null => {
  switch (target.type) {
    case "closest": {
      const cachedTarget = getCreepCachedTarget(creep);
      if (cachedTarget && optsToFilter(target.opts)(cachedTarget)) {
        return cachedTarget;
      }
      const opts = { filter: optsToFilter(target.opts) };
      return creep.pos.findClosestByPath(target.find, opts);
    }
    case "specific":
      return Game.getObjectById(target.targetId);
  }
};
