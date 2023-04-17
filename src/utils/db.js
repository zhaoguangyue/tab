import Dexie from "dexie";
export class DB_Creator extends Dexie {
    constructor() {
        super("myDatabase");
        Object.defineProperty(this, "friends", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.version(1).stores({
            friends: "++id, name, age", // Primary key and indexed props
        });
    }
}
export const db = new DB_Creator();
