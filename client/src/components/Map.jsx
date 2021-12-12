import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { getAddress, getRoute, addRoute } from "../MapBox";
import { API } from "../config/api";
import { eUserMarker, eStartMarker } from "./MyMarker";

import "./Maps.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZXJ1bDQwNCIsImEiOiJja3cxcThyMGExYmRzMnBub3YzM240d2lhIn0.TEgC8IOSZLd-wGcQuixkbQ";

function Map(props) {
  const [placeName, setPlaceName] = useState("");
  const [placeAddress, setPlaceAddress] = useState("");
  const [pos, setPos] = useState([106.84192986773473, -6.176501473431884]);
  const [popBottom, setPop] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [duration, setDuration] = useState(null);
  const mapContainer = useRef();
  const map = useRef(null);

  const UserMarker = new mapboxgl.Marker(eUserMarker);
  const StartMarker = new mapboxgl.Marker(eStartMarker);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: pos,
      width: "100%",
      height: "100%",
      zoom: 15,
    });

    if (props.type === "STATUS") {
      setPop(false);
    } else {
      map.current.on("click", (e) => userMarker(e.lngLat));
    }

    map.current.on("load", () => {
      switch (props.type) {
        default:
        case "SELECT":
          if (props.default === "") {
            if ("geolocation" in navigator) {
              navigator.geolocation.getCurrentPosition((position) => {
                let dataLocation = {
                  lng: position.coords.longitude,
                  lat: position.coords.latitude,
                };
                userMarker(dataLocation);
                map.current.setCenter([dataLocation.lng, dataLocation.lat]);
              });
            } else {
              console.log("not support geo location");
            }
          } else {
            userMarker({ lng: props.default[0], lat: props.default[1] });
            console.log(props.default);
            console.log("set user loc" + props.default);
            console.log(pos);
            map.current.setCenter([props.default[0], props.default[1]]);
          }
          break;
        case "STATUS":
          console.log("status");
          console.log(props.transaction);
          getTransaction();
          break;
      }
    });
    if (props.b) restoMarker(props.b);
  });

  // get transaction details
  const getTransaction = async () => {
    try {
      const response = await API.get(`/transaction/${props.transaction}`);
      const data = response.data.data.transactions;
      const tmpAddres = JSON.parse(data.address);

      setTransaction({
        id: props.transaction,
        address: {
          deliveryAddress: JSON.parse(tmpAddres.deliveryAddress),
          restoAddress: JSON.parse(tmpAddres.restoAddress),
        },
        status: data.status,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // get route
  const getRouteData = async () => {
    if (!transaction) return null;
    const start = transaction.address.deliveryAddress.point;
    const end = transaction.address.restoAddress.point;

    const route = await getRoute(start, end);

    setDuration(route.duration);

    map.current.setCenter(start);
    map.current.setZoom(13);

    userMarker({ lng: start[0], lat: start[1] });

    restoMarker(end);

    addRoute(map.current, route.route);
  };

  useEffect(() => {
    getRouteData();
  }, [transaction]);

  async function userMarker(e) {
    UserMarker.setLngLat(e).addTo(map.current);
    let data = await getAddress(e.lng, e.lat);
    if (data) {
      setPlaceName(data.name);
      setPlaceAddress(data.address);
      setPos([e.lng, e.lat]);
    }
  }

  function restoMarker(e) {
    StartMarker.setLngLat([e[0], e[1]]).addTo(map.current);
  }

  return (
    <div>
      {popBottom ? (
        <div className="mapPop bottom">
          <div className="d-flex flex-column" style={{ height: "100%" }}>
            <h5 className="mapTitle">
              {props.type === "SELECT"
                ? "Select My Location"
                : "Select Delivery Location"}
            </h5>
            <div className="mt-2 flex-fill d-flex">
              <img
                src="/icon/location.svg"
                alt="maps"
                width="55px"
                height="55px"
              />
              <div className="address align-self-center">
                <h6 className="mapName">{placeName}</h6>
                <p className="mapAddress">{placeAddress}</p>
              </div>
            </div>
            <button
              className="mbtn"
              onClick={() => {
                props.handleLocation({
                  name: placeName,
                  address: placeAddress,
                  point: pos,
                });
                props.close();
              }}
            >
              Confirm Location
            </button>
          </div>
        </div>
      ) : (
        <div className="mapPop right">
          <div className="d-flex flex-column" style={{ height: "100%" }}>
            <h5 className="mapTitle">
              {transaction?.status && transaction?.status === "On the way"
                ? "Driver is On The Way"
                : "Waiting for the transaction to be approved"}
            </h5>

            <div className="mt-2 flex-fill d-flex">
              <img
                src="/icon/location.svg"
                alt="maps"
                width="55px"
                height="55px"
              />
              <div className="address align-self-center">
                <h6 className="mapName">
                  {transaction?.address.deliveryAddress.name}
                </h6>
                <p className="mapAddress">
                  {transaction?.address.deliveryAddress.address}
                </p>
              </div>
            </div>
            <p className="mapTitle">Delivery Time</p>
            <p className="mapDeliveryTime">{duration && duration} Minutes</p>

            {transaction?.status && transaction?.status === "On the way" ? (
              <button className="mbtn" onClick={props.update}>
                Finish Order
              </button>
            ) : null}
          </div>
        </div>
      )}
      <div ref={mapContainer} style={{ width: "100%", height: "65vh" }} />
    </div>
  );
}

export default Map;
