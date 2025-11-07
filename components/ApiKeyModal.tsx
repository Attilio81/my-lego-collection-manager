import React, { useState } from 'react';
import { CloseIcon } from './Icons';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
  onClose: () => void;
  currentKey?: string | null;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave, onClose, currentKey }) => {
  const [key, setKey] = useState('');

  const handleSave = () => {
    if (key.trim()) {
      onSave(key.trim());
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 text-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-yellow-400">Rebrickable API Key</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-400 mb-4 text-sm">
            To fetch LEGO set images and details, this app needs an API key from Rebrickable.
            It's free to get one.
          </p>
          <ol className="text-gray-400 mb-6 text-sm list-decimal list-inside space-y-1">
            <li>Go to <a href="https://rebrickable.com/api/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">rebrickable.com/api/</a>.</li>
            <li>Create a free account and get your API key.</li>
            <li>Paste your key below. It will be saved in your browser's local storage.</li>
          </ol>
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300">Your API Key</label>
            <input
              type="text"
              id="apiKey"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={currentKey ? 'Enter new key to update' : 'Enter your Rebrickable API key'}
            />
          </div>
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 transition-colors"
            >
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fix: Corrected the component name in the default export from `ApiKey` to `ApiKeyModal`.
export default ApiKeyModal;