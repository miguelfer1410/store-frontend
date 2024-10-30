const ColorPicker = ({ selectedColor, handleColorChange }) => {
    const colors = [
        "Preto",
        "Branco",
        "Cinzento",
        "Azul",
        "Vermelho",
        "Verde",
        "Amarelo",
        "Rosa",
        "Roxo",
        "Laranja",
        "Castanho",
        "Bege",
        "Dourado",
        "Prateado",
        "Multicolor"
    ];

    return (
        <select
            value={selectedColor}
            onChange={handleColorChange}
            style={styles.select}
            required
        >
            <option value="">Selecione a cor</option>
            {colors.map((color) => (
                <option key={color} value={color}>
                    {color}
                </option>
            ))}
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

export default ColorPicker;
