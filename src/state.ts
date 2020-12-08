import { ValuesType } from "utils/types";

export const closestTarget = (find: FindConstant) =>
  ({
    type: "closest",
    find,
  } as const);

export const specificTarget = (targetId: string) =>
  ({
    type: "specific",
    targetId,
  } as const);

export type TargetDescription =
  | ReturnType<typeof closestTarget>
  | ReturnType<typeof specificTarget>;

export const build = (
  target: TargetDescription,
  idleZone: { x: number; y: number },
) =>
  ({
    type: "build",
    target,
    idleZone,
  } as const);

export const harvest = (target: TargetDescription) =>
  ({
    type: "harvest",
    target,
  } as const);

export const repair = (
  target: TargetDescription,
  idleZone: { x: number; y: number },
) =>
  ({
    type: "repair",
    target,
    idleZone,
  } as const);

export const transfer = (target: TargetDescription) =>
  ({
    type: "transfer",
    target,
  } as const);

export const upgrade = (target: TargetDescription) =>
  ({
    type: "upgrade",
    target,
  } as const);

export type BuildAction = ReturnType<typeof build>;
export type HarvestAction = ReturnType<typeof harvest>;
export type RepairAction = ReturnType<typeof repair>;
export type TransferAction = ReturnType<typeof transfer>;
export type UpgradeAction = ReturnType<typeof upgrade>;

export type Action =
  | BuildAction
  | HarvestAction
  | RepairAction
  | TransferAction
  | UpgradeAction;

export type ActionType = ValuesType<Pick<Action, "type">>;

export const isEmpty = () =>
  ({
    type: "isEmpty",
  } as const);

export const isFull = () =>
  ({
    type: "isFull",
  } as const);

export type IsEmptyEvent = ReturnType<typeof isEmpty>;
export type IsFullEvent = ReturnType<typeof isFull>;

export type Event = IsEmptyEvent | IsFullEvent;

export type EventType = ValuesType<Pick<Event, "type">>;

export const transition = (stateId: number, event: Event) =>
  ({
    stateId,
    event,
  } as const);

export type Transition = ReturnType<typeof transition>;

export const state = (action: Action, transitions: Transition[]) =>
  ({
    action,
    transitions,
  } as const);

export type State = ReturnType<typeof state>;
