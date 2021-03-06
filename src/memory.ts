import { State } from "state";
import { StateId } from "state/events";
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

export const setCreepState = (creep: Creep, stateId: StateId): void => {
  creep.memory.currentStateId = stateId;
};

export interface CachedMetaData {
  roomName: string;
}

export const getCreepCachedTarget = <F extends FindConstant = FindConstant>(
  creep: Creep,
): [FindTypes[F] | RoomPosition | undefined, CachedMetaData] => {
  const cachedTarget = creep.memory.cachedTarget;
  switch (cachedTarget?.target.type) {
    case undefined:
      return [undefined, { roomName: "" }];
    case "object":
      return [
        Game.getObjectById(cachedTarget.target.id as Id<FindTypes[F]>) ||
          undefined,
        cachedTarget.metaData,
      ];
    case "position":
      return [
        creep.room.getPositionAt(
          cachedTarget.target.position.x,
          cachedTarget.target.position.y,
        ) || undefined,
        cachedTarget.metaData,
      ];
  }
};

export const setCreepCachedTarget = <F extends FindConstant = FindConstant>(
  creep: Creep,
  target: Exclude<FindTypes[F], RoomPosition | Flag> | RoomPosition,
): void => {
  if (target instanceof RoomPosition) {
    creep.memory.cachedTarget = {
      target: {
        type: "position",
        position: {
          x: target.x,
          y: target.y,
        },
      },
      metaData: {
        roomName: target.roomName,
      },
    };
  } else {
    creep.memory.cachedTarget = {
      target: {
        type: "object",
        id: target.id,
      },
      metaData: {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        roomName: target.room!.name,
      },
    };
  }
};

export const flushCreepCachedTarget = (creep: Creep): void => {
  creep.memory.cachedTarget = undefined;
};
