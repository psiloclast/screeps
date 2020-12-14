import { ValuesType } from "utils/types";

type ValueEqualProperty = "structureType";
type ValueEqualValue = StructureConstant;

export const valueEqual = (
  property: ValueEqualProperty,
  value: ValueEqualValue,
) =>
  ({
    type: "valueEqual",
    property,
    value,
  } as const);

type WithinBoundsProperty = "hits" | "energy";
interface WithinBoundsOpts {
  min?: number;
  max?: number;
  isPercent?: boolean;
}

export const withinBounds = (
  property: WithinBoundsProperty,
  opts: WithinBoundsOpts,
) =>
  ({
    type: "withinBounds",
    property,
    opts: {
      min: 0,
      max: 1,
      isPercent: true,
      ...opts,
    },
  } as const);

export type ValueEqual = ReturnType<typeof valueEqual>;
export type WithinBounds = ReturnType<typeof withinBounds>;

export type FindFilter = ValueEqual | WithinBounds;

export interface FindOpts {
  filters: FindFilter[];
}

const defaultFindOpts = (): FindOpts => ({
  filters: [],
});

interface ClosestTarget<F extends FindConstant = FindConstant> {
  type: "closest";
  find: F;
  opts: FindOpts;
}

export const closestTarget = <F extends FindConstant = FindConstant>(
  find: F,
  opts?: FindOpts,
): ClosestTarget<F> =>
  ({
    type: "closest",
    find,
    opts: opts || defaultFindOpts(),
  } as const);

export interface Position {
  x: number;
  y: number;
}

export interface PositionTarget {
  type: "position";
  position: Position;
}

export const positionTarget = (x: number, y: number): PositionTarget =>
  ({
    type: "position",
    position: { x, y },
  } as const);

interface SpecificTarget<F extends FindConstant = FindConstant> {
  type: "specific";
  targetId: Id<FindTypes[F]>;
}

export const specificTarget = <F extends FindConstant = FindConstant>(
  targetId: Id<FindTypes[F]>,
): SpecificTarget<F> =>
  ({
    type: "specific",
    targetId,
  } as const);

export type TargetDescription<F extends FindConstant = FindConstant> =
  | ClosestTarget<F>
  | SpecificTarget<F>;

export const build = (target: TargetDescription<FIND_CONSTRUCTION_SITES>) =>
  ({
    type: "build",
    target,
  } as const);

export const harvest = (
  target: TargetDescription<FIND_SOURCES | FIND_MINERALS | FIND_DEPOSITS>,
) =>
  ({
    type: "harvest",
    target,
  } as const);

export const moveTo = (
  target: TargetDescription<FindConstant> | PositionTarget,
) =>
  ({
    type: "moveTo",
    target,
  } as const);

export const repair = (
  target: TargetDescription<FIND_STRUCTURES | FIND_MY_STRUCTURES>,
) =>
  ({
    type: "repair",
    target,
  } as const);

export const transfer = (
  target: TargetDescription<FIND_CREEPS | FIND_STRUCTURES | FIND_MY_STRUCTURES>,
) =>
  ({
    type: "transfer",
    target,
  } as const);

export const upgrade = () =>
  ({
    type: "upgrade",
  } as const);

export const withdraw = (
  target: TargetDescription<
    FIND_STRUCTURES | FIND_MY_STRUCTURES | FIND_TOMBSTONES | FIND_RUINS
  >,
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

export const state = (action: Action, transitions?: Transition[]) =>
  ({
    action,
    transitions: transitions || [],
  } as const);

export type State = ReturnType<typeof state>;
