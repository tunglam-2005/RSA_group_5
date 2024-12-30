import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyCIQJ8QJXEje_ZKUbhRM8D-9TJxhrBQJwk",
  authDomain: "rsasurcrecommunication.firebaseapp.com",
  projectId: "rsasurcrecommunication",
  storageBucket: "rsasurcrecommunication.appspot.com",
  messagingSenderId: "163675998598",
  appId: "1:163675998598:web:a32f8e9d361cd20df34407",
  measurementId: "G-QKKPEJ84LF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
