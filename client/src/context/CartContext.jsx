import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import api from '../services/axiosConfig';
import { getCart } from '../services/productService';

const initialState = {
  cart: [],
  totalItems: 0,
  totalAmount: 0,
  isLoading: true, 
};

const ADD_TO_CART = 'ADD_TO_CART';
const SET_CART = 'SET_CART';
const SET_LOADING = 'SET_LOADING';

const cartReducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
      
    case SET_CART:
      return {
        ...state,
        cart: action.payload.cart,
        totalItems: action.payload.totalItems,
        totalAmount: action.payload.totalAmount,
        isLoading: false, 
      };

    case ADD_TO_CART:

    default:
      return state;
  }
};

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const fetchCart = async () => {
      dispatch({ type: SET_LOADING, payload: true });
      
      try {
        const response = await getCart();
        if (response.data) {
          const items = response.data.items || [];
          const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
          const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

          dispatch({
            type: SET_CART,
            payload: {
              cart: items, 
              totalItems,
              totalAmount,
            }
          });
        } else {
          dispatch({
            type: SET_CART,
            payload: {
              cart: [],
              totalItems: 0,
              totalAmount: 0,
            }
          });
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        dispatch({
          type: SET_CART,
          payload: {
            cart: [],
            totalItems: 0,
            totalAmount: 0,
          }
        });
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (productId, cartData) => {
    try {
      const response = await api.post('/cart', { productId, ...cartData });

      if (response.data.success && response.data.cart) {
        const items = response.data.cart.items || [];
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

        dispatch({
          type: SET_CART,
          payload: {
            cart: items,
            totalItems,
            totalAmount,
          }
        });
      }

      return response.data;

    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const refreshCart = async () => {
    dispatch({ type: SET_LOADING, payload: true });
    
    try {
      const response = await getCart();
      if (response.data) {
        const items = response.data.items || [];
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

        dispatch({
          type: SET_CART,
          payload: {
            cart: items,
            totalItems,
            totalAmount,
          }
        });
      }
    } catch (error) {
      console.error("Error refreshing cart:", error);
      dispatch({
        type: SET_CART,
        payload: {
          cart: [],
          totalItems: 0,
          totalAmount: 0,
        }
      });
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
