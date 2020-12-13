import { ValuesType } from "utils/types";

export type Target = FindTypes[FindConstant] | Structure;

export type FindFilter = "lowHits" | "lowEnergy" | "hasEnergy";

export interface FindOpts {
  filter?: FindFilter;
  structureType?: StructureConstant;
}

export const closestTarget = (find: FindConstant, opts?: FindOpts) =>
  ({
    type: "closest",
    find,
    opts: opts || {},
  } as const);

export interface Position {
  x: number;
  y: number;
}

export const positionTarget = (x: number, y: number) =>
  ({
    type: "position",
    position: { x, y },
  } as const);

export const specificTarget = (targetId: Id<Target>) =>
  ({
    type: "specific",
    targetId,
  } as const);

export type TargetDescription =
  | ReturnType<typeof closestTarget>
  | ReturnType<typeof positionTarget>
  | ReturnType<typeof specificTarget>;

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

export const moveTo = (target: TargetDescription) =>
  ({
    type: "moveTo",
    target,
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
  amount?: number,
) =>
  ({
    type: "withdraw",
    target,
    resourceType,
    amount,
  } as const);

export type BuildAction = ReturnType<typeof build>;
export type HarvestAction = ReturnType<typeof harvest>;
export type MoveToAction = ReturnType<typeof moveTo>;
export type RepairAction = ReturnType<typeof repair>;
export type TransferAction = ReturnType<typeof transfer>;
export type UpgradeAction = ReturnType<typeof upgrade>;
export type WithdrawAction = ReturnType<typeof withdraw>;

export type Action =
  | BuildAction
  | HarvestAction
  | MoveToAction
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

export const atTarget = () => ({ type: "atTarget" } as const);

export const targetAvailable = (find: FindConstant, opts?: FindOpts) =>
  ({
    type: "targetAvailable",
    find,
    opts: opts || {},
  } as const);

export const noTargetAvailable = (find: FindConstant, opts?: FindOpts) =>
  ({
    type: "noTargetAvailable",
    find,
    opts: opts || {},
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

export const state = (action: Action, transitions?: Transition[]) =>
  ({
    action,
    transitions: transitions || [],
  } as const);

export type State = ReturnType<typeof state>;
