import { useState } from 'react';
import { auth } from '../config/FirebaseConfig';
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import '../style/ForgotPassword.css';
import logo from '../assets/logo.png';

const ForgotPasswordComponent = () => {
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (!resetEmail) {
            setResetMessage('Por favor, insira um e-mail válido.');
            return;
        }
        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            setResetMessage('E-mail de recuperação enviado com sucesso!');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            console.error("Erro ao enviar e-mail de recuperação:", error);
            setResetMessage('Erro ao enviar e-mail de recuperação.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='container'>
            <img 
                src={logo} 
                alt="MICHSTORE Logo" 
                className="logo"
                onClick={() => navigate('/')}
                style={{
                    height: "150px", 
                    border: "2px solid black",
                    borderRadius: "10px",
                    marginTop:"20px",
                    alignSelf:'center'
                }}
            />
            <div className='forgot-password-form'>
                <h1>Recuperação de Senha</h1>
                <p className='instruction-text'>
                    Digite seu e-mail abaixo e enviaremos instruções para recuperar sua senha.
                </p>
                <form onSubmit={handlePasswordReset}>
                    <input
                        type='email'
                        placeholder="Seu e-mail"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                    />
                    <button 
                        type='submit' 
                        className='submit-btn'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Enviando...' : 'Enviar E-mail de Recuperação'}
                    </button>
                </form>
                {resetMessage && <p className='reset-message'>{resetMessage}</p>}
                <button 
                    className='back-btn'
                    onClick={() => navigate('/login')}
                >
                    Voltar para o Login
                </button>
            </div>
        </div>
    );
}

export default ForgotPasswordComponent;
