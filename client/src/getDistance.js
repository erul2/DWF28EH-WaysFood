export default function getDistance(start, end) {
  if (start.lat === end.lat && start.long === end.long) {
    return 0;
  } else {
    const radlat1 = (Math.PI * start.lat) / 180;
    const radlat2 = (Math.PI * end.lat) / 180;
    const theta = start.long - end.long;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;

    dist = dist * 1.609344;

    return dist.toFixed(1);
  }

  function toRad(value) {
    return (value * Math.PI) / 100;
  }
}
