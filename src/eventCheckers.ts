import {
  Event,
  InRoomEvent,
  NoTargetAvailableEvent,
  StateId,
  TargetAvailableEvent,
  Transition,
} from "state/events";

import { getCreepCachedTarget } from "memory";
import { getTarget } from "targetParser";

const checkIsEmpty = (creep: Creep): boolean =>
  creep.store[RESOURCE_ENERGY] === 0;

const checkIsFull = (creep: Creep): boolean =>
  creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0;

const checkInRoom = (event: InRoomEvent) => (creep: Creep): boolean =>
  creep.room.name === event.name;

const checkAtTarget = (creep: Creep): boolean => {
  const [target] = getCreepCachedTarget(creep);
  if (target === undefined) {
    return false;
  }
  return creep.pos.isEqualTo(target);
};

const checkTargetAvailable = (event: TargetAvailableEvent) => (
  creep: Creep,
): boolean => {
  return getTarget(event.target, creep) !== null;
};

const checkNoTargetAvailable = (event: NoTargetAvailableEvent) => (
  creep: Creep,
): boolean => {
  return getTarget(event.target, creep) === null;
};

type EventChecker = (creep: Creep) => boolean;

const checkEvent = (event: Event): EventChecker => {
  switch (event.type) {
    case "isEmpty":
      return checkIsEmpty;
    case "isFull":
      return checkIsFull;
    case "inRoom":
      return checkInRoom(event);
    case "atTarget":
      return checkAtTarget;
    case "targetAvailable":
      return checkTargetAvailable(event);
    case "noTargetAvailable":
      return checkNoTargetAvailable(event);
  }
};

export const checkEvents = (
  transitions: Transition[],
  creep: Creep,
): StateId | undefined => {
  const eventRan = transitions.find(t => checkEvent(t.event)(creep));
  return eventRan && eventRan.stateId;
};
