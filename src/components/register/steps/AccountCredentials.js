import { useState } from 'react';

const AccountCredentials = ({ formData, updateFormData, errors, onNext }) => {
    const [localErrors, setLocalErrors] = useState({});

    const validateStep = () => {
        const newErrors = {};
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "E-mail inválido.";
        }

        if (formData.password.length < 6) {
            newErrors.password = "A senha deve ter pelo menos 6 caracteres.";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "As senhas não coincidem.";
        }

        setLocalErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            onNext();
        }
    };

    return (
        <div className="step-content">
            <h2 className="section-title">Criar Conta</h2>
            <div className="form-group">
                <input
                    type="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={(e) => updateFormData({ email: e.target.value })}
                />
                {localErrors.email && <p className="error">{localErrors.email}</p>}
            </div>

            <div className="form-group">
                <input
                    type="password"
                    placeholder="Senha"
                    value={formData.password}
                    onChange={(e) => updateFormData({ password: e.target.value })}
                />
                {localErrors.password && <p className="error">{localErrors.password}</p>}
            </div>

            <div className="form-group">
                <input
                    type="password"
                    placeholder="Confirmar Senha"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
                />
                {localErrors.confirmPassword && <p className="error">{localErrors.confirmPassword}</p>}
            </div>

            <div className="button-group">
                <button className="next-button" onClick={handleNext}>
                    Seguinte
                </button>
            </div>
        </div>
    );
};

export default AccountCredentials;
