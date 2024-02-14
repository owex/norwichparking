'use client'

import React, { useEffect, useState } from 'react'
import xmljs from 'xml-js'
import PropTypes from 'prop-types'

const Parking = (props) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://datex.norfolk.cdmf.info/carparks/content.xml'
        )
        const xmlText = await response.text()
        const jsonData = xmljs.xml2json(xmlText, { compact: true, spaces: 2 })
        setData(JSON.parse(jsonData))
      } catch (error) {
        console.error('Error fetching', error)
      }
    }

    fetchData()
  }, [])
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

Parking.propTypes = {
  data: PropTypes.any,
}

export default Parking
