import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/FirebaseConfig';
import { doc, getDoc , updateDoc} from "firebase/firestore";
import '../style/AddressList.css';


const AddressListComponent = () => {
    const [userData, setUserData] = useState(null);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
    const [newAddress, setNewAddress] = useState({
        addressType: '',
        street: '',
        doorNumber: '',
        floor: '',
        postalCode: '',
        city: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                        setSelectedAddressIndex(0); // Usa o primeiro endereço por padrão
                    }
                } catch (error) {
                    console.error("Erro ao buscar dados do usuário: ", error);
                }
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        // Preenche o formulário com o endereço selecionado
        if (userData && selectedAddressIndex !== null) {
            const selectedAddress = userData.addresses[selectedAddressIndex];
            setNewAddress(selectedAddress);
        }
    }, [userData, selectedAddressIndex]);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value
        }));
    };

    const handleAddressSelect = (index) => {
        setSelectedAddressIndex(index);  // Atualiza o índice do endereço selecionado
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;

        if (user && selectedAddressIndex !== null) {
            try {
                const updatedAddresses = userData.addresses.map((address, idx) =>
                    idx === selectedAddressIndex ? newAddress : address
                );

                await updateDoc(doc(db, "users", user.uid), {
                    addresses: updatedAddresses
                });

                setUserData({ ...userData, addresses: updatedAddresses });
            } catch (error) {
                console.error("Erro ao salvar as alterações: ", error);
            }
        }
    };

    const handleAddAddress = () => {
        // Reseta os valores do newAddress para vazio e ajusta o selectedAddressIndex para null
        setNewAddress({
            addressType: '',
            street: '',
            doorNumber: '',
            floor: '',
            postalCode: '',
            city: ''
        });
        setSelectedAddressIndex(null); // Nenhum endereço está selecionado enquanto cria um novo
    };

    const handleAddNewAddress = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;

        if (user) {
            try {
                // Adiciona o novo endereço ao array de endereços
                const updatedAddresses = [...userData.addresses, newAddress];

                await updateDoc(doc(db, "users", user.uid), {
                    addresses: updatedAddresses
                });

                setUserData({ ...userData, addresses: updatedAddresses });

                // Limpa os campos de entrada
                setNewAddress({
                    addressType: '',
                    street: '',
                    doorNumber: '',
                    floor: '',
                    postalCode: '',
                    city: ''
                });
            } catch (error) {
                console.error("Erro ao adicionar o endereço: ", error);
            }
        }
    };

    return (
        <div className="manage-profile-container">
            <div className="addresses-section">
                <div className="address-list">
                    <h2>Endereços</h2>
                    {userData && userData.addresses && userData.addresses.length > 0 ? (
                        userData.addresses.map((address, index) => (
                            <div 
                                key={index} 
                                className={`address-item ${selectedAddressIndex === index ? 'selected' : ''}`} // Adiciona uma classe para destacar o selecionado
                                onClick={() => handleAddressSelect(index)} // Seleciona o endereço ao clicar
                            >
                                <p><strong>{address.addressType}</strong></p>
                                <p>{address.street}, {address.doorNumber}</p>
                                <p>{address.floor}</p>
                                <p>{address.city}, {address.postalCode}</p>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum endereço cadastrado.</p>
                    )}
                    <button onClick={handleAddAddress}>Adicionar Endereço</button>
                </div>

                <div className="address-edit-section">
                    <h2>{selectedAddressIndex === null ? "Adicionar Novo Endereço" : "Editar Endereço"}</h2>
                    <form onSubmit={selectedAddressIndex === null ? handleAddNewAddress : handleSaveChanges}>
                        <select
                            name="addressType"
                            value={newAddress.addressType || ''}
                            onChange={handleAddressChange}
                        >
                            <option value="">Selecionar Tipo de Morada</option>
                            <option value="Residencial">Residencial</option>
                            <option value="Empresarial">Empresarial</option>
                        </select>
                        <input
                            type="text"
                            name="street"
                            placeholder="Rua"
                            value={newAddress?.street || ''}
                            onChange={handleAddressChange}
                        />
                        <input
                            type="text"
                            name="doorNumber"
                            placeholder="Número da Porta"
                            value={newAddress?.doorNumber || ''}
                            onChange={handleAddressChange}
                        />
                        <input
                            type="text"
                            name="floor"
                            placeholder="Andar"
                            value={newAddress?.floor || ''}
                            onChange={handleAddressChange}
                        />
                        <input
                            type="text"
                            name="postalCode"
                            placeholder="Código Postal"
                            value={newAddress?.postalCode || ''}
                            onChange={handleAddressChange}
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder="Cidade"
                            value={newAddress?.city || ''}
                            onChange={handleAddressChange}
                        />
                        <button type="submit">
                            {selectedAddressIndex === null ? "Adicionar Endereço" : "Salvar Alterações"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddressListComponent;
