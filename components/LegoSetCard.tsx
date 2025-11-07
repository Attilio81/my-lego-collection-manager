import React from 'react';
import { LegoSet } from '../types';
import { TrashIcon, ExternalLinkIcon } from './Icons';

interface LegoSetCardProps {
  set: LegoSet;
  onDelete: (code: string) => void;
}

const LegoSetCard: React.FC<LegoSetCardProps> = ({ set, onDelete }) => {
  const placeholderUrl = `https://picsum.photos/seed/${set.code}/400/300`;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-1 transition-transform duration-300 ease-in-out flex flex-col">
      <div className="relative">
        <img
          className="w-full h-48 object-cover bg-gray-700"
          src={set.imageUrl || placeholderUrl}
          alt={set.legoName}
          onError={(e) => { (e.target as HTMLImageElement).src = placeholderUrl; }}
        />
        <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 font-bold px-2 py-1 rounded-md text-sm shadow-md">
          #{set.code}
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-white truncate" title={set.requestedName}>
          {set.requestedName}
        </h3>
        <p className="text-sm text-gray-400 mb-2 truncate" title={set.legoName}>
          {set.legoName}
        </p>
        {set.note && (
          <p className="text-xs bg-gray-700 text-yellow-300 p-2 rounded-md mb-4 flex-grow">
            <span className="font-bold">Note:</span> {set.note}
          </p>
        )}
        <div className="mt-auto pt-4 flex justify-between items-center space-x-2">
          <a
            href={set.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 transition-colors"
          >
            <ExternalLinkIcon className="w-4 h-4 mr-2" />
            View on LEGO.com
          </a>
          <button
            onClick={() => onDelete(set.code)}
            aria-label={`Delete ${set.requestedName}`}
            className="p-2 text-gray-400 bg-gray-700 rounded-md hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800 transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegoSetCard;
