import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL: string | null;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: User | AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      setUser: (user) =>
        set({
          user: user
            ? {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || 'Usuario sin nombre',
                photoURL: user.photoURL || null,
              }
            : null,
        }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
