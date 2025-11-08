import { LegoSet } from '../types';

interface LibraryExportData {
  version: string;
  exportDate: string;
  totalSets: number;
  sets: LegoSet[];
}

/**
 * Validates the imported library file structure
 */
const validateLibraryFormat = (data: any): data is LibraryExportData => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  if (!data.version || !data.sets || !Array.isArray(data.sets)) {
    return false;
  }

  // Validate each set has required fields
  return data.sets.every((set: any) =>
    set.code &&
    set.legoName &&
    set.productUrl !== undefined &&
    set.exists !== undefined
  );
};

/**
 * Imports a complete library from a file exported with exportLibrary
 * @param file - The JSON file containing the exported library
 * @returns Promise with the imported sets
 */
export const importLibraryFile = (file: File): Promise<LegoSet[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);

        if (!validateLibraryFormat(data)) {
          reject(new Error('Formato file non valido. Assicurati di importare un file esportato da questa app.'));
          return;
        }

        console.log(`Importazione libreria: ${data.totalSets} set trovati, data export: ${data.exportDate}`);
        resolve(data.sets);
      } catch (error) {
        reject(new Error('Errore nel parsing del file JSON: ' + (error as Error).message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Errore nella lettura del file'));
    };

    reader.readAsText(file);
  });
};
