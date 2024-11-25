'use client';
import { LoginForm } from '@/components/LoginForm';
import Logo from '@/components/Logo';
import { ResourceForm } from '@/components/ResourceForm';
import { ResourceList } from '@/components/ResourceList';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

const LoadingSpinner = () => (
  <div className='min-h-screen flex items-center justify-center'>
    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600' />
  </div>
);

const Home = () => {
  const { user, loading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
          <div className='text-center'>
            <div className='flex justify-center items-center'>
              <Logo width={48} height={48} backgroundColor='indigo-600' />
            </div>
            <h2 className='mt-6 text-3xl font-bold text-slate-900'>
              Sign in to Code Assets
            </h2>
          </div>
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position='top-right' />
      <header className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <Logo />
              <h1 className='ml-3 text-2xl font-bold text-gray-900'>Code Assets</h1>
            </div>
            <button
              onClick={() => auth.signOut()}
              className='text-sm text-gray-600 hover:text-gray-900'>
              Sign out ({user.email})
            </button>
          </div>
        </div>
      </header>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid gap-8 md:grid-cols-[350px,1fr] items-start'>
          <ResourceForm />
          <ResourceList />
        </div>
      </main>
    </>
  );
};

export default Home;
