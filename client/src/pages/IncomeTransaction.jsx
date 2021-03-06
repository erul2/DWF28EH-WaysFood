import { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import { API } from "../config/api";
import cssMod from "./IncomeTransaction.module.css";
import { Container } from "react-bootstrap";
import { UserContext } from "../context/userContext";
import { Modal, Button } from "react-bootstrap";

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
      <Container className="px-xs-1 px-md-3 px-xl-5 mt-5 pb-5">
        <h4 className={`${cssMod.title} mb-4`}>Income Transaction</h4>
        {trans.length > 0 ? (
          <table className={cssMod.tableGroup}>
            <thead style={{ textAlign: "center" }}>
              <tr style={{ backgroundColor: "#E5E5E5" }}>
                <th style={{ width: "75px" }}>No</th>
                <th style={{ width: "200px" }}>Name</th>
                <th>Address</th>
                <th style={{ width: "250px" }}>Product Order</th>
                <th style={{ width: "200px" }}>Status</th>
                <th style={{ width: "200px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {trans.map((tr, index) => {
                const tmpAddr = JSON.parse(tr.address);
                const tmpDeliveryAddress = JSON.parse(tmpAddr.deliveryAddress);
                const address = `${tmpDeliveryAddress.name}, ${tmpDeliveryAddress.address}`;
                return (
                  <TransList
                    id={tr.id}
                    // action={setTransaction}
                    action={() => setDialog({ show: true })}
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
        ) : (
          "ga ada"
        )}
      </Container>
      <Modal
        show={dialog.show}
        onHide={() => setDialog(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>"halo"</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDialog(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => console.log("confirm")}>
            Understood
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
      <button
        onClick={() => {
          props.action(props.id, "CANCEL");
        }}
        className={cssMod.btnCancel}
      >
        Cancel
      </button>
      <button
        onClick={() => {
          //props.action(props.id, "APPROVE");
          props.action();
        }}
        className={cssMod.btnApprove}
      >
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
    button = (
      <img
        onClick={() => {
          props.action(props.id, "DELETE");
        }}
        src="/icon/cancel.svg"
        alt=""
      />
    );
  }

  return (
    <tr style={{ backgroundColor: "white" }}>
      <td>{props.index}</td>
      <td>{props.fullName}</td>
      <td>{props.address}</td>
      <td>
        {props.orders.map((order) => {
          return (
            <div>
              {order.qty}x {order.title}
            </div>
          );
        })}
      </td>
      <td className={textStyle} style={{ textAlign: "center" }}>
        {props.status}
      </td>
      <td>
        <div className={cssMod.btnGroup}>{button}</div>
      </td>
    </tr>
  );
};
