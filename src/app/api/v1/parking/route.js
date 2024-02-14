import xmljs from 'xml-js'
import { getProperty } from 'dot-prop'

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
    name: 'Castle Qtr',
    address: 'Rose Lane/Market Av',
  },
  CPN0005: {
    name: 'Castle Qtr',
    address: 'Farmers Avenue, Nor',
  },
  CPN0006: {
    name: 'St. Giles',
    address: 'St. Giles Street, Norwich',
  },
  CPN0007: {
    name: 'Rose Lane, Mountergate, Norwich',
    address: 'Rose Lane, Mountergate, Norwich',
  },
  CPN0008: {
    name: 'St. Andrews',
    address: 'Duke St, Norwich',
  },
  CPN0009: {
    name: 'Forum',
    address: 'Forum, Bethel Street, Norwich',
  },
  CPN0010: {
    name: 'Riverside, Koblenz Ave, Norwich',
    address: 'Riverside, Koblenz Ave, Norwich',
  },
  CPN0011: {
    name: 'Airport, Buck Courtney Cresent',
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
    name: 'Harford, Ipswich Road, Norwich',
    address: 'Harford, Ipswich Road, Norwich',
  },
  CPN0016: {
    name: 'ThickThorn, Norwich Road, Norwich',
    address: 'ThickThorn, Norwich Road, Norwich',
  },
  CPN0017: {
    name: 'Chantry Place, Chapelfield Road',
    address: 'Chantry Place, Chapelfield Road',
  },
  CPN0018: {
    name: '',
    address: '',
  },
}

const transformer = (locations) => {
  return locations.map((location) => {
    // const headerInfo = getProperty(location, 'd2lm:headerInformation', {})
    const id = getProperty(location, '_attributes.id', '')

    const bodyInfo = getProperty(location, 'd2lm:situationRecord', {})

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

    return {
      id,
      ...(locationData[id] || {}),
      ...newObject,
      carParkIdentity: newObject.carParkIdentity.replace(`:${id}`, ''),
      ...extractCarParkInfo(newObject),
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
