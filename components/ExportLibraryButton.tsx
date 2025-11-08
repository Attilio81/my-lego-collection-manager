import React from 'react';

interface ExportLibraryButtonProps {
  onExport: () => void;
  disabled: boolean;
}

const ExportLibraryButton: React.FC<ExportLibraryButtonProps> = ({ onExport, disabled }) => {
  return (
    <button
      onClick={onExport}
      disabled={disabled}
      className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Esporta Libreria
    </button>
  );
};

export default ExportLibraryButton;
