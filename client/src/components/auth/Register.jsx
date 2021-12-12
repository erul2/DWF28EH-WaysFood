import { useState } from "react";
import { API } from "../../config/api";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Form, FloatingLabel, Alert } from "react-bootstrap";

export default function Register(props) {
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    gender: "Gender",
    phone: "",
    role: "user",
  });

  const { email, password, fullName, gender, phone, role } = form;

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnSubmit = async (e) => {
    try {
      e.preventDefault();
      // create configuration
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // convert data to string
      const body = JSON.stringify(form);

      //insert data to database
      const response = await API.post("/register", body, config);

      if (response.data.status == "success") {
        // todo add notification
        setMessage(
          <Alert variant="success" className="py-1">
            Success
          </Alert>
        );
        setTimeout(() => {
          props.switch();
        }, 1000);
      } else {
        setMessage(
          <Alert variant="danger" className="py-1">
            Register failed
          </Alert>
        );
      }
    } catch (error) {
      const alert = error.response.data.message
        ? error.response.data.message
        : error.response.data.error.message;
      setMessage(
        <Alert variant="danger" className="py-1">
          Failed, {alert}
        </Alert>
      );
      console.log(error.response);
    }
  };

  return (
    <Modal show={props.show} onHide={props.close} centered>
      <Modal.Body className={`px-5`}>
        <div className={"modalTitle"}>Register</div>
        {message && message}
        <Form onSubmit={handleOnSubmit}>
          <FloatingLabel label="Email">
            <Form.Control
              onChange={handleOnChange}
              type="email"
              className="modalInput"
              placeholder="Email"
              value={email}
              name="email"
            />
          </FloatingLabel>
          <FloatingLabel label="Password">
            <Form.Control
              className="modalInput"
              onChange={handleOnChange}
              type="password"
              placeholder="Password"
              value={password}
              name="password"
            />
          </FloatingLabel>
          <FloatingLabel controlId="floatingName" label="Full Name">
            <Form.Control
              onChange={handleOnChange}
              type="text"
              className="modalInput"
              placeholder="FullName"
              value={fullName}
              name="fullName"
            />
          </FloatingLabel>
          <select
            onChange={handleOnChange}
            name="gender"
            className="modalInput"
            defaultValue={gender}
            style={{
              width: "100%",
              padding: ".9rem .5rem",
              borderRadius: "5px",
            }}
          >
            <option disabled={true}>Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <FloatingLabel controlId="floatingPhone" label="Phone">
            <Form.Control
              className="modalInput"
              onChange={handleOnChange}
              type="number"
              placeholder="Phone"
              value={phone}
              name="phone"
            />
          </FloatingLabel>
          <select
            onChange={handleOnChange}
            name="role"
            defaultValue="user"
            value={role}
            className="modalInput"
            style={{
              width: "100%",
              padding: ".9rem .5rem",
              borderRadius: "5px",
            }}
          >
            <option value="user">As User</option>
            <option value="partner">As Partner</option>
          </select>
          <button className="modalBtn" type="submit">
            Register
          </button>
          <p className="mt-3 text-center text-muted">
            Aleready have an account ? Click{" "}
            <a
              onClick={props.switch}
              href="#"
              className="fw-bold text-decoration-none link-secondary"
            >
              Here
            </a>
          </p>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
