import React, { useState } from 'react';
import AddressListComponent from './AddressListComponent';
import AccountDataComponent from './AccountDataComponent';
import '../style/ManageProfile.css';
import OrderListComponent from './OrderListComponent';

const ManageProfile = ({option}) => {
    const [selectedSection, setSelectedSection] = useState(option); // Por padrão, abre a Lista de Endereços

    return (
        <div className="manage-profile-container">
            <div className="buttons-section">
                <button
                    className={`profile-button ${selectedSection === 'addressList' ? 'active' : ''}`}
                    onClick={() => setSelectedSection('addressList')}
                >
                    Lista de Endereços
                </button>
                <button
                    className={`profile-button ${selectedSection === 'accountData' ? 'active' : ''}`}
                    onClick={() => setSelectedSection('accountData')}
                >
                    Dados da Conta
                </button>
                <button
                    className={`profile-button ${selectedSection === 'ordersList' ? 'active' : ''}`}
                    onClick={() => setSelectedSection('ordersList')}
                >
                    As Minhas Encomendas
                </button>
            </div>

            {/* Exibe o componente com base no botão selecionado */}
            <div className="profile-content">
                {selectedSection === 'addressList' && <AddressListComponent />}
                {selectedSection === 'accountData' && <AccountDataComponent />}
                {selectedSection === 'ordersList' && <OrderListComponent />}
            </div>
        </div>
    );
};

export default ManageProfile;
