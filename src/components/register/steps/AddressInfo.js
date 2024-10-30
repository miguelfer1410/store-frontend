import { useState } from 'react';
import { auth, db } from '../../../config/FirebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { arrayUnion } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const AddressInfo = ({ formData, updateFormData, errors, onPrevious }) => {
    const [localErrors, setLocalErrors] = useState({});
    const navigate = useNavigate();

    const validateStep = () => {
        const newErrors = {};

        if (!formData.street.trim()) {
            newErrors.street = "O nome da rua é obrigatório.";
        }
        if (!formData.doorNumber.trim()) {
            newErrors.doorNumber = "O número da porta é obrigatório.";
        }
        if (!formData.postalCode.trim()) {
            newErrors.postalCode = "O código postal é obrigatório.";
        }
        if (!formData.city.trim()) {
            newErrors.city = "A cidade é obrigatória.";
        }

        setLocalErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateStep()) {
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth, 
                formData.email, 
                formData.password
            );
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                gender: formData.gender,
                birthDate: formData.birthDate,
                phone: formData.phone,
                // removido nif
                addresses: arrayUnion({
                    addressType: formData.addressType,
                    street: formData.street,
                    doorNumber: formData.doorNumber,
                    floor: formData.floor,
                    postalCode: formData.postalCode,
                    city: formData.city
                })
            });

            navigate('/login');
        } catch (error) {
            setLocalErrors({ submit: error.message });
        }
    };

    return (
        <div className="step-content">
            <h2 className="section-title">Informações de Morada</h2>
            
            <div className="form-group">
                <select
                    className="select-input"
                    value={formData.addressType}
                    onChange={(e) => updateFormData({ addressType: e.target.value })}
                >
                    <option value="Residencial">Residencial</option>
                    <option value="Empresarial">Empresarial</option>
                </select>
            </div>

            <div className="form-group">
                <input
                    type="text"
                    placeholder="Nome da Rua"
                    value={formData.street}
                    onChange={(e) => updateFormData({ street: e.target.value })}
                />
                {localErrors.street && <p className="error">{localErrors.street}</p>}
            </div>

            <div className="form-row">
                <div className="form-group half">
                    <input
                        type="text"
                        placeholder="Número da Porta"
                        value={formData.doorNumber}
                        onChange={(e) => updateFormData({ doorNumber: e.target.value })}
                    />
                    {localErrors.doorNumber && <p className="error">{localErrors.doorNumber}</p>}
                </div>

                <div className="form-group half">
                    <input
                        type="text"
                        placeholder="Andar"
                        value={formData.floor}
                        onChange={(e) => updateFormData({ floor: e.target.value })}
                    />
                </div>
            </div>

            <div className="form-group">
                <input
                    type="text"
                    placeholder="Código Postal"
                    value={formData.postalCode}
                    onChange={(e) => updateFormData({ postalCode: e.target.value })}
                />
                {localErrors.postalCode && <p className="error">{localErrors.postalCode}</p>}
            </div>

            <div className="form-group">
                <input
                    type="text"
                    placeholder="Cidade"
                    value={formData.city}
                    onChange={(e) => updateFormData({ city: e.target.value })}
                />
                {localErrors.city && <p className="error">{localErrors.city}</p>}
            </div>

            {localErrors.submit && <p className="error">{localErrors.submit}</p>}

            <div className="button-group">
                <button className="previous-button" onClick={onPrevious}>
                    Anterior
                </button>
                <button className="submit-button" onClick={handleSubmit}>
                    Registar
                </button>
            </div>
        </div>
    );
};

export default AddressInfo;
