import Parking from './resources/blocks/Parking'
import Footer from './resources/layout/Footer'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5">
      <Parking />
      <Footer />
    </main>
  )
}

export const metadata = {
  title: 'Live Parking Spaces in Norwich | Norwich Parking',
  description:
    'Get an overview of live parking spaces in Norwich before you leave.',
}

