import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import getDistance from "../getDistance";
import { API } from "../config/api";
import Hero from "../components/Hero";
import PopularRestaurant from "../components/Popular";
import RestaurantNear from "../components/Near";
import Navbar from "../components/Navbar";

import { Container } from "react-bootstrap";
import cssMod from "./Home.module.css";

function Home() {
  const [state, dispatch] = useContext(UserContext);
  const start =
    state.isLogin && state.user?.location
      ? JSON.parse(state.user.location).point
      : null;
  document.title = "Ways Food";
  const [resto, setResto] = useState({ pop: null, near: null });

  // get resto data
  const getResto = async () => {
    try {
      const response = await API.get("/restos");
      setResto(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getResto();
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <Container className="px-xs-1 px-md-3 px-xl-5">
        <Container className="mt-5 py-5">
          <h4 className={`${cssMod.title} mb-4`}>Popular Restaurant</h4>
          <div className="row row-cols-2 row-cols-lg-4 g-2 g-lg-3">
            {resto.pop &&
              resto.pop.map((resto, index) => (
                <PopularRestaurant
                  key={index}
                  img={resto.image}
                  name={resto.fullName}
                  id={resto.id}
                />
              ))}
          </div>
        </Container>
        <Container className="mt-5 pb-5">
          <h4 className={`${cssMod.title} mb-4`}>Restaurant Near You</h4>
          <div className="row row-cols-2 row-cols-lg-4 g-3 g-lg-4">
            {resto.near &&
              resto.near.map((resto, index) => {
                let end = JSON.parse(resto.location)?.point;
                return (
                  <RestaurantNear
                    key={index}
                    img={resto.image}
                    name={resto.fullName}
                    id={resto.id}
                    distance={
                      start
                        ? getDistance(
                            { lat: start[1], long: start[0] },
                            { lat: end[1], long: end[0] }
                          )
                        : 0
                    }
                  />
                );
              })}
          </div>
        </Container>
      </Container>
    </>
  );
}

export default Home;
