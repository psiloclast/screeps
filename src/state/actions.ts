import { ObjectTarget, TargetDescription } from "./targets";

import { ValuesType } from "utils/types";

export const attack = (
  target: ObjectTarget<FIND_CREEPS | FIND_STRUCTURES> | string,
) =>
  ({
    type: "attack",
    target,
  } as const);

export const attackController = () =>
  ({
    type: "attackController",
  } as const);

export const build = (target: ObjectTarget<FIND_CONSTRUCTION_SITES> | string) =>
  ({
    type: "build",
    target,
  } as const);

export const harvest = (
  target: ObjectTarget<FIND_SOURCES | FIND_MINERALS | FIND_DEPOSITS> | string,
) =>
  ({
    type: "harvest",
    target,
  } as const);

export const heal = (target: ObjectTarget<FIND_CREEPS> | string) =>
  ({
    type: "heal",
    target,
  } as const);

export const idle = () =>
  ({
    type: "idle",
  } as const);

export const pickup = (target: ObjectTarget<FIND_DROPPED_RESOURCES> | string) =>
  ({
    type: "pickup",
    target,
  } as const);

export const moveTo = (target: TargetDescription<FindConstant> | string) =>
  ({
    type: "moveTo",
    target,
  } as const);

export const repair = (
  target: ObjectTarget<FIND_STRUCTURES | FIND_MY_STRUCTURES> | string,
) =>
  ({
    type: "repair",
    target,
  } as const);

export const transfer = (
  target:
    | ObjectTarget<FIND_CREEPS | FIND_STRUCTURES | FIND_MY_STRUCTURES>
    | string,
  resourceType: ResourceConstant,
  amount?: number,
) =>
  ({
    type: "transfer",
    target,
    resourceType,
    amount,
  } as const);

export const upgrade = () =>
  ({
    type: "upgrade",
  } as const);

export const withdraw = (
  target:
    | ObjectTarget<
        FIND_STRUCTURES | FIND_MY_STRUCTURES | FIND_TOMBSTONES | FIND_RUINS
      >
    | string,
  resourceType: ResourceConstant,
  amount?: number,
) =>
  ({
    type: "withdraw",
    target,
    resourceType,
    amount,
  } as const);

export type AttackAction = ReturnType<typeof attack>;
export type AttackControllerAction = ReturnType<typeof attackController>;
export type BuildAction = ReturnType<typeof build>;
export type HarvestAction = ReturnType<typeof harvest>;
export type HealAction = ReturnType<typeof heal>;
export type IdleAction = ReturnType<typeof idle>;
export type MoveToAction = ReturnType<typeof moveTo>;
export type PickupAction = ReturnType<typeof pickup>;
export type RepairAction = ReturnType<typeof repair>;
export type TransferAction = ReturnType<typeof transfer>;
export type UpgradeAction = ReturnType<typeof upgrade>;
export type WithdrawAction = ReturnType<typeof withdraw>;

export type Action =
  | AttackAction
  | AttackControllerAction
  | BuildAction
  | HarvestAction
  | HealAction
  | IdleAction
  | MoveToAction
  | PickupAction
  | RepairAction
  | TransferAction
  | UpgradeAction
  | WithdrawAction;

export type ActionType = ValuesType<Pick<Action, "type">>;
