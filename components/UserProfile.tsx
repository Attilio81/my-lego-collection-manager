import React, { useState, useEffect } from 'react';
import { CloseIcon } from './Icons';
import ImportJsonButton from './ImportJsonButton';
import ClearDatabaseButton from './ClearDatabaseButton';
import * as settings from '../utils/settings';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  currentApiKey: string;
  onApiKeyUpdate: (apiKey: string) => void;
  onImportJson: (file: File) => void;
  onClearDatabase: () => void;
  isLoading: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  isOpen, 
  onClose, 
  currentApiKey, 
  onApiKeyUpdate,
  onImportJson,
  onClearDatabase,
  isLoading 
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKey(currentApiKey);
      setIsEditing(false);
      setMessage(null);
      
      // Add ESC key listener
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, currentApiKey, onClose]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const trimmedKey = apiKey.trim();
      
      if (!trimmedKey) {
        setMessage({ type: 'error', text: 'API Key cannot be empty.' });
        setIsSaving(false);
        return;
      }

      await settings.saveApiKey(trimmedKey);
      onApiKeyUpdate(trimmedKey);
      setMessage({ type: 'success', text: 'API Key saved successfully!' });
      setIsEditing(false);
      
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save API Key. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setApiKey(currentApiKey);
    setIsEditing(false);
    setMessage(null);
  };

  if (!isOpen) return null;

  const maskedApiKey = currentApiKey 
    ? `${currentApiKey.substring(0, 4)}${'*'.repeat(Math.max(0, currentApiKey.length - 8))}${currentApiKey.substring(currentApiKey.length - 4)}`
    : 'Not set';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-gray-800 text-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-4 transform transition-all" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold text-yellow-400">User Profile</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Close"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* API Key Section */}
          <div className="bg-gray-900 rounded-lg p-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Rebrickable API Key</h3>
              <p className="text-sm text-gray-400 mb-4">
                Your API key is used to fetch LEGO set details from Rebrickable. 
                You can get a free API key by signing up at{' '}
                <a 
                  href="https://rebrickable.com/api/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  rebrickable.com/api
                </a>
              </p>
            </div>

            {message && (
              <div className={`p-3 rounded-md text-sm ${
                message.type === 'success' 
                  ? 'bg-green-900/50 text-green-400' 
                  : 'bg-red-900/50 text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {isEditing ? 'API Key' : 'Current API Key'}
              </label>
              
              {isEditing ? (
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono"
                  placeholder="Enter your Rebrickable API key"
                  autoFocus
                />
              ) : (
                <div className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-sm font-mono text-gray-300">
                  {maskedApiKey}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-colors"
                >
                  Edit API Key
                </button>
              )}
            </div>
          </div>

          {/* Data Management Section */}
          <div className="bg-gray-900 rounded-lg p-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Data Management</h3>
              <p className="text-sm text-gray-400 mb-4">
                Import your collection from a JSON file or clear all data from the database.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <ImportJsonButton 
                onImport={onImportJson}
                disabled={isLoading}
              />
              <ClearDatabaseButton 
                onClear={onClearDatabase}
                disabled={isLoading}
              />
            </div>

            <div className="bg-gray-800 rounded-md p-3 text-xs text-gray-400">
              <p className="font-semibold text-gray-300 mb-1">JSON Format Example:</p>
              <pre className="overflow-x-auto">
{`{
  "lego_sets": [
    {"set_number": "76287"},
    {"set_number": "60411"}
  ]
}`}
              </pre>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">About</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p><strong className="text-gray-300">App Version:</strong> 1.0.0</p>
              <p><strong className="text-gray-300">Storage:</strong> IndexedDB (Browser)</p>
              <p><strong className="text-gray-300">Data Source:</strong> Rebrickable API</p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-700 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-center sticky bottom-0 bg-gray-800">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            Click outside or press ESC to close
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
