import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import OrderList from "../components/OrderList";
import { API } from "../config/api";
import cssMod from "./CartOrder.module.css";
import { convert as rupiah } from "rupiah-format";
import { capitalCase } from "capital-case";
import { UserContext } from "../context/userContext";
import { CartContext } from "../context/cartContext";
import Navbar from "../components/Navbar";
import { Container, Row, Col, Modal, FormControl } from "react-bootstrap";
import userNotif from "../notif/userNotif";

function CartOrder() {
  document.title = "WaysFood - Cart Order";

  const navigate = useNavigate();

  const [cart, cartDispatch] = useContext(CartContext);
  const [state, dispatch] = useContext(UserContext);
  const [location, setLocation] = useState(null);

  const [mapShow, setMapShow] = useState(false);
  const [mapType, setMapType] = useState("DELIVERY_LOCATION");
  const [subtotal, setSubtotal] = useState(null);
  const [totalQty, setTotalQty] = useState(null);
  const [shippingCost, setShippingCost] = useState(null);
  const { sendNotif } = userNotif(cart?.id);

  const addSub = (id, type) => {
    if (cart.status) {
      return null;
    }

    let dataOrder = cart.orders;

    for (let i = 0; i < dataOrder.length; i++) {
      if (dataOrder[i].id === id) {
        switch (type) {
          case "add":
            dataOrder[i].qty += 1;
            break;
          case "sub":
            if (dataOrder[i].qty > 1) dataOrder[i].qty -= 1;
            break;
          case "delete":
            if (dataOrder.length === 1) {
              return cartDispatch({
                type: "CLEAR_CART",
              });
            } else {
              dataOrder.splice(i, 1);
            }
            break;
        }
      }
    }

    cartDispatch({
      type: "UPDATE_ORDER",
      payload: {
        orders: dataOrder,
      },
    });
  };

  useEffect(() => {
    let subtotal = 0;
    let qty = 0;

    cart.orders.map((order) => {
      subtotal += order.price * order.qty;
      qty += order.qty;
    });

    setTotalQty(qty);
    setSubtotal(subtotal);
    setShippingCost(10000);
  }, [cart]);

  const handleSubmit = async () => {
    const products = cart.orders.map((menu) => {
      return {
        id: menu.id,
        qty: menu.qty,
      };
    });

    const body = JSON.stringify({
      deliveryAddress: location,
      resto: cart.seller.id,
      products,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await API.post("/transaction", body, config);
    const data = response.data.data.transaction;

    cartDispatch({
      type: "UPDATE_STATUS",
      payload: {
        id: data.id,
        status: data.status,
      },
    });

    sendNotif({
      id: data.id,
    });
  };

  const handleFinishOrder = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify({
        status: "Order success",
      });

      await API.put(`/transaction/${cart.id}`, body, config);

      cartDispatch({
        type: "CLEAR_CART",
      });

      sendNotif({
        id: cart.id,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(location);
    if (state.user.location && !location) {
      setLocation(JSON.parse(state.user.location));
    } else {
      setLocation("");
    }
    console.log("effect dipanggil");
  }, [state.user.location]);

  return (
    <>
      <Navbar />
      <Container className="px-xs-1 px-md-3 px-xl-5">
        <Container className="mt-5 pb-5">
          {cart.orders.length > 0 ? (
            <>
              <h4 className="subtitle mb-4">
                {capitalCase(cart.seller.fullName)}
              </h4>
              <h6 className={cssMod.description}>Delivery Location</h6>
              <Row>
                <Col xs={8} md={9} xl={10}>
                  <FormControl type="text" disabled value={location?.name} />
                </Col>
                <Col xs={4} md={3} xl={2}>
                  <div
                    className={cssMod.btn}
                    onClick={() => {
                      if (cart.status) return null;
                      setMapType("DELIVERY_LOCATION");
                      setMapShow(true);
                    }}
                  >
                    Select On Map
                    <img
                      src="/icon/map.svg"
                      width="20px"
                      height="20px"
                      className="ms-2"
                    />
                  </div>
                </Col>
                <span className={cssMod.description}>Review Your Order</span>
                <Col xs={12} md={8}>
                  <div className={cssMod.divider} />
                  {cart.orders.map((o, index) => (
                    <OrderList
                      key={index}
                      add={() => {
                        addSub(o.id, "add");
                      }}
                      sub={() => {
                        addSub(o.id, "sub");
                      }}
                      del={() => {
                        addSub(o.id, "delete");
                      }}
                      img={o.image}
                      name={o.title}
                      qty={o.qty}
                      price={o.price}
                      id={o.id}
                    />
                  ))}
                </Col>
                <Col xs={12} md={4} className={`${cssMod.divider} py-3 px-0`}>
                  <table className={cssMod.table}>
                    <tbody>
                      <tr>
                        <td>Subtotal</td>
                        <td className={cssMod.right}>{rupiah(subtotal)}</td>
                      </tr>
                      <tr>
                        <td>Qty</td>
                        <td className={`${cssMod.qty}`}>{totalQty}</td>
                      </tr>
                      <tr>
                        <td>Shipping Cost</td>
                        <td className={cssMod.right}>{rupiah(shippingCost)}</td>
                      </tr>
                      <tr className={cssMod.dividerGroup}>
                        <td className={cssMod.divider} />
                        <td className={cssMod.divider} />
                      </tr>
                      <tr>
                        <td>Total</td>
                        <td className={cssMod.right}>
                          {rupiah(subtotal + shippingCost)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div
                    className="mbtn"
                    style={{
                      width: "80%",
                      marginLeft: "auto",
                      height: "2.5rem",
                      padding: ".5rem",
                      marginTop: "5rem",
                    }}
                    onClick={() => {
                      if (cart.status) {
                        setMapType("STATUS");
                        setMapShow(true);
                      } else {
                        handleSubmit();
                      }
                    }}
                  >
                    {cart.status ? "See How Far ?" : "Order"}
                  </div>
                </Col>
              </Row>
            </>
          ) : (
            <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
              <h2 className="mt-5">
                Let's order delicious food at the best restaurant
              </h2>
            </div>
          )}
        </Container>
        <Modal
          show={mapShow}
          onHide={() => {
            setMapShow(false);
          }}
          dialogClassName="modal-90w"
        >
          <Modal.Body>
            <Map
              type={mapType}
              default={location?.point}
              handleLocation={(loc) => {
                setLocation(loc);
              }}
              transaction={cart.id}
              update={handleFinishOrder}
              close={() => {
                setMapShow(false);
              }}
            />
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}

export default CartOrder;
