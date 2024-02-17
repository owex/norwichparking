function distance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180 // Convert degrees to radians
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in kilometers
  return distance
}

export function sortByProximity(items, targetLat, targetLon) {
  items.sort((item1, item2) => {
    const distance1 = distance(item1.lat, item1.lon, targetLat, targetLon)
    const distance2 = distance(item2.lat, item2.lon, targetLat, targetLon)
    return distance1 - distance2 // Sort by ascending distance
  })
  return items
}
