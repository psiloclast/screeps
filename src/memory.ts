import { State, Target } from "state";

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

export const getCreepCachedTarget = (creep: Creep): Target | undefined => {
  const currentTarget = creep.memory.currentTarget;
  if (currentTarget === undefined) {
    return undefined;
  }
  const id = currentTarget.id;
  if (id !== undefined) {
    return Game.getObjectById(id) || undefined;
  }
  const position = currentTarget.position;
  if (position !== undefined) {
    return creep.room.getPositionAt(position.x, position.y) || undefined;
  }
  throw new Error(
    `should not get here. currentTarget: ${JSON.stringify(currentTarget)}`,
  );
};

export const setCreepCachedTarget = (creep: Creep, target: Target): void => {
  /*
  Objects in screeps either have an `id`, are a RoomPosition with an
  `x` and a `y`, or are a flag which we do not currently support being set.
  */
  let newTarget: CreepMemory["currentTarget"];
  if (hasOwnProperty(target, "id")) {
    newTarget = {
      id: target.id,
    };
  } else if (hasOwnProperty(target, "x")) {
    newTarget = {
      position: {
        x: target.x,
        y: target.y,
      },
    };
  } else {
    throw new Error(
      `can not set flag as target. target: ${JSON.stringify(target)}`,
    );
  }
  // Overwrite memory in one place to ensure we leave no hanging values.
  creep.memory.currentTarget = newTarget;
};

export const flushCreepCachedTarget = (creep: Creep): void => {
  creep.memory.currentTarget = undefined;
};
