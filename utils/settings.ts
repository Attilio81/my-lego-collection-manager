import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'lego-collection-settings';
const STORE_NAME = 'settings';
const DB_VERSION = 1;

let settingsDbPromise: Promise<IDBPDatabase<unknown>> | null = null;

const initSettingsDB = () => {
  if (settingsDbPromise) return settingsDbPromise;
  
  settingsDbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
  return settingsDbPromise;
};

export const getApiKey = async (): Promise<string | undefined> => {
  try {
    const db = await initSettingsDB();
    return await db.get(STORE_NAME, 'rebrickable_api_key');
  } catch (error) {
    console.error('Failed to get API key:', error);
    return undefined;
  }
};

export const saveApiKey = async (apiKey: string): Promise<void> => {
  try {
    const db = await initSettingsDB();
    await db.put(STORE_NAME, apiKey, 'rebrickable_api_key');
  } catch (error) {
    console.error('Failed to save API key:', error);
    throw error;
  }
};

export const deleteApiKey = async (): Promise<void> => {
  try {
    const db = await initSettingsDB();
    await db.delete(STORE_NAME, 'rebrickable_api_key');
  } catch (error) {
    console.error('Failed to delete API key:', error);
    throw error;
  }
};
