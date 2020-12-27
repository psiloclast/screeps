import { ClosestObjectTarget, SpecificObjectTarget } from "./targets";

import { Action } from "./actions";
import { ValuesType } from "utils/types";

export const isEmpty = () =>
  ({
    type: "isEmpty",
  } as const);

export const isFull = () =>
  ({
    type: "isFull",
  } as const);

export const inRoom = (name: string) =>
  ({
    type: "inRoom",
    name,
  } as const);

export const atTarget = (target: SpecificObjectTarget | string) =>
  ({ type: "atTarget", target } as const);

export const targetAvailable = (target: ClosestObjectTarget | string) =>
  ({
    type: "targetAvailable",
    target,
  } as const);

export const noTargetAvailable = (target: ClosestObjectTarget | string) =>
  ({
    type: "noTargetAvailable",
    target,
  } as const);

export type IsEmptyEvent = ReturnType<typeof isEmpty>;
export type IsFullEvent = ReturnType<typeof isFull>;
export type InRoomEvent = ReturnType<typeof inRoom>;
export type AtTargetEvent = ReturnType<typeof atTarget>;
export type TargetAvailableEvent = ReturnType<typeof targetAvailable>;
export type NoTargetAvailableEvent = ReturnType<typeof noTargetAvailable>;

export type Event =
  | IsEmptyEvent
  | IsFullEvent
  | InRoomEvent
  | AtTargetEvent
  | TargetAvailableEvent
  | NoTargetAvailableEvent;

export type EventType = ValuesType<Pick<Event, "type">>;

export type N =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "25"
  | "26"
  | "27"
  | "28"
  | "29"
  | "30"
  | "31"
  | "32"
  | "33"
  | "34"
  | "35"
  | "36"
  | "37"
  | "38"
  | "39"
  | "40"
  | "41"
  | "42"
  | "43"
  | "44"
  | "45"
  | "46"
  | "47"
  | "48"
  | "49"
  | "50"
  | "51"
  | "52"
  | "53"
  | "54"
  | "55"
  | "56"
  | "57"
  | "58"
  | "59"
  | "60"
  | "61"
  | "62"
  | "63"
  | "64"
  | "65"
  | "66"
  | "67"
  | "68"
  | "69"
  | "70"
  | "71"
  | "72"
  | "73"
  | "74"
  | "75"
  | "76"
  | "77"
  | "78"
  | "79"
  | "80"
  | "81"
  | "82"
  | "83"
  | "84"
  | "85"
  | "86"
  | "87"
  | "88"
  | "89"
  | "90"
  | "91"
  | "92"
  | "93"
  | "94"
  | "95"
  | "96"
  | "97"
  | "98"
  | "99";
export type StateId = `${Action["type"]}-${N}`;

export const transition = (stateId: StateId, event: Event) =>
  ({
    stateId,
    event,
  } as const);

export type Transition = ReturnType<typeof transition>;
