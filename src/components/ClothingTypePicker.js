const ClothingTypePicker = ({ selectedType, handleTypeChange }) => {
    return (
        <select
            value={selectedType}
            onChange={handleTypeChange}
            style={styles.select}
            required
        >
            <option value="">Selecione o tipo</option>
            <option value="Homem">Homem</option>
            <option value="Mulher">Mulher</option>
            <option value="Criança-M">Criança (Masculino)</option>
            <option value="Criança-F">Criança (Feminino)</option>
        </select>
    );
};

const styles = {
    select: {
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #cbbba2',
        fontSize: '16px',
        width: '100%',
        backgroundColor: 'white',
        cursor: 'pointer',
        boxSizing: 'border-box',
    }
};

export default ClothingTypePicker;
