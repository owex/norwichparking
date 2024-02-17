'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { getProperty } from 'dot-prop'
import classNames from 'classnames'

import Alert from '@/resources/components/Alert'
import Button from '@/resources/components/Button'
import { sortByProximity } from '../utils/sort'
import { timeAgo } from '../utils/datetime'
import ButtonDropdown from '../components/ButtonDropdown'
import {
  BellAlertIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/20/solid'

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

  const fetchData = useCallback(
    async (returnData = false) => {
      const currentTime = new Date().getTime()
      const oneMinute = 60 * 1000
      const disableRefresh =
        lastUpdated && currentTime - lastUpdated < oneMinute

      if (disableRefresh) {
        console.log('refresh disabled')
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
    return sortByProximity(
      [...getProperty(data, 'locations', [])].map((item) => {
        const isClosed = location.carParkStatus === 'carParkClosed'
        return {
          ...item,
          isClosed,
        }
      }),
      '52.628024',
      '1.293119'
    )
  }, [data])

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

  return (
    <div className="w-full">
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <div>
        <Alert>Do not use this service whilst operating a vehicle.</Alert>
        <div className="mb-5">
          <div className="flex flex-col lg:flex-row lg:justify-between items-center w-full mx-auto py-5 lg:py-0">
            <div className="w-full lg:w-1/3 text-center lg:text-left">
              {publicationTime && <div>Last updated: {publicationTime}</div>}
            </div>
            <div className="flex items-center justify-center w-full lg:w-1/3">
              <div className="w-10 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 64 64"
                >
                  <path
                    fill="#000"
                    fillRule="evenodd"
                    d="m13.98 27 7.517-10.35A4 4 0 0 1 24.734 15h20.06a4 4 0 0 1 3.709 2.5l3.845 9.5H54a8 8 0 0 1 8 8v5a4 4 0 0 1-4 4h-5.29a7.003 7.003 0 0 1-13.42 0H27.71a7.003 7.003 0 0 1-13.42 0H6a4 4 0 0 1-4-4v-5a8 8 0 0 1 8-8h3.98Zm.31 13a7.003 7.003 0 0 1 13.42 0h11.58a7.003 7.003 0 0 1 13.42 0H58v-5a4 4 0 0 0-4-4H10a4 4 0 0 0-4 4v5h8.29Zm33.743-13-3.238-8H24.734l-5.81 8h29.109ZM18 42a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm25 0a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="my-5 text-3xl font-bold text-center">
                Norwich Parking
              </h1>
            </div>
            <div className="flex justify-end w-full lg:w-1/3">
              <div className="w-full lg:w-auto">
                <Button onClick={handleRefresh} icon="refresh">
                  Refresh
                </Button>
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
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {locations.map((location) => {
            const isClosed = location.carParkStatus === 'carParkClosed'
            const colors = getStatusColor(location.percentageFull, isClosed)

            return (
              <li
                key={location.id}
                className={classNames(
                  'relative col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow',
                  {
                    [colors.shadow]: true,
                  }
                )}
              >
                {isClosed && (
                  <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-gray-900/5 flex items-center justify-center bg-blue-50 bg-opacity-50 text-3xl">
                    <span className="inline-flex items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-3xl font-medium text-gray-600">
                      Closed
                    </span>
                  </div>
                )}
                <div className="flex w-full items-center justify-between space-x-6 p-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between space-x-3">
                      <div>
                        <h3 className="truncate text-sm font-medium text-gray-900">
                          {location.name}
                        </h3>
                        <address className="text-sm truncate text-gray-500">
                          {location.address}
                        </address>
                      </div>
                      <div>
                        <div className="mb-1 text-xs font-medium text-gray-900">
                          {location.timeAgo}
                        </div>
                        <div className="w-20">
                          <svg
                            viewBox="0 0 36 36"
                            className={classNames('fill-none', {
                              [colors.text]: true,
                            })}
                          >
                            <path
                              className="circle-bg stroke-current"
                              d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="circle stroke-current"
                              strokeDasharray={`${location.percentageFull}, 100`}
                              d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text x="18" y="20.35" className="percentage">
                              {location.percentageFull}%
                            </text>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center space-x-2">
                      <span
                        className={classNames(
                          'inline-flex flex-shrink-0 items-center rounded-full px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset',
                          {
                            'bg-blue-50 ring-blue-600/20': isClosed,
                            'bg-green-50 ring-green-600/20': !isClosed,
                          }
                        )}
                      >
                        Status: {isClosed ? 'Closed' : 'Open'}
                      </span>
                      <span className="inline-flex flex-shrink-0 items-center rounded-full px-1.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
                        Capacity {location.totalCapacity}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="-mt-px w-full flex divide-x divide-gray-200">
                    <div className="flex w-0 flex-1">
                      <div className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 px-4 text-sm font-semibold text-gray-900">
                        <ButtonDropdown items={location.mapUrls}>
                          Directions
                        </ButtonDropdown>
                      </div>
                    </div>
                    <div className="-ml-px flex w-0 flex-1">
                      <div className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 font-semibold text-gray-900">
                        <span className="text-xl font-bold">
                          {location.spacesLeft}
                        </span>
                        <span className="text-xs">Spaces Left</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

Parking.propTypes = {
  data: PropTypes.any,
}

export default Parking
