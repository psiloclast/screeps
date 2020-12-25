// memory extension samples
interface CreepMemory {
  currentStateId: import("./state/events").StateId;
  cachedTarget?: {
    target:
      | import("./state/targets").SpecificObjectTarget
      | import("./state/targets").PositionTarget;
    metaData: import("./memory").CachedMetaData;
  };
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
