export function timeAgo(timestamp) {
  const currentDate = new Date()
  const previousDate = new Date(timestamp)

  const timeDifference = currentDate.getTime() - previousDate.getTime()
  const minutes = Math.floor(timeDifference / 60000) // 1 minute = 60000 milliseconds

  if (minutes < 1) {
    return 'Just now'
  } else if (minutes === 1) {
    return '1 minute ago'
  } else if (minutes < 60) {
    return `${minutes} minutes ago`
  } else if (minutes < 120) {
    return '1 hour ago'
  } else if (minutes < 1440) {
    return `${Math.floor(minutes / 60)} hours ago`
  } else if (minutes < 2880) {
    return '1 day ago'
  } else {
    return `${Math.floor(minutes / 1440)} days ago`
  }
}

const timestamp = '2024-02-17T19:16:09'
console.log(timeAgo(timestamp))
