import Dexie, { Table } from "dexie";

export interface Friend {
  id?: number;
  name: string;
  age: number;
}

export class DB_Creator extends Dexie {
  friends!: Table<Friend>;

  constructor() {
    super("myDatabase");
    this.version(1).stores({
      friends: "++id, name, age", // Primary key and indexed props
    });
  }
}

export const db = new DB_Creator();
