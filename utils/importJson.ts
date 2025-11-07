import { LegoSet } from '../types';

interface JsonLegoSetFull {
  set_number: string;
  theme?: string;
  name?: string;
  booklets?: string[];
}

interface JsonImport {
  lego_sets: JsonLegoSetFull[];
}

export const parseJsonFile = (jsonContent: string): LegoSet[] => {
  try {
    const data: JsonImport = JSON.parse(jsonContent);
    
    if (!data.lego_sets || !Array.isArray(data.lego_sets)) {
      throw new Error('Invalid JSON format: missing or invalid "lego_sets" array');
    }

    const legoSets: LegoSet[] = data.lego_sets.map(set => {
      // Simple format (only set_number)
      if (!set.theme && !set.name) {
        return {
          code: set.set_number,
          requestedName: `LEGO Set ${set.set_number}`,
          legoName: 'Loading...',
          productUrl: '', // Will be fetched from API
          exists: true,
          imageUrl: undefined
        };
      }
      
      // Full format (with theme, name, booklets)
      return {
        code: set.set_number,
        requestedName: `LEGO ${set.theme} ${set.set_number}: ${set.name}`,
        legoName: set.name || 'Loading...',
        productUrl: '', // Will be fetched from API
        exists: true,
        imageUrl: undefined,
        note: set.booklets && set.booklets.length > 0 ? `Booklets: ${set.booklets.join(', ')}` : undefined
      };
    });

    return legoSets;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse JSON: ${error.message}`);
    }
    throw new Error('Failed to parse JSON: Unknown error');
  }
};

export const importJsonFile = (file: File): Promise<LegoSet[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const legoSets = parseJsonFile(content);
        resolve(legoSets);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};
