import { useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { API, setAuthToken } from "./config/api";
import { UserContext } from "./context/userContext";
import { CartContext } from "./context/cartContext";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./pages/Home";
import RestaurantMenus from "./pages/RestaurantMenus";
import CartOrder from "./pages/CartOrder";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AddProduct from "./pages/AddProduct";
import IncomeTransaction from "./pages/IncomeTransaction";
import MapsTest from "./pages/MapsTest";

// init token on axios every time the app refreshed
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const [state, dispatch] = useContext(UserContext);
  const [cart, cartDispatch] = useContext(CartContext);

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    if (localStorage.cart) {
      const { id } = JSON.parse(localStorage.cart);

      if (id) getTransactions(id);
    }
  }, [state]);

  const checkUser = async () => {
    console.log("check user");
    if (!localStorage.token) {
      return null;
    }

    try {
      const response = await API.get("/check-auth");

      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      let payload = response.data.data.user;
      payload.token = localStorage.token;

      // send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getTransactions = async (id) => {
    try {
      const response = await API.get(`/transaction/${id}`);
      const data = response.data.data.transactions;

      if (data.status === "Cancel") {
        cartDispatch({
          type: "CLEAR_CART",
        });
      }

      cartDispatch({
        type: "RELOAD_ORDER",
        payload: {
          status: data.status,
          id: data.id,
          seller: data.seller,
          orders: data.order,
        },
      });
    } catch (error) {
      console.log(error);
      cartDispatch({
        type: "CLEAR_CART",
      });
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (state.isLogin) {
      checkUser();
    }
  }, [state.isLogin]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          state.isLogin && state.user?.role === "partner" ? (
            <IncomeTransaction />
          ) : (
            <Home />
          )
        }
      />
      <Route path="/login" element={<Home />} />
      <Route path="/partner" element={<IncomeTransaction />} />
      <Route path="/restaurant-menus/:id" element={<RestaurantMenus />} />
      <Route path="/cart-order" element={<CartOrder />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/maps-test" element={<MapsTest />} />
      <Route
        path="*"
        element={
          <main style={{ padding: "1rem" }}>
            <p>404 Page Not Pound!</p>
          </main>
        }
      />
    </Routes>
  );
}

export default App;
