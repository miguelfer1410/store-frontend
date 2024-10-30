import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import { auth } from "../config/FirebaseConfig"; // Importa a autenticação

const Cart = () => {
  const navigate = useNavigate();
  const { state } = useContext(Context);
  const [user, setUser] = useState(null);

  // Monitora o estado de autenticação
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // Usuário autenticado
      } else {
        setUser(null); // Usuário não autenticado
      }
    });
    return () => unsubscribe(); // Limpa o listener ao desmontar o componente
  }, []);

  const cartClick = () => {
    if (user) {
      navigate('/cart'); // Usuário autenticado pode acessar o carrinho
    } else {
      navigate('/login'); // Redireciona para a página de login se não autenticado
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <FontAwesomeIcon
        onClick={cartClick}
        style={{ marginRight: 30, cursor: "pointer", marginLeft: 100, marginTop: 5 }}
        icon={faShoppingCart}
        color="#1c2b16"
        size="2x"
      />
      {state.numberOfItems > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-6px',  // ajuste da posição vertical
            right: '25px',  // ajuste da posição horizontal
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 5px',
            fontSize: '12px'
          }}
        >
          {state.numberOfItems}
        </span>
      )}
    </div>
  );
}

export default Cart;
