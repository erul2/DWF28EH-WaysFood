import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { CartContext } from "../context/cartContext";

import Login from "./auth/Login";
import Register from "./auth/Register";
import cssMod from "./Navbar.module.css";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

function AfterLogin(props) {
  const [state, dispatch] = useContext(UserContext);
  const [cart, cartDispatch] = useContext(CartContext);
  const navigate = useNavigate();
  const [totalCart, setTotalCart] = useState(0);

  useEffect(() => {
    let total = 0;
    if (cart.orders.length > 0) {
      for (let i = 0; i < cart.orders.length; i++) {
        total += cart.orders[i].qty;
      }
    }

    setTotalCart(total);
  }, [cart]);

  return (
    <>
      {props.state.user.role === "user" ? (
        <Link to="/cart-order" className="position-relative">
          <img src="/icon/shopping-basket.svg" alt="cart" />{" "}
          {totalCart > 0 ? (
            <span
              className={`position-absolute translate-middle badge rounded-pill bg-danger ${cssMod.badge}`}
            >
              {totalCart}
            </span>
          ) : null}
        </Link>
      ) : null}

      <NavDropdown
        title={
          <img
            src={
              state.user.image ? state.user.image : "/img/avatar/default.png"
            }
            alt="icon"
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              borderRadius: "50%",
              border: "3px solid var(--primary)",
            }}
          />
        }
        id="basic-nav-dropdown"
        align="end"
      >
        <NavDropdown.Item
          href="/profile"
          className="dropdown-item my-3 d-flex align-items-center"
        >
          <img src="/icon/user.svg" width="30px" height="30px" alt="" />
          <span className={cssMod.dropdownItem}>
            {props.state.user.role === "partner"
              ? "Profile Partner"
              : "Profile"}
          </span>
        </NavDropdown.Item>
        {props.state.user.role === "partner" ? (
          <NavDropdown.Item
            href="/add-product"
            className="dropdown-item my-3 d-flex align-items-center"
          >
            <img src="/icon/product.svg" width="30px" alt="" />
            <span className={cssMod.dropdownItem}>Add Product</span>
          </NavDropdown.Item>
        ) : null}
        <NavDropdown.Divider />{" "}
        <NavDropdown.Item
          onClick={() => {
            dispatch({
              type: "LOGOUT",
            });
            cartDispatch({
              type: "CLEAR_CART",
            });
            navigate("/");
          }}
        >
          <img src="/icon/logout.svg" width="30px" alt="" />
          <span className={cssMod.dropdownItem}>Logout</span>
        </NavDropdown.Item>{" "}
      </NavDropdown>
    </>
  );
}

function BeforeLogin() {
  const [show, setShow] = useState([false, null]);

  return (
    <>
      <button
        className={cssMod.navBtn}
        onClick={() => {
          setShow([true, false]);
        }}
      >
        Register
      </button>
      <button
        className={cssMod.navBtn}
        onClick={() => {
          setShow([true, true]);
        }}
      >
        Login
      </button>
      {show[0] ? (
        show[1] ? (
          <Login
            show={show[0] && show[1]}
            close={() => {
              setShow([false, false]);
            }}
            switch={() => {
              setShow([true, !show[1]]);
            }}
          />
        ) : (
          <Register
            show={show[0] && !show[1]}
            close={() => {
              setShow([false, false]);
            }}
            switch={() => {
              setShow([true, !show[1]]);
            }}
          />
        )
      ) : null}
    </>
  );
}

function NavBar() {
  const [state, dispatch] = useContext(UserContext);
  return (
    <Navbar expand="md" className={cssMod.navbar}>
      <Container>
        <Link to="/" className={`${cssMod.navBrand} text-decoration-none`}>
          WaysFood
          <img
            alt=""
            src="/icon/logoicon.svg"
            width="40px"
            height="40px"
            className="d-inline-block align-top ms-2"
          />
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto"></Nav>
          {state.isLogin ? <AfterLogin state={state} /> : <BeforeLogin />}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
