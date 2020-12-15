import { FindOpts, defaultFindOpts } from "./targets";

import { ValuesType } from "utils/types";

export const isEmpty = () =>
  ({
    type: "isEmpty",
  } as const);

export const isFull = () =>
  ({
    type: "isFull",
  } as const);

export const atTarget = () => ({ type: "atTarget" } as const);

export const targetAvailable = (find: FindConstant, opts?: FindOpts) =>
  ({
    type: "targetAvailable",
    find,
    opts: opts || defaultFindOpts(),
  } as const);

export const noTargetAvailable = (find: FindConstant, opts?: FindOpts) =>
  ({
    type: "noTargetAvailable",
    find,
    opts: opts || defaultFindOpts(),
  } as const);

export type IsEmptyEvent = ReturnType<typeof isEmpty>;
export type IsFullEvent = ReturnType<typeof isFull>;
export type AtTargetEvent = ReturnType<typeof atTarget>;
export type TargetAvailable = ReturnType<typeof targetAvailable>;
export type NoTargetAvailable = ReturnType<typeof noTargetAvailable>;

export type Event =
  | IsEmptyEvent
  | IsFullEvent
  | AtTargetEvent
  | TargetAvailable
  | NoTargetAvailable;

export type EventType = ValuesType<Pick<Event, "type">>;

export const transition = (stateId: number, event: Event) =>
  ({
    stateId,
    event,
  } as const);

export type Transition = ReturnType<typeof transition>;
