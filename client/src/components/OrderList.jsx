import React from "react";
import { convert as rupiah } from "rupiah-format";
import cssMod from "./OrderList.module.css";

function OrderList(props) {
  return (
    <div className={`${cssMod.list} ms-1 align-items-center d-flex`}>
      <div className="p-0">
        <img src={props.img} className={cssMod.listImg} alt="" />
      </div>
      <div xs={6} className="flex-grow-1 ms-3">
        <div className={cssMod.name}>{props.name}</div>
        <div className={cssMod.btnGroup}>
          <div className={cssMod.btn} onClick={props.sub}>
            -
          </div>
          <div className={cssMod.qty}>{props.qty}</div>
          <div className={cssMod.btn} onClick={props.add}>
            +
          </div>
        </div>
      </div>
      <div xs={3} className={`${cssMod.price} d-flex flex-column `}>
        {rupiah(props.price)}
        <img
          src="/icon/trash.svg"
          width="20px"
          height="20px"
          className={`ms-auto mt-2 ${cssMod.trash}`}
          onClick={props.del}
          alt=""
        />
      </div>
    </div>
  );
}

export default OrderList;
