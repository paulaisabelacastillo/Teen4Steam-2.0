import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDzhvEZsjnFVD237Gen7frLii6RdvApB7g",
  authDomain: "teen4steam-64958.firebaseapp.com",
  projectId: "teen4steam-64958",
  storageBucket: "teen4steam-64958.firebasestorage.app",
  messagingSenderId: "840465508724",
  appId: "1:840465508724:web:8e5f60a81ecb8e549da421",
  measurementId: "G-Y03XVR5EES"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const submit = document.getElementById('submit');
submit.addEventListener("click", function (event) {
  event.preventDefault()

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

        const user = userCredential.user;
      alert("Creating Account...")
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
      // ..
    });

})