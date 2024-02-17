import xmljs from 'xml-js'
import { getProperty } from 'dot-prop'
import { extraLocationData } from '@/resources/data/locations'
import { timeAgo } from '@/resources/utils/datetime'

const getPropText = (prop) => {
  if (prop && prop._text) {
    return prop._text
  }
  return ''
}

function extractCarParkInfo(data) {
  const { carParkOccupancy, occupiedSpaces, totalCapacity, carParkStatus } =
    data

  const spacesLeft = totalCapacity - occupiedSpaces
  const percentageFull = ((occupiedSpaces / totalCapacity) * 100).toFixed(0)
  const percentageEmpty = (100 - percentageFull).toFixed(0)

  return {
    spacesLeft,
    percentageFull,
    percentageEmpty,
    carParkStatus,
  }
}

const locationData = {
  CPN0001: {
    name: 'Anglia Square Multistorey',
    address: 'Anglia Square',
  },
  CPN0002: {
    name: 'St. Stephens',
    address: '',
  },
  CPN0003: {
    name: 'John Lewis,Ber Street, Norwich',
    address: 'John Lewis,Ber Street, Norwich',
  },
  CPN0004: {
    name: 'Castle Qtr Car Park 1',
    address: 'Rose Lane/Market Avenue, Norwich, NR1 3JQ',
    url: 'https://castlequarternorwich.co.uk/parking/',
  },
  CPN0005: {
    name: 'Castle Qtr Car Park 2',
    address: 'Farmers Avenue, Norwich, NR1 3DD',
    url: 'https://castlequarternorwich.co.uk/parking/',
  },
  CPN0006: {
    name: 'St. Giles',
    address: 'St. Giles Street, Norwich',
    url: 'https://www.norwich.gov.uk/directory_record/850/st_giles_multi-storey_car_park_nr2_1jl/category/133/all_car_parks',
  },
  CPN0007: {
    name: 'Rose Lane Car Park',
    address: 'Rose Lane, Mountergate, Norwich',
    url: 'https://www.norwich.gov.uk/directory_record/859/rose_lane_multi-storey_car_park_nr1_1py',
  },
  CPN0008: {
    name: 'St. Andrews',
    address: 'Duke St, Norwich',
  },
  CPN0009: {
    name: 'The Forum',
    address: 'Forum, Bethel Street, Norwich',
  },
  CPN0010: {
    name: 'Riverside, Koblenz Ave, Norwich',
    address: 'Riverside, Koblenz Ave, Norwich',
  },
  CPN0011: {
    name: 'Norwich Airport',
    address: 'Airport, Buck Courtney Cresent',
  },
  CPN0012: {
    name: 'Sprowston, Wroxham Road, Norwich',
    address: 'Sprowston, Wroxham Road, Norwich',
  },
  CPN0013: {
    name: 'Postwick, Yarmouth Road, Norwich',
    address: 'Postwick, Yarmouth Road, Norwich',
  },
  CPN0014: {
    name: 'Costessey, Long Lane, Norwich',
    address: 'Costessey, Long Lane, Norwich',
  },
  CPN0015: {
    name: 'Harford Park and Ride',
    address: 'Harford, Ipswich Road, Norwich',
  },
  CPN0016: {
    name: 'ThickThorn',
    address: 'ThickThorn, Norwich Road, Norwich',
  },
  CPN0017: {
    name: 'Chantry Place Shopping Centre',
    address: 'Chantry Place, Chapelfield Road',
  },
  C06391: {
    name: 'B&Q Car Park',
    address: 'B&Q Car Park, Boundary Road',
  },
}

function generateMapUrls(lat, lon) {
  const wazeUrl = `https://www.waze.com/ul?ll=${lat}%2C${lon}&z=17`
  const bingUrl = `http://bing.com/maps/default.aspx?rtp=~pos.${lat}_${lon}`
  const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`

  return [
    {
      label: 'Waze',
      href: wazeUrl,
      target: '_blank',
    },
    {
      label: 'Bing',
      href: bingUrl,
      target: '_blank',
    },
    {
      label: 'Google',
      href: googleUrl,
      target: '_blank',
    },
  ]
}

const transformer = (locations) => {
  return locations.map((location) => {
    // const headerInfo = getProperty(location, 'd2lm:headerInformation', {})
    const id = getProperty(location, '_attributes.id', '')

    const bodyInfo = getProperty(location, 'd2lm:situationRecord', {})

    const lonLat = getProperty(
      bodyInfo,
      'd2lm:groupOfLocations.d2lm:locationContainedInGroup.d2lm:pointByCoordinates.d2lm:pointCoordinates',
      {}
    )

    const newObject = {}
    Object.keys(bodyInfo)
      .filter((key) => key !== '_attributes')
      .forEach((key) => {
        const newKey = key
          .replace('d2lm:', '')
          .replace(`:${id}`, '')
          .replace('situationRecord', 'location')
        newObject[newKey] = getPropText(bodyInfo[key])
      })

    const additionalData =
      extraLocationData.find((data) => data.id === id) || {}

    const lon = getPropText(lonLat['d2lm:longitude'])
    const lat = getPropText(lonLat['d2lm:latitude'])

    return {
      id,
      mapUrls: generateMapUrls(lat, lon),
      ...(locationData[id] || {}),
      ...newObject,
      carParkIdentity: newObject.carParkIdentity.replace(`:${id}`, ''),
      ...extractCarParkInfo(newObject),
      ...additionalData,
      lon,
      lat,
      timeAgo: timeAgo(newObject.locationCreationTime),
    }
  })
}

export async function GET(req) {
  const response = await fetch(
    'https://datex.norfolk.cdmf.info/carparks/content.xml'
  )
  const xmlText = await response.text()
  const jsonData = xmljs.xml2json(xmlText, { compact: true, spaces: 2 })
  const data = JSON.parse(jsonData)

  const publicationTime = getProperty(
    data,
    'd2lm:d2LogicalModel.d2lm:payloadPublication.d2lm:publicationTime._text',
    []
  )
  const locations = getProperty(
    data,
    'd2lm:d2LogicalModel.d2lm:payloadPublication.d2lm:situation',
    []
  )
  return Response.json({ locations: transformer(locations), publicationTime })
}
