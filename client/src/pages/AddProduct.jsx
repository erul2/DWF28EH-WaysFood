import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../config/api";
import { Container, Row, Col, Modal } from "react-bootstrap";
import cssMod from "./AddProduct.module.css";
import Navbar from "../components/Navbar";

function AddProduct() {
  document.title = "Add Product";
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({
    title: "",
    price: "",
    image: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // configuration
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    // store to form data as object
    const formData = new FormData();
    formData.set("title", form.title);
    formData.set("image", form.image[0], form.image[0].name);
    formData.set("price", form.price);

    // send to API
    await API.post("/product", formData, config);
    navigate("/");
  };

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  return (
    <>
      <Navbar />
      <Container className="px-xs-1 px-md-3 px-xl-5 mt-5 pb-5">
        <h4 className="subtitle mb-4">Add Product</h4>
        <form onSubmit={handleSubmit}>
          <Row>
            <Col xs={7} lg={9} xl={10}>
              <input
                type="text"
                value={form.title}
                name="title"
                placeholder="Title"
                onChange={handleOnChange}
                className={cssMod.input}
              />
            </Col>
            <Col xs={5} lg={3} xl={2}>
              <div className="d-flex">
                {preview && (
                  <div className="d-flex me-3">
                    <img
                      src={preview}
                      style={{
                        maxWidth: "45px",
                        maxHeight: "45px",
                        objectFit: "cover",
                      }}
                      alt="preview"
                      onClick={() => setShowPreview(true)}
                    />
                  </div>
                )}
                <label
                  htmlFor="inputfile"
                  className={`${cssMod.input} d-flex justify-content-between`}
                >
                  <div>{preview ? "Change" : "Attach Image"}</div>{" "}
                  <img src="/icon/attach.svg" />
                </label>
                <input
                  id="inputfile"
                  type="file"
                  name="image"
                  onChange={handleOnChange}
                  hidden
                />
              </div>
            </Col>
            <Col xs={12}>
              <input
                type="number"
                placeholder="Price"
                name="price"
                onChange={handleOnChange}
                className={cssMod.input}
              />
            </Col>
            <Col xs={5} lg={3} className="ms-auto">
              <button type="submit" className={`mbtn ${cssMod.btn}`}>
                Save
              </button>
            </Col>
          </Row>
        </form>
      </Container>
      <Modal
        id="modalPreview"
        show={showPreview}
        onHide={() => setShowPreview(false)}
        centered
      >
        <Modal.Body>
          <img src={preview} alt="Preview" style={{ width: "100%" }} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddProduct;
