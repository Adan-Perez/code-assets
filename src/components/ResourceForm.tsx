'use client';
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AVAILABLE_HOOKS } from '@/app/data/hooks';
import { Link, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    if (selectedTags.length === 0) {
      toast.error('Please select at least one tag');
      return;
    }

    setIsSubmitting(true);

    try {
      const metadata = await fetchMetadata(url);

      await addDoc(collection(db, 'resources'), {
        url,
        tags: selectedTags,
        createdAt: new Date(),
        updatedAt: new Date(),
        title: metadata?.title || '',
        description: metadata?.description || '',
        favicon: metadata?.favicon || '',
        baseUrl: metadata?.baseUrl || '',
        userId: user?.uid || '',
        userDisplayName: user?.displayName || 'Unknown User',
      });

      const selectedWebhooks = selectedTags
        .map((tag) => AVAILABLE_HOOKS[tag])
        .filter((url) => url);

      const discordPayload = {
        username: 'Code Assets Bot 🤖',
        content: `📢 **Nuevo recurso compartido**\n🔗 **URL:** ${url}\n🏷️ **Tags:** ${selectedTags.join(
          ', '
        )}\n✍🏻 **Creado por:** ${user?.displayName || 'Misterioso 🥷🏻'}
        `,
      };

      await Promise.all(
        selectedWebhooks.map((webhook) =>
          axios.post(webhook, discordPayload, {
            headers: { 'Content-Type': 'application/json' },
          })
        )
      );

      setUrl('');
      setSelectedTags([]);
      toast.success('Resource saved and shared on Discord!');
    } catch (error) {
      toast.error('Failed to save resource');
      console.error('Error adding document or sending to Discord:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <Card className='shadow-lg'>
      <CardContent className='p-6 space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='url'>Website URL</Label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Link className='h-5 w-5 text-gray-400' />
            </div>
            <Input
              id='url'
              type='url'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className='pl-10'
              placeholder='https://example.com'
            />
          </div>
        </div>

        <div className='space-y-2'>
          <Label>Tags</Label>
          <div className='flex flex-wrap gap-2'>
            {Object.keys(AVAILABLE_HOOKS).map((name) => (
              <Badge
                key={name}
                onClick={() => toggleTag(name)}
                className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(name)
                    ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}>
                {name}
                {selectedTags.includes(name) ? (
                  <X className='ml-1.5 h-3.5 w-3.5' />
                ) : (
                  <Plus className='ml-1.5 h-3.5 w-3.5' />
                )}
              </Badge>
            ))}
          </div>
        </div>

        <Button onClick={handleSubmit} className='w-full' disabled={isSubmitting}>
          {isSubmitting ? 'Saving & Sending...' : 'Save Resource'}
        </Button>
      </CardContent>
    </Card>
  );
}
