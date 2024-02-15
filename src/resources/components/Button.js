import React from 'react'
import PropTypes from 'prop-types'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'

const Button = ({ children, ...props }) => {
  return (
    <button
      type="button"
      {...props}
      className={classNames(
        'inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
        {
          'pointer-events-none opacity-40': props.disabled,
        }
      )}
    >
      <CheckCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
      {children}
    </button>
  )
}

Button.propTypes = {}

export default Button
