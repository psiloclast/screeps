import { FindOpts, ObjectTarget, TargetDescription } from "state/targets";
import { flushCreepCachedTarget, getCreepCachedTarget } from "memory";

import { Predicate } from "utils/utils";
import config from "config";
import { parseFindFilter } from "parseFindFilter";

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
