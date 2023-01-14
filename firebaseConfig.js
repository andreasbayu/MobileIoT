import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA6xjAc0vhvoOIdQlLNV8a4ABm9BSQuSN4",
  authDomain: "responsi-m-iot-praktik.firebaseapp.com",
  databaseURL:
    "https://responsi-m-iot-praktik-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "responsi-m-iot-praktik",
  storageBucket: "responsi-m-iot-praktik.appspot.com",
  messagingSenderId: "717590511882",
  appId: "1:717590511882:web:12c98cc2c7294f2fcdbaf3",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
