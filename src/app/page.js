import Parking from '@/resources/blocks/Parking'
import DefaultLayout from '@/resources/layout/DefaultLayout'

export default function Home() {
  return (
    <DefaultLayout>
      <Parking />
    </DefaultLayout>
  )
}

export const metadata = {
  title: 'Live Parking Spaces in Norwich | Norwich Parking',
  description:
    'Get an overview of live parking spaces in Norwich before you leave.',
}
