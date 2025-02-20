'use client';
import { LoginForm } from '@/components/LoginForm';
import Logo from '@/components/Logo';
import { ResourceForm } from '@/components/ResourceForm';
import { ResourceList } from '@/components/ResourceList';
import { auth } from '@/lib/firebase';
import { AuthUser, useAuthStore } from '@/store/useAuthStore';
import { onAuthStateChanged, updateProfile, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { User2 } from 'lucide-react';
import { mapFirebaseUserToAuthUser } from '@/lib/auth';

const LoadingSpinner = () => (
  <div className='min-h-screen flex items-center justify-center'>
    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600' />
  </div>
);

const Home = () => {
  const { user, loading, setUser, setLoading } = useAuthStore();
  const [newName, setNewName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const authUser = await mapFirebaseUserToAuthUser(user);

        if (!authUser) {
          toast.error('Your account is pending approval. Please wait for an admin.');
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  const updateDisplayName = async () => {
    if (!auth.currentUser || newName.trim() === '') return;

    setIsUpdating(true);
    try {
      await updateProfile(auth.currentUser, { displayName: newName });

      const updatedUser: AuthUser = {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        displayName: newName,
        photoURL: auth.currentUser.photoURL,
      };

      setUser(updatedUser as User);

      toast.success('Nombre actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el nombre:', error);
      toast.error('Error al actualizar el nombre');
    } finally {
      setIsUpdating(false);
    }
  };

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
              Welcome to <span className='text-indigo-600'>Code Assets</span>
            </h2>
          </div>
          <LoginForm />
        </div>
      </div>
    );
  }

  return (
    <>
      <header className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Logo />
              <h1 className='text-2xl font-bold text-gray-900'>Code Assets</h1>
            </div>

            <div className='flex items-center gap-6'>
              <div className='flex items-center gap-3 bg-gray-100 px-3 py-1.5 rounded-md'>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt='User Avatar'
                    className='w-8 h-8 rounded-full border border-gray-300'
                  />
                ) : (
                  <User2 className='w-8 h-8 text-gray-500' />
                )}
                <input
                  type='text'
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className='border border-gray-300 bg-white px-3 py-1 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none'
                  placeholder={user.displayName || 'Nuevo Nombre'}
                />
                <button
                  onClick={updateDisplayName}
                  className='bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 transition disabled:opacity-50'
                  disabled={isUpdating}>
                  {isUpdating ? 'Guardando...' : 'Guardar'}
                </button>
              </div>

              <button
                onClick={() => auth.signOut()}
                className='bg-red-500 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-red-600 transition'>
                Cerrar Sesión
              </button>
            </div>
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
