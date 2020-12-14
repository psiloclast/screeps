// memory extension samples
interface CreepMemory {
  currentStateId: number;
  currentTargetId?: Id<FindTypes[FindConstant]>;
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
