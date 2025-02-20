'use client';
import { Resource } from '@/types';
import { ExternalLink, LucideGlobe } from 'lucide-react';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

const ResourceCard = ({ resource }: { resource: Resource }) => {
  const [imageError, setImageError] = useState(false);
  const handleImageError = () => setImageError(true);

  const baseUrl = resource.baseUrl || 'https://example.com';
  let hostname = 'Unknown';
  try {
    hostname = new URL(baseUrl).hostname;
  } catch (error) {
    console.error('Invalid URL:', baseUrl);
  }

  const title = resource.title || hostname;
  const truncatedTitle = truncateText(title, 80);
  const truncatedTitleMobile = truncateText(title, 50);

  return (
    <Card className='shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out'>
      <CardContent className='p-4 sm:p-6'>
        <div className='flex items-center gap-3 mb-3 sm:mb-4'>
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

          <div className='flex flex-col min-w-0'>
            <a
              href={baseUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-lg font-semibold text-indigo-600 hover:text-indigo-500 flex items-center max-w-full break-words whitespace-normal sm:line-clamp-2'>
              <span className='hidden sm:inline'>{truncatedTitle}</span>
              <span className='sm:hidden'>{truncatedTitleMobile}</span>
              <ExternalLink className='ml-1 h-4 w-4 flex-shrink-0' />
            </a>

            <a
              href={resource.url || '#'}
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-gray-500 hover:text-gray-700 truncate'>
              {hostname}
            </a>
          </div>
        </div>

        {resource.description && (
          <p className='text-sm text-gray-700 mb-3 sm:mb-4 line-clamp-3'>
            {resource.description}
          </p>
        )}

        <div className='flex flex-wrap gap-2 mb-3 sm:mb-4'>
          {resource.tags.map((tag) => (
            <Badge key={tag} variant='outline' className='text-xs'>
              {tag}
            </Badge>
          ))}
        </div>

        <div className='space-y-1 text-xs text-gray-500'>
          <div>
            Added by {resource.userDisplayName || '🥷🏻'} on{' '}
            {new Date(resource.createdAt).toLocaleDateString()}
          </div>
          {resource.updatedAt && (
            <div>Updated on {new Date(resource.updatedAt).toLocaleDateString()}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
