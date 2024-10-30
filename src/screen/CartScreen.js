import CartComponent from "../components/CartComponent";
import Header from "../components/Header";
import ProductsComponent from "../components/ProductsComponent";
import React, { useContext } from 'react';
import { Context } from '../context/Context'; // Importa o Context para acessar o query

const CartScreen = () => {
    const { state } = useContext(Context); // Acessa o estado global do contexto

    return(
        <div className="cartScreen">
            {state.query ? (
                <div className="searchResults">
                    <Header />
                    <ProductsComponent /> {/* O componente que filtra e mostra os produtos */}
                </div>
            ):(
                <div>
                    <Header />
                    <CartComponent />
                </div>
            )}
        </div>
    );
}

export default CartScreen;