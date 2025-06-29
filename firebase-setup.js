import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBWEY17MNRBjykeLJbmQ-phEblgL0NPK8k",
    authDomain: "blogsubss.firebaseapp.com",
    projectId: "blogsubss",
    storageBucket: "blogsubss.firebasestorage.app",
    messagingSenderId: "418891748590",
    appId: "1:418891748590:web:44c914078d3cded6b50fff"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.myFirestore = {
  saveEmail: async function(email) {
    await addDoc(collection(db, "subscribers"), {
      email: email,
      timestamp: new Date()
    });
  }
};
