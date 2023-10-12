// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{getFirestore} from"firebase/firestore";
import {getAuth,GoogleAuthProvider}from 'firebase/auth';
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwmjBl4fZWeAAeJV2OCRWN0T8UTcduVCY",
  authDomain: "blogproject-e5ad7.firebaseapp.com",
  projectId: "blogproject-e5ad7",
  storageBucket: "blogproject-e5ad7.appspot.com",
  messagingSenderId: "994173997959",
  appId: "1:994173997959:web:3313ced9b6b3f5aa1e3922"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db=getFirestore(app);
export const auth=getAuth(app);
export const storage= getStorage(app);
export const provider=new GoogleAuthProvider();
