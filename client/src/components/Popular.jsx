import { Link } from "react-router-dom";
import { Col } from "react-bootstrap";
import cssMod from "./Popular.module.css";

function PopularRestaurant(props) {
  return (
    <Link to={`/restaurant-menus/${props.id}`} className={cssMod.link}>
      <Col>
        <div className="d-flex bg-body rounded align-items-center">
          <img src={props.img} alt="" className="p-3" />
          <div>
            <span className={`${cssMod.name}`}>{props.name}</span>
          </div>
        </div>
      </Col>
    </Link>
  );
}

export default PopularRestaurant;
