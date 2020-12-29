import { TowerAction } from "state/towerActions";
import config from "config";

const towerHeal = (tower: StructureTower) => {
  const damagedStructures = tower.room.find(FIND_STRUCTURES, {
    filter: structure => structure.hits < structure.hitsMax,
  });
  const sortedByRelativeDamage = _.sortBy(damagedStructures, structure => {
    return structure.hits / structure.hitsMax;
  });
  const mostRelativelyDamaged = sortedByRelativeDamage[0];
  tower.repair(mostRelativelyDamaged);
};

const towerAttack = (tower: StructureTower) => {
  const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if (closestHostile) {
    tower.attack(closestHostile);
  }
};

type TowerActionRunner = (tower: StructureTower) => void;

const runTowerAction = (action: TowerAction): TowerActionRunner => {
  switch (action) {
    case "attack":
      return towerAttack;
    case "heal":
      return towerHeal;
  }
};

const runTower = (tower: StructureTower) => {
  const towerAction = config.towers[tower.id]?.action;
  // If Tower in game, but not in config, do nothing
  if (!towerAction) {
    return;
  }
  runTowerAction(towerAction)(tower);
};

const getRoomTowers = (room: Room): StructureTower[] =>
  room.find(FIND_STRUCTURES, {
    filter: structure => structure.structureType === STRUCTURE_TOWER,
  }) as StructureTower[];

export const runTowers = (room: Room): void =>
  getRoomTowers(room).forEach(runTower);
