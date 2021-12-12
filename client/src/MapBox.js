const BASE_URL = `https://api.mapbox.com`;
const API_KEY =
  "pk.eyJ1IjoiZXJ1bDQwNCIsImEiOiJja3cxcThyMGExYmRzMnBub3YzM240d2lhIn0.TEgC8IOSZLd-wGcQuixkbQ";

// function handle request to api
async function getRequest(url) {
  const res = await fetch(url, {});
  return await res.json();
}

// get route
export async function getRoute(start, end) {
  const url = `${BASE_URL}/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${API_KEY}`;

  const data = await getRequest(url);

  const tmpDuration = Math.round(data.routes[0].duration / 60);
  const tmpMax = tmpDuration + Math.round((tmpDuration * 50) / 100);
  return {
    distance: data.routes[0].distance,
    duration: `${tmpDuration} - ${tmpMax}`,
    route: data.routes[0].geometry.coordinates,
  };
}

// get address with reverse geocoding
export async function getAddress(lng, lat) {
  const url = `${BASE_URL}/geocoding/v5/mapbox.places/${lng},${lat}.json?types=poi&access_token=${API_KEY}`;

  const data = await getRequest(url);

  if (data?.features < 1) {
    return {
      name: "Sorry",
      address: "Please choose another location!",
    };
  }

  let dataAddress = data.features[0].place_name.split(",");
  const name = dataAddress[0];
  dataAddress.splice(0, 1);

  return {
    name,
    address: dataAddress.toString(),
  };
}

// add route line to map
export function addRoute(map, route) {
  if (!map.getSource("route")) {
    map.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: route,
        },
      },
    });
    map.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#00D1FF",
        "line-width": 10,
      },
    });
  } else {
    map.getSource("route").setData({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: route,
      },
    });
  }
}
