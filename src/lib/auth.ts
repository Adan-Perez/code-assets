import { auth, db } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { AuthUser } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import axios from 'axios';

export const mapFirebaseUserToAuthUser = async (
  user: User
): Promise<AuthUser | null> => {
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  const userData = userDoc.data();

  if (userData?.isApproved) {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'Usuario sin nombre',
      photoURL: user.photoURL,
    };
  } else {
    await firebaseSignOut(auth);
    return null;
  }
};

export const loginWithEmail = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return (await mapFirebaseUserToAuthUser(userCredential.user)) as AuthUser;
  } catch (error) {
    throw error;
  }
};

export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<{ success: boolean }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await updateProfile(user, { displayName });

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      isApproved: false,
    });

    await axios.post(
      process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_PENDING_USER as string,
      {
        content: `📢 **Nuevo usuario registrado**\n📧 **Email:** ${email}\n👤 **Nombre:** ${displayName}\n⚠️ **Pendiente de aprobación**`,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    await firebaseSignOut(auth);

    toast.success(
      `Your account: ${email} has been created. Please wait for an admin to approve it.`
    );

    return {
      success: true,
    };
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw error;
  }
};
