import { ValuesType } from "utils/types";

export const build = (targetId: string) =>
  ({
    type: "build",
    targetId
  } as const);

export const harvest = (targetId: string) =>
  ({
    type: "harvest",
    targetId
  } as const);

export const transfer = (targetId: string) =>
  ({
    type: "transfer",
    targetId
  } as const);

export const upgrade = (targetId: string) =>
  ({
    type: "upgrade",
    targetId
  } as const);

export type BuildAction = ReturnType<typeof build>;
export type HarvestAction = ReturnType<typeof harvest>;
export type TransferAction = ReturnType<typeof transfer>;
export type UpgradeAction = ReturnType<typeof upgrade>;

export type Action =
  | BuildAction
  | HarvestAction
  | TransferAction
  | UpgradeAction;

export type ActionType = ValuesType<Pick<Action, "type">>;

export const isEmpty = () =>
  ({
    type: "isEmpty"
  } as const);

export const isFull = () =>
  ({
    type: "isFull"
  } as const);

export type IsEmptyEvent = ReturnType<typeof isEmpty>;
export type IsFullEvent = ReturnType<typeof isFull>;

export type Event = IsEmptyEvent | IsFullEvent;

export type EventType = ValuesType<Pick<Event, "type">>;

export const transition = (stateId: number, event: Event) =>
  ({
    stateId,
    event
  } as const);

export type Transition = ReturnType<typeof transition>;

export const state = (action: Action, transitions: Transition[]) =>
  ({
    action,
    transitions
  } as const);

export type State = ReturnType<typeof state>;
