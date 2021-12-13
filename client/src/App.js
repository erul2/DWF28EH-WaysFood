import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { API, setAuthToken } from "./config/api";
import { UserContext } from "./context/userContext";
import { CartContext } from "./context/cartContext";
import RequireAuth from "./components/auth/RequireAuth";
import Home from "./pages/Home";
import RestaurantMenus from "./pages/RestaurantMenus";
import CartOrder from "./pages/CartOrder";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AddProduct from "./pages/AddProduct";
import IncomeTransaction from "./pages/IncomeTransaction";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

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
      if (id) {
        getTransactions(id);
      } else {
        const { seller, orders } = JSON.parse(localStorage.cart);
        cartDispatch({
          type: "RELOAD_ORDER",
          payload: {
            status: null,
            id: null,
            seller,
            orders,
          },
        });
      }
    }
  }, [state]);

  const checkUser = async () => {
    if (!localStorage.token) {
      return null;
    }

    try {
      const response = await API.get("/check-auth");

      let payload = response.data.data.user;
      payload.token = localStorage.token;

      // send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
      return dispatch({
        type: "AUTH_ERROR",
      });
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
      return cartDispatch({
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
      <Route
        path="/partner"
        element={
          <RequireAuth>
            <IncomeTransaction />
          </RequireAuth>
        }
      />
      <Route
        path="/restaurant-menus/:id"
        element={
          <RequireAuth>
            <RestaurantMenus />
          </RequireAuth>
        }
      />
      <Route
        path="/cart-order"
        element={
          <RequireAuth>
            <CartOrder />
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />
      <Route
        path="/edit-profile"
        element={
          <RequireAuth>
            <EditProfile />
          </RequireAuth>
        }
      />
      <Route
        path="/add-product"
        element={
          <RequireAuth>
            <AddProduct />
          </RequireAuth>
        }
      />
      <Route
        path="*"
        element={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: "100vh",
            }}
          >
            <h1 style={{ margin: " 0 auto" }}>404 Page Not Pound!</h1>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
