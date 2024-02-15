import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from '../resources/components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Norwich Parking',
  description:
    'Get an overview of live parking spaces in Norwich before you leave.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
          <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        ) : null}
        {children}
      </body>
    </html>
  )
}
