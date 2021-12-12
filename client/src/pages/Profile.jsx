import { useState, useContext, useEffect } from "react";
import { convert as rupiah } from "rupiah-format";
import { UserContext } from "../context/userContext";
import Navbar from "../components/Navbar";
import { API } from "../config/api";

import { Link } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import cssMod from "./Profile.module.css";

function Profile() {
  const [state, dispatch] = useContext(UserContext);
  const [trx, setTrx] = useState(null);

  document.title = state.user.role === "user" ? "Profile" : "Profile Partner";

  const getTrx = async () => {
    console.log("ngambil data trx");
    try {
      const uri =
        state.user.role === "user"
          ? "/my-transactions"
          : `/transactions/${state.user.id}`;

      const response = await API.get(uri);

      setTrx(response.data.data.transactions);

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTrx();
  }, [state.user]);

  return (
    <>
      <Navbar />
      <Container className="px-xs-1 px-md-3 px-xl-5 mt-5 pb-5">
        <Row>
          <Col md={7} xl={8} className="mb-sm-5 mb-lg-0">
            <h4 className="subtitle mb-4">
              {state.user.role === "user" ? "Profile" : "Profile Partner"}
            </h4>
            <div className="d-flex">
              <div className="d-flex flex-column">
                <img
                  className="mb-4"
                  src={
                    state.user.image
                      ? state.user.image
                      : "/img/avatar/default.png"
                  }
                  width="180px"
                  height="221px"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
                <Link to="/edit-profile" className="mbtn">
                  <div>Edit Profile</div>
                </Link>
              </div>
              <div className="ms-4">
                <div className={cssMod.titleGroup}>
                  <div className={cssMod.title}>Full Name</div>
                  <div className={cssMod.valueName}>{state.user.fullName}</div>
                </div>
                <div className={cssMod.titleGroup}>
                  <div className={cssMod.title}>Email</div>
                  <div className={cssMod.value}>{state.user.email}</div>
                </div>
                <div className={cssMod.titleGroup}>
                  <div className={cssMod.title}>Phone</div>
                  <div className={cssMod.value}>{state.user.phone}</div>
                </div>
              </div>
            </div>
          </Col>
          <Col md={5} xl={4}>
            <h4 className="subtitle mb-4">History Transaction</h4>
            {trx?.length > 0
              ? trx.map((tr, index) => (
                  <Transaction
                    key={index}
                    name={tr.resto ? tr.resto : tr.userOrder}
                    date={tr.date}
                    total={rupiah(tr.total)}
                    status={tr.status}
                  />
                ))
              : "kosong"}
          </Col>
        </Row>
      </Container>
    </>
  );
}

function Transaction(props) {
  let statusStyle = "statusWaitingApprove";

  if (props.status === "On the way") {
    statusStyle = "statusOnTheWay";
  } else if (props.status === "Order success") {
    statusStyle = "statusOrderSuccess";
  } else if (props.status === "Cancel") {
    statusStyle = "statusOrderCancle";
  }

  return (
    <Row className={`${cssMod.trxGroup} my-3`}>
      <Col xs={8} md={6} lg={7} className="d-flex flex-column">
        <div className={cssMod.trxName}>{props.name}</div>
        <div>
          <span className={cssMod.trxDay}>{props.date.day}, </span>{" "}
          {props.date.date}
          {/* {props.date} */}
        </div>
        <div className={cssMod.trxTotal}>Total : {props.total}</div>
      </Col>
      <Col xs={4} md={6} lg={5} className="d-flex flex-column">
        <div className={`d-flex align-items-center`}>
          <div className={cssMod.trxLogo}>WaysFood </div>
          <img src="/icon/logoicon.svg" />
        </div>
        <div className={`${cssMod.trxStatus} ${statusStyle}`}>
          {props.status}
        </div>
      </Col>
    </Row>
  );
}

export default Profile;
