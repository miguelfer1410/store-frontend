import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/FirebaseConfig';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import '../style/AccountData.css';

const AccountDataComponent = () => {
    const [userData, setUserData] = useState(null);
    const [personalData, setPersonalData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        nif: '',
        gender: '',
        birthDate: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setUserData(data);
                        setPersonalData({
                            firstName: data.firstName || '',
                            lastName: data.lastName || '',
                            email: data.email || '',
                            phone: data.phone || '',
                            nif: data.nif || '',
                            gender: data.gender || '',
                            birthDate: data.birthDate || ''
                        });
                    }
                } catch (error) {
                    console.error("Erro ao buscar dados do usuário: ", error);
                }
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPersonalData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (user) {
            try {
                await updateDoc(doc(db, "users", user.uid), {
                    firstName: personalData.firstName,
                    lastName: personalData.lastName,
                    email: personalData.email,
                    phone: personalData.phone,
                    nif: personalData.nif,
                    gender: personalData.gender,
                    birthDate: personalData.birthDate
                });
                setUserData({ ...userData, ...personalData });
                alert('Dados atualizados com sucesso!');
            } catch (error) {
                console.error("Erro ao atualizar dados pessoais: ", error);
            }
        }
    };

    return (
        <div className="account-data-section">
            <h2>Dados Pessoais</h2>
            {userData ? (
                <form onSubmit={handleSaveChanges}>
                    <label htmlFor="firstName">Primeiro Nome</label>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Primeiro Nome"
                        value={personalData.firstName}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="lastName">Último Nome</label>
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Último Nome"
                        value={personalData.lastName}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="birthDate">Data de Nascimento</label>
                    <input
                        type="date"
                        name="birthDate"
                        value={personalData.birthDate}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={personalData.email}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="gender">Gênero</label>

                    <select
                        name="gender"
                        value={personalData.gender}
                        onChange={handleInputChange}
                        required
                        style={{marginBottom:10, height:40, borderRadius:5, borderColor:'lightgray'}}
                    >
                        <option value="">Selecione</option>
                        <option value="male">Masculino</option>
                        <option value="female">Feminino</option>
                        <option value="other">Outro</option>
                    </select>

                    <label htmlFor="phone">Telefone</label>
                    <input
                        type="text"
                        name="phone"
                        placeholder="Telefone"
                        value={personalData.phone}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="nif">NIF</label>
                    <input
                        type="text"
                        name="nif"
                        placeholder="NIF"
                        value={personalData.nif}
                        onChange={handleInputChange}
                        required
                    />

                    

                    

                    <button type="submit">Salvar Alterações</button>
                </form>
            ) : (
                <p>Carregando dados do usuário...</p>
            )}
        </div>
    );
};

export default AccountDataComponent;
