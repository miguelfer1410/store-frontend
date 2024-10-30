import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import '../style/ProductComponent.css';
import { Context } from '../context/Context';

const ProductsComponent = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const { state, dispatch } = useContext(Context);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5190/api/products');
            if (!response.ok) throw new Error('Erro ao buscar produtos');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let filtered = products;

        if (state.category && state.category !== "Todos") {
            filtered = filtered.filter(product => product.category === state.category);
        }

        if (state.status && state.status !== "Todos") {
            filtered = filtered.filter(product => product.status === state.status);
        }

        if (state.query) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(state.query.toLowerCase()) ||
                product.description.toLowerCase().includes(state.query.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    }, [state.category, state.status, state.query, products]);

    const handleProductClick = (id) => {
        if(state.query) {
            dispatch({ type: 'SET_QUERY', payload: '' });
        }
        navigate(`/product/${id}`);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Carregando produtos...</p>
            </div>
        );
    }

    return (
        <div className="products-grid-container">
            {filteredProducts.length === 0 ? (
                <div className="no-products">
                    <FontAwesomeIcon icon={faInfoCircle} size="2x" />
                    <p>Nenhum produto encontrado.</p>
                </div>
            ) : (
                <div className="products-grid">
                    {filteredProducts.map(product => (
                        <div 
                            key={product.id} 
                            className="product-card"
                            onClick={() => handleProductClick(product.id)}
                        >
                            <div className="product-image-container">
                                {product.imageUrls?.length > 0 ? (
                                    <img
                                        src={`http://localhost:5190/${product.imageUrls[0]}`}
                                        alt={product.name}
                                        className="product-image"
                                    />
                                ) : (
                                    <div className="no-image">
                                        <FontAwesomeIcon icon={faTag} size="2x" />
                                        <p>Sem imagem</p>
                                    </div>
                                )}
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-description">{product.description}</p>
                                <div className="product-price">
                                    <span>{product.price.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProductsComponent;