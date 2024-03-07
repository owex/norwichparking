import { useEffect } from 'react'

import React from 'react'
import PropTypes from 'prop-types'

const BuyMeACoffee = (props) => {
  // const
  useEffect(() => {
    const script = document.createElement('script')
    const div = document.getElementById('supportByBMC')
    script.setAttribute(
      'src',
      'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js'
    )
    script.setAttribute('data-name', 'BMC-Widget')
    script.setAttribute('data-cfasync', 'false')
    script.setAttribute('data-id', 'owenr')
    script.setAttribute('data-description', 'Support me on Buy me a coffee!')
    script.setAttribute(
      'data-message',
      'Help Support Norwich Parking by buying me a coffee!'
    )
    script.setAttribute('data-color', '#5F7FFF')
    script.setAttribute('data-position', 'Right')
    script.setAttribute('data-x_margin', '18')
    script.setAttribute('data-y_margin', '18')

    script.onload = function () {
      const evt = document.createEvent('Event')
      evt.initEvent('DOMContentLoaded', false, false)
      window.dispatchEvent(evt)
    }

    div.appendChild(script)
  }, [])

  return <div id="supportByBMC"></div>
}

BuyMeACoffee.propTypes = {}

export default BuyMeACoffee
