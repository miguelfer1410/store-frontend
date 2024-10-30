import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    onAuthStateChanged, 
    signOut,  // Adicione esta importação
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from '../config/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // Função de logout
    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
        } catch (error) {
            console.error("Erro no logout:", error);
            throw error;
        }
    };

    // Função de login
    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setIsAdmin(userData.role === 'admin');
            }
            
            return userCredential.user;
        } catch (error) {
            console.error("Erro no login:", error);
            throw error;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                setIsAuthenticated(true);
                
                // Verificar se é admin
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setIsAdmin(userData.role === 'admin');
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
                setIsAdmin(false);
            }
            setLoading(false);
            console.log('Auth State Changed:', { user, isAuthenticated: !!user });
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        isAuthenticated,
        isAdmin,
        loading,
        login,    // Adicione as funções ao contexto
        logout,   // Adicione as funções ao contexto
        currentUser: user // Adicione currentUser para compatibilidade
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
