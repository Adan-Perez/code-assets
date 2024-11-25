'use client';
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AVAILABLE_TAGS } from '@/types';
import { Link, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const fetchMetadata = async (url: string) => {
  try {
    const { data } = await axios.get(`/api/metadata`, { params: { url } });

    return data;
  } catch (error) {
    console.error('Error fetching metadata:', error);
  }
};

export function ResourceForm() {
  const user = useAuthStore((state) => state.user);
  const [url, setUrl] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    if (selectedTags.length === 0) {
      toast.error('Please select at least one tag');
      return;
    }

    try {
      const metadata = await fetchMetadata(url);

      await addDoc(collection(db, 'resources'), {
        url: url,
        tags: selectedTags.map((tag) => tag.toLowerCase()),
        createdAt: new Date(),
        updatedAt: new Date(),
        title: metadata.title,
        description: metadata.description,
        favicon: metadata.favicon,
        baseUrl: metadata.baseUrl,
        userId: user?.uid || '',
        userEmail: user?.email || '',
      });

      setUrl('');
      setSelectedTags([]);
      toast.success('Resource saved successfully!');
    } catch (error) {
      toast.error('Failed to save resource');
      console.error('Error adding document: ', error);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <>
      <div className='space-y-6 bg-white rounded-xl shadow-lg p-6'>
        <div className='space-y-2'>
          <label htmlFor='url' className='block text-sm font-medium text-gray-700'>
            Website URL
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Link className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='url'
              id='url'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              placeholder='https://example.com'
            />
          </div>
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>Tags</label>
          <div className='flex flex-wrap gap-2'>
            {AVAILABLE_TAGS.map((tag) => (
              <button
                key={tag}
                type='button'
                onClick={() => toggleTag(tag)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${
                  selectedTags.includes(tag)
                    ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}>
                {tag}
                {selectedTags.includes(tag) ? (
                  <X className='ml-1.5 h-3.5 w-3.5' />
                ) : (
                  <Plus className='ml-1.5 h-3.5 w-3.5' />
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'>
          Save Resource
        </button>
      </div>
    </>
  );
}
