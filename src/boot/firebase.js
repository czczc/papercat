import { boot } from "quasar/wrappers";

import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD09QJBZIXtg9ar2YUzoPP2DcRvr0mD-70",
  authDomain: "firebasics-a3f9d.firebaseapp.com",
  projectId: "firebasics-a3f9d",
  storageBucket: "firebasics-a3f9d.appspot.com",
  messagingSenderId: "344596307239",
  appId: "1:344596307239:web:4e097389ec80cca1839d02",
  measurementId: "G-TCGBXYWDTC",
};

// Initialize Firebase
initializeApp(firebaseConfig);

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { ref } from "vue";

// refs
const auth = getAuth();
const user = ref(auth.currentUser);

// auth changes
onAuthStateChanged(auth, (_user) => {
  console.log("User changed to:", _user);
  user.value = _user;
});

const db = getFirestore();

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  // something to do
});

export { auth, user, db };
