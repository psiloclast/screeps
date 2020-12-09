export type findFilter = "lowHits";

export const closestTarget = (find: FindConstant, filter?: findFilter) =>
  ({
    type: "closest",
    find,
    filter,
  } as const);

export const specificTarget = (targetId: string) =>
  ({
    type: "specific",
    targetId,
  } as const);

export type TargetDescription =
  | ReturnType<typeof closestTarget>
  | ReturnType<typeof specificTarget>;

export const getTarget = (target: TargetDescription, creep: Creep) => {
  switch (target.type) {
    case "closest": {
      let opts;
      if (target.filter === "lowHits") {
        opts = { filter: (t: Structure) => t.hits / t.hitsMax < 1.0 };
      }
      return creep.pos.findClosestByPath(target.find, opts);
    }
    case "specific":
      return Game.getObjectById(target.targetId);
  }
};
