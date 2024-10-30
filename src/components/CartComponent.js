import React, { useContext, useEffect, useState } from 'react';
import './../style/CartComponent.css'; // Importa o arquivo CSS para estilos
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Context } from '../context/Context';
import { Link, useNavigate } from 'react-router-dom';

const CartComponent = () => {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0); // Estado para armazenar o total do carrinho
    const { state, dispatch } = useContext(Context);
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const response = await fetch('http://localhost:5190/api/cart');
            if (!response.ok) {
                throw new Error('Erro ao buscar produtos');
            }
            const data = await response.json();
            setProducts(data.items);
            calculateTotal(data.items); // Calcula o total ao buscar os produtos
        } catch (error) {
            console.error(error);
        }
    };

    const calculateTotal = (items) => {
        const totalPrice = items.reduce((acc, item) => acc + item.product.price, 0);
        setTotal(totalPrice);
    };

    const handleRemoveItem = async (productId) => {
        try {
            const productToRemove = products.find(item => item.product.id === productId); // Encontra o produto a ser removido
    
            const response = await fetch(`http://localhost:5190/api/cart/remove/${productId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Erro ao remover produto');
            }
            
            const updatedProducts = products.filter(item => item.product.id !== productId);
            setProducts(updatedProducts); // Atualiza o estado dos produtos
            calculateTotal(updatedProducts); // Atualiza o total
    
            // Atualiza o número de itens no carrinho
            dispatch({
                type: 'REMOVE_NUMBEROFITEMS',
                payload: (state.numberOfItems || 0) - 1, // Garante que seja um número
            });
    
            // Remove o valor do preço do produto do total
            if (productToRemove) {
                dispatch({
                    type: 'REMOVE_TO_TOTAL',
                    payload: productToRemove.product.price, // Passa o preço do produto removido
                });
            }
        } catch (error) {
            console.error(error);
        }
    };
    

    useEffect(() => {
        fetchCart();
    }, []);

    const handleCheckout = () => {
        // Lógica para o checkout
        navigate('/checkout')
    };

    return (
        <div className="cartContainer">
            {/* Carrinho de Compras - Esquerda */}
            <div className="cartListSection">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FontAwesomeIcon icon={faShoppingCart} />
                        <h2 style={{ margin: 0 }}>Carrinho de Compras</h2>
                    </div>
                    {products.length === 1 ? (
                        <p style={{ fontSize: '12px', color: 'gray', margin: 0 }}>{products.length} produto</p>
                    ):( 
                        <p style={{ fontSize: '12px', color: 'gray', margin: 0 }}>{products.length} produtos</p>
                    )}
                </div>

                {/* Exibição da mensagem quando o carrinho estiver vazio */}
                {products.length === 0 ? (
                    <div className="emptyCartMessage">
                        <FontAwesomeIcon icon={faShoppingCart} size="2x" />
                        <h3>O teu carrinho de compras está vazio!</h3>
                        <p>Começa a adicionar artigos ao teu carrinho.</p>
                    </div>
                ) : (
                    <div className="cartList">
                    {products.map(item => (
                        <Link to={`/product/${item.product.id}`} key={item.product.id} className="productCartLink">
                            <div className="productCart">
                                <img 
                                    src={`http://localhost:5190/${item.product.imageUrls[0]}`} 
                                    alt={item.product.name} 
                                    className="productCartImage" 
                                />
                                <div className="productCartDetails">
                                    <h2>{item.product.name}</h2>
                                    <p>Preço: {item.product.price.toFixed(2)}€</p>
                                </div>
                                <FontAwesomeIcon 
                                    icon={faTimes} 
                                    className="removeIcon" 
                                    onClick={(e) => {
                                        e.preventDefault(); // Previne o redirecionamento ao clicar para remover
                                        handleRemoveItem(item.product.id);
                                    }} 
                                />
                            </div>
                        </Link>
                    ))}

                    </div>
                )}
            </div>

            {/* Resumo - Direita */}
            <div className="cartSummarySection">
                <h2>Resumo do Pedido</h2>
                <div className="summaryDetails">
                    <p><strong>Total:</strong> {total.toFixed(2)}€</p>
                    <button className="checkoutButton" onClick={handleCheckout}>
                        <h3>Finalizar a Compra</h3>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartComponent;
