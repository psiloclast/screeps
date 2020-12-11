// memory extension samples
interface CreepMemory {
  currentStateId: number;
  currentTarget?: {
    id?: Id<import("./state").Target>;
    position?: { x: number; y: number };
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
