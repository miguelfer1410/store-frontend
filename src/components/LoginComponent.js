import { useContext, useState } from 'react';
import { auth } from '../config/FirebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import '../style/Login.css';
import getUserRole from '../hooks/UserRole';
import logo from '../assets/logo.png';
import { Context } from '../context/Context';
import Loader from './Loader'; // Importe o componente Loader

const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Novo estado para controlar o loader
    const navigate = useNavigate();
    const {dispatch, state} = useContext(Context);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Ativa o loader

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const role = await getUserRole(user.uid); 
            auth.onAuthStateChanged((user)=>{
                if(user){
                  const userId = user.uid;
                  console.log("userId",userId);
                  dispatch({
                    type:"SET_USERID",
                    payload:userId
                  })    

                  console.log("state.userId",state.userId);
                }
            });       
            navigate('/');
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            setError(error.message);
        } finally {
            setIsLoading(false); // Desativa o loader independentemente do resultado
        }
    };

    return (
        <div className='container'>
            {isLoading && <Loader />}
            <img 
                src={logo} 
                alt="MICHSTORE Logo" 
                style={{
                    height: "150px", 
                    border: "2px solid black",
                    borderRadius: "10px",
                    marginTop:"20px",
                    alignSelf:'center'
                }} 
            />
            <div className='login'>
                <h1>Login/Register</h1>
                {error && <p className='error'>{error}</p>}
                <form className='form' onSubmit={handleLogin}>
                    <input
                        type='email'
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type='password'
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type='submit' className='submit'>Login</button>
                </form>
                <div className='auth-links'>
                    <div className='links-container'>
                        <p>Não tem uma conta? <a href='/register'>Registre-se</a></p>
                        <p className='forgot-password'><a href='/forgot-password'>Esqueceu a password?</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginComponent;
