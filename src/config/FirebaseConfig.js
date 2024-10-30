import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importa a função getAuth
import { getFirestore } from "firebase/firestore"; // Importa a função getFirestore



// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa a autenticação
const auth = getAuth(app);

// Inicializa o Firestore
const db = getFirestore(app); // Adicione esta linha

export { auth, db }; // Exporta auth e db para uso em outros componentes
