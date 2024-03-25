'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { getProperty } from 'dot-prop'

import { sortByProximity } from '@/resources/utils/sort'
import { timeAgo } from '@/resources/utils/datetime'
import { useLocalStorage } from '@/resources/utils/hooks'
import Alert from '@/resources/components/Alert'
import Button from '@/resources/components/Button'
import BuyMeACoffee from '@/resources/components/BuyMeACoffee'
import Location from '@/resources/components/Location'
import Select from '@/resources/components/Select'
import { centerPoint, getDistanceFromCenter } from '../utils/distance'

const getStatusColor = (percentage, isClosed) => {
  if (isClosed) {
    return {
      text: 'text-blue-400',
      bg: 'bg-blue-400',
      shadow: 'shadow-blue-400',
    }
  }

  if (percentage > 90) {
    return {
      text: 'text-red-400',
      bg: 'bg-red-400',
      shadow: 'shadow-red-400',
    }
  } else if (percentage > 75) {
    return {
      text: 'text-orange-400',
      bg: 'bg-orange-400',
      shadow: 'shadow-orange-400',
    }
  }
  return {
    text: 'text-green-400',
    bg: 'bg-green-400',
    shadow: 'shadow-green-400',
  }
}

const Parking = (props) => {
  const [data, setData] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [filterBy, setFilterBy] = useLocalStorage('filterBy', 'all')
  const [favorites, setFavorites] = useState([])
  const defaultLonLat = centerPoint
  const [latitude, setLatitude] = useState(defaultLonLat?.lat)
  const [longitude, setLongitude] = useState(defaultLonLat?.lon)
  const [usingUserLocation, setUsingUserLocation] = useState(false)

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude)
            setLongitude(position.coords.longitude)
            setUsingUserLocation(true)
          },
          (error) => {
            console.log('Defaulting to Norwich City Centre')
          }
        )
      }
    }

    getLocation()
  }, [])

  useEffect(() => {
    const getAllFavorites = () => {
      const favs = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.startsWith('favorite-')) {
          const id = key.replace('favorite-', '')
          const item = localStorage.getItem(key)
          if (item === 'true') {
            favs.push(id)
          }
        }
      }
      return favs
    }

    const favoritesFromLocalStorage = getAllFavorites()
    setFavorites(favoritesFromLocalStorage)
  }, [])

  const fetchData = useCallback(
    async (returnData = false) => {
      const currentTime = new Date().getTime()
      const oneMinute = 60 * 1000
      const disableRefresh =
        lastUpdated && currentTime - lastUpdated < oneMinute

      if (disableRefresh) {
        if (returnData) {
          return data
        }
      }

      try {
        const response = await fetch('/api/v1/parking')
        const newData = await response.json()
        setLastUpdated(new Date().getTime())
        if (!returnData) {
          setData(newData)
        } else {
          return newData
        }
      } catch (error) {
        console.error('Error fetching', error)
      }
    },
    [lastUpdated]
  )

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh data every minute
      fetchData()
    }, 60000)

    return () => clearInterval(interval)
  }, [fetchData])

  const locations = useMemo(() => {
    return [
      ...sortByProximity(
        [...getProperty(data, 'locations', [])].map((item) => {
          const isClosed = location.carParkStatus === 'carParkClosed'
          console.log('item', item)
          return {
            ...item,
            isClosed,
            distanceFromYou: getDistanceFromCenter(
              {
                lat: item.lat,
                lon: item.lon,
              },
              latitude,
              longitude
            ),
          }
        }),
        latitude,
        longitude
      ),
    ]
      .filter((location) => {
        const isClosed = location.carParkStatus === 'carParkClosed'
        if (
          filterBy === 'all' ||
          (filterBy === 'open' && !isClosed) ||
          (filterBy === 'closed' && isClosed) ||
          (filterBy === 'favorite' && favorites.includes(location.id))
        ) {
          return true
        }

        return false
      })
      .sort((a, b) => favorites.includes(b.id) - favorites.includes(a.id))
  }, [data, filterBy, favorites])

  const publicationTime = useMemo(() => {
    const dateString = getProperty(data, 'publicationTime', '')
    const date = new Date(dateString)
    if (date.toString() !== 'Invalid Date') {
      return timeAgo(date.toISOString())
    }
    return ''
  }, [data])

  const handleRefresh = async () => {
    const newData = await fetchData(true)
    setData(newData)
  }

  const handleFavoriteChange = ({ id, isFavorite }) => {
    if (isFavorite === true) {
      setFavorites([...favorites, id])
    } else {
      setFavorites([...favorites.filter((f) => f !== id)])
    }
  }

  return (
    <>
      <BuyMeACoffee />
      <div className="w-full">
        <div>
          <Alert fixed>
            Do not use this service whilst operating a vehicle.
          </Alert>
          <div className="mb-5">
            <div className="flex flex-col lg:flex-row lg:justify-between items-center w-full mx-auto py-5 lg:py-0">
              <div className="w-full lg:w-1/3 text-center lg:text-left"></div>
              <div className="flex items-center justify-center w-full lg:w-1/3">
                <div className="mr-2"></div>
                <div className="flex flex-col items-center justify-center my-2">
                  <h1 className="mb-2 text-3xl font-bold text-center">
                    Norwich Parking
                  </h1>
                  <p>
                    Get the latest live parking information for the Norwich
                    area.
                  </p>
                </div>
              </div>
              <div className="flex justify-end w-full lg:w-1/3">
                <div className="w-full lg:w-auto">
                  {publicationTime && (
                    <div className="mb-2 text-right text-xs">
                      Last updated: {publicationTime}
                    </div>
                  )}
                  <div className="flex items-end justify-between gap-x-5">
                    <Select
                      name="orderby"
                      label="Filter by"
                      value={filterBy}
                      onChange={(option) => setFilterBy(option.value)}
                      options={[
                        { label: 'All', value: 'all' },
                        { label: 'Open', value: 'open' },
                        { label: 'Closed', value: 'closed' },
                        { label: 'Favorite', value: 'favorite' },
                      ]}
                    />
                    <div className="flex justify-end space-x-5">
                      <div>
                        <Button
                          onClick={() => window.location.reload()}
                          icon="refresh"
                        >
                          Reload
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full hidden">
                  <label htmlFor="search" className="sr-only">
                    Search
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <input
                      id="search"
                      name="search"
                      className="block w-full rounded-md border-0 bg-white py-3 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xl sm:leading-6"
                      placeholder="Search"
                      type="search"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="min-h-screen">
            {!data && (
              <div className="flex flex-col justify-center items-center gap-y-5 py-10 lg:py-40">
                <svg
                  className="animate-spin -ml-1 mr-3 w-20 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx={12}
                    cy={12}
                    r={10}
                    stroke="currentColor"
                    strokeWidth={4}
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading Parking Data...
              </div>
            )}
            {locations.length === 0 && (
              <div className="flex flex-col justify-center items-center gap-y-5 py-10 lg:py-40">
                <p>No parking locations found</p>
              </div>
            )}
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {locations.map((location) => {
                const isClosed = location.carParkStatus === 'carParkClosed'
                const colors = getStatusColor(location.percentageFull, isClosed)

                return (
                  <Location
                    key={location.id}
                    location={location}
                    colors={colors}
                    isClosed={isClosed}
                    usingUserLocation={usingUserLocation}
                    onFavorite={handleFavoriteChange}
                  />
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

Parking.propTypes = {
  data: PropTypes.any,
}

export default Parking
