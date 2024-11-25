'use client';

import { Resource } from '@/types';
import { ExternalLink, LucideGlobe } from 'lucide-react';
import React, { useState } from 'react';

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out'>
      <div className='flex items-center gap-3 mb-4'>
        {resource.favicon && !imageError ? (
          <img
            src={resource.favicon}
            alt='Favicon'
            className='w-8 h-8 rounded-full object-cover flex-shrink-0'
            onError={handleImageError}
          />
        ) : (
          <LucideGlobe className='w-8 h-8 text-gray-600 flex-shrink-0' />
        )}
        {resource.baseUrl && (
          <div className='flex flex-col min-w-0'>
            <a
              href={resource.baseUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-lg font-semibold text-indigo-600 hover:text-indigo-500 truncate'>
              {resource.title || new URL(resource.baseUrl).hostname}
              <ExternalLink className='ml-1 inline-block h-4 w-4 flex-shrink-0' />
            </a>

            <a
              href={resource.url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-gray-500 hover:text-gray-700 truncate'>
              {new URL(resource.url).hostname}
            </a>
          </div>
        )}
      </div>

      {resource.description && (
        <p className='text-sm text-gray-700 mb-4'>{resource.description}</p>
      )}

      <div className='flex flex-wrap gap-2 mb-4'>
        {resource.tags.map((tag) => (
          <span
            key={tag}
            className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
            {tag}
          </span>
        ))}
      </div>

      <div className='space-y-1 text-xs text-gray-500'>
        <div>
          Added by {resource.userEmail?.split('@')[0]} on{' '}
          {resource.createdAt.toLocaleDateString()}
        </div>
        {resource.updatedAt && (
          <div>Updated on {resource.updatedAt.toLocaleDateString()}</div>
        )}
      </div>
    </div>
  );
};

export default ResourceCard;
