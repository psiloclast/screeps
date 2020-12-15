import { Action } from "./actions";
import { Transition } from "./events";

export const state = (action: Action, transitions?: Transition[]) =>
  ({
    action,
    transitions: transitions || [],
  } as const);

export type State = ReturnType<typeof state>;
