import { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/cartContext";
import { UserContext } from "../context/userContext";
import { useParams } from "react-router-dom";
import { capitalCase } from "capital-case";
import { API } from "../config/api";
import Navbar from "../components/Navbar";
import { Container } from "react-bootstrap";
import Menu from "../components/Menu";
import cssMod from "./RestaurantMenus.module.css";

function RestaurantMenus() {
  const [cart, cartDispatch] = useContext(CartContext);
  const [state] = useContext(UserContext);
  const pId = parseInt(useParams().id);
  document.title = `Ways Food - `;
  const [resto, setResto] = useState({ fullName: "WaysFood" });
  const [menus, setMenus] = useState([]);

  // get resto data
  const getMenus = async () => {
    try {
      const response = await API.get(`/products/${pId}`);
      setMenus(response.data.data.products);
      setResto(response.data.data.resto);

      document.title = `Ways Food - ${capitalCase(
        response.data.data.resto.fullName
      )}`;
    } catch (error) {
      console.log(error);
    }
  };

  const handleOrder = (menu) => {
    if (cart.status) {
      return null;
    }

    let orders = cart.orders;

    if (orders.length > 0) {
      if (resto.id != cart.seller.id) {
        return null;
      }

      let exist = () => {
        for (let i = 0; i < orders.length; i++) {
          if (orders[i].id == menu.id) {
            orders[i] = {
              ...orders[i],
              qty: orders[i].qty + 1,
            };
            return true;
          }
        }
        return false;
      };

      if (!exist()) {
        orders.push({
          ...menu,
          qty: 1,
        });
      }

      return cartDispatch({
        type: "UPDATE_ORDER",
        payload: {
          orders,
        },
      });
    } else {
      orders.push({
        ...menu,
        qty: 1,
      });

      return cartDispatch({
        type: "ADD_ORDER",
        payload: {
          seller: resto,
          orders,
        },
      });
    }
  };

  useEffect(() => {
    getMenus();
  }, []);

  return (
    <>
      <Navbar />
      <Container className="px-xs-1 px-md-3 px-xl-5 mt-5 pb-5">
        <h4 className={`${cssMod.title} mb-4`}>
          {capitalCase(resto.fullName)}
        </h4>
        {menus.length == 0 ? (
          <div className="d-flex justify-content-center mt-5">
            <img
              src="/img/menu-unavailable.jpg"
              alt=""
              style={{ width: "85%" }}
            />
          </div>
        ) : (
          <div className="row row-cols-2 row-cols-lg-4 gx-3 gx-lg-4">
            {menus.map((menu, index) => (
              <Menu
                key={index}
                id={menu.id}
                img={menu.image}
                name={menu.title}
                price={menu.price}
                order={() => {
                  handleOrder(menu);
                }}
              />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}

export default RestaurantMenus;
