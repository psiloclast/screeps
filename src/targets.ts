import { Predicate, composePredicates } from "utils/utils";

type FindFilter = "lowHits" | "lowEnergy";

export interface FindOpts {
  filter?: FindFilter;
  structureType?: StructureConstant;
}

export const closestTarget = (find: FindConstant, opts?: FindOpts) =>
  ({
    type: "closest",
    find,
    opts,
  } as const);

export const specificTarget = (targetId: Id<FindTypes[FindConstant]>) =>
  ({
    type: "specific",
    targetId,
  } as const);

export type TargetDescription =
  | ReturnType<typeof closestTarget>
  | ReturnType<typeof specificTarget>;

export const getTarget = (
  target: TargetDescription,
  creep: Creep,
): FindTypes[FindConstant] | null => {
  switch (target.type) {
    case "closest": {
      const opts: { filter?: Predicate<any> } = {};
      if (target.opts?.filter === "lowHits") {
        opts.filter = composePredicates(
          (s: Structure) => s.hits / s.hitsMax < 1.0,
          opts.filter,
        );
      }
      if (target.opts?.filter === "lowEnergy") {
        opts.filter = composePredicates(
          (s: StructureContainer) =>
            s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
          opts.filter,
        );
      }
      if (target.opts?.structureType) {
        opts.filter = composePredicates(
          (s: Structure) => s.structureType === target.opts?.structureType,
          opts.filter,
        );
      }
      return creep.pos.findClosestByPath(target.find, opts);
    }
    case "specific":
      return Game.getObjectById(target.targetId);
  }
};
