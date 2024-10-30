import React, { useState, useEffect, useContext } from 'react';
import { auth, db } from '../config/FirebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import '../style/Checkout.css'; // Importar o estilo apropriado
import { Context } from '../context/Context';

const CheckoutComponent = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0); // Armazena o índice do endereço selecionado
    const {state} = useContext(Context);

    // Função para buscar os endereços do Firebase
    const fetchAddresses = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setAddresses(data.addresses); // Lista de endereços do usuário
                    setSelectedAddressIndex(0); // Seleciona o principal por padrão
                }
            } catch (error) {
                console.error('Erro ao buscar os endereços:', error);
            }
        }
    };

    // Carregar endereços ao montar o componente
    useEffect(() => {
        fetchAddresses();
    }, []);

    // Lida com a alteração do endereço selecionado
    const handleAddressChange = (event) => {
        setSelectedAddressIndex(parseInt(event.target.value)); // Armazena o índice selecionado
    };

    return (
        <div>
            <div className="checkoutContainer">
                
                {/* Sessão de envio */}
                <div className="shippingSection">
                <h1>Checkout</h1>

                    <h2>Endereço de Envio</h2>

                    {/* Seleção de outro endereço */}
                    <div className="selectAddress">
                        <h3>Selecionar endereço:</h3>
                        <select value={selectedAddressIndex} onChange={handleAddressChange}>
                            {addresses.map((address, index) => (
                                <option key={index} value={index}>
                                    {`${address.street}, ${address.doorNumber} ${address.floor}, ${address.postalCode}, ${address.city} `}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Exibir endereço selecionado */}
                    <div className="selectedAddressSection">
                        <h3>Endereço selecionado:</h3>
                        {addresses[selectedAddressIndex] && (
                            <p>{`${addresses[selectedAddressIndex].street}, ${addresses[selectedAddressIndex].doorNumber} ${addresses[selectedAddressIndex].floor},  ${addresses[selectedAddressIndex].postalCode}, ${addresses[selectedAddressIndex].city}`}</p>
                        )}
                    </div>
                </div>

                {/* Resumo do pedido */}
                <div className="orderSummarySection">
                    <h2>Resumo do Pedido</h2>  
                    {state.cartItems.length > 0 && (
                        state.cartItems.map(product => (
                            <div key={product.id} className="productSummary">
                                <h5>{product.name}</h5>    
                            </div>
                        ))
                    )}
                   
                    <h5>Total: {state.totalPrice}€</h5>
                    <button className="checkoutButton">Finalizar Compra</button>

                </div>

                {/* Botão para Finalizar Compra */}
            </div>
        </div>
    );
};

export default CheckoutComponent;
