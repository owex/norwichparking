import React from 'react'
import PropTypes from 'prop-types'

import Footer from '@/resources/layout/Footer'
import Header from '@/resources/layout/Header'

const DefaultLayout = ({ children }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5">
      <Header />
      <div className="w-full">{children}</div>
      <Footer />
    </main>
  )
}

DefaultLayout.propTypes = {}

export default DefaultLayout
