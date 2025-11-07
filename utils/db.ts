import { openDB, IDBPDatabase } from 'idb';
import { LegoSet } from '../types';

const DB_NAME = 'lego-collection-db';
const STORE_NAME = 'lego-sets';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<unknown>> | null = null;

const initDB = () => {
  if (dbPromise) return dbPromise;
  
  dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'code' });
      }
    },
  });
  return dbPromise;
};

export const getAllSets = async (): Promise<LegoSet[]> => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const getSet = async (code: string): Promise<LegoSet | undefined> => {
    const db = await initDB();
    return db.get(STORE_NAME, code);
};

export const putSet = async (set: LegoSet): Promise<string> => {
  const db = await initDB();
  return db.put(STORE_NAME, set);
};


export const putAllSets = async (sets: LegoSet[]): Promise<void> => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await Promise.all(sets.map(set => tx.store.put(set)));
    await tx.done;
};

export const deleteSet = async (code: string): Promise<void> => {
  const db = await initDB();
  return db.delete(STORE_NAME, code);
};

export const clearAllSets = async (): Promise<void> => {
  const db = await initDB();
  return db.clear(STORE_NAME);
};
