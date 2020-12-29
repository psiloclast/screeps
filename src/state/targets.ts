import { FindFilter } from "./findFilters";

export interface FindOpts {
  filter?: FindFilter;
}

export const defaultFindOpts = (): FindOpts => ({});

export interface ClosestObjectTarget<F extends FindConstant = FindConstant> {
  type: "closest";
  find: F;
  opts: FindOpts;
}

export const closest = <F extends FindConstant = FindConstant>(
  find: F,
  opts?: FindOpts,
): ClosestObjectTarget<F> =>
  ({
    type: "closest",
    find,
    opts: opts || defaultFindOpts(),
  } as const);

export const position = (x: number, y: number) =>
  ({
    type: "position",
    position: { x, y },
  } as const);

export const room = (name: string) =>
  ({
    type: "room",
    room: {
      name,
    },
  } as const);

export interface SpecificObjectTarget<
  F extends FindConstant = FindConstant,
  S extends StructureConstant = StructureConstant
> {
  type: "object";
  id: Id<FindTypes[F] | StructureTypes[S]>;
}

export const object = <
  F extends FindConstant = FindConstant,
  S extends StructureConstant = StructureConstant
>(
  id: Id<FindTypes[F] | StructureTypes[S]>,
): SpecificObjectTarget<F, S> =>
  ({
    type: "object",
    id,
  } as const);

export type ObjectTarget<
  F extends FindConstant = FindConstant,
  S extends StructureConstant = StructureConstant
> = ClosestObjectTarget<F> | SpecificObjectTarget<F, S>;
export type PositionTarget = ReturnType<typeof position>;
export type RoomTarget = ReturnType<typeof room>;

export type TargetDescription<
  F extends FindConstant = FindConstant,
  S extends StructureConstant = StructureConstant
> = ObjectTarget<F, S> | PositionTarget | RoomTarget;
