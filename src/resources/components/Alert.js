import { XCircleIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'

export default function Alert({ children, type = 'error', fixed = false }) {
  return (
    <div
      className={classNames('rounded-md p-4', {
        'bg-red-50': type === 'error',
        'bg-yellow-50': type === 'warning',
        'bg-green-50': type === 'success',
        'fixed bottom-0 left-0 w-full': fixed,
      })}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon
            className={classNames('h-5 w-5', {
              'text-red-400': type === 'error',
              'text-yellow-400': type === 'warning',
              'text-green-400': type === 'success',
            })}
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3
            className={classNames('text-sm font-medium', {
              'text-red-700': type === 'error',
              'text-yellow-700': type === 'warning',
              'text-green-700': type === 'success',
            })}
          >
            {children}
          </h3>
        </div>
      </div>
    </div>
  )
}
