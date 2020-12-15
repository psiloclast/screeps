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

type WithinBoundsProperty = "hits" | "energy";
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

interface ClosestTarget<F extends FindConstant = FindConstant> {
  type: "closest";
  find: F;
  opts: FindOpts;
}

export const closestTarget = <F extends FindConstant = FindConstant>(
  find: F,
  opts?: FindOpts,
): ClosestTarget<F> =>
  ({
    type: "closest",
    find,
    opts: opts || defaultFindOpts(),
  } as const);

export interface Position {
  x: number;
  y: number;
}

export interface PositionTarget {
  type: "position";
  position: Position;
}

export const positionTarget = (x: number, y: number): PositionTarget =>
  ({
    type: "position",
    position: { x, y },
  } as const);

interface SpecificTarget<F extends FindConstant = FindConstant> {
  type: "specific";
  targetId: Id<FindTypes[F]>;
}

export const specificTarget = <F extends FindConstant = FindConstant>(
  targetId: Id<FindTypes[F]>,
): SpecificTarget<F> =>
  ({
    type: "specific",
    targetId,
  } as const);

export type TargetDescription<F extends FindConstant = FindConstant> =
  | ClosestTarget<F>
  | SpecificTarget<F>;
