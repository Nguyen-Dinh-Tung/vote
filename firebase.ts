import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'
const firebaseConfig = {
  apiKey: "AIzaSyC_IhkAjZb_lxAc8GEWwzEc_8g6D9tV8pg",
  authDomain: "fir-2c753.firebaseapp.com",
  projectId: "fir-2c753",
  storageBucket: "fir-2c753.appspot.com",
  messagingSenderId: "162329946498",
  appId: "1:162329946498:web:5d5f181c8be3cb2964479b",
  measurementId: "G-EW0D63BTVY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)