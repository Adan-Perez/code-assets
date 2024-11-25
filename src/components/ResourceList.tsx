'use client';
import { useEffect, useState, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Resource } from '@/types';
import { Tag } from 'lucide-react';
import ResourceCard from './ResourceCard';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const resourcesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Resource[];

      setResources(resourcesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredResources = resources.filter(
    (resource) =>
      selectedTags.length === 0 ||
      selectedTags.some((tag) => resource.tags.includes(tag))
  );

  const allTags = useMemo(() => {
    return Array.from(new Set(resources.flatMap((r) => r.tags)));
  }, [resources]);

  return (
    <div className='space-y-6'>
      {loading ? (
        <div className='flex flex-wrap gap-2 mb-4'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width={350} height={150} />
          ))}
        </div>
      ) : (
        <>
          <div className='flex flex-wrap gap-2 mb-4'>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setSelectedTags((prev) =>
                    prev.includes(tag)
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag]
                  )
                }
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    selectedTags.includes(tag)
                      ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}>
                <Tag className='mr-2 h-4 w-4' />
                {tag}
              </button>
            ))}
          </div>

          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
