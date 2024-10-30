import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import getUserRole from '../hooks/UserRole';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import ProfileComponent from './ProfileComponent';
import '../style/LoginRegister.css';

const LoginRegister = () => {
    const { currentUser, logout, isAuthenticated } = useAuth(); 
    const [role, setRole] = useState(null);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const checkUserRole = async () => {
            if (currentUser) {
                const userRole = await getUserRole(currentUser.uid);
                setRole(userRole);
            } else {
                setRole(null);
            }
        };

        checkUserRole();
    }, [currentUser]);

    const navigateAdmin = () => {
        navigate('/admin');
    }

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Erro ao sair", error);
        }
    }

    return (
        <div className="login-register-container">
            {isAuthenticated ? (
                <div className="user-actions">
                    {role !== 'admin' &&
                        <FontAwesomeIcon icon={faUser} className="user-icon" size="2x" onClick={toggleDropdown} />
                    }

                    {isOpen && (
                        <ProfileComponent />
                    )}
                    
                    {role === 'admin' && ( 
                        <button onClick={navigateAdmin} className="admin-button">
                            Admin
                        </button>
                    )}
                    
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            ) : (
                <Link to="/login" className="login-link">
                    <FontAwesomeIcon icon={faUser} className="user-icon" />
                    Login/Register
                </Link>
            )}
        </div>
    );
}

export default LoginRegister;
