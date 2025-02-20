'use client';
import { useState, FormEvent } from 'react';
import { loginWithEmail, registerWithEmail } from '@/lib/auth';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import { User } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password || (isRegistering && !displayName)) {
      toast.error('Please fill all fields.');
      return;
    }

    const toastId = toast.loading('Processing...');

    try {
      if (isRegistering) {
        const { success } = await registerWithEmail(email, password, displayName);
        if (success) {
          setIsRegistering(false);
          toast.dismiss(toastId);
          return;
        }
      } else {
        const user = await loginWithEmail(email, password);
        setUser(user as User);
      }
      toast.dismiss(toastId);
    } catch (error: unknown) {
      toast.dismiss(toastId);
      let errorMessage = 'An error occurred.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='max-w-md mx-auto'>
      <Card className='shadow-lg'>
        <CardContent className='p-6 space-y-6'>
          <h2 className='text-2xl font-bold text-gray-900 text-center'>
            {isRegistering ? 'Create an Account' : 'Sign in'}
          </h2>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {isRegistering && (
              <div>
                <Label htmlFor='displayName'>Display Name</Label>
                <Input
                  id='displayName'
                  type='text'
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder='Your Name'
                />
              </div>
            )}

            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='your@email.com'
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='••••••••'
              />
            </div>

            <Button type='submit' className='w-full'>
              {isRegistering ? 'Create Account' : 'Sign in'}
            </Button>
          </form>

          <p className='text-sm text-gray-600 text-center'>
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type='button'
              onClick={() => setIsRegistering(!isRegistering)}
              className='text-indigo-600 hover:underline transition'>
              {isRegistering ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
