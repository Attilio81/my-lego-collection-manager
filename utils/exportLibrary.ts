import { LegoSet } from '../types';

/**
 * Exports the entire library to a JSON file with all data included
 * This includes all fields from Rebrickable (theme, imageUrl, legoName, etc.)
 * so the library can be imported on another device without API calls
 */
export const exportLibrary = (sets: LegoSet[]): void => {
  if (sets.length === 0) {
    alert('Nessun set da esportare nella libreria');
    return;
  }

  // Create export data with metadata
  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    totalSets: sets.length,
    sets: sets
  };

  // Convert to JSON string
  const jsonString = JSON.stringify(exportData, null, 2);

  // Create blob and download
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `lego-library-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
};
