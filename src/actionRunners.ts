/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {
  Action,
  BuildAction,
  HarvestAction,
  MoveToAction,
  PickupAction,
  RepairAction,
  TransferAction,
  WithdrawAction,
} from "state/actions";

import { getTarget } from "targetParser";

const runBuild = (action: BuildAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep)!;
  if (creep.build(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
  }
  return { target };
};

const runHarvest = (action: HarvestAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep)!;
  if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: "#ffaa00" } });
  }
  return { target };
};

const runMoveTo = (action: MoveToAction) => (creep: Creep) => {
  const targetDescription = action.target;
  let target;
  if (targetDescription.type === "position") {
    target = creep.room.getPositionAt(
      targetDescription.position.x,
      targetDescription.position.y,
    )!;
  } else {
    target = getTarget(targetDescription, creep)!;
  }
  creep.moveTo(target, {
    visualizePathStyle: { stroke: "#ffffff" },
  });
  return { target };
};

const runPickup = (action: PickupAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep)!;
  if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
  }
  return { target };
};

const runRepair = (action: RepairAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep)!;
  if (creep.repair(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
  }
  return { target };
};

const runTransfer = (action: TransferAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep)!;
  if (
    creep.transfer(target, action.resourceType, action.amount) ===
    ERR_NOT_IN_RANGE
  ) {
    creep.moveTo(target, {
      visualizePathStyle: { stroke: "#ffffff" },
    });
  }
  return { target };
};

const runUpgrade = () => (creep: Creep) => {
  const target = creep.room.controller!;
  if (creep.upgradeController(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {
      visualizePathStyle: { stroke: "#ffffff" },
    });
  }
  return { target };
};

const runWithdraw = (action: WithdrawAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep)!;
  if (
    creep.withdraw(target, action.resourceType, action.amount) ===
    ERR_NOT_IN_RANGE
  ) {
    creep.moveTo(target, {
      visualizePathStyle: { stroke: "#ffffff" },
    });
  }
  return { target };
};

interface ActionRunnerResult {
  target: FindTypes[FindConstant] | null;
}

type ActionRunner = (creep: Creep) => ActionRunnerResult;

export const runAction = (action: Action): ActionRunner => {
  switch (action.type) {
    case "build":
      return runBuild(action);
    case "harvest":
      return runHarvest(action);
    case "moveTo":
      return runMoveTo(action);
    case "pickup":
      return runPickup(action);
    case "repair":
      return runRepair(action);
    case "transfer":
      return runTransfer(action);
    case "upgrade":
      return runUpgrade();
    case "withdraw":
      return runWithdraw(action);
  }
};
