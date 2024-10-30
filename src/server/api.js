const API_BASE_URL = 'http://localhost:5190/api';

// Função auxiliar para fazer requisições
const fetchWithConfig = async (endpoint, config = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...config,
            headers: {
                'Content-Type': 'application/json',
                ...config.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Produtos
export const productAPI = {
    // Buscar produto por ID
    getProductById: (productId) => 
        fetchWithConfig(`/products/${productId}`),
};

// Conversas
export const conversationAPI = {
    // Iniciar nova conversa
    startConversation: (conversationData) => 
        fetchWithConfig('/conversations/start', {
            method: 'POST',
            body: JSON.stringify(conversationData),
        }),
};

