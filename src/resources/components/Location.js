import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { ClockIcon, MapPinIcon, StarIcon } from '@heroicons/react/20/solid'

import { useLocalStorage } from '@/resources/utils/hooks'
import ButtonDropdown from '@/resources/components/ButtonDropdown'

const Location = ({ location, colors, isClosed, onFavorite }) => {
  const percentage = isClosed ? 100 : location.percentageFull
  const color = isClosed ? '#ccc' : colors.text
  const [isFavorite, setFavorite] = useLocalStorage(
    `favorite-${location.id}`,
    false
  )

  const handleSetFavorite = () => {
    const newFavoriteState = !isFavorite
    setFavorite(newFavoriteState)
    onFavorite &&
      onFavorite({
        id: location.id,
        isFavorite: newFavoriteState,
      })
  }

  return (
    <li
      className={classNames(
        'relative col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow',
        {
          [colors.shadow]: true,
        }
      )}
    >
      {isClosed && (
        <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-gray-900/5 flex items-center justify-center bg-blue-50 bg-opacity-50 text-3xl">
          <span className="inline-flex items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-3xl font-medium text-gray-600"></span>
        </div>
      )}
      <div className="flex flex-col w-full items-center justify-between space-x-6 p-4">
        <div className="flex items-start justify-between space-x-3 w-full">
          <div className="flex w-2/3">
            <button
              onClick={handleSetFavorite}
              className={classNames('w-6 h-6', {
                'text-yellow-400': isFavorite,
                'text-gray-400': !isFavorite,
              })}
            >
              <StarIcon
                className="w-full h-full fill-current"
                aria-hidden="true"
              />
            </button>
            <div className="ml-2">
              <h3 className="truncate text-md font-bold text-gray-900">
                {location.name}
              </h3>
              <address className="text-sm truncate text-gray-500 break-words">
                {location.address}
              </address>
            </div>
          </div>
          <div className="flex flex-col items-end w-1/3 lg:w-auto">
            <div className="flex items-center gap-x-1 mb-1 text-xs font-medium text-gray-900">
              <div className="w-4 h-4 inline-block">
                <ClockIcon />
              </div>{' '}
              {location.timeAgo}
            </div>
            <div className="w-20">
              <svg
                viewBox="0 0 36 36"
                className={classNames({
                  [color]: true,
                  'fill-none': !isClosed,
                  'fill-current': isClosed,
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
                  strokeDasharray={`${percentage}, 100`}
                  d="M18 2.0845
a 15.9155 15.9155 0 0 1 0 31.831
a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text
                  x="18"
                  y="20.35"
                  className={classNames('percentage', {
                    'fill-white': isClosed,
                    'fill-black': !isClosed,
                  })}
                >
                  {isClosed ? 'Closed' : `${percentage}%`}
                </text>
              </svg>
            </div>
          </div>
        </div>
        <div className="mt-1 flex items-center w-full">
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
      <div>
        <div className="-mt-px w-full flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <div className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 px-4 text-sm font-semibold text-gray-900">
              <ButtonDropdown id="directions" items={location.mapUrls}>
                <MapPinIcon className="h-5 w-5" aria-hidden="true" />
                Directions
              </ButtonDropdown>
            </div>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <div className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 font-semibold text-gray-900">
              <span className="text-xl font-bold">
                {isClosed ? 'Closed' : location.spacesLeft}
              </span>
              {!isClosed && <span className="text-xs">Spaces Left</span>}
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

Location.propTypes = {}

export default Location
