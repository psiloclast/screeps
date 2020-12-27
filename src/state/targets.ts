type Ordering = "LT" | "LTE" | "GT" | "GTE";
export type Equality = Ordering | "EQ" | "NEQ";

type OrderableProperty = "amount" | "energy" | "hits";
type OrderablePropertyValue = number;
type EquatableProperty = OrderableProperty | "structureType";
type EquatablePropertyValue = OrderablePropertyValue | StructureConstant;

interface ValueIsOpts {
  isPercent: boolean;
}

export function valueIs(
  operator: Ordering,
  property: OrderableProperty,
  propertyValue: OrderablePropertyValue,
  opts?: ValueIsOpts,
): {
  type: "valueIs";
  operator: Ordering;
  property: OrderableProperty;
  value: OrderablePropertyValue;
  opts: ValueIsOpts;
};

export function valueIs(
  operator: Equality,
  property: EquatableProperty,
  propertyValue: EquatablePropertyValue,
  opts?: ValueIsOpts,
): {
  type: "valueIs";
  operator: Equality;
  property: EquatableProperty;
  value: EquatablePropertyValue;
  opts: ValueIsOpts;
};

export function valueIs(
  operator: Equality,
  property: EquatableProperty,
  propertyValue: EquatablePropertyValue,
  opts?: ValueIsOpts,
): {
  type: "valueIs";
  operator: Equality;
  property: EquatableProperty;
  value: EquatablePropertyValue;
  opts: ValueIsOpts;
} {
  return {
    type: "valueIs",
    operator,
    property,
    value: propertyValue,
    opts: {
      isPercent: true,
      ...opts,
    },
  };
}

export type ValueIs = ReturnType<typeof valueIs>;

export type FindFilter = ValueIs;

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
