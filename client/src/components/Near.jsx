import React from "react";
import { Link } from "react-router-dom";
import { Col } from "react-bootstrap";
import cssMod from "./Near.module.css";

function RestaurantNear(props) {
  return (
    <Link to={`restaurant-menus/${props.id}`} className={cssMod.link}>
      <Col>
        <div className="bg-body rounded align-items-center p-2 pb-3">
          <div className="p-1">
            <img src={props.img} alt="" className={cssMod.restoImg} />
          </div>
          <h6 className={`${cssMod.name} mt-3 ms-2`}>{props.name}</h6>
          <span className={`${cssMod.distance} ms-2`}>{props.distance} KM</span>
        </div>
      </Col>
    </Link>
  );
}

export default RestaurantNear;
