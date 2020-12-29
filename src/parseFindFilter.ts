import {
  AndFilter,
  Equality,
  FindFilter,
  NotFilter,
  OrFilter,
  ValueIs,
} from "state/findFilters";
import { Predicate, liftAnd, liftNot, liftOr } from "utils/utils";

const valueIsOperators: Record<Equality, (a: any, b: any) => boolean> = {
  EQ: (a, b) => a === b,
  NEQ: (a, b) => a !== b,
  LT: (a, b) => a < b,
  LTE: (a, b) => a <= b,
  GT: (a, b) => a > b,
  GTE: (a, b) => a >= b,
};

const parseValueIsFilter = (filter: ValueIs): Predicate<any> => {
  const { isPercent } = filter.opts;
  switch (filter.property) {
    case "structureType":
      return ({ structureType }: { structureType: StructureConstant }) => {
        if (isPercent) {
          throw new Error(
            "can not use percent when filtering on structureType",
          );
        }
        return valueIsOperators[filter.operator](structureType, filter.value);
      };
    case "amount":
      return ({ amount }: { amount: number }) => {
        if (isPercent) {
          throw new Error("can not use percent when filtering on amount");
        }
        return valueIsOperators[filter.operator](amount, filter.value);
      };
    case "energy":
      return ({ store }: { store: StoreDefinition }) => {
        const value = isPercent
          ? store[RESOURCE_ENERGY] / store.getCapacity(RESOURCE_ENERGY)
          : store[RESOURCE_ENERGY];
        return valueIsOperators[filter.operator](value, filter.value);
      };
    case "hits":
      return ({ hits, hitsMax }: { hits: number; hitsMax: number }) => {
        const value = isPercent ? hits / hitsMax : hits;
        return valueIsOperators[filter.operator](value, filter.value);
      };
  }
};

const parseNotFilter = (filter: NotFilter): Predicate<any> =>
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  liftNot(parseFindFilter(filter.filter));

const parseOrFilter = (filter: OrFilter): Predicate<any> =>
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  filter.filters.map(parseFindFilter).reduce(liftOr, () => false);

const parseAndFilter = (filter: AndFilter): Predicate<any> =>
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  filter.filters.map(parseFindFilter).reduce(liftAnd, () => true);

export const parseFindFilter = (filter: FindFilter): Predicate<any> => {
  switch (filter.type) {
    case "valueIs":
      return parseValueIsFilter(filter);
    case "not":
      return parseNotFilter(filter);
    case "or":
      return parseOrFilter(filter);
    case "and":
      return parseAndFilter(filter);
  }
};
