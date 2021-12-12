import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { API } from "../config/api";
import { Modal, Button, Container } from "react-bootstrap";
import Navbar from "../components/Navbar";
import cssMod from "./IncomeTransaction.module.css";

export default function IncomeTransaction() {
  document.title = "Ways Food - Income Transaction";

  const [state, setState] = useContext(UserContext);
  const [trans, setTrans] = useState([]);
  const [dialog, setDialog] = useState({
    show: false,
  });

  // get transactions data
  const getTransactions = async () => {
    try {
      const response = await API.get(`/transactions/${state.user.id}`);
      setTrans(response.data.data.transactions);
    } catch (error) {
      console.log(error);
    }
  };

  const setTransaction = async (id, action) => {
    try {
      let status = "";

      if (action === "APPROVE") {
        status = "On the way";
      } else if (action === "CANCEL") {
        status = "Cancel";
      } else if (action === "DELETE") {
        //action delete order
        await API.delete(`/transaction/${id}`);
        return getTransactions();
      }

      // configuration
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // data Body
      const data = {
        status,
      };

      const body = JSON.stringify(data);

      await API.put(`/transaction/${id}`, body, config);

      getTransactions();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <>
      <Navbar />
      {trans.length > 0 ? (
        <Container className="px-xs-1 px-md-3 px-xl-5 mt-5 pb-5">
          <h1 className={`abhaya mb-5 pt-4`}>Income Transaction</h1>

          <div style={{ overflowX: "scroll" }}>
            <table
              className={`${cssMod.tableGroup} inter`}
              style={{ maxWidth: "100%" }}
            >
              <thead style={{ textAlign: "center" }}>
                <tr style={{ backgroundColor: "#E5E5E5" }}>
                  <th style={{ width: "75px" }}>No</th>
                  <th style={{ width: "200px" }}>Name</th>
                  <th>Address</th>
                  <th style={{ width: "169px" }}>Product Order</th>
                  <th style={{ width: "160px" }}>Status</th>
                  <th style={{ minWidth: "200px", maxWidth: "200px" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {trans.map((tr, index) => {
                  const tmpAddr = JSON.parse(tr.address);
                  const tmpDeliveryAddress = JSON.parse(
                    tmpAddr.deliveryAddress
                  );
                  const address = `${tmpDeliveryAddress.name}, ${tmpDeliveryAddress.address}`;
                  return (
                    <TransList
                      approve={() => {
                        setDialog({
                          show: true,
                          title: "Approve",
                          message:
                            "This order cannot be canceled once you have approved!",
                          action: () => setTransaction(tr.id, "APPROVE"),
                        });
                      }}
                      cancel={() => {
                        setDialog({
                          show: true,
                          title: "Cancel",
                          message:
                            "Are you sure you want to cancel this order? ",
                          desc: "This action cannot be undone.",
                          action: () => setTransaction(tr.id, "CANCEL"),
                        });
                      }}
                      delete={() => {
                        setDialog({
                          show: true,
                          title: "Delete",
                          message:
                            "Are you sure you want to delete this order? ",
                          desc: "This action cannot be undone.",
                          action: () => setTransaction(tr.id, "DELETE"),
                        });
                      }}
                      key={index}
                      index={index + 1}
                      fullName={tr.userOrder}
                      address={address}
                      orders={tr.order}
                      status={tr.status}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </Container>
      ) : (
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          <h3 className="py-5">
            There seems to be no transaction at this time
          </h3>
        </Container>
      )}
      <Modal
        show={dialog.show}
        onHide={() => setDialog(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header>
          <h4>{dialog?.title}</h4>
        </Modal.Header>
        <Modal.Body>
          <p className="h5">{dialog?.message}</p>
          <p className="h6">{dialog?.desc}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDialog({ show: false })}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              dialog.action();
              setDialog({ show: false });
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const TransList = (props) => {
  let textStyle = "textWarning";

  let button = (
    <>
      <button onClick={props.cancel} className={cssMod.btnCancel}>
        Cancel
      </button>
      <button onClick={props.approve} className={cssMod.btnApprove}>
        Approve
      </button>
    </>
  );

  if (props.status === "On the way") {
    textStyle = "textInfo";
    button = <img src="/icon/success.svg" alt="" />;
  } else if (props.status === "Order success") {
    textStyle = "textSuccess";
    button = <img src="/icon/success.svg" alt="" />;
  } else if (props.status === "Cancel") {
    textStyle = "textWarning";
    button = <img onClick={props.delete} src="/icon/cancel.svg" alt="" />;
  }

  return (
    <tr style={{ backgroundColor: "white" }}>
      <td>{props.index}</td>
      <td
        style={{
          whiteSpace: "nowrap",
          width: "183px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textTransform: "capitalize",
        }}
      >
        {props.fullName}
      </td>
      <td>
        <div
          style={{
            whiteSpace: "nowrap",
            width: "280px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textTransform: "capitalize",
          }}
        >
          {props.address}
        </div>
      </td>
      <td>
        <div
          style={{
            whiteSpace: "nowrap",
            width: "169px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textTransform: "capitalize",
          }}
        >
          {props.orders.map((order, i) => {
            let product = order.title;
            if (i > 0 && i < props.orders.length) {
              return ", " + product;
            }
            return product;
          })}
        </div>
      </td>
      <td
        className={`${textStyle} avenir`}
        style={{ textAlign: "center", minWidth: "160px" }}
      >
        {props.status}
      </td>
      <td style={{ width: "169px" }}>
        <div className={cssMod.btnGroup}>{button}</div>
      </td>
    </tr>
  );
};
