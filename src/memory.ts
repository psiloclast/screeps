import { State } from "state";
import config from "config";
import { hasOwnProperty } from "utils/utils";

export const cleanMemoryOfDeadCreeps = (): void => {
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
};

export const getCreepState = (creep: Creep): State =>
  config.creeps[creep.name].states[creep.memory.currentStateId];

export const setCreepState = (creep: Creep, stateId: number): void => {
  creep.memory.currentStateId = stateId;
};

export const getCreepCachedTarget = <F extends FindConstant = FindConstant>(
  creep: Creep,
): FindTypes[F] | undefined => {
  const currentTargetId = creep.memory.currentTargetId;
  if (currentTargetId === undefined) {
    return undefined;
  }
  return Game.getObjectById(currentTargetId as Id<FindTypes[F]>) || undefined;
};

export const setCreepCachedTarget = <F extends FindConstant = FindConstant>(
  creep: Creep,
  target: FindTypes[F],
): void => {
  /*
  Objects in screeps either have an `id`, are a RoomPosition with an
  `x` and a `y`, or are a flag which we do not currently support being set.
  */
  let newTargetId: Id<FindTypes[F]>;
  if (hasOwnProperty(target, "id")) {
    newTargetId = target.id as Id<FindTypes[F]>;
  } else {
    throw new Error(`invalid target: ${JSON.stringify(target)}`);
  }
  // Overwrite memory in one place to ensure we leave no hanging values.
  creep.memory.currentTargetId = newTargetId;
};

export const flushCreepCachedTarget = (creep: Creep): void => {
  creep.memory.currentTargetId = undefined;
};
