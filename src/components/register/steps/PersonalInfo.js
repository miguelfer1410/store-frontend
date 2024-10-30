import { useState } from 'react';

const PersonalInfo = ({ formData, updateFormData, errors, onNext, onPrevious }) => {
    const [localErrors, setLocalErrors] = useState({});

    const validateStep = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = "O primeiro nome é obrigatório.";
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = "O último nome é obrigatório.";
        }
        if (!formData.gender) {
            newErrors.gender = "O género é obrigatório.";
        }
        if (!formData.birthDate) {
            newErrors.birthDate = "A data de nascimento é obrigatória.";
        }

        // Validar telefone (9 dígitos)
        const phoneRegex = /^[0-9]{9}$/;
        if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "O número de telefone deve ter 9 dígitos.";
        }

        setLocalErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        return isValid;
    };

    const handleNext = () => {
        if (validateStep()) {
            console.log('Validação passou, avançando...'); // Debug
            onNext();
        }
    };

    return (
        <div className="step-content">
            <h2 className="section-title">Dados Pessoais</h2>
            
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Primeiro Nome"
                    value={formData.firstName}
                    onChange={(e) => updateFormData({ firstName: e.target.value })}
                />
                {localErrors.firstName && <p className="error">{localErrors.firstName}</p>}
            </div>

            <div className="form-group">
                <input
                    type="text"
                    placeholder="Último Nome"
                    value={formData.lastName}
                    onChange={(e) => updateFormData({ lastName: e.target.value })}
                />
                {localErrors.lastName && <p className="error">{localErrors.lastName}</p>}
            </div>

            <div className="form-group">
                <select
                    className="select-input"
                    value={formData.gender}
                    onChange={(e) => updateFormData({ gender: e.target.value })}
                >
                    <option value="">Selecione o Género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                </select>
                {localErrors.gender && <p className="error">{localErrors.gender}</p>}
            </div>

            <div className="form-group">
                <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => updateFormData({ birthDate: e.target.value })}
                />
                {localErrors.birthDate && <p className="error">{localErrors.birthDate}</p>}
            </div>

            <div className="form-group">
                <input
                    type="tel"
                    placeholder="Telefone"
                    value={formData.phone}
                    onChange={(e) => updateFormData({ phone: e.target.value })}
                />
                {localErrors.phone && <p className="error">{localErrors.phone}</p>}
            </div>

            <div className="button-group">
                <button className="previous-button" onClick={onPrevious}>
                    Anterior
                </button>
                <button 
                    className="next-button" 
                    onClick={handleNext}
                    type="button" // Adicionar type="button" para garantir que não está submetendo um form
                >
                    Seguinte
                </button>
            </div>
        </div>
    );
};

export default PersonalInfo;
