import { FindFilter, FindOpts, TargetDescription } from "state";
import { Predicate, composePredicates } from "utils/utils";

import { getCreepCachedTarget } from "memory";

const parseFindFilter = (filter: FindFilter): Predicate<any> => {
  switch (filter) {
    case "lowHits":
      return (s: Structure) => s.hits / s.hitsMax < 1.0;
    case "lowEnergy":
      return (s: StructureContainer) =>
        s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    case "hasEnergy":
      return (s: StructureContainer) => s.store[RESOURCE_ENERGY] > 0;
  }
};

export const optsToFilter = (opts: FindOpts): Predicate<any> => {
  let filter: Predicate<any> = () => true;
  if (opts.filter) {
    filter = composePredicates(parseFindFilter(opts.filter));
  }
  if (opts.structureType) {
    filter = composePredicates(
      (s: Structure) => s.structureType === opts.structureType,
      filter,
    );
  }
  return filter;
};

export const getTarget = <F extends FindConstant = FindConstant>(
  target: TargetDescription<F>,
  creep: Creep,
): FindTypes[F] | null => {
  switch (target.type) {
    case "closest": {
      const cachedTarget = getCreepCachedTarget<F>(creep);
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
