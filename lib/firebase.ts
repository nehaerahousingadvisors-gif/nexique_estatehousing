import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBzGIxVu5UQBpfYJKA48hRX88rOjGXsPUA",
  authDomain: "newerahousingadvisors.firebaseapp.com",
  projectId: "newerahousingadvisors",
  storageBucket: "newerahousingadvisors.firebasestorage.app",
  messagingSenderId: "7355386415",
  appId: "1:7355386415:web:2272ed64c71a26da21d4da",
  measurementId: "G-FRPVKQRKHC"
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
