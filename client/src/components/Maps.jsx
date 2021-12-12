import React, { useState, useRef, useEffect } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { getAddress, getRoute } from "../MapBox";

import { eUserMarker, eStartMarker } from "./MyMarker";
import "./Maps.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZXJ1bDQwNCIsImEiOiJja3cxcThyMGExYmRzMnBub3YzM240d2lhIn0.TEgC8IOSZLd-wGcQuixkbQ";

function Maps(props) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(106.840342);
  const [lat, setLat] = useState(-6.1771243);
  const [zoom, setZoom] = useState(15);

  const [placeName, setPlaceName] = useState("Harbour Building");

  const [placeAddress, setPlaceAddress] = useState(
    "Jl. Elang IV No.48, Sawah Lama, Kec. Ciputat, Kota Tangerang Selatan, Banten 15413, Indonesia"
  );

  const [mapsRoutes, setMapsRoutses] = useState([]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      width: "100%",
      height: "100%",
      zoom: zoom,
    });

    map.current.on("click", (e) => userMarker(e.lngLat));

    if (props.b != undefined) restoMarker(props.b);
  });

  const UserMarker = new mapboxgl.Marker(eUserMarker);
  const StartMarker = new mapboxgl.Marker(eStartMarker);

  function showRoute(route) {
    console.log(route);

    // // add to map
    // map.current.addLayer({
    //   id: "route",
    //   type: "line",
    //   source: "route",
    //   layout: {
    //     "line-join": "round",
    //     "line-cap": "round",
    //   },
    //   paint: {
    //     "line-color": "#888",
    //     "line-width": 8,
    //   },
    // });
  }

  async function userMarker(e) {
    UserMarker.setLngLat(e).addTo(map.current);
    let data = await getAddress(e.lng, e.lat);
    setPlaceName(data.name);
    setPlaceAddress(data.address);
    let routes = await getRoute([lng, lat], [e.lng, e.lat]);
    setMapsRoutses(routes.route);
    const route = await routes.route;
    console.log(route);
    showRoute(route);
  }

  function restoMarker(e) {
    StartMarker.setLngLat(e).addTo(map.current);
  }

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [-122.483696, 37.833818],
            [-122.483482, 37.833174],
            [-122.483396, 37.8327],
            [-122.483568, 37.832056],
            [-122.48404, 37.831141],
            [-122.48404, 37.830497],
            [-122.483482, 37.82992],
            [-122.483568, 37.829548],
            [-122.48507, 37.829446],
            [-122.4861, 37.828802],
            [-122.486958, 37.82931],
            [-122.487001, 37.830802],
            [-122.487516, 37.831683],
            [-122.488031, 37.832158],
            [-122.488889, 37.832971],
            [-122.489876, 37.832632],
            [-122.490434, 37.832937],
            [-122.49125, 37.832429],
            [-122.491636, 37.832564],
            [-122.492237, 37.833378],
            [-122.493782, 37.833683],
          ],
        },
      },
      // type: "geoJson",
      // data: {
      //   type: "feature",
      //   properties: {},
      //   geometry: {
      //     type: "LineString",
      //     coordinates: mapsRoutes,
      //   },
      // },
    });
  });

  const popBottom = true;

  return (
    <div>
      {popBottom ? (
        <div className="mapPop bottom">
          <div className="d-flex flex-column" style={{ height: "100%" }}>
            <h5 className="mapTitle">Select My Location</h5>
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
            <button className="mbtn">Confirm Location</button>
          </div>
        </div>
      ) : (
        <div className="mapPop right">
          <div className="d-flex flex-column" style={{ height: "100%" }}>
            <h5 className="mapTitle">Select</h5>

            <div className="mt-2 flex-fill d-flex">
              <img
                src="/icon/location.svg"
                alt="maps"
                width="55px"
                height="55px"
              />
              <div className="address align-self-center">
                <h6 className="mapName">Nama tempat</h6>
                <p className="mapAddress">Alamat</p>
              </div>
            </div>
            <button className="mbtn">confirm location</button>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default Maps;
