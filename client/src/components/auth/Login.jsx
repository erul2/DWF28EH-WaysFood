import { useState, useContext } from "react";
import { API } from "../../config/api";
import { Modal, Form, FloatingLabel, Alert } from "react-bootstrap";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
  const [message, setMessage] = useState(null);
  const [state, dispatch] = useContext(UserContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { email, password } = form;
  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnSubmit = async (e) => {
    try {
      e.preventDefault();

      // configuration
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // data Body
      const body = JSON.stringify(form);

      // insert data login proccess
      const response = await API.post("/login", body, config);

      if (response?.status === 200) {
        const payload = response.data.data;
        // send data to useContext
        payload.token = response.data.data.user.token;
        dispatch({
          type: "LOGIN_SUCCESS",
          payload,
        });
      }

      props.close();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal show={props.show} onHide={props.close} centered>
      <Modal.Body className={` px-5`}>
        <div className={"modalTitle"}>Login</div>
        {message && message}
        <Form onSubmit={handleOnSubmit}>
          <FloatingLabel controlId="floatingLoginPassword" label="Email">
            <Form.Control
              onChange={handleOnChange}
              type="email"
              placeholder="Email"
              className="modalInput"
              value={email}
              name="email"
            />
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="Password">
            <Form.Control
              onChange={handleOnChange}
              type="password"
              placeholder="Password"
              className="modalInput"
              value={password}
              name="password"
            />
          </FloatingLabel>
          <button type="submit" className="modalBtn">
            Login
          </button>
          <p className="mt-3 text-center text-muted">
            Don't have an account ? Click{" "}
            <a
              href="#"
              className="fw-bold text-decoration-none link-secondary"
              onClick={props.switch}
            >
              Here
            </a>
          </p>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
