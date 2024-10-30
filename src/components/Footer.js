import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFacebook, 
    faInstagram, 
    faTwitter, 
    faLinkedin,
    faVinted, 
} from '@fortawesome/free-brands-svg-icons';
import { 
    faEnvelope, 
    faPhone, 
    faMapMarkerAlt 
} from '@fortawesome/free-solid-svg-icons';
import '../style/Footer.css';
import logo from '../assets/logo.png';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <img src={logo} alt="MICHSTORE Logo" className="footer-logo" />
                    <p className="footer-description">
                        A sua loja de confiança para compra e venda de produtos usados.
                        Encontre e compre as melhores ofertas de forma segura e fácil.
                    </p>
                    
                </div>

                <div className="footer-section">
                    <h3>Links Úteis</h3>
                    <ul>
                        <li><Link to="/about">Sobre Nós</Link></li>
                        <li><Link to="/how-it-works">Como Funciona</Link></li>
                        <li><Link to="/terms">Termos de Uso</Link></li>
                        <li><Link to="/privacy">Política de Privacidade</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Categorias</h3>
                    <ul>
                        <li><Link to="/category/electronics">Eletrónicos</Link></li>
                        <li><Link to="/category/clothing">Roupa</Link></li>
                        <li><Link to="/category/furniture">Móveis</Link></li>
                        <li><Link to="/category/books">Livros</Link></li>
                        <li><Link to="/category/sports">Desporto</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Contacto</h3>
                    <div className="contact-info">
                        
                        <p>
                            <FontAwesomeIcon icon={faPhone} />
                            <a href="tel:+351912345678">+351 912 345 678</a>
                        </p>
                        <p>
                            <FontAwesomeIcon icon={faEnvelope} />
                            <a href="mailto:info@michstore.pt">info@michstore.pt</a>
                        </p>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <p>&copy; {currentYear} MICHSTORE. Todos os direitos reservados.</p>
                    <div className="footer-bottom-links">
                        <Link to="/terms">Termos</Link>
                        <Link to="/privacy">Privacidade</Link>
                        <Link to="/cookies">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 