import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft, faShoppingCart, faHeart as farHeart, faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { Context } from "../context/Context";
import "../style/ProductDetails.css";
import { auth, db } from "../config/FirebaseConfig";
import { doc,getDoc } from "firebase/firestore";

const ProductDetails = ({ productId }) => {
    const [product, setProduct] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [message, setMessage] = useState('');
    const { state, dispatch } = useContext(Context);
    const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '' });
    const [selectedImage, setSelectedImage] = useState(null); // Novo estado para a imagem selecionada
    const [isFavorite, setIsFavorite] = useState(false);

    const fetchProductDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5190/api/products/${productId}`);
            if (!response.ok) throw new Error('Erro ao buscar detalhes do produto');
            const data = await response.json();
            setProduct(data);
            console.log(data.firstName);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    useEffect(() => {
        if (auth.currentUser) {
            checkIfFavorite();
        }
    }, [productId, state.favoriteProducts]);

    const checkIfFavorite = async () => {
        try {
            const response = await fetch(`http://localhost:5190/api/favorites/${auth.currentUser.uid}/${productId}`);
            const data = await response.json();
            setIsFavorite(data);
        } catch (error) {
            console.error('Erro ao verificar favorito:', error);
        }
    };

    const toggleFavorite = async () => {
        if (!auth.currentUser) {
            alert('Por favor, faça login para adicionar aos favoritos.');
            return;
        }

        try {
            if (isFavorite) {
                await fetch(`http://localhost:5190/api/favorites/${auth.currentUser.uid}/${productId}`, {
                    method: 'DELETE'
                });
            } else {
                await fetch(`http://localhost:5190/api/favorites/${auth.currentUser.uid}/${productId}`, {
                    method: 'POST'
                });
            }
            setIsFavorite(!isFavorite);
            dispatch({ 
                type: 'UPDATE_FAVORITE', 
                payload: { productId, status: !isFavorite } 
            });
        } catch (error) {
            console.error('Erro ao atualizar favorito:', error);
        }
    };

    const handleImageNavigation = (direction) => {
        if (!product?.imageUrls?.length) return;
        
        setCurrentImageIndex(prev => {
            if (direction === 'next' && prev < product.imageUrls.length - 2) return prev + 2;
            if (direction === 'prev' && prev > 0) return prev - 2;
            return prev;
        });
    };

    const onInterestClick = () => {
        setIsChatOpen(true);
    };

    const handleSendMessage = async () => {
        if (message.trim() === '') return;

        const user = auth.currentUser;
        if (!user) {
            alert('Por favor, faça login para enviar mensagens.');
            return;
        }

        try {
            // Buscar informações do usuário
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) {
                console.error('Usuário não encontrado');
                return;
            }

            const userData = userDoc.data();

            // Criar objeto de conversa com o campo UserId (note a capitalização)
            const newConversation = {
                UserId: user.uid,  // Alterado de userId para UserId
                FirstName: userData.firstName,
                LastName: userData.lastName,
                Content: message,
                Product: product
            };

            console.log('Dados sendo enviados:', newConversation); // Para debug

            const conversationResponse = await fetch('http://localhost:5190/api/conversations/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newConversation)
            });

            if (!conversationResponse.ok) {
                const errorData = await conversationResponse.text();
                throw new Error(`Erro ao iniciar a conversa: ${errorData}`);
            }

            alert("Mensagem enviada com sucesso!");
            setMessage('');
            setIsChatOpen(false);
            
        } catch (error) {
            console.error('Erro ao iniciar conversa:', error);
            alert("Erro ao enviar mensagem. Por favor, tente novamente.");
        }
    };
    
    // Nova função para abrir o modal da imagem
    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    // Nova função para fechar o modal da imagem
    const handleCloseImageModal = () => {
        setSelectedImage(null);
    };

    if (!product) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Carregando detalhes do produto...</p>
        </div>
    );

    return (
        <div className="product-details-container">
            <div className="product-gallery">
                <button 
                    onClick={() => handleImageNavigation('prev')} 
                    className={`nav-button ${currentImageIndex === 0 ? 'hidden' : ''}`}
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                
                <div className="gallery-container">
                    {product.imageUrls?.slice(currentImageIndex, currentImageIndex + 2).map((url, index) => (
                        <div 
                            key={`${url}-${index}`} 
                            className="image-wrapper"
                            onClick={() => handleImageClick(`http://localhost:5190/${url}`)}
                        >
                            <img 
                                src={`http://localhost:5190/${url}`} 
                                alt={`${product.name} ${currentImageIndex + index + 1}`} 
                                className="product-image"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>

                <button 
                    onClick={() => handleImageNavigation('next')} 
                    className={`nav-button ${currentImageIndex >= (product.imageUrls?.length || 0) - 2 ? 'hidden' : ''}`}
                >
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>

            <div className="product-info-card">
                <div className="price-badge">
                    {product.price.toFixed(2)}€
                </div>
                
                <div className="product-info-content">
                    <div className="product-header">
                        <h1 className="product-title">{product.name}</h1>
                        <button 
                            onClick={toggleFavorite} 
                            className="favorite-button"
                            title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                        >
                            <FontAwesomeIcon 
                                icon={isFavorite ? fasHeart : farHeart} 
                                className={`heart-icon ${isFavorite ? 'favorite' : ''}`}
                            />
                        </button>
                    </div>
                    <p className="product-description">{product.description}</p>
                    
                    <div className="product-meta">
                        <div className="meta-row">
                            <div className="meta-item">
                                <span className="meta-label">CATEGORIA</span>
                                <span className="meta-value">{product.category}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">ESTADO</span>
                                <span className="meta-value">{product.status}</span>
                            </div>
                        </div>

                        {(product.category === 'Eletrónicos' || product.category === 'Roupa') && product.brand && (
                            <div className="meta-row">
                                <div className="meta-item">
                                    <span className="meta-label">MARCA</span>
                                    <span className="meta-value">{product.brand}</span>
                                </div>
                            </div>
                        )}

                        {product.category === 'Roupa' && (
                            <div className="meta-row">
                                {product.clothingType && (
                                    <div className="meta-item">
                                        <span className="meta-label">TIPO</span>
                                        <span className="meta-value">{product.clothingType}</span>
                                    </div>
                                )}
                                <div className="meta-item">
                                    <span className="meta-label">COR</span>
                                    <span className="meta-value">{product.color}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button onClick={onInterestClick} className="buy-button">
                        <span>Tenho interesse</span>
                        <FontAwesomeIcon icon={faShoppingCart} className="button-icon" />
                    </button>
                </div>

                {isChatOpen && (
                    <div className="chat-modal">
                        <div className="chat-content">
                            <h2>Envie uma mensagem</h2>
                            <textarea 
                                value={message} 
                                onChange={(e) => setMessage(e.target.value)} 
                                placeholder="Escreva sua mensagem aqui..."
                            />
                            <button onClick={handleSendMessage} className="send-button">
                                Enviar Mensagem
                            </button>
                            <button onClick={() => setIsChatOpen(false)} className="close-button">
                                Fechar
                            </button>
                        </div>
                    </div>
                )}

                {/* Novo modal para imagem ampliada */}
                {selectedImage && (
                    <div className="image-modal" onClick={handleCloseImageModal}>
                        <div className="image-modal-content" onClick={e => e.stopPropagation()}>
                            <img src={selectedImage} alt="Imagem ampliada" />
                            <button className="close-modal-button" onClick={handleCloseImageModal}>
                                ×
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
