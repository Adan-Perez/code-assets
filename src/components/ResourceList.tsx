'use client';
import { useEffect, useState, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Resource } from '@/types';
import { Tag } from 'lucide-react';
import ResourceCard from './ResourceCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

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
      <div className='flex flex-wrap gap-2 mb-4'>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='h-8 w-20 rounded-full' />
            ))
          : allTags.map((tag) => (
              <Badge
                key={tag}
                onClick={() =>
                  setSelectedTags((prev) =>
                    prev.includes(tag)
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag]
                  )
                }
                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}>
                <Tag className='mr-2 h-4 w-4' />
                {tag}
              </Badge>
            ))}
      </div>

      {loading ? (
        <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className='h-[250px] w-full rounded-md' />
          ))}
        </div>
      ) : (
        <motion.div layout className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          <AnimatePresence>
            {filteredResources.map((resource) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                layout>
                <ResourceCard resource={resource} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
