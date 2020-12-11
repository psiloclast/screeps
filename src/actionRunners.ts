import {
  Action,
  BuildAction,
  HarvestAction,
  IdleAction,
  RepairAction,
  Target,
  TransferAction,
  UpgradeAction,
  WithdrawAction,
} from "state";

import { getTarget } from "targets";

const runBuild = (action: BuildAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep) as ConstructionSite;
  if (creep.build(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
  }
  return { target };
};

const runHarvest = (action: HarvestAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep) as Source;
  if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: "#ffaa00" } });
  }
  return { target };
};

const runIdle = (action: IdleAction) => (creep: Creep) => {
  creep.moveTo(action.position.x, action.position.y, {
    visualizePathStyle: { stroke: "#ffffff" },
  });
  return undefined;
};

const runRepair = (action: RepairAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep) as Structure;
  if (creep.repair(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
  }
  return { target };
};

const runTransfer = (action: TransferAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep) as Structure;
  if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {
      visualizePathStyle: { stroke: "#ffffff" },
    });
  }
  return { target };
};

const runUpgrade = (action: UpgradeAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep) as StructureController;
  if (creep.upgradeController(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {
      visualizePathStyle: { stroke: "#ffffff" },
    });
  }
  return { target };
};

const runWithdraw = (action: WithdrawAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep) as Structure;
  if (creep.withdraw(target, action.resourceType) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {
      visualizePathStyle: { stroke: "#ffffff" },
    });
  }
  return { target };
};

interface ActionRunnerResult {
  target?: Target | null;
}

type ActionRunner = (creep: Creep) => ActionRunnerResult | undefined;

export const runAction = (action: Action): ActionRunner => {
  switch (action.type) {
    case "build":
      return runBuild(action);
    case "harvest":
      return runHarvest(action);
    case "idle":
      return runIdle(action);
    case "repair":
      return runRepair(action);
    case "transfer":
      return runTransfer(action);
    case "upgrade":
      return runUpgrade(action);
    case "withdraw":
      return runWithdraw(action);
  }
};
