import React from 'react';

const CategoryPickerComponent = ({ selectedCategory, handleCategoryChange }) => {
    const categories = ['Eletrónicos', 'Roupa', 'Casa', 'Livros'];

    return (
        <div style={styles.container}>
            <label htmlFor="categoryPicker" style={styles.label}>Categoria:</label>
            <select 
                id="categoryPicker" 
                value={selectedCategory} 
                onChange={handleCategoryChange} 
                style={styles.select}
            >
                <option value="">Selecione uma categoria</option>
                {categories.map((category, index) => (
                    <option key={index} value={category}>
                        {category}
                    </option>
                ))}
            </select>
        </div>
    );
};

const styles = {
    container: {
        marginBottom: '20px',
    },
    label: {
        marginRight: '10px',
    },
    select: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
};

export default CategoryPickerComponent;
