import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { API } from "../config/api";
import Navbar from "../components/Navbar";
import Map from "../components/Map";
import { Container, Row, Col, Modal } from "react-bootstrap";
import cssMod from "./AddProduct.module.css";

function EditProfile() {
  document.title = "Edit Profile";
  const navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: [],
    image: "",
  });

  const [mapShow, setMapShow] = useState(false);
  const handleMapClose = () => setMapShow(false);
  const handleMapShow = () => setMapShow(true);
  const [location, setLocation] = useState(null);

  const getUserData = async () => {
    try {
      const response = await API.get("/check-auth");

      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      // get user data
      let data = response.data.data.user;
      setForm({
        ...form,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        location: JSON.parse(data.location),
      });
    } catch (error) {
      console.log(error);
    }
  };
  const checkUser = async () => {
    console.log("check user");
    try {
      const response = await API.get("/check-auth");

      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      // get user data
      let payload = response.data.data.user;
      payload.token = localStorage.token;

      // send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // Configuration
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      // store data with formdata object
      const formData = new FormData();
      if (form.image != "") {
        formData.set("image", form.image[0], form.image[0].name);
      }
      formData.set("fullName", form.fullName);
      formData.set("email", form.email);
      formData.set("phone", form.phone);
      formData.set("location", JSON.stringify(form.location));
      console.log(form.location);
      // send data to server
      await API.put("/user", formData, config);
      checkUser();
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
    // setForm({
    //   ...form,
    //   fullName: state.user.fullName,
    //   email: state.user.email,
    //   phone: state.user.phone,
    //   location: state.user.location ? JSON.parse(state.user.location) : "",
    // });
  }, []);

  return (
    <>
      <Navbar />
      <Container className="px-xs-1 px-md-3 px-xl-5 mt-5 pb-5">
        <h4 className="subtitle mb-4">
          {state.user.role === "user" ? "Edit Profile" : "Edit Profile Partner"}
        </h4>
        <form onSubmit={handleSubmit}>
          <Row>
            <Col xs={7} lg={9} xl={10}>
              <input
                type="text"
                placeholder={
                  state.user.role === "user" ? "Full Name" : "Name Partner"
                }
                name="fullName"
                onChange={handleChange}
                value={form.fullName}
                className={cssMod.input}
              />
            </Col>
            <Col xs={5} lg={3} xl={2}>
              <label
                htmlFor="inputfile"
                className={`${cssMod.input} d-flex justify-content-between`}
              >
                <div>Attach Image</div> <img src="/icon/attach.svg" />
              </label>
              <input
                id="inputfile"
                type="file"
                name="image"
                onChange={handleChange}
                hidden
              />
            </Col>
            <Col xs={12}>
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={form.email}
                className={cssMod.input}
              />
              <input
                type="number"
                placeholder="Phone"
                name="phone"
                onChange={handleChange}
                value={form.phone}
                className={cssMod.input}
              />
              <div className="d-flex">
                <input
                  type="text"
                  placeholder="Location"
                  name="location"
                  value={form.location?.name}
                  disabled
                  className={`${cssMod.input} me-4`}
                />
                <div
                  className={`mbtn ${cssMod.mapbtn}`}
                  onClick={handleMapShow}
                >
                  Select On Map <img src="/icon/map.svg" />
                </div>
              </div>
            </Col>
            <Col xs={5} lg={3} className="ms-auto">
              <button type="submit" className={`mbtn ${cssMod.btn}`}>
                Save
              </button>
            </Col>
          </Row>
        </form>
        <Modal
          id="main-modal"
          dialogClassName="modal-90w"
          show={mapShow}
          onHide={handleMapClose}
        >
          <Modal.Body>
            <Map
              type="SELECT"
              default={form.location ? form.location.point : ""}
              handleLocation={(location) => {
                setForm({
                  ...form,
                  location: location,
                });
              }}
              close={handleMapClose}
            />
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}

export default EditProfile;
