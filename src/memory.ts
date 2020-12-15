import { State } from "state";
import config from "config";

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
  target: Exclude<FindTypes[F], RoomPosition | Flag>,
): void => {
  creep.memory.currentTargetId = target.id;
};

export const flushCreepCachedTarget = (creep: Creep): void => {
  creep.memory.currentTargetId = undefined;
};
