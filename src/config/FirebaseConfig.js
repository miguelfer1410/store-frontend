import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importa a função getAuth
import { getFirestore } from "firebase/firestore"; // Importa a função getFirestore



const firebaseConfig = {
  apiKey: "AIzaSyAFrDxhyjuvbQ824uN9DrZMHyOqrp1EhzA",
  authDomain: "store-c2ad1.firebaseapp.com",
  projectId: "store-c2ad1",
  storageBucket: "store-c2ad1.appspot.com",
  messagingSenderId: "119102546211",
  appId: "1:119102546211:web:941c80cdbe13542b162c96",
  measurementId: "G-VEKNYT2GKE"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa a autenticação
const auth = getAuth(app);

// Inicializa o Firestore
const db = getFirestore(app); // Adicione esta linha

export { auth, db }; // Exporta auth e db para uso em outros componentes
