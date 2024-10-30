import { getDoc, doc } from "firebase/firestore";
import { db } from "../config/FirebaseConfig"; // ajuste os caminhos conforme necessário

const getUserRole = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    console.log(userDoc)
    if (userDoc.exists()) {
        console.log(userDoc.data().role)
        return userDoc.data().role; // Retorna o papel do usuário
    }
    return null; // Se o documento não existir
};

export default getUserRole
