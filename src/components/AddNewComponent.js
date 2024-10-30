import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import CategoryPickerComponent from './CategoryPickerComponent';
import ProductStatusPicker from './ProductStatusPicker';
import ClothingTypePicker from './ClothingTypePicker';
import ColorPicker from './ColorPicker';

const AddNewComponent = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        status: '',
        brand: '',
        clothingType: '',
        color: '', // Novo campo
    });
    const [selectedImages, setSelectedImages] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null); 


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCategoryChange = (event) => {
        console.log('Nova categoria:', event.target.value); // Debug
        setFormData({
            ...formData,
            category: event.target.value,
        });
    };
    
    const handleStatusChange = (event) => {
        setFormData({
            ...formData,
            status: event.target.value,
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages([...selectedImages, ...files]);
    };

    const handleImageRemove = (index) => {
        const updatedImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(updatedImages);
    };

    // Função para verificar se deve mostrar o campo de marca
    const shouldShowBrand = () => {
        console.log('Categoria atual:', formData.category); // Debug
        return formData.category === 'Eletrónicos' || formData.category === 'Roupa';
    };

    // Função para verificar se deve mostrar o seletor de tipo de roupa
    const shouldShowClothingType = () => {
        return formData.category === 'Roupa';
    };

    const handleClothingTypeChange = (event) => {
        setFormData({
            ...formData,
            clothingType: event.target.value,
        });
    };

    const handleColorChange = (event) => {
        setFormData({
            ...formData,
            color: event.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', parseFloat(formData.price));
            formDataToSend.append('category', formData.category);
            formDataToSend.append('status', formData.status);
            
            if (shouldShowBrand()) {
                formDataToSend.append('brand', formData.brand);
            }

            if (shouldShowClothingType()) {
                formDataToSend.append('clothingType', formData.clothingType);
                formDataToSend.append('color', formData.color);
            }

            selectedImages.forEach((image) => {
                formDataToSend.append('images', image);
            });

            const response = await fetch('http://localhost:5190/api/products', {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                alert('Artigo carregado com sucesso!');
                setFormData({ 
                    name: '', 
                    description: '', 
                    price: '', 
                    category: '', 
                    status: '',
                    brand: '', // Incluir limpeza da marca
                    clothingType: '', // Incluir limpeza do tipo de roupa
                    color: '', // Incluir limpeza da cor
                });
                setSelectedImages([]);
            } else {
                alert('Erro ao carregar o artigo');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao enviar os dados para a API.');
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Vender Artigo</h1>
            <div style={styles.formContainer}>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.imageUpload}>
                        <label htmlFor="file-upload" style={styles.fileInputLabel}>
                            <FontAwesomeIcon icon={faUpload} style={styles.uploadIcon} />
                            Escolher Imagens
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            style={styles.fileInput}
                        />
                        <div style={styles.imagePreviewContainer}>
                            {selectedImages.map((image, index) => (
                                <div
                                    key={index}
                                    style={styles.imageWrapper}
                                    onMouseEnter={() => setHoveredIndex(index)} 
                                    onMouseLeave={() => setHoveredIndex(null)}  
                                    onClick={() => handleImageRemove(index)}
                                >
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Preview ${index}`}
                                        style={styles.imagePreview}
                                    />
                                    {hoveredIndex === index && (
                                        <div style={styles.trashIcon}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <input
                        name="name"
                        placeholder="Título do Artigo"
                        value={formData.name}
                        onChange={handleInputChange}
                        style={styles.input}
                    />
                    <textarea
                        name="description"
                        placeholder="Descrição detalhada do artigo..."
                        value={formData.description}
                        onChange={handleInputChange}
                        style={styles.textarea}
                    />
                    <CategoryPickerComponent 
                        selectedCategory={formData.category} 
                        handleCategoryChange={handleCategoryChange} 
                    />
                    
                    {formData.category === 'Roupa' && (
                        <>
                            <ClothingTypePicker
                                selectedType={formData.clothingType}
                                handleTypeChange={handleClothingTypeChange}
                            />
                            <ColorPicker
                                selectedColor={formData.color}
                                handleColorChange={handleColorChange}
                            />
                        </>
                    )}
                    
                    <ProductStatusPicker 
                        selectedStatus={formData.status}
                        handleStatusChange={handleStatusChange}
                    />
                    <input
                        name="price"
                        type="number"
                        step="0.01"
                        placeholder="Preço (€)"
                        value={formData.price}
                        onChange={handleInputChange}
                        style={styles.input}
                    />
                    {shouldShowBrand() && (
                        <input
                            name="brand"
                            placeholder="Marca do Produto"
                            value={formData.brand}
                            onChange={handleInputChange}
                            style={styles.input}
                            required
                        />
                    )}
                    <button type="submit" style={styles.button}>Carregar Artigo</button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0e6d6',
        padding: '40px 20px',
    },
    title: {
        fontSize: '42px',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '30px',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        borderBottom: '3px solid #688046',
        paddingBottom: '10px',
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '600px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    input: {
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #cbbba2',
        fontSize: '16px',
        transition: 'border-color 0.3s ease',
        width: '100%',
        boxSizing: 'border-box',
    },
    textarea: {
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #cbbba2',
        fontSize: '16px',
        minHeight: '100px',
        resize: 'vertical',
        transition: 'border-color 0.3s ease',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
    },
    button: {
        padding: '15px',
        backgroundColor: '#688046',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
    },
    imageUpload: {
        marginBottom: '20px',
    },
    fileInput: {
        display: 'none',
    },
    fileInputLabel: {
        display: 'inline-block',
        padding: '12px 20px',
        backgroundColor: '#cbbba2',
        color: '#fff',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
    },
    uploadIcon: {
        marginRight: '10px',
    },
    imagePreviewContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginTop: '20px',
    },
    imageWrapper: {
        position: 'relative',
        width: '100px',
        height: '100px',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    trashIcon: {
        position: 'absolute',
        top: '5px',
        right: '5px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: '#fff',
        borderRadius: '50%',
        padding: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    }
};

export default AddNewComponent;
