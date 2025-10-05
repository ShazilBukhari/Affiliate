Step 1 :- 
VITE_FIREBASE_CONFIG='{"apiKey":"AIzaSyAapnaKey","authDomain":"your-project.firebaseapp.com","projectId":"your-project-id"}'<----
VITE_APP_ID=zentrodeals<----
VITE_ADMIN_PASS=admin123<----
🔁 Replace the Firebase config values with your actual ones.

Step 2 :-
const firebaseConfig =
  typeof __firebase_config !== "undefined"
    ? JSON.parse(__firebase_config)<---
    : JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);<----
Step 3:- 
const appId = import.meta.env.VITE_APP_ID || "zentrodeals";<------
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASS || "admin123";<-----
npm run dev


✅ Bas itna hi karna hai.

Agar yeh 5 step tune kar liye, toh tujhe aur kuch nahi chhedna.
Sab feature: login, product add/delete, filtering, sab kaam karega ✅





const firebaseConfig = {
  apiKey: "AIzaSyBLrWOEdyapjwmdE3XzUkGddLS3SzsdMPE",
  authDomain: "shazil111.firebaseapp.com",
  projectId: "shazil111",
  storageBucket: "shazil111.firebasestorage.app",
  messagingSenderId: "70565287439",
  appId: "1:70565287439:web:0408f97786e468ac2db57a",
  measurementId: "G-FYX4QMEFZV"
};