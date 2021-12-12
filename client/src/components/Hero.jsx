import React from "react";
import cssMod from "./Hero.module.css";
import { Col, Container, Row } from "react-bootstrap";

function Hero() {
  return (
    <Container fluid className={`${cssMod.hero} pt-5`}>
      <Row>
        <Col md={5} className="offset-lg-1 offset-xl-2 me-0 pe-0">
          <p className={cssMod.title}>
            Are You Hungry? <br /> Express Home Delivery
          </p>
          <Row>
            <Col md={3}>
              <div className={cssMod.line} />
            </Col>
            <Col md={8}>
              <p className={cssMod.summary}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s.
              </p>
            </Col>
          </Row>
        </Col>
        <Col className="mb-xl-5">
          <img src="/img/img-hero.png" alt="" width="408px" height="393px" />
        </Col>
      </Row>
    </Container>
  );
}

export default Hero;
