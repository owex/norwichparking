import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const ButtonDropdown = ({ id, items, children }) => {
  return (
    <Menu as="div" className="relative inline-block text-left w-full">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {children}
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 lg:w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {items &&
              items.map((item) => (
                <Menu.Item key={`id-${id}-${item.label}`}>
                  {({ active }) => (
                    <a
                      href={item.href}
                      target={item.target || '_self'}
                      {...(item.target === '_blank' && {
                        rel: 'noreferrer noopener',
                      })}
                      className={classNames('block px-4 py-2 text-sm', {
                        'bg-gray-100 text-gray-900': active,
                        'text-gray-700': !active,
                      })}
                    >
                      {item?.label || ''}
                    </a>
                  )}
                </Menu.Item>
              ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

ButtonDropdown.propTypes = {}

export default ButtonDropdown
