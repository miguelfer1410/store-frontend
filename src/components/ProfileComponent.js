import '../style/Profile.css';
import { useNavigate } from 'react-router-dom';
import { faGreaterThan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ProfileComponent = () => {
    
    const navigate = useNavigate();

    const handleOptionClick = (id) => {
        console.log('ola')
        navigate(`/account/${id}`);
    };

    return (
        <div className="profile-container">
            <h1 id="title">A Minha Conta</h1>

            <div className="profile-info">
                <div onClick={() => handleOptionClick("addressList")} style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', cursor:'pointer'}}>
                    <p>Lista de Endereços </p>
                    <FontAwesomeIcon color='grey' style={{width:10}} icon={faGreaterThan}/>
                </div>
                <div onClick={() => handleOptionClick("accountData")} style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', cursor:'pointer'}}>
                    <p>Gerir Dados da Conta</p>
                    <FontAwesomeIcon color='grey' style={{width:10}} icon={faGreaterThan}/>
                </div>
                <div onClick={() => handleOptionClick("ordersList")} style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', cursor:'pointer'}}>
                    <p>As Minhas Encomendas</p>
                    <FontAwesomeIcon color='grey' style={{width:10}} icon={faGreaterThan}/>
                </div>
            </div>
            
        </div>
    );
};

export default ProfileComponent;
