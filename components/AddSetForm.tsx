import React, { useState, useEffect } from 'react';
import { LegoSet } from '../types';
import { CloseIcon } from './Icons';

interface AddSetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSet: (data: { code: string; name: string; productUrl?: string }) => void;
}

const AddSetForm: React.FC<AddSetFormProps> = ({ isOpen, onClose, onAddSet }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Set Code is required.');
      return;
    }
    onAddSet({
      code: code.trim(),
      name: `LEGO Set ${code.trim()}`,
      productUrl: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity" onClick={onClose}>
      <div 
        className="bg-gray-800 text-white rounded-xl shadow-2xl w-full max-w-md transform transition-all" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-yellow-400">Add a New LEGO Set</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <CloseIcon className="w-6 h-6" />
            </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-md text-sm">{error}</p>}
            <div>
                <label htmlFor="setCode" className="block text-sm font-medium text-gray-300">Set Code</label>
                <input
                    type="text"
                    id="setCode"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., 75313 or 76287"
                    required
                    autoFocus
                />
                <p className="mt-2 text-xs text-gray-400">Enter the set number. Details will be fetched automatically from Rebrickable.</p>
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-800 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 transition-colors"
                >
                    Add Set
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddSetForm;
