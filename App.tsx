import React, { useState, useMemo, useEffect } from 'react';
import { LegoSet } from './types';
import LegoSetCard from './components/LegoSetCard';
import AddSetForm from './components/AddSetForm';
import ImportJsonButton from './components/ImportJsonButton';
import ClearDatabaseButton from './components/ClearDatabaseButton';
import UserProfile from './components/UserProfile';
import { PlusIcon, SyncIcon, UserIcon } from './components/Icons';
import * as db from './utils/db';
import * as settings from './utils/settings';
import { importJsonFile } from './utils/importJson';

const REBRICKABLE_API_URL = 'https://rebrickable.com/api/v3/lego/sets/';
const REBRICKABLE_THEMES_URL = 'https://rebrickable.com/api/v3/lego/themes/';
const DEFAULT_API_KEY = 'cff5c9560dc75bbc752abb64960b5f90';

// Cache for theme names to avoid repeated API calls
const themeCache: Record<number, string> = {};

const fetchThemeName = async (themeId: number, currentApiKey: string): Promise<string> => {
  if (themeCache[themeId]) {
    return themeCache[themeId];
  }

  try {
    const response = await fetch(`${REBRICKABLE_THEMES_URL}${themeId}/`, {
      headers: {
        'Authorization': `key ${currentApiKey}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      
      // If this theme has a parent, get the parent theme instead
      if (data.parent_id) {
        const parentTheme = await fetchThemeName(data.parent_id, currentApiKey);
        themeCache[themeId] = parentTheme;
        return parentTheme;
      }
      
      const themeName = data.name || 'Unknown';
      themeCache[themeId] = themeName;
      return themeName;
    }
  } catch (error) {
    console.error(`Error fetching theme ${themeId}:`, error);
  }

  return 'Unknown';
};

const getThemeFromSet = (set: LegoSet): string => {
  // Use theme from API if available
  if (set.theme) {
    return set.theme;
  }
  
  // Fallback to parsing from requestedName
  const themeMatch = set.requestedName.match(/^LEGO\s+([^\s(]+)/);
  if (themeMatch) {
    if (themeMatch[1].toLowerCase() === 'batman') return 'Batman';
    return themeMatch[1];
  }
  return 'Uncategorized';
};

const App: React.FC = () => {
  const [sets, setSets] = useState<LegoSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);

  const fetchSetDetails = async (set: LegoSet): Promise<LegoSet> => {
    try {
      const setCodeForApi = set.code.includes('-') ? set.code : `${set.code}-1`;
      const response = await fetch(`${REBRICKABLE_API_URL}${setCodeForApi}/`, {
        headers: {
          'Authorization': `key ${apiKey}`
        }
      });

      if (!response.ok) {
         const fallbackResponse = await fetch(`${REBRICKABLE_API_URL}${set.code}/`, {
            headers: { 'Authorization': `key ${apiKey}` }
        });
        if (!fallbackResponse.ok) {
            console.warn(`Could not fetch data for set ${set.code}. Status: ${fallbackResponse.status}`);
            return set;
        }
         const fallbackData = await fallbackResponse.json();
        const themeName = fallbackData.theme_id ? await fetchThemeName(fallbackData.theme_id, apiKey) : set.theme;
        return {
          ...set,
          legoName: fallbackData.name || set.legoName,
          theme: themeName,
          imageUrl: fallbackData.set_img_url,
          productUrl: fallbackData.set_url || set.productUrl,
        };
      }

      const data = await response.json();
      const themeName = data.theme_id ? await fetchThemeName(data.theme_id, apiKey) : set.theme;
      return {
        ...set,
        legoName: data.name || set.legoName,
        theme: themeName,
        imageUrl: data.set_img_url,
        productUrl: data.set_url || set.productUrl,
      };
    } catch (error) {
      console.error(`Error fetching details for set ${set.code}:`, error);
      return set;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Load API key
        const savedApiKey = await settings.getApiKey();
        if (savedApiKey && isMounted) {
          setApiKey(savedApiKey);
        }

        // Load sets
        const setsFromDb = await db.getAllSets();
        
        if (isMounted) {
          setSets(setsFromDb);
        }
      } catch (error) {
        console.error("Failed to load data from database:", error);
        alert("Error: Could not load data from the local database. This can happen in private browsing mode.");
        if (isMounted) {
          setSets([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSync = async () => {
      setIsSyncing(true);
      try {
          const currentSets = await db.getAllSets();
          const setsWithDetails = await Promise.all(
              currentSets.map(set => fetchSetDetails(set))
          );
          await db.putAllSets(setsWithDetails);
          setSets(setsWithDetails);
          alert('Sync with Rebrickable complete!');
      } catch (error) {
          console.error("Sync failed:", error);
          alert('An error occurred during sync. Please check the console.');
      } finally {
          setIsSyncing(false);
      }
  };


  const handleAddSet = async (data: { code: string; name: string; productUrl?: string }) => {
    setIsAddModalOpen(false);
    try {
        const existingSet = await db.getSet(data.code);
        if (existingSet) {
          alert(`A set with code ${data.code} already exists in your collection.`);
          return;
        }

        const newSetBase: LegoSet = {
            code: data.code,
            requestedName: data.name,
            productUrl: data.productUrl || `https://www.lego.com/service/buildinginstructions/${data.code}`,
            legoName: 'Loading...',
            exists: true,
        };
        
        // Optimistic UI update
        setSets(prev => [newSetBase, ...prev]);

        const newSetWithDetails = await fetchSetDetails(newSetBase);
        
        await db.putSet(newSetWithDetails);
        
        // Final UI update
        setSets(prev => prev.map(s => s.code === newSetWithDetails.code ? newSetWithDetails : s));
    } catch(error) {
        console.error("Failed to add set:", error);
        alert("An error occurred while adding the set. Please try again.");
        // Revert optimistic update on failure
        setSets(prev => prev.filter(s => s.code !== data.code));
    }
  };


  const handleDeleteSet = async (code: string) => {
    if (window.confirm('Are you sure you want to delete this set from your collection?')) {
      try {
        await db.deleteSet(code);
        setSets(prevSets => prevSets.filter(set => set.code !== code));
      } catch (error) {
        console.error("Failed to delete set:", error);
        alert("An error occurred while deleting the set. Please check the console.");
      }
    }
  };

  const handleImportJson = async (file: File) => {
    try {
      const importedSets = await importJsonFile(file);
      
      if (importedSets.length === 0) {
        alert('No sets found in the JSON file.');
        return;
      }

      // Check for duplicates
      const existingSets = await db.getAllSets();
      const existingCodes = new Set(existingSets.map(s => s.code));
      
      const newSets = importedSets.filter(set => !existingCodes.has(set.code));
      const duplicates = importedSets.length - newSets.length;

      if (newSets.length === 0) {
        alert('All sets from the JSON file already exist in your collection.');
        return;
      }

      // Add all new sets
      await db.putAllSets([...existingSets, ...newSets]);
      setSets([...existingSets, ...newSets]);

      const message = duplicates > 0
        ? `Imported ${newSets.length} set(s). ${duplicates} duplicate(s) skipped.`
        : `Successfully imported ${newSets.length} set(s).`;
      
      alert(message + '\n\nClick the Sync button to fetch details from Rebrickable.');
    } catch (error) {
      console.error("Failed to import JSON:", error);
      alert(`Failed to import JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleClearDatabase = async () => {
    const confirmMessage = 'Are you sure you want to DELETE ALL sets from your collection?\n\nThis action cannot be undone!';
    
    if (window.confirm(confirmMessage)) {
      // Double confirmation for safety
      const doubleConfirm = window.confirm('Last chance! Click OK to permanently delete everything.');
      
      if (doubleConfirm) {
        try {
          await db.clearAllSets();
          setSets([]);
          alert('Database cleared successfully. All sets have been removed.');
        } catch (error) {
          console.error("Failed to clear database:", error);
          alert('An error occurred while clearing the database. Please try again.');
        }
      }
    }
  };
  
  const allThemes = useMemo(() => {
    const themes = new Set(sets.map(getThemeFromSet));
    return ['All', ...Array.from(themes).sort()];
  }, [sets]);


  const filteredSets = useMemo(() => {
    let setsToFilter = sets;

    if (activeFilter !== 'All') {
      setsToFilter = setsToFilter.filter(set => getThemeFromSet(set) === activeFilter);
    }

    if (searchTerm.trim()) {
      const lowercasedFilter = searchTerm.toLowerCase();
      setsToFilter = setsToFilter.filter(set =>
        set.code.toLowerCase().includes(lowercasedFilter) ||
        set.requestedName.toLowerCase().includes(lowercasedFilter) ||
        set.legoName.toLowerCase().includes(lowercasedFilter)
      );
    }
    
    return setsToFilter;
  }, [sets, searchTerm, activeFilter]);

  const groupedSets = useMemo(() => {
    return filteredSets.reduce((acc, set) => {
      const theme = getThemeFromSet(set);
      if (!acc[theme]) {
        acc[theme] = [];
      }
      acc[theme].push(set);
      return acc;
    }, {} as Record<string, LegoSet[]>);
  }, [filteredSets]);

  const sortedThemes = useMemo(() => Object.keys(groupedSets).sort(), [groupedSets]);

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      <header className="bg-gray-800/80 backdrop-blur-sm sticky top-0 z-40 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className='text-center sm:text-left'>
            <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400 tracking-wider">
              My Family's LEGO® Collection
            </h1>
            <p className="text-gray-400 text-sm">A shared inventory of our beloved sets.</p>
          </div>
          <div className="w-full sm:w-auto flex items-center gap-2 sm:gap-4">
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow sm:flex-grow-0 sm:w-64 bg-gray-700 text-white rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <ImportJsonButton 
              onImport={handleImportJson}
              disabled={isLoading}
            />
            <ClearDatabaseButton 
              onClear={handleClearDatabase}
              disabled={isLoading}
            />
            <button
                onClick={handleSync}
                disabled={isSyncing || isLoading}
                className="p-2 text-gray-300 bg-gray-700 rounded-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Sync with Rebrickable"
                title="Sync with Rebrickable"
            >
                <SyncIcon className={`w-6 h-6 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
            <button
                onClick={() => setIsProfileOpen(true)}
                disabled={isLoading}
                className="p-2 text-gray-300 bg-gray-700 rounded-md hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="User Profile"
                title="User Profile & Settings"
            >
                <UserIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
            {allThemes.map(theme => (
                <button
                    key={theme}
                    onClick={() => setActiveFilter(theme)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 ${
                        activeFilter === theme
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    {theme}
                </button>
            ))}
        </div>
        
        {isLoading ? (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold text-gray-400">Loading your LEGO collection...</h2>
                <p className="text-gray-500 mt-2">Reading sets from local database.</p>
            </div>
        ) : filteredSets.length > 0 ? (
          <div className="space-y-12">
            {sortedThemes.map(theme => (
              <section key={theme}>
                <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 border-b-2 border-gray-700 pb-3 mb-6 tracking-wide">
                  {theme}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {groupedSets[theme].map(set => (
                    <LegoSetCard key={set.code} set={set} onDelete={handleDeleteSet} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-400">No sets found</h2>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filter.
            </p>
          </div>
        )}
      </main>

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transform hover:scale-110 transition-transform duration-200 z-50"
        aria-label="Add new LEGO set"
      >
        <PlusIcon className="w-8 h-8" />
      </button>

      <AddSetForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSet={handleAddSet}
      />

      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentApiKey={apiKey}
        onApiKeyUpdate={setApiKey}
      />
    </div>
  );
};

export default App;