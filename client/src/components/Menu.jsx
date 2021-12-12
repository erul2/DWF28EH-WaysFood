import React from "react";
import cssMod from "./Menu.module.css";
import { convert as rupiah } from "rupiah-format";

import { Col } from "react-bootstrap";
function Menu(props) {
  return (
    <Col className="mb-5">
      <div className="bg-body rounded align-items-center p-2 pb-3">
        <div className="p-1">
          <img src={props.img} alt="" className={cssMod.menuImg} />
        </div>
        <h6 className={`${cssMod.name} mt-3 ms-2`}>{props.name}</h6>
        <span className={`${cssMod.price} ms-2 mb-4`}>
          {rupiah(props.price)}
        </span>
        <div className="px-2">
          <button onClick={props.order} className={cssMod.btnOrder}>
            Order
          </button>
        </div>
      </div>
    </Col>
  );
}

export default Menu;
