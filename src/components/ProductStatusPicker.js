

const ProductStatusPicker = ({selectedStatus, handleStatusChange}) => {
    const status = ['Satisfatório', 'Bom', 'Muito Bom', 'Novo sem Etiqueta', 'Novo com Etiqueta'];

    return (
        <div style={styles.container}>
            <label htmlFor="categoryPicker" style={styles.label}>Estado:</label>
            <select 
                id="categoryPicker" 
                value={selectedStatus} 
                onChange={handleStatusChange} 
                style={styles.select}
            >
                <option value="">Qual o estado do produto?</option>
                {status.map((category, index) => (
                    <option key={index} value={category}>
                        {category}
                    </option>
                ))}
            </select>
        </div>
    );

}

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

export default ProductStatusPicker