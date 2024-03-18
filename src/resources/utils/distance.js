export const centerPoint = {
  lon: '1.293119',
  lat: '52.628024',
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371 // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180 // Latitude difference, converted to radians
  const dLon = ((lon2 - lon1) * Math.PI) / 180 // Longitude difference, converted to radians
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = earthRadius * c // Distance in kilometers
  return distance
}

// Function to format distance into a friendly output
function formatDistance(distance) {
  if (distance < 1) {
    return Math.round(distance * 1000) + 'm' // Convert to meters if less than 1 km
  } else {
    return distance.toFixed(1) + 'km' // Keep one decimal place for kilometers
  }
}

// Function to add distance property to each item in the array
export function getDistanceFromCenter(centerPoint, lat, lon) {
  const centerLat = centerPoint.lat
  const centerLon = centerPoint.lon
  const distance = calculateDistance(centerLat, centerLon, lat, lon)

  return formatDistance(distance)
}
