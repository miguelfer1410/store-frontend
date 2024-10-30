import React from 'react';
import Header from '../components/Header';
import MessageComponent from '../components/MessageComponent';
import '../style/MessageScreen.css'; // Vamos criar este arquivo para estilos específicos da tela de mensagens

const MessageScreen = () => {
    return (
        <div className="message-screen">
            <Header />
            <div className="message-content">
                <MessageComponent />
            </div>
        </div>
    );
};

export default MessageScreen;
