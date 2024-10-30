import React, { createContext, useReducer, useEffect } from 'react';

// Definir o estado inicial
export const initialState = {
  query: '',
  category: '',
  status: '',
  brand: '',
  clothingType: '',
  color: '',
  userId: null,
  favoriteProducts: [],
};

// Criar o contexto
export const Context = createContext(initialState);

// Definir o reducer
export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_BRAND':
      return { ...state, brand: action.payload };
    case 'SET_CLOTHING_TYPE':
      return { ...state, clothingType: action.payload };
    case 'SET_COLOR':
      return { ...state, color: action.payload };
    case 'SET_USERID':
      return { ...state, userId: action.payload };
    case 'UPDATE_FAVORITE':
      const { productId, status } = action.payload;
      const currentFavorites = Array.isArray(state.favoriteProducts) ? state.favoriteProducts : [];
      return {
        ...state,
        favoriteProducts: status 
          ? [...currentFavorites, productId]
          : currentFavorites.filter(id => id !== productId)
      };
    default:
      return state;
  }
};

// Criar o Provider
export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    favoriteProducts: []
  });

  useEffect(() => {
    if (state.userID) {
      localStorage.setItem('userID', state.userID);
    } else {
      localStorage.removeItem('userID');
    }
  }, [state.userID]);

  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  );
};
