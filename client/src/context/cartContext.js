import { createContext, useReducer } from "react";

// Cart context, to save order data
export const CartContext = createContext();

const initialState = {
  status: null,
  seller: null,
  id: null,
  orders: [],
};

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "ADD_ORDER":
      localStorage.setItem("cart", JSON.stringify(payload));
      return {
        ...state,
        seller: payload.seller,
        orders: payload.orders,
      };

    case "UPDATE_ORDER":
      localStorage.setItem(
        "cart",
        JSON.stringify({
          ...state,
          orders: payload.orders,
        })
      );

      return {
        ...state,
        orders: payload.orders,
      };

    case "RELOAD_ORDER":
      return {
        status: payload.status,
        id: payload.id,
        seller: payload.seller,
        orders: payload.orders,
      };

    case "UPDATE_STATUS":
      localStorage.setItem(
        "cart",
        JSON.stringify({
          ...state,
          id: payload.id,
          status: payload.status,
        })
      );

      return {
        ...state,
        id: payload.id,
        status: payload.status,
      };

    case "CLEAR_CART":
      localStorage.removeItem("cart");
      return {
        status: null,
        seller: null,
        id: null,
        orders: [],
      };

    default:
      throw new Error();
  }
};

export const CartContextProvider = ({ children }) => {
  const [cart, cartDispatch] = useReducer(reducer, initialState);
  return (
    <CartContext.Provider value={[cart, cartDispatch]}>
      {children}
    </CartContext.Provider>
  );
};
