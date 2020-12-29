import { SpecificObjectTarget } from "./targets";

export const transferEnergy = (
  target: SpecificObjectTarget<FIND_CREEPS, STRUCTURE_LINK> | string,
) =>
  ({
    type: "transferEnergy",
    target,
  } as const);

export type TransferEnergyAction = ReturnType<typeof transferEnergy>;

export type LinkAction = TransferEnergyAction;
