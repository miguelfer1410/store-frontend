import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

// No início do arquivo, importe o som de notificação
const notificationSound = new Audio('/notification.mp3'); // Você precisará adicionar este arquivo ao seu projeto

const AdminComponent = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [messages, setMessages] = useState([]); // Estado para armazenar as mensagens do administrador
    const [selectedMessage, setSelectedMessage] = useState(null); // Estado para armazenar a mensagem selecionada
    const [response, setResponse] = useState(''); // Estado para armazenar a resposta à mensagem
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [conversationMessages, setConversationMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [lastCheckedTimestamp, setLastCheckedTimestamp] = useState(localStorage.getItem('lastCheckedTimestamp') || new Date().toISOString());

    const addNewProduct = () => {
        navigate('/add');
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5190/api/products');
            if (!response.ok) {
                throw new Error('Erro ao buscar produtos');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error(error);
        }
    };


    const fetchConversations = async () => {
        try {
            const response = await fetch('http://localhost:5190/api/conversations');
            if (!response.ok) {
                throw new Error('Erro ao buscar conversas');
            }
            const data = await response.json();
            setConversations(data);
            console.log(data)
        } catch (error) {
            console.error(error);
        }
    };


    const fetchAdminMessages = async () => {
        try {
            const response = await fetch('http://localhost:5190/api/messages/admin'); // Supõe que as mensagens com isFromAdmin=false são as recebidas pelo admin
            if (!response.ok) {
                throw new Error('Erro ao buscar mensagens do administrador');
            }
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            const response = await fetch(`http://localhost:5190/api/products/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Erro ao deletar produto');
            }
            setProducts(products.filter(product => product.id !== id));
        } catch (error) {
            console.error(error);
        }
    };


    const handleConversationClick = async (conversation) => {
        setSelectedConversation(conversation);
        try {
            const response = await fetch(`http://localhost:5190/api/conversations/${conversation.id}/messages`);
            if (!response.ok) {
                throw new Error('Erro ao buscar mensagens da conversa');
            }
            const data = await response.json();
            setConversationMessages(data);
        } catch (error) {
            console.error(error);
        }
    };

    const closeOverlay = () => {
        setSelectedConversation(null);
        setConversationMessages([]);
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
                    isFromAdmin: true,
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar mensagem');
            }

            // Atualiza a lista de mensagens
            const updatedMessages = await response.json();
            setConversationMessages(updatedMessages);
            setNewMessage('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Previne a quebra de linha padrão
            sendMessage();
        }
    };

    const checkNewMessages = async () => {
        try {
            const response = await fetch('http://localhost:5190/api/conversations/unread');
            if (!response.ok) {
                throw new Error('Erro ao verificar novas mensagens');
            }
            const data = await response.json();
            
            setUnreadMessages(data.count);
            
            // Atualizar o indicador visual nas conversas
            const updatedConversations = conversations.map(conv => ({
                ...conv,
                hasNewMessages: data.conversationIds.includes(conv.id)
            }));
            setConversations(updatedConversations);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchConversations();
    }, []);

    useEffect(() => {
        checkNewMessages();
        const interval = setInterval(checkNewMessages, 5000); // Verifica a cada 5 segundos
        
        return () => clearInterval(interval);
    }, []);

    // Adicione este useEffect inicial do componente
    useEffect(() => {
        // Solicitar permissão para notificações
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
        
        // ... resto do código
    }, []);

    const renderMessagesTitle = () => (
        <div style={styles.messagesHeader}>
            <h3>Mensagens</h3>
            {unreadMessages > 0 && (
                <span style={styles.unreadBadge}>{unreadMessages}</span>
            )}
        </div>
    );

    const renderConversationCard = (conversation) => (
        <div 
            key={conversation.id} 
            style={{
                ...styles.conversationCard,
                ...(conversation.hasNewMessages && styles.unreadConversation)
            }}
            onClick={() => handleConversationClick(conversation)}
        >
            <div style={styles.conversationInfo}>
                <p><strong>Usuário:</strong> {conversation.userId}</p>
                <p><strong>Produto:</strong> {conversation.product.name}</p>
            </div>
            {conversation.hasNewMessages && (
                <div style={styles.newMessageIndicator}></div>
            )}
        </div>
    );

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.productListTitle}>Lista de Produtos</h2>
                <button style={styles.addButton} onClick={addNewProduct}>
                    <FontAwesomeIcon icon={faPlus} style={styles.addIcon} />
                    Adicionar Produto
                </button>
            </div>
            
            <div style={styles.mainContent}>
                <div style={styles.productList}>
                    {products.length === 0 ? (
                        <p>Nenhum produto encontrado.</p>
                    ) : (
                        products.map(product => (
                            <div key={product.id} style={styles.productCard}>
                                <div style={styles.imageContainer}>
                                    {product.imageUrls && product.imageUrls.length > 0 ? (
                                        <img src={`http://localhost:5190/${product.imageUrls[0]}`} alt={product.name} style={styles.productImage} />
                                    ) : (
                                        <p>Sem imagens disponíveis.</p>
                                    )}
                                </div>
                                <div style={styles.productDetails}>
                                    <h4 style={styles.productName}>{product.name}</h4>
                                    <p style={styles.productDescription}>{product.description}</p>
                                    <p style={styles.productCategory}>Categoria: {product.category}</p>
                                    <p style={styles.productPrice}>Preço: €{product.price.toFixed(2)}</p>
                                </div>
                                <button 
                                    style={styles.deleteButton} 
                                    onClick={() => deleteProduct(product.id)}
                                    aria-label="Deletar Produto"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        ))
                    )}
                </div>


                <div style={styles.conversationsContainer}>
                    {renderMessagesTitle()}
                    <div style={styles.conversationsList}>
                        {conversations.length === 0 ? (
                            <p>Nenhuma conversa encontrada.</p>
                        ) : (
                            conversations.map(conversation => renderConversationCard(conversation))
                        )}
                    </div>
                </div>

                {selectedConversation && (
                <div style={styles.overlay} onClick={closeOverlay}>
                    <div style={styles.overlayContent} onClick={(e) => e.stopPropagation()}>
                        <h3>Mensagens para o produto {selectedConversation.product.name}</h3>
                        <div style={styles.messagesContainer}>
                            {conversationMessages.length === 0 ? (
                                <p>Nenhuma mensagem encontrada para esta conversa.</p>
                            ) : (
                                conversationMessages.map((msg) => (
                                    <div key={msg.id} style={styles.messageCard}>
                                        <p><strong>{msg.isFromAdmin ? 'Admin' : 'Usuário'}:</strong> {msg.content}</p>
                                        <p style={styles.timestamp}>{new Date(msg.timestamp).toLocaleString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <div style={styles.newMessageContainer}>
                            <textarea
                                value={newMessage}
                                onChange={handleNewMessageChange}
                                onKeyPress={handleKeyPress}
                                style={styles.newMessageInput}
                                placeholder="Digite sua mensagem..."
                            />
                            <button onClick={sendMessage} style={styles.sendButton}>Enviar</button>
                        </div>
                        <button style={styles.closeButton} onClick={closeOverlay}>Fechar</button>
                    </div>
                </div>
            )}

            </div>

        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px',
        backgroundColor: '#f0e6d6',
        minHeight: '100vh',
    },
    title: {
        fontSize: '42px',
        color: '#2c3e50',
        marginBottom: '30px',
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        borderBottom: '3px solid #688046',
        paddingBottom: '10px',
    },
    deleteMessageButton: {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: '#e74c3c', // Cor vermelha para o ícone de lixeira
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1200px',
        marginBottom: '30px',
    },
    mainContent: {
        display: 'flex',
        width: '100%',
        maxWidth: '1200px',
        gap: '20px',
    },
    productList: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    productCard: {
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        border: '1px solid #ddd',
        transition: '0.3s',
        position: 'relative',
        display: 'flex',
        gap: '10px',
    },
    imageContainer: {
        flexShrink: 0,
    },
    productImage: {
        width: '100px',
        height: 'auto',
        borderRadius: '5px',
    },
    productDetails: {
        flexGrow: 1,
    },
    productName: {
        fontSize: '20px',
        margin: '0 0 5px 0',
    },
    productDescription: {
        color: '#666',
        margin: '5px 0',
    },
    productCategory: {
        color: '#666',
        margin: '5px 0',
    },
    productPrice: {
        fontWeight: 'bold',
    },
    deleteButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
    },
    messagesContainer: {
        flex: 0.5,
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        border: '1px solid #ddd',
        maxHeight:400
    },
    messageCard: {
        padding: '10px',
        borderBottom: '1px solid #eee',
        cursor: 'pointer',
    },
    timestamp: {
        fontSize: '0.8em',
        color: '#999',
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fundo escuro com opacidade
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    overlayContent: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '600px',
        width: '90%',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    addButton: {
        backgroundColor: '#688046',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '30px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    addIcon: {
        marginRight: '8px',
    },
    responseTextarea: {
        width: '580px',
        height: '100px',
        margin: '10px 0',
        borderRadius: '5px',
        border: '1px solid #ccc',
        padding: '10px',
    },
    sendButton: {
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        padding: '10px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    conversationsContainer: {
        flex: 0.5,
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        border: '1px solid #ddd',
        maxHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
    },
    conversationsList: {
        overflowY: 'auto',
        flexGrow: 1,
    },
    conversationCard: {
        padding: '10px',
        borderBottom: '1px solid #eee',
        cursor: 'pointer',
    },
    closeButton: {
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#333',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    messagesContainer: {
        maxHeight: '300px',
        overflowY: 'auto',
        marginBottom: '20px',
    },
    newMessageContainer: {
        display: 'flex',
        marginBottom: '10px',
    },
    newMessageInput: {
        flex: 1,
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        marginRight: '10px',
    },
    sendButton: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    productListTitle: {
        fontSize: '28px',
        color: '#34495e',
        margin: 0,
        fontWeight: '600',
    },
    messagesHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '15px',
    },
    unreadBadge: {
        backgroundColor: '#e74c3c',
        color: 'white',
        borderRadius: '50%',
        padding: '2px 8px',
        fontSize: '12px',
        fontWeight: 'bold',
    },
    conversationInfo: {
        flex: 1,
    },
    newMessageIndicator: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: '#e74c3c',
        marginLeft: 'auto',
    },
    unreadConversation: {
        backgroundColor: '#f8f9fa',
        borderLeft: '4px solid #e74c3c',
    },
};

export default AdminComponent;
