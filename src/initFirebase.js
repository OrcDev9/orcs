
import React from 'react'
import { initializeApp } from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
require('dotenv').config();

const googleApi = process.env.REACT_APP_GOOGLE_KEY;
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: googleApi,
  authDomain: "ether-orcs.firebaseapp.com",
  projectId: "ether-orcs",
  storageBucket: "ether-orcs.appspot.com",
  messagingSenderId: "708221352758",
  appId: "1:708221352758:web:c782b00d76867f4649d197",
  measurementId: "G-YY8XC9Z6CR",
  databaseURL: "https://ether-orcs-default-rtdb.europe-west1.firebasedatabase.app/",
  
  };


  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const analytics = getAnalytics(app);

export { app, db, analytics }
