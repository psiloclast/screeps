type ValueEqualProperty = "structureType";
type ValueEqualValue = StructureConstant;

export const valueEqual = (
  property: ValueEqualProperty,
  value: ValueEqualValue,
) =>
  ({
    type: "valueEqual",
    property,
    value,
  } as const);

type WithinBoundsProperty = "amount" | "energy" | "hits";
interface WithinBoundsOpts {
  min?: number;
  max?: number;
  isPercent?: boolean;
}

export const withinBounds = (
  property: WithinBoundsProperty,
  opts: WithinBoundsOpts,
) =>
  ({
    type: "withinBounds",
    property,
    opts: {
      min: 0,
      max: 1,
      isPercent: true,
      ...opts,
    },
  } as const);

export type ValueEqual = ReturnType<typeof valueEqual>;
export type WithinBounds = ReturnType<typeof withinBounds>;

export type FindFilter = ValueEqual | WithinBounds;

export interface FindOpts {
  filters: FindFilter[];
}

export const defaultFindOpts = (): FindOpts => ({
  filters: [],
});

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

export interface SpecificObjectTarget<F extends FindConstant = FindConstant> {
  type: "object";
  id: Id<FindTypes[F]>;
}

export const object = <F extends FindConstant = FindConstant>(
  id: Id<FindTypes[F]>,
): SpecificObjectTarget<F> =>
  ({
    type: "object",
    id,
  } as const);

export type ObjectTarget<F extends FindConstant = FindConstant> =
  | ClosestObjectTarget<F>
  | SpecificObjectTarget<F>;
export type PositionTarget = ReturnType<typeof position>;
export type RoomTarget = ReturnType<typeof room>;

export type TargetDescription<F extends FindConstant = FindConstant> =
  | ObjectTarget<F>
  | PositionTarget
  | RoomTarget;
