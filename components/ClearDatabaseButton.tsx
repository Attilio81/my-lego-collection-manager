import React from 'react';

interface ClearDatabaseButtonProps {
  onClear: () => void;
  disabled?: boolean;
}

const ClearDatabaseButton: React.FC<ClearDatabaseButtonProps> = ({ onClear, disabled = false }) => {
  return (
    <button
      onClick={onClear}
      disabled={disabled}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      title="Clear all sets from database"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
      Clear DB
    </button>
  );
};

export default ClearDatabaseButton;
