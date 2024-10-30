import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../context/Context';
import { useAuth } from '../auth/AuthContext';
import '../style/MessageComponent.css';

const MessageComponent = () => {
    const { currentUser } = useAuth();
    const { state, dispatch } = useContext(Context);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (currentUser && !state.userId) {
            dispatch({ type: 'SET_USERID', payload: currentUser.uid });
        }
    }, [currentUser]);

    useEffect(() => {

        if (state.userId) {
            fetchConversations();
        }
    }, [state.userId]);

    const fetchConversations = async () => {
        try {
            const response = await fetch(`http://localhost:5190/api/conversations/user/${state.userId}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar conversas');
            }
            const data = await response.json();
            setConversations(data);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const response = await fetch(`http://localhost:5190/api/conversations/${conversationId}/messages`);
            if (!response.ok) {
                throw new Error('Erro ao buscar mensagens');
            }
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const handleConversationClick = (conversation) => {
        setSelectedConversation(conversation);
        fetchMessages(conversation.id);
    };

    const handleNewMessageChange = (e) => {
        setNewMessage(e.target.value);
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await fetch(`http://localhost:5190/api/conversations/${selectedConversation.id}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: newMessage,
                    isFromAdmin: false,
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar mensagem');
            }

            const updatedMessages = await response.json();
            setMessages(updatedMessages);
            setNewMessage('');
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    return (
        <div className="message-component">
            <div className="conversations-list">
                <h2>Mensagens</h2>
                {conversations.map((conversation) => (
                    <div
                        key={conversation.id}
                        className={`conversation-item ${selectedConversation?.id === conversation.id ? 'selected' : ''}`}
                        onClick={() => handleConversationClick(conversation)}
                    >
                        <p>{conversation.product.name}</p>
                    </div>
                ))}
            </div>
            <div className="messages-area">
                {selectedConversation ? (
                    <>
    
                        <div className="messages-list">
                            {messages.map((message) => (
                                <div key={message.id} className={`message ${message.isFromAdmin ? 'admin' : 'user'}`}>
                                    <p>{message.content}</p>
                                    <small>{new Date(message.timestamp).toLocaleString()}</small>
                                </div>
                            ))}
                        </div>
                        <div className="new-message-form">
                            <textarea
                                value={newMessage}
                                onChange={handleNewMessageChange}
                                placeholder="Digite sua mensagem..."
                            />
                            <button onClick={sendMessage}>Enviar</button>
                        </div>
                    </>
                ) : (
                    <div className="no-conversation-selected">
                        <p>Selecione uma conversa para ver as mensagens.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageComponent;
