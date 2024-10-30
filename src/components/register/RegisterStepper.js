import { useState } from 'react';
import AccountCredentials from './steps/AccountCredentials';
import PersonalInfo from './steps/PersonalInfo';
import AddressInfo from './steps/AddressInfo';
import '../../style/RegisterStepper.css';

const RegisterStepper = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        gender: '',
        birthDate: '',
        phone: '',
        addressType: 'Residencial',
        street: '',
        doorNumber: '',
        floor: '',
        postalCode: '',
        city: ''
    });
    const [errors, setErrors] = useState({});

    const nextStep = () => {
        setCurrentStep(prev => prev + 1);
    };

    const previousStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const updateFormData = (newData) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <AccountCredentials 
                        formData={formData}
                        updateFormData={updateFormData}
                        errors={errors}
                        onNext={nextStep}
                    />
                );
            case 2:
                return (
                    <PersonalInfo
                        formData={formData}
                        updateFormData={updateFormData}
                        errors={errors}
                        onNext={nextStep}
                        onPrevious={previousStep}
                    />
                );
            case 3:
                return (
                    <AddressInfo
                        formData={formData}
                        updateFormData={updateFormData}
                        errors={errors}
                        onPrevious={previousStep}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className='container'>
            <div className='register'>
                <div className="stepper">
                    <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                        <div className="step-number">1</div>
                        <div className="step-title">Conta</div>
                    </div>
                    <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                        <div className="step-number">2</div>
                        <div className="step-title">Dados Pessoais</div>
                    </div>
                    <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                        <div className="step-number">3</div>
                        <div className="step-title">Morada</div>
                    </div>
                </div>
                {renderStep()}
            </div>
        </div>
    );
};

export default RegisterStepper;
