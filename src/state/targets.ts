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
      isPercent: !(operator === "EQ" || operator === "NEQ"),
      ...opts,
    },
  };
}

export type ValueIs = ReturnType<typeof valueIs>;

export interface NotFilter {
  type: "not";
  filter: FindFilter;
}

export const notFilter = (filter: FindFilter): NotFilter => ({
  type: "not",
  filter,
});

export interface OrFilter {
  type: "or";
  filters: FindFilter[];
}

export const orFilter = (...filters: FindFilter[]): OrFilter => ({
  type: "or",
  filters,
});

export interface AndFilter {
  type: "and";
  filters: FindFilter[];
}

export const andFilter = (...filters: FindFilter[]): AndFilter => ({
  type: "and",
  filters,
});

export type FindFilter = ValueIs | NotFilter | OrFilter | AndFilter;

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
