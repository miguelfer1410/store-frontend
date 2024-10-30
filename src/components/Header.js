import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faTimes, faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./SearchBar";
import LoginRegister from "./LoginRegister";
import '../style/Header.css';
import logo from '../assets/logo.png';
import { useAuth } from '../auth/AuthContext';
import FavoritesModal from './FavoritesModal';

const Header = () => {
    const navigate = useNavigate();
    const { isAdmin, isAuthenticated, user } = useAuth();
    const [showLoginAlert, setShowLoginAlert] = useState(false);
    const [showFavoritesModal, setShowFavoritesModal] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (showFavoritesModal && isAuthenticated) {
            fetchFavorites();
        }
    }, [showFavoritesModal, isAuthenticated]);

    const fetchFavorites = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5190/api/favorites/user/${user.uid}`);
            const data = await response.json();
            setFavorites(data);
        } catch (error) {
            console.error('Erro ao buscar favoritos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveFavorite = async (productId) => {
        try {
            await fetch(`http://localhost:5190/api/favorites/${user.uid}/${productId}`, {
                method: 'DELETE'
            });
            // Atualiza a lista de favoritos após remover
            fetchFavorites();
        } catch (error) {
            console.error('Erro ao remover favorito:', error);
        }
    };

    const handleFavoritesClick = () => {
        if (isAuthenticated && user) {
            setShowFavoritesModal(true);
        } else {
            showLoginAlertMessage("favoritos");
        }
    };

    const handleLogoClick = () => {
        navigate("/");
    };

    const handleMessagesClick = () => {
        if (isAuthenticated && user) {
            navigate("/messages");
        } else {
            showLoginAlertMessage("mensagens");
        }
    };

    const showLoginAlertMessage = (feature) => {
        setShowLoginAlert(true);
        setTimeout(() => {
            setShowLoginAlert(false);
        }, 3000);
    };

    return (
        <header className="header">
            <div className="header-left">
                <img 
                    src={logo} 
                    alt="MICHSTORE Logo" 
                    onClick={handleLogoClick} 
                    className="logo"
                />
            </div>
            <div className="header-center">
                <SearchBar />
            </div>
            <div className="header-right">
                {!isAdmin && (
                    <>
                        <div className="icon-container" 
                            onClick={handleFavoritesClick}
                            title={isAuthenticated ? "Favoritos" : "Faça login para ver os favoritos"}
                        >
                            <FontAwesomeIcon 
                                icon={faHeart} 
                                className={`icon favorites-icon ${!isAuthenticated ? 'disabled' : ''}`} 
                            />
                        </div>
                        <div className="messages-container">
                            <div 
                                className="icon-container" 
                                onClick={handleMessagesClick}
                                title={isAuthenticated ? "Mensagens" : "Faça login para ver as mensagens"}
                            >
                                <FontAwesomeIcon 
                                    icon={faEnvelope} 
                                    className={`icon messages-icon ${!isAuthenticated ? 'disabled' : ''}`} 
                                />
                            </div>
                        </div>
                    </>
                )}
                <LoginRegister />
                {showLoginAlert && (
                    <div className="login-alert">
                        <div className="alert-content">
                            <p>Por favor, faça login para acessar os favoritos</p>
                            <button onClick={() => navigate('/login')} className="login-button">
                                Fazer Login
                            </button>
                            <FontAwesomeIcon 
                                icon={faTimes} 
                                className="close-icon"
                                onClick={() => setShowLoginAlert(false)}
                            />
                        </div>
                    </div>
                )}
            </div>
            
            <FavoritesModal 
                isOpen={showFavoritesModal}
                onClose={() => setShowFavoritesModal(false)}
                favorites={favorites}
                isLoading={isLoading}
                onRemoveFavorite={handleRemoveFavorite}
            />
        </header>
    );
}

export default Header;
