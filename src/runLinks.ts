import { LinkAction, TransferEnergyAction } from "state/linkActions";

import config from "config";
import { getTarget } from "getTarget";

const runTransferEnergy = (action: TransferEnergyAction) => (
  link: StructureLink,
): void => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const target = getTarget(action.target, link)!;
  link.transferEnergy(target);
};

type LinkActionRunner = (link: StructureLink) => void;

const runLinkAction = (action: LinkAction): LinkActionRunner => {
  return runTransferEnergy(action);
};

const runLink = (link: StructureLink) => {
  const linkAction = config.links[link.id]?.action;
  // If Link in game, but not in config, do nothing
  if (!linkAction) {
    return;
  }
  runLinkAction(linkAction)(link);
};

const getRoomLinks = (room: Room): StructureLink[] =>
  room.find(FIND_STRUCTURES, {
    filter: structure => structure.structureType === STRUCTURE_LINK,
  }) as StructureLink[];

export const runLinks = (room: Room): void =>
  getRoomLinks(room).forEach(runLink);
