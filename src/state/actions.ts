import { PositionTarget, TargetDescription } from "./targets";

import { ValuesType } from "utils/types";

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
