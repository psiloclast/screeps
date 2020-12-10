import { FindOpts, TargetDescription } from "targets";

import { ValuesType } from "utils/types";

export const build = (target: TargetDescription) =>
  ({
    type: "build",
    target,
  } as const);

export const harvest = (target: TargetDescription) =>
  ({
    type: "harvest",
    target,
  } as const);

export const idle = (position: { x: number; y: number }) =>
  ({
    type: "idle",
    position,
  } as const);

export const repair = (target: TargetDescription) =>
  ({
    type: "repair",
    target,
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

export const withdraw = (
  target: TargetDescription,
  resourceType: ResourceConstant,
) =>
  ({
    type: "withdraw",
    target,
    resourceType,
  } as const);

export type BuildAction = ReturnType<typeof build>;
export type HarvestAction = ReturnType<typeof harvest>;
export type IdleAction = ReturnType<typeof idle>;
export type RepairAction = ReturnType<typeof repair>;
export type TransferAction = ReturnType<typeof transfer>;
export type UpgradeAction = ReturnType<typeof upgrade>;
export type WithdrawAction = ReturnType<typeof withdraw>;

export type Action =
  | BuildAction
  | HarvestAction
  | IdleAction
  | RepairAction
  | TransferAction
  | UpgradeAction
  | WithdrawAction;

export type ActionType = ValuesType<Pick<Action, "type">>;

export const isEmpty = () =>
  ({
    type: "isEmpty",
  } as const);

export const isFull = () =>
  ({
    type: "isFull",
  } as const);

export const targetAvailable = (find: FindConstant, opts?: FindOpts) =>
  ({
    type: "targetAvailable",
    find,
    opts,
  } as const);

export const noTargetAvailable = (find: FindConstant, opts?: FindOpts) =>
  ({
    type: "noTargetAvailable",
    find,
    opts,
  } as const);

export type IsEmptyEvent = ReturnType<typeof isEmpty>;
export type IsFullEvent = ReturnType<typeof isFull>;
export type TargetAvailable = ReturnType<typeof targetAvailable>;
export type NoTargetAvailable = ReturnType<typeof noTargetAvailable>;

export type Event =
  | IsEmptyEvent
  | IsFullEvent
  | TargetAvailable
  | NoTargetAvailable;

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
