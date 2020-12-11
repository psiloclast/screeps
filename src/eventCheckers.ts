import {
  Event,
  NoTargetAvailable,
  TargetAvailable,
  Transition,
  closestTarget,
} from "state";

import { getTarget } from "targets";

const checkIsEmpty = (creep: Creep): boolean =>
  creep.store[RESOURCE_ENERGY] === 0;

const checkIsFull = (creep: Creep): boolean =>
  creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0;

const checkTargetAvailable = (event: TargetAvailable) => (
  creep: Creep,
): boolean => {
  const target = closestTarget(event.find, event.opts);
  return getTarget(target, creep) !== null;
};

const checkNoTargetAvailable = (event: NoTargetAvailable) => (
  creep: Creep,
): boolean => {
  const target = closestTarget(event.find, event.opts);
  return getTarget(target, creep) === null;
};

type EventChecker = (creep: Creep) => boolean;

const checkEvent = (event: Event): EventChecker => {
  switch (event.type) {
    case "isEmpty":
      return checkIsEmpty;
    case "isFull":
      return checkIsFull;
    case "targetAvailable":
      return checkTargetAvailable(event);
    case "noTargetAvailable":
      return checkNoTargetAvailable(event);
  }
};

export const checkEvents = (
  transitions: Transition[],
  creep: Creep,
): number | undefined => {
  const eventRan = transitions.find(t => checkEvent(t.event)(creep));
  return eventRan && eventRan.stateId;
};
