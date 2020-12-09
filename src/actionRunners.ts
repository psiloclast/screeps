import {
  Action,
  BuildAction,
  HarvestAction,
  IdleAction,
  RepairAction,
  TransferAction,
  UpgradeAction,
} from "state";

import { getTarget } from "targets";

const runBuild = (action: BuildAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep) as ConstructionSite;
  if (creep.build(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
    return;
  }
};

const runHarvest = (action: HarvestAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep) as Source;
  if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: "#ffaa00" } });
  }
};

const runIdle = (action: IdleAction) => (creep: Creep) => {
  creep.moveTo(action.position.x, action.position.y, {
    visualizePathStyle: { stroke: "#ffffff" },
  });
};

const runRepair = (action: RepairAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep) as Structure;
  if (creep.repair(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
  }
};

const runTransfer = (action: TransferAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep) as Structure;
  if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {
      visualizePathStyle: { stroke: "#ffffff" },
    });
  }
};

const runUpgrade = (action: UpgradeAction) => (creep: Creep) => {
  const target = getTarget(action.target, creep) as StructureController;
  if (creep.upgradeController(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {
      visualizePathStyle: { stroke: "#ffffff" },
    });
  }
};

type ActionRunner = (creep: Creep) => void;

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
  }
};
