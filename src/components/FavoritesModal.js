import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import '../style/FavoritesModal.css';
import { Context } from '../context/Context';

const FavoritesModal = ({ isOpen, onClose, favorites, isLoading, onRemoveFavorite }) => {
    const navigate = useNavigate();
    const { dispatch } = useContext(Context);

    const handleRemoveFavorite = async (productId) => {
        await onRemoveFavorite(productId);
        dispatch({ 
            type: 'UPDATE_FAVORITE', 
            payload: { productId, status: false } 
        });
    };

    if (!isOpen) return null;

    return (
        <div className="favorites-modal-overlay" onClick={onClose}>
            <div className="favorites-modal" onClick={e => e.stopPropagation()}>
                <div className="favorites-modal-header">
                    <h2>Meus Favoritos</h2>
                    <FontAwesomeIcon 
                        icon={faTimes} 
                        className="close-icon"
                        onClick={onClose}
                    />
                </div>
                
                <div className="favorites-modal-content">
                    {isLoading ? (
                        <div className="loading-spinner">Carregando...</div>
                    ) : favorites.length === 0 ? (
                        <p className="no-favorites">Você ainda não tem favoritos</p>
                    ) : (
                        <div className="favorites-list">
                            {favorites.map(product => (
                                <div key={product.id} className="favorite-item">
                                    <img 
                                        src={`http://localhost:5190/${product.imageUrls[0]}`} 
                                        alt={product.name} 
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    />
                                    <div className="favorite-item-info">
                                        <h3 onClick={() => navigate(`/product/${product.id}`)}>
                                            {product.name}
                                        </h3>
                                        <p className="favorite-price">{product.price.toFixed(2)}€</p>
                                    </div>
                                    <button 
                                        className="remove-favorite"
                                        onClick={() => handleRemoveFavorite(product.id)}
                                        title="Remover dos favoritos"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FavoritesModal; 