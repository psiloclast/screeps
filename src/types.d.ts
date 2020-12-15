// memory extension samples
interface CreepMemory {
  currentStateId: number;
  currentTargetId?: Id<
    Exclude<FindTypes[FindConstant], RoomPosition | RoomPosition>
  >;
}

interface Memory {
  uuid: number;
  log: any;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
