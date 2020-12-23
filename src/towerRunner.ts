import { TowerAction } from "state/towerActions";

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

export const runTowerAction = (action: TowerAction): TowerActionRunner => {
  switch (action) {
    case "attack":
      return towerAttack;
    case "heal":
      return towerHeal;
  }
};
